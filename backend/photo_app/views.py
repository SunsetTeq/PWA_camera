import os
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

import tensorflow as tf
import numpy as np

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models/my_model.keras')
model = tf.keras.models.load_model(MODEL_PATH)
class_names = ['bad', 'good']

def predict_single_image(model, image_path, class_names, image_size=(224, 224)):
    # Загружаем изображение и приводим его к нужному размеру
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=image_size)
    # Преобразуем изображение в массив
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    # Приводим к типу float32 (train_dataset возвращает tf.float32 изображения в диапазоне [0,255])
    img_array = tf.cast(img_array, tf.float32)
    # Добавляем измерение батча, чтобы форма была (1, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    return class_names[predicted_index]

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
        predicted_class = predict_single_image(model, file_path, class_names, image_size=(224, 224))

        # Сохраняем результат в лог-файл
        log_entry = f"{unique_filename} - {predicted_class}\n"
        with open(LOG_FILE, 'a') as log_file:
            log_file.write(log_entry)

        # Формируем сообщение для фронтенда
        if predicted_class == 'bad':
            response_message = "Переделайте фото, пожалуйста"
        else:
            response_message = "Фото хорошее!"

        return JsonResponse({
            'message': response_message,
            'predicted_class': predicted_class,
            'filename': unique_filename
        })
    return JsonResponse({'error': 'Неверный запрос'}, status=400)

