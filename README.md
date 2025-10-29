# 職務経歴書

GitHub Pages で公開する職務経歴書リポジトリです。

## セットアップ

### 必要な環境

- Node.js 18+
- Ruby 3.0+（Jekyll 用）
- Bundler

### Ruby のセットアップ

**システムの Ruby を使う場合（権限エラーが出る場合）**

macOS のシステム Ruby（`/Library/Ruby`）を使うと権限エラーが発生します。以下のいずれかの方法で解決してください。

#### 方法 1: Homebrew で Ruby をインストール（推奨）

```bash
# Homebrewがインストールされていない場合は先にインストール
# /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Rubyをインストール
brew install ruby

# PATHを設定（~/.zshrcに追加）
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Bundlerをインストール
gem install bundler
```

#### 方法 2: rbenv を使用

```bash
# rbenvをインストール
brew install rbenv ruby-build

# Ruby 3.0以上をインストール
rbenv install 3.2.0
rbenv global 3.2.0

# Bundlerをインストール
gem install bundler
```

### 初回セットアップ

```bash
# 依存関係のインストール
npm install

# Jekyllのセットアップ（初回のみ）
# プロジェクト内にgemをインストールするため、権限エラーは発生しません
npm run setup:jekyll
```

## 使い方

### Lint の実行

```bash
npm run lint
```

### ローカルプレビュー

```bash
npm run preview
```

ブラウザで `http://localhost:4000` にアクセスすると、GitHub Pages の表示をローカルで確認できます。

### GitHub への公開

1. 変更をコミット・プッシュ
2. リポジトリの Settings → Pages で以下の設定を行う
   - Source: `Deploy from a branch`
   - Branch: `main` / Folder: `/docs`

## 構成

- `docs/README.md`: 職務経歴書本体
- `docs/_config.yml`: Jekyll 設定
- `.github/workflows/lint.yml`: GitHub Actions Lint 設定
- `package.json`: Lint 依存関係とスクリプト
