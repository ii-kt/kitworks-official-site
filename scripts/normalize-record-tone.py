from pathlib import Path

def apply(path, pairs):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    for old, new in pairs:
        if text.count(old) != 1:
            raise SystemExit(f'{path}: expected one match: {old[:60]}')
        text = text.replace(old, new, 1)
    p.write_text(text, encoding='utf-8')

apply('app/page.tsx', [
    ('<PanelKicker en="PORTFOLIO / PUBLISHED RECORD" ja="経歴・実績" />', '<PanelKicker en="PORTFOLIO / PUBLISHED RECORD" ja="実績記録" />'),
    ('<p className="panel-lead">試作で実現可能性を示しながら、業務で使える状態まで進めます。RAG設計と参照範囲の制御、出力品質の評価設計、5名チームのAI案件PM、Jira運用と成果物監査まで対応します。</p>', '<p className="panel-lead">RAG型仕様書チャットボットの設計・構築、参照範囲制御、生成AI出力の評価設計、5名チームのAI案件PM、Jiraを用いた進行管理、成果物監査を経験。PoCから業務適用までの推進を担当。</p>'),
    ('<PortfolioSectionHeader number="01" en="PRACTICE" ja="相談できること" id="portfolio-practice-title" copy="AI活用、品質管理、開発を別々に扱わず、現場の業務フローとしてつなぎます。" />', '<PortfolioSectionHeader number="01" en="PRACTICE" ja="実践領域" id="portfolio-practice-title" copy="AI活用、品質管理、開発を横断して担当してきた実務領域を整理。" />'),
    ('<PortfolioSectionHeader number="02" en="SELECTED CASES" ja="代表実績" id="portfolio-cases-title" copy="代表案件を、課題・役割だけでなく、制約、判断、進め方、成果までケーススタディとして記録しています。" />', '<PortfolioSectionHeader number="02" en="SELECTED CASES" ja="代表実績" id="portfolio-cases-title" copy="代表案件を、課題、役割、制約、判断、進め方、成果で整理。" />'),
    ('<PortfolioSectionHeader number="03" en="OPERATING SCOPE" ja="実務範囲" id="portfolio-scope-title" copy="AI/RAGの設計・評価から、AI案件のPMとしての進行・成果物品質管理まで対応します。" />', '<PortfolioSectionHeader number="03" en="OPERATING SCOPE" ja="実務範囲" id="portfolio-scope-title" copy="AI/RAGの設計・評価、AI案件PM、成果物品質管理を含む実務範囲。" />'),
    ('<h3>AI案件の推進と、<br />品質管理をセットで。</h3>', '<h3>AI案件推進 /<br />品質管理</h3>'),
    ('<p>進捗・課題だけでなく、成果物、レビュー観点、トレーサビリティ、会議体、AI出力の最終確認まで整理します。</p>', '<p>進捗・課題、成果物、レビュー観点、トレーサビリティ、会議体、AI出力の最終確認を対象に管理・確認。</p>'),
    ('<PortfolioSectionHeader number="05" en="SKILL INDEX" ja="技術・ツール" id="portfolio-skills-title" copy="実務で扱ってきた技術・ツールを、領域ごとに整理しています。" />', '<PortfolioSectionHeader number="05" en="SKILL INDEX" ja="技術・ツール" id="portfolio-skills-title" copy="実務で使用した技術・ツールを領域別に整理。" />'),
    ('<PortfolioSectionHeader number="01" en="PROFESSIONAL SUMMARY" ja="職務要約・得意分野" id="career-summary-title" copy="開発現場の実装経験を土台に、PM・品質・AIまで横断してきた職務上の強みです。" />', '<PortfolioSectionHeader number="01" en="PROFESSIONAL SUMMARY" ja="職務要約・経験領域" id="career-summary-title" copy="開発、PM・PL、品質管理、AIに関する主な職務経験を整理。" />'),
    ('<PortfolioSectionHeader number="02" en="EMPLOYMENT" ja="所属経歴" id="career-employment-title" copy="所属会社と独立後の事業形態を、案件とは分けて記載しています。" />', '<PortfolioSectionHeader number="02" en="EMPLOYMENT" ja="所属経歴" id="career-employment-title" copy="所属会社と独立後の事業形態を案件履歴と分離して記載。" />'),
    ('<PortfolioSectionHeader number="03" en="PROFESSIONAL EXPERIENCE" ja="職務経歴" id="career-experience-title" copy="2019年の研修から現在のAIプロジェクトまで、案件・研修を省略せず時系列で記録しています。" />', '<PortfolioSectionHeader number="03" en="PROFESSIONAL EXPERIENCE" ja="職務経歴" id="career-experience-title" copy="2019年の研修から現在のAIプロジェクトまで、案件・研修を時系列で記載。" />'),
    ('<PortfolioSectionHeader number="04" en="SKILL INDEX" ja="技術・ツール" id="career-skills-title" copy="職務経歴書とスキルシートに記録されていた技術・ツールを領域別に統合しています。" />', '<PortfolioSectionHeader number="04" en="SKILL INDEX" ja="技術・ツール" id="career-skills-title" copy="職務経歴書とスキルシートの技術・ツールを領域別に統合。" />'),
    ('<PortfolioSectionHeader number="05" en="ACTIVITIES" ja="補足実績・資格・語学" id="career-activities-title" copy="案件履歴以外のAI活用実績、登壇、資格・語学をまとめています。" />', '<PortfolioSectionHeader number="05" en="ACTIVITIES" ja="補足実績・資格・語学" id="career-activities-title" copy="案件履歴以外のAI活用実績、登壇、資格、語学を記載。" />'),
    ('<PortfolioSectionHeader number="06" en="SELF STATEMENT" ja="自己PR" id="career-selfpr-title" copy="職務経歴書・スキルシートの自己PRを、現在の職務状況に合わせて統合しています。" />', '<PortfolioSectionHeader number="06" en="SELF STATEMENT" ja="自己PR" id="career-selfpr-title" copy="職務経歴書・スキルシート記載内容を現在の職務状況に合わせて整理。" />'),
])
