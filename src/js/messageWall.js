/* messageWall.js — public wall (lives in the Wall window).
   Visitors submit { name, message } and it appears on the wall immediately.
   Reads every row, newest first. Uses Supabase's REST API directly —
   no SDK / no extra dependency, just fetch(). (To re-enable moderation,
   read with `approved=eq.true` and gate inserts behind an approved column.)

   The backend can go away — a paused Supabase project answers with a 521
   HTML error page, not JSON. So every request is bounded by a timeout and
   checked with res.ok, and the wall says plainly that it's resting rather
   than claiming to be empty. While it's down the compose box is disabled,
   so nobody writes a note into the void. */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../settings.js";

const TABLE = "wall_messages";
const TIMEOUT_MS = 12000;
const $ = (id) => document.getElementById(id);
const configured = () =>
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("YOUR-PROJECT") && !SUPABASE_ANON_KEY.startsWith("YOUR-");

const rest = (path) => `${SUPABASE_URL}/rest/v1/${path}`;
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

/* fetch that can't hang the UI forever */
async function ask(url, opts = {}) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctl.signal });
  } finally {
    clearTimeout(timer);
  }
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function noteHTML(n, i) {
  const rot = (i % 5) - 2;
  return `<div class="wall-note" style="transform:rotate(${rot}deg)">
    <div class="wall-note-text">${esc(n.message)}</div>
    <div class="wall-note-from">— ${esc(n.name || "anonymous")}</div>
  </div>`;
}

/* when the backend is unreachable, don't invite a post that can't land */
let wallOffline = false;
function setOffline(off) {
  wallOffline = off;
  const btn = $("wall-send"), msgEl = $("wall-text"), nameEl = $("wall-name"), hint = document.querySelector(".wall-hint");
  if (btn) { btn.disabled = off; btn.textContent = off ? "wall is resting" : "📌 Put it up"; }
  if (msgEl) msgEl.disabled = off;
  if (nameEl) nameEl.disabled = off;
  if (hint) {
    hint.textContent = off
      ? "The wall is offline for a moment — nothing can be posted right now. It'll be back."
      : "Your note goes straight up on the wall for everyone to see — be kind. 💙";
  }
}

async function loadMessages() {
  const wall = $("wall-list");
  if (!wall) return;
  if (!configured()) {
    wall.innerHTML = `<div class="wall-empty">The wall goes live once it's connected.</div>`;
    return;
  }
  try {
    const res = await ask(
      rest(`${TABLE}?select=name,message,created_at&order=created_at.desc&limit=100`),
      { headers }
    );
    // a paused/erroring backend can answer with HTML or a JSON error object —
    // never let either read as "the wall is empty"
    if (!res.ok) throw new Error("http " + res.status);
    const rows = await res.json();
    if (!Array.isArray(rows)) throw new Error("unexpected payload");
    setOffline(false);
    wall.innerHTML = rows.length
      ? rows.map((n, i) => noteHTML(n, i)).join("")
      : `<div class="wall-empty">No messages yet. Be the first to leave one.</div>`;
  } catch {
    setOffline(true);
    wall.innerHTML = `<div class="wall-empty">The wall is resting right now.<br><span>Come back in a bit and leave your mark.</span></div>`;
  }
}

async function submitMessage(name, message) {
  try {
    const res = await ask(rest(TABLE), {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ name, message }),
    });
    return res.ok;
  } catch {
    return false; // network/CSP/timeout — never hang the UI on "Sending…"
  }
}

export function initMessageWall() {
  const btn = $("wall-send");
  if (!btn) return;
  loadMessages();

  const nameEl = $("wall-name");
  const msgEl = $("wall-text");
  const status = $("wall-status");
  const hp = $("wall-hp");

  btn.addEventListener("click", async () => {
    if (hp && hp.value) return;                       // honeypot → silently drop bots
    if (wallOffline) { status.textContent = "The wall is offline right now — try again later."; return; }
    const name = (nameEl.value || "").trim();
    const message = (msgEl.value || "").trim();
    if (!name) { status.textContent = "Add your name."; nameEl.focus(); return; }
    if (!message) { status.textContent = "Write a message."; msgEl.focus(); return; }
    if (!configured()) { status.textContent = "The wall isn't connected yet — check back soon."; return; }

    // light client-side rate limit
    try {
      const last = +localStorage.getItem("wall_last") || 0;
      if (Date.now() - last < 20000) { status.textContent = "Easy — give it a sec."; return; }
    } catch {}

    btn.disabled = true; status.textContent = "Sending…";
    const ok = await submitMessage(name, message);
    btn.disabled = false;
    if (ok) {
      try { localStorage.setItem("wall_last", String(Date.now())); } catch {}
      msgEl.value = ""; nameEl.value = "";
      status.textContent = "Thank you — your note is up on the wall. 💙";
      loadMessages(); // show it right away
    } else {
      // keep what they wrote — they shouldn't lose it to an outage
      status.textContent = "Couldn't reach the wall — your note is still here, try again in a bit.";
      loadMessages(); // re-check: flips to the resting state if the backend is down
    }
    setTimeout(() => { status.textContent = ""; }, 6000);
  });

  msgEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) btn.click();
  });
}
