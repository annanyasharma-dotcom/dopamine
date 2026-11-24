import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { SpecialButton } from './SpecialButton';

const meta = {
  title: 'Components/SpecialButton',
  component: SpecialButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Coupon highlight chip from the Figma “special button”: a coupon or savings amount on a pink gradient. With `onClick` it is a button (open details, copy or apply a code — your flow decides); without, a static label. Not a generic primary button or price label.',
      },
    },
  },
  args: { children: '₹80', chevron: true },
  argTypes: {
    children: { control: 'text' },
    chevron: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
  },
} satisfies Meta<typeof SpecialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma special button. */
export const Playground: Story = {};
export const WithoutChevron: Story = { name: 'Without chevron', args: { chevron: false } };

export const Clickable: Story = {
  name: 'Test: clickable',
  args: { onClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: '₹80' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const InContext: Story = {
  name: 'In context',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-4)', fontFamily: 'var(--font-family-base)', fontSize: 12, color: 'var(--color-comfort-pink-200)' }}>
      <SpecialButton onClick={() => {}}>₹80</SpecialButton>
      <span>with coupon <strong>PILGRIM20</strong></span>
    </div>
  ),
};
