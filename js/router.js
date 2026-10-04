/* Hash-роутер с корректной кнопкой «назад» (браузер, Android, Telegram BackButton)
   #/            сцена
   #/menu        меню
   #/menu/<id>   лист блюда поверх меню
   #/cart        заказ                                                       */
(function () {
  const stack = [];
  const subs = [];

  const parse = (hash) => {
    const p = (hash || "").replace(/^#\/?/, "").split("/").filter(Boolean);
    if (p[0] === "menu") return p[1] ? { name: "dish", id: decodeURIComponent(p[1]) } : { name: "menu" };
    if (p[0] === "cart") return { name: "cart" };
    return { name: "scene" };
  };
  const parentOf = (r) => (r.name === "dish" ? "#/menu" : r.name === "scene" ? null : r.name === "cart" ? "#/menu" : "#/");

  OF.router = {
    current: parse(location.hash),
    onChange(fn) { subs.push(fn); },
    go(hash) { if (location.hash !== hash) location.hash = hash; },
    replace(hash) { history.replaceState(null, "", hash); this._sync(); },
    back() {
      if (stack.length > 1) history.back();
      else { const p = parentOf(this.current); if (p) this.replace(p); }
    },
    _sync() {
      const next = parse(location.hash);
      const h = location.hash || "#/";
      if (stack.length > 1 && stack[stack.length - 2] === h) stack.pop();
      else if (stack[stack.length - 1] !== h) stack.push(h);
      const prev = this.current;
      this.current = next;
      subs.forEach((fn) => fn(next, prev));
      OF.tg.backButton(next.name !== "scene", () => OF.router.back());
    },
    start() {
      stack.push(location.hash || "#/");
      window.addEventListener("hashchange", () => this._sync());
      subs.forEach((fn) => fn(this.current, null));
      OF.tg.backButton(this.current.name !== "scene", () => OF.router.back());
    },
  };
})();
