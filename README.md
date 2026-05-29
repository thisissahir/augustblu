# August Blu

A personal site styled as a Windows 98 desktop OS.
Black void wallpaper with the brand logo (tuning-fork "U" + blue droplet pendant)
rendered as an animated centerpiece — resonance rings, bloom, drifting particles,
starfield, retro grid floor. Five desktop icons open draggable Win98 windows.
A built-in Win98 media player powers the Demos section.

## Stack
- Vanilla JS (ES modules), CSS modules, Vite build. No framework.
- Deploys to Vercel as a static site. Domain: augustblu.com (Vercel DNS).
- Email: hi@augustblu.com forwards via ImprovMX.

## Run
```bash
npm install
npm run dev      # local dev at localhost:5173
npm run build    # -> dist/
```

## Structure
```
index.html                 slim shell (wallpaper, taskbar, mount points)
public/assets/
  logo.png                 brand logo (wallpaper centerpiece)
  photos/*.jpg             gallery images (optimized)
  covers/cover-1..3.jpg    demo track covers
  audio/demo-01..03.mp3    <-- DROP REAL DEMO MP3s HERE
src/
  js/
    main.js                entry; wires everything
    windowManager.js       open/close/min/max/focus + z-order
    render.js -> windows/  (note: render.js lives in windows/)
    taskbar.js             running-app buttons + clock
    drag.js                draggable windows (mouse + touch)
    startMenu.js           Start button + menu
    desktop.js             icons, lightbox, demo->player wiring
    wallpaper.js           drifting particles
    audioPlayer.js         the media player logic
  windows/
    config.js              ALL windows defined here (data-driven)
    tracks.js              the 3 demos (title, cover, mp3 path)
    render.js              builds windows/icons/start-menu from config
  styles/
    main.css               imports all modules below
    base, wallpaper, desktop, windows, taskbar, startmenu, welcome, player
```

## Add a demo track
Add an object to `src/windows/tracks.js`, drop the matching mp3 in
`public/assets/audio/`, add a square cover to `public/assets/covers/`.

## Add a new desktop section
Add one object to `src/windows/config.js`. Icon, window, and Start-menu
entry all generate from it.
