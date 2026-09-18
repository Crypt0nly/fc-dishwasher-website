# FC Dishwasher — Vereinswebsite

Offizielle Website des **FC Dishwasher**, deutschsprachiger Pro-Clubs-Verein in EA SPORTS FC 27.
Motto: *Sauber gespielt.*

Statische Website ohne Build-Schritt: HTML, CSS und JavaScript, gehostet über GitHub Pages.

## Features

- **Hero mit „Liquid Chrome“-Shader** (WebGL) — reagiert auf Maus und Scroll, Fallback ohne WebGL
- **Smooth Scrolling** (Lenis) und Scroll-Animationen (GSAP ScrollTrigger)
- **Kader als horizontal gepinnter Scroll** mit Spielerkarten (3D-Tilt, Attribut-Balken)
- **Nächstes Spiel mit Live-Countdown** und Ergebnisliste mit Formkurve
- **Formationsgrafik**, die sich beim Scrollen aufstellt, hell/dunkel-Themenwechsel
- **Preloader, Custom Cursor, magnetische Buttons, Marquee** mit Scroll-Geschwindigkeit
- Selbst gehostete Schriften (DSGVO-freundlich), keine Cookies, kein Tracking
- Responsiv (Mobile: nativer horizontaler Kader-Scroll, Fullscreen-Menü), `prefers-reduced-motion` wird respektiert
- Impressum- und Datenschutz-Vorlagen

## Inhalte pflegen

Alle veränderlichen Inhalte liegen in **`js/data.js`**:

| Bereich | Feld |
| --- | --- |
| Verein (Liga, Training, Spieltage, Plattform) | `club` |
| Links (Discord, Twitch, YouTube, …) | `links` — leere Links werden ausgeblendet |
| Statistik-Zähler | `stats` |
| Nächstes Spiel (Datum im Format `YYYY-MM-DDTHH:MM:SS`) | `nextMatch` |
| Letzte Ergebnisse (`S` Sieg, `U` Unentschieden, `N` Niederlage) | `results` |
| Kader (Nummer, Name, Position, Rating, Attribute, Kapitän) | `squad` |
| Offene Positionen | `openPositions` |
| Formation und Startelf (Trikotnummern) | `formation` — verfügbar: 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, 3-4-3 |

> Die aktuellen Werte sind **Beispielwerte** und müssen durch die echten Vereinsdaten ersetzt werden.

Texte (Vereinsbeschreibung, Philosophie, Bewerbungsvoraussetzungen) stehen direkt in `index.html`.
Farben, Schriften und Abstände sind als CSS-Variablen am Anfang von `css/styles.css` definiert.

**Impressum und Datenschutz:** In `impressum.html` und `datenschutz.html` die Angaben in eckigen Klammern ersetzen.

## Lokal starten

Einfach `index.html` über einen lokalen Webserver öffnen, z. B.:

```bash
npx serve .
# oder
python3 -m http.server 8080
```

## Veröffentlichen (GitHub Pages)

1. Im Repository **Settings → Pages → Source: „GitHub Actions“** wählen.
2. Der Workflow `.github/workflows/deploy.yml` veröffentlicht die Seite bei jedem Push auf `main`
   (oder manuell über „Run workflow“).
3. Die URL in `js/data.js` (`club.url`) und die `og:`-Meta-Tags in `index.html` an die endgültige Adresse anpassen,
   damit die Vorschau beim Teilen (z. B. im Discord) stimmt.

## Struktur

```
index.html            Startseite
impressum.html        Impressum (Vorlage)
datenschutz.html      Datenschutzerklärung (Vorlage)
css/styles.css        Design-System und Layout
css/fonts.css         Selbst gehostete Schriften
js/data.js            Vereinsdaten (hier pflegen)
js/main.js            Interaktionen und Animationen
js/hero-shader.js     WebGL-Shader für den Hero
js/vendor/            GSAP, ScrollTrigger, SplitText, Lenis
assets/               Wappen (SVG), Favicon, Social-Media-Vorschau, Schriften
```

## Credits

- Schriften: [Archivo](https://fonts.google.com/specimen/Archivo), [Inter](https://rsms.me/inter/), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — SIL Open Font License
- [GSAP](https://gsap.com) (GSAP Standard License), [Lenis](https://lenis.darkroom.engineering) (MIT)
- FC Dishwasher ist ein unabhängiger Pro-Clubs-Verein. EA SPORTS FC™ ist eine Marke von Electronic Arts Inc.
