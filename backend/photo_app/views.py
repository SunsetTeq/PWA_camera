import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Папка для сохранения фото
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@csrf_exempt  # Для упрощения; на продакшене настройте CSRF корректно
def upload_photo(request):
    if request.method == 'POST' and request.FILES.get('photo'):
        photo = request.FILES['photo']

        # Сохраняем файл в UPLOAD_FOLDER, можно добавить обработку или переименование
        file_path = os.path.join(UPLOAD_FOLDER, photo.name)
        with open(file_path, 'wb+') as destination:
            for chunk in photo.chunks():
                destination.write(chunk)

        return JsonResponse({'message': 'Фото успешно загружено', 'filename': photo.name})
    return JsonResponse({'error': 'Неверный запрос'}, status=400)
