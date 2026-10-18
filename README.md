# RIFT — a study in interaction

An original, mobile-first React/TypeScript component canvas. Dark, restrained UI with an optical material inspired by the physical edge of a screen: a machined rim, a recessed surface, and selective reflected light.

## Run

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```

Vite prints the local URL. The production build is a static `dist/` directory; no server, account, database or environment variables are needed.

## Explore

An open canvas with loose components, separated by spacing and small labels rather than presentation cards. On desktop, pan the surface, zoom, and drag each group by its grip (arrow keys also work; Shift increases the step). On mobile, the same components form a naturally scrolling layout.

13 interactive specimens, with more than 30 individual controls and states:

- Optical edge with pointer-reactive lighting and Frost / Smoke / Obsidian materials.
- Sliders, switches, async action button, secondary/quiet/destructive/disabled actions, like toggle and quantity stepper.
- Animated segmented control with an actual layout preview and illustrative billing selection.
- Floating dock, header navigation, dropdown, avatar stack, breadcrumbs and pagination.
- Ambient player that actually synthesizes three quiet sine-wave chords using Web Audio. No remote recordings.
- Inputs, select, textarea, validation, chips, radios and checkbox.
- Accordion, tooltip, modal confirmation, toast, status chips, loading skeleton and progress ring.
- Hold-to-commit interaction, cancellable by early release, including keyboard support.
- Global material studio: rim illumination, frost, accent color and motion preference; export the preset as JSON.
- Component search (`Cmd/Ctrl + K`) and favorites stored in browser-local storage.

Demo form submissions stay in memory and are not transmitted. Illustrative plan pricing is not a real offer. Header workspace actions are isolated specimens, not an account system.

## Structure

- `src/App.tsx`: canvas camera, specimen metadata and interactive components.
- `src/ui.tsx`: reusable `Edge`, `Specimen`, `Button`, `Toggle`, `Range`, `Segmented`, `Modal` and async action primitives.
- `src/styles.css`: material system and component state transitions.
- `src/canvas.css`: open canvas composition, floating tools and responsive layout.
- `public/`: local assets and font licenses.

The rim uses layered CSS backgrounds, a masked highlight and inset shadows. Pointer position updates CSS variables on the element rather than rerendering React on each move. No WebGL or animation library is needed. Dynamic effects honor `prefers-reduced-motion`; the studio can also disable expressive motion.

Native buttons, inputs, radio groups and modal dialogs provide keyboard behavior. Dialogs use `showModal()`, Escape dismissal and native focus restoration. System reduced motion remains authoritative even when the in-app motion switch is on.

## Assets and attribution

- Original layout, CSS material treatment and interaction composition for RIFT.
- Three 3D accent assets by Vijay Verma, [3dicons](https://3dicons.co), CC0; downloaded locally as `rocket.webp`, `tick.webp`, `shield.webp`. Source image URLs are listed in `ASSETS.md`.
- [Lucide](https://lucide.dev) interface icons, ISC.
- DM Sans and Manrope, self-hosted Latin variable fonts, SIL Open Font License; license files included in `public/fonts/`.

## Verification

TypeScript strict checks and production build pass. Browser verification in the T3 Chromium preview covers narrow mobile and desktop layouts, actual form validation and success, category filters, favorite persistence, settings, keyboard search, confirmation modal, Escape/focus restoration, and the hold-to-commit cancel/success paths. See `QA.md` for measured viewport sizes and limits. No claim of complete WCAG conformance or field Core Web Vitals is made.
