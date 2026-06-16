/* landing.js — BLU_OS boot/login/connect/film entry sequence.
   Extracted to a module so it passes the site's strict CSP (no inline scripts). */

/* ================= CONFIG — the only lines you touch ================= */
const CONFIG = {
  WEB3FORMS_KEY: "d1897c38-da28-4b78-bdb8-ceb30c74ccc5", // Web3Forms key (-> hi@augustblu.com)
  VIDEO_SRC: "/assets/campaign-film.mp4",                // the campaign clip
  DESKTOP_URL: "/desktop",                               // where the desktop view lives
  REMEMBER_RETURNING: true,                              // returning fans skip the gate
};
/* ===================================================================== */

const $ = (id) => document.getElementById(id);
const stages = ["off","bios","login","connect","player","safe"];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(pointer: coarse)").matches;
const wait = (ms) => new Promise(r => setTimeout(r, reduced ? Math.min(ms, 120) : ms));

function show(id){
  stages.forEach(s => $(s).classList.toggle("on", s === id));
  if (id === "login") setTimeout(() => $("email").focus(), 60);
}

/* ---------- sound (synth, no assets) ---------- */
let AC = null, soundOn = true;
const sndBtn = $("snd");
sndBtn.addEventListener("click", () => {
  soundOn = !soundOn;
  sndBtn.textContent = soundOn ? "SND:ON" : "SND:OFF";
});
function ac(){ if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); return AC; }
function tone(freq, t0, dur, type="square", vol=0.045){
  if(!soundOn || reduced) return;
  const ctx = ac(), o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + dur + .05);
}
function hiss(t0, dur, vol=0.02){
  if(!soundOn || reduced) return;
  const ctx = ac(), len = ctx.sampleRate * dur, buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = (Math.random()*2-1);
  const src = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = .7;
  src.buffer = buf;
  g.gain.setValueAtTime(vol, ctx.currentTime + t0);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t0 + dur);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(ctx.currentTime + t0);
}
const beepPost = () => tone(880, 0, .09);
function dialup(){
  tone(350,0,.5,"sine",.03); tone(440,0,.5,"sine",.03);
  [697,770,852,941,1209,1336].forEach((f,i)=> tone(f,.55+i*.09,.07,"sine",.04));
  tone(2100,1.2,.35,"sine",.035); tone(1300,1.6,.18,"square",.03); tone(2250,1.8,.22,"square",.03);
  hiss(2.0,.9,.022);
}

/* ---------- phosphor cursor trail ---------- */
if(!reduced && !isTouch){
  let last = 0;
  addEventListener("pointermove", (e) => {
    const now = performance.now();
    if(now - last < 28) return; last = now;
    const d = document.createElement("span");
    d.className = "dot"; d.style.left = (e.clientX-2)+"px"; d.style.top = (e.clientY-2)+"px";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 720);
  }, {passive:true});
}

/* ---------- BIOS typewriter ---------- */
const biosLines = [
  ['dim', "AUGUSTBLU BIOS v2.6 — collective consciousness, made tangible"],
  ['dim', "(C) AUGUST BLU · anti-pop systems · denver, co"],
  ['',    ""],
  ['',    "CPU  : ONE HUMAN, UNSIGNED, FULL OWNERSHIP"],
  ['mem', "MEM  : "],
  ['',    "GPU  : FEELING ACCELERATOR ........... OK"],
  ['',    "NET  : ATTENTION ECONOMY ............. BYPASSED"],
  ['',    ""],
  ['w',   "DETECTING USER .......................... "],
  ['b',   "UNSEEN USER FOUND."],
  ['',    ""],
  ['b',   "IDENTITY REQUIRED TO CONTINUE_"],
];
async function runBios(){
  show("bios");
  const box = $("biosTxt");
  box.innerHTML = "";
  for(const [cls, text] of biosLines){
    const line = document.createElement("div");
    if(cls && cls !== 'mem') line.className = cls;
    box.appendChild(line);
    if(cls === 'mem'){
      line.textContent = "MEM  : 0 KB";
      const target = 65536;
      const t0 = performance.now(), durMs = reduced ? 80 : 900;
      await new Promise(res => {
        function step(t){
          const p = Math.min(1,(t-t0)/durMs);
          line.textContent = "MEM  : " + Math.floor(target*p).toLocaleString() + " KB OK — enough to remember you";
          if(p<1) requestAnimationFrame(step); else res();
        }
        requestAnimationFrame(step);
      });
      continue;
    }
    if(text === ""){ await wait(90); continue; }
    if(reduced){ line.textContent = text; continue; }
    for(let i=0;i<=text.length;i++){
      line.textContent = text.slice(0,i);
      await wait(text.length > 50 ? 6 : 14);
    }
    if(cls === 'w'){ await wait(650); }
    else await wait(110);
  }
  const c = document.createElement("span"); c.className = "caret";
  box.lastChild.appendChild(c);
  beepPost();
  await wait(1100);
  show("login");
}

/* ---------- power on ---------- */
$("powerBtn").addEventListener("click", async () => {
  ac(); // unlock audio inside gesture
  tone(120,0,.12,"sine",.05); // relay thunk
  if(!reduced){
    const tube = $("tube"); tube.classList.add("run");
    setTimeout(() => tube.classList.remove("run"), 600);
  }
  // returning fan? straight to the desktop after the flicker.
  if(CONFIG.REMEMBER_RETURNING && localStorage.getItem("blu_user")){
    await wait(650);
    show("safe");
    await wait(900);
    location.href = CONFIG.DESKTOP_URL;
    return;
  }
  await wait(500);
  runBios();
});
// keyboard power-on
addEventListener("keydown", (e) => {
  if($("off").classList.contains("on") && (e.key === "Enter" || e.key === " ")) $("powerBtn").click();
});

/* ---------- login ---------- */
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
function errBox(on){
  $("errWin").classList.toggle("on", on);
  if(on){ tone(220,0,.12,"square",.06); $("errOk").focus(); }
  else $("email").focus();
}
$("errOk").addEventListener("click", () => errBox(false));
$("errX").addEventListener("click", () => errBox(false));

async function submitEmail(){
  const v = $("email").value;
  if(!emailOk(v)){ errBox(true); return; }
  const email = v.trim();
  try { localStorage.setItem("blu_user", email); } catch {}
  try { localStorage.setItem("augustblu_visitor", email); } catch {} // so /desktop skips its old gate
  document.dispatchEvent(new CustomEvent("blu:login", { detail:{ email } }));
  if(CONFIG.WEB3FORMS_KEY){
    fetch("https://api.web3forms.com/submit", {
      method:"POST",
      keepalive:true, // finish even if we navigate to the film/desktop
      headers:{ "Content-Type":"application/json", "Accept":"application/json" },
      body: JSON.stringify({ access_key: CONFIG.WEB3FORMS_KEY, subject:"BLU_OS login — new listener", from_name:"augustblu.com gate", email, botcheck:"" })
    }).catch(()=>{});
  }
  runConnect();
}
$("seeMe").addEventListener("click", submitEmail);
$("email").addEventListener("keydown", (e) => { if(e.key === "Enter") submitEmail(); });

/* ---------- connect (dial-up) ---------- */
const connLines = [
  "Dialing…",
  "Handshake: you are not invisible here.",
  "Negotiating: feeling > metrics…",
  "Verifying user… SEEN.",
  "Connected. Opening first transmission…",
];
async function runConnect(){
  show("connect");
  dialup();
  const bar = $("pbar"); bar.innerHTML = "";
  const N = 18, blocks = [];
  for(let i=0;i<N;i++){ const b = document.createElement("i"); bar.appendChild(b); blocks.push(b); }
  const stat = $("connStat");
  const total = reduced ? 500 : 3000;
  const per = total / N;
  let li = 0;
  for(let i=0;i<N;i++){
    blocks[i].classList.add("f");
    const wantLine = Math.floor(i / (N / connLines.length));
    if(wantLine !== li || i === 0){ li = wantLine; stat.textContent = connLines[Math.min(li, connLines.length-1)]; }
    if(i === N-1) stat.textContent = connLines[connLines.length-1];
    await wait(per * (0.6 + Math.random()*0.9)); // uneven, like real dial-up
  }
  tone(1320,0,.1,"sine",.05); tone(1760,.12,.14,"sine",.05); // connect chime
  await wait(350);
  runPlayer();
}

/* ---------- player ---------- */
function fmt(s){ s = Math.max(0, Math.floor(s)); return "00:" + String(s).padStart(2,"0"); }
async function runPlayer(){
  show("player");
  const v = $("vid");
  v.src = CONFIG.VIDEO_SRC;
  v.muted = false;
  const tick = () => { $("vtime").textContent = fmt(v.currentTime) + " / " + fmt(v.duration || 7); };
  v.addEventListener("timeupdate", tick);
  v.addEventListener("ended", finish, { once:true });
  v.addEventListener("error", () => { finish(); }, { once:true }); // missing file never strands the user
  try { await v.play(); }
  catch {
    // autoplay with sound blocked or needs gesture
    v.muted = true;
    try { await v.play(); } catch { finish(); return; }
    const um = $("unmute"); um.classList.add("on");
    um.addEventListener("click", () => { v.muted = false; v.currentTime = 0; v.play(); um.classList.remove("on"); }, { once:true });
  }
}
async function finish(){
  show("safe");
  tone(660,0,.18,"sine",.05); tone(990,.2,.3,"sine",.05);
  await wait(reduced ? 300 : 1400);
  location.href = CONFIG.DESKTOP_URL;
}

/* ---------- show sound toggle once machine is on ---------- */
$("powerBtn").addEventListener("click", () => sndBtn.classList.add("on"), { once:true });
