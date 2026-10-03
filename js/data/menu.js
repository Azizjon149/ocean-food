/* ==========================================================
   OCEAN FOOD — данные меню
   Только реальные позиции и цены из проекта (сум).
   Ничего не выдумано: у блюд нет описаний, у вариантов нет
   названий — потому что их нет в исходных данных.

   Чтобы добавить:
   - фото блюда:   photo: "images/food/lavash.webp"
   - название варианта:  { price: 30000, label: { ru:"…", uz:"…", en:"…" } }
   - описание:     desc: { ru:"…", uz:"…", en:"…" }
   ========================================================== */
(function () {
  const v = (...prices) => prices.map((price) => ({ price }));

  window.OF = window.OF || {};
  OF.menu = [
    { id: "lavash",    accent: "red",    name: { ru: "Лаваш",              uz: "Lavash",           en: "Lavash" },              variants: v(30000, 35000, 40000, 35000) },
    { id: "hotdog",    accent: "yellow", name: { ru: "Хот-дог с казы",     uz: "Qazili hot dog",   en: "Qazili hot dog" },      variants: v(30000, 35000) },
    { id: "tovuq",     accent: "blue",   name: { ru: "Курица",             uz: "Tovuq",            en: "Chicken" },             variants: v(40000) },
    { id: "shashlik",  accent: "red",    name: { ru: "Шашлык",             uz: "Shashlik",         en: "Shashlik" },            variants: v(35000) },
    { id: "hamburger", accent: "yellow", name: { ru: "Гамбургер",          uz: "Hamburger",        en: "Hamburger" },           variants: v(30000, 35000, 40000) },
    { id: "nonburger", accent: "blue",   name: { ru: "Нонбургер",          uz: "Nonburger",        en: "Nonburger" },           variants: v(30000, 40000, 50000) },
    { id: "doner",     accent: "red",    name: { ru: "Дёнер",              uz: "Doner",            en: "Doner" },               variants: v(30000, 35000) },
    { id: "xaggi",     accent: "yellow", name: { ru: "Хагги",              uz: "Xaggi",            en: "Xaggi" },               variants: v(35000, 40000) },
    { id: "assorti",   accent: "blue",   name: { ru: "Океан ассорти, хлеб", uz: "Okean assorti non", en: "Okean assorti bread" }, variants: v(45000) },
    { id: "grill",     accent: "red",    name: { ru: "Курица гриль с соусом", uz: "Sousli grill tovuq", en: "Grilled chicken with sauce" }, variants: v(70000) },
    { id: "fries",     accent: "yellow", name: { ru: "Картофель фри",      uz: "Fri kartoshka",    en: "Fries" },               variants: v(15000, 20000) },
  ].map((d) => ({ photo: null, desc: null, ...d }));

  OF.menuById = Object.fromEntries(OF.menu.map((d) => [d.id, d]));
  OF.minPrice = (d) => Math.min(...d.variants.map((x) => x.price));
})();
