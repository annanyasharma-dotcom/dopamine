import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { InputField } from './InputField';

const meta = {
  title: 'Components/InputField',
  component: InputField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Text input from the Figma “Input field” component set. Figma `state` rest / active / typing / typed happen automatically from focus and value; success / error map to `status`, disabled to `disabled`. Figma `text` maps to `placeholder` (empty) or `value`, `helper` + `helperText` to `helperText`. All native `<input>` props are supported.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: {
    label: 'Label',
    placeholder: 'Placeholder Text',
    helperText: 'Helping text or error message goes here',
    status: 'default',
    required: true,
    disabled: false,
    clearable: true,
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text', description: 'Supporting or validation text. Omit to hide (Figma `helper` = false).' },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      description: 'Validation status (Figma `state` success / error).',
      table: { defaultValue: { summary: 'default' } },
    },
    required: { control: 'boolean', description: 'Native `required`; shows the red asterisk.', table: { defaultValue: { summary: 'false' } } },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    clearable: { control: 'boolean', description: 'Show the clear (×) button.', table: { defaultValue: { summary: 'true' } } },
    defaultValue: { control: 'text', description: 'Initial value (uncontrolled).' },
    value: { control: false, description: 'Current value (controlled). See the Controlled story.' },
    onChange: { description: 'Native change handler.' },
    onClear: { description: 'Called after the clear button is pressed.' },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Figma `state=rest`: empty and unfocused. */
export const Rest: Story = {};

/** Figma `state=active`: empty and focused. */
export const Active: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('textbox'));
    await expect(canvas.getByRole('textbox')).toHaveFocus();
  },
};

/** Figma `state=typing`: focused with a value. Also tests that typing updates the field and calls onChange. */
export const Typing: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Placeholder Text');
    await expect(input).toHaveValue('Placeholder Text');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

/** Figma `state=typed`: has a value, not focused. */
export const Typed: Story = { args: { defaultValue: 'Placeholder Text' } };

/** Figma `state=success`. */
export const Success: Story = { args: { defaultValue: 'Placeholder Text', status: 'success', helperText: 'Looks good' } };

/** Figma `state=error`. */
export const Error: Story = {
  args: { defaultValue: 'Placeholder Text', status: 'error', helperText: 'Enter a valid value' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('textbox')).toHaveAccessibleDescription('Enter a valid value');
  },
};

/** Figma `state=disabled`. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox');
    await expect(input).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Clear' })).toBeDisabled();
    await userEvent.type(input, 'abc', { pointerEventsCheck: 0 });
    await expect(input).toHaveValue('');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

export const WithoutHelper: Story = { args: { helperText: undefined } };

export const NotRequired: Story = { args: { required: false } };

/** Clear button empties the field, calls onClear and returns focus to the input. */
export const ClearValue: Story = {
  args: { defaultValue: 'Some text' },
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(input).toHaveValue('');
    await expect(args.onClear).toHaveBeenCalledTimes(1);
    await expect(input).toHaveFocus();
  },
};

/** Controlled usage: the parent owns `value` and clears it in `onClear`. */
export const Controlled: Story = {
  render: function ControlledField(args) {
    const [value, setValue] = useState('Controlled value');
    return (
      <InputField
        {...args}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          args.onChange?.(e);
        }}
        onClear={() => {
          setValue('');
          args.onClear?.();
        }}
        helperText={`${value.length} characters`}
      />
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(canvas.getByRole('textbox')).toHaveValue('');
    await expect(canvas.getByText('0 characters')).toBeVisible();
  },
};

/** Every Figma state that doesn't need focus. */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true } },
  decorators: [(Story) => <div style={{ width: 328, display: 'grid', gap: 'var(--gap-24)' }}><Story /></div>],
  render: (args) => (
    <>
      <InputField {...args} />
      <InputField {...args} defaultValue="Placeholder Text" />
      <InputField {...args} defaultValue="Placeholder Text" status="success" />
      <InputField {...args} defaultValue="Placeholder Text" status="error" />
      <InputField {...args} disabled />
    </>
  ),
};
