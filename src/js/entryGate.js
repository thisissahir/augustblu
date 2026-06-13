/* entryGate.js — desktop entry guard.
   Login + the intro film now live on the landing page (/). Here we just:
   - bounce anyone who reached /desktop without logging in back to the front door,
   - reveal the desktop for logged-in fans,
   - keep the #welcome popup usable as the "About August Blu" item (Start menu). */

const $ = (id) => document.getElementById(id);

export function hasEntered() {
  try {
    return !!(localStorage.getItem("blu_user") || localStorage.getItem("augustblu_visitor"));
  } catch { return true; }
}

function closeWelcome() {
  const w = $("welcome");
  if (w) w.classList.remove("open");
  const s = $("entry-shade");
  if (s) s.style.display = "none";
}

export function initEntryGate() {
  // Not logged in → you skipped the landing; send them there. Returning false
  // tells boot() to stop before rendering the desktop.
  if (!hasEntered()) { try { location.replace("/"); } catch { location.href = "/"; } return false; }

  // Logged in → reveal the desktop, nothing blocking.
  document.documentElement.classList.add("entered");
  closeWelcome();

  // The About popup reuses #welcome — its "come in" button just closes it.
  const btn = $("welcome-enter");
  if (btn) btn.addEventListener("click", () => closeWelcome());
  return true;
}
