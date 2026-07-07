# DevTools

A single-page, keyboard-driven workbench of small developer utilities. Open any
combination of tools as widgets on a draggable/resizable grid, arrange them
into named layouts, and switch between layouts instantly. Everything runs
client-side — no backend, no network calls for the tools themselves.

## Tools

18 tools across five categories, all searchable from the command palette:

- **Text** — Regex Tester, Text Diff Checker, Word Counter, Generators
  (lorem ipsum, random strings, UUIDs, hashes), Markdown Preview
- **Web** — HTML Viewer, URL Encoder/Decoder
- **Coding** — Code Formatter (Prettier: JS/SQL/XML/etc.), JSON Converter
  (JSON ⇄ XML/YAML/CSV)
- **Image** — Image Resizer, Image Format Converter
- **Utility** — Base64 Encoder/Decoder, Number Base Converter, Color
  Converter, JWT Decoder, Unix Timestamp Parser, Cron Expression Parser

## Development

```bash
npm install
npm run dev        # start the dev server
npx vitest run      # run the full test suite once
npm run build        # type-check (tsc -b) and build for production
```

Other scripts: `npm run lint` (oxlint), `npm run preview` (serve the built
`dist/`).

## Layout persistence

The grid layout, widget instances, and active layout are persisted to
`localStorage` (key `devtools-layout`) via Zustand's `persist` middleware.
Hydration is defensive: if the stored value is malformed JSON or has an
invalid shape (e.g. no layouts, or an `activeLayoutId` pointing at a layout
that doesn't exist), the store falls back to the seeded default layout
instead of crashing.

Layouts can be created (**Save as…**), renamed (**Rename…**), switched, and
deleted from the top bar or the command palette.

## Keyboard model

- **Cmd+K / Ctrl+K** — open/close the command palette (search tools, switch
  layouts, save/rename/delete layouts, etc.)
- **/** — also opens the command palette
- With the grid focused (palette closed), press **Esc** to leave any focused
  input, then:
  - **h / j / k / l** — move focus between widgets (left/down/up/right)
  - **Enter** or **i** — enter the focused widget (focus its first input)
  - **x** — close the focused widget
- **Ctrl+h / Ctrl+j / Ctrl+l** always move focus between widgets, even while
  typing inside a widget's input.
- **Ctrl+k** is the one deliberate exception: since Ctrl+K is also the
  palette toggle, when the palette is open Ctrl+K/Ctrl+J move the selection
  up/down within the palette instead of moving grid focus. Outside the
  palette, Ctrl+K opens the palette rather than moving focus up — this is a
  deliberate resolution of the conflict in favor of the more common "open
  command palette" shortcut.

The command palette's footer shows this cheatsheet.

## Deploying to GitHub Pages

The repo ships with `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages on every push to `main` (tests run first). One-time setup:

1. Create a GitHub repository and push this project to it.
2. In the repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab). The site will be live at `https://<user>.github.io/<repo>/`.

The Vite config uses a relative `base: './'`, so the build works from any sub-path without configuration.
