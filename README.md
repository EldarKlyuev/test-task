# Тестовое задание

### Запуск frontend

```
cd frontend
npm install
npm start
```

### Запуск backend

<p>Для начала создадим виртуальное окружение</p>
<b>Для Windows</b>

```
сd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
<b>Для Linux</b>
```
сd backend
python3 -m venv venv
source venv\bin\activate
pip3 install -r requirements.txt
```

<b>Запуск сервера</b>

```
сd test_task
python manage.py runserver
```

<p>В данной проекте уже выполнены нужные миграции в БД. Данные в таблицах БД не изменялись в течение выполения задания</p>