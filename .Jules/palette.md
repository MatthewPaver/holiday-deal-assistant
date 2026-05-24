## 2024-05-24 - Accessibility states for toggle controls
Learning: Visual active states (CSS classes like `.active` or `.selected`) don't convey meaning to assistive technologies. Custom toggle controls require `aria-pressed` for screen readers to understand their current state.
Action: Whenever adding an `.active` or `.selected` class to a `<button>` that acts as a toggle, always pair it with the corresponding `aria-pressed={boolean}` attribute.

## 2024-05-24 - Semantic elements and accessible names
Learning: Semantic elements like `<meter>` need explicit accessible names (e.g. using `aria-label` or `aria-labelledby`) because they do not reliably inherit them from adjacent text elements like `<span>`, even if they are visually grouped together.
Action: Add `aria-label` or `aria-labelledby` directly to `<meter>` and `<progress>` elements to ensure their context is properly announced by screen readers.
