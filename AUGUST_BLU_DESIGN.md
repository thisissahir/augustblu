# August Blu — Visual Identity & Design Context

Hand this to Claude Design (or any visual surface) before generating assets so output stays on-brand. This is the single source of truth for the look.

---

## 1. The essence

**August Blu** — a music/art project presented as a **Windows 98 desktop OS**. The feeling is *nostalgic-digital meets cinematic-blue*: a lone figure in vast blue space, filed away inside an old computer. Tagline: **"collective consciousness, made tangible."**

Two worlds held in one frame:
- **The OS world** — gray Win98 chrome, beveled windows, pixel UI, taskbar, retro grid.
- **The blue world** — deep cinematic photography (underwater, salt flats, blue-hour roads), a black void, an electric-blue glowing logo.

Everything sits on **black**. The blue glows out of the dark. Never bright, never cheerful — moody, still, weightless.

---

## 2. Logo

A **tuning fork shaped like a "U"** (pale lavender-white) with a **blue teardrop pendant** hanging in the fork's gap. Small dots scatter inside the pendant like a seed/constellation. It reads as: sound made visible, resonance, a drop of water.

- File: `logo.png` (transparent PNG on void/black)
- Use it as: wallpaper centerpiece, avatar, favicon, watermark
- It "hums" — sub-pixel sway + blue glow when animated
- **Never** recolor it, add gradients, or place it on a busy background. It lives on black or deep blue only.

---

## 3. Color tokens

**Brand blues (the soul):**
- Electric pendant blue — `#2645E8` (primary accent, glows, outlines, active states)
- Deep cinematic blue — `#2E5C8A` → `#5A8FD0` (photographic range)
- Void black — `#000000` (the ground everything sits on)

**Windows 98 chrome (the frame):**
- Surface gray — `#C0C0C0`
- Mid gray — `#808080`
- Dark gray — `#404040`
- White (bevel highlight) — `#FFFFFF`
- Title-bar navy — `#000080` → `#1084D0` (gradient, left→right)
- Classic desktop teal — `#3A6EA5`

**Rule:** chrome is gray + navy. Brand identity is electric blue on black. Don't blur the two — the gray is the *container*, the blue is the *content*.

---

## 4. Typography

- **UI / chrome:** MS Sans Serif / Pixelated MS Sans Serif (the Win98 system font). Pixel-crisp, no anti-aliasing (`-webkit-font-smoothing: none`). Sizes 11–13px in-UI.
- **Notepad / journal:** Courier New monospace.
- **Display (hero "AUGUST BLU"):** bold, wide letter-spacing, white with a hard dark drop-shadow (`2px 2px 0`), set over deep-blue gradient.
- No rounded, no soft, no modern geometric sans. Everything is either pixel-era system UI or typewriter mono.

---

## 5. The Windows 98 rules (for any UI-style asset)

- **Bevels, not shadows.** Raised = white top/left + dark bottom/right. Sunken = the inverse. Hard 2px edges, never blurred.
- **Sharp corners.** No border-radius anywhere except the round media-player buttons.
- **Title bars:** navy→blue gradient, white bold text, `_ □ ✕` buttons top-right.
- **Scanline texture** (very faint, ~2% white lines) over the whole screen for CRT feel.
- **No flat design, no drop shadows-as-blur, no glassmorphism.** This is 1998, not 2024.

---

## 6. Photography direction

Reference the existing shots: a man in a **white linen suit**, blue gemstone pendant, in:
- mirror-flat salt water under a pale blue sky
- floating / walking underwater, light rays from above
- standing on an empty blue-hour mountain road
- a pebble beach at night

Direction for any new photo or photo-style render:
- **Palette:** desaturated blue, teal shadows, single warm/white subject.
- **Mood:** solitary, still, suspended, weightless. One figure, vast space.
- **Grain:** 35mm film texture, soft analog glow, slightly faded.
- **Never:** studio-clean, high-saturation, busy, crowded, daytime-cheerful.

---

## 7. Asset specs (what to generate, exact sizes)

| Asset | Size | Notes |
|---|---|---|
| Track / demo cover | 800×800 | square, cinematic-blue photo or art, file in `/assets/covers/` |
| Desktop icon (pixel) | 32×32 or 48×48 | Win98 `.ico` style — chunky, limited palette, 1px black outline, dithering ok |
| Wallpaper element | any | must work on pure black; blue glow welcome |
| Gallery photo | ≤1400px long edge, JPG q82 | optimized for web |
| Favicon | 32×32 | the logo on black |
| Social / promo | 1080×1080 or 1080×1920 | black + electric-blue + the logo; cinematic still |

---

## 8. Pixel-icon brief (highest-value near-term ask)

Replace the emoji desktop icons with authentic Win98 pixel icons, one per section:
- **Demos** — a CRT monitor or cassette/media glyph
- **Gallery** — a framed picture / paint palette
- **Memories** — a camera (nod to the Lumix) or a photo stack
- **Journal** — a notepad / spiral book
- **Documents** — a manila folder

Style: 32–48px, chunky pixel art, limited Win98 palette (gray/white/black + one blue `#2645E8` accent), hard 1px black outline, slight dithering for shading. They should look like they shipped with the OS — except the blue accent ties them to August Blu.

---

## 9. Do / Don't

**Do:** black grounds, electric-blue glow, gray Win98 chrome, pixel-crisp edges, cinematic-blue photography, film grain, solitary mood, the tuning-fork logo as anchor.

**Don't:** recolor the logo, mix the gray chrome into the brand-blue identity, use modern flat/rounded design, go bright or saturated, add captions/text over photos, use stock-photo cheerfulness, soft blurry shadows.

---

## 10. One-line summary for a prompt

> *Windows 98 desktop aesthetic — gray beveled chrome and pixel UI — wrapping cinematic, desaturated-blue photography of a lone white-suited figure in vast space, all on a black void with an electric-blue (#2645E8) glowing tuning-fork logo. Nostalgic, still, weightless. 35mm grain. Never bright, never modern-flat.*
