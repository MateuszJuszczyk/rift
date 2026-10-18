# Verification

Production TypeScript and Vite build verified with `npm run build`.

Browser checks used the T3 Chromium preview, resized to 320 × 850, 390 × 844, 768 × 1024, 1280 px and 1440 × 1000 desktop. These are viewport checks, not physical-device or Safari testing.

- Open canvas: no dashboard sidebar; specimens have transparent backgrounds and no presentation borders.
- Mobile: natural page scrolling, responsive controls; horizontal overflow corrected at the optical decoration.
- Desktop: wheel pan, zoom controls, group dragging, category filtering and centering.
- Search: Cmd/Ctrl K, result filtering and navigation to a specimen.
- Favorites: toggle and browser-local persistence.
- Form: invalid email alert and valid local success; no network submission.
- Confirmation: modal success, Escape dismissal and trigger focus restoration.
- Hold action: early-release cancellation and sustained-hold completion.
- Material inspector: accent change, motion-off transitions and focus restoration.
- Local images and self-hosted fonts loaded.

This is a browser-local interaction demo. No automated end-to-end suite, complete accessibility audit, physical touch-device testing or field performance measurements were performed.
