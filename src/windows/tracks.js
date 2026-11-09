/* tracks.js — the three demos. Add a track by adding one object.
   Drop the matching mp3 into public/assets/audio/ with the filename in `src`.
   Until the mp3 exists the player shows the track but reports "no file yet". */

export const TRACKS = [
  {
    id: "t1",
    title: "Tinted Windows (Acoustic)",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/tinted-windows.jpg",
    src: "/assets/audio/demo-01.mp3",
  },
  {
    id: "t2",
    title: "Somedays (Acoustic)",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/somedays.jpg",
    src: "/assets/audio/demo-02.mp3",
  },
  {
    id: "t3",
    title: "Call Away",
    subtitle: "August Blu — demo",
    cover: "/assets/covers/call-away.jpg",
    src: "/assets/audio/demo-03.mp3",
  },
  {
    id: "t4",
    title: "Thought of U",
    subtitle: "August Blu × Blame Adam — master",
    cover: "/assets/covers/thought-of-u.jpg",
    src: "/assets/audio/demo-04.mp3",
  },
  {
    id: "t5",
    title: "Honest",
    subtitle: "August Blu × Shabeer — master",
    cover: "/assets/covers/honest.jpg",
    src: "/assets/audio/demo-05.mp3",
  },
];
