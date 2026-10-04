/* ==========================================================
   Локализация RU / UZ / EN — единственное место со строками UI.
   Шрифты Cafe* не содержат ʻ ’ « » …  — поэтому в UZ только ASCII '
   ========================================================== */
(function () {
  OF.LANGS = ["ru", "uz", "en"];

  const dict = {
    ru: {
      "brand.sub": "Фастфуд",
      "slogan": "Mehrli qullardan samimiy insonlarga.",
      "welcome": "Добро пожаловать в Ocean Food",
      "cta.menu": "Открыть меню",
      "hint.scene": "Нажмите на доску, кассу или стол",
      "hot.board": "Меню", "hot.till": "Касса", "hot.table": "Стол",
      "table.say": "Присаживайтесь! Выбор за вами.",
      "menu.title": "Меню", "menu.sub": "Выберите, что хотите",
      "price.from": "от {p} сум", "price.plain": "{p} сум", "price.short": "{p}",
      "options": "Вариантов: {n}",
      "variant": "Вариант {n}", "variant.pick": "Выберите вариант",
      "add": "Добавить", "added": "Добавлено в заказ", "removed": "Убрано из заказа",
      "cart.title": "Заказ", "cart.open": "Открыть заказ",
      "cart.empty": "Пока пусто", "cart.empty.sub": "Выберите что-нибудь вкусное в меню",
      "cart.total": "Итого", "cart.checkout": "Заказать", "cart.clear": "Очистить",
      "cart.cleared": "Заказ очищен", "cart.bar": "Заказ",
      "order.title": "Ваш заказ", "order.show": "Покажите заказ на кассе",
      "order.copy": "Скопировать", "order.copied": "Заказ скопирован", "order.copyfail": "Не удалось скопировать",
      "order.done": "Готово",
      "cart.comment": "Комментарий (необязательно)", "cat.all": "Все", "cat.lavash": "Лаваш", "cat.hotdog": "Хот-доги", "cat.burger": "Бургеры", "cat.other": "Другое", "cat.combo": "Комбо", "order.sent": "Откройте чат и отправьте заказ. Текст скопирован",
      "back": "Назад", "close": "Закрыть", "lang": "Язык",
      "qty.dec": "Меньше", "qty.inc": "Больше",
      "to.menu": "В меню", "nf": "Такого блюда нет",
    },
    uz: {
      "brand.sub": "Fast food",
      "slogan": "Mehrli qullardan samimiy insonlarga.",
      "welcome": "Ocean Food'ga xush kelibsiz",
      "cta.menu": "Menyuni ochish",
      "hint.scene": "Taxta, kassa yoki stolni bosing",
      "hot.board": "Menyu", "hot.till": "Kassa", "hot.table": "Stol",
      "table.say": "Marhamat, o'tiring! Tanlov sizniki.",
      "menu.title": "Menyu", "menu.sub": "Xohlaganingizni tanlang",
      "price.from": "{p} so'mdan", "price.plain": "{p} so'm", "price.short": "{p}",
      "options": "Variantlar: {n}",
      "variant": "{n}-variant", "variant.pick": "Variantni tanlang",
      "add": "Qo'shish", "added": "Buyurtmaga qo'shildi", "removed": "Buyurtmadan olib tashlandi",
      "cart.title": "Buyurtma", "cart.open": "Buyurtmani ochish",
      "cart.empty": "Hozircha bo'sh", "cart.empty.sub": "Menyudan mazali narsa tanlang",
      "cart.total": "Jami", "cart.checkout": "Buyurtma berish", "cart.clear": "Tozalash",
      "cart.cleared": "Buyurtma tozalandi", "cart.bar": "Buyurtma",
      "order.title": "Sizning buyurtmangiz", "order.show": "Buyurtmani kassada ko'rsating",
      "order.copy": "Nusxalash", "order.copied": "Buyurtma nusxalandi", "order.copyfail": "Nusxalab bo'lmadi",
      "order.done": "Tayyor",
      "cart.comment": "Izoh (ixtiyoriy)", "cat.all": "Hammasi", "cat.lavash": "Lavash", "cat.hotdog": "Hot dog", "cat.burger": "Burger", "cat.other": "Boshqa", "cat.combo": "Kombo", "order.sent": "Chatni oching va buyurtmani yuboring. Matn nusxalandi",
      "back": "Orqaga", "close": "Yopish", "lang": "Til",
      "qty.dec": "Kamaytirish", "qty.inc": "Ko'paytirish",
      "to.menu": "Menyuga", "nf": "Bunday taom yo'q",
    },
    en: {
      "brand.sub": "Fast food",
      "slogan": "Mehrli qullardan samimiy insonlarga.",
      "welcome": "Welcome to Ocean Food",
      "cta.menu": "Open the menu",
      "hint.scene": "Tap the board, the till or the table",
      "hot.board": "Menu", "hot.till": "Till", "hot.table": "Table",
      "table.say": "Take a seat. The choice is yours.",
      "menu.title": "Menu", "menu.sub": "Pick what you like",
      "price.from": "from {p} UZS", "price.plain": "{p} UZS", "price.short": "{p}",
      "options": "Options: {n}",
      "variant": "Option {n}", "variant.pick": "Choose an option",
      "add": "Add", "added": "Added to order", "removed": "Removed from order",
      "cart.title": "Order", "cart.open": "Open order",
      "cart.empty": "Nothing here yet", "cart.empty.sub": "Pick something tasty from the menu",
      "cart.total": "Total", "cart.checkout": "Order", "cart.clear": "Clear",
      "cart.cleared": "Order cleared", "cart.bar": "Order",
      "order.title": "Your order", "order.show": "Show this order at the till",
      "order.copy": "Copy", "order.copied": "Order copied", "order.copyfail": "Could not copy",
      "order.done": "Done",
      "cart.comment": "Comment (optional)", "cat.all": "All", "cat.lavash": "Lavash", "cat.hotdog": "Hot dogs", "cat.burger": "Burgers", "cat.other": "Other", "cat.combo": "Combos", "order.sent": "Open the chat and send the order. Text copied",
      "back": "Back", "close": "Close", "lang": "Language",
      "qty.dec": "Less", "qty.inc": "More",
      "to.menu": "To menu", "nf": "No such dish",
    },
  };

  let lang = "ru";
  const listeners = [];

  OF.i18n = {
    get lang() { return lang; },
    t(key, vars) {
      let s = (dict[lang] && dict[lang][key]) ?? dict.ru[key] ?? key;
      if (vars) for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
      return s;
    },
    /* локализованное поле данных: {ru,uz,en} */
    pick(obj) { return obj ? obj[lang] || obj.ru || "" : ""; },
    fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); },
    price(n, kind = "plain") { return this.t("price." + kind, { p: this.fmt(n) }); },
    /* проставить переводы в DOM: data-i18n, data-i18n-aria, data-i18n-title */
    apply(root = document) {
      root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = this.t(el.dataset.i18n); });
      root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", this.t(el.dataset.i18nAria)); });
      root.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = this.t(el.dataset.i18nTitle); });
    },
    set(next, { silent = false } = {}) {
      if (!OF.LANGS.includes(next)) return;
      lang = next;
      document.documentElement.lang = next;
      try { localStorage.setItem("of.lang", next); } catch (e) {}
      this.apply();
      if (!silent) listeners.forEach((fn) => fn(next));
    },
    onChange(fn) { listeners.push(fn); },
    detect() {
      let saved = null;
      try { saved = localStorage.getItem("of.lang"); } catch (e) {}
      if (OF.LANGS.includes(saved)) return saved;
      const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
      const raw = (tgLang || navigator.language || "ru").slice(0, 2).toLowerCase();
      return OF.LANGS.includes(raw) ? raw : "ru";
    },
  };
})();
