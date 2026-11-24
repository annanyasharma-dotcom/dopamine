import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Icon } from '../Icon';
import { InfoBanner } from './InfoBanner';

const meta = {
  title: 'Components/InfoBanner',
  component: InfoBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Contextual service or promo strip from the Figma “Info banner”. Figma `content` → `children`, `icon` (+ slot) → `icon`, `actionButton` → `chevron`. Pass `onClick` to make it a button; show the chevron only when it leads somewhere.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { children: 'Get medicines in under 30mins. Now in your locality', icon: true, chevron: true },
  argTypes: {
    children: { control: 'text' },
    icon: { control: 'boolean', table: { type: { summary: 'boolean | ReactNode' }, defaultValue: { summary: 'true' } } },
    chevron: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
  },
} satisfies Meta<typeof InfoBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma Info banner. */
export const Playground: Story = {};
export const InformationOnly: Story = { name: 'Information only (no chevron)', args: { chevron: false } };
export const WithoutIcon: Story = { name: 'Without icon', args: { icon: false } };
export const CustomIcon: Story = {
  name: 'Custom icon',
  args: { icon: <Icon name="info" size={24} color="var(--icon-info-base)" />, children: 'Lab reports are now available in the app' },
  argTypes: { icon: { control: false } },
};

export const Clickable: Story = {
  name: 'Test: clickable',
  args: { onClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Get medicines/ }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
