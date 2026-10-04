/* Точка входа: связывает экраны, роутер, язык, корзину и лист */
(function () {
  const { h } = OF;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const t = (k, v) => OF.i18n.t(k, v);

  OF.config = { sendOrderToBot: false };
  document.addEventListener("visibilitychange", () => document.documentElement.classList.toggle("is-hidden", document.hidden));

  const app = $("#app");
  const screens = { scene: $("#scene"), menu: $("#menu"), cart: $("#cart") };

  /* ---------- общие кнопки в топбарах ---------- */
  const BAG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M9 10V7a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

  $$('[data-slot="lang"]').forEach((slot) => {
    const g = h("div", { class: "lang", role: "group" });
    OF.LANGS.forEach((l) => g.append(h("button", { type: "button", "data-lang": l, text: l.toUpperCase() })));
    slot.replaceWith(g);
  });
  $$('[data-slot="cart"]').forEach((slot) => {
    const b = h("button", { class: "icon-btn", type: "button", "data-go": "#/cart", "data-i18n-aria": "cart.open" });
    b.innerHTML = BAG;
    b.append(h("span", { class: "badge", "data-cart-count": "", hidden: true, text: "0" }));
    slot.replaceWith(b);
  });

  /* ---------- язык ---------- */
  function paintLang() {
    $$(".lang").forEach((g) => {
      g.setAttribute("aria-label", t("lang"));
      $$("button", g).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === OF.i18n.lang)));
    });
  }
  function switchLang(l) {
    if (l === OF.i18n.lang) return;
    OF.haptic("light");
    app.classList.add("is-swapping");
    setTimeout(() => {
      OF.i18n.set(l);
      requestAnimationFrame(() => app.classList.remove("is-swapping"));
    }, 140);
  }
  OF.i18n.onChange(() => {
    paintLang();
    document.title = "Ocean Food";
    OF.sceneView.renderBoard();
    OF.menuView.render();
    OF.cartView.render();
    updateCart(false);
    if (OF.sheet.kind === "dish") OF.sheet.refresh();
    else if (OF.sheet.kind === "order") OF.sheet.refresh();
  });

  /* ---------- корзина → бейджи, касса, панель ---------- */
  const bar = $("#cartbar");
  let lastCount = 0;
  function updateCart(bump = true) {
    const n = OF.cart.count(), total = OF.cart.total();
    $$("[data-cart-count]").forEach((b) => {
      b.hidden = n === 0; b.textContent = n > 99 ? "99+" : n;
      if (bump && n !== lastCount) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); }
    });
    OF.sceneView.setTill(total);
    bar.hidden = n === 0;
    $("#cartbar-count").textContent = n;
    $("#cartbar-total").textContent = OF.i18n.price(total);
    if (bump && n > lastCount) { bar.classList.remove("bump"); void bar.offsetWidth; bar.classList.add("bump"); }
    lastCount = n;
  }
  OF.cart.onChange(() => { updateCart(); OF.cartView.render(); });
  bar.addEventListener("click", () => OF.router.go("#/cart"));

  /* ---------- лист (dish / order) ---------- */
  const sheetEl = $("#sheet"), panel = $("#sheet-panel");
  let builder = null, lastFocus = null, closeT = 0;
  OF.sheet = {
    kind: null,
    open(build, { kind = "dish" } = {}) {
      clearTimeout(closeT);
      sheetEl.classList.remove("is-closing");
      builder = build; this.kind = kind;
      lastFocus = document.activeElement;
      this._fill();
      sheetEl.hidden = false;
      $("#menu").inert = true; $("#cart").inert = true;
      requestAnimationFrame(() => this._focus?.focus({ preventScroll: true }));
    },
    _fill() {
      const r = builder();
      panel.replaceChildren(r.node);
      panel.setAttribute("aria-labelledby", r.labelledby);
      this._focus = r.focus;
    },
    refresh() { if (builder && !sheetEl.hidden) this._fill(); },
    hide() {
      if (sheetEl.hidden) return;
      sheetEl.classList.add("is-closing");
      this.kind = null; builder = null;
      closeT = setTimeout(() => {
        sheetEl.hidden = true; sheetEl.classList.remove("is-closing");
        applyRoute(OF.router.current);            // вернуть inert по состоянию маршрута
        try { lastFocus?.isConnected && lastFocus.focus({ preventScroll: true }); } catch (e) {}
      }, 280);
    },
    /* закрытие по крестику / фону: для листа блюда — «назад» по истории */
    dismiss() { if (this.kind === "dish") OF.router.back(); else this.hide(); },
  };
  sheetEl.addEventListener("click", (e) => { if (e.target.closest("[data-sheet-close]")) OF.sheet.dismiss(); });

  /* ---------- маршруты ---------- */
  function setScreen(el, open) {
    el.classList.toggle("is-open", open);
    el.inert = !open;
    el.setAttribute("aria-hidden", String(!open));
  }
  function applyRoute(r) {
    const menuOpen = r.name === "menu" || r.name === "dish" || r.name === "cart";
    setScreen(screens.menu, menuOpen);
    setScreen(screens.cart, r.name === "cart");
    if (r.name === "cart") screens.menu.inert = true;
    screens.scene.classList.toggle("is-behind", menuOpen);
    screens.scene.inert = menuOpen;
    if (!sheetEl.hidden && OF.sheet.kind) { screens.menu.inert = true; screens.cart.inert = true; }
  }
  OF.router.onChange((r, prev) => {
    if (r.name === "dish") {
      if (!OF.menuById[r.id]) { OF.toast(t("nf")); OF.router.replace("#/menu"); return; }
      applyRoute(r);
      OF.sheet.open(() => OF.menuView.buildDish(r.id), { kind: "dish" });
      return;
    }
    if (OF.sheet.kind === "dish") OF.sheet.hide();
    if (r.name === "cart" && prev?.name !== "cart") OF.cartView.resetAnim(), OF.cartView.render();
    applyRoute(r);
  });

  /* ---------- делегированные события ---------- */
  document.addEventListener("click", (e) => {
    const lang = e.target.closest("[data-lang]");
    if (lang) { switchLang(lang.dataset.lang); return; }
    const back = e.target.closest("[data-back]");
    if (back) { OF.router.back(); return; }
    const go = e.target.closest("[data-go]");
    if (go) { OF.haptic("light"); OF.router.go(go.dataset.go); return; }
    if (e.target.closest("[data-say]")) OF.sceneView.say();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!sheetEl.hidden) OF.sheet.dismiss();
      else if (OF.router.current.name !== "scene") OF.router.back();
      return;
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.('[role="button"][data-go], [role="button"][data-say]')) {
      e.preventDefault(); e.target.click();
    }
  });

  /* ---------- старт ---------- */
  OF.tg.init();
  OF.i18n.set(OF.i18n.detect(), { silent: true });
  OF.sceneView.renderBoard();
  OF.menuView.render();
  OF.cartView.render();
  paintLang();
  updateCart(false);
  OF.router.start();

  const ready = () => {
    document.body.classList.add("ready");
    $("#boot").classList.add("is-done");
    setTimeout(() => $("#boot")?.remove(), 700);
  };
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1500))]).then(() => requestAnimationFrame(ready));
})();
