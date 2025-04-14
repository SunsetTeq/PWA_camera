import os
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# segment import
import cv2

import tensorflow as tf
import numpy as np

VERIFY_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models/verify_model.keras')
verify_model = tf.keras.models.load_model(VERIFY_MODEL_PATH)
class_names = ['bad', 'good']

def verify_image(verify_model, image_path, class_names, image_size=(224, 224)):
    # Загружаем изображение и приводим его к нужному размеру
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=image_size)
    # Преобразуем изображение в массив
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    # Приводим к типу float32 (train_dataset возвращает tf.float32 изображения в диапазоне [0,255])
    img_array = tf.cast(img_array, tf.float32)
    # Добавляем измерение батча, чтобы форма была (1, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = verify_model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    return class_names[predicted_index]




# НАХОЖДЕНИЕ ПЛОЩАДИ (ВЫНЕСТИ В ОТДЕЛЬНЫЙ МОДУЛЬ)*************************************************************

IMG_HEIGHT, IMG_WIDTH = 224, 224

SEGMENT_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models/segment_model.keras')
segment_model = tf.keras.models.load_model(SEGMENT_MODEL_PATH)

def load_and_prepare_image_inference(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_resized = cv2.resize(image_rgb, (IMG_WIDTH, IMG_HEIGHT))
    image_input = image_resized / 255.0
    return np.expand_dims(image_input, axis=0).astype(np.float32), image_resized

def predict_mask(image_path, model, threshold=0.5):
    input_image, orig_image = load_and_prepare_image_inference(image_path)
    pred_mask = model.predict(input_image)[0]
    binary_mask = (pred_mask[..., 0] > threshold).astype(np.uint8) * 255
    return binary_mask, orig_image

def calculate_area(binary_mask):
    # Подсчет площади по пикселям (белые пиксели = 255)
    area_pixels = np.sum(binary_mask == 255)
    return area_pixels

# *********************************************************************************************************************


# Папка для сохранения фото
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

LOG_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
LOG_FILE = os.path.join(LOG_FOLDER, 'predictions.log')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(LOG_FOLDER, exist_ok=True)

@csrf_exempt  
def upload_photo(request):
    if request.method == 'POST' and request.FILES.get('photo'):
        photo = request.FILES['photo']

        name, extension = os.path.splitext(photo.name)
        unique_filename = f"{name}_{int(time.time()*1000)}{extension}"  # добавляем метку времени для создания уникального имени
       
        # Сохраняем файл в UPLOAD_FOLDER
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)

        # Получаем предсказание
        predicted_class = verify_image(verify_model, file_path, class_names, image_size=(224, 224))

        if (predicted_class != 'bad'):
            mask_pred, _ = predict_mask(file_path, segment_model, threshold=0.5)
            area_px = calculate_area(mask_pred)
            response_message = f"Площадь изображения в пикселях = {area_px}"
        else:
            response_message = "Переделайте фото, пожалуйста"

        # Сохраняем результат в лог-файл
        log_entry = f"{unique_filename} - {predicted_class}\n"
        with open(LOG_FILE, 'a') as log_file:
            log_file.write(log_entry)

        return JsonResponse({
            'message': response_message,
            'predicted_class': predicted_class,
            'filename': unique_filename
        })
    return JsonResponse({'error': 'Неверный запрос'}, status=400)

