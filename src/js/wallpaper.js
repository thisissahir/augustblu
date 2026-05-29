/* wallpaper.js — spawns the drifting particles that echo the droplet dots */
export function initParticles(count = 22) {
  const box = document.getElementById("particles");
  if (!box) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = 1 + Math.random() * 3;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = 55 + Math.random() * 40 + "%";
    p.style.setProperty("--dx", Math.random() * 40 - 20 + "px");
    p.style.animationDuration = 7 + Math.random() * 9 + "s";
    p.style.animationDelay = -Math.random() * 12 + "s";
    box.appendChild(p);
  }
}
