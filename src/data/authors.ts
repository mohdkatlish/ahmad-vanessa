import vanessa from '../assets/authors/vanessa-vu.jpg';
import ahmad from '../assets/authors/ahmad-katlesh.jpg';
import zeitZ from '../assets/zeit-z.png';

export const authors = [
  {
    name: "Vanessa Vu",
    photo: vanessa,
    bio:
      "ist Journalistin. Sie wurde 1991 in Eggenfelden geboren, ihre Kindheit verbrachte sie in einem Asylbewerberheim in Pfarrkirchen. In Reportagen, Essays und Analysen widmet sie sich vor allem Fragen rund um Migration, Rassismus und sozialer Gerechtigkeit. Zudem lädt sie jeden Monat ins «Klassenzimmer», eine Gesprächsreihe über Armut und Klassismus in der Schaubühne Berlin. 2018–2023 war sie Co-Host des vietdeutschen Podcasts «Rice and Shine». Für ihre Arbeiten wurde sie unter anderem mit dem Theodor-Wolff-Preis, dem Helmut-Schmidt-Preis und dem Lessing-Preis für Kritik ausgezeichnet.",
    links: [
      {
        kind: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/vanessa_vu/",
      },
      {
        kind: "image",
        label: "ZEIT Autorinnenseite",
        url: "https://www.zeit.de/autoren/V/Vanessa_Vu/index",
        image: zeitZ,
      },
    ],
  },
  {
    name: "Ahmad Katlesh",
    photo: ahmad,
    bio:
      "ist Schriftsteller. Er wurde 1988 in Damaskus geboren und studierte dort Mathematik. Nach der syrischen Revolution floh er 2013 nach Jordanien und arbeitete dort als Journalist. 2016 kam er mit einem Stipendium des Heinrich-Böll-Hauses nach Deutschland. Er veröffentlichte drei Bücher mit Kurzgeschichten und Gedichten auf Arabisch, 2020 erschien sein erstes deutschsprachiges Buch, der Lyrikband «Das Gedächtnis der Finger». Dafür verlieh die Bayerische Akademie der Schönen Künste ihm das Chamisso-Publikationsstipendium. Daneben liest er auf «Tiklam» literarische Texte für Millionen arabischsprachiger Hörer:innen.",
    links: [
      {
        kind: "instagram",
        label: "Instagram",
        url: "https://www.instagram.com/ahmad_katlesh/",
      },
      {
        kind: "soundcloud",
        label: "SoundCloud",
        url: "https://soundcloud.com/tiklam",
      },
    ],
  },
] as const;
