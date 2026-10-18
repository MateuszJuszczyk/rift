# Shared component styling

Change the common appearance before adding a component-specific rule.

1. `src/tokens.css` defines the visual contract: `--ui-*` colors, radii, sizes, spacing, focus and rim timing, plus `--prism-*` material gradients.
2. `src/primitives.css` owns global classes for layout, typography, surfaces and control states.
3. `src/ui.tsx` wraps these classes in reusable React primitives: `Button`, `IconButton`, `Field`, `Surface` and `MenuOption`.
4. `src/rim.css` owns the single `.ui-rim` reflection effect, its selected/hover/focus states, disabled behavior and motion preferences.
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
