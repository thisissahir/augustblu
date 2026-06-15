/* audioPlayer.js — a single Win98-skinned media player.
   - One shared <audio> element drives everything.
   - Playlist comes from tracks.js; clicking a Demos tile loads + plays it.
   - Handles missing files gracefully (shows status, doesn't crash). */
import { TRACKS } from "../windows/tracks.js";
import { openWin, focusWin } from "./windowManager.js";

let audio;
let current = -1;

const $ = (id) => document.getElementById(id);
const fmt = (s) => {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

function renderPlaylist() {
  const list = $("ap-playlist");
  if (!list) return;
  list.innerHTML = "";
  TRACKS.forEach((t, i) => {
    const row = document.createElement("div");
    row.className = "ap-track" + (i === current ? " playing" : "");
    row.innerHTML = `
      <img class="ap-track-cover" src="${t.cover}" alt="">
      <div class="ap-track-meta">
        <div class="ap-track-title">${t.title}</div>
        <div class="ap-track-sub">${t.subtitle}</div>
      </div>
      <span class="ap-track-num">${String(i + 1).padStart(2, "0")}</span>`;
    row.onclick = () => load(i, true);
    list.appendChild(row);
  });
}

function setNowPlaying(t) {
  $("ap-cover").src = t.cover;
  $("ap-title").textContent = t.title;
  $("ap-sub").textContent = t.subtitle;
  const npt = $("np-title");
  if (npt) npt.textContent = t.title;
}

function load(i, autoplay) {
  if (i < 0 || i >= TRACKS.length) return;
  current = i;
  const t = TRACKS[i];
  setNowPlaying(t);
  audio.src = t.src;
  audio.load();
  renderPlaylist();
  $("ap-status").textContent = "Loading…";
  if (autoplay) {
    audio.play().catch(() => {
      $("ap-status").textContent = "Press ▶ to play";
    });
  }
}

function togglePlay() {
  if (current === -1) { load(0, true); return; }
  if (audio.paused) audio.play().catch(() => {}); else audio.pause();
}

export function initAudioPlayer() {
  audio = new Audio();
  audio.preload = "metadata";
  // No per-demo gate any more — access is granted at the site entry wall,
  // so demos play freely once someone is inside.

  renderPlaylist();
  if (TRACKS.length) setNowPlaying(TRACKS[0]);
  else { const t = $("ap-title"); if (t) t.textContent = "—"; const s = $("ap-status"); if (s) s.textContent = "Demos coming soon"; }

  $("ap-play").onclick = togglePlay;
  $("ap-prev").onclick = () => load((current <= 0 ? TRACKS.length : current) - 1, true);
  $("ap-next").onclick = () => load((current + 1) % TRACKS.length, true);

  const seek = $("ap-seek");
  seek.oninput = () => { if (isFinite(audio.duration)) audio.currentTime = (seek.value / 100) * audio.duration; };

  const vol = $("ap-vol");
  vol.oninput = () => { audio.volume = vol.value / 100; };
  audio.volume = 0.8;

  // now-playing tray widget — persists while you roam, plays in the background
  const np = $("np"), npToggle = $("np-toggle");
  if (np) {
    npToggle.onclick = (e) => { e.stopPropagation(); togglePlay(); };
    np.onclick = () => { openWin("player"); focusWin("player"); };
  }

  audio.addEventListener("play",  () => {
    $("ap-play").textContent = "❚❚"; $("ap-status").textContent = "Playing";
    if (np) np.classList.add("on", "playing");
    if (npToggle) npToggle.textContent = "❚❚";
  });
  audio.addEventListener("pause", () => {
    $("ap-play").textContent = "▶";  $("ap-status").textContent = "Paused";
    if (np) np.classList.remove("playing");
    if (npToggle) npToggle.textContent = "▶";
  });
  // auto-advance to the next track and loop forever (independent of the window)
  audio.addEventListener("ended", () => load((current + 1) % TRACKS.length, true));
  audio.addEventListener("timeupdate", () => {
    $("ap-cur").textContent = fmt(audio.currentTime);
    if (isFinite(audio.duration)) {
      seek.value = (audio.currentTime / audio.duration) * 100 || 0;
      $("ap-dur").textContent = fmt(audio.duration);
    }
  });
  audio.addEventListener("loadedmetadata", () => $("ap-dur").textContent = fmt(audio.duration));
  audio.addEventListener("error", () => {
    $("ap-status").textContent = "No audio file yet — drop the mp3 in /assets/audio/";
  });
}

/* called from the Demos tiles */
export function playTrack(i) {
  openWin("player");
  focusWin("player");
  load(i, true);
}

/* Auto-start the demos in the background once a fan lands on the desktop.
   Tries to play immediately (browsers usually allow it here, since the intro
   film just played with sound on the same domain). If autoplay-with-sound is
   blocked, it starts on the visitor's very first interaction instead — so
   there's always music, never a silent dead-end. From there the player
   auto-advances + loops on its own (handled by the "ended" listener). */
export function autoStartPlayer() {
  if (!audio || !TRACKS.length) return;
  openWin("player");                    // show the player so fans see the source + controls
  focusWin("player");
  load(0, false);                       // cue track 1, show it in the player + tray

  const start = () => audio.play();
  const armGesture = () => {
    // phones block autoplay-with-sound → tell the listener, then start on the
    // first tap anywhere OUTSIDE the player (taps on the player's own controls
    // are left to the controls, so ▶ doesn't double-trigger and pause itself).
    const s = $("ap-status"); if (s) s.textContent = "Press ▶ to play";
    const go = (e) => {
      if (e && e.target && e.target.closest && e.target.closest("#win-player")) return;
      start().catch(() => {});
      off();
    };
    const off = () => ["pointerdown", "keydown", "touchstart"]
      .forEach((ev) => window.removeEventListener(ev, go));
    ["pointerdown", "keydown", "touchstart"]
      .forEach((ev) => window.addEventListener(ev, go, { passive: true }));
  };

  const p = start();
  if (p && p.catch) p.catch(armGesture);  // blocked now → play on first interaction
  else armGesture();
}
