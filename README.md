# Project Front Door

A redesign concept for the Amtgard fantasy LARP organization's website,
styled as an illuminated chronicle — gold-on-blood, blackletter accents,
editorial medieval typography.

Built as a static HTML / CSS / JS site, no build step required.

## Pages

- **`index.html`** — main chronicle: hero, classes, realms, kingdom map,
  wars, arts & sciences, join CTA
- **`mission.html`** — Our Mission, with the Inclusivity Statement
- **`board.html`** — Board of Directors roster
- **`volunteers.html`** — Volunteer Leaders & contacts
- **`learn.html`** — Learn the Basics: the newcomer's primer
- **`start.html`** — Start a Chapter: the founding guide

## Run locally

Any static file server works. The included launch config uses Python's
built-in HTTP server on port 5173:

```sh
python3 -m http.server 5173
```

Then open <http://localhost:5173>.

## Type system

- **Pirata One** — display / brand title, decorative numerals, drop caps
- **IM Fell English SC** — section headers (small caps)
- **EB Garamond** — body copy
- **Cormorant Garamond** italic — editorial flourishes
- **JetBrains Mono** — email / contact strings

## Map data

The kingdom map (`/img/north-america.svg`) is the public-domain
[BlankMap-USA-states-Canada-provinces.svg](https://commons.wikimedia.org/wiki/File:BlankMap-USA-states-Canada-provinces.svg)
from Wikimedia Commons (CC0). Kingdom dots are positioned using
state-path centroids extracted from that SVG; see the comments inside
the `realms-map__svg` block in `index.html`.

## Photography

Real-field photography (`/img/*.jpg`) used for the hero and photo bands.
Each photo represents a moment of Amtgard play.

## Class & kingdom data

Class descriptions are based on the Amtgard V8 *Rules of Play*, and
kingdom data was cross-checked against the [AmtWiki](https://wiki.amtgard.com/)
and Wikipedia.
