import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Footer } from './Footer';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Brand sign-off footer from the Figma “Footer” component: TATA 1mg logo and “Adding some sunshine to your life” in the brand gradient. Static — keep the logo, wording and gradient as approved; add links or legal text with a separate pattern.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 360, boxShadow: 'var(--shadow-md)' }}><Story /></div>],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('contentinfo')).toHaveTextContent('Adding some sunshine to your life');
    await expect(canvas.getByRole('img', { name: 'TATA 1mg' })).toBeVisible();
  },
};
