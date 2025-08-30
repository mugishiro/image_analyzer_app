from flask import Flask, request, jsonify, render_template, send_from_directory
import os
from werkzeug.utils import secure_filename
import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO
import torch
import json
from datetime import datetime

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB制限

# アップロードフォルダの設定
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# YOLOモデルの読み込み
def load_model():
    try:
        model = YOLO('yolov8n.pt')
        return model
    except Exception as e:
        print(f"モデルの読み込みに失敗しました: {e}")
        return None

# グローバル変数としてモデルを保持
model = load_model()

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_image(image_path):
    """画像を分析して物体検出を行う"""
    try:
        if model is None:
            return {"error": "モデルが読み込めませんでした"}

        # 画像を読み込み
        image = cv2.imread(image_path)
        if image is None:
            return {"error": "画像の読み込みに失敗しました"}

        # YOLOで物体検出
        results = model(image)

        # 結果を解析
        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # 座標情報
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()

                    # 信頼度
                    confidence = float(box.conf[0])

                    # クラス名
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id]

                    detections.append({
                        'class': class_name,
                        'confidence': confidence,
                        'bbox': [float(x1), float(y1), float(x2), float(y2)]
                    })

        return {"detections": detections}

    except Exception as e:
        return {"error": f"画像分析中にエラーが発生しました: {str(e)}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health():
    """ヘルスチェック用エンドポイント"""
    return jsonify({
        'status': 'healthy',
        'message': 'Image Analyzer App is running',
        'model_loaded': model is not None
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    """画像分析エンドポイント"""
    try:
        # ファイルが存在するかチェック
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': '画像ファイルが選択されていません'})

        file = request.files['image']

        # ファイル名が空でないかチェック
        if file.filename == '':
            return jsonify({'success': False, 'error': 'ファイルが選択されていません'})

        # ファイル形式をチェック
        if not allowed_file(file.filename):
            return jsonify({'success': False, 'error': '対応していないファイル形式です'})

        # 信頼度閾値を取得
        confidence_threshold = float(request.form.get('confidence_threshold', 0.5))

        # ファイルを保存
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # 画像分析を実行
        result = analyze_image(filepath)

        # 一時ファイルを削除
        if os.path.exists(filepath):
            os.remove(filepath)

        if 'error' in result:
            return jsonify({'success': False, 'error': result['error']})

        # 信頼度でフィルタリング
        detections = result['detections']
        filtered_detections = [
            d for d in detections
            if d['confidence'] >= confidence_threshold
        ]

        return jsonify({
            'success': True,
            'detections': filtered_detections,
            'all_detections': detections,  # フィルタリング前の全検出結果
            'total_detected': len(detections),
            'filtered_count': len(filtered_detections),
            'confidence_threshold': confidence_threshold
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'予測に失敗しました: {str(e)}'
        })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    print("画像分析アプリを起動中...")
    port = int(os.environ.get('PORT', 5000))
    print(f"ポート: {port}")
    print(f"モデル読み込み状況: {'成功' if model else '失敗'}")

    # 本番環境ではデバッグモードを無効化
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
