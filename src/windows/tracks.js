/* tracks.js — the three demos. Add a track by adding one object.
   Drop the matching mp3 into public/assets/audio/ with the filename in `src`.
   Until the mp3 exists the player shows the track but reports "no file yet". */

export const TRACKS = [
  {
    id: "t1",
    title: "All Is Love",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/symbol.png",
    src: "/assets/audio/demo-01.mp3",
  },
  {
    id: "t2",
    title: "Away, A Way",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/symbol.png",
    src: "/assets/audio/demo-02.mp3",
  },
  {
    id: "t3",
    title: "Tinted Windows (Acoustic)",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/symbol.png",
    src: "/assets/audio/demo-03.mp3",
  },
];
