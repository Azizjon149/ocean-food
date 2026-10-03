/* Экран заказа + подтверждение */
(function () {
  const { h } = OF;
  const t = (k, v) => OF.i18n.t(k, v);
  const body = document.getElementById("cart-body");
  let animate = true;

  function stepper(l) {
    const dec = h("button", { type: "button", "aria-label": t("qty.dec") });
    const inc = h("button", { type: "button", "aria-label": t("qty.inc") });
    dec.innerHTML = OF.icons.MINUS; inc.innerHTML = OF.icons.PLUS;
    dec.addEventListener("click", () => { OF.haptic("light"); OF.cart.set(l.key, l.qty - 1); });
    inc.addEventListener("click", () => { OF.haptic("light"); OF.cart.set(l.key, l.qty + 1); });
    return h("div", { class: "stepper stepper--sm" }, dec, h("output", { text: l.qty }), inc);
  }

  function empty() {
    const wrap = h("div", { class: "empty" },
      h("div", { class: "empty-art" }, h("img", { src: "images/logo-192.png", alt: "", width: 120, height: 120 })),
      h("h2", { text: t("cart.empty") }),
      h("p", { text: t("cart.empty.sub") }),
      h("button", { class: "btn btn--primary", type: "button", text: t("to.menu") }));
    wrap.querySelector("button").addEventListener("click", () => OF.router.back());
    return wrap;
  }

  OF.cartView = {
    render() {
      const lines = OF.cart.lines();
      if (!lines.length) { body.replaceChildren(empty()); return; }
      const list = h("ul", { class: "lines" }, lines.map((l, i) => {
        const multi = l.dish.variants.length > 1;
        return h("li", { class: "line", style: animate ? `animation-delay:${i * 40}ms` : "animation:none" },
          h("div", null,
            h("div", { class: "line-name", text: OF.i18n.pick(l.dish.name) }),
            multi ? h("div", { class: "line-var", text: OF.variantLabel(l.dish, l.index) }) : null),
          h("div", { class: "line-sum", text: OF.i18n.price(l.sum) }),
          h("div", { class: "line-unit", text: OF.i18n.price(l.variant.price) }),
          stepper(l));
      }));
      const clear = h("button", { class: "btn btn--ghost", type: "button", text: t("cart.clear") });
      clear.addEventListener("click", () => { OF.cart.clear(); OF.toast(t("cart.cleared")); });
      const go = h("button", { class: "btn btn--primary", type: "button", text: t("cart.checkout") });
      go.addEventListener("click", () => OF.cartView.checkout());
      const foot = h("div", { class: "cart-foot" },
        h("div", { class: "total-row" }, h("span", { text: t("cart.total") }), h("b", { text: OF.i18n.price(OF.cart.total()) })),
        h("div", { class: "cart-actions" }, clear, go));
      body.replaceChildren(list, foot);
      animate = false;
    },
    resetAnim() { animate = true; },

    /* Бэкенда для приёма заказов в проекте нет, поэтому показываем чек для кассы.
       Если в Telegram подключён бот — включите OF.config.sendOrderToBot. */
    checkout() {
      if (OF.config.sendOrderToBot && OF.tg.inTelegram) {
        try {
          OF.tg.app.sendData(JSON.stringify({ lines: OF.cart.lines().map((l) => ({ id: l.dish.id, variant: l.index, qty: l.qty, price: l.variant.price })), total: OF.cart.total() }));
          return;
        } catch (e) { /* падаем на чек */ }
      }
      OF.haptic("medium");
      OF.sheet.open(() => {
        const closeBtn = h("button", { class: "btn btn--primary", type: "button", text: t("order.done"), "data-sheet-close": "" });
        const copy = h("button", { class: "btn btn--ghost", type: "button", text: t("order.copy") });
        copy.addEventListener("click", async () => {
          const text = OF.cart.text();
          let ok = false;
          try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
            try {
              const ta = h("textarea", { style: "position:fixed;opacity:0;top:0" }); ta.value = text;
              document.body.append(ta); ta.select(); ok = document.execCommand("copy"); ta.remove();
            } catch (e2) {}
          }
          OF.toast(ok ? t("order.copied") : t("order.copyfail"));
        });
        const receipt = h("ul", { class: "receipt selectable" },
          OF.cart.lines().map((l) => h("li", null,
            h("span", { text: `${OF.i18n.pick(l.dish.name)}${l.dish.variants.length > 1 ? " (" + OF.variantLabel(l.dish, l.index) + ")" : ""} x${l.qty}` }),
            h("span", { text: OF.i18n.fmt(l.sum) }))),
          h("li", { class: "rt" }, h("span", { text: t("cart.total") }), h("span", { text: OF.i18n.price(OF.cart.total()) })));
        const x = h("button", { class: "sheet-close", type: "button", "aria-label": t("close"), "data-sheet-close": "" }); x.innerHTML = OF.icons.CLOSE;
        const node = document.createDocumentFragment();
        node.append(x, h("div", { class: "sheet-body", style: "padding-top:28px" },
          h("h2", { class: "sheet-title", id: "sheet-title", text: t("order.title") }), receipt,
          h("p", { class: "sheet-note", text: t("order.show") })),
          h("div", { class: "sheet-actions", style: "padding-top:16px" }, copy, closeBtn));
        return { node, labelledby: "sheet-title", focus: closeBtn };
      }, { kind: "order" });
    },
  };
})();
