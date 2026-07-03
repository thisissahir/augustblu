/* startMenu.js — Start button toggle + menu actions */
import { openWin } from "./windowManager.js";

export function initStartMenu() {
  const startBtn = document.getElementById("start-btn");
  const startMenu = document.getElementById("start-menu");
  if (!startBtn || !startMenu) return;

  const toggle = (force) => {
    const open = force !== undefined ? force : !startMenu.classList.contains("open");
    startMenu.classList.toggle("open", open);
    startBtn.classList.toggle("active", open);
  };

  startBtn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener("click", () => toggle(false));
  startMenu.addEventListener("click", (e) => e.stopPropagation());

  document.querySelectorAll(".sm-item[data-open]").forEach((it) => {
    it.addEventListener("click", () => { openWin(it.dataset.open); toggle(false); });
  });

  document.querySelectorAll(".sm-item[data-href]").forEach((it) => {
    it.addEventListener("click", () => { toggle(false); location.href = it.dataset.href; });
  });

  const shutdown = document.getElementById("sm-shutdown");
  if (shutdown) {
    shutdown.addEventListener("click", () => {
      toggle(false);
      if (confirm("It is now safe to turn off your computer.\n\nReload August Blu?")) location.reload();
    });
  }
}
