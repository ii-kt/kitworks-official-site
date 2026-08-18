import { access, cp, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rolldown } from "rolldown";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const clientOutput = path.join(repositoryRoot, "dist", "client");
const serverOutput = path.join(repositoryRoot, "dist", "server");
const pagesOutput = path.join(repositoryRoot, "dist", "pages");
const pagesWorker = path.join(pagesOutput, "_worker.js");
const pagesWorkerEntry = path.join(
  repositoryRoot,
  "scripts",
  "cloudflare-pages-worker.mjs",
);
const workerDeployRedirect = path.join(repositoryRoot, ".wrangler", "deploy");

await Promise.all([
  access(path.join(clientOutput, "assets")),
  access(path.join(clientOutput, "scene-v2.png")),
  access(path.join(serverOutput, "index.js")),
  access(path.join(serverOutput, "ssr")),
]);

await rm(pagesOutput, { recursive: true, force: true });
await cp(clientOutput, pagesOutput, { recursive: true });
let rewrittenFontUrlCount = 0;
const workerBundle = await rolldown({
  input: pagesWorkerEntry,
  external: (id) => id.startsWith("node:"),
  plugins: [
    {
      name: "cloudflare-pages-font-urls",
      transform(code, id) {
        if (!id.includes(`${path.sep}dist${path.sep}server${path.sep}`)) {
          return null;
        }

        const transformed = code.replace(
          /url\((?:[A-Za-z]:)?[^)]*?[\\/]\.vinext[\\/]fonts[\\/]([^)]+?\.woff2)\)/g,
          (_match, relativeFontPath) => {
            rewrittenFontUrlCount += 1;
            return `url(/assets/_vinext_fonts/${relativeFontPath.replaceAll("\\", "/")})`;
          },
        );

        return transformed === code ? null : { code: transformed, map: null };
      },
    },
  ],
});
try {
  await workerBundle.write({
    codeSplitting: false,
    file: pagesWorker,
    format: "esm",
  });
} finally {
  await workerBundle.close();
}
const pagesWorkerSource = await readFile(pagesWorker, "utf8");

const machinePathProbe = pagesWorkerSource
  .replaceAll("\\/", "/")
  .replace(/%(?:2f|5c)/gi, "/")
  .replace(/%2e/gi, ".");
if (/[\\/]\.vinext[\\/]fonts[\\/]/i.test(machinePathProbe)) {
  throw new Error("A build-machine font path remains in the Pages Worker.");
}

const workerForUrlScan = pagesWorkerSource.replaceAll("\\/", "/");
const publicFontUrlPattern =
  /url\(\s*(?:\\?["'])?\/assets\/_vinext_fonts\/([^"'`()\s?#\\]+?(?:\.|%2e)woff2)(?=[?#"'`()\s\\]|$)/giu;
const encodedFontPaths = new Set(
  Array.from(workerForUrlScan.matchAll(publicFontUrlPattern), (match) => match[1]),
);
if (encodedFontPaths.size === 0) {
  throw new Error("No public Vinext font URLs were found in the Pages Worker.");
}

const publicFontRoot = path.resolve(
  pagesOutput,
  "assets",
  "_vinext_fonts",
);
await Promise.all(
  [...encodedFontPaths].map(async (encodedFontPath) => {
    const segments = encodedFontPath.split("/").map((encodedSegment) => {
      let segment;
      try {
        segment = decodeURIComponent(encodedSegment);
      } catch (error) {
        throw new Error(`Invalid encoded Vinext font URL: ${encodedFontPath}`, {
          cause: error,
        });
      }
      if (
        !segment ||
        segment === "." ||
        segment === ".." ||
        /[\\/\0:]/u.test(segment)
      ) {
        throw new Error(`Unsafe Vinext font URL: ${encodedFontPath}`);
      }
      return segment;
    });

    const fontFile = path.resolve(publicFontRoot, ...segments);
    const relative = path.relative(publicFontRoot, fontFile);
    if (
      relative === "" ||
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    ) {
      throw new Error(
        `Vinext font URL escapes its asset directory: ${encodedFontPath}`,
      );
    }

    let fontStat;
    try {
      fontStat = await stat(fontFile);
    } catch (error) {
      throw new Error(
        `Referenced Vinext font file is missing: ${encodedFontPath}`,
        { cause: error },
      );
    }
    if (!fontStat.isFile()) {
      throw new Error(
        `Referenced Vinext font path is not a file: ${encodedFontPath}`,
      );
    }
  }),
);
await rm(workerDeployRedirect, { recursive: true, force: true });

await Promise.all([
  access(path.join(pagesOutput, "assets")),
  access(path.join(pagesOutput, "scene-v2.png")),
  access(pagesWorker),
]);

console.log(
  `Cloudflare Pages output prepared at dist/pages (${rewrittenFontUrlCount} legacy font URLs normalized; ${encodedFontPaths.size} public font files verified).`,
);
