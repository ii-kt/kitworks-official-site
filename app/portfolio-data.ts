/**
 * Published record source, retrieved 2026-08-19:
 * https://ii-kt.github.io/kitworks-portfolio/
 * https://github.com/ii-kt/kitworks-portfolio/blob/8f0ef28dca60a8cc5e649bcd88b94e84466681e3/src/data/portfolio.ts
 * https://github.com/ii-kt/kitworks-portfolio/blob/8f0ef28dca60a8cc5e649bcd88b94e84466681e3/src/App.tsx
 *
 * AI / PM 領域の詳細は、本人提供の業務記録（2026-08-19 受領）で補強しています。
 * 顧客名、製品名、案件固有の機密情報、および公開ポートフォリオが非公開としている
 * 個人情報（氏名・所在地・連絡先・資格）は記載しません。
 */

export const portfolioIdentity = {
  updated: "2026.08",
};

export const portfolioStats = [
  { label: "IT業界経験", value: "約7年", note: "開発・PM/PMO・PL・業務改善" },
  { label: "直近の軸", value: "AI/RAG × PM", note: "試作から業務適用・運用設計まで" },
  { label: "現場推進", value: "5名チームのPM", note: "Jira運用・週次報告・精度検証体制" },
];

export const portfolioStrengths = [
  {
    number: "01",
    title: "AI/RAGを業務フローに組み込む",
    lead: "仕様書探索、参照範囲の制御、回答品質の確認まで、現場の確認作業に合わせて設計します。",
    points: [
      "RAG型仕様書チャットボット構築",
      "LangGraphによる参照範囲・ワークフロー制御",
      "LangChain / MCP / Box・Slack・API連携",
      "出力LLMと評価LLM、人による品質確認の設計",
    ],
  },
  {
    number: "02",
    title: "AI案件のPMとして、試作から業務適用まで進める",
    lead: "実現可能性を試作で示しながら、要望整理、優先順位付け、進捗・課題管理、品質確認を回します。",
    points: [
      "5名チームのPM・流動的な役割設計",
      "Jiraチケット運用・週次報告・リーダー会資料作成",
      "トレーサビリティ作成・管理・監査",
      "生成AIを併用した進行管理・リマインド運用",
    ],
  },
  {
    number: "03",
    title: "要件・仕様・開発をつなぐ",
    lead: "顧客要望や曖昧な論点を、仕様、設計、タスク、テスト観点へ落とし込みます。",
    points: ["顧客折衝・仕様策定", "C/C++・Python・C#開発", "車載・組み込み・ログ基盤・クラウド連携"],
  },
];

export const portfolioCases = [
  {
    number: "01",
    title: "RAG型仕様書チャットボット構築・生成AI活用支援",
    domain: "製造 / 自動車・車載 / AI活用支援",
    role: "AI活用支援 / RAG設計・構築 / 回答品質改善",
    challenge: "Excel仕様書、要求仕様書、要件定義書、画面仕様書を横断して確認する負荷が高く、仕様探索を業務フローに組み込む必要があった。既存のRAG機能では、資料形式やフォルダ構成が統一されていない資料群を広く検索してしまい、質問に対して不要な情報まで参照される状態だった。",
    responsibility: "LangChainを活用したRAG構成、検索対象資料の整理、チャンク分割方針、Box連携検索、Slack要約、プロンプト調整を担当。あわせてLangGraphを用い、質問内容に応じて参照する資料・情報の範囲を絞り込み、その結果を次のワークフローへ受け渡す設計へ変更。",
    contribution: "検索対象と回答生成時に扱う情報を分け、不要な情報が回答へ混ざりにくい構成へ改善。仕様探索と仕様確認・参照業務の効率化を支援し、複数PJへの展開、レビュー観点整理、AI活用時の再現性・品質安定化にも対応。",
    tags: ["RAG", "LangChain", "LangGraph", "参照範囲の制御", "MCP", "Box連携検索", "Slack/API連携", "ローカルLLM", "AGENTS.md", "Skills"],
  },
  {
    number: "02",
    title: "生成AIチャットボット開発プロジェクトのPM（PoC〜業務適用）",
    domain: "製造 / 自動車・車載 / AI製品開発",
    role: "AI案件PM / 5名チーム運営 / 顧客折衝",
    challenge: "顧客側でAI導入が進んでおらず、生成AIを用いた製品に対して当初から懐疑的な見方があり、要望のたびに実現可能性を問われる状況だった。",
    responsibility: "5名チームのPMとして、プロトタイプ試作1名、顧客要望の改良案出し1〜2名、チャットボット本体の実装1〜2名、精度検証1名を、役割を固定せず状況に応じて配置。細かい要求ごとに試作を作って実現可能性を提示し、進捗はJiraで管理しながら、次回の顧客会議で提示できる状態が作れているかを判断基準として運営。",
    contribution: "PoCから業務適用・訴求段階まで一連の推進を担当。要望整理、優先順位付け、課題管理を顧客会議の周期に合わせて回し、懐疑的な状態から実業務での利用検討まで進めた。",
    tags: ["AI案件PM", "PoC / プロトタイピング", "アジャイル運営", "顧客折衝", "要望整理・優先度付け", "Jira", "5名チーム"],
  },
  {
    number: "03",
    title: "生成AIによる進行管理・WBS運用ツールの内製",
    domain: "製造 / 自動車・車載 / 進行管理自動化",
    role: "企画 / 設計・実装 / 運用設計",
    challenge: "週2回の顧客会議ごとに要望や優先度が変化し、Jiraのチケット運用だけでは変更の検知や期限・リスクの把握が遅れる懸念があった。",
    responsibility: "JiraチケットのCSV出力と、AIで作成した会議議事録の2つを入力に、要望変更、優先度変更の可能性、期限・リスクの高い項目を抽出するツールを内製。出力担当LLMの結果を評価担当LLMが確認し、抜け漏れ・矛盾・根拠との不一致をフィードバックして修正するセルフリフレクションを複数回通す構成とし、抽出結果はSlackへ通知してJiraと併用する運用を設計。",
    contribution: "AIによるJiraの自動更新や優先度の自動確定は行わず、確認が必要な候補の抽出と注意喚起に限定。精度検証担当が元チケットと会議での合意内容に照らして確認し、人が最終判断する二段構えの運用として、誤ったリマインドと対応漏れによる遅延を防いだ。",
    tags: ["生成AI内製ツール", "Jira連携（CSV）", "議事録自動生成", "セルフリフレクション", "評価LLM", "Slack通知", "WBS / 進行管理"],
  },
  {
    number: "04",
    title: "生成AI活用推進ワークショップの企画・主催",
    domain: "製造 / 自動車・車載 / 活用推進・製品訴求",
    role: "企画 / 主催・進行 / 指南",
    challenge: "参画先の開発IDE製品をその先の顧客へ訴求するにあたり、AI駆動開発の効果が体感されておらず、現場でのAI活用も定着していなかった。",
    responsibility: "開発IDE製品を題材に、AI駆動開発（バイブコーディング）を実際に体験できるワークショップを企画・主催。プロンプトの粒度が最終成果物の精度へどう影響するかを、その場で比較して体感できる進め方を設計し、操作手順と勘所を指南。",
    contribution: "参加者が製品上でAI駆動開発の効果を体験できる場をつくり、現場へのAI活用推進と製品訴求の双方に貢献。",
    tags: ["AI駆動開発", "バイブコーディング", "プロンプト粒度設計", "ワークショップ企画・主催", "活用推進", "製品訴求"],
  },
  {
    number: "05",
    title: "大手製造業向け 開発プロセス適用・成果物監査・PMO支援",
    domain: "製造 / 自動車・車載 / PMO",
    role: "チームリード / PMO支援 / 成果物品質管理",
    challenge: "開発プロセス、成果物品質、トレーサビリティ、進捗・課題管理を整理し、プロジェクトを前に進める必要があった。",
    responsibility: "基本設計、要求仕様書、要件定義書、画面仕様書の確認、トレーサビリティ作成・管理・監査、Jira運用、週次報告、5名チームのタスク管理を担当。",
    contribution: "進捗・課題の可視化、成果物品質確認、作成チームへのフィードバック、チーム運営とプロセス標準化を支援。",
    tags: ["Jira", "Slack", "Confluence", "PlantUML", "成果物監査", "トレーサビリティ", "PMO"],
  },
  {
    number: "06",
    title: "大手輸送用機器メーカー向けマウンター機開発",
    domain: "製造 / 輸送用機器 / 開発支援",
    role: "開発担当（顧客折衝・仕様策定含む）",
    challenge: "顧客要望を実装可能な仕様へ落とし込み、C++とC#間のデータ連携処理を設計・実装・確認する必要があった。",
    responsibility: "顧客との対話を通じた仕様策定、設計、実装、テスト、データコンバート処理の仕様理解と動作確認を担当。",
    contribution: "仕様合意から設計・実装・テストまで一連の開発を支援し、顧客側と開発側の認識合わせを推進。",
    tags: ["C++", "C#", "Redmine", "Visual Studio", "BitBucket", "Slack", "Teams"],
  },
  {
    number: "07",
    title: "統合ログ管理プラットフォーム導入支援",
    domain: "IT / ログ管理 / 監視基盤",
    role: "データエンジニア / 導入支援",
    challenge: "Datadogの既存監視内容を読み解き、Splunk側で監視・可視化を継続できる状態へ移行する必要があった。",
    responsibility: "Datadogクエリ解析、Splunk SPLへの変換、ダッシュボードおよびアラート機能の設計・実装を主導。",
    contribution: "ログ管理基盤移行を推進し、監視・可視化を継続するためのクエリ変換、ダッシュボード整備、アラート設計を実施。",
    tags: ["Splunk", "Datadog", "SPL", "DQL", "Amazon WorkSpaces"],
  },
  {
    number: "08",
    title: "カーナビシステムのラジオ機能開発",
    domain: "自動車 / 車載 / 組み込み",
    role: "開発担当（顧客折衝含む）",
    challenge: "国内および北欧向けカーナビのラジオ機能について、国内外担当者と仕様を調整しながら開発する必要があった。",
    responsibility: "仕様策定・調整、C/C++による設計・実装・テスト、CANoe等を用いた確認を担当。",
    contribution: "顧客・海外担当者との調整を含め、仕様策定から実装、テスト、動作確認まで対応。",
    tags: ["C", "C++", "CANoe", "VSCode", "git", "VirtualBox"],
  },
  {
    number: "09",
    title: "画像センサ開発（AUTOSAR）",
    domain: "自動車 / 車載 / AUTOSAR",
    role: "プロジェクトリーダー",
    challenge: "AUTOSAR準拠の次世代画像センサ開発で、DIAG機能の上流から下流までを推進する必要があった。",
    responsibility: "メンバーのタスク管理、進捗管理、技術フォロー、DIAG機能の要件定義、設計、実装、評価を担当。",
    contribution: "技術面と管理面の両方から開発を推進し、AUTOSAR準拠DIAG機能の要件定義から評価まで対応。",
    tags: ["C", "AUTOSAR", "CANoe", "DaVinci", "Redmine", "git", "Subversion"],
  },
  {
    number: "10",
    title: "ストレージ製品のクラウド連携機能開発",
    domain: "ストレージ / クラウド連携",
    role: "開発メンバー",
    challenge: "Linuxベースのストレージ製品からAWSクラウドへデータを転送する新機能を開発・評価する必要があった。",
    responsibility: "Pythonを用いたAWSクラウド転送機能の設計・実装、Linux環境での状態監視、性能モニタ評価を担当。",
    contribution: "転送処理、状態確認、性能確認を含むクラウド連携機能の開発・検証に対応。",
    tags: ["Python", "Linux", "AWS", "git", "VirtualBox"],
  },
];

export const portfolioAiSupports = [
  { title: "仕様書探索 / RAG", body: "Excel仕様書、要求仕様書、要件定義書、画面仕様書を対象に、検索対象資料とチャンク方針を整理。" },
  { title: "AIワークフロー設計 / LangGraph", body: "質問内容に応じた参照範囲の絞り込みと、ワークフロー間の受け渡しを設計。検索対象と回答生成時の情報を分離。" },
  { title: "出力品質の評価設計", body: "出力担当LLMと評価担当LLMによるセルフリフレクションを複数回通し、最終確認は人が行う二段構えを設計。" },
  { title: "PoC / プロトタイピング", body: "AI導入に慎重な状況でも、要求単位で試作を作り、実現可能性を示しながら合意形成を進める。" },
  { title: "Box連携検索", body: "Box上の業務ドキュメントを検索・参照しやすくする仕組みを検討・実装。" },
  { title: "Slack要約 / 議事録", body: "Slack要約、会議内容からの議事録作成、決定事項・ToDo・論点整理に対応。" },
  { title: "進行管理の自動化", body: "JiraチケットCSVと会議議事録から、要望変更・優先度変更候補・期限やリスクの高い項目を抽出し、Slackで注意喚起。" },
  { title: "レビュー観点整理", body: "基本設計、要求仕様書、要件定義書、画面仕様書の確認観点や妥当性確認を支援。" },
  { title: "AI活用時の指示設計", body: "AGENTS.md、Skills、プロンプト設計を含め、AI出力の再現性と品質安定化を整理。" },
  { title: "開発・レビュー支援", body: "コード生成AIを活用した実装方針検討、修正案作成、レビュー対応を支援。" },
  { title: "活用推進 / ワークショップ", body: "AI駆動開発とプロンプト粒度の効果を体感できる場を企画・主催し、現場への定着を支援。" },
];

export const portfolioPmoSupports = [
  "AI案件のPM（5名チーム / PoC〜業務適用）",
  "役割を固定しない流動的なチーム編成",
  "顧客会議起点の要望整理・優先度調整",
  "Jiraチケット作成・担当割り振り",
  "進捗確認・週次報告・リーダー会資料作成",
  "5名チームのタスク管理・技術フォロー",
  "成果物監査・レビュー観点整理",
  "トレーサビリティ作成・管理・監査",
  "AI出力に対する人の最終確認フロー整備",
  "作成チームへのフィードバック",
  "Slack活用・Confluence運用",
  "PlantUMLによる設計書コード化",
  "業務フロー整理・プロセス標準化",
];

export const portfolioTimeline = [
  { period: "2024/12 - 現在", title: "生成AIチャットボット開発プロジェクトのPM", meta: "製造 / 自動車・車載 / AI製品開発", summary: "5名チームのPMとして、PoCから業務適用まで推進。試作提示、要望整理、優先度調整、Jira運用、精度検証体制の維持を担当。" },
  { period: "2024/12 - 現在", title: "RAG型仕様書チャットボット構築・AI活用支援", meta: "製造 / 自動車・車載 / 業務改善", summary: "RAG構成、LangGraphによる参照範囲制御、Box連携検索、Slack要約、プロンプト調整、複数PJ展開に対応。" },
  { period: "2024/12 - 現在", title: "進行管理ツール内製・生成AI活用推進ワークショップ主催", meta: "製造 / 自動車・車載 / 業務改善・活用推進", summary: "JiraチケットCSVと議事録を入力とする進行管理ツールを内製。AI駆動開発を体感できるワークショップを企画・主催。" },
  { period: "2024/12 - 現在", title: "開発プロセス適用・成果物監査・PMO支援", meta: "製造 / 自動車・車載", summary: "成果物確認、トレーサビリティ管理、Jira運用、週次報告、5名チームのタスク管理を担当。" },
  { period: "2024/04 - 2024/11", title: "マウンター機開発", meta: "製造 / 輸送用機器", summary: "顧客折衝、仕様策定、C++/C#間のデータ連携処理、設計・実装・テストを担当。" },
  { period: "2023/12 - 2024/03", title: "統合ログ管理プラットフォーム導入支援", meta: "IT / ログ管理 / 監視基盤", summary: "Datadogクエリ解析、Splunk SPL変換、ダッシュボード・アラート設計を担当。" },
  { period: "2022/07 - 2023/11", title: "カーナビシステムのラジオ機能開発", meta: "自動車 / 車載", summary: "国内外担当者との仕様調整、C/C++設計・実装・テスト、CANoe確認に対応。" },
  { period: "2022/04 - 2022/06", title: "決済システム導入支援", meta: "金融 / 決済", summary: "Confluenceによる開発プロセス整備、Pythonでのデータ抽出・分析支援を担当。" },
  { period: "2021/08 - 2022/04", title: "画像センサ開発（AUTOSAR）", meta: "自動車 / 車載 / 組み込み", summary: "PLとしてタスク・進捗管理、DIAG機能の要件定義から評価まで担当。" },
  { period: "2021/01 - 2021/07", title: "ストレージ製品のクラウド連携機能開発", meta: "ストレージ / クラウド連携", summary: "Python、Linux、AWSを用いたデータ転送機能の設計・実装・評価を担当。" },
  { period: "2020/07 - 2020/12", title: "ネットワーク機器開発", meta: "通信 / ネットワーク機器", summary: "Debian環境でC言語による機能開発、品質改善、不具合調査・修正に対応。" },
  { period: "2020/05 - 2020/06", title: "ボディ系ECU制御開発 / モデル検証", meta: "自動車 / モデルベース開発", summary: "SimulinkモデルのBack-to-Back検証、MATLABによる試験ハーネス作成を担当。" },
  { period: "2019/09 - 2020/03", title: "カーナビゲーション開発", meta: "自動車 / 車載", summary: "通信機能のドライバ開発、詳細設計、単体テスト、結合試験設計を担当。" },
];

export const portfolioTraining = [
  "2020/04 AWSおよびモデルベース開発研修（AWS基礎、MATLAB/Simulink基礎）",
  "2019/04 - 2019/08 新入社員向け技術研修（C/C++、Linux、μITRON、AUTOSAR概論、TOPPERS/ATK2）",
];

export const portfolioSkillGroups = [
  { title: "AI / RAG / Automation", skills: ["RAG", "LangChain", "LangGraph", "AIワークフロー設計", "参照範囲の制御", "評価LLM / セルフリフレクション", "AI駆動開発", "MCP", "仕様書チャットボット", "ChatGPT", "Copilot", "Anthropic Claude", "Codex", "Claude Code", "HuggingFace", "Qwen", "ローカルLLM", "API連携", "議事録自動生成", "Slack要約", "Box連携検索", "AGENTS.md", "Skills", "プロンプト設計", "PlantUML"] },
  { title: "PM / Collaboration", skills: ["AI案件PM", "PoC / プロトタイピング", "アジャイル運営", "WBS / 進行管理", "ワークショップ企画・主催", "Jira", "Confluence", "Slack", "Teams", "Redmine", "BitBucket", "Lightning Review", "Visual Studio", "VSCode"] },
  { title: "Programming", skills: ["C", "C++", "Python", "C#", "Java基礎"] },
  { title: "Data / Log / Cloud", skills: ["Splunk", "Datadog", "SPL", "DQL", "AWS", "Amazon WorkSpaces", "Linux"] },
  { title: "Embedded / Automotive", skills: ["AUTOSAR", "CANoe", "DaVinci Configurator", "DaVinci Developer", "MATLAB", "Simulink", "μITRON", "TOPPERS/ATK2"] },
  { title: "Web / CMS", skills: ["WordPress", "HTML", "CSS", "JavaScript", "SEOメタ情報", "OGP", "sitemap.xml", "robots.txt"] },
];
