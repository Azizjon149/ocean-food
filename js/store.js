/* Корзина: { "dishId:variantIndex": qty } с сохранением в localStorage */
(function () {
  let items = {};
  try { items = JSON.parse(localStorage.getItem("of.cart") || "{}") || {}; } catch (e) { items = {}; }
  // выкинуть позиции, которых больше нет в меню
  for (const k of Object.keys(items)) {
    const [id, i] = k.split(":");
    if (!OF.menuById[id] || !OF.menuById[id].variants[+i] || !(items[k] > 0)) delete items[k];
  }
  const subs = [];
  const save = () => { try { localStorage.setItem("of.cart", JSON.stringify(items)); } catch (e) {} };
  const emit = () => { save(); subs.forEach((f) => f()); };

  OF.cart = {
    onChange(fn) { subs.push(fn); },
    qty(key) { return items[key] || 0; },
    add(key, n = 1) { items[key] = (items[key] || 0) + n; emit(); },
    set(key, n) { if (n <= 0) delete items[key]; else items[key] = Math.min(n, 99); emit(); },
    clear() { items = {}; emit(); },
    lines() {
      return Object.entries(items).map(([key, qty]) => {
        const [id, i] = key.split(":");
        const dish = OF.menuById[id];
        const variant = dish.variants[+i];
        return { key, qty, dish, index: +i, variant, sum: variant.price * qty };
      });
    },
    count() { return Object.values(items).reduce((a, b) => a + b, 0); },
    total() { return this.lines().reduce((a, l) => a + l.sum, 0); },
    /* Текст заказа для Telegram (всегда на русском, чтобы кухня видела одно и то же) */
    text(comment = "") {
      const f = OF.i18n.fmt;
      const rows = this.lines().map((l) => {
        const multi = l.dish.variants.length > 1;
        const label = multi ? ` (${l.variant.label ? l.variant.label.ru : f(l.variant.price)})` : "";
        return `${l.dish.name.ru}${label} ×${l.qty} — ${f(l.sum)} сум`;
      });
      const note = comment.trim() ? `\n\nКомментарий: ${comment.trim()}` : "";
      return `Ocean Food — новый заказ\n\n${rows.join("\n")}\n\nИтого: ${f(this.total())} сум${note}`;
    },
  };
})();
