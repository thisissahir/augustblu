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
  setNowPlaying(TRACKS[0]);

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
