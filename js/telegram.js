/* ----------------------------------------------------------
   ПОЛУЧАТЕЛЬ ЗАКАЗОВ В TELEGRAM — меняется только здесь:
     номер телефона:  "+998776240123"
     или username:    "@username"
   ---------------------------------------------------------- */
const ORDER_TELEGRAM = "+998776240123";

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
    /* ссылка на чат получателя с готовым текстом заказа */
    orderLink(text) {
      const to = String(ORDER_TELEGRAM).trim();
      const q = "?text=" + encodeURIComponent(text);
      if (to.startsWith("@")) return `https://t.me/${to.slice(1)}${q}`;
      return `https://t.me/+${to.replace(/\D/g, "")}${q}`;
    },
    openLink(url) {
      try { if (tg?.openTelegramLink && tg.initData) { tg.openTelegramLink(url); return; } } catch (e) {}
      const w = window.open(url, "_blank", "noopener");
      if (!w) location.href = url;
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
