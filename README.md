# DevTools

**Live app: [theanht1.github.io/devtools](https://theanht1.github.io/devtools/)**

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
  - **h / j / k / l** or **arrow keys** — move focus between widgets
    (left/down/up/right)
  - **Enter** or **i** — enter the focused widget (focus its first input)
  - **x** — close the focused widget
- Inside the open palette, **Ctrl+j / Ctrl+k** (or ↑/↓) move the selection.

The command palette's footer shows this cheatsheet.
