/* freebies.js — free downloads: songs, snippets, videos.
   Drop the file into public/assets/freebies/ and add an object here.
   `type` drives the icon. `file` is the download path. */

export const FREEBIES = [
  {
    id: "f1",
    type: "song",
    title: "Untitled Loop 01",
    meta: "wav · loop",
    file: "/assets/freebies/loop-01.wav",
  },
  {
    id: "f2",
    type: "snippet",
    title: "Voice Memo — 3am idea",
    meta: "mp3 · 0:42",
    file: "/assets/freebies/snippet-3am.mp3",
  },
  {
    id: "f3",
    type: "video",
    title: "Studio clip",
    meta: "mp4 · 0:15",
    file: "/assets/freebies/studio-clip.mp4",
  },
];

export const FREEBIE_ICON = { song: "🎵", snippet: "🎙️", video: "🎬" };
