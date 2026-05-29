/* memories.js — photo archive, organized as folders (date + place).
   No captions. Each folder is a "roll" from the Lumix.

   To add a roll later: add a folder object here and drop the JPGs into
   public/assets/memories/<folder>/ . `cover` is just one of the photos
   (used as the folder's thumbnail). Set cover to null for a plain folder icon.

   Naming convention: date-first so the list self-sorts into a timeline.
*/

export const ROLLS = [
  {
    id: "roll-01",
    name: "2024-08 — Mumbai",
    cover: "/assets/photos/06-beach-night.jpg",
    photos: [
      "/assets/photos/06-beach-night.jpg",
      "/assets/photos/01-saltflat-white.jpg",
    ],
  },
  {
    id: "roll-02",
    name: "2025-01 — Colorado",
    cover: "/assets/photos/03-road-bluehour.jpg",
    photos: [
      "/assets/photos/03-road-bluehour.jpg",
      "/assets/photos/04-road-night.jpg",
    ],
  },
  {
    id: "roll-03",
    name: "2025-05 — Underwater",
    cover: "/assets/photos/05-underwater-walk.jpg",
    photos: [
      "/assets/photos/05-underwater-walk.jpg",
      "/assets/photos/02-underwater-float.jpg",
    ],
  },
  {
    id: "roll-04",
    name: "2025-09 — Untitled roll",
    cover: null,
    photos: [],
  },
];
