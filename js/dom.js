/* Мини-хелпер для создания DOM без innerHTML и инъекций */
(function () {
  window.OF = window.OF || {};
  OF.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const k in attrs || {}) {
      const val = attrs[k];
      if (val == null || val === false) continue;
      if (k === "class") el.className = val;
      else if (k === "text") el.textContent = val;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), val);
      else if (k === "style") el.style.cssText = val;
      else el.setAttribute(k, val === true ? "" : val);
    }
    kids.flat().forEach((c) => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  };
  OF.svg = function (markup) {
    const t = document.createElement("template");
    t.innerHTML = markup.trim();
    return t.content.firstChild;
  };
  OF.haptic = (kind = "light") => {
    try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(kind); } catch (e) {}
    try { if (!window.Telegram?.WebApp?.HapticFeedback) navigator.vibrate?.(8); } catch (e) {}
  };
  OF.toast = function (msg) {
    const host = document.getElementById("toasts");
    if (!host) return;
    const el = OF.h("div", { class: "toast", role: "status", text: msg });
    host.replaceChildren(el);
    clearTimeout(OF._toastT);
    OF._toastT = setTimeout(() => { el.classList.add("is-out"); setTimeout(() => el.remove(), 260); }, 1700);
  };
})();
