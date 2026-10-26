# habibullah.net redirect

This repository hosts the redirect landing page for `habibullah.net`, which forwards visitors to `https://habibullah.dev/` after a 5-second countdown.

## Purpose

- Preserve the old domain brand `habibullah.net`
- Redirect users to the active domain `habibullah.dev`
- Display a modern dark-themed countdown notice
- Keep a fallback meta refresh and direct button link
- Preserve the original path, query string, and hash during redirect

## Files

- `index.html` — main redirect page
- `README.md` — project documentation

## Redirect behavior

The page:

- shows a modern countdown timer
- randomly applies one of several dark themes on each visit
- redirects to `https://habibullah.dev/` after 5 seconds
- keeps path-based navigation such as `/about` or query strings intact
- includes a direct button for immediate redirection

## Contact

If someone has a real reason to use `habibullah.net`, they can contact:

- `hey@habibullah.dev`

## Notes

This is intended as a branded domain migration/redirect page with a 301-style redirect experience.
