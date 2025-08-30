# Python 3.10の軽量ベースイメージを使用
FROM python:3.10-slim-bullseye

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール（最小限）
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Python依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --no-cache-dir --no-deps -r requirements.txt \
    && rm -rf ~/.cache/pip \
    && find /usr/local/lib/python3.10/site-packages -name "*.pyc" -delete \
    && find /usr/local/lib/python3.10/site-packages -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# アプリケーションコードをコピー
COPY . .

# アップロードディレクトリを作成
RUN mkdir -p uploads

# ポート5000を公開
EXPOSE 5000

# 環境変数を設定
ENV FLASK_APP=app_flask.py
ENV FLASK_ENV=production

# アプリケーションを起動
CMD ["python", "app_flask.py"]
