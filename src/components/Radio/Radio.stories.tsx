import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radio button from the Figma “Radio Button” component set. Figma `selected?` → `checked` / `defaultChecked`, `disabled?` → `disabled`. Group options with the same `name`; use `Checkbox` for independent choices.',
      },
    },
  },
  args: { name: 'demo', 'aria-label': 'Option', disabled: false },
  argTypes: {
    defaultChecked: { control: 'boolean' },
    checked: { control: false },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `selected?=false, disabled?=false`. */
export const Unselected: Story = {};
/** Figma `selected?=true, disabled?=false`. */
export const Selected: Story = { args: { defaultChecked: true } };
/** Figma `selected?=false, disabled?=true` artwork (it looks selected — see docs). */
export const DisabledSelected: Story = { name: 'Disabled (Figma artwork)', args: { disabled: true, defaultChecked: true } };
/** Not designed in Figma: disabled and unselected. */
export const DisabledUnselected: Story = { name: 'Disabled, unselected (assumption)', args: { disabled: true } };

/** A real group: only one option can be selected. */
export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: function RadioGroup() {
    const [slot, setSlot] = useState('morning');
    return (
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 'var(--gap-12)', fontFamily: 'var(--font-family-base)' }}>
        <legend style={{ fontWeight: 700, marginBottom: 'var(--gap-8)' }}>Sample collection slot</legend>
        {['morning', 'afternoon', 'evening'].map((s) => (
          <Radio key={s} name="slot" value={s} checked={slot === s} onChange={() => setSlot(s)}>
            {s[0].toUpperCase() + s.slice(1)}
          </Radio>
        ))}
      </fieldset>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'Evening' }));
    await expect(canvas.getByRole('radio', { name: 'Evening' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Morning' })).not.toBeChecked();
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-20)', justifyItems: 'start' }}>
      <Radio name="a" aria-label="Unselected" />
      <Radio name="b" aria-label="Selected" defaultChecked />
      <Radio name="c" aria-label="Disabled" disabled defaultChecked />
      <Radio name="d" aria-label="Disabled unselected" disabled />
    </div>
  ),
};
