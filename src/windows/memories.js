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
    name: "2026-05 — Dallas",
    cover: "/assets/memories/dallas-2026-05/p1170066.jpg",
    photos: [
      "/assets/memories/dallas-2026-05/p1170066.jpg",
      "/assets/memories/dallas-2026-05/p1170067.jpg",
      "/assets/memories/dallas-2026-05/p1170075.jpg",
      "/assets/memories/dallas-2026-05/p1170083.jpg",
      "/assets/memories/dallas-2026-05/p1170084.jpg",
      "/assets/memories/dallas-2026-05/p1170085.jpg",
      "/assets/memories/dallas-2026-05/p1170086.jpg",
      "/assets/memories/dallas-2026-05/p1170087.jpg",
      "/assets/memories/dallas-2026-05/p1170088.jpg",
      "/assets/memories/dallas-2026-05/p1170167.jpg",
      "/assets/memories/dallas-2026-05/p1170172.jpg",
      "/assets/memories/dallas-2026-05/p1170176.jpg",
      "/assets/memories/dallas-2026-05/p1170177.jpg",
      "/assets/memories/dallas-2026-05/p1170179.jpg",
      "/assets/memories/dallas-2026-05/p1170181.jpg",
      "/assets/memories/dallas-2026-05/p1170184.jpg",
      "/assets/memories/dallas-2026-05/p1170189.jpg",
      "/assets/memories/dallas-2026-05/p1170190.jpg",
      "/assets/memories/dallas-2026-05/p1170191.jpg",
      "/assets/memories/dallas-2026-05/p1170192.jpg",
      "/assets/memories/dallas-2026-05/p1170194.jpg",
      "/assets/memories/dallas-2026-05/p1170195.jpg",
      "/assets/memories/dallas-2026-05/p1170196.jpg",
      "/assets/memories/dallas-2026-05/p1170197.jpg",
      "/assets/memories/dallas-2026-05/p1170198.jpg",
      "/assets/memories/dallas-2026-05/p1170199.jpg",
      "/assets/memories/dallas-2026-05/p1170202.jpg",
      "/assets/memories/dallas-2026-05/p1170203.jpg",
      "/assets/memories/dallas-2026-05/p1170205.jpg",
      "/assets/memories/dallas-2026-05/p1170206.jpg",
    ],
  },
];
