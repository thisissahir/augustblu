/* documents.js — files shown in the Documents window (two-pane reader).
   Mirrors journal.js. `name` is the filename shown in the list; `body` is HTML.
   Source text lives in the DOCUMENTS/ drop folder; content is embedded here. */

export const DOCUMENTS = [
  {
    id: "d1",
    name: "ABOUT.txt",
    title: "ABOUT",
    date: "—",
    body: `
      <p>I make music for the people who feel invisible.</p>
      <p>The ones who hate themselves some days, hate the world on the others but still get up and try to make it out the door anyway. If that's you, you're who I'm talking to. You're not alone in here.</p>
      <p>We live in a time built to keep us from feeling anything. Everything moves too fast to see each other, or even ourselves. Scroll, scroll, scroll, never landing long enough to ask what's actually happening, or what we actually feel. I make the opposite of that. Music that makes you stop. Music that makes you feel it — whatever "it" is for you tonight.</p>
      <p>The sound is whatever the song needs. What never changes is the honesty. I'm not here to be polished. I'm here to say the things I never said out loud, and hope it makes it a little easier for you to say your truth, speak your heart.</p>
      <p>You won't find me on the streaming machine. My music lives here and on Bandcamp, on YouTube, on the stage. Places you have to choose to come to. That's on purpose. In a world that gives everything away for free and leaves you feeling nothing, I'd rather make something you have to mean.</p>
      <p>So won't you let me in. Let me see you.</p>
      <p>Love is all we have and all we need.<br>Do it anyway.</p>
      <p><b>— August Blu</b></p>`,
  },
  {
    id: "d2",
    name: "Contact.txt",
    title: "Contact",
    date: "—",
    body: `
      <p>If you need a friend or a mail buddy:<br>
        <a href="mailto:hi@augustblu.com">hi@augustblu.com</a></p>
      <p>For bookings:<br>
        <a href="mailto:contact@progressivecollective.in">contact@progressivecollective.in</a></p>`,
  },
  {
    id: "d3",
    name: "READ ME !!!.txt",
    title: "READ ME !!!",
    date: "—",
    body: `<p style="color:#888">(This file is empty — drop text into DOCUMENTS/READ ME !!!.txt and it'll show here.)</p>`,
  },
];
