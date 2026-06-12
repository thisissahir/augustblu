/* entryGate.js — site-entry email wall.
   First visit: a shade blocks the site and the welcome popup asks for an email.
   Enter a valid email -> stored locally (whole site unlocked for good), and
   pinged to hi@augustblu.com via Web3Forms ("hey you got a visitor").
   Returning visitors skip the gate entirely (handled pre-paint in index.html). */
import { WEB3FORMS_ACCESS_KEY } from "../settings.js";

const STORE = "augustblu_visitor";
const $ = (id) => document.getElementById(id);
const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function hasEntered() {
  try { return !!localStorage.getItem(STORE); } catch { return true; }
}

async function sendVisitorEmail(email) {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith("YOUR-")) return;
  try {
    // keepalive: lets the POST finish even though we navigate away to the film
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "hey you got a visitor 👀",
        from_name: "August Blu — augustblu.com",
        email,
        botcheck: "",
        message: `Someone just walked into your world.\n\nEmail: ${email}\nFrom: augustblu.com (entry)`,
      }),
    });
  } catch {}
}

function closeWelcome() {
  const w = $("welcome");
  if (w) w.classList.remove("open");
  const s = $("entry-shade");
  if (s) s.style.display = "none";
}

/* Play the campaign film once (native <video>), then reveal the site.
   Called from the "come in" click, so play-with-sound is allowed. */
function playEntryFilm() {
  const overlay = $("film-overlay");
  const video = $("film-video");
  const skip = $("film-skip");
  if (!overlay || !video) return;

  overlay.classList.add("on", "loading");   // "connecting…" box up while the reel buffers
  video.src = "/assets/campaign-film.mp4";

  let done = false;
  const dismiss = () => {
    if (done) return; done = true;
    overlay.classList.remove("on", "skippable", "loading");
    try { video.pause(); video.removeAttribute("src"); video.load(); } catch {}
  };

  video.play().catch(() => {            // autoplay-with-sound blocked → mute and retry
    video.muted = true;
    video.play().catch(() => dismiss()); // can't play at all → just go in
  });

  // hide the connecting box the instant frames are rolling; bring it back on rebuffer
  video.addEventListener("playing", () => overlay.classList.remove("loading"));
  video.addEventListener("waiting", () => { if (!done) overlay.classList.add("loading"); });

  video.addEventListener("ended", dismiss, { once: true });
  video.addEventListener("error", dismiss, { once: true });
  setTimeout(() => overlay.classList.add("skippable"), 1200);
  if (skip) skip.onclick = dismiss;
  setTimeout(dismiss, 30000);           // hard safety net
}

export function initEntryGate() {
  const welcome = $("welcome");
  const shade = $("entry-shade");
  const btn = $("welcome-enter");
  const emailEl = $("welcome-email");
  const statusEl = $("welcome-status");
  const hp = $("welcome-hp");
  if (!btn) return;

  // already a member of the world → make sure nothing is blocking
  if (hasEntered()) {
    document.documentElement.classList.add("entered");
    if (welcome) welcome.classList.remove("open");
    if (shade) shade.style.display = "none";
  } else {
    // first time → gate is up (welcome open + shade visible by default)
    if (welcome) welcome.classList.add("open");
    if (shade) shade.style.display = "";
    // keep the email box ready: focus on arrival, and bring the cursor back
    // to it if the visitor clicks anywhere outside the box (on the shade)
    const focusEmail = () => { if (emailEl) { try { emailEl.focus(); } catch {} } };
    focusEmail();
    requestAnimationFrame(focusEmail);
    setTimeout(focusEmail, 90);
    if (shade) shade.addEventListener("click", focusEmail);
  }

  const enter = async () => {
    if (hp && hp.value) return;               // honeypot → ignore bots
    if (hasEntered()) { closeWelcome(); return; } // re-opened from Start menu → just close
    const v = (emailEl.value || "").trim();
    if (!validEmail(v)) { statusEl.textContent = "Enter a valid email to come in."; emailEl.focus(); return; }
    btn.disabled = true; statusEl.textContent = "Opening the door…";
    try { localStorage.setItem(STORE, v); } catch {}
    document.documentElement.classList.add("entered");
    sendVisitorEmail(v);                       // fire-and-forget
    closeWelcome();
    playEntryFilm();                           // play the campaign film, then reveal the site
  };

  btn.addEventListener("click", enter);
  if (emailEl) emailEl.addEventListener("keydown", (e) => { if (e.key === "Enter") enter(); });
}
