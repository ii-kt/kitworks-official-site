import { readFileSync, writeFileSync } from "node:fs";

const path = "app/page.tsx";
let page = readFileSync(path, "utf8");

const importAnchor = '} from "./portfolio-data";\n';
const careerImport = 'import { careerRecord } from "./career-data";\n';
if (!page.includes(careerImport)) {
  if (!page.includes(importAnchor)) throw new Error("portfolio-data import anchor not found");
  page = page.replace(importAnchor, importAnchor + careerImport);
}

const careerBlock = String.raw`  if (panel === "capabilities") {
    return (
      <div className="panel-view business-view portfolio-view">
        <PanelKicker en="CAREER / PROFESSIONAL RECORD" ja="職務経歴書" />
        <section className="portfolio-hero">
          <div className="portfolio-hero__copy">
            <p className="editorial-eyebrow" lang="en">ENGINEERING / PM / AI</p>
            <h1 id="panel-title">開発からPM、AIまで。<br /><em>約7年の職務経歴。</em></h1>
            <p className="panel-lead">{careerRecord.summary}</p>
          </div>
          <aside className="portfolio-ledger portfolio-dossier" aria-label="職務経歴概要">
            <span className="editorial-object-label" lang="en">PROFESSIONAL CAREER / 2019—NOW</span>
            <h2>{careerRecord.profile.name}</h2>
            <p>{careerRecord.profile.focus}</p>
            <dl>
              <div><dt>FORM</dt><dd>{careerRecord.profile.form}</dd></div>
              <div><dt>EXPERIENCE</dt><dd>{careerRecord.profile.experience}</dd></div>
              <div><dt>RECORDS</dt><dd>{careerRecord.experiences.length}</dd></div>
              <div><dt>UPDATED</dt><dd>{careerRecord.updated}</dd></div>
            </dl>
            <div className="portfolio-ledger__stamp"><span>CAREER</span><b>RECORD</b><small>{careerRecord.experiences.length}</small></div>
          </aside>
        </section>

        <section className="portfolio-stats" aria-label="職務プロフィール概要">
          <article><span>IT業界経験</span><strong>約7年</strong><p>開発・PL・PMO・AI</p></article>
          <article><span>現在の形態</span><strong>KiT Works</strong><p>2026/05/01〜 個人事業主</p></article>
          <article><span>現在の軸</span><strong>AI/RAG × PM</strong><p>AI製品開発・プロジェクト推進</p></article>
        </section>

        <section className="portfolio-record-section portfolio-practice-section" aria-labelledby="career-summary-title">
          <PortfolioSectionHeader number="01" en="PROFESSIONAL SUMMARY" ja="職務要約・得意分野" id="career-summary-title" copy="開発現場の実装経験を土台に、PM・品質・AIまで横断してきた職務上の強みです。" />
          <div className="portfolio-principles">
            {careerRecord.strengths.map((strength) => (
              <article key={strength.number}>
                <span>{strength.number} / CAPABILITY</span>
                <h2>{strength.title}</h2>
                <p>{strength.lead}</p>
                <ul>{strength.points.map((point) => <li key={point}>{point}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-record-section portfolio-history-section" aria-labelledby="career-employment-title">
          <PortfolioSectionHeader number="02" en="EMPLOYMENT" ja="所属経歴" id="career-employment-title" copy="所属会社と独立後の事業形態を、案件とは分けて記載しています。" />
          <ol className="portfolio-timeline">
            {careerRecord.employments.map((item, index) => (
              <li key={\`${item.period}-${item.company}\`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <time>{item.period}</time>
                <div><small>{item.role}</small><h3>{item.company}</h3><p>{item.summary}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="portfolio-record-section portfolio-cases-section" aria-labelledby="career-experience-title">
          <PortfolioSectionHeader number="03" en="PROFESSIONAL EXPERIENCE" ja="職務経歴" id="career-experience-title" copy="2019年の研修から現在のAIプロジェクトまで、案件・研修を省略せず時系列で記録しています。" />
          <div className="portfolio-case-ledger">
            {careerRecord.experiences.map((entry) => (
              <article className="portfolio-case" key={entry.number}>
                <header><span>RECORD {entry.number}</span><small>{entry.period} / {entry.domain}</small></header>
                <div className="portfolio-case__title"><h3>{entry.title}</h3><p>{entry.role}</p></div>
                <dl className="portfolio-case__details">
                  <div><dt>OVERVIEW / 概要</dt><dd>{entry.overview}</dd></div>
                  <div><dt>SCOPE / 担当</dt><dd>{entry.scope}</dd></div>
                  <div><dt>RESULT / 成果・貢献</dt><dd>{entry.result}</dd></div>
                </dl>
                <ul className="portfolio-tagline" aria-label={\`Record ${entry.number} の技術・ツール\`}>
                  {entry.tools.map((tool) => <li key={tool}>{tool}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-record-section portfolio-skills-section" aria-labelledby="career-skills-title">
          <PortfolioSectionHeader number="04" en="SKILL INDEX" ja="技術・ツール" id="career-skills-title" copy="職務経歴書とスキルシートに記録されていた技術・ツールを領域別に統合しています。" />
          <div className="portfolio-skill-index">
            {careerRecord.skills.map((group, index) => (
              <article key={group.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><p>{group.skills.join(" / ")}</p></article>
            ))}
          </div>
        </section>

        <section className="portfolio-record-section portfolio-scope-section" aria-labelledby="career-activities-title">
          <PortfolioSectionHeader number="05" en="ACTIVITIES" ja="補足実績・資格・語学" id="career-activities-title" copy="案件履歴以外のAI活用実績、登壇、資格・語学をまとめています。" />
          <div className="portfolio-scope-grid">
            <div className="portfolio-ai-scope">
              <div className="portfolio-support-ledger">
                {careerRecord.activities.map((item, index) => (
                  <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.body}</p><p>{item.tools.join(" / ")}</p></div></article>
                ))}
              </div>
            </div>
            <div className="portfolio-pmo-scope">
              <p className="editorial-object-label" lang="en">QUALIFICATIONS / LANGUAGE</p>
              <h3>資格・語学</h3>
              <ol>{careerRecord.qualifications.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
            </div>
          </div>
        </section>

        <section className="portfolio-record-section portfolio-history-section" aria-labelledby="career-selfpr-title">
          <PortfolioSectionHeader number="06" en="SELF STATEMENT" ja="自己PR" id="career-selfpr-title" copy="職務経歴書・スキルシートの自己PRを、現在の職務状況に合わせて統合しています。" />
          <div className="portfolio-pmo-scope">
            {careerRecord.selfPr.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <footer className="portfolio-document-end">
          <div className="portfolio-document-end__signature">
            <span className="portfolio-document-end__wordmark" role="img" aria-label="KiT Works" />
            <span lang="en">END OF CAREER RECORD</span>
          </div>
          <p>{careerRecord.experiences.length} RECORDS / CAREER 2019—NOW / UPDATED {careerRecord.updated}</p>
        </footer>
      </div>
    );
  }`;

const startMarker = '  if (panel === "capabilities") {';
const endMarker = '\n\n  if (panel === "process") {';
const start = page.indexOf(startMarker);
if (start < 0) throw new Error("Career block start not found");
const end = page.indexOf(endMarker, start);
if (end < 0) throw new Error("Career block end not found");

page = page.slice(0, start) + careerBlock + page.slice(end);
writeFileSync(path, page, "utf8");
