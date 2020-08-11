var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);


function init() {
  // Создание экземпляра карты и его привязка к контейнеру с
  // заданным id ("map").
  myMap = new ymaps.Map('map', {
    // При инициализации карты обязательно нужно указать
    // её центр и коэффициент масштабирования.
    center: [55.059420, 82.912497], // Москва
    zoom: 16
  }, {
    searchControlProvider: 'yandex#search'
  })
  // Создаём макет содержимого.
  IconContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
  ),

    PlacemarkWithContent = new ymaps.Placemark([55.059420, 82.912497], {
      hintContent: 'Наш адрес',
      balloonContent: 'Площадь Калинина',
      iconContent: ''
    }, {
      // Опции.
      // Необходимо указать данный тип макета.
      iconLayout: 'default#imageWithContent',
      // Своё изображение иконки метки.
      iconImageHref: 'img/map-pin.png.svg',
      // Размеры метки.
      iconImageSize: [90, 90],
      // Смещение левого верхнего угла иконки относительно
      // её "ножки" (точки привязки).
      iconImageOffset: [-45, -45],
      // Смещение слоя с содержимым относительно слоя с картинкой.
      iconContentOffset: [15, 15],
      // Макет содержимого.
      iconContentLayout: IconContentLayout
    });

  myMap.geoObjects
    .add(PlacemarkWithContent);
}