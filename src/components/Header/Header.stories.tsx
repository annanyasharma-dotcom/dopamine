import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'App header from the Figma “Header” component (status bar + brand page header). Figma `statusBar` → `statusBar`; the page header’s `profile` and `cart` → `profile`, `cart`. The location pill, profile and cart are real buttons. The cart badge reuses `CounterBadge`.',
      },
    },
  },
  decorators: [(Story) => <div style={{ width: 360, margin: '0 auto', boxShadow: 'var(--shadow-md)' }}><Story /></div>],
  args: {
    statusBar: true,
    locationLabel: 'Office',
    locationAddress: '3rd floor, Motorola Building, Sector 44',
    profile: true,
    cart: true,
    cartCount: 3,
    onLocationClick: fn(),
    onProfileClick: fn(),
    onCartClick: fn(),
  },
  argTypes: {
    statusBar: {
      control: 'boolean',
      description: 'Illustrative phone status bar. Off by default in code — let the OS draw the real one.',
      table: { defaultValue: { summary: 'false' } },
    },
    locationLabel: { control: 'text' },
    locationAddress: { control: 'text' },
    profile: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    cart: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    cartCount: { control: { type: 'number', min: 0 }, description: 'Badge count; hidden at 0.' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Figma Header component. */
export const Playground: Story = {};

/** As it would appear in a real app: no fake status bar. */
export const WithoutStatusBar: Story = { name: 'Without status bar', args: { statusBar: false } };

export const WithoutProfile: Story = { name: 'Without profile', args: { profile: false } };
export const WithoutCart: Story = { name: 'Without cart', args: { cart: false } };
export const EmptyCart: Story = { name: 'Empty cart', args: { cartCount: 0 } };
export const ShortAddress: Story = { name: 'Short address', args: { locationLabel: 'Home', locationAddress: 'Indiranagar' } };
export const NoAddress: Story = { name: 'Label only', args: { locationLabel: 'Select delivery location', locationAddress: undefined } };

/** Each control calls its handler; the cart’s accessible name includes the count. */
export const Interactions: Story = {
  name: 'Test: buttons',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Office/ }));
    await expect(args.onLocationClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Profile' }));
    await expect(args.onProfileClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Cart, 3 items' }));
    await expect(args.onCartClick).toHaveBeenCalledTimes(1);
  },
};

/** The illustrative status bar is hidden from screen readers. */
export const StatusBarHidden: Story = {
  name: 'Test: status bar hidden from screen readers',
  play: async ({ canvas }) => {
    await expect(canvas.queryByText('5:13')).toBeInTheDocument();
    await expect(canvas.getByRole('banner')).not.toHaveAccessibleName(/5:13/);
    await expect(canvas.getByText('5:13').closest('[aria-hidden="true"]')).not.toBeNull();
  },
};
