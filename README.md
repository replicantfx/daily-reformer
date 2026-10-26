# Daily Reformer

Guided daily Pilates workouts on the Reformer: a new session every day, spring settings for every exercise, and calm, breath-led coaching.

- A new daily workout on a weekly rhythm (Sun stretch & restore, Mon footwork & legs, Tue core, Wed arms & back, Thu spine & mobility, Fri full-body flow in the classical order, Sat strength & balance), in short, standard or long lengths, favoring exercises you haven't done recently
- 27 classical Reformer exercises drawn on an animated Reformer (sliding carriage, springs, footbar, straps, short and long box), each with its spring setting, setup, cues and purpose
- Spring settings as resistance levels (heavy, medium, light, extra light), Balanced Body colors (red, green, blue, yellow), or both. Colors differ between brands, so go by resistance on other machines.
- 9 curated routines plus a workout composer (5–30 min, by focus); any routine can be scaled to the time you have
- One unbroken breath rhythm for the whole session (3 s in, 4 s out, exhaling on the effort), spoken breath cues, Pilates-principle prompts, and a screen glow that follows the breath
- Timer, up-next preview, voice coach and chime; practice log and streak stored in your browser
- Installable and works offline

Live at **https://replicantfx.github.io/daily-reformer/**. A sibling of [Daily Move](https://replicantfx.github.io/daily-move/).

## Install on your phone

- **iPhone / iPad (Safari):** Share → **Add to Home Screen**
- **Android (Chrome):** tap **Install app** in the header, or ⋮ → **Install app**

## How it's built

No build step. The app is a single `index.html`; around it:

- `manifest.webmanifest` and `icons/` make it installable
- `sw.js` caches every file for offline use. The page loads network-first, so a pushed update appears on the next open when online. Bump `VERSION` in `sw.js` when you add or rename files. Its cache name and the app's storage keys differ from Daily Move's, because both apps share the `replicantfx.github.io` origin.
- `fonts/` holds self-hosted subsets containing only the characters the app uses. After adding text with new characters, run `python tools/update-fonts.py`.

Check the springs, footbar and headrest before each exercise, and never step on or off a moving carriage. If you are new to the Reformer, pregnant, or managing an injury, learn with a qualified instructor first.
