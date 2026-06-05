/* listenerGate.js — email gate for the Demos.
   The first time someone tries to play a demo, ask for their email.
   On submit: notify hi@augustblu.com via Web3Forms ("hey you got a listener")
   and unlock playback for the rest of the visit (remembered in localStorage). */
import { WEB3FORMS_ACCESS_KEY } from "../settings.js";

const LKEY = "augustblu_listener";
const $ = (id) => document.getElementById(id);
const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function listenerUnlocked() {
  try { return !!localStorage.getItem(LKEY); } catch { return true; }
}
function saveListener(email) {
  try { localStorage.setItem(LKEY, email); } catch {}
}

async function sendListenerEmail(email) {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith("YOUR-")) return false;
  const track = ($("ap-title") || {}).textContent || "the demos";
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "hey you got a listener 🎧",
        from_name: "August Blu — augustblu.com",
        email, // reply-to the listener
        botcheck: "",
        message: `Hey — you got a listener!\n\nEmail: ${email}\nThey opened: ${track}\nSource: augustblu.com (Demos)`,
      }),
    });
    const d = await res.json();
    return !!d.success;
  } catch { return false; }
}

let pending = null;
function buildModal() {
  let m = $("lg");
  if (m) return m;
  m = document.createElement("div");
  m.id = "lg";
  m.innerHTML = `
    <div class="lg-shade"></div>
    <div class="lg-win window raised">
      <div class="titlebar">
        <div class="title"><span class="ticon">✉️</span> Listen — August Blu demos</div>
        <div class="tb-btns"><div class="tb-btn" id="lg-close">✕</div></div>
      </div>
      <div class="lg-body">
        <div class="lg-art">✉️</div>
        <p class="lg-copy">Drop your email to hear the demos.<br><span>You'll be first to know when they're out.</span></p>
        <div class="lg-field">
          <span class="lg-ico">✉️</span>
          <input id="lg-email" class="lg-input" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" maxlength="120">
        </div>
        <input id="lg-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">

        <div class="lg-row">
          <span id="lg-status" class="lg-status"></span>
          <button class="btn" id="lg-submit">Listen ▶</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(m);
  return m;
}

/* Resolves true ONLY when the visitor has unlocked (already, or by submitting).
   If they cancel, it never resolves — so playback simply doesn't start. */
export function ensureListener() {
  if (listenerUnlocked()) return Promise.resolve(true);
  if (pending) return pending;

  const m = buildModal();
  m.classList.add("open");
  setTimeout(() => { const e = $("lg-email"); if (e) e.focus(); }, 50);

  pending = new Promise((resolve) => {
    const email = $("lg-email"), status = $("lg-status"), submit = $("lg-submit");
    status.textContent = "";
    const finish = (unlocked) => { m.classList.remove("open"); pending = null; if (unlocked) resolve(true); };
    const go = () => {
      // honeypot: real people leave it empty; bots fill it → drop silently
      const hp = $("lg-hp"); if (hp && hp.value) { finish(false); return; }
      const v = email.value.trim();
      if (!validEmail(v)) { status.textContent = "Enter a valid email."; email.focus(); return; }
      submit.disabled = true; status.textContent = "Unlocking…";
      saveListener(v);
      sendListenerEmail(v); // fire-and-forget — don't make the listener wait
      finish(true);
    };
    submit.onclick = go;
    email.onkeydown = (e) => { if (e.key === "Enter") go(); };
    $("lg-close").onclick = () => finish(false);
    m.querySelector(".lg-shade").onclick = () => finish(false);
  });
  return pending;
}
