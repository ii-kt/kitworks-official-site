import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the KiT Works entrance", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>KiT Works｜デザインとフロントエンド開発<\/title>/i);
  assert.match(html, /aria-label="KiT Worksの案内を開く"/);
  assert.match(html, /Portfolio \/ 制作実績/);
  assert.match(html, /Capabilities \/ 対応領域/);
  assert.match(html, /Start a project \/ プロジェクト相談/);
  assert.match(html, /Independent design and development practice/);
  assert.doesNotMatch(html, /codex-preview|Building your site|Starter Project/i);
});

test("keeps the authored motion and accessibility system in source", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /type PanelPhase/);
  assert.match(page, /panel-loading-grid/);
  assert.match(page, /panel-frame-beam/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /className="kw95-window-control kw95-window-control--close"/);
  assert.doesNotMatch(page, /className="[^"]*kw95-window-control--close[^"]*beam-control[^"]*"/);
  assert.doesNotMatch(page, /goBack|refreshPanel|minimizeWindow|toggleWindowMaximize/);
  assert.match(css, /@property --beam-angle/);
  assert.match(css, /@keyframes tileResolve/);
  assert.match(css, /@keyframes controlBeam/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /@media \(max-width:700px\)/);
  assert.match(layout, /siteName: "KiT Works"/);
  assert.match(layout, /Zen_Kaku_Gothic_New/);
  assert.match(layout, /Shippori_Mincho/);
  assert.match(layout, /viewportFit: "cover"/);
  assert.match(css, /--kw95-safe-top:env\(safe-area-inset-top,0px\)/);
  assert.match(css, /\.kw95-window-position\s*\{[^}]*inset:var\(--kw95-safe-top\) var\(--kw95-safe-right\) var\(--kw95-safe-bottom\) var\(--kw95-safe-left\)/s);
});
