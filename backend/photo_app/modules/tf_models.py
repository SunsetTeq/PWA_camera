import os
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VERIFY_MODEL_PATH = os.path.join(BASE_DIR, '../models/verify_model.keras')
SEGMENT_MODEL_PATH = os.path.join(BASE_DIR, '../models/segment_model.keras')

verify_model = tf.keras.models.load_model(VERIFY_MODEL_PATH)
segment_model = tf.keras.models.load_model(SEGMENT_MODEL_PATH)

class_names = ['bad', 'good']
IMG_HEIGHT, IMG_WIDTH = 224, 224