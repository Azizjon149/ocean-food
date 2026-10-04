/* ==========================================================
   OCEAN FOOD — данные меню (по фирменному меню и постеру комбо)
   Цены в сумах. Фото: images/food/<id>.webp
   Вариант без названия показывается по цене; "label" — подпись варианта.
   ========================================================== */
(function () {
  const v = (...prices) => prices.map((price) => ({ price }));
  const L = (ru, uz, en) => ({ ru, uz, en });
  const cheese = (p) => [
    { price: p,        label: L("Без сыра", "Pishloqsiz", "No cheese") },
    { price: p + 3000, label: L("С сыром +3 000", "Pishloqli +3 000", "With cheese +3 000") },
  ];
  const combo = (n, price, cola) => ({
    id: "combo" + n, accent: "red", combo: true,
    name: L(`Комбо на ${n}`, `${n} kishilik kombo`, `Combo for ${n}`),
    desc: L(`Любой фастфуд, ${n} шт. и Cola ${cola} л`, `Istalgan fast food'dan ${n} dona va ${cola}L lik Cola`, `Any ${n} fast food items and ${cola} L Cola`),
    variants: v(price),
  });

  window.OF = window.OF || {};
  OF.menu = [
    { id: "lavash-mini",     accent: "red",    name: L("Лаваш мини",     "Lavash mini",     "Lavash mini"),     variants: cheese(25000) },
    { id: "lavash-obichniy", accent: "yellow", name: L("Лаваш обычный",  "Lavash obichniy", "Lavash regular"),  variants: cheese(30000) },
    { id: "lavash-big",      accent: "blue",   name: L("Лаваш биг",      "Lavash big",      "Lavash big"),      variants: cheese(35000) },
    { id: "lavash-shashlik", accent: "red",    name: L("Лаваш шашлык",   "Lavash shashlik", "Lavash shashlik"), variants: v(30000) },
    { id: "hotdog",          accent: "yellow", name: L("Хот-дог",        "Hot dog",         "Hot dog"),         variants: v(15000, 20000, 25000, 30000) },
    { id: "qazili",          accent: "blue",   name: L("Хот-дог с казы", "Qazili hot dog",  "Qazili hot dog"),  variants: v(25000, 35000) },
    { id: "hotdog-tovuq",    accent: "red",    name: L("Хот-дог с курицей", "Hot dog tovuq", "Chicken hot dog"), variants: v(35000) },
    { id: "hotdog-shashlik", accent: "yellow", name: L("Хот-дог шашлык", "Hot dog shashlik", "Hot dog shashlik"), variants: v(32000) },
    { id: "nonburger",       accent: "blue",   name: L("Нонбургер",      "Non burger",      "Non burger"),      variants: v(27000, 30000, 32000, 35000) },
    { id: "hamburger",       accent: "red",    name: L("Гамбургер",      "Gamburger",       "Hamburger"),
      variants: [...v(25000, 30000, 35000), { price: 25000, label: L("С курицей", "Tovuqli", "Chicken") }, { price: 30000, label: L("С курицей", "Tovuqli", "Chicken") }] },
    { id: "doner",           accent: "yellow", name: L("Донар",          "Donar",           "Doner"),           variants: v(27000, 30000) },
    { id: "chicken",         accent: "blue",   name: L("Курица",         "Chicken",         "Chicken"),         variants: v(35000) },
    { id: "haggi",           accent: "red",    name: L("Хагги",          "Haggi",           "Haggi"),           variants: v(30000, 35000) },
    { id: "assorti",         accent: "yellow", name: L("Океан ассорти",  "Ocean assorti",   "Ocean assorti"),   variants: v(43000) },
    { id: "fries",           accent: "blue",   name: L("Картошка фри",   "Kartoshka fri",   "Fries"),           variants: v(10000, 15000) },
    combo(3, 99000, 1), combo(4, 120000, 1.5), combo(5, 150000, 1.5),
  ].map((d) => ({ photo: `images/food/${d.combo ? "combo" : d.id}.webp`, desc: null, ...d }));

  OF.menuById = Object.fromEntries(OF.menu.map((d) => [d.id, d]));
  OF.minPrice = (d) => Math.min(...d.variants.map((x) => x.price));
})();
