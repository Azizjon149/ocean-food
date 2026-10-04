/* Экран заказа + подтверждение */
(function () {
  const { h } = OF;
  const t = (k, v) => OF.i18n.t(k, v);
  const body = document.getElementById("cart-body");
  let animate = true;
  let comment = "";

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
      const note = h("textarea", { class: "cart-comment", rows: 2, maxlength: 300, placeholder: t("cart.comment"), "aria-label": t("cart.comment") });
      note.value = comment;
      note.addEventListener("input", () => { comment = note.value; });
      const foot = h("div", { class: "cart-foot" },
        note,
        h("div", { class: "total-row" }, h("span", { text: t("cart.total") }), h("b", { text: OF.i18n.price(OF.cart.total()) })),
        h("div", { class: "cart-actions" }, clear, go));
      body.replaceChildren(list, foot);
      animate = false;
    },
    resetAnim() { animate = true; },

    /* Без сервера: копируем текст и открываем Telegram-чат с готовым сообщением */
    checkout() {
      if (!OF.cart.count()) return;
      const text = OF.cart.text(comment);
      OF.haptic("medium");
      try { navigator.clipboard?.writeText(text).catch(() => {}); } catch (e) {}
      OF.toast(t("order.sent"));
      OF.tg.openLink(OF.tg.orderLink(text));
    },
  };
})();
