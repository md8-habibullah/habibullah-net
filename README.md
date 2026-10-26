# habibullah.net redirect

This repository hosts the redirect landing page for `habibullah.net`. It tells visitors the site has moved and sends them to `https://habibullah.dev/` after a 5-second countdown.

## What the page does

- Shows a short notice, a countdown ring, a **Go now** button and a **Pause** button.
- Redirects to `https://habibullah.dev/` after 5 seconds, keeping the path, query string and hash (`/about?x=1#top` goes to `habibullah.dev/about?x=1#top`).
- Uses `location.replace`, so the redirect page never lands in browser history and Back cannot loop.
- Falls back to a meta refresh when JavaScript is off.
- Respects reduced motion: the ring moves in steps and the entrance animation is off.

This is a client-side redirect, not an HTTP 301. The page keeps `noindex` and a canonical link to `habibullah.dev`.

## A different look on every refresh

Each visit picks one of 51 themes at random, plus one of three background patterns (glow, grid, dots). The page remembers only the index of the last theme in `localStorage`, so a refresh never repeats it. Nothing else is stored.

A theme is just a name, three colors and a font personality:

```js
["Neon Blue", "#07101f", "#e8f1ff", "#3da5ff", "sans"]
//  name      background  text       accent     font: sans | mono | serif | round
```

Everything else (muted text, lines, ring track, button text) is derived from those three colors in CSS. Fonts are system fonts only, so the page makes no network requests.

### Adding a theme

1. Add a row to the `T` list at the top of `index.html`.
2. Run `node tools/check-themes.js`. It fails if a theme is hard to read: text 7:1, accent 4.5:1, muted text 4.5:1, ring 3:1.
3. If you add or remove themes, update `COUNT` in `tools/preview-init.js`.

## Files

- `index.html`: the whole page (HTML, CSS, JS, themes).
- `tools/check-themes.js`: contrast and format check for every theme.
- `tools/preview-init.js`: test harness for opening the page on a chosen theme without it redirecting away.
- `tools/out/`: local screenshots and reports from testing (git-ignored).

## Contact

If someone has a real reason to use `habibullah.net`, they can contact `hey@habibullah.dev`.
