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

function boot() {
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

  // welcome focused on load
  focusWin("welcome");
  renderTasks("welcome");

  // start-menu "Enter" / welcome close handled by data-close already
  const enter = document.querySelector('[data-enter]');
  if (enter) enter.addEventListener("click", () => {});
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
