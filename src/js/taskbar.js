/* taskbar.js — renders running-app buttons + the live clock */
import { WINS, TITLES, openState, minState, el, focusWin, openWin, minWin } from "./windowManager.js";

export function renderTasks(activeName) {
  const bar = document.getElementById("task-items");
  if (!bar) return;
  bar.innerHTML = "";

  const make = (name, label, icon) => {
    const item = document.createElement("div");
    const active = openState[name] && name === activeName;
    item.className = "task-item raised" + (active ? " active" : "");
    item.innerHTML = `<span class="ti-ico">${icon}</span><span class="ti-label">${label}</span>`;
    item.onclick = () => {
      if (minState[name]) openWin(name);
      else if (name === activeName) minWin(name);
      else { focusWin(name); el(name).classList.add("open"); }
    };
    bar.appendChild(item);
  };

  WINS.forEach((name) => {
    if (name === "welcome") return;
    if (openState[name] || minState[name]) {
      const parts = TITLES[name].split(" ");
      make(name, parts.slice(1).join(" "), parts[0]);
    }
  });

  if (openState["welcome"]) make("welcome", "Welcome", "✴️");
}

export function startClock() {
  const tick = () => {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    m = m < 10 ? "0" + m : m;
    const c = document.getElementById("clock");
    if (c) c.textContent = `${h}:${m} ${ap}`;
  };
  tick();
  setInterval(tick, 10000);
}
