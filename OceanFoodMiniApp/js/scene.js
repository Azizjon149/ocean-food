/* Сцена: доска меню из реальных данных, параллакс, стол с репликой */
(function () {
  const { h } = OF;
  const room = document.getElementById("room");
  const boardList = document.getElementById("board-list");
  const table = document.querySelector(".table");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  OF.sceneView = {
    renderBoard() {
      if (!boardList) return;
      const names = ["lavash", "hotdog", "hamburger", "doner", "nonburger", "fries"];
      boardList.replaceChildren(...names.map((id) => {
        const d = OF.menuById[id];
        return h("li", null,
          h("span", { class: "n", text: OF.i18n.pick(d.name) }),
          h("span", { class: "dots", "aria-hidden": "true" }),
          h("span", { class: "p", text: OF.i18n.fmt(OF.minPrice(d)) }));
      }));
    },
    setTill(total) {
      const t = document.getElementById("till-total");
      if (!t) return;
      const s = OF.i18n.fmt(total);
      t.textContent = s;
      t.setAttribute("font-size", s.length <= 5 ? 26 : s.length <= 7 ? 21 : 17);
    },
  };

  /* параллакс — только мышь, и не при reduced-motion */
  let raf = 0, nx = 0, ny = 0;
  const apply = () => { raf = 0; room.style.setProperty("--px", nx.toFixed(3)); room.style.setProperty("--py", ny.toFixed(3)); };
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || reduce.matches) return;
    nx = (e.clientX / innerWidth - 0.5) * 2;
    ny = (e.clientY / innerHeight - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });

  /* стол: реплика */
  let sayT;
  OF.sceneView.say = () => {
    if (!table) return;
    table.classList.add("is-saying");
    OF.haptic("light");
    clearTimeout(sayT);
    sayT = setTimeout(() => table.classList.remove("is-saying"), 2800);
  };
})();
