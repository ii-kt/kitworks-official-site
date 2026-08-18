"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent,
} from "react";

type PanelId =
  | "index"
  | "portfolio"
  | "capabilities"
  | "process"
  | "about"
  | "approach"
  | "faq"
  | "project"
  | "availability"
  | "system";

type PanelPhase = "opening" | "open" | "closing";
type OpenPanel = (panel: PanelId, trigger?: HTMLElement) => void;

const sparks = Array.from({ length: 44 }, (_, index) => ({
  left: 4 + ((index * 29) % 92),
  top: 13 + ((index * 47) % 65),
  delay: -((index * 0.37) % 7.1),
  drift: -28 + ((index * 19) % 56),
  size: index % 7 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
}));

const revealTiles = Array.from({ length: 48 }, (_, index) => ({
  delay: (index * 29 + (index % 7) * 37) % 370,
  glow: 0.18 + ((index * 13) % 46) / 100,
}));

const WINDOW_OPEN_MS = 1200;

const nav: Array<{
  title: string;
  titleJa: string;
  links: Array<{ label: string; labelJa: string; panel: PanelId; soon?: boolean }>;
}> = [
  {
    title: "Work",
    titleJa: "制作",
    links: [
      { label: "Portfolio", labelJa: "制作実績", panel: "portfolio", soon: true },
      { label: "Capabilities", labelJa: "対応領域", panel: "capabilities" },
      { label: "Process", labelJa: "進め方", panel: "process" },
    ],
  },
  {
    title: "Profile",
    titleJa: "プロフィール",
    links: [
      { label: "About", labelJa: "KiT Worksについて", panel: "about" },
      { label: "Approach", labelJa: "制作方針", panel: "approach" },
      { label: "FAQ", labelJa: "よくある質問", panel: "faq" },
    ],
  },
  {
    title: "Connect",
    titleJa: "ご相談",
    links: [
      { label: "Start a project", labelJa: "プロジェクト相談", panel: "project" },
      { label: "Availability", labelJa: "ご相談可能時期", panel: "availability" },
      { label: "System info", labelJa: "このサイトについて", panel: "system" },
    ],
  },
];

const panelNames: Record<PanelId, { en: string; ja: string; status: string }> = {
  index: { en: "Welcome", ja: "KiT Worksの案内", status: "SINGLE VIEW / CLOSE TO RETURN" },
  portfolio: { en: "Portfolio", ja: "制作実績", status: "RESERVED / NOT CONNECTED" },
  capabilities: { en: "Capabilities", ja: "対応領域", status: "THREE SIGNALS AVAILABLE" },
  process: { en: "Process", ja: "進め方", status: "BUILD SEQUENCE / 05 STEPS" },
  about: { en: "About KiT Works", ja: "KiT Worksについて", status: "INDEPENDENT PRACTICE / JAPAN" },
  approach: { en: "Approach", ja: "制作方針", status: "THREE OPERATING PRINCIPLES" },
  faq: { en: "FAQ", ja: "よくある質問", status: "OPEN A QUESTION" },
  project: { en: "Start a Project", ja: "プロジェクト相談", status: "LOCAL BRIEF / NO TRANSMISSION" },
  availability: { en: "Availability", ja: "ご相談可能時期", status: "SCHEDULE AFTER BRIEF" },
  system: { en: "System Info", ja: "このサイトについて", status: "CONCEPT TO CODE / ONE SYSTEM" },
};

const panelFiles: Record<PanelId, string> = {
  index: "WELCOME.TXT",
  portfolio: "PORTFOLIO.LNK",
  capabilities: "CAPABILITIES.HTM",
  process: "PROCESS.HTM",
  about: "ABOUT.HTM",
  approach: "APPROACH.HTM",
  faq: "FAQ.HLP",
  project: "START_PROJECT.EXE",
  availability: "AVAILABILITY.DAT",
  system: "SYSTEM_INFO.NFO",
};

const panelChannels: Record<PanelId, string> = {
  index: "01",
  portfolio: "02",
  capabilities: "03",
  process: "04",
  about: "05",
  approach: "06",
  faq: "07",
  project: "08",
  availability: "09",
  system: "10",
};

export default function Home() {
  const [screenOff, setScreenOff] = useState(false);
  const [displayedPanel, setDisplayedPanel] = useState<PanelId | null>(null);
  const [panelPhase, setPanelPhase] = useState<PanelPhase>("open");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [copyStatus, setCopyStatus] = useState("相談内容をコピー");
  const [copyPhase, setCopyPhase] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const [origin, setOrigin] = useState({ x: "50vw", y: "54vh" });
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const screenRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const motionTimerRef = useRef<number | null>(null);

  const clearMotionTimer = useCallback(() => {
    if (motionTimerRef.current !== null) {
      window.clearTimeout(motionTimerRef.current);
      motionTimerRef.current = null;
    }
  }, []);

  const closePanel = useCallback(() => {
    if (!displayedPanel) return;
    clearMotionTimer();
    setPanelPhase("closing");
    motionTimerRef.current = window.setTimeout(() => {
      setDisplayedPanel(null);
      setPanelPhase("open");
      window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
    }, prefersReducedMotion ? 70 : 460);
  }, [clearMotionTimer, displayedPanel, prefersReducedMotion]);

  const openPanel = useCallback<OpenPanel>((panel, trigger) => {
    if (displayedPanel) return;
    const source = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    clearMotionTimer();
    setScreenOff(false);
    const rect = source?.getBoundingClientRect() ?? screenRef.current?.getBoundingClientRect();
    if (rect) setOrigin({ x: `${rect.left + rect.width / 2}px`, y: `${rect.top + rect.height / 2}px` });
    lastTriggerRef.current = source;
    setDisplayedPanel(panel);
    setPanelPhase("opening");
    motionTimerRef.current = window.setTimeout(() => setPanelPhase("open"), prefersReducedMotion ? 90 : WINDOW_OPEN_MS);
  }, [clearMotionTimer, displayedPanel, prefersReducedMotion]);

  useEffect(() => () => {
    clearMotionTimer();
  }, [clearMotionTimer]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
        return;
      }

      if (event.key !== "Tab" || !displayedPanel || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => element.offsetParent !== null && !element.closest("[inert]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel, displayedPanel]);

  const parallax = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--cursor-x", `${event.clientX}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${event.clientY}px`);
    if (displayedPanel) return;
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    event.currentTarget.style.setProperty("--look-x", `${x * 8}px`);
    event.currentTarget.style.setProperty("--look-y", `${y * 5}px`);
  };

  const copyBrief = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCopyPhase("copying");
    setCopyStatus("メモを組み立てています");
    const data = new FormData(event.currentTarget);
    const brief = [
      "KiT Works / ご相談メモ",
      `相談内容：${data.get("projectType")}`,
      `希望時期：${data.get("timing")}`,
      `予算の目安：${data.get("budget")}`,
      "",
      "概要：",
      String(data.get("outline") || ""),
    ].join("\n");

    const [copyResult] = await Promise.allSettled([
      navigator.clipboard.writeText(brief),
      new Promise((resolve) => window.setTimeout(resolve, 620)),
    ]);

    try {
      if (copyResult.status === "rejected") throw copyResult.reason;
      setCopyPhase("copied");
      setCopyStatus("コピーしました");
      window.setTimeout(() => {
        setCopyPhase("idle");
        setCopyStatus("相談内容をコピー");
      }, 2200);
    } catch {
      setCopyPhase("error");
      setCopyStatus("コピーできませんでした");
      window.setTimeout(() => {
        setCopyPhase("idle");
        setCopyStatus("相談内容をコピー");
      }, 2200);
    }
  };

  const experienceStyle = {
    "--origin-x": origin.x,
    "--origin-y": origin.y,
  } as CSSProperties;
  const screenMode = screenOff
    ? "off"
    : displayedPanel
      ? panelPhase === "closing"
        ? "returning"
        : panelPhase === "opening"
          ? "launching"
          : "linked"
      : "idle";

  return (
    <main
      className={`experience ${screenOff ? "is-screen-off " : ""}${displayedPanel ? "is-panel-open " : ""}`}
      onPointerMove={parallax}
      style={experienceStyle}
    >
      <div className="scene-frame" inert={displayedPanel ? true : undefined} aria-hidden={displayedPanel ? true : undefined}>
        <div className="scene-surface">
          <div className="scene-image" />
          <div className="sky-cycle" />
          <div className="screen-glow" />
          <button
            ref={screenRef}
            className="screen"
            data-screen-state={screenMode}
            onClick={(event) => openPanel("index", event.currentTarget)}
            onContextMenu={(event) => {
              event.preventDefault();
              setScreenOff((value) => !value);
            }}
            aria-label="KiT Worksの案内を開く"
            tabIndex={displayedPanel ? -1 : 0}
          >
            <span className="screen__well" aria-hidden="true">
              <span className="screen__phosphor">
                <span className="screen__bars" />
                <span className="screen__noise" />
                <span className="screen__scanline" />
                <span className="screen__shutoff" />
              </span>
              <span className="screen__edge" />
              <span className="screen__glass" />
              <span className="screen__rim" />
              <span className="screen__beam" />
            </span>
          </button>
        </div>
      </div>

      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="cursor-aura" aria-hidden="true" />

      <div className="sparks" aria-hidden="true">
        {sparks.map((spark, index) => (
          <i
            key={index}
            style={
              {
                "--x": `${spark.left}%`,
                "--y": `${spark.top}%`,
                "--delay": `${spark.delay}s`,
                "--drift": `${spark.drift}px`,
                "--size": `${spark.size}px`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <header className="footer" inert={displayedPanel ? true : undefined} aria-hidden={displayedPanel ? true : undefined}>
        <section className="identity">
          <button
            className="logo"
            onClick={() => setScreenOff(false)}
            tabIndex={displayedPanel ? -1 : 0}
            aria-label="KiT Works ホーム"
          >
            KiT Works
          </button>
          <p lang="en">
            Independent design and development practice.
            <br />From concept to interface, built as one system.
          </p>
          <small lang="en">&copy; 2026 KIT WORKS / INDEPENDENT PRACTICE</small>
        </section>

        <nav className="footer-nav" aria-label="KiT Works ナビゲーション">
          {nav.map((group) => (
            <div className="nav-group" key={group.title}>
              <p>
                <span lang="en">{group.title}</span>
                <small lang="ja">{group.titleJa}</small>
              </p>
              {group.links.map((link) => (
                <button
                  className={`nav-link ${link.soon ? "nav-link--soon" : ""}`}
                  onClick={(event) => openPanel(link.panel, event.currentTarget)}
                  tabIndex={displayedPanel ? -1 : 0}
                  aria-label={`${link.label} / ${link.labelJa}`}
                  key={link.label}
                >
                  <span className="nav-link__label" aria-hidden="true">
                    <span className="nav-link__en" lang="en">{link.label}</span>
                    <span className="nav-link__ja" lang="ja">{link.labelJa}</span>
                  </span>
                  {link.soon && <span className="nav-link__badge" aria-hidden="true">SOON</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </header>

      {displayedPanel && (
        <section
          className="panel-shell kw95-overlay"
          data-phase={panelPhase}
          data-panel={displayedPanel}
          data-reduced-motion={prefersReducedMotion ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-labelledby="kw95-window-title"
          aria-busy={panelPhase !== "open"}
          lang="ja"
          ref={panelRef}
        >
          <div className="kw95-veil" aria-hidden="true" />

          <div className="kw95-workspace">
            <div className="kw95-window-position">
              <article className="kw95-window">
                <span className="panel-frame-beam" aria-hidden="true" />

                <header className="kw95-titlebar">
                  <span className="kw95-app-icon" aria-hidden="true">K</span>
                  <span className="kw95-titlebar__title" id="kw95-window-title">KiT Works — {panelNames[displayedPanel].en.toUpperCase()}</span>
                  <span className="kw95-titlebar__signal" lang="en"><i /> CH {panelChannels[displayedPanel]} / 10</span>
                  <div className="kw95-window-controls">
                    <button className="kw95-window-control kw95-window-control--close" type="button" onClick={closePanel} autoFocus aria-label="閉じる">×</button>
                  </div>
                </header>

                <div className="kw95-fileband" aria-label="表示中のファイル">
                  <span className="kw95-fileband__icon" aria-hidden="true">K</span>
                  <span>K:\KIT-WORKS\{panelFiles[displayedPanel]}</span>
                  <small lang="en">READ ONLY</small>
                </div>

                <div className="kw95-content-pane" aria-busy={panelPhase !== "open"}>
                  <div className="panel-loading-grid kw95-decode-grid" aria-hidden="true">
                    {revealTiles.map((tile, index) => (
                      <i
                        key={index}
                        style={
                          {
                            "--tile-delay": `${tile.delay}ms`,
                            "--tile-glow": tile.glow,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </div>
                  <div className="panel-body kw95-document">
                    <div className="panel-content-stage" key={displayedPanel}>
                      <PanelContent
                        panel={displayedPanel}
                        copyBrief={copyBrief}
                        copyStatus={copyStatus}
                        copyPhase={copyPhase}
                      />
                    </div>
                  </div>
                </div>

                <footer className="kw95-statusbar">
                  <span><i className="kw95-status-led" /> <b aria-live="polite">{panelFiles[displayedPanel]} — {panelPhase === "open" ? "READY" : "OPENING"}</b></span>
                  <span><b>{panelNames[displayedPanel].status}</b><span className={`kw95-status-progress ${panelPhase !== "open" ? "is-active" : ""}`} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</span></span>
                  <span lang="en">ESC / CLOSE</span>
                </footer>
              </article>
            </div>

          </div>
        </section>
      )}
    </main>
  );
}

function PanelContent({
  panel,
  copyBrief,
  copyStatus,
  copyPhase,
}: {
  panel: PanelId;
  copyBrief: (event: FormEvent<HTMLFormElement>) => void;
  copyStatus: string;
  copyPhase: "idle" | "copying" | "copied" | "error";
}) {
  if (panel === "index") {
    return (
      <div className="panel-view business-view welcome-view">
        <PanelKicker en="WELCOME TO KIT WORKS" ja="KiT Worksへようこそ" />
        <section className="welcome-hero">
          <div className="welcome-hero__copy">
            <p className="editorial-eyebrow" lang="en">INDEPENDENT WEB DESIGN &amp; DEVELOPMENT</p>
            <h1 id="panel-title">デザインと実装を、<br /><em>ひとつの仕事に。</em></h1>
            <p className="panel-lead">KiT Worksは、日本を拠点に、Webサイトの構成・ビジュアル・モーション・フロントエンド実装を一人でつなぐ個人事業です。</p>
          </div>
          <ServiceBrief />
        </section>
        <section className="business-proof" aria-label="KiT Worksの事業特性">
          <article><span>01 / DIRECT</span><h2>担当者が変わらない</h2><p>最初の相談から公開まで、同じ一人が意図を引き継ぎます。</p></article>
          <article><span>02 / INTEGRATED</span><h2>見た目と動きを一緒に設計</h2><p>静止画で終わらせず、操作と実装条件まで含めて考えます。</p></article>
          <article><span>03 / MADE IN JAPAN</span><h2>日本語で直接相談できる</h2><p>要件が固まっていない段階から、目的と優先順位を整理します。</p></article>
        </section>
        <p className="operator-note"><span lang="en">OPERATOR NOTE</span> 閉じると、入口から別の項目を選べます。</p>
      </div>
    );
  }

  if (panel === "portfolio") {
    return (
      <div className="panel-view business-view portfolio-view">
        <PanelKicker en="MODULE 00 / RESERVED" ja="制作実績" />
        <section className="portfolio-hero">
          <div className="portfolio-hero__copy">
            <p className="editorial-eyebrow" lang="en">PORTFOLIO / REMOTE DESTINATION</p>
            <h1 id="panel-title">制作実績は、<br /><em>現在準備中です。</em></h1>
            <p className="panel-lead">ポートフォリオは別サイトとして公開予定です。完成後は、背景・担当範囲・制作過程・結果まで読める事例として、この入口へ接続します。</p>
            <p className="portfolio-release"><span>RELEASE POLICY</span> 架空の制作実績ではなく、公開できる仕事だけを掲載します。</p>
          </div>
          <PortfolioLedger />
        </section>
        <section className="portfolio-principles" aria-label="掲載予定の情報">
          <article><span>01 / CONTEXT</span><h2>背景と目的</h2><p>何を変えるための仕事だったか。</p></article>
          <article><span>02 / ROLE</span><h2>担当した範囲</h2><p>設計・デザイン・実装のどこを担ったか。</p></article>
          <article><span>03 / RESULT</span><h2>過程と結果</h2><p>判断と検証が、どんな成果へつながったか。</p></article>
        </section>
      </div>
    );
  }

  if (panel === "capabilities") {
    const capabilities = [
      ["01", "Web Direction & Design", "Webサイトの設計とデザイン", "目的と情報を整理し、サイト全体の構成、言葉の優先順位、ビジュアル、レスポンシブまで設計します。", "CONCEPT / IA / WIREFRAME / VISUAL", "新規サイト、リニューアル、ブランドの入口"],
      ["02", "Front-end Development", "フロントエンド開発", "デザインの意図を保ったまま、表示速度・アクセシビリティ・更新性に配慮して公開できる形へ実装します。", "INTERFACE / RESPONSIVE / CODE", "デザイン実装、既存サイト改善、UI構築"],
      ["03", "Motion & Interaction", "モーションと操作体験", "ホバー、押下、スクロール、画面遷移を役割ごとに設計し、触った感触まで一つの世界観に整えます。", "MOTION / PROTOTYPE / EXPERIENCE", "コンセプトサイト、キャンペーン、試作"],
    ];
    return (
      <div className="panel-view business-view capabilities-view">
        <PanelKicker en="MODULE 01 / CAPABILITIES" ja="対応領域" />
        <section className="business-intro capabilities-intro">
          <h1 id="panel-title">構想から公開まで、<br /><em>分断しない。</em></h1>
          <div>
            <p className="panel-lead">見た目だけ、コードだけではなく、目的から操作感までを一本につなげます。必要な範囲だけを切り出した参加も相談できます。</p>
            <dl className="intro-facts"><div><dt>STRUCTURE</dt><dd>Independent / Direct</dd></div><div><dt>CORE</dt><dd>Design + Code + Motion</dd></div></dl>
          </div>
        </section>
        <div className="service-ledger">
          {capabilities.map(([number, en, ja, text, output, fit]) => (
            <article className="service-row" key={number}>
              <span>{number}</span>
              <h2><small lang="en">{en}</small>{ja}</h2>
              <p>{text}</p>
              <dl><div><dt>DELIVERABLES</dt><dd>{output}</dd></div><div><dt>GOOD FOR</dt><dd>{fit}</dd></div></dl>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (panel === "process") {
    const steps = [
      ["01", "Discover", "目的を知る", "目的・対象・条件を確認します。"],
      ["02", "Define", "方針を決める", "方向性・範囲・判断基準を整理します。"],
      ["03", "Design", "設計する", "構成・ビジュアル・動きを具体化します。"],
      ["04", "Build", "実装する", "動作確認と調整を重ねて仕上げます。"],
      ["05", "Launch", "公開する", "納品・引き継ぎ・次の対応を整理します。"],
    ];
    return (
      <div className="panel-view business-view process-view">
        <PanelKicker en="MODULE 02 / BUILD SEQUENCE" ja="制作の進め方" />
        <div className="process-layout">
          <section className="process-intro">
            <p className="editorial-eyebrow" lang="en">ONE CONTACT / FIVE CLEAR STAGES</p>
            <h1 id="panel-title">判断を共有し、<br /><em>完成まで進む。</em></h1>
            <p className="panel-lead">各段階で確認する内容と次の判断を明確にします。途中で担当が変わらないため、最初の意図を保ったまま進められます。</p>
          </section>
          <ol className="process-list">
            {steps.map(([number, en, ja, text]) => (
              <li key={number}>
                <b>{number}</b>
                <span><small lang="en">{en}</small>{ja}</span>
                <p>{text}</p>
                <i className="process-node" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (panel === "about") {
    return (
      <div className="panel-view business-view about-view">
        <PanelKicker en="PROFILE / ABOUT" ja="KiT Worksについて" />
        <section className="about-hero">
          <div className="about-hero__copy">
            <p className="editorial-eyebrow" lang="en">INDEPENDENT PRACTICE / JAPAN</p>
            <h1 id="panel-title">小さな体制で、<br /><em>深く関わる。</em></h1>
            <p className="panel-lead">KiT Worksは、私一人が運営するデザイン／開発事業です。相談、設計、デザイン、実装、公開まで、同じ視点で判断をつなぎます。</p>
          </div>
          <ProfileSheet />
        </section>
        <div className="about-view__facts" aria-label="KiT Worksの仕事上の約束">
          <span><small>01 / CONTINUITY</small><b>NO HAND-OFF</b><em>判断と意図を途中で途切れさせない</em></span>
          <span><small>02 / PRACTICE</small><b>DESIGN + CODE</b><em>見た目と実装を同じ机で考える</em></span>
          <span><small>03 / DIALOGUE</small><b>PLAIN JAPANESE</b><em>専門用語を整理しながら進める</em></span>
        </div>
      </div>
    );
  }

  if (panel === "approach") {
    const principles = [
      ["01", "Concept before decoration", "装飾より、コンセプト", "すべての見た目を、ひとつの明確な意図につなげます。"],
      ["02", "Design and code together", "デザインと実装を分けない", "実装条件を踏まえながら、動きと操作まで設計します。"],
      ["03", "Small practice, direct line", "直接やり取りする", "担当の引き継ぎを挟まず、意図を保ったまま進めます。"],
    ];
    return (
      <div className="panel-view business-view approach-view">
        <PanelKicker en="PROFILE / APPROACH" ja="制作方針" />
        <div className="approach-layout">
          <section className="approach-intro">
            <p className="editorial-eyebrow" lang="en">DECISIONS BEFORE DECORATION</p>
            <h1 id="panel-title">見た目の先まで、<br /><em>設計する。</em></h1>
            <p className="panel-lead">「おしゃれだから」だけで決めず、誰に何を伝え、どう動いてほしいかを基準にします。</p>
          </section>
          <div className="principle-stack">
            {principles.map(([number, en, ja, text]) => (
              <article key={number}>
                <b>{number}</b>
                <div><small lang="en">{en}</small><h2>{ja}</h2><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (panel === "faq") {
    const questions = [
      ["どんな案件を相談できますか？", "ブランドサイト、ポートフォリオ、プロダクトUI、キャンペーンページ、インタラクティブなWeb表現などをご相談いただけます。"],
      ["デザインと実装をまとめて依頼できますか？", "はい。構成とビジュアル設計から、フロントエンド実装まで一貫して対応します。"],
      ["制作期間はどれくらいですか？", "内容や規模によって異なります。目的、素材、必要な機能を確認したうえで進行案を整理します。"],
      ["既存チームのプロジェクトにも参加できますか？", "体制や必要な役割を伺い、デザイン設計、フロントエンド実装、プロトタイプ制作など、適した参加方法をご提案します。"],
    ];
    return (
      <div className="panel-view business-view faq-view">
        <PanelKicker en="PROFILE / HELP" ja="よくある質問" />
        <div className="faq-layout">
          <section className="faq-intro">
            <p className="editorial-eyebrow" lang="en">BEFORE WE START</p>
            <h1 id="panel-title">ご相談前の、<br /><em>よくある質問。</em></h1>
            <p className="panel-lead">相談内容がまだ曖昧でも問題ありません。最初に聞かれることを、短くまとめています。</p>
            <span className="faq-counter" lang="en">04 / QUESTIONS</span>
          </section>
          <div className="faq-list">
            {questions.map(([question, answer], index) => (
              <details key={question}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true" /></summary>
                <div className="faq-answer"><p>{answer}</p></div>
              </details>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (panel === "project") {
    return (
      <div className="panel-view business-view project-view">
        <PanelKicker en="CONNECT / NEW PROJECT" ja="プロジェクト相談" />
        <div className="project-layout">
          <section className="project-intro">
            <p className="editorial-eyebrow" lang="en">START WITH A SMALL BRIEF</p>
            <h1 id="panel-title">まず、相談内容を<br /><em>整理する。</em></h1>
            <p className="panel-lead">項目を選んで概要を入力すると、相談用のメモをコピーできます。要件が固まっていなくても、現状と目的が分かれば十分です。</p>
            <div className="local-note" lang="en"><i /> LOCAL ONLY <small>この画面から外部へ送信されません</small></div>
            <p className="project-next"><span lang="en">NEXT STEP</span> コピーしたメモを送る連絡窓口は準備中です。公開後も、この画面が相談内容をまとめる入口になります。</p>
          </section>
          <form className="brief-form" onSubmit={copyBrief}>
            <label><span>01 / 相談内容</span><select name="projectType" defaultValue="ウェブサイト"><option>ウェブサイト</option><option>インタラクティブ体験</option><option>プロダクト／UIデザイン</option><option>クリエイティブ・プロトタイプ</option><option>その他</option></select></label>
            <label><span>02 / 希望時期</span><select name="timing" defaultValue="相談して決めたい"><option>できるだけ早く</option><option>1〜2か月以内</option><option>3〜6か月以内</option><option>相談して決めたい</option></select></label>
            <label><span>03 / 予算の目安</span><select name="budget" defaultValue="相談して決めたい"><option>相談して決めたい</option><option>30万円未満</option><option>30万〜80万円</option><option>80万円以上</option></select></label>
            <label className="brief-form__outline"><span>04 / 概要</span><textarea name="outline" rows={4} placeholder="作りたいもの、目的、現在の状況などをご記入ください。" /></label>
            <button className="panel-action beam-control" data-state={copyPhase} type="submit" disabled={copyPhase === "copying"}>
              <span aria-live="polite">{copyStatus}</span><i>{copyPhase === "copying" ? "···" : "→"}</i>
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (panel === "availability") {
    return (
      <div className="panel-view business-view availability-view">
        <div className="availability-view__masthead">
          <PanelKicker en="CONNECT / AVAILABILITY" ja="ご相談可能時期" />
          <span className="availability-view__state"><i /> MANUAL REVIEW</span>
        </div>
        <div className="availability-layout">
          <section className="availability-view__intro">
            <p className="editorial-eyebrow" lang="en">SCHEDULE FOLLOWS THE BRIEF</p>
            <h1 id="panel-title">内容を確認してから、<br /><em>日程をご案内。</em></h1>
            <p className="panel-lead">案件ごとに必要な時間が異なるため、空き枠だけを先に販売しません。目的、範囲、希望時期を確認して対応可否をお伝えします。</p>
          </section>
          <ScheduleGate />
        </div>
        <p className="availability-view__note"><span lang="en">MANUAL CONFIRMATION</span> 自動で空き状況を表示せず、内容ごとに個別確認します。</p>
      </div>
    );
  }

  return (
    <div className="panel-view business-view system-view">
      <PanelKicker en="KIT WORKS / SYSTEM INFO" ja="このサイトについて" />
      <div className="system-view__composition">
        <section className="system-view__intro">
          <p className="editorial-eyebrow" lang="en">LIVE SITE / WORKING SPECIMEN</p>
          <h1 id="panel-title">このサイト自体が、<br /><em>制作姿勢の見本。</em></h1>
          <p className="panel-lead">自然の中に置かれた旧いコンピューターを入口に、現代的な文字組みと操作感へ接続しています。コンセプトから実装までを一つの体験として組み立てました。</p>
        </section>
        <SystemArtifact />
      </div>
      <section className="system-facts" aria-label="このサイトの設計要素">
        <article><span>01</span><b>CONCEPT</b><p>自然と技術が交差する入口</p></article>
        <article><span>02</span><b>VISUAL</b><p>旧Windows外枠と現代の本文</p></article>
        <article><span>03</span><b>MOTION</b><p>押下位置から展開する遷移</p></article>
        <article><span>04</span><b>CODE</b><p>レスポンシブと操作性を実装</p></article>
      </section>
    </div>
  );
}

function PanelKicker({ en, ja }: { en: string; ja: string }) {
  return <p className="panel-kicker"><span lang="en">{en}</span><i aria-hidden="true" /><span lang="ja">{ja}</span></p>;
}

function ServiceBrief() {
  return (
    <aside className="service-brief" aria-label="KiT Worksの対応概要">
      <header><span lang="en">SERVICES AT A GLANCE</span><small>依頼できること</small></header>
      <ol>
        <li><span>01</span><div><b>Direction &amp; Web Design</b><p>目的整理・構成・ビジュアル設計</p></div></li>
        <li><span>02</span><div><b>Front-end Development</b><p>レスポンシブ・公開可能な実装</p></div></li>
        <li><span>03</span><div><b>Motion &amp; Interaction</b><p>ホバー・押下・スクロール・遷移</p></div></li>
      </ol>
      <footer><i /> ONE CONTACT / CONCEPT TO RELEASE</footer>
    </aside>
  );
}

function PortfolioLedger() {
  return (
    <aside className="portfolio-ledger" aria-label="ポートフォリオ公開準備状況">
      <span className="editorial-object-label" lang="en">RELEASE LEDGER / MODULE 00</span>
      <dl>
        <div><dt>STATUS</dt><dd><i /> PREPARING</dd></div>
        <div><dt>FORMAT</dt><dd>SEPARATE SITE</dd></div>
        <div><dt>ROUTE</dt><dd>RESERVED</dd></div>
        <div><dt>RELEASE</dt><dd>TO BE ANNOUNCED</dd></div>
      </dl>
      <div className="portfolio-ledger__stamp"><span>CONNECTION</span><b>RESERVED</b><small>00 / 00</small></div>
    </aside>
  );
}

function ProfileSheet() {
  return (
    <aside className="profile-sheet" aria-label="KiT Worksの事業プロフィール">
      <header><span lang="en">PRACTICE PROFILE</span><small>事業概要</small></header>
      <dl>
        <div><dt>FORM</dt><dd>個人事業</dd></div>
        <div><dt>BASE</dt><dd>Japan</dd></div>
        <div><dt>ROLE</dt><dd>Direction / Design / Development</dd></div>
        <div><dt>CONTACT</dt><dd>制作者本人が直接対応</dd></div>
      </dl>
      <p><span>01</span> 目的を整理する <i /> <span>02</span> 形にする <i /> <span>03</span> 公開する</p>
    </aside>
  );
}

function ScheduleGate() {
  return (
    <ol className="schedule-gate" aria-label="日程案内までの流れ">
      <li><span>01</span><div><small lang="en">BRIEF</small><b>相談内容を受け取る</b><p>目的、希望時期、現在の状況を確認します。</p></div><i aria-hidden="true" /></li>
      <li><span>02</span><div><small lang="en">REVIEW</small><b>内容と進め方を確認</b><p>必要な範囲と進行の相性を整理します。</p></div><i aria-hidden="true" /></li>
      <li><span>03</span><div><small lang="en">SCHEDULE</small><b>対応時期をご案内</b><p>確認結果に合わせ、可能な日程をお伝えします。</p></div><i aria-hidden="true" /></li>
    </ol>
  );
}

function SystemArtifact() {
  const layers = ["CONCEPT", "VISUAL", "MOTION", "CODE"];
  return (
    <aside className="signal-artifact system-artifact" aria-label="サイトを構成する四つの層">
      <span className="artifact-label" lang="en">SITE ARCHITECTURE / LIVE DEMONSTRATION</span>
      <div className="system-stack" aria-hidden="true">
        {layers.map((layer, index) => <div key={layer}><span>0{index + 1}</span><b>{layer}</b><i /></div>)}
      </div>
      <div className="system-readout"><span>INPUT<br /><b>IDEA</b></span><i>→</i><span>OUTPUT<br /><b>EXPERIENCE</b></span></div>
    </aside>
  );
}
