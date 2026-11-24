import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'On/off switch from the Figma “Toggle” component set. Figma `state` (inactive / active) → `checked` / `defaultChecked`, `disabled` → `disabled`. A native checkbox with `role="switch"`; pair it with a label that names the setting.',
      },
    },
  },
  args: { 'aria-label': 'Notifications', disabled: false, onChange: fn() },
  argTypes: {
    defaultChecked: { control: 'boolean', description: 'Initial state (uncontrolled).' },
    checked: { control: false },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    children: { control: 'text', description: 'Visible label.' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `state=inactive, disabled=false`. */
export const Off: Story = {};
/** Figma `state=active, disabled=false`. */
export const On: Story = { args: { defaultChecked: true } };
/** Figma `state=inactive, disabled=true`. */
export const OffDisabled: Story = { name: 'Off, disabled', args: { disabled: true } };
/** Figma `state=active, disabled=true`. */
export const OnDisabled: Story = { name: 'On, disabled', args: { disabled: true, defaultChecked: true } };
export const WithLabel: Story = { name: 'With label', args: { 'aria-label': undefined, children: 'Order updates on WhatsApp' } };

export const Switching: Story = {
  name: 'Test: switching',
  play: async ({ args, canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'Notifications' });
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(sw).not.toBeChecked();
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-20)', justifyItems: 'start' }}>
      <Toggle aria-label="Off" />
      <Toggle aria-label="On" defaultChecked />
      <Toggle aria-label="Off, disabled" disabled />
      <Toggle aria-label="On, disabled" disabled defaultChecked />
    </div>
  ),
};
