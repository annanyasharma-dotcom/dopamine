import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Icon } from '../Icon';
import { Grid, GridItem } from './Grid';

const meta = {
  title: 'Components/Grid',
  component: GridItem,
  subcomponents: { Grid },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Shortcut tiles from the Figma “grid” (a row) and “.grid” (one 70×76 tile with a 40px slot and a 2-line title). `Grid` lays tiles 16px apart; `GridItem` is one tile. Put an icon or illustration in the slot (`children`).',
      },
    },
  },
  args: { title: 'Reorder Medicines', onClick: fn() },
  argTypes: { title: { control: 'text' }, children: { control: false } },
} satisfies Meta<typeof GridItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One tile (Figma “.grid”). */
export const Item: Story = {};

/** The Figma “grid” row: four tiles with empty slots. */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <GridItem title="Reorder Medicines" />
      <GridItem title={<>Health<br />Plans</>} />
      <GridItem title="Health Insights" />
      <GridItem title={<>Care<br />Plan</>} />
    </Grid>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  parameters: { controls: { disable: true } },
  render: () => (
    <Grid>
      <GridItem title="Reorder Medicines" onClick={() => {}}><Icon name="restart" size={20} color="var(--icon-brand-coral)" /></GridItem>
      <GridItem title="Health Plans" onClick={() => {}}><Icon name="good-experience" size={20} color="var(--icon-brand-coral)" /></GridItem>
      <GridItem title="Health Insights" onClick={() => {}}><Icon name="info" size={20} color="var(--icon-brand-coral)" /></GridItem>
      <GridItem title="Care Plan" onClick={() => {}}><Icon name="check" size={20} color="var(--icon-brand-coral)" /></GridItem>
    </Grid>
  ),
};

export const Clickable: Story = {
  name: 'Test: clickable tile',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Reorder Medicines' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
