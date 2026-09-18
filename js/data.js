/* =====================================================================
   FC DISHWASHER — Vereinsdaten
   ---------------------------------------------------------------------
   Hier werden alle veränderlichen Inhalte gepflegt: Kader, Spiele,
   Statistiken, Links. Die Werte in diesem File sind BEISPIELWERTE und
   müssen mit den echten Vereinsdaten ersetzt werden.
   ===================================================================== */

window.FCD = {
  club: {
    name: "FC Dishwasher",
    short: "FCD",
    motto: "Sauber gespielt.",
    platform: "PS5 · Xbox · PC",
    game: "EA SPORTS FC 27",
    mode: "Pro Clubs",
    language: "Deutsch",
    league: "Division 1",
    training: "Di & Do · 20:00 Uhr",
    matchdays: "Mo & Mi · 20:30 Uhr",
    /* Basis-URL der veröffentlichten Website (für Social-Media-Vorschau) */
    url: "https://crypt0nly.github.io/fc-dishwasher-website/"
  },

  links: {
    discord: "https://discord.gg/9FtpjrHw73",
    /* Leer lassen, wenn nicht vorhanden – leere Links werden ausgeblendet */
    twitch: "",
    youtube: "",
    instagram: "",
    tiktok: "",
    x: ""
  },

  /* Beispielwerte – bitte anpassen */
  stats: [
    { value: 18,  label: "Spieler im Kader" },
    { value: 64,  label: "Siege" },
    { value: 231, label: "Tore" },
    { value: 3,   label: "Titel" }
  ],

  /* Nächstes Spiel – Datum im ISO-Format (Lokalzeit) */
  nextMatch: {
    opponent: "Hafenstraße United",
    competition: "Liga · Spieltag 12",
    date: "2026-09-28T20:30:00",
    venue: "Heim"
  },

  /* Letzte Ergebnisse – neueste zuerst. result: "S" (Sieg), "U" (Unentschieden), "N" (Niederlage) */
  results: [
    { date: "16.09.2026", competition: "Liga", opponent: "Nordkurve eSports", home: 4, away: 1, result: "S", venue: "Heim" },
    { date: "14.09.2026", competition: "Pokal · Achtelfinale", opponent: "Real Kreuzberg", home: 2, away: 2, result: "U", venue: "Auswärts", note: "6:5 n. E." },
    { date: "09.09.2026", competition: "Liga", opponent: "SV Ballverlust", home: 3, away: 0, result: "S", venue: "Heim" },
    { date: "07.09.2026", competition: "Liga", opponent: "VfL Waschgang", home: 1, away: 2, result: "N", venue: "Auswärts" },
    { date: "02.09.2026", competition: "Liga", opponent: "Eintracht Spülbecken", home: 5, away: 1, result: "S", venue: "Heim" }
  ],

  /* Kader – Werte sind Beispielwerte.
     pos: TW, IV, LV, RV, ZDM, ZM, ZOM, LM, RM, LA, RA, ST
     attrs: [PAC, SHO, PAS, DRI, DEF, PHY] */
  squad: [
    { number: 1,  name: "Konstantin", pos: "TW",  rating: 86, attrs: [58, 30, 62, 55, 88, 84], captain: false, joined: "2024" },
    { number: 12, name: "Benedikt",   pos: "TW",  rating: 80, attrs: [52, 28, 58, 50, 82, 79], captain: false, joined: "2025" },
    { number: 2,  name: "Lasse",      pos: "RV",  rating: 84, attrs: [90, 62, 78, 82, 80, 74], captain: false, joined: "2024" },
    { number: 4,  name: "Malte",      pos: "IV",  rating: 88, attrs: [76, 44, 70, 68, 92, 90], captain: true,  joined: "2024" },
    { number: 5,  name: "Jerome",     pos: "IV",  rating: 85, attrs: [80, 40, 66, 64, 89, 86], captain: false, joined: "2025" },
    { number: 3,  name: "Yannick",    pos: "LV",  rating: 83, attrs: [88, 58, 76, 80, 79, 72], captain: false, joined: "2025" },
    { number: 6,  name: "Ilyas",      pos: "ZDM", rating: 87, attrs: [72, 66, 86, 82, 84, 88], captain: false, joined: "2024" },
    { number: 8,  name: "Tobias",     pos: "ZM",  rating: 86, attrs: [78, 74, 89, 86, 70, 76], captain: false, joined: "2024" },
    { number: 10, name: "Mattéo",     pos: "ZOM", rating: 89, attrs: [84, 86, 90, 92, 48, 66], captain: false, joined: "2024" },
    { number: 14, name: "Simon",      pos: "ZM",  rating: 82, attrs: [76, 70, 84, 81, 72, 74], captain: false, joined: "2026" },
    { number: 7,  name: "Dario",      pos: "RA",  rating: 87, attrs: [94, 84, 78, 90, 38, 62], captain: false, joined: "2025" },
    { number: 11, name: "Elias",      pos: "LA",  rating: 86, attrs: [93, 82, 80, 89, 36, 60], captain: false, joined: "2024" },
    { number: 9,  name: "Noah",       pos: "ST",  rating: 90, attrs: [88, 93, 74, 86, 40, 85], captain: false, joined: "2024" },
    { number: 19, name: "Finn",       pos: "ST",  rating: 83, attrs: [86, 85, 70, 80, 34, 78], captain: false, joined: "2026" }
  ],

  /* Offene Positionen für Bewerbungen */
  openPositions: ["IV", "ZDM", "RA", "TW (Backup)"],

  /* Trikotnummern der Startelf im 4-3-3 (für die Formationsgrafik) */
  formation: {
    name: "4-3-3",
    lineup: [1, 2, 4, 5, 3, 6, 8, 10, 7, 9, 11]
  }
};
