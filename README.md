# Millenial invest

Приложение для анализа инвестиционного портфеля.

![image](https://user-images.githubusercontent.com/60402289/120719901-86516180-c4e4-11eb-9d35-2e6fe57c1b0a.png)
![image](https://user-images.githubusercontent.com/60402289/120719935-9701d780-c4e4-11eb-93d6-2340f5e62436.png)
![image](https://user-images.githubusercontent.com/60402289/120719979-af71f200-c4e4-11eb-89b0-bd4b4ac9a1c5.png)

# Техническая часть

* Приложение написано на Electron js.
* Данные о протфеле берутся из отчета брокера в формате xlsx.
* После прочтения excel файла данные добавляются в таблицу базы данных приложения.
* Для доступа к БД используется SQLite3.
* Для составления аналитики и получения данных о ценных бумагах использауется Yahoo finance api.
* Для постороения графиков и диаграмм используется библиотека Chart.js 3.
