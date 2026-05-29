/* tracks.js — the three demos. Add a track by adding one object.
   Drop the matching mp3 into public/assets/audio/ with the filename in `src`.
   Until the mp3 exists the player shows the track but reports "no file yet". */

export const TRACKS = [
  {
    id: "t1",
    title: "Untitled Demo 01",
    subtitle: "August Blu",
    cover: "/assets/covers/cover-1.jpg",
    src: "/assets/audio/demo-01.mp3",
  },
  {
    id: "t2",
    title: "Untitled Demo 02",
    subtitle: "August Blu",
    cover: "/assets/covers/cover-2.jpg",
    src: "/assets/audio/demo-02.mp3",
  },
  {
    id: "t3",
    title: "Untitled Demo 03",
    subtitle: "August Blu",
    cover: "/assets/covers/cover-3.jpg",
    src: "/assets/audio/demo-03.mp3",
  },
];
