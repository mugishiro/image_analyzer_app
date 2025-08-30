# 画像内容分析アプリ

画像をアップロードすると、含まれている物体や内容をリストアップするWebアプリケーションです。

## 機能

- 🔍 画像アップロード機能
- 🤖 AIによる物体検出・認識（YOLOv8）
- 📊 検出された物体の信頼度表示
- ⚙️ 信頼度閾値の調整
- 📱 レスポンシブデザイン

## インストール

```bash
# 依存関係をインストール
pip install -r requirements.txt

# アプリを起動
python3 app_flask.py
```

## 使用方法

1. ブラウザで `http://localhost:5000` にアクセス
2. 「画像を選択」でファイルを選択
3. 必要に応じて「信頼度閾値」を調整
4. 「画像を分析」ボタンをクリック
5. 検出された物体のリストを確認

## サポートされている画像形式

- PNG
- JPG/JPEG
- GIF
- BMP

## 技術仕様

- **フレームワーク**: Flask
- **AIモデル**: YOLOv8 (Ultralytics)
- **画像処理**: OpenCV, Pillow
- **言語**: Python 3.8+

## デプロイ

### Railway デプロイ

このアプリはRailwayに簡単にデプロイできます：

1. プロジェクトをGitHubにプッシュ
2. [Railway](https://railway.app/) でGitHubリポジトリを選択
3. 自動的にDockerビルドとデプロイが実行される

詳細な手順は [deploy_railway.md](deploy_railway.md) を参照してください。

### ローカルDocker実行

```bash
# Dockerイメージをビルド
docker build -t image-analyzer .

# コンテナを起動
docker run -p 5000:5000 image-analyzer

# または docker-compose を使用
docker-compose up --build
```
