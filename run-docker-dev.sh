#!/bin/bash

echo "🚀 開発環境用Dockerで画像分析アプリを起動中..."

# Docker Composeで開発環境を起動
docker-compose up image-analyzer-dev --build

echo "✅ アプリが起動しました！"
echo "🌐 ブラウザで http://localhost:5000 にアクセスしてください"
