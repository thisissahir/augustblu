# August Blu — Claude Code Handover

Personal site as a Windows 98 desktop. Vanilla JS + CSS modules + Vite. Static deploy to Vercel, domain augustblu.com (Vercel DNS). Email hi@augustblu.com forwards via ImprovMX. No framework. Single source of truth is data files — adding content means editing a config, not writing markup.

## Run
    npm install && npm run dev      # localhost:5173
    npm run build                   # -> dist/  (verified: 16 modules, clean)

## Deploy
    git init && git add . && git commit -m "August Blu OS"
    # push to GitHub repo, import in Vercel (framework auto-detects Vite), deploy.
    # vercel.json already set: buildCommand npm run build, output dist.

## What's built
- Animated wallpaper: logo (tuning-fork + blue pendant) on black void, resonance rings, bloom, particles, starfield, retro grid floor.
- Draggable Win98 windows, taskbar (Start menu + live clock), 5 desktop icons.
- Demos: 3 cover cards -> open built-in Win98 media player (playlist, seek, volume, prev/next, viz bars).
- Gallery: 6-photo grid + click-to-enlarge lightbox.
- Memories: folder browser (rolls named by date + place). Drill into a folder, Back/breadcrumb to return, Thumbnails/Details toggle. Photos open in a Win98 Picture-and-Fax-Viewer with next/prev (arrow keys work).
- Journal: two-pane explorer (file list left, doc reader right, click to switch).
- Documents: file-list placeholder (next to wire up).

## Where to edit (data-driven)
- Add/change a demo track: src/windows/tracks.js  (+ mp3 in public/assets/audio/ as demo-01..03.mp3, + square cover in public/assets/covers/)
- Add a photo roll:         src/windows/memories.js  (folder = date + place; drop JPGs in public/assets/memories/<folder>/, list them in the photos[] array; cover is one of them or null for plain folder icon)
- Add a journal doc:        src/windows/journal.js
- Add a whole new section:  src/windows/config.js  (one object = icon + window + start-menu entry)
- Styling per area:         src/styles/*.css  (imported by main.css)

## Known TODO / next tasks
1. Drop the 3 real demo mp3s into public/assets/audio/ (player handles missing files gracefully until then).
2. Documents section still placeholder — wire real files/downloads.
3. Demos are public URLs on a static host — if unreleased, add low-bitrate previews or a password gate on the player.
4. Optional: custom pixel .ico icons instead of emoji; thread pendant-blue (#2645e8) into title bars.
