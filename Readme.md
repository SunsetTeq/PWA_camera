# PWA Camera Application

Это прогрессивное веб-приложение (PWA) позволяет открывать камеру на мобильных устройствах, делать фото и загружать его на сервер:
- **Frontend (React):** Основная часть. Приложение, созданное с помощью [Create React App](https://create-react-app.dev/) с шаблоном PWA (npx create-react-app my-pwa-app --template cra-template-pwa)
- **Backend (Django):** REST API для приёма фотографий, сохранённых в папке `uploads` (Пока без базы данных)

Основная часть приложения это frontend/src/components/CameraComponent.jsx. Там реализован компонент камеры

## Технологии

- **React** – Фронтенд-приложение, созданное с помощью Create React App (PWA-шаблон)
- **Django** – Бэкенд, реализующий API для загрузки фото
- **PWA** – Приложение можно установить на мобильный экран
- **mkcert** – Для генерации локальных HTTPS-сертификатов, используемых в разработке
- **django-extensions / Werkzeug** – Для запуска HTTPS-сервера с помощью runserver_plus

## Запуск
* Здесь должна быть подготовка
* В папке frontend выполнить npm start  
* В папке backend выполнить python manage.py runserver_plus --cert-file 192.168.1.181.pem --key-file 192.168.1.181-key.pem 0.0.0.0:8000
