/* windowManager.js
   Open / close / minimize / maximize / focus + z-order.
   Emits nothing; other modules call these directly. */

export const WINS = ["demos", "gallery", "memories", "journal", "documents", "wall", "instagram", "youtube", "welcome"];

export const TITLES = {
  demos: "🖥️ Demos",
  gallery: "🖼️ Gallery",
  memories: "📷 Memories",
  journal: "📓 Journal",
  documents: "📁 Documents",
  wall: "📌 The Wall",
  instagram: "📸 Instagram",
  youtube: "▶️ YouTube",
  welcome: "✴️ Welcome",
};

let zTop = 100;
export const openState = {};
export const minState = {};
const maxState = {};

let onTaskChange = () => {};
export function setTaskRenderer(fn) { onTaskChange = fn; }

export function el(name) {
  return document.getElementById(name === "welcome" ? "welcome" : "win-" + name);
}

export function focusWin(name) {
  const w = el(name);
  if (!w) return;
  // The entry-gate welcome keeps its pinned z-index (9999) so it can never
  // drop behind the full-screen shade (9998) when clicked.
  if (name !== "welcome") {
    zTop++;
    w.style.zIndex = zTop;
  }
  document.querySelectorAll(".titlebar").forEach((t) => t.classList.add("inactive"));
  const tb = w.querySelector(".titlebar");
  if (tb) tb.classList.remove("inactive");
  onTaskChange(name);
}

export function openWin(name) {
  const w = el(name);
  if (!w) return;
  w.classList.add("open");
  openState[name] = true;
  minState[name] = false;
  focusWin(name);
  onTaskChange(name);
}

export function closeWin(name) {
  const w = el(name);
  if (!w) return;
  w.classList.remove("open");
  openState[name] = false;
  minState[name] = false;
  onTaskChange();
}

export function minWin(name) {
  const w = el(name);
  if (!w) return;
  w.classList.remove("open");
  minState[name] = true;
  onTaskChange();
}

export function maxWin(name) {
  const w = el(name);
  if (!w) return;
  if (!maxState[name]) {
    w.dataset.prev = JSON.stringify({
      top: w.style.top, left: w.style.left, width: w.style.width, height: w.style.height,
    });
    w.style.top = "0"; w.style.left = "0";
    w.style.width = "100vw"; w.style.height = "calc(100vh - 30px)";
    maxState[name] = true;
  } else {
    const p = JSON.parse(w.dataset.prev || "{}");
    w.style.top = p.top; w.style.left = p.left;
    w.style.width = p.width; w.style.height = p.height || "";
    maxState[name] = false;
  }
  focusWin(name);
}

export function isMax(name) { return !!maxState[name]; }
