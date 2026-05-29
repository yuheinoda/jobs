# 職務経歴書

## 基本情報

- 氏名：野田 悠平
- 作成日：2026 年 5 月版

## 職務要約

AWS・Python・Terraform などのクラウドおよびインフラ自動化技術を中心に 5 年の実務経験を有しています。官公庁向けインフラ運用、婚活マッチングサービスの SRE、介護事業向け AI サービスのバックエンド開発を担当しています。近年は Azure・Kubernetes 環境下で AI 関連サービス開発にも従事しています。クラウド間の知見を活かした開発・運用自動化を推進しています。

## 活かせるスキル・経験

| 技術領域      | 経験年数 | スキルレベル |
| ------------- | -------- | ------------ |
| AWS           | 5 年以上 | ★★★★★        |
| Python        | 5 年以上 | ★★★★★        |
| Typescript    | 4 年以上 | ★★★★★        |
| Azure         | 2 年以上 | ★★★          |
| Terraform     | 4 年以上 | ★★★★★        |
| MySQL         | 4 年以上 | ★★★          |
| Elasticsearch | 3 年以上 | ★★★          |
| Kubernetes    | 2 年以上 | ★★           |

## 職務経歴

### 株式会社 Crane&I（2020 年 8 月〜2022 年 1 月）

#### 官公庁マイナンバーサービスインフラ運用保守

- 技術スタック
  - Apache
  - Tomcat
  - AWS（EC2, RDS, S3, Lambda, CloudWatch）
- 開発手法：ウォーターフォール
- 主な実績：
  - Postfix から AWS SES への移行を主導
  - セキュリティグループ更新の自動化（Lambda + EventBridge）
  - 設計書・手順書の作成、官公庁向け技術資料の作成

### 株式会社 Rosso（2022 年 2 月〜2023 年 9 月）

#### 婚活マッチングアプリ SRE

- 技術スタック
  - Terraform
  - AWS
  - Datadog
- 開発手法：スクラム
- 主な実績：
  - リスト攻撃対策（WAF + Lambda@Edge）設計・導入
  - ウイルススキャンサーバー設計構築（ClamAV）
  - API サーバー構築（Spring Boot）およびバッチ自動実行環境構築
  - CI/CD パイプライン設計・構築（CodeBuild, CodeDeploy, Step Functions）
  - 業者検知の自動化（Athena + Lambda）

### 株式会社 Hmcomm（2023 年 10 月〜現在）

##### 介護事業向け AI サービス バックエンド開発

- 技術スタック
  - Azure
  - Kubernetes（AKS）
  - FastAPI
  - MySQL
  - Elasticsearch（ECK）
- 開発手法：スクラム
- 主な実績：
  - Elasticsearch 開発用環境と日本語形態素解析（Sudachi）設定、同義語辞書、インデックス作成・検索スクリプト群を管理
  - Kafka, MySQL バイナリログを使用して MySQL → Elasticsearch のデータ同期を実現
  - Kubernetes Helm により、API と Kafka, Elasticsearch のデプロイを自動化
  - Prophet を使用した時系列データの異常検知パイプラインを構築
  - 設計・開発・保守運用を担当

##### 英作文自動採点アプリ開発

- 技術スタック
  - AWS
  - FastAPI
  - MySQL
  - Redis
  - DynamoDB
  - Next.js
- 開発手法：スクラム
- 主な実績：
  - API 開発・データベース設計・アーキテクチャ設計を担当
  - 要件定義・設計・開発・保守運用を担当

##### 自治体向け AI 電話応対サービス

- 技術スタック
  - FastAPI
  - Azure
  - Azure OpenAI Realtime API
  - Azure Cosmos DB
  - Next.js(API Route)
- 開発手法：スクラム
- 主な実績：
  - 電話着信をトリガーに、音声ストリーミングを Azure OpenAI Realtime API へ接続。STT → LLM 応答生成 → TTS をリアルタイム処理し、電話経由で自然対話できるコールボット基盤を実装
  - Asterisk を用いたオンプレ PBX の実装
  - 要件定義・設計・開発・保守運用を担当


### 業務委託

#### 株式会社 KAL（2025 年 1 月〜現在）

技術顧問的な立場で参画し、AI チャットボット SaaS や EC 物流連携基盤など複数プロダクトの技術選定・アーキテクチャ設計から開発までを横断的に支援しています。少人数体制のため、設計・実装・インフラ・運用を一貫して担当しています。

##### AI チャットボット SaaS「InChat」開発

- 技術スタック
  - Next.js（App Router）/ React / TypeScript / MUI
  - OpenAI API
  - Pinecone（ベクトル検索 / RAG）
  - AWS（DynamoDB, SES）
  - Stripe
  - Upstash Redis
- 主な実績：
  - Pinecone + OpenAI を用いた RAG 構成のチャットボットを設計・実装
  - Web サイトや FAQ を Python・Puppeteer でクロールし、Markdown 整形のうえ Pinecone へ投入する知識ベース構築パイプラインを開発
  - 管理画面（ダッシュボード）を開発し、利用状況の分析・可視化、CSV エクスポート、JWT 認証、レート制限を実装
  - Stripe によるサブスクリプション課金とトークン従量課金を実装
  - company_id ベースのマルチテナント設計とし、TENGA ヘルスケア向けチャットなど複数企業への導入に対応

##### EC・物流連携基盤（tenga-warehouse）

- 技術スタック
  - AWS（Step Functions, Lambda, CDK）
  - Node.js
- 主な実績：
  - Shopify / eforce / Qoo10 など複数 EC サイトと日本郵便 WMS を連携するワークフローを AWS Step Functions + Lambda で設計・構築
  - AWS CDK によるインフラのコード化（IaC）とデプロイ自動化

##### コーポレートサイト構築・運用

- 技術スタック
  - Next.js
  - AWS（S3, CloudFront）
- 主な実績：
  - Next.js による静的サイトを構築し、S3 + CloudFront でのホスティング・配信を実現
  - スマートフォン向けヘルスケアアプリの設計・技術検討支援（HealthKit / Health Connect 連携を見据えた拡張性のあるデータ設計）

#### 株式会社 G-IN（2025 年 10 月〜現在）

自立型音声 AI エージェント「S.P.A.R.K.」のプロダクト開発に、バックエンドの主担当として参画。エージェント実行基盤・データ基盤・インフラ・CI/CD までを横断的に設計・実装し、リポジトリ全体で最多のコミットを担っています。

##### 自立型音声 AI エージェント「S.P.A.R.K.」開発

- 期間：2025 年 10 月〜現在
- 体制：エンジニア 7 名程度のスクラム開発（バックエンド主担当）
- 役割：バックエンド／エージェント実行基盤の設計・実装を主導し、可観測性・CI/CD・インフラ構築まで一貫して担当
- 技術スタック
  - 言語／FW：Go 1.24（Fiber, go-chi, WebSocket）/ TypeScript
  - リアルタイム音声：OpenAI Realtime API（WebSocket 双方向音声ストリーミング）
  - フロントエンド：Next.js 15 / React 19（管理画面）、React（音声クライアント）
  - モバイル：React Native + Expo（Tamagui）
  - データストア：Amazon DynamoDB（メタデータ・設定）、Google BigQuery（分析基盤）
  - 認証・課金：JWT、Stripe
  - インフラ：AWS ECS Fargate, ECR, S3, SES, SQS, Lambda, Secrets Manager, EventBridge Scheduler, ALB / Route53 / ACM、Terraform（モジュール構成）
  - 可観測性：OpenTelemetry、LangSmith、Grafana、AWS X-Ray / CloudWatch
- 開発手法：スクラム
- 主な実績：
  - OpenAI Realtime API を用いた双方向音声ストリーミング基盤を Go + WebSocket で実装し、リアルタイム音声対話を実現
  - メインエージェントを補助するサブエージェント機構（マルチエージェント）を設計・実装。会話履歴を 0〜100 でスコアリングし、閾値を下回ると介入ディレクティブをメインエージェントへ送出する評価・介入ポリシー基盤を構築
  - 会話や外部 API から構造化データを抽出する Data Catalog／Data Extractor／Data Warehouse（BigQuery）から成るデータ基盤を設計し、LLM による抽出から BI ダッシュボード（Custom UI）まで一気通貫で実装
  - マルチテナント基盤（テナント／ユーザー／権限／API キー管理）と Stripe によるサブスクリプション課金・使用量計測を実装
  - OpenTelemetry によるトレース／メトリクス／ログの分散トレーシング基盤を整備し、LangSmith・Grafana と連携してリアルタイム処理の可観測性を確保
  - GitHub Actions による CI/CD（lint・テスト・カバレッジ → ECR → ECS 自動デプロイ）を構築し、Terraform で dev／stg／prd のマルチ環境インフラをコード管理
  - golangci-lint の厳格設定・OpenAPI／AsyncAPI スキーマ検証・モック自動生成を含む開発標準を整備し、コード品質を担保

## 自己 PR

私は、AWS や Python を中心としたクラウドインフラ・バックエンド開発の実務経験を 4 年以上積んでいます。近年では Azure や Kubernetes を活用した AI サービス開発にも携わっています。Terraform や Lambda を用いた自動化を得意とし、システムの効率化と安定化を両立させる開発・運用基盤の構築に強みを持っています。
これまで、官公庁のマイナンバーサービスでは AWS 環境の運用保守を担当し、Postfix から AWS SES への移行やセキュリティグループ更新の自動化など、堅牢性と保守性の向上に貢献しました。その後、婚活マッチングサービスの SRE として、WAF を活用したリスト攻撃対策や CICD パイプラインの整備、業者検知自動化などを実施し、サービスの信頼性と運用効率を大幅に改善しました。
現在は、介護・教育分野の AI 関連サービスで、FastAPI や React を用いたバックエンド開発からインフラ設計まで一貫して対応しています。クラウド間の特性を理解したシステム設計と、課題解決を自走的に進める姿勢を大切にしており、技術面のみならずチーム全体の生産性向上にも寄与できるエンジニアです。新しい技術の吸収にも積極的で、生成 AI を含む次世代サービス開発にも柔軟に対応します。
