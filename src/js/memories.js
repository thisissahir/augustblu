/* memories.js — folder browser + Win98 Picture-and-Fax-Viewer.
   Single window, drill into a roll, Back/breadcrumb to return.
   Thumbnails / Details view toggle. Click a photo -> viewer with next/prev. */
import { ROLLS } from "../windows/memories.js";

let viewMode = "thumbs";
let currentRoll = null;

const $ = (id) => document.getElementById(id);

function showFolders() {
  currentRoll = null;
  $("mem-folders").style.display = "";
  $("mem-photos").style.display = "none";
  $("mem-crumb").textContent = "Memories";
  $("mem-back").disabled = true;
}

function openRoll(id) {
  const roll = ROLLS.find((r) => r.id === id);
  if (!roll) return;
  currentRoll = roll;
  $("mem-folders").style.display = "none";
  const pane = $("mem-photos");
  pane.style.display = "";
  pane.className = "mem-photos " + (viewMode === "details" ? "as-details" : "as-thumbs");
  $("mem-crumb").innerHTML = `Memories &nbsp;›&nbsp; <b>${roll.name}</b>`;
  $("mem-back").disabled = false;

  if (!roll.photos.length) {
    pane.innerHTML = `<div class="mem-empty">This folder is empty.<br><span>Drop JPGs into public/assets/memories/ and list them in memories.js</span></div>`;
    return;
  }

  pane.innerHTML = roll.photos.map((p, i) => {
    const file = p.split("/").pop();
    if (viewMode === "details") {
      return `<div class="mem-row" data-idx="${i}">
        <span class="fi">🖼️</span>
        <span class="mem-row-name">${file}</span>
        <span class="mem-row-type">JPEG Image</span>
      </div>`;
    }
    return `<div class="mem-thumb" data-idx="${i}"><img src="${p}" alt=""><span>${file}</span></div>`;
  }).join("");

  pane.querySelectorAll("[data-idx]").forEach((el) => {
    el.addEventListener("click", () => openViewer(parseInt(el.dataset.idx, 10)));
  });
}

/* ---- Picture & Fax Viewer ---- */
let viewerIdx = 0;
function openViewer(idx) {
  viewerIdx = idx;
  let v = $("pfv");
  if (!v) {
    v = document.createElement("div");
    v.id = "pfv";
    v.innerHTML = `
      <div class="pfv-shade"></div>
      <div class="pfv-win window raised">
        <div class="titlebar">
          <div class="title"><span class="ticon">🖼️</span> <span id="pfv-name">image</span> — Picture and Fax Viewer</div>
          <div class="tb-btns"><div class="tb-btn" id="pfv-close">✕</div></div>
        </div>
        <div class="pfv-stage"><img id="pfv-img" src="" alt=""></div>
        <div class="pfv-bar">
          <button class="pfv-b" id="pfv-prev" title="Previous">◀</button>
          <button class="pfv-b" id="pfv-next" title="Next">▶</button>
          <span class="pfv-count" id="pfv-count"></span>
        </div>
      </div>`;
    document.body.appendChild(v);
    v.querySelector(".pfv-shade").onclick = closeViewer;
    $("pfv-close").onclick = closeViewer;
    $("pfv-prev").onclick = () => step(-1);
    $("pfv-next").onclick = () => step(1);
  }
  v.style.display = "flex";
  paintViewer();
}
function paintViewer() {
  const p = currentRoll.photos[viewerIdx];
  $("pfv-img").src = p;
  $("pfv-name").textContent = p.split("/").pop();
  $("pfv-count").textContent = `${viewerIdx + 1} / ${currentRoll.photos.length}`;
}
function step(d) {
  const n = currentRoll.photos.length;
  viewerIdx = (viewerIdx + d + n) % n;
  paintViewer();
}
function closeViewer() { const v = $("pfv"); if (v) v.style.display = "none"; }

export function initMemories() {
  // folder open
  document.querySelectorAll(".mem-folder").forEach((f) => {
    f.addEventListener("click", () => openRoll(f.dataset.roll));
  });
  // back
  $("mem-back").addEventListener("click", showFolders);
  // view toggle
  document.querySelectorAll(".mem-vbtn").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".mem-vbtn").forEach((x) => x.classList.toggle("active", x === b));
      viewMode = b.dataset.view;
      if (currentRoll) openRoll(currentRoll.id);
    });
  });
  // keyboard nav in viewer
  document.addEventListener("keydown", (e) => {
    const v = $("pfv");
    if (!v || v.style.display === "none") return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Escape") closeViewer();
  });
}
