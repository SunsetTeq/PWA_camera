import os

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

LOG_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../logs')
LOG_FILE = os.path.join(LOG_FOLDER, 'predictions.log')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(LOG_FOLDER, exist_ok=True)
