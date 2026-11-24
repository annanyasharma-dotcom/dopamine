import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Icon } from '../Icon';
import { CompoundButton } from './CompoundButton';

const meta = {
  title: 'Components/CompoundButton',
  component: CompoundButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Two-line pill button with a coral icon, from the Figma “compount button” (sample: Upload / Prescription). `label` is the small first line, `children` the bold second line, `icon` the content of the coral pill.',
      },
    },
  },
  args: { label: 'Upload', children: 'Prescription', onClick: fn() },
  argTypes: {
    label: { control: 'text' },
    children: { control: 'text' },
    icon: { control: false, description: 'Defaults to the upload icon; `false` hides it.' },
  },
} satisfies Meta<typeof CompoundButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma compound button. */
export const Playground: Story = {};
export const OtherIcon: Story = { name: 'Other icon', args: { label: 'Search', children: 'Medicines', icon: <Icon name="search" size={20} color="var(--icon-brand-primary-inverse)" /> } };
export const WithoutIcon: Story = { name: 'Without icon', args: { icon: false } };

export const Click: Story = {
  name: 'Test: click',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Upload Prescription' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
