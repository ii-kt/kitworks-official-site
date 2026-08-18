import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const destinationIds = [
  "portfolio",
  "capabilities",
  "process",
  "about",
  "approach",
  "faq",
  "project",
  "availability",
  "system",
];

const [page, css, decisions, layout, research] = await Promise.all([
  readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  readFile(new URL("../PROJECT_DECISIONS.md", import.meta.url), "utf8"),
  readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  readFile(new URL("../WEB_LAYOUT_RESEARCH.md", import.meta.url), "utf8"),
]);

function between(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(startIndex, -1, `missing source boundary: ${start}`);
  assert.notEqual(endIndex, -1, `missing source boundary: ${end}`);
  return source.slice(startIndex, endIndex);
}

function occurrences(source, pattern) {
  return source.match(pattern)?.length ?? 0;
}

test("keeps the entrance as the only destination router", () => {
  const navModel = between(page, "const nav:", "const panelNames");
  const panelNames = between(page, "const panelNames", "const panelFiles");
  const panelFiles = between(page, "const panelFiles", "export default function Home");

  for (const id of destinationIds) {
    assert.equal(
      occurrences(navModel, new RegExp(`panel:\\s*"${id}"`, "g")),
      1,
      `${id} must occur exactly once in the entrance model`,
    );
    assert.match(panelNames, new RegExp(`^\\s*${id}:\\s*\\{`, "m"));
    assert.match(panelFiles, new RegExp(`^\\s*${id}:\\s*"`, "m"));
  }

  assert.equal(
    occurrences(navModel, /soon:\s*true/g),
    destinationIds.length - 1,
    "every entrance destination except System info must remain marked SOON",
  );
  assert.doesNotMatch(
    navModel,
    /\{ label: "System info"[^}]*soon:/,
    "System info must remain available without a SOON badge",
  );

  assert.match(page, /ref=\{screenRef\}[\s\S]*?openPanel\("index",\s*event\.currentTarget\)/);
  assert.match(page, /group\.links\.map\([\s\S]*?openPanel\(link\.panel,\s*event\.currentTarget\)/);
  assert.equal(occurrences(page, /openPanel\(/g), 2, "only the CRT and upper navigation may open a viewer");
  assert.doesNotMatch(page, /explorerDestinations|panelOrder|CommandButton|transitionToPanel/);
  assert.match(
    page,
    /className="operator-note"[\s\S]*?閉じると、入口から別の項目を選べます。/,
  );
});

test("renders one read-only Windows-style document with Close as its only chrome action", () => {
  const chromeClasses = [
    "kw95-window",
    "kw95-titlebar",
    "kw95-fileband",
    "kw95-content-pane",
    "kw95-decode-grid",
    "kw95-statusbar",
    "kw95-window-control--close",
  ];

  for (const className of chromeClasses) {
    assert.match(page, new RegExp(`className=[^\\n]*${className}`), `${className} markup is required`);
    assert.match(css, new RegExp(`\\.${className}(?:[\\s:{.,>\\[])`), `${className} styles are required`);
  }

  assert.match(page, /role="dialog"[\s\S]*?aria-modal="true"[\s\S]*?aria-labelledby="kw95-window-title"/);
  assert.match(page, /const panelChannels: Record<PanelId, string> = \{/);
  assert.match(page, /className="kw95-titlebar__signal"[\s\S]*?CH \{panelChannels\[displayedPanel\]\} \/ 10/);
  assert.match(page, /K:\\KIT-WORKS\\\{panelFiles\[displayedPanel\]\}/);
  assert.match(page, /className="kw95-fileband"[\s\S]*?<small lang="en">READ ONLY<\/small>/);
  assert.match(page, /className="kw95-window-control kw95-window-control--close"[\s\S]*?onClick=\{closePanel\}[\s\S]*?autoFocus/);
  assert.doesNotMatch(
    page,
    /className="[^"]*kw95-window-control--close[^"]*beam-control[^"]*"/,
    "Close uses its dedicated Windows control states rather than the generic content beam",
  );
  assert.equal(occurrences(page, /<button className="kw95-window-control /g), 1, "the title bar may expose only Close");

  const forbiddenUi = /kw95-(?:tree|toolbar|menu|addressbar|taskbar|start-menu|start-button|task-button|tray|help-dialog|explorer|window-control--min|window-control--max)/;
  assert.doesNotMatch(`${page}\n${css}`, forbiddenUi);
  assert.doesNotMatch(page, /goBack|replayWindow|refreshPanel|toggleTaskWindow|minimizeWindow|restoreWindow|toggleWindowMaximize|dragOffset|dragStateRef|windowState|isWindowMaximized|isStartMenuOpen|isMotionHelpOpen/);
  assert.doesNotMatch(page, /data-window-state|data-maximized|onDoubleClick|setPointerCapture|releasePointerCapture/);
});

test("does not allow cross-destination navigation after a document opens", () => {
  const panelComponent = between(page, "function PanelContent({", "function PanelKicker");
  const viewerMarkup = between(page, "{displayedPanel && (", "function PanelContent({");

  assert.doesNotMatch(panelComponent, /openPanel|href=|<a\b|CommandButton|PanelAction/);
  assert.doesNotMatch(viewerMarkup, /openPanel|href=|<nav\b/);
  assert.doesNotMatch(page, /対応領域を見る|進め方を見る|相談内容を作る/);
  assert.match(panelComponent, /<details[\s\S]*?<summary[\s\S]*?faq-answer/);
  assert.match(panelComponent, /<form\s+className="brief-form"\s+onSubmit=\{copyBrief\}>/);
});

test("preserves opening, closing, decoding, and entrance-origin motion without switching states", () => {
  const openDuration = page.match(/const\s+WINDOW_OPEN_MS\s*=\s*(\d+)\s*;/);

  assert.match(page, /type PanelPhase = "opening" \| "open" \| "closing"/);
  assert.ok(openDuration, "WINDOW_OPEN_MS must define the complete reveal budget");
  assert.ok(
    Number(openDuration[1]) >= 1200,
    "WINDOW_OPEN_MS must leave enough time for the window, border beam, and delayed decode tiles to settle",
  );
  assert.match(page, /setTimeout\(\(\) => setPanelPhase\("open"\),[\s\S]*?WINDOW_OPEN_MS\)/);
  assert.match(page, /setPanelPhase\("opening"\)/);
  assert.match(page, /setPanelPhase\("closing"\)/);
  assert.match(page, /className="panel-loading-grid kw95-decode-grid"/);
  assert.match(css, /\.kw95-overlay\[data-phase="opening"\] \.panel-frame-beam/);
  assert.match(css, /\.kw95-overlay\[data-phase="opening"\] \.kw95-decode-grid i/);
  assert.match(css, /\.kw95-overlay\[data-phase="opening"\] \.kw95-document \.panel-content-stage/);
  assert.match(css, /\.kw95-overlay\[data-phase="closing"\] \.kw95-window/);
  assert.doesNotMatch(`${page}\n${css}`, /switching-in|switching-out|kw95-window-minimize|kw95-window-restore/);

  assert.match(page, /const\s+screenRef\s*=\s*useRef/);
  assert.match(
    page,
    /source\?\.getBoundingClientRect\(\)\s*\?\?\s*screenRef\.current\?\.getBoundingClientRect\(\)/,
    "the clicked entrance item must define the reveal origin before the CRT fallback",
  );
  assert.doesNotMatch(
    page,
    /screenRef\.current\?\.getBoundingClientRect\(\)\s*\?\?\s*source\?\.getBoundingClientRect\(\)/,
    "the CRT must not override the clicked navigation item's origin",
  );
  assert.match(page, /"--origin-x":\s*origin\.x/);
  assert.match(page, /"--origin-y":\s*origin\.y/);
  assert.match(css, /var\(--origin-x\)/);
  assert.match(css, /var\(--origin-y\)/);
  assert.match(css, /\.is-panel-open\s+\.footer/);
  assert.match(css, /\.is-panel-open\s+\.scene-frame/);
});

test("preserves modal semantics, focus trapping, Escape, and focus return", () => {
  assert.match(page, /className="scene-frame"\s+inert=\{displayedPanel \? true : undefined\}\s+aria-hidden=/);
  assert.match(page, /className="footer"\s+inert=\{displayedPanel \? true : undefined\}\s+aria-hidden=/);
  assert.match(page, /lastTriggerRef\.current\?\.focus\(\)/);
  assert.match(page, /if \(event\.key === "Escape"\)[\s\S]*?closePanel\(\)/);
  assert.match(page, /querySelectorAll<HTMLElement>[\s\S]*?summary[\s\S]*?closest\("\[inert\]"\)/);
  assert.match(page, /event\.shiftKey[\s\S]*?event\.preventDefault\(\)[\s\S]*?last\.focus\(\)/);
  assert.match(page, /!event\.shiftKey[\s\S]*?event\.preventDefault\(\)[\s\S]*?first\.focus\(\)/);
});

test("keeps the CRT signal composited inside the photographed glass", () => {
  const crtMarkup = between(page, '<button\n            ref={screenRef}', "</button>");
  const mobileEntranceStyles = between(
    css,
    "@media (max-width:700px) {",
    "@media (max-width:700px), (hover:none), (pointer:coarse) {",
  );

  assert.match(page, /className="scene-surface"[\s\S]*?className="scene-image"[\s\S]*?className="screen"/);
  assert.match(crtMarkup, /data-screen-state=\{screenMode\}/);
  assert.match(crtMarkup, /className="screen__well"\s+aria-hidden="true"[\s\S]*?className="screen__phosphor"/);
  for (const layer of ["bars", "noise", "scanline", "shutoff", "edge", "glass", "rim", "beam"]) {
    assert.match(crtMarkup, new RegExp(`className="screen__${layer}"`), `${layer} CRT layer is required`);
  }
  assert.match(css, /\.screen\s*\{[^}]*left:44\.02%[^}]*top:52\.6%[^}]*width:11\.12%[^}]*height:14\.03%/);
  assert.match(css, /\.screen__well\s*\{[^}]*overflow:hidden[^}]*border-radius:inherit/);
  assert.match(css, /\.screen:active \.screen__phosphor/);
  assert.doesNotMatch(css, /\.screen:active\s*\{[^}]*scale\(/);
  assert.doesNotMatch(mobileEntranceStyles, /\.screen(?:-glow)?\s*\{/);
});

test("fills the usable viewport while preserving safe areas and the clicked reveal origin", () => {
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  for (const edge of ["top", "right", "bottom", "left"]) {
    assert.match(
      css,
      new RegExp(`--kw95-safe-${edge}:\\s*env\\(safe-area-inset-${edge},\\s*0px\\)`),
      `${edge} safe-area inset must be available to the fullscreen viewer`,
    );
  }

  assert.match(css, /\.kw95-workspace\s*\{[^}]*background:\s*var\(--kw95-gray\)/s);
  assert.match(
    css,
    /\.kw95-window-position\s*\{[^}]*inset:\s*var\(--kw95-safe-top\)\s+var\(--kw95-safe-right\)\s+var\(--kw95-safe-bottom\)\s+var\(--kw95-safe-left\)/s,
  );
  assert.match(
    css,
    /\.kw95-window\s*\{[^}]*transform-origin:\s*calc\(var\(--origin-x\)\s*-\s*var\(--kw95-safe-left\)\)\s*calc\(var\(--origin-y\)\s*-\s*var\(--kw95-safe-top\)\)/s,
    "the clicked viewport coordinate must be translated into the safe-area window coordinate system",
  );
  assert.match(css, /\.kw95-window \.panel-frame-beam\s*\{[^}]*inset:\s*0/);

  const mobileStyles = css;
  assert.match(
    mobileStyles,
    /\.kw95-window-position\s*\{[^}]*inset:\s*var\(--kw95-safe-top\)\s+var\(--kw95-safe-right\)\s+var\(--kw95-safe-bottom\)\s+var\(--kw95-safe-left\)[^}]*max-height:\s*none/s,
  );
  assert.doesNotMatch(mobileStyles, /kw95-tree|kw95-taskbar|overflow-x:\s*auto/);
  assert.doesNotMatch(css, /bottom:\s*max\(5px,\s*env\(safe-area-inset-bottom\)\)/);
  assert.doesNotMatch(css, /\.kw95-window-position\s*\{[^}]*(?:top:\s*7px|right:\s*5px|left:\s*5px)/s);
  assert.doesNotMatch(
    css,
    /\.kw95-window\s*\{[^}]*transform-origin:\s*50%\s+58%/s,
    "mobile must preserve the clicked origin instead of substituting a generic center point",
  );
});

test("uses authored Japanese web fonts and a cover viewport", () => {
  assert.match(layout, /import\s*\{[^}]*Shippori_Mincho[^}]*Zen_Kaku_Gothic_New[^}]*\}\s*from\s*"next\/font\/google"/s);
  assert.match(layout, /Zen_Kaku_Gothic_New\(\{[\s\S]*?variable:\s*"--font-jp-modern"/);
  assert.match(layout, /Shippori_Mincho\(\{[\s\S]*?variable:\s*"--font-jp-display"/);
  assert.match(layout, /<body className=\{`\$\{display\.variable\}[\s\S]*?\$\{japanese\.variable\}[\s\S]*?\$\{japaneseDisplay\.variable\}`\}>/);
  assert.match(layout, /export const viewport:\s*Viewport\s*=\s*\{[\s\S]*?viewportFit:\s*"cover"/);
  assert.match(css, /\.kw95-document\s*\{[^}]*font-family:\s*var\(--font-jp-modern\)/s);
  assert.match(css, /\.kw95-window \.kw95-document h1,[\s\S]*?font-family:\s*var\(--font-jp-display\),\s*var\(--font-jp-modern\)/);
});

test("keeps reduced-motion behavior for the fullscreen viewer", () => {
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);

  const reducedStyles = css.slice(css.search(/@media\s*\(prefers-reduced-motion:\s*reduce\)/));
  assert.match(reducedStyles, /kw95-window/);
  assert.match(reducedStyles, /kw95-decode-grid|panel-loading-grid/);
  assert.match(reducedStyles, /animation:\s*none\s*!important/);
  assert.match(reducedStyles, /transition-duration:\s*(?:0(?:s|ms)|\.[01]\d*s|\d+(?:\.\d+)?ms)\s*!important/);
  assert.match(decisions, /Mobile replaces hover/i);
  assert.match(decisions, /Reduced-motion keeps the same information and focus results/i);
});

test("keeps distinct destination content and only content-specific interactions", () => {
  const welcome = between(page, 'if (panel === "index")', 'if (panel === "portfolio")');
  const portfolio = between(page, 'if (panel === "portfolio")', 'if (panel === "capabilities")');
  const capabilities = between(page, 'if (panel === "capabilities")', 'if (panel === "process")');
  const process = between(page, 'if (panel === "process")', 'if (panel === "about")');
  const about = between(page, 'if (panel === "about")', 'if (panel === "approach")');
  const approach = between(page, 'if (panel === "approach")', 'if (panel === "faq")');
  const faq = between(page, 'if (panel === "faq")', 'if (panel === "project")');
  const project = between(page, 'if (panel === "project")', 'if (panel === "availability")');
  const availability = between(page, 'if (panel === "availability")', 'function PanelKicker');

  assert.equal(occurrences(capabilities, /^\s*\["\d{2}"/gm), 3);
  assert.equal(occurrences(process, /^\s*\["\d{2}"/gm), 5);
  assert.equal(occurrences(approach, /^\s*\["\d{2}"/gm), 3);
  assert.equal(occurrences(faq, /^\s*\["/gm), 4);
  assert.doesNotMatch(
    capabilities,
    /<article\b[^>]*\btabIndex=/,
    "capability descriptions are readable content, not keyboard controls",
  );
  assert.doesNotMatch(
    process,
    /<li\b[^>]*\btabIndex=/,
    "process steps are readable content, not keyboard controls",
  );
  assert.doesNotMatch(
    approach,
    /<article\b[^>]*\btabIndex=/,
    "approach descriptions are readable content, not keyboard controls",
  );
  assert.match(welcome, /className="panel-view business-view welcome-view"/);
  assert.match(welcome, /className="welcome-hero"[\s\S]*?<ServiceBrief\s*\/>/);
  assert.match(welcome, /className="business-proof"/);
  assert.match(portfolio, /className="panel-view business-view portfolio-view"/);
  assert.match(portfolio, /className="portfolio-hero"[\s\S]*?<PortfolioLedger\s*\/>/);
  assert.match(portfolio, /className="portfolio-principles"/);
  assert.match(page, /function ServiceBrief\(\)/);
  assert.match(about, /className="panel-view business-view about-view"/);
  assert.match(about, /className="about-hero"[\s\S]*?<ProfileSheet\s*\/>/);
  assert.match(about, /className="about-view__facts"/);
  assert.match(availability, /className="panel-view business-view availability-view"/);
  assert.match(availability, /className="availability-view__masthead"/);
  assert.match(availability, /className="availability-layout"/);
  assert.match(availability, /<ScheduleGate\s*\/>/);
  assert.match(availability, /className="availability-view__note"/);
  assert.match(page, /className="panel-view business-view system-view"[\s\S]*?<SystemArtifact\s*\/>/);
  assert.match(page, /className="system-facts"/);
  assert.doesNotMatch(
    page,
    /function\s+(?:SimpleView|WelcomeArtifact|ReservedArtifact|PracticeArtifact|AvailabilityArtifact|WelcomeProtocol|PracticeSheet|SignalGauge)\b/,
    "the retired shared simple layout and generic artifacts must not return",
  );

  for (const field of ["projectType", "timing", "budget", "outline"]) {
    assert.match(project, new RegExp(`name="${field}"`));
  }
  assert.match(page, /navigator\.clipboard\.writeText\(brief\)/);
  assert.match(project, /aria-live="polite"/);
  assert.doesNotMatch(project, /\bfetch\s*\(/);
});

test("uses a business-site information hierarchy inside every destination", () => {
  assert.match(page, /className="welcome-hero"[\s\S]*?className="business-proof"/);
  assert.match(page, /className="business-intro capabilities-intro"[\s\S]*?className="service-ledger"/);
  assert.match(page, /className="process-layout"[\s\S]*?className="process-list"/);
  assert.match(page, /className="approach-layout"[\s\S]*?className="principle-stack"/);
  assert.match(page, /className="faq-layout"[\s\S]*?className="faq-list"/);
  assert.match(page, /className="project-layout"[\s\S]*?className="brief-form"/);

  assert.match(css, /Business-document layout distilled from 23\+ current studio and service sites/);
  assert.match(css, /\.kw95-document \.business-view\s*\{[\s\S]*?grid-template-rows:auto 1fr/);
  assert.match(css, /\.kw95-document \.business-view \.panel-lead\s*\{[\s\S]*?max-width:640px/);
  assert.match(css, /\.welcome-hero\s*\{[\s\S]*?grid-template-columns:minmax\(0,7fr\) minmax\(320px,5fr\)/);
  assert.match(css, /@media \(max-width:760px\)[\s\S]*?\.welcome-hero,[\s\S]*?grid-template-columns:1fr/);
});

test("records at least 23 directly reviewed official business sites", () => {
  const officialSites = research.match(/^\d+\. \[[^\]]+\]\(https:\/\/[^)]+\)$/gm) ?? [];
  assert.ok(officialSites.length >= 23, `expected at least 23 official sites, found ${officialSites.length}`);
  assert.match(research, /first-view hierarchy/i);
  assert.match(research, /28–40 characters per line/i);
  assert.match(research, /seven columns[\s\S]*five/i);
  assert.match(decisions, /direct review of 32 official business sites/i);
});

test("documents the approved single-view contract", () => {
  assert.match(decisions, /single-purpose KiT Works viewer/i);
  assert.match(decisions, /entrance is the only place where destinations can be chosen/i);
  assert.match(decisions, /sole window-level operation is Close/i);
  assert.match(decisions, /FAQ disclosure and the local Project Brief form\/copy action/i);
  assert.match(decisions, /Removed operations must be deleted from markup, state, handlers, and CSS/i);
  assert.match(decisions, /Stamp Folder Animation/);
  assert.match(decisions, /AI Image Generation Reveal/);
  assert.match(decisions, /Border Beam UI/);
  assert.match(decisions, /Do not use Microsoft logos,[^\n]*official icons,[^\n]*sounds,[^\n]*wallpapers,[^\n]*copied source code/i);
  assert.match(decisions, /read-only visual and motion reference archive/i);
});
