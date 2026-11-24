import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Logo } from './Logo';

const meta = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'TATA 1mg logo from the Figma “TATA 1mg logo” component set (120×40). Figma `colour` and `inverse?` map to the same props.' } },
  },
  args: { colour: 'black', inverse: false },
  argTypes: {
    colour: { control: 'inline-radio', options: ['black', 'brand'], table: { defaultValue: { summary: 'black' } } },
    inverse: { control: 'boolean', description: 'White logo for dark backgrounds.', table: { defaultValue: { summary: 'false' } } },
    label: { control: 'text', table: { defaultValue: { summary: 'TATA 1mg' } } },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

const dark = (Story: () => React.ReactElement) => (
  <div style={{ padding: 'var(--gap-16)', background: 'var(--bg-brand-primary-inverse)', borderRadius: 'var(--radius-md)' }}>
    <Story />
  </div>
);

export const Playground: Story = {};
/** Figma `colour=black, inverse?=false`. */
export const Black: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'TATA 1mg' })).toBeVisible();
  },
};
/** Figma `colour=brand, inverse?=false`. */
export const Brand: Story = { args: { colour: 'brand' } };
/** Figma `colour=brand, inverse?=true`. */
export const Inverse: Story = { args: { colour: 'brand', inverse: true }, decorators: [dark] };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--gap-20)', padding: 'var(--gap-20)', background: 'var(--color-cool-neutral-600)', borderRadius: 'var(--radius-md)' }}>
      <Logo colour="black" />
      <Logo colour="brand" />
      <Logo colour="brand" inverse />
    </div>
  ),
};
