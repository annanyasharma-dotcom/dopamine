import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Rating badge from the Figma “Rating” component set. `type` is the score band (good / avg / bad); pick it with your product’s banding rules — the component doesn’t infer it from `value`.',
      },
    },
  },
  args: { value: 4.5, type: 'good' },
  argTypes: {
    value: { control: 'text' },
    type: { control: 'inline-radio', options: ['good', 'avg', 'bad'], table: { defaultValue: { summary: 'good' } } },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
/** Figma `type=good`. */
export const Good: Story = { args: { value: 4.5, type: 'good' } };
/** Figma `type=avg`. */
export const Average: Story = { args: { value: 3.5, type: 'avg' } };
/** Figma `type=bad`. */
export const Bad: Story = { args: { value: 2.5, type: 'bad' } };

export const AccessibleText: Story = {
  name: 'Test: accessible text',
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Rated/).parentElement).toHaveTextContent('Rated 4.5');
  },
};

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-20)', justifyItems: 'start' }}>
      <Rating value={4.5} type="good" />
      <Rating value={3.5} type="avg" />
      <Rating value={2.5} type="bad" />
    </div>
  ),
};
