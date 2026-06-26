/* messageWall.js — public wall (lives in the Wall window).
   Visitors submit { name, message } and it appears on the wall immediately.
   Reads every row, newest first. Uses Supabase's REST API directly —
   no SDK / no extra dependency, just fetch(). (To re-enable moderation,
   read with `approved=eq.true` and gate inserts behind an approved column.) */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../settings.js";

const TABLE = "wall_messages";
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

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function noteHTML(n, i) {
  const rot = (i % 5) - 2;
  return `<div class="wall-note" style="transform:rotate(${rot}deg)">
    <div class="wall-note-text">${esc(n.message)}</div>
    <div class="wall-note-from">— ${esc(n.name || "anonymous")}</div>
  </div>`;
}

async function loadMessages() {
  const wall = $("wall-list");
  if (!wall) return;
  if (!configured()) {
    wall.innerHTML = `<div class="wall-empty">The wall goes live once it's connected.</div>`;
    return;
  }
  try {
    const res = await fetch(
      rest(`${TABLE}?select=name,message,created_at&order=created_at.desc&limit=100`),
      { headers }
    );
    const rows = await res.json();
    wall.innerHTML = Array.isArray(rows) && rows.length
      ? rows.map((n, i) => noteHTML(n, i)).join("")
      : `<div class="wall-empty">No messages yet. Be the first to leave one.</div>`;
  } catch {
    wall.innerHTML = `<div class="wall-empty">Couldn't load the wall right now.</div>`;
  }
}

async function submitMessage(name, message) {
  try {
    const res = await fetch(rest(TABLE), {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ name, message }), // approved defaults to false (pending)
    });
    return res.ok;
  } catch {
    return false; // network/CSP error — never hang the UI on "Sending…"
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
      status.textContent = "Something went wrong — try again.";
    }
    setTimeout(() => { status.textContent = ""; }, 6000);
  });

  msgEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) btn.click();
  });
}
