import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeColour } from './Badge';

const colours: BadgeColour[] = ['pink', 'mauve', 'yellow', 'red', 'green', 'orange', 'blue', 'turquoise', 'gold'];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Short decorative label from the Figma “Badge” component set (9 colours). Colours are decorative only — none means a status. Figma “turquise” is `turquoise` here. For counts use `CounterBadge`; for product tags use `Tag`.',
      },
    },
  },
  args: { children: 'Label', colour: 'pink' },
  argTypes: {
    children: { control: 'text' },
    colour: { control: 'select', options: colours, table: { defaultValue: { summary: 'pink' } } },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** All 9 Figma colours. */
export const AllColours: Story = {
  name: 'All colours',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-8)', justifyItems: 'start' }}>
      {colours.map((c) => (
        <Badge key={c} colour={c}>
          Label
        </Badge>
      ))}
    </div>
  ),
};
