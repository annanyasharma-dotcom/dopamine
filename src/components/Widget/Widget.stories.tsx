import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ListItem } from '../ListItem';
import { SkuCard } from '../SkuCard';
import { Widget } from './Widget';

/** The empty pink slot shown in Figma — a placeholder, not real content. */
const FigmaSlot = () => <div style={{ height: 252, background: 'var(--color-comfort-pink-25)' }} />;

const meta = {
  title: 'Components/Widget',
  component: Widget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Section shell from the Figma “Widget” component: title, optional subtitle and chevron, then a content slot (`children`). Fill the slot with SKUs, list items or grids; the shell only supplies framing and spacing.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 360, boxShadow: 'var(--shadow-md)' }}><Story /></div>],
  args: { title: 'Title', subtitle: 'Subtitle', chevron: true, onChevronClick: fn(), children: <FigmaSlot /> },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    chevron: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    chevronLabel: { control: 'text', table: { defaultValue: { summary: 'See all' } } },
    children: { control: false },
  },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma Widget (empty reference slot). */
export const Playground: Story = {};
export const WithoutSubtitle: Story = { name: 'Without subtitle', args: { subtitle: undefined } };
export const WithoutChevron: Story = { name: 'Without chevron', args: { chevron: false } };

export const WithSkuCards: Story = {
  name: 'With SKU cards',
  args: {
    title: 'Previously ordered',
    subtitle: 'Reorder in one tap',
    children: (
      <div style={{ display: 'flex', gap: 'var(--gap-16)', overflowX: 'auto' }}>
        {[1, 2, 3, 4].map((i) => (
          <SkuCard key={i} large={false} name="RiteBite Max Protein Bar" quantity="250gm powder" deliveryTime="30 mins" price="₹93" mrp="₹100" discount="7% off" />
        ))}
      </div>
    ),
  },
};

export const WithListItems: Story = {
  name: 'With list items',
  args: {
    title: 'Your account',
    subtitle: undefined,
    children: (
      <div style={{ display: 'grid', gap: 'var(--gap-12)' }}>
        <ListItem title="My orders" subtitle="Track, return or reorder" />
        <ListItem title="Lab reports" subtitle="Download your reports" />
      </div>
    ),
  },
};

export const ChevronClick: Story = {
  name: 'Test: chevron',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'See all' }));
    await expect(args.onChevronClick).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('heading', { name: 'Title' })).toBeVisible();
  },
};
