import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tag, type TagType } from './Tag';

const types: TagType[] = ['bestseller', 'previously-bought', 'promoted', 'sold-out'];

const meta = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Small product tag from the Figma “.Tags” component set. Figma `State` maps to `type`: Bestseller, Previously Bought, Promoted (“1mg’s choice”) and Sold Out. Used by `SkuCard` for its image tag.',
      },
    },
  },
  args: { type: 'bestseller' },
  argTypes: {
    type: { control: 'inline-radio', options: types, table: { defaultValue: { summary: 'bestseller' } } },
    label: { control: 'text', description: 'Override the Figma text.' },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `State=Bestseller`. */
export const Bestseller: Story = { args: { type: 'bestseller' } };
/** Figma `State=Previously Bought`. */
export const PreviouslyBought: Story = { name: 'Previously bought', args: { type: 'previously-bought' } };
/** Figma `State=Promoted`. */
export const Promoted: Story = { name: 'Promoted (1mg’s choice)', args: { type: 'promoted' } };
/** Figma `State=Sold Out`. */
export const SoldOut: Story = {
  name: 'Sold out',
  args: { type: 'sold-out' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sold out')).toBeVisible();
  },
};

/** All tag types, as in the Figma frame. */
export const AllTypes: Story = {
  name: 'All types',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--gap-24)', alignItems: 'center' }}>
      <Tag type="bestseller" />
      <Tag type="previously-bought" />
      <Tag type="sold-out" />
      <Tag type="promoted" />
    </div>
  ),
};
