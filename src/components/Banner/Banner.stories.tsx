import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Hooman } from '../Hooman';
import { Illustration } from '../Illustration';
import { Banner, type BannerColour } from './Banner';

const colours: BannerColour[] = ['brand', 'blue', 'green', 'brown', 'pink', 'mauve', 'purple', 'mint-green'];

/** Imagery choices for the Playground's `image` control (the slot accepts any node). */
const images = {
  none: undefined,
  'Hooman: phlebotomist-home-visit': <Hooman name="phlebotomist-home-visit" height={100} />,
  'Hooman: delivery-bike': <Hooman name="delivery-bike" height={120} />,
  'Hooman: pharmacist-with-coupon': <Hooman name="pharmacist-with-coupon" height={100} />,
  'Illustration: meds': <Illustration name="meds" size={100} />,
  'Illustration: discount-green': <Illustration name="discount-green" size={100} />,
};

const meta = {
  title: 'Components/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Promo banner (Figma “banner”): a 328 × 164 px banner pairing a title, subtitle and CTA with a dedicated imagery slot (140px high, 115–151px wide). 3D icons / imagery sit inside the slot: fit artwork proportionally and keep its silhouette and shadows within the slot to avoid clipping (Figma guidance: 12px inset, 91 × 116 px usable area). Eight colours; the CTA is a `Button` (black on brand, inverse on the others).',
      },
    },
  },
  args: { title: 'Title', subtitle: 'Subtitle', cta: 'Button', colour: 'brand', onCtaClick: fn() },
  argTypes: {
    colour: { control: 'select', options: colours, table: { defaultValue: { summary: 'brand' } } },
    title: { control: 'text' },
    subtitle: { control: 'text', description: 'Omit (empty) to hide.' },
    cta: { control: 'text', description: 'CTA label. Omit (empty) to hide the button.' },
    image: { control: 'select', options: Object.keys(images), mapping: images, description: 'Imagery slot content (any node).' },
    onCtaClick: { table: { category: 'Events' } },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The Figma example: mint-green banner with a phlebotomist hooman. */
export const HomeSampleCollection: Story = {
  args: {
    colour: 'mint-green',
    title: 'Get at-home sample collection',
    subtitle: 'for FREE',
    cta: 'Book test now',
    image: <Hooman name="phlebotomist-home-visit" height={100} />,
  },
};

/** All eight Figma colours with the sample content. */
export const AllColours: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(328px, 328px))', gap: 'var(--gap-16)', fontFamily: 'var(--font-family-base)' }}>
      {colours.map((colour) => (
        <div key={colour} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-4)' }}>
          <code style={{ fontSize: 12, color: 'var(--text-brand-tertiary)' }}>{colour}</code>
          <Banner {...args} colour={colour} />
        </div>
      ))}
    </div>
  ),
};

export const WithoutSubtitle: Story = { args: { subtitle: undefined } };

export const WithoutCta: Story = { args: { cta: undefined, colour: 'purple', title: 'Your reports are ready', subtitle: 'View them in My Reports' } };

export const WithIllustration: Story = {
  args: { colour: 'green', title: 'Flat 20% off', subtitle: 'on your first medicine order', cta: 'Shop now', image: <Illustration name="discount-green" size={100} /> },
};

/** The CTA is a real button that calls `onCtaClick`; brand uses the black Button, other colours the inverse one. */
export const CtaClick: Story = {
  name: 'Test: CTA click',
  args: { colour: 'blue', cta: 'Book now', onCtaClick: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Book now' });
    await expect(button).toHaveClass('dp-button--inverse');
    await userEvent.click(button);
    await expect(args.onCtaClick).toHaveBeenCalledTimes(1);
  },
};

export const BrandCtaIsBlack: Story = {
  name: 'Test: brand CTA is black',
  args: { colour: 'brand', cta: 'Explore' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Explore' })).toHaveClass('dp-button--black');
  },
};
