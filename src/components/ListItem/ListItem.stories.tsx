import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Icon } from '../Icon';
import { ListItem } from './ListItem';

const meta = {
  title: 'Components/ListItem',
  component: ListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'List item from the Figma “list” component. Figma `t1` → `title`, `t2` → `subtitle`, `img` → `media`, `icon` → `chevron`. Pass `onClick` to make the whole item a button.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { title: 'This is a title', subtitle: 'This is a subtitle', media: true, chevron: true },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    media: { control: 'boolean', description: '`true` = Figma placeholder block; or pass a node (image / icon).', table: { type: { summary: 'boolean | ReactNode' }, defaultValue: { summary: 'true' } } },
    chevron: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
  },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma “list” component. */
export const Playground: Story = {};
export const WithoutMedia: Story = { name: 'Without media', args: { media: false } };
export const WithoutSubtitle: Story = { name: 'Without subtitle', args: { subtitle: undefined } };
export const WithoutChevron: Story = { name: 'Without chevron', args: { chevron: false } };
export const WithIconMedia: Story = {
  name: 'With icon media',
  args: { title: 'Lab tests', subtitle: 'Book at home', media: <Icon name="info" color="var(--icon-info-base)" /> },
  argTypes: { media: { control: false } },
};

/** With `onClick` the whole row is one button. */
export const Clickable: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /This is a title/ }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const InAList: Story = {
  name: 'In a list',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-12)' }}>
      <ListItem title="My orders" subtitle="Track, return or reorder" />
      <ListItem title="Lab reports" subtitle="Download your reports" />
      <ListItem title="Saved addresses" subtitle="Home, Office" />
    </div>
  ),
};
