// Checks every theme in index.html is readable and well-formed.
// Usage: node tools/check-themes.js   (exits 1 on any problem)
//
// Rules, per theme:
//   text on background   >= 7:1    (body copy)
//   accent on background >= 4.5:1  (domain name, links, button label via --bg)
//   muted on background  >= 4.5:1  (muted = text blended into background, as in the CSS)
//   accent on ring track >= 3:1    (the countdown ring is a non-text graphic)

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

const list = html.match(/var T = (\[[\s\S]*?\n\s*\]);/);
if (!list) { console.error("Could not find the theme list (var T = [...]) in index.html"); process.exit(1); }
const themes = new Function("return " + list[1])();

// Read the blend strengths from the CSS so this check cannot drift from the page.
const pct = (name) => {
  const m = html.match(new RegExp("--" + name + ":\\s*color-mix\\(in srgb,\\s*var\\(--fg\\)\\s*(\\d+)%"));
  if (!m) { console.error("Could not find --" + name + " in index.html"); process.exit(1); }
  return +m[1] / 100;
};
const MUTED = pct("muted");
const LINE = pct("line");

const FONTS = new Set(["sans", "mono", "serif", "round"]);
const HEX = /^#[0-9a-f]{6}$/i;

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = (a) => 0.2126 * lin(a[0]) + 0.7152 * lin(a[1]) + 0.0722 * lin(a[2]);
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (a, b, p) => a.map((v, i) => v * p + b[i] * (1 - p)); // CSS color-mix in srgb

let problems = 0;
const fail = (name, msg) => { problems++; console.log("FAIL  " + name.padEnd(16) + msg); };
const seen = new Set();

for (const [name, bg, fg, accent, font] of themes) {
  if (seen.has(name)) fail(name, "duplicate name");
  seen.add(name);
  if (![bg, fg, accent].every((c) => HEX.test(c))) { fail(name, "colors must be #rrggbb"); continue; }
  if (!FONTS.has(font)) fail(name, "unknown font '" + font + "'");

  const B = rgb(bg), F = rgb(fg), A = rgb(accent);
  const r = {
    text: ratio(F, B),
    accent: ratio(A, B),
    muted: ratio(mix(F, B, MUTED), B),
    ring: ratio(A, mix(F, B, LINE)),
  };
  const issues = [];
  if (r.text < 7) issues.push("text " + r.text.toFixed(1));
  if (r.accent < 4.5) issues.push("accent " + r.accent.toFixed(1));
  if (r.muted < 4.5) issues.push("muted " + r.muted.toFixed(1));
  if (r.ring < 3) issues.push("ring " + r.ring.toFixed(1));
  if (issues.length) fail(name, issues.join(", "));
}

console.log(themes.length + " themes, " + problems + " problem" + (problems === 1 ? "" : "s"));
process.exit(problems ? 1 : 0);
