/* Меню: карточки + лист блюда */
(function () {
  const { h, svg } = OF;
  const t = (k, v) => OF.i18n.t(k, v);
  const grid = document.getElementById("menu-grid");

  const PLUS = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>';
  const MINUS = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/></svg>';
  const CLOSE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  OF.icons = { PLUS, MINUS, CLOSE };

  const variantLabel = (d, i) => OF.i18n.pick(d.variants[i].label) || t("variant", { n: i + 1 });
  OF.variantLabel = variantLabel;

  /* медиа: типографическая плашка, поверх неё — фото, если оно задано в данных */
  function media(dish, { lazy = true, count = false } = {}) {
    const name = OF.i18n.pick(dish.name);
    const el = h("div", { class: `media media--ph media--${dish.accent}` },
      h("span", { class: "media-letter", "aria-hidden": "true", text: name.trim().charAt(0).toUpperCase() }));
    if (dish.photo) {
      const img = h("img", { src: dish.photo, alt: name, decoding: "async", loading: lazy ? "lazy" : "eager" });
      img.addEventListener("load", () => img.classList.add("is-loaded"));
      img.addEventListener("error", () => img.remove());
      el.append(img);
    }
    if (count && dish.variants.length > 1) el.append(h("span", { class: "media-count", text: t("options", { n: dish.variants.length }) }));
    return el;
  }

  function card(dish, i) {
    const multi = dish.variants.length > 1;
    const name = OF.i18n.pick(dish.name);
    const main = h("button", { class: "card-main", type: "button", "data-open": dish.id, "aria-label": `${name}, ${OF.i18n.price(OF.minPrice(dish), multi ? "from" : "plain")}` },
      media(dish, { count: true }),
      h("span", { class: "card-body" },
        h("span", { class: "card-name", text: name }),
        h("span", { class: "card-price", text: OF.i18n.price(OF.minPrice(dish), multi ? "from" : "plain") })));
    const add = h("button", { class: "card-add", type: "button", "data-quick": dish.id, "aria-label": `${t("add")}: ${name}` });
    add.innerHTML = PLUS;
    return h("article", { class: "card", style: `--i:${Math.min(i, 10)}` }, main, add);
  }

  OF.menuView = {
    render() {
      grid.replaceChildren(...OF.menu.map(card));
    },
    /* быстрое добавление: если вариант один — сразу в заказ, иначе открыть лист */
    quick(id, btn) {
      const d = OF.menuById[id];
      if (d.variants.length > 1) { OF.router.go(`#/menu/${id}`); return; }
      OF.cart.add(`${id}:0`);
      OF.haptic("light");
      OF.toast(t("added"));
      if (btn) { btn.classList.remove("is-done"); void btn.offsetWidth; btn.classList.add("is-done"); }
    },

    /* лист блюда */
    buildDish(id) {
      const d = OF.menuById[id];
      const multi = d.variants.length > 1;
      let sel = 0, qty = 1;

      const sum = h("span", { class: "btn-sum" });
      const out = h("output", { "aria-live": "polite", text: "1" });
      const priceBig = h("p", { class: "sheet-price" });
      const dec = h("button", { type: "button", "aria-label": t("qty.dec") });
      const inc = h("button", { type: "button", "aria-label": t("qty.inc") });
      dec.innerHTML = MINUS; inc.innerHTML = PLUS;

      const rows = d.variants.map((v, i) => {
        const b = h("button", { class: "variant", type: "button", role: "radio", "aria-checked": String(i === 0), "data-i": i },
          h("span", { class: "v-name" }, h("span", { class: "v-dot", "aria-hidden": "true" }), variantLabel(d, i)),
          h("span", { class: "v-price", text: OF.i18n.price(v.price) }));
        return b;
      });

      const update = () => {
        const price = d.variants[sel].price;
        rows.forEach((b, i) => b.setAttribute("aria-checked", String(i === sel)));
        out.textContent = qty;
        sum.textContent = OF.i18n.price(price * qty);
        priceBig.textContent = OF.i18n.price(price);
        dec.disabled = qty <= 1;
        dec.style.opacity = qty <= 1 ? 0.35 : 1;
      };

      const group = h("div", { class: "variants", role: "radiogroup", "aria-label": t("variant.pick") }, rows);
      group.addEventListener("click", (e) => {
        const b = e.target.closest(".variant"); if (!b) return;
        sel = +b.dataset.i; OF.haptic("light"); update();
      });
      dec.addEventListener("click", () => { if (qty > 1) { qty--; update(); } });
      inc.addEventListener("click", () => { if (qty < 99) { qty++; update(); } });

      const addBtn = h("button", { class: "btn btn--primary", type: "button" }, h("span", { text: t("add") }), sum);
      addBtn.addEventListener("click", () => {
        OF.cart.add(`${id}:${sel}`, qty);
        OF.haptic("medium");
        OF.toast(t("added"));
        OF.router.back();
      });

      const closeBtn = h("button", { class: "sheet-close", type: "button", "aria-label": t("close"), "data-sheet-close": "" });
      closeBtn.innerHTML = CLOSE;

      const frag = document.createDocumentFragment();
      const m = media(d, { lazy: false });
      m.classList.add("sheet-media");
      frag.append(
        closeBtn, m,
        h("div", { class: "sheet-body" },
          h("h2", { class: "sheet-title", id: "sheet-title", text: OF.i18n.pick(d.name) }),
          d.desc ? h("p", { class: "sheet-desc", text: OF.i18n.pick(d.desc) }) : null,
          multi ? h("p", { class: "sheet-label", text: t("variant.pick") }) : null,
          multi ? group : priceBig),
        h("div", { class: "sheet-actions" }, h("div", { class: "stepper" }, dec, out, inc), addBtn));
      update();
      return { node: frag, labelledby: "sheet-title", focus: closeBtn };
    },
  };

  grid.addEventListener("click", (e) => {
    const q = e.target.closest("[data-quick]");
    if (q) { OF.menuView.quick(q.dataset.quick, q); return; }
    const o = e.target.closest("[data-open]");
    if (o) OF.router.go(`#/menu/${o.dataset.open}`);
  });
})();
