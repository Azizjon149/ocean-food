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
    text() {
      const t = OF.i18n.t.bind(OF.i18n);
      const rows = this.lines().map((l) => {
        const multi = l.dish.variants.length > 1;
        const label = multi ? ` (${OF.i18n.pick(l.variant.label) || t("variant", { n: l.index + 1 })})` : "";
        return `${OF.i18n.pick(l.dish.name)}${label} x${l.qty} - ${OF.i18n.fmt(l.sum)}`;
      });
      return `Ocean Food\n${rows.join("\n")}\n${t("cart.total")}: ${OF.i18n.price(this.total())}`;
    },
  };
})();
