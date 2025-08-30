#!/bin/bash

echo "🚀 画像内容分析アプリを起動中..."

# 依存関係をインストール
echo "📚 依存関係をインストール中..."
pip3 install --user -r requirements.txt

# アプリを起動
echo "🌐 アプリを起動中..."
echo "ブラウザで http://localhost:5000 にアクセスしてください"
python3 app_flask.py
