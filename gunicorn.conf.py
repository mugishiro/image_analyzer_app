# Gunicorn設定ファイル
import multiprocessing

# ワーカー数（CPUコア数 × 2 + 1）
workers = multiprocessing.cpu_count() * 2 + 1

# ワーカークラス
worker_class = 'sync'

# バインドアドレス
bind = '0.0.0.0:5000'

# タイムアウト設定（秒）
timeout = 120
keepalive = 2

# ログ設定
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# プロセス名
proc_name = 'image-analyzer'

# デーモン化（本番環境ではFalse）
daemon = False

# ユーザー/グループ（本番環境で設定）
# user = 'www-data'
# group = 'www-data'

# 最大リクエスト数（メモリリーク対策）
max_requests = 1000
max_requests_jitter = 100

# プリロード（メモリ使用量削減）
preload_app = True
