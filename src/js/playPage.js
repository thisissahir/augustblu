/* playPage.js — music for the standalone /play page.
   On the desktop the game runs in a window, so the desktop's own player just
   keeps going. This page is a separate document, so it needs its own: the same
   demos, rotating forever, with minimal controls.

   Autoplay-with-sound is blocked until the visitor interacts, and clicks inside
   the game's iframe never reach this document — so when it's blocked the button
   pulses to invite a click, and any click on the page around the game starts it. */
import { TRACKS } from "../windows/tracks.js";

const bar = document.getElementById("bbMusic");
const btn = document.getElementById("bbMusicBtn");
const next = document.getElementById("bbMusicNext");
const label = document.getElementById("bbMusicTitle");

if (bar && btn && label && TRACKS.length) {
  const audio = new Audio();
  audio.preload = "auto";
  let i = 0;

  function load(n, play) {
    i = (n + TRACKS.length) % TRACKS.length;
    audio.src = TRACKS[i].src;
    label.textContent = TRACKS[i].title;
    if (play) audio.play().catch(() => {});
  }

  // roll through the demos and start over — the music never stops
  audio.addEventListener("ended", () => load(i + 1, true));
  audio.addEventListener("play", () => { btn.textContent = "❚❚"; bar.classList.remove("idle"); });
  audio.addEventListener("pause", () => { btn.textContent = "▶"; });
  audio.addEventListener("error", () => { label.textContent = "audio unavailable"; });

  btn.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  if (next) next.addEventListener("click", () => load(i + 1, true));

  load(0, false);
  audio.play().catch(() => {
    // blocked until a gesture — pulse the button, and take the first click anywhere
    bar.classList.add("idle");
    const start = () => audio.play().catch(() => {});
    document.addEventListener("pointerdown", start, { once: true });
    document.addEventListener("keydown", start, { once: true });
  });
}
