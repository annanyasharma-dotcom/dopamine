# Dopamine Design System — Master Reference

Technical reference for the component library in this repository. Keep it in sync with the code; see [Documentation rules](#documentation-rules).

Source-of-truth order when things disagree: component implementation → TypeScript types → tokens/styles → Storybook → this file.

---

## 1. Project overview

| | |
| --- | --- |
| Purpose | React component library and design-token documentation for the Dopamine design system, built from Figma. |
| Stack | React 19, TypeScript, Vite, Storybook 10 (`@storybook/react-vite`), plain CSS with CSS custom properties |
| Package manager | npm (`package-lock.json`) |
| Repository | https://github.com/annanyasharma-dotcom/dopamine |
| Figma | WIP - Dopamine Spike UPDATED (`F8gwbRRBflKHAqne5iMfpr`) |

### Folder structure

```text
.claude/skills/react-component-integrity/SKILL.md   Engineering rules for working on components
.storybook/            main.ts, preview.tsx (loads fonts + tokens), preview.css (light canvas)
docs/                  MASTER.md (this file), COMPONENT_USE_CASES.md
scripts/build-tokens.mjs   Figma export → tokens.css / tokens.json
src/
  components/          One folder per component; index.ts re-exports all
    Button/            Button.tsx, Button.css, Button.stories.tsx, index.ts, assets/
    InputField/        InputField.tsx, InputField.css, InputField.stories.tsx, index.ts, assets/
    OtpField/          OtpField.tsx, OtpField.css, OtpField.stories.tsx, index.ts, assets/
  foundations/         Storybook pages documenting tokens (not shipped components)
  tokens/              figma-variables.json, figma-styles.css (sources)
                       tokens.css, tokens.json (generated), fonts.css
  Introduction.mdx     Storybook landing page
  App.tsx, main.tsx    Vite starter app (not part of the library)
```

### Conventions

- **Component folder:** `src/components/<Name>/` with `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx`, `index.ts`, and `assets/` if needed. Export from `src/components/index.ts`.
- **Exports:** named export plus default export; types exported from `index.ts`.
- **Styling:** plain CSS imported by the component. Class names use a `dp-` prefix with BEM: `dp-button`, `dp-button--brand`, `dp-button__icon`.
- **Tokens only:** colours, spacing, radius and stroke come from `var(--token)` in `src/tokens/tokens.css`. Values with no token yet are kept as component-level custom properties (`--dp-<component>-*`) with a comment naming the Figma variable.
- **Props:** single-element components extend the native element's props (`ComponentPropsWithRef<'button' | 'input'>`) so native attributes and `ref` work. Figma property names are kept unless they clash with a native attribute (documented per component).
- **Interaction states are automatic:** Figma states such as rest / active / typing / typed are produced by focus and value, not props. Only states that carry meaning (status, disabled) are props.
- **Controlled and uncontrolled:** inputs accept `value` (controlled) or `defaultValue` (uncontrolled).

---

## 2. Component inventory

| Component | Category | Source | Export | Depends on | Figma node |
| --- | --- | --- | --- | --- | --- |
| Button | Actions | `src/components/Button/Button.tsx` | `Button` (named + default), types `ButtonProps`, `ButtonSize`, `ButtonVariant` | tokens.css, fonts.css (Figtree), `assets/arrow-left.svg`, `assets/arrow-right.svg` | `40002646:30877` |
| InputField | Forms | `src/components/InputField/InputField.tsx` | `InputField` (named + default), types `InputFieldProps`, `InputFieldStatus` | tokens.css, fonts.css, `assets/close.svg` | `40002019:3237` |
| OtpField | Forms | `src/components/OtpField/OtpField.tsx` | `OtpField` (named + default), types `OtpFieldProps`, `OtpFieldDigits`, `OtpFieldStatus` | tokens.css, fonts.css, `assets/resend.svg` | `40002019:3289` |

Import: `import { Button, InputField, OtpField } from './components';` (or each component's folder).

---

## 3. Component API reference

### Button

Action button. Implements the Figma “Button” component set (12 variants: 5 types × 2 sizes, plus disabled for brand).

```ts
export type ButtonSize = 'sm' | 'lg';
export type ButtonVariant = 'brand' | 'black' | 'outline' | 'inverse' | 'ghost';

export interface ButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leftIcon?: boolean | ReactNode;
  rightIcon?: boolean | ReactNode;
}
```

| Prop | Type | Required | Default | Figma property | Behaviour |
| --- | --- | --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — | text layer “Button” | Label. Rendered in `.dp-button__label`. |
| `variant` | `'brand' \| 'black' \| 'outline' \| 'inverse' \| 'ghost'` | no | `'brand'` | `type` | Visual treatment (see table below). Renamed from `type` so the native `type` attribute still works. |
| `size` | `'sm' \| 'lg'` | no | `'sm'` | `size` | sm: min-height 44px, 14/20 text. lg: min-height 56px, 16/24 text. Ghost has no min-height at either size. |
| `disabled` | `boolean` | no | `false` | `disabled?` | Sets native `disabled`: no clicks, no focus, `onClick` not called. Applies disabled colours. |
| `leftIcon` | `boolean \| ReactNode` | no | `true` | `leftIcon` | `true` → Figma arrow-left; `false`/`null` → none; node → custom icon in a 24×24 slot. |
| `rightIcon` | `boolean \| ReactNode` | no | `true` | `rightIcon` | Same, with arrow-right. |
| `type` | `'button' \| 'submit' \| 'reset'` | no | `'button'` | — | Native type. Defaults to `button` so it never submits a form by accident. |
| `className` | `string` | no | — | — | Appended after the component's classes. |
| `ref` | `Ref<HTMLButtonElement>` | no | — | — | Forwarded to the `<button>` (React 19 ref-as-prop). |
| …rest | native `<button>` props | no | — | — | `onClick`, `aria-*`, `form`, `name`, `value`, etc. are passed through. `onClick` receives the React mouse event. |

#### Variant styling (tokens)

| Variant | Background | Text | Icon | Border |
| --- | --- | --- | --- | --- |
| brand | `--bg-brand-coral` | `--text-brand-primary-inverse` | `--icon-brand-primary-inverse` | none |
| black | `--bg-brand-primary-inverse` | `--text-brand-primary-inverse` | `--icon-brand-primary-inverse` | none |
| outline | `--bg-brand-primary` | `--text-brand-brand` | `--icon-brand-coral` | `--stroke-regular` `--border-neutrals-secondary` (inside stroke, via inset box-shadow) |
| inverse | `--bg-brand-primary` | `--text-brand-primary` | `--icon-brand-primary` | `--stroke-regular` `--border-neutrals-secondary` (inside stroke, via inset box-shadow) |
| ghost | transparent | `--text-brand-brand` | `--icon-brand-coral` | none |
| disabled (any variant) | `--bg-brand-disabled-subtle` (transparent for ghost) | `--text-brand-disabled-subtle` | `--icon-brand-disabled-subtle` | none |

Shared: padding `--gap-10`, gap `--gap-4`, radius `--radius-md`, font `--font-family-base` (Figtree) weight 600, icons 24×24. Width hugs the content.

Component-level custom properties (in `Button.css`): `--dp-button-font-size`, `--dp-button-line-height`, `--dp-button-min-height`, `--dp-button-bg`, `--dp-button-fg`, `--dp-button-icon`, `--dp-button-border`.

#### States

| State | Behaviour |
| --- | --- |
| Default | As above. |
| Focus (keyboard) | `:focus-visible` outline `--stroke-thick` `--border-info-moderate`, offset `--gap-2`. *Not in Figma; added for accessibility.* |
| Disabled | Native `disabled`, `cursor: not-allowed`, disabled tokens. |
| Hover / pressed / loading | **Not implemented.** Not defined in Figma. |

#### Accessibility

- Renders a native `<button>`, so keyboard (Enter/Space) and screen-reader semantics are built in.
- Icons are `aria-hidden`; the accessible name comes from `children`. For an icon-only use, pass `aria-label`.
- Ghost buttons are 44px tall at both sizes (24px content + 10px padding), which meets a 44px touch target.

#### Icons

`assets/arrow-left.svg` and `assets/arrow-right.svg` are the original Figma exports, unmodified. Figma had four colour copies of each arrow with identical paths; the component uses one file per arrow as a CSS `mask` and colours it with the variant's icon token. Custom icons should use `currentColor`.

### InputField

Single-line text input with a label chip on the top border, a clear button and helper text. Implements the Figma “Input field” component set (7 states).

```ts
export type InputFieldStatus = 'default' | 'success' | 'error';

export interface InputFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'children'> {
  label: ReactNode;
  helperText?: ReactNode;
  status?: InputFieldStatus;
  clearable?: boolean;
  onClear?: () => void;
  wrapperClassName?: string;
}
```

| Prop | Type | Required | Default | Figma property | Behaviour |
| --- | --- | --- | --- | --- | --- |
| `label` | `ReactNode` | yes | — | “Label” text in the label chip | Rendered as a `<label>` linked to the input. |
| `helperText` | `ReactNode` | no | — | `helper` + `helperText` | Shown under the field when set; linked via `aria-describedby`. Colour follows `status`. Omit = Figma `helper` off. |
| `status` | `'default' \| 'success' \| 'error'` | no | `'default'` | `state` = success / error | Border + helper colour. `error` also sets `aria-invalid`. |
| `required` | `boolean` | no | `false` | red “*” in the label chip | Native `required`; shows the asterisk. Figma shows the asterisk in every state. |
| `disabled` | `boolean` | no | `false` | `state` = disabled | Native `disabled` on the input and the clear button; grey styling. |
| `clearable` | `boolean` | no | `true` | clear icon (always shown in Figma) | Shows the × button. |
| `onClear` | `() => void` | no | — | — | Called after × is pressed. Uncontrolled: the field is emptied automatically. Controlled: set `value` to `''` here. Focus returns to the input. |
| `placeholder` | `string` | no | — | `text` (when empty) | Native placeholder, grey. |
| `value` / `defaultValue` | `string` | no | — | `text` (when filled) | Controlled / uncontrolled value. |
| `onChange` | `(event) => void` | no | — | — | Native change handler. |
| `className` | `string` | no | — | — | Added to the `<input>`. |
| `wrapperClassName` | `string` | no | — | — | Added to the outer wrapper. |
| `id` | `string` | no | auto (`useId`) | — | Input id; the label is linked to it. |
| `ref` | `Ref<HTMLInputElement>` | no | — | — | Forwarded to the `<input>`. |
| …rest | native `<input>` props | no | — | — | `type`, `name`, `autoComplete`, `inputMode`, `maxLength`, `onBlur`, `aria-*`, etc. `aria-describedby` is merged with the helper id. |

Figma state → implementation: **rest** = empty, unfocused · **active** = empty, focused · **typing** = focused with a value (native caret, coloured `--icon-brand-secondary` like Figma's cursor) · **typed** = has a value, unfocused · **success / error** = `status` · **disabled** = `disabled`.

#### Styling (tokens)

| Part | Default | success | error | disabled |
| --- | --- | --- | --- | --- |
| Box border | `--border-neutrals-secondary` | `--border-success-moderate` | `--border-error-moderate` | `--text-brand-disabled-subtle` (as in Figma) |
| Box background | `--bg-brand-primary` | same | same | `--bg-brand-disabled-subtle` |
| Value / placeholder | `--text-brand-primary` / `--text-brand-disabled-subtle` | same | same | `--text-brand-disabled-subtle` |
| Helper | `--text-brand-quartenary` | `--text-success-base` | `--text-error-base` | `--text-brand-quartenary` |
| Label chip | bg `--bg-brand-primary`, border `--stroke-thin` `--border-neutrals-secondary`, text `--text-brand-tertiary` | same | same | bg `--bg-brand-disabled-subtle`, border `--border-neutrals-disabled`, text `--text-brand-disabled-subtle` |
| Asterisk | `--text-error-base`, bold | | | |
| Clear icon | `--icon-brand-primary` | | | |

Layout: wrapper 100% wide, padding `--gap-8` top/bottom, gap `--gap-4` (80px tall with helper). Box 44px, padding `--gap-12`, radius `--radius-md`. Label chip 20px high, top −6px, left 10px, radius `--radius-xxs`. Clear button 20×20 showing the 24px Figma icon, centred and clipped as in Figma.

Text (component variables, see Known issues): value 14/18 regular, label 12/14 regular, asterisk 14/18 bold, helper 11/16 regular.

#### Accessibility

- Real `<label for>`; helper linked with `aria-describedby`; `aria-invalid` on error.
- The clear button is a real `<button aria-label="Clear">`, keyboard reachable, with a focus ring.
- The asterisk is `aria-hidden`; the native `required` attribute conveys it to assistive tech.

### OtpField

Verification-code input made of 4 or 6 single-digit boxes, with optional helper text and a resend action. Implements the Figma “OTP field” component set (2 lengths × 7 states).

```ts
export type OtpFieldDigits = 4 | 6;
export type OtpFieldStatus = 'default' | 'success' | 'error';

export interface OtpFieldProps {
  digits?: OtpFieldDigits;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  status?: OtpFieldStatus;
  disabled?: boolean;
  helperText?: ReactNode;
  onResend?: () => void;
  resendPrompt?: ReactNode;
  resendLabel?: ReactNode;
  'aria-label'?: string;
  autoFocus?: boolean;
  name?: string;
  className?: string;
}
```

| Prop | Type | Required | Default | Figma property | Behaviour |
| --- | --- | --- | --- | --- | --- |
| `digits` | `4 \| 6` | no | `4` | `digits` (“4 digit OTP” / “6 digit OTP”) | Number of boxes. |
| `value` / `defaultValue` | `string` | no | — | digits shown in typed states | Controlled / uncontrolled code. Non-digits are stripped; extra digits ignored. |
| `onChange` | `(value: string) => void` | no | — | — | Called with the whole code on every change (not an event). |
| `onComplete` | `(value: string) => void` | no | — | — | Called whenever all boxes are filled. |
| `status` | `'default' \| 'success' \| 'error'` | no | `'default'` | `state` = success / error | Box border + helper colour; `error` sets `aria-invalid` on each box. |
| `disabled` | `boolean` | no | `false` | `state` = disabled | Disables every box and the resend button. |
| `helperText` | `ReactNode` | no | — | `helper` (default off) | Text under the boxes. Figma has a fixed sample string; here it's a prop. |
| `onResend` | `() => void` | no | — | `state` = resend OTP | Passing it shows the resend row; called when Resend is pressed. |
| `resendPrompt` | `ReactNode` | no | `'Didn’t receive OTP?'` | text in resend row | |
| `resendLabel` | `ReactNode` | no | `'Resend OTP'` | text in resend row | |
| `aria-label` | `string` | no | `'One-time code'` | — | Name of the box group. Each box is labelled “Digit n of N”. |
| `autoFocus` | `boolean` | no | `false` | — | Focuses the first box on mount. |
| `name` | `string` | no | — | — | Adds a hidden input carrying the code for form submission. |
| `className` | `string` | no | — | — | Added to the wrapper. |

Figma state → implementation: **rest** = empty · **typing** = focus in a box (native caret) · **typed** = all boxes filled · **error / success** = `status` · **disabled** = `disabled` · **resend OTP** = `onResend` set.

#### Keyboard and input behaviour

- Typing a digit fills the box and moves to the next. Non-digits are ignored.
- Boxes fill left to right: clicking a box after the first empty one moves focus to the first empty one.
- Backspace clears the current box; in an empty box it deletes the previous digit and moves back. Deleting from the middle shifts later digits left.
- ← / → move between boxes.
- Paste (anywhere) or phone one-time-code autofill (`autocomplete="one-time-code"` on box 1) fills from that box.
- Each box shows `-` when empty, as in Figma; the dash hides while the box is focused.

#### Styling (tokens)

| Part | Default | success | error | disabled |
| --- | --- | --- | --- | --- |
| Box border | `--border-neutrals-secondary` | `--border-success-moderate` | `--border-error-moderate` | `--border-neutrals-disabled` |
| Digit / dash | `--text-brand-primary` | same | same | `--text-brand-disabled-subtle` |
| Helper | `--text-brand-tertiary` | `--text-success-base` | `--text-error-base` | `--text-brand-tertiary` |
| Resend prompt / action / icon | `--text-brand-tertiary` / `--text-brand-brand` / `--icon-brand-coral` | | | disabled tokens |

Boxes 44×44, padding `--gap-12`, radius `--radius-md`, background `--bg-brand-primary`, gap `--gap-12`. Wrapper gap `--gap-4`. Heights: 44 (boxes only), 64 (with helper), 66 (with resend row), matching Figma.

Text (component variables): digits 14/18 semibold, helper 11/16 regular, resend row 12/18 (prompt regular, action semibold).

---

## 4. Architecture and dependencies

- **Button** has no child components. Internal `IconSlot` (not exported) renders the 24px icon slots.
- **InputField** has no child components. Uses `useId` for label/helper ids and `useState` for uncontrolled values.
- **OtpField** has no child components. One `<input>` per digit plus an optional hidden input; `useRef` tracks the boxes and the latest code for focus handling.
- The InputField clear button and OtpField resend button are plain `<button>`s, not the `Button` component: their Figma designs are icon-only / text-link treatments that `Button` has no variant for.
- **Runtime dependencies:** `react`, `react-dom`, `@fontsource/figtree` (font files).
- **Styles chain:** `fonts.css` (Figtree 400/500/600/700) → `tokens.css` (CSS variables) → component CSS. Apps must import `fonts.css` and `tokens.css` once (done in `src/main.tsx` and `.storybook/preview.tsx`).
- No context providers, hooks or shared utilities exist yet.

---

## 5. Design-system reference

Tokens are generated from Figma by `npm run tokens` (`scripts/build-tokens.mjs`) into `src/tokens/tokens.css`. Full visual reference: Storybook → Foundations.

| Group | Variables | Notes |
| --- | --- | --- |
| Primitives | `--color-{palette}-{step}` (73) | cool-neutral, flame-coral, wellness-green, vital-red, precision-blue, sunrise-glow, sunshine-yellow, comfort-pink, healing-mauve, jovial-purple, horizon-blue, golden, brown, base |
| Brand | `--c-p--{brown,gold,gold-2,gold-3,cream-1..3}` | From Figma colour styles |
| Semantic (Light only) | `--bg-*`, `--text-*`, `--icon-*`, `--border-*` (78) | Alias primitives |
| Utility | `--alpha-{white,black}-{10..97}`, `--hih-*`, `--category-*` | |
| Typography | `--font-{display,h1..h6,body-md,body-sm,caption-*}-{size,line-height,letter-spacing}` | Mobile default; Desktop at ≥1024px |
| Text styles | `.text-{family}-{weight}` classes (37) | |
| Font | `--font-family-base` = Figtree | |
| Radius | `--radius-{none,xxs,xs,s,md,lg,xl,xxl,full}` | 0–999px |
| Stroke | `--stroke-{none,thin,regular,medium,thick,thicker}` | 0–3px |
| Gap | `--gap-{none,2,4,…,40}` | |
| Shadows | `--shadow-{xs,s,md,lg,xl,xxl}` | |

No dark theme, breakpoint tokens, animation tokens or icon library exist yet.

---

## 6. Storybook reference

- Config: `.storybook/main.ts` (stories: `src/**/*.mdx`, `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`; addons: chromatic, vitest, a11y, docs, mcp). `preview.tsx` loads fonts + tokens and sets sidebar order: Introduction → Foundations → Components.
- Run: `npm run storybook` (port 6006; regenerates tokens first). Build: `npm run build-storybook` → `storybook-static/`.
- Story tests: `npx vitest --project storybook --run` runs every story (and its `play` function) in headless Chromium.
- Deployment: none configured.

| Story file | Title | Stories |
| --- | --- | --- |
| `src/Introduction.mdx` | Introduction | docs page |
| `src/foundations/Colors.stories.tsx` | Foundations/Colors | Primitives, Brand, SemanticBackground, SemanticText, SemanticIcon, SemanticBorder, Utility |
| `src/foundations/Typography.stories.tsx` | Foundations/Typography | TypeScale, TextStyles |
| `src/foundations/Dimensions.stories.tsx` | Foundations/Dimensions | Gap, Radius, Stroke, Shadows |
| `src/components/Button/Button.stories.tsx` | Components/Button | Playground, Brand, Black, Outline, Inverse, Ghost, Large, Disabled\*, WithoutIcons, CustomIcon, ClickCallsOnClick\*, AllVariants (+ autodocs page) |

| `src/components/InputField/InputField.stories.tsx` | Components/InputField | Playground, Rest, Active\*, Typing\*, Typed, Success, Error\*, Disabled\*, WithoutHelper, NotRequired, ClearValue\*, Controlled\*, AllStates (+ autodocs page) |
| `src/components/OtpField/OtpField.stories.tsx` | Components/OtpField | Playground, Rest, Rest (6 digits), Typing\*, Typed, Error, Success, Disabled\*, Resend OTP\*, WithHelper, Test: type full code\*, Test: paste code\*, Test: backspace\*, Controlled, AllStates (+ autodocs page) |

\* has a `play` interaction test.

Button controls: `children` (text), `variant` (radio), `size` (radio), `disabled` (boolean), `leftIcon`/`rightIcon` (boolean; custom nodes shown in CustomIcon), `type` (radio), `onClick` (action spy).

InputField controls: `label`, `placeholder`, `helperText`, `defaultValue` (text), `status` (radio), `required`, `disabled`, `clearable` (boolean), `onChange`, `onClear` (action spies). `value` is shown in the Controlled story.

OtpField controls: `digits`, `status` (radio), `disabled` (boolean), `helperText`, `defaultValue`, `resendPrompt`, `resendLabel` (text), `onChange`, `onComplete` (action spies). `value` and `onResend` are shown in the Controlled and Resend OTP stories.

All controls map to real props.

**Adding a story:** create `<Name>.stories.tsx` next to the component, `title: 'Components/<Name>'`, `component`, `tags: ['autodocs']`, default `args` matching prop defaults, `argTypes` only for real props.

---

## 7. Development guidelines

Follow `.claude/skills/react-component-integrity/SKILL.md`. In short:

1. Audit the Figma node (properties, variants, variables) and existing code first.
2. Reuse tokens; never hardcode values that have a token.
3. Keep every Figma property as a prop; document any renames.
4. Add or update stories with working controls, plus `play` tests for interactions.
5. Update this file and `COMPONENT_USE_CASES.md`.
6. Run `npx tsc -b`, `npm run lint`, `npm run build`, `npm run build-storybook` and `npx vitest --project storybook --run`.
7. Commit only when asked. Messages are imperative sentences describing the change (see git log).

---

## 8. Change log

| Date | Change | Commit |
| --- | --- | --- |
| 2026-11-22 | Project set up: Vite + React + TS, Storybook 10, token generator, Foundations pages | `a5c4481` |
| 2026-11-23 | Base font switched to Figtree (self-hosted via `@fontsource/figtree`) | `e08bc6b` |
| 2026-11-24 | **Button** added (Figma node `40002646:30877`): props `children`, `variant`, `size`, `disabled`, `leftIcon`, `rightIcon` + native button props; stories with interaction tests; docs files created | `4d49fd8` |
| 2026-11-24 | **InputField** added (Figma node `40002019:3237`): props `label`, `helperText`, `status`, `clearable`, `onClear`, `wrapperClassName` + native input props. **OtpField** added (Figma node `40002019:3289`): props `digits`, `value`, `defaultValue`, `onChange`, `onComplete`, `status`, `disabled`, `helperText`, `onResend`, `resendPrompt`, `resendLabel`, `aria-label`, `autoFocus`, `name`, `className`. Stories with interaction tests. | uncommitted |

---

## 9. Known issues

Verified unless marked *assumption*.

- **Typography token gap (all components):** the Figma file's fixed text variables are not in the token export, whose typography scale is responsive (e.g. `body-md` is 14/18 mobile, 24/32 desktop). Each component keeps the Figma values as `--dp-<component>-*` variables:
  - Button: body-base 14/20, body-lg 16/24
  - InputField: label-base 14/18, label-sm 12/14, caption-base 11/16
  - OtpField: label-base 14/18, body-sm 12/18, Tag 11/16

  Re-exporting these Figma text variables into `tokens.css` would let all three share them.
- **OtpField legacy colours:** the Figma OTP component uses variables from an older collection that aren't in the token export. They are mapped to the closest semantic tokens, also used by InputField:
  - `Color/States/Error` #a3111e → `--border-error-moderate` / `--text-error-base` #c50f1f
  - `Color/States/Success` #308956 → `--border-success-moderate` / `--text-success-base` #156437
  - `color/content/tertiary` #626a7a → `--text-brand-tertiary` #525252

  Error and success therefore look slightly different from the Figma OTP frame. Updating the Figma component to the current variables would remove this.
- **InputField active state has no visible focus change** — follows Figma (the active state differs only by the caret). Figma's own guidance says “keep focus clearly visible”, so a focus border may be worth designing.
- **InputField clear button is always shown** when `clearable` (as in Figma), including on an empty field.
- **InputField `required` defaults to false**, while the Figma component always shows the asterisk. Pass `required` to match.
- **OtpField is digits-only** and fills left to right; deleting a middle digit shifts later digits left.
- **Text-cursor asset not used:** Figma draws the caret as an image (`Text Cursor Container`); the components use the native caret coloured with the same token (`--icon-brand-secondary`).
- **Token export vs Figma file:** this Figma file also has `font/family/primary` and `font/weight/semibold` variables not present in the export; the code uses `--font-family-base` and `font-weight: 600`.
- **Button disabled for non-brand variants** — *assumption:* Figma only defines disabled for brand. The brand disabled treatment is applied to every variant (ghost keeps a transparent background).
- **Button hover, pressed and loading states** are not defined in Figma and not implemented.
- **Colour contrast (verified with the Storybook a11y addon):** white on `--bg-brand-coral` (#ff5443) is about 3.2:1, and coral text on white (outline, ghost) is the same. Both are below WCAG AA 4.5:1 for 14–16px text. This comes from the design tokens; the Button follows Figma and has not been changed. The same coral is used for the OtpField “Resend OTP” action (3.18:1 at 12px, flagged by the a11y addon).
- **InputField helper and placeholder contrast (verified):** default helper text `--text-brand-quartenary` (#808080) on white is 3.94:1 at 11px (flagged by the a11y addon); placeholder `--text-brand-disabled-subtle` (#969696) is about 2.96:1 (not checked by the addon). Both below WCAG AA 4.5:1. Token-level; follows Figma.
- **Focus ring** — *assumption:* not in Figma; uses `--border-info-moderate` for visibility (Button, InputField clear button, OtpField resend button).
- **Light theme only:** semantic tokens exist only for Light mode.
- **Lint warnings (pre-existing, Foundations pages):** missing `key` props in `Typography.stories.tsx` and `Dimensions.stories.tsx` table rows, and a fast-refresh warning in `doc-blocks.tsx`. Docs-only pages; not shipped.
- **Starter app:** `src/App.tsx` and `src/index.css` are the unmodified Vite starter, not part of the library.

---

## Documentation rules

Whenever a component is created, changed or removed, update in the same change: inventory (§2), API reference (§3), Storybook table (§6), change log (§8), known issues (§9), and `COMPONENT_USE_CASES.md`.
