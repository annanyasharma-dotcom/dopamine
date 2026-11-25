import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { QuantityDropdown } from './QuantityDropdown';

const meta = {
  title: 'Components/QuantityDropdown',
  component: QuantityDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Cart quantity picker from the Figma “dropdown”. A native `<select>` sits invisibly over the Figma design, so phones open their own picker. Set `options` from your cart rules (stock, purchase limits).',
      },
    },
  },
  args: { defaultValue: 1, onChange: fn() },
  argTypes: {
    defaultValue: { control: { type: 'number', min: 1 } },
    value: { control: false },
    options: { control: 'object', description: 'Quantities to offer. Default 1–10.' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof QuantityDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma dropdown (quantity 1). */
export const Default: Story = {};
export const LimitedStock: Story = { name: 'Limited options (max 3)', args: { options: [1, 2, 3] } };
export const Disabled: Story = { args: { disabled: true } };

export const ChangeQuantity: Story = {
  name: 'Test: change quantity',
  play: async ({ args, canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Quantity' });
    await userEvent.selectOptions(select, '3');
    await expect(args.onChange).toHaveBeenCalledWith(3);
    await expect(canvas.getByText('3', { selector: '.dp-quantity__value' })).toBeVisible();
  },
};

/** Controlled, next to a cart line. */
export const InCart: Story = {
  name: 'In a cart line',
  parameters: { controls: { disable: true } },
  render: function CartLine() {
    const [qty, setQty] = useState(1);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-16)', width: 328, fontFamily: 'var(--font-family-base)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>RiteBite Max Protein Bar</div>
          <div style={{ fontSize: 12, color: 'var(--text-brand-tertiary)' }}>₹{93 * qty}</div>
        </div>
        <QuantityDropdown value={qty} onChange={setQty} options={[1, 2, 3, 4, 5]} />
      </div>
    );
  },
};
