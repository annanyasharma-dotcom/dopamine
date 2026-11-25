import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Divider } from './Divider';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '1px separator from the Figma “divider” component set. Figma `style` maps to `variant`: `plain` between sections, `dash` (2px dash, 2px gap) between individual SKUs. Renders an `<hr>`.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 328 }}><Story /></div>],
  args: { variant: 'plain' },
  argTypes: { variant: { control: 'inline-radio', options: ['plain', 'dash'], table: { defaultValue: { summary: 'plain' } } } },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `style=plain`. */
export const Plain: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('separator')).toBeInTheDocument();
  },
};
/** Figma `style=dash`. */
export const Dash: Story = { args: { variant: 'dash' } };

export const BothStyles: Story = {
  name: 'Both styles',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-20)', padding: 'var(--gap-20) 0' }}>
      <Divider />
      <Divider variant="dash" />
    </div>
  ),
};
