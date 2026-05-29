/* drag.js — makes every .window draggable by its title bar (mouse + touch) */
import { isMax, focusWin } from "./windowManager.js";

export function initDrag() {
  document.querySelectorAll(".window").forEach((w) => {
    const tb = w.querySelector(".titlebar");
    if (!tb) return;
    let dragging = false, ox = 0, oy = 0;

    const begin = (cx, cy) => {
      if (isMax(w.dataset.win)) return false;
      const r = w.getBoundingClientRect();
      ox = cx - r.left; oy = cy - r.top;
      w.style.transform = "none";
      w.style.top = r.top + "px";
      w.style.left = r.left + "px";
      dragging = true;
      return true;
    };
    const move = (cx, cy) => {
      if (!dragging) return;
      let nx = cx - ox, ny = cy - oy;
      ny = Math.max(0, Math.min(ny, window.innerHeight - 60));
      nx = Math.max(-w.offsetWidth + 60, Math.min(nx, window.innerWidth - 60));
      w.style.left = nx + "px";
      w.style.top = ny + "px";
    };
    const end = () => { dragging = false; document.body.style.cursor = "default"; };

    tb.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("tb-btn")) return;
      if (begin(e.clientX, e.clientY)) { document.body.style.cursor = "move"; e.preventDefault(); }
    });
    window.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
    window.addEventListener("mouseup", end);

    tb.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("tb-btn")) return;
      const t = e.touches[0];
      begin(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener("touchend", end);
  });

  document.querySelectorAll(".window").forEach((w) => {
    w.addEventListener("mousedown", () => focusWin(w.dataset.win));
  });
}
