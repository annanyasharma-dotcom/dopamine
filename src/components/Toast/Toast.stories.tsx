import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Toast, type ToastType } from './Toast';

const types: ToastType[] = ['warning', 'error', 'success', 'info', 'white'];

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Short, non-blocking message from the Figma “Toast” component set. Figma `type`, `icon`, `cross` and `label` map to the same props; `action text` maps to `actionLabel` (+ `onAction`). Showing, stacking and auto-hiding toasts is up to the app.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { type: 'warning', label: 'Short message displayed here.', icon: true, cross: true, onDismiss: fn(), onAction: fn() },
  argTypes: {
    type: { control: 'inline-radio', options: types, table: { defaultValue: { summary: 'warning' } } },
    label: { control: 'text' },
    icon: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    cross: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    actionLabel: { control: 'text', description: 'Shows the action (Figma `action text`), e.g. “Undo”.' },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Warning: Story = { args: { type: 'warning' } };
export const Error: Story = {
  args: { type: 'error' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Short message displayed here.');
  },
};
export const Success: Story = { args: { type: 'success' } };
export const Info: Story = { args: { type: 'info' } };
export const White: Story = { args: { type: 'white' } };
export const WithAction: Story = { name: 'With action (Undo)', args: { type: 'success', label: 'Item archived.', actionLabel: 'Undo' } };
export const NoIconNoCross: Story = { name: 'No icon, no cross', args: { icon: false, cross: false } };

/** Dismiss and action buttons call their handlers. */
export const Buttons: Story = {
  name: 'Test: buttons',
  args: { actionLabel: 'Undo' },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};

/** Every Figma variant: 5 types, without and with the action. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--gap-12)' }}>
      {types.map((type) => <Toast key={type} {...args} type={type} />)}
      <div style={{ height: 'var(--gap-24)' }} />
      {types.map((type) => <Toast key={`${type}-action`} {...args} type={type} actionLabel="Undo" />)}
    </div>
  ),
};
