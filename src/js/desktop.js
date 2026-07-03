/* desktop.js — icon selection + double-click, title-bar controls,
   gallery lightbox, demo-tile -> player wiring. */
import { openWin, closeWin, minWin, maxWin, focusWin } from "./windowManager.js";
import { playTrack } from "./audioPlayer.js";

export function initDesktop() {
  // icon select + open
  const activateIcon = (ic) => {
    if (ic.dataset.href) { location.href = ic.dataset.href; return; } // link icons navigate away
    openWin(ic.dataset.win);
  };
  document.querySelectorAll(".desk-icon").forEach((ic) => {
    ic.addEventListener("click", (e) => {
      document.querySelectorAll(".desk-icon").forEach((x) => x.classList.remove("selected"));
      ic.classList.add("selected");
      e.stopPropagation();
    });
    ic.addEventListener("dblclick", () => activateIcon(ic));
    // single tap opens on touch devices
    ic.addEventListener("touchend", (e) => { e.preventDefault(); activateIcon(ic); }, { passive: false });
  });
  const desk = document.getElementById("desktop");
  desk.addEventListener("click", () =>
    document.querySelectorAll(".desk-icon").forEach((x) => x.classList.remove("selected")));

  // title-bar buttons (delegated, since windows are generated)
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-close]"); if (c) { e.stopPropagation(); closeWin(c.dataset.close); return; }
    const mn = e.target.closest("[data-min]"); if (mn) { e.stopPropagation(); minWin(mn.dataset.min); return; }
    const mx = e.target.closest("[data-max]"); if (mx) { e.stopPropagation(); maxWin(mx.dataset.max); return; }
  });

  // demo tiles -> player
  document.querySelectorAll(".demo-card").forEach((card) => {
    card.addEventListener("click", () => playTrack(parseInt(card.dataset.track, 10)));
  });

  // journal: clicking a file shows that doc
  document.querySelectorAll(".jr-file").forEach((file) => {
    file.addEventListener("click", () => {
      const win = file.closest(".window") || document;
      const id = file.dataset.jr;
      win.querySelectorAll(".jr-file").forEach((f) => f.classList.toggle("active", f === file));
      win.querySelectorAll(".jr-doc").forEach((d) =>
        d.classList.toggle("active", d.id === "jr-doc-" + id));
    });
  });

  // gallery lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  document.querySelectorAll(".gal-grid img").forEach((img) => {
    img.addEventListener("click", () => { lbImg.src = img.dataset.full; lb.classList.add("open"); });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
}
