/* bulletin.js — wallpaper bulletin board.
   Small board on the desktop -> click to enlarge to a full board.
   Compose a note -> emails Sahir via Web3Forms + pins it to the board.
   Notes persist per-visitor in localStorage so they stay across the visit. */
import { WEB3FORMS_ACCESS_KEY, NOTE_COLORS } from "../windows/bulletin.js";

const STORE_KEY = "augustblu_notes";
const $ = (id) => document.getElementById(id);

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}
function saveNotes(notes) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(notes)); } catch {}
}

function noteHTML(n, i) {
  const color = NOTE_COLORS[i % NOTE_COLORS.length];
  const rot = (i % 5) - 2; // -2..2 deg
  return `<div class="bb-note" style="background:${color};transform:rotate(${rot}deg)">
    <div class="bb-pin"></div>
    <div class="bb-note-text">${escapeHTML(n.text)}</div>
    <div class="bb-note-from">— ${escapeHTML(n.name || "anon")}</div>
  </div>`;
}
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderBoards() {
  const notes = loadNotes();
  // mini: show up to 3 most recent
  const mini = $("bb-mini-notes");
  if (mini) {
    const recent = notes.slice(-3);
    mini.innerHTML = recent.length
      ? recent.map((n, i) => noteHTML(n, i)).join("")
      : `<div class="bb-mini-hint">📌 leave me a note</div>`;
  }
  // full: all notes
  const wall = $("bb-wall");
  if (wall) {
    wall.innerHTML = notes.length
      ? notes.map((n, i) => noteHTML(n, i)).join("")
      : `<div class="bb-empty">No notes yet. Be the first to pin one.</div>`;
  }
}

async function sendEmail(name, text) {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith("YOUR-")) return false;
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "New note on the August Blu bulletin board",
        from_name: name || "Anonymous visitor",
        message: text,
      }),
    });
    const data = await res.json();
    return !!data.success;
  } catch { return false; }
}

export function initBulletin() {
  const mini = $("bb-mini");
  const full = $("bb-full");
  if (!mini || !full) return;

  renderBoards();

  // open / close the big board
  mini.addEventListener("click", () => { full.classList.add("open"); });
  $("bb-close").addEventListener("click", () => full.classList.remove("open"));
  full.querySelector(".bb-shade").addEventListener("click", () => full.classList.remove("open"));

  // submit a note
  $("bb-pin-btn").addEventListener("click", async () => {
    const name = $("bb-name").value.trim();
    const text = $("bb-text").value.trim();
    if (!text) { $("bb-status").textContent = "Write something first."; return; }

    const note = { name, text, at: Date.now() };
    const notes = loadNotes();
    notes.push(note);
    saveNotes(notes);
    renderBoards();

    $("bb-text").value = "";
    $("bb-name").value = "";
    $("bb-status").textContent = "Pinned! ";

    const ok = await sendEmail(name, text);
    $("bb-status").textContent = ok
      ? "Pinned & sent to August Blu ✓"
      : "Pinned. (Email not configured — add your Web3Forms key.)";
    setTimeout(() => { $("bb-status").textContent = ""; }, 4000);
  });
}
