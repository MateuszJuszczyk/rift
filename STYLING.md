# Shared component styling

Change the common appearance before adding a component-specific rule.

1. `src/tokens.css` defines the visual contract: `--ui-*` colors, radii, sizes, spacing, focus and rim timing, plus `--prism-*` material gradients.
2. `src/primitives.css` owns global classes for layout, typography, surfaces and control states.
3. `src/ui.tsx` wraps these classes in reusable React primitives: `Button`, `IconButton`, `Field`, `Surface` and `MenuOption`.
4. `src/rim.css` owns the single `.ui-rim` reflection effect, its hover/keyboard-focus/pressed states, disabled behavior and motion preferences.
5. Component styles should describe geometry unique to that component. `src/components.css`, for example, only arranges the calendar table.

## Classes

| Purpose             | Global classes                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| Composition         | `ui-stack`, `ui-row`, `ui-between`, `ui-wrap`, `ui-grow`, `ui-actions`                                    |
| Type                | `ui-label`, `ui-hint`, `ui-error`, `ui-title`, `ui-copy`, `ui-meta`                                       |
| Material            | `ui-surface`, `ui-panel`, `ui-rim`                                                                        |
| Controls            | `ui-icon-button`, `ui-field`, `ui-field-group`, `ui-option`, `ui-day`                                     |
| Supporting elements | `ui-avatar`, `ui-chip`, `ui-divider`, `ui-empty`, `ui-scroll`, `ui-preview`, `ui-progress`, `ui-dropzone` |

Use native state attributes (`disabled`, `aria-pressed`, `aria-selected`, `aria-invalid`) rather than inventing another selected or disabled class. `data-highlighted` is reserved for the multiselect keyboard cursor. `Field` owns its label, error association and shared material wrapper. Keep geometry out of inline styles unless it is driven by interaction, such as canvas positions or range fill.

Existing studies now share icon buttons, labels, metadata and avatars. Existing controls opt into the same `.ui-rim` effect. Specialized geometry such as a switch thumb, player waveform or optical edge remains in its component stylesheet; the original styles are being migrated incrementally.

The six new studies use these primitives without their own color palettes or independent surface definitions. Muted Prism stays the default finish. Reduced motion and the global motion switch retain a static edge highlight.

## Color modes

The header switches `data-theme` on the document root between `dark` (default) and `light`. The choice is saved under `rift-theme`; storage failures leave the switch functional in memory. A small head script applies a saved choice before React renders. Native controls use the matching `color-scheme`, and the browser theme color follows the choice.

`src/theme.css` owns the light semantic tokens and material adjustments. `src/palette.css` centralizes existing neutral colors, retaining their exact dark values and providing light equivalents for the older controls. New components should use semantic `--ui-*` tokens rather than adding hex-named neutral tokens. The material selector and color mode are independent; no per-component theme prop is needed. Preset JSON includes the color mode.

Traveling rims only run during hover on a fine pointer, visible keyboard focus (including field wrappers), or an active press. Selection attributes do not start an animation. `Surface` stays static; use `.ui-rim` on the actual interactive control or its field wrapper.
