import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { SkuCard } from './SkuCard';

/** Placeholder product shot for stories only (the Figma frame has no image). */
const sampleImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="6" y="20" width="52" height="24" rx="6" fill="#772a4d"/><rect x="6" y="28" width="52" height="8" fill="#b1527f"/><text x="32" y="35" font-family="sans-serif" font-size="7" font-weight="700" fill="#fff" text-anchor="middle">PROTEIN</text></svg>',
  );

const meta = {
  title: 'Components/SkuCard',
  component: SkuCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Product (SKU) card from the Figma “SKU” component set. Figma `large`, `orientation`, `added?` and `tag` map to props of the same name; the sample text maps to content props. Large = vertical only (inline widgets, Spotlight search); small vertical = compact lists (previously ordered); small horizontal = ad widgets / SRP suggestions.',
      },
    },
  },
  args: {
    large: true,
    orientation: 'vertical',
    added: false,
    tag: true,
    name: 'RiteBite Max Protein Daily 10 gm Protein Bar Choco Almond',
    quantity: '250gm powder',
    deliveryTime: '30 mins',
    price: '₹93',
    mrp: '₹100',
    discount: '7% off',
    rating: 4.2,
    ratingCount: '(10K+)',
    offerPrice: '₹75',
    offerText: 'Use Code on cart',
    offerCode: 'PILGRIM20',
    addedQuantity: 1,
    onAdd: fn(),
    onAddedClick: fn(),
  },
  argTypes: {
    large: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Ignored when `large` (Figma has no large horizontal card).',
      table: { defaultValue: { summary: 'vertical' } },
    },
    added: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    tag: { control: 'boolean', description: 'Bestseller badge (large only).', table: { defaultValue: { summary: 'true' } } },
    name: { control: 'text' },
    quantity: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    deliveryTime: { control: 'text' },
    price: { control: 'text' },
    mrp: { control: 'text' },
    discount: { control: 'text' },
    rating: { control: 'number', description: 'Large only.' },
    ratingCount: { control: 'text', description: 'Large only.' },
    offerPrice: { control: 'text', description: 'Large only.' },
    offerText: { control: 'text', description: 'Large only.' },
    offerCode: { control: 'text', description: 'Large only.' },
    addedQuantity: { control: { type: 'number', min: 1 }, description: 'Large only: “{n} added”.' },
  },
} satisfies Meta<typeof SkuCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Figma `large=true, orientation=vertical, added?=false`. */
export const Large: Story = {};
/** Figma `large=true, orientation=vertical, added?=true`. */
export const LargeAdded: Story = { name: 'Large added', args: { added: true } };
/** Figma `large=false, orientation=vertical, added?=false`. */
export const Small: Story = { args: { large: false } };
/** Figma `large=false, orientation=vertical, added?=true`. */
export const SmallAdded: Story = { name: 'Small added', args: { large: false, added: true } };
/** Figma `large=false, orientation=horizontal, added?=false`. */
export const Horizontal: Story = { args: { large: false, orientation: 'horizontal' } };
/** Figma `large=false, orientation=horizontal, added?=true`. */
export const HorizontalAdded: Story = { name: 'Horizontal added', args: { large: false, orientation: 'horizontal', added: true } };

export const WithoutBestseller: Story = { name: 'Without bestseller tag', args: { tag: false } };
export const WithImage: Story = { name: 'With image', args: { imageSrc: sampleImage, imageAlt: '' } };
export const ShortName: Story = { name: 'Short name, no offer', args: { name: 'Almond Milk', offerPrice: undefined, rating: undefined } };

/** Add → added, with a real cart count. */
export const Interactive: Story = {
  render: function InteractiveSku(args) {
    const [qty, setQty] = useState(0);
    return (
      <SkuCard
        {...args}
        imageSrc={sampleImage}
        added={qty > 0}
        addedQuantity={qty}
        onAdd={() => {
          setQty(1);
          args.onAdd?.();
        }}
        onAddedClick={() => {
          setQty((q) => q + 1);
          args.onAddedClick?.();
        }}
      />
    );
  },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await expect(args.onAdd).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: /1 added/ })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /1 added/ }));
    await expect(args.onAddedClick).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: /2 added/ })).toBeVisible();
  },
};

/** The small card’s + / ✓ buttons call onAdd / onAddedClick and have names. */
export const SmallButtons: Story = {
  name: 'Test: small buttons',
  args: { large: false },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }));
    await expect(args.onAdd).toHaveBeenCalledTimes(1);
    await expect(args.onAddedClick).not.toHaveBeenCalled();
  },
};

export const SmallAddedButton: Story = {
  name: 'Test: small added button',
  args: { large: false, added: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Added to cart' }));
    await expect(args.onAddedClick).toHaveBeenCalledTimes(1);
    await expect(args.onAdd).not.toHaveBeenCalled();
  },
};

/** Every Figma variant, laid out as in the Figma frame. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--gap-40)', alignItems: 'flex-start', padding: 'var(--gap-20)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
        <SkuCard {...args} large />
        <SkuCard {...args} large added />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)' }}>
        <SkuCard {...args} large={false} />
        <SkuCard {...args} large={false} added />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-20)' }}>
        <SkuCard {...args} large={false} orientation="horizontal" />
        <SkuCard {...args} large={false} orientation="horizontal" added />
      </div>
    </div>
  ),
};
