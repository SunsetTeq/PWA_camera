import os
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .modules.tf_models import verify_model, segment_model, class_names, IMG_HEIGHT, IMG_WIDTH

from .modules.verification import verify_image
from .modules.segmentation import predict_mask, calculate_area
from .modules.utils import UPLOAD_FOLDER, LOG_FILE

@csrf_exempt  
def upload_photo(request):
    if request.method == 'POST' and request.FILES.get('photo'):
        photo = request.FILES['photo']

        name, extension = os.path.splitext(photo.name)
        unique_filename = f"{name}_{int(time.time()*1000)}{extension}"  # добавляем метку времени для создания уникального имени
       
        # Сохранение изображение в качестве файла в папке
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)

        # Верификация изображения
        predicted_class = verify_image(verify_model, file_path, class_names, image_size=(224, 224))

        # Подсчёт площади, если верификация пройдена
        if (predicted_class != 'bad'):
            mask_pred, _ = predict_mask(file_path, segment_model, IMG_HEIGHT, IMG_WIDTH, threshold=0.5)
            area_px = calculate_area(mask_pred)
            response_message = f"Площадь изображения в пикселях = {area_px}"
        else:
            response_message = "Переделайте фото, пожалуйста"

        # Сохранение результата в лог файл
        log_entry = f"{unique_filename} - {predicted_class}\n"
        with open(LOG_FILE, 'a') as log_file:
            log_file.write(log_entry)

        return JsonResponse({
            'message': response_message,
            'predicted_class': predicted_class,
            'filename': unique_filename
        })
    return JsonResponse({'error': 'Неверный запрос'}, status=400)

