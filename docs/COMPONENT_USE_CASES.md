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

---

## CounterBadge

**Purpose:** a small number that counts something next to an icon, tab or label (cart items, unread messages, notifications).

### When to use

| Colour | Use for | Figma guidance |
| --- | --- | --- |
| `brand` | The main count with brand emphasis. | Coral doesn't automatically mean error or urgency. |
| `blue` | A count in a product-defined blue / informational category. | The name doesn't define meaning; say what's counted. |
| `green` | A count in a product-defined green category (e.g. completed). | Green alone doesn't prove success. |
| `disabled` | A muted count when its parent control is unavailable. | Keep the number accurate; explain unavailability around it. |

### When not to use

- **Status without a number** (online dot, “new” label): this component always shows a number.
- **Zero:** hide the badge instead of showing 0 (as `Header` does).
- **Long text:** it's for numbers only.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `count` | **yes** | — | number |
| `colour` | no | `'brand'` | `brand`, `blue`, `green` |
| `disabled` | no | `false` | boolean |
| `max` | no | `99` | counts above show as “99+” |
| `aria-label` | no | — | what is counted, e.g. “3 unread messages” |
| native `<span>` props | no | — | `className`, `aria-hidden`, `ref`, … |

### Behaviour

- Display only; no interaction.
- One digit: 16px circle. Two or more: widens into a pill. Above `max`: “{max}+”.

### Examples

```tsx
import { CounterBadge } from './components';

// Next to a label
<span>Messages <CounterBadge count={unread} aria-label={`${unread} unread messages`} /></span>

// Hide at zero
{items > 0 && <CounterBadge count={items} />}

// Category count
<CounterBadge colour="green" count={completed} aria-label={`${completed} completed`} />

// Inside a button that already says the count: hide the badge from screen readers
<button aria-label={`Cart, ${n} items`}><BagIcon /><CounterBadge count={n} aria-hidden="true" /></button>
```

### Composition

- Position it on an icon with your own wrapper (`position: relative` on the icon, `position: absolute` on the badge), as `Header` does for the cart.
- Use one colour per meaning across the product.

### Responsive

- Fixed 16px height at all screen sizes.

### Accessibility

- A bare number means nothing to a screen reader. Give it an `aria-label`, or put the count in the parent control's name and set `aria-hidden` on the badge.
- Don't rely on colour to explain the category (Figma guidance).
- Contrast: white on coral is about 3.2:1 (same token issue as Button; see MASTER.md).

### Common mistakes

- ❌ Showing “0”.
- ❌ Using `green` to mean “verified” without explaining it.
- ❌ Leaving the badge unlabelled when it's the only place the count appears.

### Edge cases and limitations

- Disabled styling for brand/blue isn't in Figma; they use the same muted look as green disabled.
- Negative numbers aren't handled specially.

---

## Header

**Purpose:** the top app bar for brand-level screens. It shows the current delivery location, with profile and cart access.

### When to use

- Home or other top-level screens where the delivery destination should stay visible (Figma: Pageheader `usage=brand`).

### When not to use

- **Inner pages** (cart, product detail, HIH): Figma has separate page-header layouts for those (`cart`, `PDP`, `HIH`, `location`) that aren't built yet.
- **Real apps on a phone:** don't turn on `statusBar`; the device draws its own.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `locationLabel` | **yes** | — | e.g. “Office”, “Home” |
| `locationAddress` | no | — | address; truncated with “…” |
| `onLocationClick` | no | — | open the address picker |
| `profile` | no | `true` | show the profile button |
| `onProfileClick` | no | — | |
| `cart` | no | `true` | show the cart button |
| `cartCount` | no | — | badge number; hidden at 0 |
| `onCartClick` | no | — | |
| `statusBar` | no | `false` | illustrative phone status bar (mock-ups only) |
| native `<header>` props | no | — | `className`, `ref`, … |

### Behaviour

- The location pill, profile and cart are buttons; each calls its handler.
- The cart badge appears when `cartCount` > 0 and uses `CounterBadge`.
- Long addresses are cut with “…”; the name always shows in full.
- Address selection, navigation and the cart count's source are up to your product flow (Figma guidance).

### Dependencies

- `CounterBadge` (cart count).

### Examples

```tsx
import { Header } from './components';

<Header
  locationLabel="Office"
  locationAddress={address.line1}
  onLocationClick={openAddressPicker}
  onProfileClick={() => navigate('/account')}
  cartCount={cart.items.length}
  onCartClick={() => navigate('/cart')}
/>

// Before the user has chosen an address
<Header locationLabel="Select delivery location" onLocationClick={openAddressPicker} cart={false} />

// Prototype / mock-up screenshot with the phone status bar
<Header statusBar locationLabel="Office" locationAddress="3rd floor, Motorola Building" cartCount={3} />
```

### Composition

- Place it at the top of the screen; for a sticky header, wrap it or pass `className` with `position: sticky; top: 0`.
- Don't add other buttons inside it; it has no slots.

### Responsive

- Fills its container's width. The location pill takes the remaining space and truncates the address; the 40px buttons stay fixed. Designed at 360px wide.

### Accessibility

- Renders a `<header>` landmark.
- Buttons are named “Profile” and “Cart” / “Cart, 3 items”. The pill's name is its visible text.
- The status bar is hidden from screen readers.

### Common mistakes

- ❌ Leaving `statusBar` on in production.
- ❌ Passing the count to a separate badge instead of `cartCount` (the cart button's accessible name wouldn't include it).
- ❌ Using sample text (“Office”, “3rd floor, Motorola…”) in production.

### Edge cases and limitations

- Only the `brand` layout is built; other Figma page-header layouts aren't.
- The status bar shows fixed sample values (5:13, battery 76).
- Some colours are exact Figma values with no matching token yet (see MASTER.md → Known issues).

---

## Icon

**Purpose:** show an icon from the shared icon library, coloured with a token.

### When to use

- Any time you need an icon that's in the library (see MASTER.md → Icon for the full list with sizes).
- When you need the same icon in different colours: one file, coloured with `color`.
- **For new UI, prefer the Icon repo icons** (`<icon>-regular` / `<icon>-bold`): the general-purpose 24px set from Figma's Icon repo. Use `-regular` by default and `-bold` where Figma uses the bold weight (for example on small or emphasised controls). Phone has `phone-telephone-filled` instead of bold.

### When not to use

- **Icons that aren't in the library yet:** don't paste SVG markup into a component. Add the Figma export to the library instead (see MASTER.md → Icon → Adding an icon).
- **Photos or multi-colour illustrations:** the library draws one-colour icons only.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `name` | **yes** | — | Icon repo: `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right`, `check`, `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right`, `close`, `plus`, `search`, each as `-regular` / `-bold`; `phone-telephone-regular` / `phone-telephone-filled`. Component icons: `arrow-left`, `bestseller`, `check`, `chevron-down`, `chevron-right`, `chevron-right-small`, `chevron-up`, `close`, `close-filled`, `good-experience`, `info`, `restart`, `search`, `star`, `upload` |
| `size` | no | Figma size (12–24; Icon repo: 24) | px |
| `color` | no | Figma colour | CSS colour or token, or `currentColor` |
| `label` | no | — (decorative) | accessible name |

### Examples

```tsx
import { Icon } from './components';

<Icon name="bestseller" />                                  // 14px, #722902 as in Figma
<Icon name="arrow-right-regular" />                         // Icon repo, 24px black
<Icon name="plus-bold" size={16} color="var(--icon-brand-coral)" />
<Icon name="phone-telephone-filled" label="Call pharmacist" />
<Icon name="check" color="var(--icon-brand-primary-inverse)" /> // white check on a coral button
<Icon name="check" color="var(--icon-success-base)" label="Verified" /> // meaningful icon
<span style={{ color: 'var(--text-brand-brand)' }}>
  <Icon name="check" size={16} color="currentColor" /> Saved
</span>
```

### Accessibility

- Decorative by default (`aria-hidden`). Pass `label` only when the icon is the only thing carrying the meaning.
- When the icon sits next to text that says the same thing, leave `label` off.

### Common mistakes

- ❌ Hardcoding a hex in `color`. Use a token.
- ❌ Giving a decorative icon a `label`, so screen readers say it twice.
- ❌ Mixing `check` (SKU card artwork) with `check-regular` (Icon repo) on one screen: they're drawn differently. Same for `close`, `search`, `chevron-*` and `arrow-left`.

---

## SkuCard

**Purpose:** show a product with its price and delivery time, plus an add-to-cart control.

### When to use (Figma guidance)

| Variant | Props | Use for |
| --- | --- | --- |
| Large vertical | `large` (default) | Inline widgets and category results in Spotlight search: the richest format, with ratings and coupon. |
| Small vertical | `large={false}` | Compact lists such as previously ordered items. |
| Small horizontal | `large={false} orientation="horizontal"` | Ad widgets and suggestions on search/category pages. |

### When not to use

- **Full product details:** this is a card for lists; use a product page.
- **Showing “added” before the cart confirms.** Figma: switch to the added state only after success.

### Properties

| Prop | Required | Default | Notes |
| --- | --- | --- | --- |
| `name` | **yes** | — | 2 lines max |
| `price` | **yes** | — | formatted string, e.g. “₹93” |
| `large` | no | `true` | |
| `orientation` | no | `'vertical'` | small only |
| `added` | no | `false` | |
| `tag` | no | `true` | image tag, large only: `true` (Bestseller), a `Tag` type, or `false` |
| `quantity`, `imageSrc`, `imageAlt`, `deliveryTime`, `mrp`, `discount` | no | — | |
| `rating`, `ratingCount`, `offerPrice`, `offerText`, `offerCode`, `addedQuantity` | no | — (`offerText` “Use Code on cart”, `addedQuantity` 1) | large only |
| `onAdd`, `onAddedClick` | no | — | |

> `tag` defaults to `true` (as in Figma), so the Bestseller tag shows unless you pass `tag={false}`. Pass the tag that fits the product: `tag="previously-bought"`, `"promoted"`, `"sold-out"`, or `false` for none.

### Behaviour

- Not added: the Add bar (large) or + button (small) calls `onAdd`.
- Added: “{n} added ⌄” (large) or ✓ (small) calls `onAddedClick`. What it does (quantity stepper, remove) is up to your flow (Figma guidance).
- Prices and discounts are display strings; format currency before passing them in.
- Missing optional fields are simply not rendered (no rating row without `rating`, no offer row without `offerPrice`).

### Dependencies

- `Icon` (check), `Tag` (image tag).

### Examples

```tsx
import { SkuCard } from './components';

// Large card in a widget, synced with the cart
const qty = cart.quantityOf(p.id);
<SkuCard
  name={p.name}
  quantity={p.packSize}
  imageSrc={p.image}
  deliveryTime="30 mins"
  price={formatINR(p.price)}
  mrp={formatINR(p.mrp)}
  discount={`${p.discountPct}% off`}
  rating={p.rating}
  ratingCount={`(${p.ratingCountLabel})`}
  offerPrice={formatINR(p.couponPrice)}
  offerCode={p.couponCode}
  tag={p.soldOut ? 'sold-out' : p.isBestseller ? 'bestseller' : p.boughtBefore ? 'previously-bought' : false}
  added={qty > 0}
  addedQuantity={qty}
  onAdd={async () => { await cart.add(p.id); }}
  onAddedClick={() => openQuantitySheet(p.id)}
/>

// Previously ordered list
<div style={{ display: 'flex', gap: 'var(--gap-16)', overflowX: 'auto' }}>
  {orders.map((p) => (
    <SkuCard key={p.id} large={false} name={p.name} quantity={p.packSize} price={formatINR(p.price)}
      deliveryTime="30 mins" added={cart.has(p.id)} onAdd={() => cart.add(p.id)} />
  ))}
</div>

// Ad / suggestion row
<SkuCard large={false} orientation="horizontal" name={p.name} price={formatINR(p.price)} mrp={formatINR(p.mrp)} onAdd={() => cart.add(p.id)} />
```

### Composition

- Lay out large and small vertical cards in a horizontal scroller or grid; the cards have fixed widths (132px / 76px).
- Leave about 12px of space above small cards: the + button sits 11px above the image.

### Responsive

- Fixed widths: large 132px, small vertical 76px, horizontal 328px. Wrap them in a grid or scroller to adapt to the screen.

### Accessibility

- Each card is an `<article>`. Buttons are named “Add” / “1 added” (large) and “Add to cart” / “Added to cart” (small).
- The image is decorative by default; pass `imageAlt` only if the image adds information the name doesn't.
- Contrast: the coral “Add” text on white and white on coral are about 3.2:1 (same token issue as Button; see MASTER.md).

### Common mistakes

- ❌ Leaving `tag` on (Bestseller) for every product.
- ❌ Setting `added` optimistically before the cart call succeeds.
- ❌ Passing raw numbers for prices (`price={93}` renders “93”, without the ₹).
- ❌ Using `orientation="horizontal"` with `large`: it's ignored, since Figma has no large horizontal card.

### Edge cases and limitations

- Names longer than 2 lines are cut with “…”.
- No quantity stepper or remove control; `onAddedClick` is where your flow handles that.
- Some colours are exact Figma values without tokens yet (see MASTER.md → Known issues).

---

## Toast

**Purpose:** a brief, non-blocking message about something that just happened.

### When to use (Figma guidance)

| Type | Use for |
| --- | --- |
| `success` | Confirming an action the user took, when the result isn't otherwise obvious. |
| `error` | An operation failed; say what failed and how to recover. |
| `warning` | A non-blocking caution about a possible issue. |
| `info` | A neutral update with no success/failure meaning. |
| `white` | A neutral, low-emphasis message where semantic colour isn't needed. |

Add `actionLabel` only for one relevant follow-up. Use “Undo” only when the change can really be reversed; for retries use a matching label such as “Retry”.

### When not to use

- **Decisions the user must make before continuing:** use a dialog.
- **Critical or unresolved errors:** keep them visible in context, not only in a toast.
- **Routine changes that are already visible:** don't add a redundant toast.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `label` | **yes** | — | message |
| `type` | no | `'warning'` | `warning`, `error`, `success`, `info`, `white` |
| `icon` | no | `true` | status icon |
| `cross` | no | `true` | × button |
| `onDismiss` | no | — | × handler |
| `actionLabel` / `onAction` | no | — | action button |

### Behaviour

- The Toast is just the message bar. Your app decides when to show it, where (e.g. bottom of the screen), how many to stack, and when to hide it.
- `error` is announced immediately (`role="alert"`); other types politely (`role="status"`).

### Example

```tsx
import { Toast } from './components';

{toast && (
  <div style={{ position: 'fixed', left: 16, right: 16, bottom: 16 }}>
    <Toast
      type="success"
      label="Item archived."
      actionLabel="Undo"
      onAction={() => restore(item.id)}
      onDismiss={() => setToast(null)}
    />
  </div>
)}
```

### Accessibility

- Messages should make sense without colour (“Payment failed”, not just a red bar).
- Don't auto-hide a toast that has an action too quickly; users need time to reach it.

### Common mistakes

- ❌ “Undo” on something that can't be undone.
- ❌ Using `white` to soften a real error.
- ❌ More than one action. The design has room for one.

---

## Rating

**Purpose:** show a product's average rating with a colour band.

### When to use

- Next to products or services that have a user rating. Pick `type` from your product's banding rules (Figma doesn't define the thresholds).

### When not to use

- **No ratings yet:** don't show a badge (and don't use `bad` for “no data”).
- **Rating input:** this is display only.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `value` | **yes** | — | e.g. `4.5` |
| `type` | no | `'good'` | `good`, `avg`, `bad` |

### Example

```tsx
import { Rating } from './components';

const band = (r: number) => (r >= 4 ? 'good' : r >= 3 ? 'avg' : 'bad'); // your product's rules
<Rating value={product.rating} type={band(product.rating)} />
```

### Accessibility

- Read as “Rated 4.5”.
- The `good` green with white text is about 3.9:1 contrast, below WCAG AA (token issue; see MASTER.md).

### Common mistakes

- ❌ Treating a low rating as a safety or error signal (Figma guidance).

---

## Logo

**Purpose:** the TATA 1mg logo.

### When to use

| Props | Use on |
| --- | --- |
| `colour="black"` (default) | White or light backgrounds. |
| `colour="brand"` | Light backgrounds where the brand colour is wanted. |
| `inverse` | Dark or coloured backgrounds (white logo). |

### Properties

| Prop | Required | Default |
| --- | --- | --- |
| `colour` | no | `'black'` |
| `inverse` | no | `false` |
| `label` | no | `'TATA 1mg'` |

### Example

```tsx
import { Logo } from './components';

<Logo />
<Logo colour="brand" />
<div style={{ background: 'var(--bg-brand-coral)' }}><Logo colour="brand" inverse /></div>
```

### Common mistakes

- ❌ Stretching or recolouring the logo with custom CSS. Use the props.
- ❌ Hiding it from screen readers when it's the only brand name on the page.

---

## Footer

**Purpose:** brand sign-off at the end of a page: TATA 1mg logo with “Adding some sunshine to your life”.

### When to use

- After the main content of a page or flow.

### When not to use

- As a sticky action bar, navigation or legal footer (Figma guidance). Add links and legal text with a separate pattern.

### Properties

None besides native `<footer>` props. It's static: the logo, wording and gradient are approved brand elements.

### Example

```tsx
import { Footer } from './components';

<main>{/* page content */}</main>
<Footer />
```

---

## Widget

**Purpose:** a titled section on a page that holds a group of content (SKUs, list items, grids).

### When to use

- Home and listing pages, for each content section (“Previously ordered”, “Your account”…).
- Show the chevron only when there's a real “see all” destination (Figma guidance).

### When not to use

- **Single items:** use the item directly (e.g. `ListItem`).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `title` | **yes** | — | section title |
| `subtitle` | no | — | supporting line |
| `chevron` | no | `true` | |
| `onChevronClick` | no | — | makes the chevron a button |
| `chevronLabel` | no | `'See all'` | accessible name |
| `children` | no | — | the section's content |

### Dependencies

- `Icon` (chevron-right). Designed to hold `SkuCard`, `ListItem` and similar.

### Examples

```tsx
import { Widget, SkuCard, ListItem } from './components';

<Widget title="Previously ordered" subtitle="Reorder in one tap" onChevronClick={() => navigate('/orders')}>
  <div style={{ display: 'flex', gap: 'var(--gap-16)', overflowX: 'auto' }}>
    {items.map((p) => <SkuCard key={p.id} large={false} {...toSkuProps(p)} />)}
  </div>
</Widget>

<Widget title="Your account" chevron={false}>
  <div style={{ display: 'grid', gap: 'var(--gap-12)' }}>
    <ListItem title="My orders" subtitle="Track, return or reorder" onClick={openOrders} />
  </div>
</Widget>
```

### Accessibility

- The title is an `<h2>`, so sections show up in screen-reader heading navigation.
- Give the chevron a specific `chevronLabel` (e.g. “See all previously ordered items”) when several widgets are on one page.

### Common mistakes

- ❌ Leaving the chevron on without `onChevronClick`. It then shows but does nothing.
- ❌ Shipping Figma's pink placeholder slot.

---

## ListItem

**Purpose:** one row in a list: optional leading media, a title, an optional subtitle and a chevron.

### When to use

- Menus, settings, account pages, any list of destinations.
- Inside a `Widget`, or stacked on its own.

### When not to use

- **Products:** use `SkuCard`.
- **Long text:** title and subtitle are one line each and get cut with “…”.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `title` | no | — | main text (Figma `t1`) |
| `subtitle` | no | — | supporting text (Figma `t2`) |
| `media` | no | `true` (placeholder) | `true`, `false`, or a node (image, `Icon`) |
| `chevron` | no | `true` | |
| `onClick` | no | — | makes the row a button |

> `media` defaults to `true`, which shows Figma's pink placeholder. Pass a real image/icon, or `media={false}`.

### Examples

```tsx
import { ListItem, Icon } from './components';

<ListItem title="Lab tests" subtitle="Book at home" media={<img src={labIcon} alt="" />} onClick={openLabs} />
<ListItem title="Saved addresses" media={false} onClick={openAddresses} />
<ListItem title="App version 4.2.0" media={false} chevron={false} />
```

### Accessibility

- With `onClick`, the whole row is one button whose name is its text.
- Without `onClick`, it's static content; don't show the chevron then.

### Common mistakes

- ❌ Leaving the default placeholder media in production.
- ❌ Chevron on a row that doesn't go anywhere.

---

## Tag

**Purpose:** a short product label, such as Bestseller or Sold out.

### When to use

| Type | Text | Use for |
| --- | --- | --- |
| `bestseller` | Bestseller | Products that are bestsellers by your product's definition. |
| `previously-bought` | Previously bought | Items the user has ordered before. |
| `promoted` | 1mg’s choice | Products recommended or promoted by 1mg. |
| `sold-out` | Sold out | Items that can't be ordered right now. |

### When not to use

- **Interactive filters or chips:** Tag is display only.
- **Long text:** it's a single short line.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `type` | no | `'bestseller'` | `bestseller`, `previously-bought`, `promoted`, `sold-out` |
| `label` | no | Figma text | custom text |

### Examples

```tsx
import { Tag, SkuCard } from './components';

<Tag type="sold-out" />
<Tag type="previously-bought" />
<SkuCard tag="promoted" name="…" price="₹93" />   // on a product card
```

### Accessibility

- The text is read as-is; icons are decorative.
- If an item is sold out, also disable or hide its add action; the tag alone isn't enough.

### Common mistakes

- ❌ Showing “Sold out” but leaving the Add button active.
- ❌ More than one tag on the same image.

---

## Search

**Purpose:** a search bar, optionally with a Labs AI button.

### When to use

- At the top of home or listing screens to search products, tests or doctors.
- `labsAi` when the screen offers the Labs AI assistant.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `placeholder` | no | — | e.g. “Search ‘crocin’...” |
| `labsAi` | no | `false` | AI button |
| `onAiClick` | no | — | |
| `aiLabel` | no | `'Ask Labs AI'` | |
| `value` / `onChange` / `readOnly` / `onClick` … | no | — | native input props |

### Behaviour

- It's a real `type="search"` input: typing works in place.
- For a search **entry point** that opens a full search screen, pass `readOnly` and `onClick`.

### Examples

```tsx
import { Search } from './components';

// In-place search
<Search placeholder="Search ‘crocin’..." value={q} onChange={(e) => setQ(e.target.value)} />

// Entry point on the home screen
<Search placeholder="Search ‘crocin’..." readOnly onClick={() => navigate('/search')} labsAi onAiClick={openLabsAi} />
```

### Accessibility

- The input is named “Search” (change it with `aria-label`). The AI button is named “Ask Labs AI”.
- Figma's placeholder uses the same dark colour as typed text, so make sure the example text reads as a hint (“Search ‘crocin’...”).

### Common mistakes

- ❌ Putting a real default search term in `placeholder`. Use `value` for that.

---

## Grid / GridItem

**Purpose:** a row of shortcut tiles (e.g. Reorder Medicines, Health Plans).

### When to use

- Quick links to the main sections of the app, usually 4 per row.

### Properties

| Prop | Component | Required | Notes |
| --- | --- | --- | --- |
| `title` | GridItem | **yes** | 2 lines max |
| `children` | GridItem | no | icon or illustration for the 40px tile |
| `onClick` | GridItem | no | makes the tile a button |
| children | Grid | — | the `GridItem`s |

### Example

```tsx
import { Grid, GridItem, Icon } from './components';

<Grid>
  <GridItem title="Reorder Medicines" onClick={() => navigate('/reorder')}><img src={reorderArt} alt="" /></GridItem>
  <GridItem title="Health Plans" onClick={() => navigate('/plans')}><img src={plansArt} alt="" /></GridItem>
  <GridItem title="Health Insights" onClick={() => navigate('/insights')}><img src={insightsArt} alt="" /></GridItem>
  <GridItem title="Care Plan" onClick={() => navigate('/care')}><img src={careArt} alt="" /></GridItem>
</Grid>
```

### Responsive

- Tiles are fixed at 70×76 with 16px gaps (4 tiles = 328px). For more tiles, wrap `Grid` in a horizontal scroller.

### Common mistakes

- ❌ Long titles: they're cut after 2 lines.
- ❌ Shipping empty grey slots; put real artwork in `children`.

---

## BottomSheet

**Purpose:** a modal panel that slides up from the bottom for a short, focused task (choose an address, confirm an action, pick an option).

### When to use

- Short tasks or choices that relate to the current screen.
- Use the header (`heading`) to say what the sheet is for, and actions for the decision (`primaryAction`) and its alternative (`secondaryAction`).

### When not to use

- **Long flows:** use a full screen.
- **Non-blocking messages:** use `Toast`.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `open` | no | `true` | show / hide |
| `onClose` | no | — | ×, Escape, backdrop tap |
| `heading` / `subheading` | no | — | header text |
| `secondaryAction` / `primaryAction` | no | — | `Button` props (`children`, `onClick`, `disabled`, `leftIcon`…) |
| `closeLabel` | no | `'Close'` | |
| `children` | no | — | sheet content |

### Behaviour

- Covers the viewport (`position: fixed`) with a dimmed backdrop.
- Opening moves focus to ×; closing returns focus to where it was.
- Content scrolls when it's taller than the available space.

### Dependencies

- `Button` (actions), `Icon` (close-filled).

### Example

```tsx
import { BottomSheet, ListItem } from './components';

<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  heading="Select delivery address"
  subheading="Where should we deliver?"
  secondaryAction={{ children: 'Add new', leftIcon: false, rightIcon: false, onClick: addAddress }}
  primaryAction={{ children: 'Deliver here', leftIcon: false, rightIcon: false, onClick: confirm, disabled: !selected }}
>
  <div style={{ display: 'grid', gap: 'var(--gap-12)', padding: 'var(--gap-16)' }}>
    {addresses.map((a) => <ListItem key={a.id} title={a.label} subtitle={a.line1} media={false} onClick={() => setSelected(a.id)} />)}
  </div>
</BottomSheet>
```

### Accessibility

- `role="dialog"` with `aria-modal`, named by `heading` (pass a `heading` whenever you can).
- Focus isn't trapped inside the sheet yet, and the page behind can still scroll. Add both in the app if needed (see MASTER.md).

### Common mistakes

- ❌ Forgetting `onClose`: then ×, Escape and the backdrop do nothing.
- ❌ Leaving the default arrows on the action buttons; pass `leftIcon: false, rightIcon: false`.
- ❌ Two primary-looking actions: the sheet always renders secondary as outline and primary as brand.

---

## InfoBanner

**Purpose:** a short, in-page service update or promo (e.g. “Get medicines in under 30mins”), optionally leading somewhere.

### When to use

- Contextual service messages or promos inside a page.
- Show the chevron (and pass `onClick`) only when the banner leads to a real destination (Figma guidance).

### When not to use

- **Transient feedback:** use `Toast`.
- **Critical alerts, form errors or required decisions** (Figma guidance).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `children` | **yes** | — | message |
| `icon` | no | `true` (Figma artwork) | `true`, `false`, or a 40px node |
| `chevron` | no | `true` | |
| `onClick` | no | — | makes the banner a button |

### Layout

- Always at least 52px tall, with or without the icon, so banners line up. Text longer than 2 lines makes it taller rather than being cut.

### Example

```tsx
import { InfoBanner } from './components';

<InfoBanner onClick={() => navigate('/express')}>Get medicines in under 30mins. Now in your locality</InfoBanner>
<InfoBanner chevron={false}>Free delivery on orders above ₹199</InfoBanner>
```

### Common mistakes

- ❌ Chevron with no `onClick`.
- ❌ Showing a delivery promise you haven't verified for the user's location (Figma guidance).

---

## Banner

**Purpose:** a colourful promo card (328 × 164) with a title, optional subtitle, optional CTA and a 3D image: service intros, offers, campaigns and cross-sell on home or category pages.

### When to use

- Promoting a service or offer with one clear action: “Get at-home sample collection — Book test now”.
- In carousels or feeds of promos, where the 8 colours tell campaigns apart.

### When not to use

- **Service or status strips** inside a flow (“Get medicines in under 30 mins”): use `InfoBanner`.
- **Feedback after an action** (saved, failed): use `Toast`.
- **More than one action**, or long copy: the banner fits about two lines of title and one of subtitle.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `title` | **yes** | — | text / node |
| `subtitle` | no | — (hidden) | text / node |
| `colour` | no | `'brand'` | `brand`, `blue`, `green`, `brown`, `pink`, `mauve`, `purple`, `mint-green` |
| `cta` | no | — (hidden) | CTA label |
| `onCtaClick` | no | — | `(event) => void` |
| `image` | no | — (empty slot) | any node: `Hooman`, `Illustration`, `<img>` |

### Behaviour

- The CTA is a `Button` (size sm, no icons, 125px wide): black on `brand`, white `inverse` on every other colour. It calls `onCtaClick`.
- The image slot is 140px high and 115–151px wide; content is centred and clipped. It's always there, so text wraps at the same width with or without an image.
- The banner is 328px wide but shrinks to its container (min 269px).

### Examples

```tsx
import { Banner, Hooman, Illustration } from './components';

// Figma example
<Banner
  colour="mint-green"
  title="Get at-home sample collection"
  subtitle="for FREE"
  cta="Book test now"
  onCtaClick={() => navigate('/lab-tests/home-collection')}
  image={<Hooman name="phlebotomist-home-visit" height={100} />}
/>

// Offer with an illustration, no subtitle
<Banner colour="green" title="Flat 20% off on medicines" cta="Shop now" image={<Illustration name="discount-green" size={100} />} />

// Information only (no CTA)
<Banner colour="purple" title="Your reports are ready" subtitle="View them in My Reports" />
```

### Imagery (Figma guidance)

- Fit artwork proportionally; keep its silhouette and shadows within the slot to avoid clipping. Figma's notes ask for a 12px inset: about 91 × 116 px of usable area.
- Good fits: `Hooman` at `height` 100–120, `Illustration` at `size` ~100.

### Accessibility

- Title and subtitle are plain text (no heading level). If the banner introduces a section, put it under a heading.
- Keep the CTA label specific (“Book test now”, not “Click here”).
- Contrast: white text on `brand` coral is 3.2:1 (below AA for small text); prefer the darker colours for long or important copy.

### Common mistakes

- ❌ Putting more than ~2 lines in `title`: the banner is a fixed 164px high and clips.
- ❌ Passing artwork larger than the slot without sizing it: it gets cut off.
- ❌ Using a banner as the only way to state an offer's terms. Put terms on the page it leads to.

---

## Badge

**Purpose:** a short decorative label for a category or descriptor.

### When to use

- Category labels (“New”, “Ayurveda”, “Lab test”) where colour helps tell groups apart. Keep the same colour for the same category everywhere.

### When not to use

- **Status** (success, error, warning): colours here have no meaning (Figma guidance). Use `Toast`, `Tag` or text.
- **Counts:** use `CounterBadge`. **Product tags** (Bestseller, Sold out): use `Tag`.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `children` | **yes** | — | label |
| `colour` | no | `'pink'` | `pink`, `mauve`, `yellow`, `red`, `green`, `orange`, `blue`, `turquoise`, `gold` |

### Example

```tsx
<Badge colour="mauve">Ayurveda</Badge>
<Badge colour="blue">Lab test</Badge>
```

---

## Chip

**Purpose:** a compact action or filter, optionally with a leading icon and a count.

### When to use

| Props | Use for |
| --- | --- |
| `inverse` (default, light) | Standard chips on white or light surfaces. |
| `inverse={false}` (dark) | Chips that need stronger emphasis. |
| `disabled` | A temporarily unavailable option; explain why nearby. |

### When not to use

- **Selected / unselected filters:** there's no selected state in the design. Define one before using chips as toggles (Figma guidance).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `children` | **yes** | — | label |
| `inverse` | no | `true` | light / dark |
| `disabled` | no | `false` | |
| `leftIcon` | no | `true` (arrow) | `true`, `false`, node |
| `count` | no | — | number bubble |
| `onClick` … | no | — | native button props |

### Example

```tsx
import { Chip } from './components';

<Chip leftIcon={false} count={3} onClick={openFilters}>Filters</Chip>
<Chip inverse={false} leftIcon={false} onClick={() => setSort('price')}>Sort by price</Chip>
```

### Common mistakes

- ❌ Leaving the default arrow when it doesn't mean anything; pass `leftIcon={false}`.
- ❌ Reading `inverse={false}` (dark) as “selected”.

---

## Toggle

**Purpose:** turn a setting on or off immediately.

### When to use

- Settings that take effect right away (notifications, WhatsApp updates).

### When not to use

- **Choices submitted with a form:** use `Checkbox`.
- **Picking one of several options:** use `Radio`.

### Properties

| Prop | Required | Default |
| --- | --- | --- |
| `checked` / `defaultChecked` | no | — |
| `disabled` | no | `false` |
| `children` (label) or `aria-label` | one of them | — |
| `onChange` … | no | — |

### Example

```tsx
<Toggle checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)}>Order updates on WhatsApp</Toggle>
```

### Accessibility

- It's a real switch (`role="switch"`): Space toggles it and screen readers announce on/off.
- The label should name the setting (“Order updates”), not the action (“Turn on”).
- Disabled-off looks like enabled-off (Figma note), so explain unavailability in text.

---

## Radio

**Purpose:** choose exactly one option from a group.

### Properties

| Prop | Required | Default |
| --- | --- | --- |
| `name` | **yes** (to group) | — |
| `value`, `checked` / `defaultChecked`, `onChange` | no | — |
| `disabled` | no | `false` |
| `children` (label) or `aria-label` | one of them | — |

### Example

```tsx
<fieldset>
  <legend>Sample collection slot</legend>
  {slots.map((s) => (
    <Radio key={s.id} name="slot" value={s.id} checked={slot === s.id} onChange={() => setSlot(s.id)}>{s.label}</Radio>
  ))}
</fieldset>
```

### Accessibility

- Wrap a group in `<fieldset>` + `<legend>`. Arrow keys move between options in the same `name` group.

### Common mistakes

- ❌ A single radio on its own (use `Checkbox`).
- ❌ Different `name`s inside one group (they won't be exclusive).

---

## Checkbox

**Purpose:** turn independent options on or off.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `checked` / `defaultChecked`, `onChange` | no | — | |
| `circle` | no | `true` | round / rounded square |
| `disabled` | no | `false` | |
| `children` (label) or `aria-label` | one of them | — | |

### Example

```tsx
<Checkbox circle={false} checked={save} onChange={(e) => setSave(e.target.checked)}>Save this address</Checkbox>
```

### Edge cases

- Figma has no unchecked design; the unchecked look here is an assumption (see MASTER.md).
- `circle` is only a shape: it's still a checkbox, not a radio (Figma guidance).

---

## Accordion

**Purpose:** a question that expands to show its answer (FAQs, test details).

### When to use

- Lists of questions and answers where people only need some answers.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `title` | **yes** | — | question |
| `children` | **yes** | — | answer |
| `expanded` / `defaultExpanded` / `onExpandedChange` | no | `false` | |
| `lines` | no | `6` | lines shown before “see more”; `0` = all |
| `seeMoreLabel` | no | `'see more'` | |

### Behaviour

- Header press opens/closes it. When open, long answers are cut to `lines` with “see more”, which shows the rest (Figma: expanded → more expanded).

### Example

```tsx
<div style={{ display: 'grid', gap: 'var(--gap-12)' }}>
  {faqs.map((f) => <Accordion key={f.id} title={f.q}>{f.a}</Accordion>)}
</div>
```

### Accessibility

- The header is a button with `aria-expanded`; the answer is a region labelled by the question.

---

## SpecialButton

**Purpose:** highlight a coupon or coupon savings amount (e.g. “₹80 ›”) in product, cart or checkout content.

### When to use

- Next to a price or offer, to show coupon savings. Make the surrounding text say whether it's a possible saving, an available offer or an applied discount (Figma guidance).

### When not to use

- **As a general button or a normal price label** (Figma guidance).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `children` | **yes** | — | amount, e.g. “₹80” |
| `chevron` | no | `true` | show only when details/actions exist |
| `onClick` | no | — | makes it a button |

### Example

```tsx
import { SpecialButton } from './components';

<SpecialButton onClick={() => openCoupon('PILGRIM20')}>₹80</SpecialButton>
<SpecialButton chevron={false}>₹80</SpecialButton>   // static label
```

### Common mistakes

- ❌ Chevron with no `onClick`.
- ❌ Showing an amount the user isn't eligible for.

---

## CompoundButton

**Purpose:** a prominent two-line shortcut, such as “Upload / Prescription”.

### When to use

- Key entry points where a short verb + object reads well (“Upload / Prescription”, “Book / Lab test”).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `label` | **yes** | — | small first line |
| `children` | **yes** | — | bold second line |
| `icon` | no | upload icon | node, or `false` |
| `onClick` … | no | — | native button props |

### Example

```tsx
import { CompoundButton, Icon } from './components';

<CompoundButton label="Upload" onClick={openUpload}>Prescription</CompoundButton>
<CompoundButton label="Book" icon={<Icon name="search" size={20} color="var(--icon-brand-primary-inverse)" />} onClick={openLabs}>Lab test</CompoundButton>
```

### Accessibility

- Read as one name (“Upload Prescription”). Keep both lines short so the pill stays one size.

---

## Divider

**Purpose:** a thin line that separates content.

### When to use (Figma guidance)

| Variant | Use between |
| --- | --- |
| `plain` (default) | Sections: distinct content areas. |
| `dash` | Individual SKUs in a list or group. |

### When not to use

- Don't use `plain` between SKUs or `dash` between sections.
- Not for decoration or spacing alone; use layout gaps.

### Example

```tsx
import { Divider, SkuCard } from './components';

<section>…</section>
<Divider />
<div>
  <SkuCard large={false} orientation="horizontal" {...a} />
  <Divider variant="dash" />
  <SkuCard large={false} orientation="horizontal" {...b} />
</div>
```

---

## QuantityDropdown

**Purpose:** show and change the quantity of a cart item.

### When to use

- Next to each item on the cart page (Figma guidance).

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `value` / `defaultValue` | no | first option | number |
| `onChange` | no | — | `(quantity: number) => void` |
| `options` | no | 1–10 | allowed quantities |
| `disabled` | no | `false` | |
| `aria-label` | no | `'Quantity'` | |

### Behaviour

- Tapping opens the phone's native picker (it's a real `<select>`).
- `onChange` receives the number directly.

### Example

```tsx
import { QuantityDropdown } from './components';

<QuantityDropdown
  value={item.qty}
  onChange={(qty) => cart.setQuantity(item.id, qty)}
  options={range(1, Math.min(item.stock, item.maxPerOrder))}
  aria-label={`Quantity of ${item.name}`}
/>
```

### Accessibility

- Give each dropdown a specific `aria-label` (“Quantity of RiteBite bar”) when there are several on a page.

### Common mistakes

- ❌ Offering more than the user can buy; set `options` from stock and purchase limits.
- ❌ Removing an item by choosing 0. Add 0 to `options` only if your cart treats it as remove, and say so.

---

## Illustration

**Purpose:** full-colour supporting imagery (meds, labs, coins, discounts, delivery, collection, scheduling, tests, documents), with when-to-use guidance written in Figma.

### When to use (Figma guidance)

| Name | Use for |
| --- | --- |
| `meds` | Pharmacy categories, medicine ordering, prescription refills, medicine order confirmations |
| `labs` | Lab-test categories, diagnostic services, health-check packages, test-booking onboarding or confirmation |
| `coins` | Rupee wallet balances, cashback, rewards, referral credits, savings summaries. Not for non-rupee currencies |
| `discount-blue` | Coupons, promotional offers, percentage discounts, savings banners |
| `discount-green` | Applied discounts, successful coupon redemption, member savings, offer confirmations. Pair with explicit success text |
| `delivery-box` | Order dispatch, shipment tracking, delivery updates, order history, package empty states |
| `phlebo-bag` | Home sample collection, phlebotomist visits, collector assignment, appointment preparation |
| `missing-slot` | Unavailable slots, missed bookings, scheduling issues, reschedule prompts. Pair with text on the exact issue and next step |
| `testubes` | Blood tests, test details, sample collection instructions, sample-processing status |
| `documents` | Medical records, lab reports, prescriptions, uploads, document empty states |

### When not to use

- **Small UI icons** (16–24px, recoloured with tokens): use `Icon`.
- **As the only way to say something**, such as success or a scheduling problem. Always pair with text.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `name` | **yes** | — | see table above |
| `size` | no | `120` | px |
| `label` | no | — (decorative) | accessible name |

### Examples

```tsx
import { Illustration, InfoBanner } from './components';

// Empty state
<div style={{ textAlign: 'center' }}>
  <Illustration name="documents" />
  <p>No reports yet. Your lab reports will appear here.</p>
</div>

// In a banner's icon slot
<InfoBanner icon={<Illustration name="phlebo-bag" size={40} />}>A phlebotomist will visit tomorrow, 8–10 am</InfoBanner>
```

### Sizing

- Designed at 120px; images are sharp up to 3× (360 physical px). Use `size` ≤ 120 on phones.
- `testubes` overflows its frame by a few px, as in Figma; leave a little space around it.
---

## Hooman

**Purpose:** TATA 1mg character illustrations (delivery partner, doctor, pharmacist, phlebotomist) for empty states, status screens, onboarding and service banners, with when-to-use guidance written in Figma.

### When to use (Figma guidance, summary)

| Name | Use for |
| --- | --- |
| `delivery-with-box` | Parcel handover, delivery arrival, receiving an order, pickup instructions |
| `delivery-running` | Express-delivery promotions, priority fulfilment. A speed metaphor, not a delivery-time promise |
| `delivery-bike` | Order dispatched, out for delivery, tracking. Doesn't mean “arrived” |
| `delivery-store` | Packing completed, ready for pickup, handover to the delivery team |
| `delivery-concerned` | Delays, failed delivery attempts, service unavailable. Add a recovery action; never for success |
| `delivery-bike-side` | In-transit updates, journey banners, tracking timelines; suits wide layouts |
| `delivery-thumbs-up` | Order confirmation, successful delivery, completed actions |
| `delivery-confused` | Empty cart, no orders yet, no results, missing item. Offer a next step |
| `doctor-arms-folded` | Doctor-service intros, healthcare onboarding, appointment entry points |
| `doctor-with-meds` | Prescribed-treatment and medication guidance. Not a product endorsement |
| `doctor-with-stethoscope` | Consultations, routine checkups, appointment booking |
| `doctor-in-lab` | Diagnostic testing, lab services, sample analysis. Doesn't mean results are ready |
| `doctor-with-patient` | Clinic appointments, care-plan explanations, report reviews |
| `pharmacist-with-coupon` | Pharmacy offers, coupons, checkout promotions. State the real discount and terms |
| `pharmacist-verifying-prescription` | Prescription verification, preparing a medicine order, refills |
| `pharmacist-standing-with-medicine` | Prescription review, medicine information, refill reminders |
| `pharmacist-on-call` | Call-a-pharmacist, order assistance, callback requests, support |
| `phlebotomist-thumbs-up` | Confirmed test bookings, completed sample collection. Doesn't mean normal results |
| `phlebotomist-with-syringe` | Phlebotomist intros, sample-collection service overviews |
| `phlebotomist-home-visit-senior` | At-home blood tests, senior-friendly collection, home-visit booking |
| `phlebotomist-home-visit` | Home sample collection, what to expect at a collector visit |
| `phlebotomist-vaccination` | Vaccination and injection appointments. Not for blood tests |

The full Figma text for each pose is in `hoomans[name].usage` and in Storybook (Components › Hooman › each character).

### When not to use

- **Small objects** (meds, coins, boxes, discount badges): use `Illustration`.
- **UI icons:** use `Icon`.
- **As the only way to say something** (a status, an offer, a result). Always pair with text that states it.
- **As a real person's profile**, credential or clinical instruction: these are generic illustrated characters.

### Properties

| Prop | Required | Default | Values |
| --- | --- | --- | --- |
| `name` | **yes** | — | see table above (`<character>-<pose>`) |
| `height` | no | `240` | px; width follows the aspect ratio |
| `label` | no | — (decorative) | accessible name |

### Examples

```tsx
import { Button, Hooman } from './components';

// Empty cart
<div style={{ textAlign: 'center' }}>
  <Hooman name="delivery-confused" height={160} />
  <p>Your cart is empty.</p>
  <Button>Browse medicines</Button>
</div>

// Delivery delay
<Hooman name="delivery-concerned" height={180} />
<p>Your order is delayed by about 2 hours. You can reschedule or contact support.</p>

// Pick by data
import { hoomans, hoomanNames } from './components';
const phlebo = hoomanNames.filter((n) => hoomans[n].character === 'phlebotomist');
```

### Sizing and layout

- Poses have different aspect ratios (tall standing poses, wide counter and scooter scenes). Set `height`; the width follows. In a fixed box, cap the width with `style={{ maxWidth: '100%' }}`.
- Images are ~1000–1500px, so they stay sharp at normal sizes. `doctor-with-stethoscope` is lower resolution: keep it under ~380px tall.
- Transparent background: place on any surface colour.

### Accessibility

- Decorative by default (`aria-hidden`), since the copy next to it should carry the meaning. Pass `label` only when the image is the only thing carrying meaning.

### Common mistakes

- ❌ Using `delivery-thumbs-up` or `phlebotomist-thumbs-up` to suggest an outcome (delivered, normal results) without text saying so.
- ❌ Using `doctor-in-lab` for consultations, or `phlebotomist-vaccination` for blood tests.
- ❌ Stretching with both `width` and `height` in `style`: set `height` only.

