# RIFT — React components

A React/TypeScript component library in development, presented on a mobile-first interactive canvas. An obsidian palette, silver reflections and restrained motion, with an optical material inspired by the physical edge of a screen: a machined rim, a recessed surface, and selective reflected light.

**Live demo:** <https://www.juszczyk.codes/rift>

The demo is served from the portfolio site as a static build with `RIFT_BASE=/rift/`, so the same source also runs standalone with `npm run dev`.

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

An open canvas with loose components, composed on three shared columns and aligned row baselines, separated by spacing, fine rules and small labels. Filtered collections reflow into a compact grid. On desktop, pan the surface, zoom, and drag each group by its grip (arrow keys also work; Shift increases the step). On mobile, the same components form a naturally scrolling layout.

28 interactive specimens, with more than 30 individual controls and states:

- Compact material controls with pointer-reactive edges, illumination and Frost / Smoke / Obsidian finishes.
- Sliders, switches, async action button, secondary/destructive/disabled actions, like toggle and quantity stepper.
- Animated segmented control with layout and spacing previews.
- Floating dock, header navigation, dropdown and pagination.
- Ambient player that actually synthesizes three quiet sine-wave chords using Web Audio. No remote recordings.
- Inputs, select, textarea, validation, chips, radios and checkbox.
- Accordion, tooltip, modal confirmation, toast, status chips, loading skeleton and progress ring.
- Hold-to-commit interaction, cancellable by early release, including keyboard support.
- Global material studio: rim illumination, frost, accent color and motion preference; export the preset as JSON.
- Component search (`Cmd/Ctrl + K`) and favorites stored in browser-local storage.

Form validation stays in memory. The confirmation dialog applies the Obsidian material settings. Component URLs support direct navigation through their hash.

## Structure

- `src/App.tsx`: canvas camera, specimen metadata and interactive components.
- `src/ui.tsx`: reusable `Edge`, `Specimen`, `Button`, `Toggle`, `Range`, `Segmented`, `Modal` and async action primitives.
- `src/tokens.css`: shared colors, dimensions, material gradients and motion values.
- `src/primitives.css` and `src/ui.tsx`: shared visual and React primitives; see [STYLING.md](STYLING.md).
- `src/Components.tsx`: multiselect, calendar, local file input, document actions, inline editor and step navigation.
- `src/styles.css`: original material system and component state transitions.
- `src/canvas.css`: open canvas composition, floating tools and responsive layout.
- `public/`: local assets and font licenses.

The rim uses layered CSS backgrounds, a masked highlight and inset shadows. Pointer position updates CSS variables on the element rather than rerendering React on each move. No WebGL or animation library is needed. Dynamic effects honor `prefers-reduced-motion`; the studio can also disable expressive motion.

Native buttons, inputs, radio groups and modal dialogs provide keyboard behavior. Dialogs use `showModal()`, Escape dismissal and native focus restoration. System reduced motion remains authoritative even when the in-app motion switch is on.

## Assets and attribution

- Layout, CSS material treatment and interaction composition for RIFT.
- Dimensional state emblems built with CSS and Lucide glyphs; no raster icons or remote image dependencies.
- [Lucide](https://lucide.dev) interface icons, ISC.
- DM Sans and Manrope, self-hosted Latin variable fonts, SIL Open Font License; license files included in `public/fonts/`.

## Verification

TypeScript strict checks and production build pass. Browser verification in the T3 Chromium preview covers narrow mobile and desktop layouts, actual form validation and success, category filters, favorite persistence, settings, keyboard search, confirmation modal, Escape/focus restoration, and the hold-to-commit cancel/success paths. See `QA.md` for measured viewport sizes and limits. No claim of complete WCAG conformance or field Core Web Vitals is made.

Muted Prism is the default global component finish. The material selector switches the whole canvas between Muted Prism, Obsidian, Smoke and Frost. Exported presets include the selected finish; resetting restores Muted Prism. Refraction uses CSS gradients and existing pointer illumination, with no raster assets or extra animation loops.

Nine additional studies extend the canvas with compact tabs, workspace navigation, contextual view actions, searchable property selection, inline filters, OKLCH tokens, inbox, comments and bulk actions. The generated Muted Prism hero is self-hosted and respects reduced-motion. See HERO-PROMPT.md for artwork provenance.

Muted Prism controls have a slow pearl-white traveling edge on hover and focus, only during direct interaction. Selected controls remain static when idle. CSS masks isolate it to the border. Reduced-motion and the motion setting keep a static highlight.

Six more specimens use shared field, surface, icon-button and menu-option primitives. Searchable multiselect, date picker, local file input, document actions, inline editing and step navigation all inherit the same tokens, state treatments and animated rim.

The project is being prepared for an open-source GitHub release. The current checkout is the component showcase, not yet a published npm package; package exports, consumer documentation and a license still need to be finalized before release.

The header sun/moon button switches the entire canvas between dark and light mode. Dark remains the initial default; the selected mode is stored locally and restored on the next visit. Shared theme tokens adapt the controls, floating tools, dialogs and Muted Prism material together.
