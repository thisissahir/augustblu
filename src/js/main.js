/* main.js — app entry. Wires every module together. */
import "../styles/main.css";

import { setTaskRenderer, focusWin, openWin } from "./windowManager.js";
import { renderWindows, renderIcons, renderStartMenu } from "../windows/render.js";
import { renderTasks, startClock } from "./taskbar.js";
import { initDrag } from "./drag.js";
import { initStartMenu } from "./startMenu.js";
import { initDesktop } from "./desktop.js";
import { initParticles } from "./wallpaper.js";
import { initAudioPlayer } from "./audioPlayer.js";
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
