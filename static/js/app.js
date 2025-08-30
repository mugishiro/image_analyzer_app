// DOM要素の取得
const imageInput = document.getElementById('imageInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const confidenceThreshold = document.getElementById('confidenceThreshold');
const confidenceValue = document.getElementById('confidenceValue');
const imagePreview = document.getElementById('imagePreview');
const detectionList = document.getElementById('detectionList');
const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

// グローバル変数
let currentDetections = [];

// 信頼度閾値の更新
confidenceThreshold.addEventListener('input', function() {
    confidenceValue.textContent = this.value;
});

// 画像選択時の処理
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        currentDetections = [];

        // 分析ボタンを有効化
        analyzeBtn.disabled = false;

        // 画像プレビューを表示
        displayImagePreview(file);

        // 検出結果をクリア
        detectionList.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                画像 "${file.name}" が選択されました。分析ボタンをクリックしてください。
            </div>
        `;
    }
});

// 画像プレビューの表示
function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="プレビュー" class="img-fluid" style="max-height: 300px;">
        `;
    };
    reader.readAsDataURL(file);
}

// 分析ボタンのクリック処理
analyzeBtn.addEventListener('click', function() {
    const file = imageInput.files[0];
    if (!file) {
        showAlert('画像を選択してください', 'warning');
        return;
    }

    // ローディングモーダルを表示
    loadingModal.show();

    // FormDataの作成
    const formData = new FormData();
    formData.append('image', file);
    formData.append('confidence_threshold', confidenceThreshold.value);

    // APIリクエスト
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        loadingModal.hide();

        if (data.success) {
            currentDetections = data.detections;
            // 全検出結果も保存
            if (data.all_detections) {
                window.allDetections = data.all_detections;
            }
            displayDetectionResults(data);
        } else {
            showAlert(data.error, 'danger');
        }
    })
    .catch(error => {
        loadingModal.hide();
        console.error('Error:', error);
        showAlert('分析中にエラーが発生しました', 'danger');
    });
});

// 検出結果の表示
function displayDetectionResults(data) {
    let detectionHtml = '';

    // 分析完了メッセージ
    detectionHtml += `
        <div class="alert alert-success fade-in mb-3">
            <h6><i class="fas fa-check-circle"></i> 分析完了</h6>
            <p>検出された物体: ${data.filtered_count}個 (総数: ${data.total_detected}個)</p>
            <p>信頼度閾値: ${(data.confidence_threshold * 100).toFixed(0)}%</p>
        </div>
    `;

    // 検出された物体のリスト
    if (data.detections && data.detections.length > 0) {

        data.detections.forEach((detection, index) => {
            const confidencePercent = (detection.confidence * 100).toFixed(1);
            const bbox = detection.bbox;
            const [x1, y1, x2, y2] = bbox;
            const width = Math.round(x2 - x1);
            const height = Math.round(y2 - y1);

            // 信頼度に基づいてバッジの色を変更
            let badgeClass = 'bg-primary';
            if (detection.confidence >= 0.8) {
                badgeClass = 'bg-success';
            } else if (detection.confidence >= 0.6) {
                badgeClass = 'bg-primary';
            } else {
                badgeClass = 'bg-secondary';
            }

            detectionHtml += `
                <div class="detection-item fade-in">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${index + 1}. ${detection.class}</h6>
                            <p class="mb-1 text-muted">信頼度: ${confidencePercent}%</p>
                            <p class="mb-2 text-muted small">
                                <i class="fas fa-map-marker-alt"></i>
                                位置: (${Math.round(x1)}, ${Math.round(y1)}) - (${Math.round(x2)}, ${Math.round(y2)})<br>
                                <i class="fas fa-expand-arrows-alt"></i>
                                サイズ: ${width} × ${height} ピクセル
                            </p>
                        </div>
                        <span class="badge ${badgeClass}">${confidencePercent}%</span>
                    </div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                    </div>
                </div>
            `;
        });
    } else {
        detectionHtml += `
            <div class="alert alert-warning fade-in">
                <i class="fas fa-exclamation-triangle"></i>
                指定された信頼度閾値以上の物体が検出されませんでした。
                <br><small>閾値を下げてみてください。</small>
            </div>
        `;
    }

    detectionList.innerHTML = detectionHtml;
}





// アラートの表示
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // 既存のアラートを削除
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // 新しいアラートを追加
    analysisResults.appendChild(alertDiv);

    // 3秒後に自動で消す
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 3000);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // 分析ボタンを無効化
    analyzeBtn.disabled = true;

    // 信頼度閾値の初期表示
    confidenceValue.textContent = confidenceThreshold.value;

    console.log('画像内容分析アプリが読み込まれました');
});


