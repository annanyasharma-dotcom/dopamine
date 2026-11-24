import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Checkbox from the Figma “Checkbox” component set. Figma `circle` → `circle`, `disabled?` → `disabled`. Figma only defines the checked look; the unchecked look here (outlined, like the unselected Radio) is an assumption.',
      },
    },
  },
  args: { 'aria-label': 'Option', circle: true, disabled: false, defaultChecked: true, onChange: fn() },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    checked: { control: false },
    circle: { control: 'boolean', description: 'Round (Figma default) or rounded square.', table: { defaultValue: { summary: 'true' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `disabled?=false, circle=true`. */
export const Circle: Story = {};
/** Figma `disabled?=false, circle=false`. */
export const Square: Story = { args: { circle: false } };
/** Figma `disabled?=true, circle=true`. */
export const CircleDisabled: Story = { name: 'Circle, disabled', args: { disabled: true } };
/** Figma `disabled?=true, circle=false`. */
export const SquareDisabled: Story = { name: 'Square, disabled', args: { circle: false, disabled: true } };
/** Not designed in Figma (assumption). */
export const Unchecked: Story = { name: 'Unchecked (assumption)', args: { defaultChecked: false } };
export const WithLabel: Story = { name: 'With label', args: { 'aria-label': undefined, children: 'Save this address', circle: false } };

export const Toggling: Story = {
  name: 'Test: toggling',
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole('checkbox', { name: 'Option' });
    await expect(box).toBeChecked();
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: 'var(--gap-20)' }}>
      <Checkbox aria-label="Circle" defaultChecked />
      <Checkbox aria-label="Circle disabled" defaultChecked disabled />
      <Checkbox aria-label="Circle unchecked" />
      <Checkbox aria-label="Square" defaultChecked circle={false} />
      <Checkbox aria-label="Square disabled" defaultChecked disabled circle={false} />
      <Checkbox aria-label="Square unchecked" circle={false} />
    </div>
  ),
};
