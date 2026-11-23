# Component Use Cases

How and when to use each component. The full API is in [MASTER.md](./MASTER.md); both files describe the same current API.

Setup, once per app:

```tsx
import './tokens/fonts.css';
import './tokens/tokens.css';
```

---

## Button

**Purpose:** triggers an action (submit, continue, add, open). Renders a native `<button>`.

### When to use

| Variant | Use for | Figma guidance |
| --- | --- | --- |
| `brand` | The primary action in a task or section. | Avoid competing primary actions in the same action group. |
| `black` | A high-emphasis neutral action where coral isn't appropriate. | Keep a clear hierarchy; not an arbitrary colour alternative. |
| `outline` | A secondary action that needs a visible boundary. | White surface, coral text; check contrast in context. |
| `inverse` | A neutral secondary action, especially on dark or coloured surfaces. | Not transparent and not theme-inverting. |
| `ghost` | A low-emphasis, optional or tertiary action. | Keep it discoverable. |

| Size | Use for |
| --- | --- |
| `sm` (44px, 14px text) | Compact contexts: cards, lists, dialogs. |
| `lg` (56px, 16px text) | Prominent or spacious contexts: page-level CTAs, bottom bars. Ghost stays 44px tall at both sizes; only the text grows. |

### When not to use

- **Navigation to another page:** use a link (`<a href>`). Button is for actions.
- **Showing progress or success:** `disabled` must not be used as loading, selected or completed feedback (Figma guidance). There is no loading state yet.
- **Several `brand` buttons side by side:** make one primary and the rest `outline`, `inverse` or `ghost`.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `children` | **yes** | — | Label text or node |
| `variant` | no | `'brand'` | `brand`, `black`, `outline`, `inverse`, `ghost` |
| `size` | no | `'sm'` | `sm`, `lg` |
| `disabled` | no | `false` | boolean |
| `leftIcon` | no | `true` (arrow-left) | `true`, `false`, or a custom icon node |
| `rightIcon` | no | `true` (arrow-right) | `true`, `false`, or a custom icon node |
| `type` | no | `'button'` | `button`, `submit`, `reset` |
| any native `<button>` prop | no | — | `onClick`, `aria-label`, `form`, `name`, `ref`, … |

> Both arrows show by default because that's the Figma component's default. Most real buttons will set `leftIcon={false}` and/or `rightIcon={false}`.

### Behaviour

- **Input:** `onClick(event)` fires on mouse click, Enter or Space.
- **Disabled:** the native `disabled` attribute is set, so the button can't be clicked or focused and `onClick` doesn't fire. It shows grey disabled colours.
- **Form:** `type` defaults to `'button'`. Pass `type="submit"` to submit a form.
- **Keyboard focus:** shows a blue focus ring.
- **Hover, pressed and loading** states aren't designed yet, so they don't exist.

### Examples

```tsx
import { Button } from './components';

// Primary action, arrows hidden
<Button onClick={save} leftIcon={false} rightIcon={false}>Save</Button>

// "Continue" with only the right arrow, large
<Button size="lg" leftIcon={false} onClick={next}>Continue</Button>

// Back + Next pair: one primary, one secondary
<div style={{ display: 'flex', gap: 'var(--gap-12)' }}>
  <Button variant="outline" rightIcon={false} onClick={back}>Back</Button>
  <Button leftIcon={false} onClick={next}>Next</Button>
</div>

// Form submit, disabled until valid
<Button type="submit" disabled={!isValid} leftIcon={false} rightIcon={false}>Place order</Button>

// Custom icon: draw with currentColor so it takes the variant's icon colour
<Button variant="black" rightIcon={false} leftIcon={<PlusIcon />}>Add to cart</Button>

// Low-emphasis optional action
<Button variant="ghost" leftIcon={false}>View details</Button>

// On a dark surface
<div style={{ background: 'var(--bg-brand-primary-inverse)' }}>
  <Button variant="inverse">Learn more</Button>
</div>
```

### Composition

- Group related actions in a row with `--gap-*` spacing; put the primary (`brand`) action last (right-most) or first, consistently within a screen.
- For full-width buttons, set width on the button via `className` or `style` (`width: 100%`); the content stays centred.
- Button has no child components; pass icons through `leftIcon` / `rightIcon` instead of putting them in `children`.

### Responsive

- Size doesn't change with screen width; choose `sm` or `lg` explicitly.
- Width hugs the label. Labels don't wrap (`white-space: nowrap`), so keep them short or set a width and let the container handle overflow.

### Accessibility

- The accessible name is `children`. If you make an icon-only button (`children` empty), add `aria-label`.
- Icons are hidden from screen readers.
- Explain why a button is disabled nearby when the reason isn't obvious (Figma guidance).
- **Contrast:** `brand` (white on coral) and `outline` / `ghost` (coral on white) measure about 3.2:1, below WCAG AA 4.5:1 for 14–16px text. This is a design-token issue, tracked in MASTER.md → Known issues. `black` and `inverse` pass.

### Common mistakes

- ❌ Using `type="brand"` for the look. The visual prop is **`variant`**; `type` is the native button type.
- ❌ Hardcoding colours via `style` to make a new variant. Use an existing variant or add one to the design system.
- ❌ Putting an icon inside `children`. Use `leftIcon` / `rightIcon` so sizing and colour are correct.
- ❌ Using `disabled` to show loading.
- ❌ Forgetting the default arrows: pass `leftIcon={false}` / `rightIcon={false}` when you don't want them.

### Edge cases and limitations

- Disabled styling for `black`, `outline`, `inverse` and `ghost` isn't in Figma; they reuse the brand disabled look.
- Custom icons render in a fixed 24×24 slot.
- Light theme only.
