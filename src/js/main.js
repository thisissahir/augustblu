/* main.js — app entry. Wires every module together. */
import "../styles/main.css";

import { setTaskRenderer, focusWin, openWin } from "./windowManager.js";
import { renderWindows, renderIcons, renderStartMenu } from "../windows/render.js";
import { renderTasks, startClock } from "./taskbar.js";
import { initDrag } from "./drag.js";
import { initStartMenu } from "./startMenu.js";
import { initDesktop } from "./desktop.js";
import { initParticles } from "./wallpaper.js";
import { initAudioPlayer, autoStartPlayer } from "./audioPlayer.js";
import { initMemories } from "./memories.js";
import { initMessageWall } from "./messageWall.js";
import { initEntryGate } from "./entryGate.js";

function boot() {
  // entry guard FIRST — bounce non-logged-in visitors to the landing (/)
  // before we render anything, so the desktop never flashes for them.
  if (initEntryGate() === false) return;

  // build DOM from config
  renderWindows();
  renderIcons();
  renderStartMenu();

  // behaviours
  setTaskRenderer(renderTasks);
  initDrag();
  initStartMenu();
  initDesktop();
  initParticles();
  initAudioPlayer();
  initMemories();
  initMessageWall();
  startClock();

  renderTasks();

  // background music: auto-play the demos the moment a fan lands on the desktop
  autoStartPlayer();

  // Instagram window blockquote is added above; ask Instagram's embed.js to render
  // it (poll a few times since embed.js loads async).
  let igTries = 0;
  const renderIG = () => {
    if (window.instgrm && window.instgrm.Embeds) { window.instgrm.Embeds.process(); }
    else if (++igTries < 25) { setTimeout(renderIG, 300); }
  };
  renderIG();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
