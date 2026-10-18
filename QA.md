# Obsidian refinement — component audit

The 13 groups remain loose on a shared canvas. Three aligned columns and four row baselines replace arbitrary positions. Filtered collections use a compact grid. Mobile uses natural document flow; tablet uses two aligned columns.

| Group        | Refinement                                                                                           | Browser verification                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Optical edge | Tilted hero removed; compact finish selector and pointer-reactive edge toggle                        | Finish selection and edge activation; no rotated hero object                         |
| Precision    | 26px slider interaction area around a 3px rail, silver thumb, 42×25 switch, consistent labels        | Keyboard slider 68→69 and matching output; focus switch toggles                      |
| Actions      | 40px action rhythm, quieter destructive state, stable async button width, busy semantics             | Loading→done width remains 167px; like and quantity update                           |
| Segments     | Matched radii and motion; keyboard navigation; Compact/Relaxed changes preview spacing               | ArrowRight selects and focuses List; preview changes                                 |
| Header       | Compact freestanding navbar, edge reflection, active page and supporting caption                     | Studio updates; menu Escape closes and restores trigger focus                        |
| Dock         | Shared navigation baseline, restrained rim, active glyph and dot, tooltips                           | Library becomes current                                                              |
| Player       | Neutral album sculpture, larger controls, progress-dependent waveform coloring, clamped bar sizes    | Audio play state; next track updates; pause cleanup                                  |
| Fields       | 43px field rhythm, inset surface, quieter focus ring, truthful validation label, name-derived avatar | Invalid email alert; valid email local success                                       |
| Selection    | Larger chips and radio targets, quieter selected state, aligned checkbox                             | Interest count updates                                                               |
| Disclosure   | Smooth grid-row expansion with inert collapsed content, better line height, aligned pagination       | Second panel expands and becomes non-inert; no right-edge overflow                   |
| Feedback     | CSS metal emblems replace images with white backgrounds, consistent state spacing                    | Loading skeleton and Done emblem                                                     |
| Dialog       | Matched material and radius, CSS shield/check, clearer type hierarchy, touch tooltip fix             | Preset changes edge 69%→70%; success message; Escape dismissal and focus restoration |
| Commit       | Larger hold target, consistent copy, silver progress fill, clearer success                           | Early release cancels; sustained keyboard hold completes                             |

## Viewports and limits

Chromium browser checks: 320×850, 390×844, 768×1024 and 1440×1000. All 13 specimens were checked for horizontal overflow at mobile/tablet sizes. Desktop visual inspection covered the hero and all four component rows, plus filtered feedback view.

Native keyboard interactions verified slider increments, segmented selection and header menu dismissal. Other interaction probes also use browser DOM events. This is manual/probed browser verification, not an automated end-to-end suite.

TypeScript strict check and production Vite build pass. No physical-device, Safari, complete accessibility audit or field performance measurements were performed.

Latest pass: removed decorative copy and hidden dashboard markup, pruned unused styles, checked 13 rendered specimens and zero raster images. Rechecked 390px viewport with no page or specimen horizontal overflow. TypeScript and production build pass after cleanup.

Muted Prism pass: confirmed default global finish, global switch to Obsidian and back, shared refractive rims and pearl primary controls. Browser check at 390px: no document or specimen horizontal overflow; slider interaction remains 26px while the visible rail remains 3px.

## Linear reference expansion and generated hero

Added nine freestanding specimens: compact document tabs, workspace navigation, context toolbar, property picker, inline filters, OKLCH color tokens, inbox, activity thread and batch actions. Reference: https://linear.app/now/behind-the-latest-design-refresh. Used compact tabs, quiet icon treatments, predictable action placement, softened separators and the integrated token editor as design inputs.

Browser probes verified: tab create/close, navigation selection/collapse, list/grid switch, status selection with ArrowDown/Enter and text search, empty filter combination, keyboard hue change reflected in the token preview, inbox unread count, comment submission via Ctrl+Enter, bulk complete and undo. Hero uses a self-hosted WebP, responsive crop and CSS fade-in; reduced-motion disables the animation. 390px mobile check found no page or specimen horizontal overflow. No backend is used; interactions are local demos.

Final responsive pass: 320×850, 390×844, 768×1024 and 1440×1000. All 22 specimens fit without horizontal overflow at mobile/tablet sizes. Verified sort order, tab focus restoration and combined filter reset. Clipboard export was implemented with failure handling but not exercised to preserve the user clipboard. Hero WebP is 49,158 bytes (2172×724); the source PNG is retained.

Animated rim pass: Muted Prism uses a masked 1px conic reflection on hover, focus and selected controls. Browser samples confirmed both the registered angle and rendered gradient changed over 350ms. Disabled button rim stays hidden/paused; motion-off disables the animation. Keyboard focus remains explicit, and error inputs retain their error styling. The textarea wrapper and new rims introduce no horizontal overflow at 320px.

## Shared primitives and six additional specimens

28 specimens total. Browser DOM interaction probes verified multiselect search and Enter selection; calendar month navigation and date selection; inline validation followed by a valid save; document duplication, archive and restore; all three setup steps and restart; local file selection and removal. Shared classes replace repeated icon-button, label, metadata and avatar rules in the previous nine studies. Animated rims now opt in through one `.ui-rim` class.

Responsive checks on all 28 specimens: 320×850, 390×844 and 768×1024 have no document or specimen horizontal overflow. Desktop 1440×1000 visual inspection covers the new aligned rows. No physical-device or Safari verification.
