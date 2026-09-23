// Instagram posts about the book, embedded in the "Stimmen auf Instagram" gallery.
// handle/date/excerpt are only shown if Instagram can't be loaded. The section is hidden while this list is empty.
export type InstagramPost = { url: string; handle: string; date: string; excerpt: string };

export const instagramPosts: InstagramPost[] = [
  {
    url: "https://www.instagram.com/reel/DQAMaQRirM9/",
    handle: "ahmad_katlesh",
    date: "19. Oktober 2025",
    excerpt:
      "Text: „Komm dahin, wo es still ist“, S. 82 – Footage: Damaskus, Dezember 2024 (Reel)",
  },
  {
    url: "https://www.instagram.com/p/DPV9oT9DL_9/",
    handle: "emmasbuecherecke",
    date: "3. Oktober 2025",
    excerpt:
      "„Dieses Buch ist ein wunderschöner Briefwechsel zwischen zwei Liebenden. Manchmal schmerzhaft, …“",
  },
  {
    url: "https://www.instagram.com/p/C_OHfiFMZg4/",
    handle: "vanessa_vu",
    date: "28. August 2024",
    excerpt:
      "„Am 31. Mai 2024 hatten wir unsere Buchpremiere in der Schaubühne … der wohl glücklichste Moment unserer Laufbahn.“",
  },
  {
    url: "https://www.instagram.com/p/C7Y1BOrsYnl/",
    handle: "bilderreiter",
    date: "25. Mai 2024",
    excerpt:
      "„Geschichten, die Berlin schreibt. Als ich las, dass @vanessa_vu ein Buch geschrieben hatte, …“",
  },
  {
    url: "https://www.instagram.com/p/DHTlxuoO71R/",
    handle: "buchladen_kalk",
    date: "17. März 2025",
    excerpt:
      "„… bewegende Themen rund um Migration, Identität und Zugehörigkeit.“ – Lesung im Buchladen Kalk",
  },
  {
    url: "https://www.instagram.com/p/DAye4PyMe5k/",
    handle: "kulturfluesterin",
    date: "6. Oktober 2024",
    excerpt:
      "„Gestern Abend fand eine besondere Veranstaltung im FAT CAT statt …“ – Lesung in München",
  },
];
