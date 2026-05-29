/* render.js — builds desktop icons, windows, and start-menu items from config.
   Keeps markup generation in one place so adding a window is purely data. */
import { WINDOWS } from "./config.js";

function titlebar(w) {
  const controls = w.id === "welcome"
    ? `<div class="tb-btn close" data-close="${w.id}">✕</div>`
    : `<div class="tb-btn" data-min="${w.id}">_</div>
       <div class="tb-btn" data-max="${w.id}">□</div>
       <div class="tb-btn close" data-close="${w.id}">✕</div>`;
  return `<div class="titlebar">
    <div class="title"><span class="ticon">${w.icon}</span> ${w.title}</div>
    <div class="tb-btns">${controls}</div>
  </div>`;
}

function statusbar(w) {
  if (!w.status) return "";
  const cells = w.status.map((s, i) =>
    `<div class="status-cell sunken${i === 0 ? " grow" : ""}">${s}</div>`).join("");
  return `<div class="statusbar">${cells}</div>`;
}

export function renderWindows() {
  const root = document.getElementById("windows-root");
  WINDOWS.forEach((w) => {
    const win = document.createElement("div");
    win.className = "window raised";
    win.id = "win-" + w.id;
    win.dataset.win = w.id;
    win.style.width = w.width + "px";
    win.style.top = w.top + "px";
    win.style.left = w.left + "px";

    const menu = w.menu
      ? `<div class="menubar">${w.menu.map((m) => `<span>${m}</span>`).join("")}</div>`
      : "";
    const bodyAttr = w.bodyClass || `class="win-content"`;
    const isWinContent = bodyAttr.includes("win-content");
    const inner = isWinContent
      ? `<div ${bodyAttr}>${w.body}</div>`
      : `<div class="win-content" ${bodyAttr}>${w.body}</div>`;

    win.innerHTML = `${titlebar(w)}${menu}
      <div class="win-body">${inner}${statusbar(w)}</div>`;
    root.appendChild(win);
  });
}

export function renderIcons() {
  const grid = document.getElementById("iconGrid");
  WINDOWS.filter((w) => w.showOnDesktop).forEach((w) => {
    const ic = document.createElement("div");
    ic.className = "desk-icon";
    ic.dataset.win = w.id;
    ic.innerHTML = `<div class="glyph">${w.icon}</div><div class="label">${w.title.split(" — ")[0]}</div>`;
    grid.appendChild(ic);
  });
}

export function renderStartMenu() {
  const items = document.getElementById("sm-items");
  const anchor = items.firstChild; // keep sep/about/shutdown below
  WINDOWS.filter((w) => w.showOnDesktop || w.inStartMenu).forEach((w) => {
    const it = document.createElement("div");
    it.className = "sm-item";
    it.dataset.open = w.id;
    it.innerHTML = `<span class="smi">${w.icon}</span> ${w.title.split(" — ")[0]}`;
    items.insertBefore(it, anchor);
  });
}
