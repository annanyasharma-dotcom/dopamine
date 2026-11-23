import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { OtpField } from './OtpField';

const meta = {
  title: 'Components/OtpField',
  component: OtpField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'One-time-code input from the Figma “OTP field” component set. Figma `digits` maps to `digits` (4 | 6); `state` rest / typing / typed happen automatically; error / success map to `status`, disabled to `disabled`, and “resend OTP” to passing `onResend`. Supports typing, Backspace, arrow keys, paste and phone one-time-code autofill.',
      },
    },
  },
  args: {
    digits: 4,
    status: 'default',
    disabled: false,
    onChange: fn(),
    onComplete: fn(),
  },
  argTypes: {
    digits: { control: 'inline-radio', options: [4, 6], table: { defaultValue: { summary: '4' } } },
    status: {
      control: 'inline-radio',
      options: ['default', 'success', 'error'],
      description: 'Verification result (Figma `state` success / error).',
      table: { defaultValue: { summary: 'default' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    helperText: { control: 'text', description: 'Text under the boxes. Omit to hide (Figma `helper` = false).' },
    defaultValue: { control: 'text', description: 'Initial code (uncontrolled).' },
    value: { control: false, description: 'Current code (controlled). See the Controlled story.' },
    resendPrompt: { control: 'text', table: { defaultValue: { summary: 'Didn’t receive OTP?' } } },
    resendLabel: { control: 'text', table: { defaultValue: { summary: 'Resend OTP' } } },
    onChange: { description: 'Called with the code string on every change.' },
    onComplete: { description: 'Called with the code when every box is filled.' },
    onResend: { control: false, description: 'Shows the resend row; called when Resend is pressed.' },
  },
} satisfies Meta<typeof OtpField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Figma `state=rest`. */
export const Rest: Story = {};
export const SixDigits: Story = { name: 'Rest (6 digits)', args: { digits: 6 } };

/** Figma `state=typing`: partly entered, focus in the next empty box. */
export const Typing: Story = {
  args: { defaultValue: '27' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByLabelText('Digit 3 of 4'));
    await expect(canvas.getByLabelText('Digit 3 of 4')).toHaveFocus();
  },
};

/** Figma `state=typed`. */
export const Typed: Story = { args: { defaultValue: '2702' } };

/** Figma `state=error`. */
export const Error: Story = { args: { defaultValue: '2702', status: 'error', helperText: 'Incorrect code. Try again or request a new one.' } };

/** Figma `state=success`. */
export const Success: Story = { args: { defaultValue: '2702', status: 'success', helperText: 'Code verified' } };

/** Figma `state=disabled`. */
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    for (const box of canvas.getAllByRole('textbox')) await expect(box).toBeDisabled();
  },
};

/** Figma `state=resend OTP`. */
export const ResendOtp: Story = {
  name: 'Resend OTP',
  args: { onResend: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Resend OTP' }));
    await expect(args.onResend).toHaveBeenCalledTimes(1);
  },
};

export const WithHelper: Story = { args: { helperText: 'Enter the code sent to +91 98xxxxxx10' } };

/** Typing fills boxes left to right and calls onComplete with the full code. */
export const TypeFullCode: Story = {
  name: 'Test: type full code',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByLabelText('Digit 1 of 4'));
    await userEvent.keyboard('2a702');
    await expect(canvas.getByLabelText('Digit 4 of 4')).toHaveValue('2');
    await expect(args.onChange).toHaveBeenLastCalledWith('2702');
    await expect(args.onComplete).toHaveBeenCalledWith('2702');
  },
};

/** Pasting a code fills every box. */
export const PasteCode: Story = {
  name: 'Test: paste code',
  args: { digits: 6 },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByLabelText('Digit 1 of 6'));
    await userEvent.paste('270 204');
    await expect(canvas.getByLabelText('Digit 6 of 6')).toHaveValue('4');
    await expect(args.onComplete).toHaveBeenCalledWith('270204');
  },
};

/** Backspace in an empty box deletes the previous digit and moves back. */
export const BackspaceMovesBack: Story = {
  name: 'Test: backspace',
  args: { defaultValue: '27' },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByLabelText('Digit 3 of 4'));
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.getByLabelText('Digit 2 of 4')).toHaveValue('');
    await expect(canvas.getByLabelText('Digit 2 of 4')).toHaveFocus();
    await expect(args.onChange).toHaveBeenLastCalledWith('2');
  },
};

/** Controlled usage: the parent owns `value`. */
export const Controlled: Story = {
  render: function ControlledOtp(args) {
    const [code, setCode] = useState('');
    return (
      <OtpField
        {...args}
        value={code}
        onChange={(next) => {
          setCode(next);
          args.onChange?.(next);
        }}
        helperText={code.length === args.digits ? `Code entered: ${code}` : `${code.length} of ${args.digits ?? 4} digits`}
      />
    );
  },
};

/** Every Figma state, 4 and 6 digits. */
export const AllStates: Story = {
  name: 'All states',
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--gap-40)', alignItems: 'flex-start' }}>
      {([4, 6] as const).map((digits) => (
        <div key={digits} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-32)', alignItems: 'flex-start' }}>
          <OtpField {...args} digits={digits} />
          <OtpField {...args} digits={digits} defaultValue="270204" />
          <OtpField {...args} digits={digits} defaultValue="270204" status="error" helperText="Helping text or error message goes here" />
          <OtpField {...args} digits={digits} defaultValue="270204" status="success" helperText="Helping text or error message goes here" />
          <OtpField {...args} digits={digits} disabled />
          <OtpField {...args} digits={digits} onResend={() => {}} />
        </div>
      ))}
    </div>
  ),
};
