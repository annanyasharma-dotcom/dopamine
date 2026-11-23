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

---

## InputField

**Purpose:** single-line text entry with a label, optional helper or validation message, and a clear (×) button.

### When to use

- Names, emails, phone numbers, addresses, search terms: any short free-text value.
- When the user needs to see a label and possibly a hint or format example.

### When not to use

- **Verification codes:** use `OtpField`.
- **Multi-line text:** this is a single-line `<input>`; there's no textarea variant yet.
- **Read-only values:** Figma says not to use `disabled` as a substitute for read-only. Show the value as text, or pass `readOnly` (native), knowing there's no designed read-only style.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `label` | **yes** | — | text or node |
| `placeholder` | no | — | format hint or example |
| `helperText` | no | — (hidden) | hint, or the validation message |
| `status` | no | `'default'` | `default`, `success`, `error` |
| `required` | no | `false` | shows the red asterisk |
| `disabled` | no | `false` | boolean |
| `clearable` | no | `true` | shows the × button |
| `onClear` | no | — | called after × is pressed |
| `value` / `defaultValue` | no | — | controlled / uncontrolled |
| any native `<input>` prop | no | — | `type`, `name`, `autoComplete`, `inputMode`, `onChange`, `onBlur`, `ref`, … |

### Behaviour

- **States are automatic.** Rest, active (focused, empty), typing and typed come from focus and value; you only set `status` and `disabled`.
- **Clear:** × empties the field (uncontrolled), calls `onClear`, and puts focus back in the input. In controlled mode, clear `value` inside `onClear`.
- **Validation:** set `status="error"` and a specific `helperText`, typically after blur or submit, not while the user is still typing (Figma guidance). The entered value stays.
- **Success:** set `status="success"` only when confirmation is useful, with a meaningful message.

### Examples

```tsx
import { InputField } from './components';

// Basic, uncontrolled
<InputField label="Full name" name="name" placeholder="e.g. Priya Sharma" required />

// Email with a hint
<InputField label="Email" type="email" autoComplete="email" helperText="We'll send the receipt here" />

// Validate on blur
const [email, setEmail] = useState('');
const [touched, setTouched] = useState(false);
const invalid = touched && !email.includes('@');

<InputField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  onClear={() => setEmail('')}
  onBlur={() => setTouched(true)}
  status={invalid ? 'error' : 'default'}
  helperText={invalid ? 'Enter an email like name@example.com' : undefined}
  required
/>

// Phone number
<InputField label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit number" />

// Disabled until a prerequisite is met
<InputField label="Coupon code" disabled helperText="Add an item to your cart to use a coupon" />
```

### Composition

- Stack fields in a column with `--gap-16` or more; the label chip sits 6px above each field's own top padding, so fields need room between them.
- Pair with `Button` (`type="submit"`) for forms.
- The field fills its container's width; constrain it with the parent.

### Responsive

- Width is 100% of the parent; height is fixed (44px box, 80px with helper). Text sizes don't change with screen width.

### Accessibility

- The label is a real `<label>` tied to the input, and the helper is announced through `aria-describedby`.
- `status="error"` sets `aria-invalid`. Always pair it with a message; don't rely on red alone (Figma guidance). The same applies to green for success.
- Use `required` rather than only showing an asterisk, so assistive tech knows.
- The × button is labelled “Clear” and is keyboard-reachable.
- **Contrast:** the default grey helper text (3.94:1) and the placeholder grey (about 2.96:1) are below WCAG AA 4.5:1. This is a token issue, tracked in MASTER.md → Known issues. Don't put essential information in the placeholder.

### Common mistakes

- ❌ Showing an error while the user is still typing the first time.
- ❌ Using `disabled` for read-only data.
- ❌ Putting the hint in `placeholder` only. Placeholders disappear when typing; use `helperText` for anything the user must remember.
- ❌ In controlled mode, forgetting `onClear`. The × will then do nothing visible.

### Edge cases and limitations

- No designed focus border: the active state differs only by the caret.
- The clear button shows even when the field is empty (as in Figma).
- No prefix/suffix icons, character counter or multi-line variant yet.

---

## OtpField

**Purpose:** entering a 4- or 6-digit one-time verification code, with feedback and a resend action.

### When to use

- Phone or email verification, login codes, payment confirmation codes.
- `digits={4}` or `digits={6}`: match the length of the code your backend sends.

### When not to use

- Passwords or PINs that should be hidden: digits are shown in plain text.
- Codes containing letters: the field accepts digits only.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `digits` | no | `4` | `4`, `6` |
| `value` / `defaultValue` | no | — | code string |
| `onChange` | no | — | `(code: string) => void` |
| `onComplete` | no | — | `(code: string) => void`, fired when all boxes are filled |
| `status` | no | `'default'` | `default`, `success`, `error` |
| `disabled` | no | `false` | boolean |
| `helperText` | no | — (hidden) | hint or result message |
| `onResend` | no | — | shows the resend row |
| `resendPrompt` / `resendLabel` | no | `'Didn’t receive OTP?'` / `'Resend OTP'` | text |
| `aria-label` | no | `'One-time code'` | group name |
| `autoFocus` | no | `false` | focus first box on mount |
| `name` | no | — | adds a hidden input for forms |

### Behaviour

- **Typing** fills boxes left to right and moves focus forward; letters are ignored.
- **Backspace** clears a box, or in an empty box deletes the previous digit and moves back.
- **← / →** move between boxes.
- **Paste** and phone **SMS autofill** fill all boxes at once.
- **`onComplete`** fires when every box is filled. A complete code isn't a verified one (Figma guidance): verify it, then set `status`.
- **Resend:** the component only shows the action. Cooldown timers, limits and “code sent” feedback belong to your flow (Figma guidance), e.g. by setting `disabled`/changing `resendLabel` or removing `onResend` during a cooldown.

### Examples

```tsx
import { OtpField } from './components';

// Verify when complete
const [code, setCode] = useState('');
const [status, setStatus] = useState<'default' | 'success' | 'error'>('default');

<OtpField
  digits={6}
  value={code}
  onChange={(next) => { setCode(next); setStatus('default'); }}
  onComplete={async (full) => setStatus((await verify(full)) ? 'success' : 'error')}
  status={status}
  helperText={
    status === 'error' ? 'That code is incorrect. Check the SMS or request a new code.'
    : status === 'success' ? 'Phone number verified'
    : 'Enter the 6-digit code sent to +91 98xxxxxx10'
  }
  onResend={sendNewCode}
  autoFocus
/>

// Inside a form
<form onSubmit={submit}>
  <OtpField name="otp" digits={4} />
  <Button type="submit" leftIcon={false} rightIcon={false}>Verify</Button>
</form>

// Resend cooldown handled by the product flow
<OtpField
  onResend={cooldown > 0 ? undefined : sendNewCode}
  helperText={cooldown > 0 ? `You can request a new code in ${cooldown}s` : undefined}
/>
```

### Composition

- Put the destination (“sent to +91…”) in `helperText` or in text above the field (Figma guidance: give context about where the code was sent).
- Follow with a `Button` if verification isn't automatic on completion.

### Responsive

- Fixed size: 4 digits are 212px wide, 6 digits 324px. Fits a 360px phone screen with 16px side margins.

### Accessibility

- Boxes are grouped (`role="group"`, `aria-label`) and each is labelled “Digit n of N”.
- `inputMode="numeric"` brings up the number pad on phones; `autocomplete="one-time-code"` enables SMS autofill.
- `status="error"` sets `aria-invalid`. Always pair colour with a message (Figma guidance: don't rely on red or green alone).
- The resend action is a real button. Its coral text is 3.18:1 on white, below WCAG AA (token issue, see MASTER.md).

### Common mistakes

- ❌ Treating `onComplete` as success. Verify first.
- ❌ Using `disabled` to show success; Figma says not to.
- ❌ Clearing the digits on error without saying so; Figma suggests keeping them where appropriate and explaining how to recover.
- ❌ Implementing resend without a cooldown or confirmation.

### Edge cases and limitations

- Digits only; letters can't be entered.
- Deleting a middle digit shifts later digits left.
- Error and success colours use the current semantic tokens, which differ slightly from the legacy colours in the Figma OTP frame (see MASTER.md → Known issues).
