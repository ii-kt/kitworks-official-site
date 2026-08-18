import { access, cp, readFile, rm } from "node:fs/promises";
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
if (rewrittenFontUrlCount === 0) {
  throw new Error("No Vinext font URLs were prepared for Cloudflare Pages.");
}
const pagesWorkerSource = await readFile(pagesWorker, "utf8");
if (/[\\/]\.vinext[\\/]fonts[\\/]/.test(pagesWorkerSource)) {
  throw new Error("A build-machine font path remains in the Pages Worker.");
}
await rm(workerDeployRedirect, { recursive: true, force: true });

await Promise.all([
  access(path.join(pagesOutput, "assets")),
  access(path.join(pagesOutput, "scene-v2.png")),
  access(pagesWorker),
]);

console.log(
  `Cloudflare Pages output prepared at dist/pages (${rewrittenFontUrlCount} font URLs normalized).`,
);
