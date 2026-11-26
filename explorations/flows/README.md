# Flow explorations

Interactive prototypes built only from the Dopamine components and tokens in `../../src`:

- **Email login** (Ocula-inspired): splash → onboarding → log in / sign up → forgot password → loading
- **Mobile OTP sign-in** → **shopping journey**: home → product page → cart → order placed
- **All screens**: every state side by side

Not part of Storybook (nothing here is a story). Published with Storybook at
https://annanyasharma-dotcom.github.io/dopamine/explorations/

## Run and build

```sh
npm run explorations        # dev server, http://localhost:5174
npm run build-explorations  # → storybook-static/explorations/
```

## Prototype data

- Email login: any email and password; password `wrong123` shows the error
- OTP: any 10-digit number starting 6–9, code `1234` (email code `123412`)
- Coupons: `FIRST20`, `HEALTH50`. Products and prices are sample data.

## Gaps found in the design system

Worked around locally here; worth adding to the library:

- No inner-page header for PDP / cart (Figma has them, not built) → local `PageBar`
- Button has no icon-only variant → local round "next" button on onboarding
- Icon set has no eye / mail / lock; InputField has no icon slot → "Show" text toggle on password
- No product images → neutral SVG pack illustrations in `src/Shop/products.ts`
