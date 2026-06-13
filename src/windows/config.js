/* config.js — single source of truth for every desktop window.
   Add a section by adding one object. icons + start menu + windows build from this.
   `iconOnly:false` windows still render but can be hidden from the desktop grid via showOnDesktop. */

import { TRACKS } from "./tracks.js";
import { JOURNAL } from "./journal.js";
import { DOCUMENTS } from "./documents.js";
import { ROLLS } from "./memories.js";

const demoTiles = TRACKS.map((t, i) => `
  <div class="demo-card" data-track="${i}">
    <img class="dc-cover" src="${t.cover}" alt="${t.title}">
    <div class="dc-title">${t.title}</div>
    <div class="dc-play">▶ play demo</div>
  </div>`).join("");

const PHOTOS = [
  "/assets/photos/series1/01.jpg",
  "/assets/photos/series1/02.jpg",
  "/assets/photos/series1/03.jpg",
  "/assets/photos/series1/04.jpg",
  "/assets/photos/series1/05.jpg",
  "/assets/photos/series1/06.jpg",
  "/assets/photos/series1/07.jpg",
  "/assets/photos/series1/08.jpg",
  "/assets/photos/series1/09.jpg",
  "/assets/photos/series1/10.jpg",
  "/assets/photos/series1/11.jpg",
  "/assets/photos/series1/12.jpg",
  "/assets/photos/series1/13.jpg",
  "/assets/photos/series1/14.jpg",
  "/assets/photos/series1/15.jpg",
  "/assets/photos/series1/16.jpg",
];
const galGrid = PHOTOS.map((p) => `<img src="${p}" alt="" data-full="${p}" loading="lazy">`).join("");


const journalFiles = JOURNAL.map((e, i) => `
  <div class="jr-file${i === 0 ? " active" : ""}" data-jr="${e.id}">
    <span class="fi">📄</span> ${e.name}
  </div>`).join("");
const journalDocs = JOURNAL.map((e, i) => `
  <div class="jr-doc${i === 0 ? " active" : ""}" id="jr-doc-${e.id}">
    <div class="jr-doc-head"><b>${e.title}</b><span class="meta">${e.date}</span></div>
    ${e.body}
  </div>`).join("");

const docFiles = DOCUMENTS.map((e, i) => `
  <div class="jr-file${i === 0 ? " active" : ""}" data-jr="${e.id}">
    <span class="fi">📄</span> ${e.name}
  </div>`).join("");
const docDocs = DOCUMENTS.map((e, i) => `
  <div class="jr-doc${i === 0 ? " active" : ""}" id="jr-doc-${e.id}">
    <div class="jr-doc-head"><b>${e.title}</b><span class="meta">${e.date}</span></div>
    ${e.body}
  </div>`).join("");

const rollFolders = ROLLS.map((r) => `
  <div class="mem-folder" data-roll="${r.id}">
    ${r.cover
      ? `<div class="mem-folder-cover"><img src="${r.cover}" alt=""></div>`
      : `<div class="mem-folder-icon">📁</div>`}
    <div class="mem-folder-name">${r.name}</div>
    <div class="mem-folder-count">${r.photos.length} item(s)</div>
  </div>`).join("");


export const WINDOWS = [
  {
    id: "demos", icon: "🖥️", title: "Demos",
    width: 620, top: 70, left: 110, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: [`${TRACKS.length} track(s)`, "August Blu"],
    body: `
      <h2>Demos</h2>
      <p>Three in progress. Click any cover to open the player.</p>
      <div class="demo-grid">${demoTiles}</div>`,
  },
  {
    id: "gallery", icon: "🖼️", title: "Gallery",
    width: 720, top: 90, left: 150, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: [`${PHOTOS.length} image(s)`, "August Blu"],
    body: `
      <h2>Gallery</h2>
      <p>Click any image to enlarge.</p>
      <div class="gal-grid">${galGrid}</div>`,
  },
  {
    id: "memories", icon: "📷", title: "Memories",
    width: 660, top: 70, left: 160, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: [`${ROLLS.length} folder(s)`, "August Blu"],
    bodyClass: `class="win-content mem-wrap"`,
    body: `
      <div class="mem-toolbar">
        <button class="mem-back" id="mem-back" disabled>⬅ Back</button>
        <div class="mem-crumb" id="mem-crumb">Memories</div>
        <div class="mem-view">
          <button class="mem-vbtn active" data-view="thumbs" title="Thumbnails">▦</button>
          <button class="mem-vbtn" data-view="details" title="Details">≣</button>
        </div>
      </div>
      <div class="mem-body" id="mem-body">
        <div class="mem-folders" id="mem-folders">${rollFolders}</div>
        <div class="mem-photos" id="mem-photos" style="display:none"></div>
      </div>`,
  },
  {
    id: "journal", icon: "📓", title: "Journal",
    width: 760, top: 80, left: 130, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: [`${JOURNAL.length} document(s)`, "August Blu"],
    bodyClass: `class="win-content jr-wrap"`,
    body: `
      <div class="jr-pane">
        <div class="jr-list sunken">${journalFiles}</div>
        <div class="jr-reader sunken">${journalDocs}</div>
      </div>`,
  },
  {
    id: "documents", icon: "📁", title: "Documents",
    width: 680, top: 120, left: 220, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: [`${DOCUMENTS.length} object(s)`, "August Blu"],
    bodyClass: `class="win-content jr-wrap"`,
    body: `
      <div class="jr-pane">
        <div class="jr-list sunken">${docFiles}</div>
        <div class="jr-reader sunken">${docDocs}</div>
      </div>`,
  },
  {
    id: "wall", icon: "📌", title: "The Wall",
    width: 660, top: 110, left: 200, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: ["everyone's messages for August Blu", "August Blu"],
    body: `
      <h2>The Wall</h2>
      <p>Everyone's messages for August Blu. Leave a mark — every note is read and pinned up by August Blu.</p>
      <div class="wall-list" id="wall-list"><div class="wall-empty">Loading…</div></div>
      <div class="wall-compose">
        <input id="wall-name" class="wall-input" type="text" placeholder="your name" maxlength="60">
        <textarea id="wall-text" class="wall-input wall-textarea" placeholder="write something to August Blu…" maxlength="600"></textarea>
        <input id="wall-hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
        <div class="wall-row">
          <span id="wall-status" class="wall-status"></span>
          <button id="wall-send" class="btn">📌 Put it up</button>
        </div>
      </div>`,
  },
  {
    id: "instagram", icon: `<img class="ic-img" src="/assets/ig-icon.png" alt="">`, title: "Instagram",
    width: 460, top: 80, left: 280, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: ["instagram.com/augustblu.wav", "August Blu"],
    body: `
      <div class="ie-bar"><span class="ie-lock">🔒</span> https://www.instagram.com/augustblu.wav/</div>
      <div class="ig-head">
        <span class="ig-ava">📸</span>
        <div class="ig-meta">
          <div class="ig-handle">@augustblu.wav</div>
          <div class="ig-name">August Blu · anti-pop · music for the people who feel invisible</div>
        </div>
        <a class="ig-btn ig-btn-sm" href="https://www.instagram.com/augustblu.wav/" target="_blank" rel="noopener noreferrer">Follow</a>
      </div>
      <div class="ig-feed-wrap">
        <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DZgwq--DRwA/?utm_source=ig_embed" data-instgrm-version="14">
          <a href="https://www.instagram.com/p/DZgwq--DRwA/" target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
        </blockquote>
      </div>
      <div class="ig-foot"><a class="ig-btn" href="https://www.instagram.com/augustblu.wav/" target="_blank" rel="noopener noreferrer">Open on Instagram&nbsp;↗</a></div>`,
  },
  {
    id: "youtube",
    icon: `<svg class="ic-img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="1.5" y="5" width="21" height="14" rx="4.2" fill="#FF0000"/><path d="M10 8.5l6.2 3.5L10 15.5z" fill="#fff"/></svg>`,
    title: "YouTube",
    width: 600, top: 90, left: 240, showOnDesktop: true,
    menu: ["File", "Edit", "View", "Help"],
    status: ["youtube.com/@AugustBlu", "August Blu"],
    body: `
      <div class="ie-bar"><span class="ie-lock">🔒</span> https://www.youtube.com/@AugustBlu</div>
      <div class="ig-head">
        <span class="yt-ava">▶</span>
        <div class="ig-meta">
          <div class="ig-handle">August Blu</div>
          <div class="ig-name">latest videos · @AugustBlu</div>
        </div>
        <a class="ig-btn ig-btn-sm yt-btn" href="https://www.youtube.com/@AugustBlu?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Subscribe</a>
      </div>
      <div class="yt-wrap">
        <iframe class="yt-feed" src="https://www.youtube.com/embed/videoseries?list=UUqXfgpA123dgkY7jADWcFLA" title="August Blu on YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="ig-foot"><a class="ig-btn yt-btn" href="https://www.youtube.com/@AugustBlu" target="_blank" rel="noopener noreferrer">Open on YouTube&nbsp;↗</a></div>`,
  },
  /* The media player — not on the desktop grid; opened from Demos tiles + Start menu */
  {
    id: "player", icon: "🎵", title: "August Blu — Media Player",
    width: 440, top: 60, left: 420, showOnDesktop: false, inStartMenu: true,
    menu: ["File", "Play", "Help"],
    status: null,
    bodyClass: `class="win-content gray"`,
    body: `
      <div class="ap-body">
        <div class="ap-now">
          <img id="ap-cover" class="ap-cover" src="" alt="">
          <div class="ap-info">
            <div id="ap-title" class="ap-title">—</div>
            <div id="ap-sub" class="ap-sub">August Blu</div>
            <div id="ap-status" class="ap-status">Ready</div>
            <div class="ap-viz"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
          </div>
        </div>
        <div class="ap-seekrow">
          <span id="ap-cur" class="t">0:00</span>
          <input id="ap-seek" class="ap-range" type="range" min="0" max="100" value="0">
          <span id="ap-dur" class="t">0:00</span>
        </div>
        <div class="ap-controls">
          <button id="ap-prev" class="ap-btn">⏮</button>
          <button id="ap-play" class="ap-btn play">▶</button>
          <button id="ap-next" class="ap-btn">⏭</button>
          <div class="ap-volrow">🔊 <input id="ap-vol" class="ap-range" type="range" min="0" max="100" value="80"></div>
        </div>
        <div id="ap-playlist" class="ap-playlist sunken"></div>
      </div>`,
  },
];
