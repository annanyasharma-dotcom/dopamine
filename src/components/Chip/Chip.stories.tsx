import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Chip } from './Chip';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Compact action or filter chip from the Figma “Chip” component set. Figma `inverse` (true = light, false = dark), `diabled?` → `disabled`, `leftIcon`, and `rightIcon` (the count) → `count`. Renders a `<button>`.',
      },
    },
  },
  args: { children: 'Label', inverse: true, disabled: false, leftIcon: true, count: 1, onClick: fn() },
  argTypes: {
    children: { control: 'text' },
    inverse: { control: 'boolean', description: '`true` = light chip (Figma default), `false` = dark.', table: { defaultValue: { summary: 'true' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    leftIcon: { control: 'boolean', table: { type: { summary: 'boolean | ReactNode' }, defaultValue: { summary: 'true' } } },
    count: { control: { type: 'number', min: 0 }, description: 'Count bubble (Figma `rightIcon`); hidden when unset.' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `inverse=true, diabled?=false`. */
export const Light: Story = {};
/** Figma `inverse=false, diabled?=false`. */
export const Dark: Story = { args: { inverse: false } };
/** Figma `inverse=false, diabled?=true`. */
export const Disabled: Story = {
  args: { inverse: false, disabled: true },
  play: async ({ args, canvas }) => {
    const chip = canvas.getByRole('button', { name: /Label/ });
    await expect(chip).toBeDisabled();
    await userEvent.click(chip, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
export const LabelOnly: Story = { name: 'Label only', args: { leftIcon: false, count: undefined } };

export const Click: Story = {
  name: 'Test: click',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Label/ }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--gap-16)', justifyItems: 'start', padding: 'var(--gap-16)', background: 'var(--color-cool-neutral-600)', borderRadius: 'var(--radius-md)' }}>
      <Chip {...args} inverse />
      <Chip {...args} inverse={false} />
      <Chip {...args} inverse={false} disabled />
    </div>
  ),
};
