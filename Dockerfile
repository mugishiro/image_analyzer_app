# Python 3.10の軽量ベースイメージを使用
FROM python:3.10-slim-bullseye

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール（OpenCV用）
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgtk-3-0 \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libatlas-base-dev \
    gfortran \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Python依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir flask==2.3.0 && \
    pip install --no-cache-dir opencv-python-headless==4.8.0.76 && \
    pip install --no-cache-dir torch==2.0.0+cpu torchvision==0.15.0+cpu --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt && \
    pip list && \
    rm -rf ~/.cache/pip

# アプリケーションコードをコピー
COPY . .

# アップロードディレクトリを作成
RUN mkdir -p uploads

# Flaskがインストールされているかチェック
RUN python -c "import flask; print('Flask version:', flask.__version__)"

# Gitが利用可能かチェック
RUN git --version

# ポートを公開（Railways用）
EXPOSE 8080

# 環境変数を設定
ENV FLASK_APP=app_flask.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# アプリケーションを起動（Flask直接起動）
CMD ["python", "app_flask.py"]
