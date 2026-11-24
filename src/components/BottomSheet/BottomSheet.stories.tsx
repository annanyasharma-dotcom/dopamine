import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { ListItem } from '../ListItem';
import { BottomSheet } from './BottomSheet';

/** Phone-sized frame. `transform` makes the sheet's fixed positioning stay inside it. */
const Phone = (Story: () => React.ReactElement) => (
  <div style={{ position: 'relative', width: 360, height: 800, transform: 'translateZ(0)', overflow: 'hidden', background: 'var(--bg-brand-secondary)' }}>
    <Story />
  </div>
);

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Modal bottom sheet from the Figma “Bottom Sheet”: dimmed backdrop, close button, optional header (`heading` / `subheading` — Figma `header`), content slot (`children`) and optional actions (`secondaryAction` / `primaryAction` — Figma `cta`, using `Button`). Closes on the × button, Escape and a tap on the backdrop.',
      },
      story: { inline: false, iframeHeight: 820 },
    },
  },
  decorators: [Phone],
  args: {
    open: true,
    heading: 'Heading',
    subheading: 'Sub heading',
    secondaryAction: { children: 'Button' },
    primaryAction: { children: 'Button' },
    onClose: fn(),
    children: <div style={{ height: 328 }} />,
  },
  argTypes: {
    open: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    heading: { control: 'text' },
    subheading: { control: 'text' },
    closeLabel: { control: 'text', table: { defaultValue: { summary: 'Close' } } },
    secondaryAction: { control: 'object' },
    primaryAction: { control: 'object' },
    children: { control: false },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma Bottom Sheet (empty 328px content slot). */
export const Playground: Story = {};

export const WithContent: Story = {
  name: 'With content',
  args: {
    heading: 'Select delivery address',
    subheading: 'Where should we deliver?',
    secondaryAction: { children: 'Add new', leftIcon: false, rightIcon: false },
    primaryAction: { children: 'Deliver here', leftIcon: false, rightIcon: false },
    children: (
      <div style={{ display: 'grid', gap: 'var(--gap-12)', padding: 'var(--gap-16)' }}>
        <ListItem title="Home" subtitle="Indiranagar, Bengaluru" media={false} />
        <ListItem title="Office" subtitle="3rd floor, Motorola Building" media={false} />
      </div>
    ),
  },
};

export const WithoutHeader: Story = { name: 'Without header', args: { heading: undefined, subheading: undefined } };
export const WithoutActions: Story = { name: 'Without actions', args: { secondaryAction: undefined, primaryAction: undefined } };
export const SingleAction: Story = { name: 'Primary action only', args: { secondaryAction: undefined, primaryAction: { children: 'Continue', leftIcon: false } } };

/** Opens from a button; closes with ×, Escape or the backdrop. */
export const Interactive: Story = {
  args: { open: false },
  render: function InteractiveSheet(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div style={{ padding: 'var(--gap-16)' }}>
          <Button onClick={() => setOpen(true)} leftIcon={false} rightIcon={false}>Open sheet</Button>
        </div>
        <BottomSheet
          {...args}
          open={open}
          onClose={() => {
            setOpen(false);
            args.onClose?.();
          }}
        />
      </>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open sheet' }));
    await expect(canvas.getByRole('dialog', { name: 'Heading' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.queryByRole('dialog')).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Open sheet' })).toHaveFocus();
  },
};

export const CloseButton: Story = {
  name: 'Test: close button and actions',
  args: { primaryAction: { children: 'Confirm', onClick: fn() } },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm' }));
    await expect(args.primaryAction?.onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};
