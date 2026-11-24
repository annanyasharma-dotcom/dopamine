import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CounterBadge, type CounterBadgeColour } from './CounterBadge';

const colours: CounterBadgeColour[] = ['brand', 'blue', 'green'];

const meta = {
  title: 'Components/CounterBadge',
  component: CounterBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small numeric count from the Figma “Counter badge” component set. Figma `colour` → `colour`, `disabled?` → `disabled`, the number → `count`. Say what is being counted with `aria-label` or nearby text — colour alone doesn’t carry meaning.',
      },
    },
  },
  args: { count: 3, colour: 'brand', disabled: false, max: 99 },
  argTypes: {
    count: { control: { type: 'number', min: 0 } },
    colour: { control: 'inline-radio', options: colours, table: { defaultValue: { summary: 'brand' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    max: { control: { type: 'number', min: 1 }, description: 'Counts above this show as “max+”.', table: { defaultValue: { summary: '99' } } },
    'aria-label': { control: 'text', description: 'What is counted, e.g. “3 unread messages”.' },
  },
} satisfies Meta<typeof CounterBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Figma `colour=brand, disabled?=false`. */
export const Brand: Story = {};
/** Figma `colour=blue, disabled?=false`. */
export const Blue: Story = { args: { colour: 'blue' } };
/** Figma `colour=green, disabled?=false`. */
export const Green: Story = { args: { colour: 'green' } };
/** Figma `colour=green, disabled?=true`. */
export const GreenDisabled: Story = { name: 'Green disabled', args: { colour: 'green', disabled: true } };

/** Two-digit counts widen into a pill; counts above `max` show “max+”. */
export const LargeCounts: Story = {
  name: 'Large counts',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--gap-8)', alignItems: 'center' }}>
      <CounterBadge count={7} />
      <CounterBadge count={12} />
      <CounterBadge count={99} />
      <CounterBadge count={150} />
      <CounterBadge count={150} max={9} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('99+')).toBeVisible();
    await expect(canvas.getByText('9+')).toBeVisible();
  },
};

/** With `aria-label`, screen readers announce the label instead of a bare number. */
export const WithAccessibleLabel: Story = {
  name: 'With accessible label',
  args: { count: 3, 'aria-label': '3 unread messages' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '3 unread messages' })).toHaveTextContent('3');
  },
};

/** Every Figma variant. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-20)', alignItems: 'center' }}>
      {colours.map((colour) => (
        <CounterBadge key={colour} {...args} colour={colour} />
      ))}
      <CounterBadge {...args} colour="green" disabled />
    </div>
  ),
};
