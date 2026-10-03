/* Telegram Mini App: безопасно работает и вне Telegram */
(function () {
  const tg = window.Telegram?.WebApp;
  OF.tg = {
    app: tg || null,
    inTelegram: !!(tg && tg.initData),
    init() {
      if (!tg) return;
      try {
        tg.ready();
        tg.expand();
        tg.setHeaderColor?.("#06101f");
        tg.setBackgroundColor?.("#06101f");
        tg.disableVerticalSwipes?.();      // свайп вниз не закрывает приложение при прокрутке меню
        const setVh = () => document.documentElement.style.setProperty("--tg-vh", (tg.viewportStableHeight || tg.viewportHeight) + "px");
        setVh();
        tg.onEvent?.("viewportChanged", setVh);
        document.documentElement.classList.add("in-telegram");
      } catch (e) { /* старые клиенты */ }
    },
    backButton(show, handler) {
      const b = tg?.BackButton;
      if (!b) return;
      try {
        if (this._h) b.offClick(this._h);
        if (show) { this._h = handler; b.onClick(handler); b.show(); } else b.hide();
      } catch (e) {}
    },
  };
})();
