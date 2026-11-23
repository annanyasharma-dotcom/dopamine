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
- **Props:** extend the native element's props (`ComponentPropsWithRef<'button'>`) so native attributes and `ref` work. Figma property names are kept unless they clash with a native attribute (documented per component).

---

## 2. Component inventory

| Component | Category | Source | Export | Depends on | Figma node |
| --- | --- | --- | --- | --- | --- |
| Button | Actions | `src/components/Button/Button.tsx` | `Button` (named + default), types `ButtonProps`, `ButtonSize`, `ButtonVariant` | tokens.css, fonts.css (Figtree), `assets/arrow-left.svg`, `assets/arrow-right.svg` | `40002646:30877` |

Import: `import { Button } from './components';` (or `./components/Button`).

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

---

## 4. Architecture and dependencies

- **Button** has no child components. Internal `IconSlot` (not exported) renders the 24px icon slots.
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

\* has a `play` interaction test.

Button controls: `children` (text), `variant` (radio), `size` (radio), `disabled` (boolean), `leftIcon`/`rightIcon` (boolean; custom nodes shown in CustomIcon), `type` (radio), `onClick` (action spy). All map to real props.

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

---

## 9. Known issues

Verified unless marked *assumption*.

- **Typography token gap (Button):** Figma uses body-base (14/20) and body-lg (16/24) variables that are not in the token export (its `body-md` is 14/18 mobile, 24/32 desktop). Button keeps these values as `--dp-button-font-size` / `--dp-button-line-height`. Move them to `tokens.css` when the export includes them.
- **Token export vs Figma file:** this Figma file also has `font/family/primary` and `font/weight/semibold` variables not present in the export; the code uses `--font-family-base` and `font-weight: 600`.
- **Button disabled for non-brand variants** — *assumption:* Figma only defines disabled for brand. The brand disabled treatment is applied to every variant (ghost keeps a transparent background).
- **Button hover, pressed and loading states** are not defined in Figma and not implemented.
- **Colour contrast (verified with the Storybook a11y addon):** white on `--bg-brand-coral` (#ff5443) is about 3.2:1, and coral text on white (outline, ghost) is the same. Both are below WCAG AA 4.5:1 for 14–16px text. This comes from the design tokens; the Button follows Figma and has not been changed.
- **Focus ring** — *assumption:* not in Figma; uses `--border-info-moderate` for visibility.
- **Light theme only:** semantic tokens exist only for Light mode.
- **Lint warnings (pre-existing, Foundations pages):** missing `key` props in `Typography.stories.tsx` and `Dimensions.stories.tsx` table rows, and a fast-refresh warning in `doc-blocks.tsx`. Docs-only pages; not shipped.
- **Starter app:** `src/App.tsx` and `src/index.css` are the unmodified Vite starter, not part of the library.

---

## Documentation rules

Whenever a component is created, changed or removed, update in the same change: inventory (§2), API reference (§3), Storybook table (§6), change log (§8), known issues (§9), and `COMPONENT_USE_CASES.md`.
