# Railway デプロイ手順

このアプリをRailwayにデプロイする手順を説明します。

## 前提条件

1. [Railway](https://railway.app/) アカウント
2. [GitHub](https://github.com/) アカウント
3. プロジェクトがGitHubリポジトリにプッシュ済み

## デプロイ手順

### 1. Railwayにログイン

1. [Railway](https://railway.app/) にアクセス
2. GitHubアカウントでログイン

### 2. 新しいプロジェクトを作成

1. 「New Project」をクリック
2. 「Deploy from GitHub repo」を選択
3. このプロジェクトのGitHubリポジトリを選択

### 3. 環境変数の設定（オプション）

Railwayのダッシュボードで以下の環境変数を設定できます：

```
FLASK_ENV=production
PORT=5000
```

### 4. デプロイの確認

1. Railwayが自動的にDockerfileを検出してビルドを開始
2. ビルド完了後、アプリが自動的にデプロイされる
3. 提供されたURLでアプリにアクセス

## ローカルテスト

デプロイ前にローカルでDockerテスト：

```bash
# Dockerイメージをビルド
docker build -t image-analyzer .

# コンテナを起動
docker run -p 5000:5000 image-analyzer

# または docker-compose を使用
docker-compose up --build
```

## トラブルシューティング

### よくある問題

1. **ビルドエラー**
   - Dockerfileの構文を確認
   - requirements.txtの依存関係を確認

2. **起動エラー**
   - ポート設定を確認
   - 環境変数を確認

3. **モデル読み込みエラー**
   - yolov8n.ptファイルが含まれているか確認
   - 十分なメモリがあるか確認

### ログの確認

Railwayダッシュボードでログを確認できます：
- ビルドログ
- アプリケーションログ

## 注意事項

- Railwayの無料プランには制限があります
- 大きなファイル（yolov8n.pt）のアップロードに時間がかかる場合があります
- 初回起動時はモデルのダウンロードに時間がかかります
