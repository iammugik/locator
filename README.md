# Express Card — Locator

**АЗС-Локатор** – это поисково-информационный сервис, который позволяет:
* Посмотреть карты, с нанесенными на них АЗС
* Посмотреть карточку АЗС, на которой предоставлена информация об адресе АЗС, её координатах, а также доступных дополнительных услугах
* Построить маршрут между двумя точками с отображением на нем доступных АЗС
* Построить маршрут до ближайшей АЗС от текущего местоположения

## Команды для разработчиков

``` bash
# Установка зависимостей
$ npm ci

# Запуск проекта дл разработки
$ npm run dev

# Генерация статики для отправки её на сервер
$ npm run generate
```

## Текущие задачи

- [x] Обновление зависимостей на проекте
- [x] Новый API взаимодействия с Vuex
- [x] Проблема с отображением картинок
- [x] Добавление карты Татнефть
- [x] Добавление картинок к картам через административную панель
- [x] В локатор добавить капельку шиномонтаж.
- [ ] Возможность сделать прямую ссылку на все точки одного эмитента.
- [X] Прямую ссылку на геопозицию (latitude, longitude) и address.
