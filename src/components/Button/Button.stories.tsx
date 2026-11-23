import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

const variants: ButtonVariant[] = ['brand', 'black', 'outline', 'inverse', 'ghost'];
const sizes: ButtonSize[] = ['sm', 'lg'];

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Action button from the Figma “Button” component set. Figma properties map to props as: `type` → `variant`, `size` → `size`, `disabled?` → `disabled`, `leftIcon` / `rightIcon` → `leftIcon` / `rightIcon`, and the text layer → `children`. All native `<button>` attributes are also supported.',
      },
    },
  },
  args: {
    children: 'Button',
    variant: 'brand',
    size: 'sm',
    disabled: false,
    leftIcon: true,
    rightIcon: true,
    onClick: fn(),
  },
  argTypes: {
    children: { control: 'text', description: 'Button label (Figma text layer).' },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual treatment (Figma `type`).',
      table: { defaultValue: { summary: 'brand' } },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'sm = 44px high / 14px text, lg = 56px high / 16px text.',
      table: { defaultValue: { summary: 'sm' } },
    },
    disabled: { control: 'boolean', table: { defaultValue: { summary: 'false' } } },
    leftIcon: {
      control: 'boolean',
      description: '`true` shows the arrow-left icon, `false` hides it, or pass a custom icon node.',
      table: { type: { summary: 'boolean | ReactNode' }, defaultValue: { summary: 'true' } },
    },
    rightIcon: {
      control: 'boolean',
      description: '`true` shows the arrow-right icon, `false` hides it, or pass a custom icon node.',
      table: { type: { summary: 'boolean | ReactNode' }, defaultValue: { summary: 'true' } },
    },
    type: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
      description: 'Native button type.',
      table: { defaultValue: { summary: 'button' } },
    },
    onClick: { description: 'Called with the click event. Not called while disabled.' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Brand: Story = { args: { variant: 'brand' } };
export const Black: Story = { args: { variant: 'black' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Inverse: Story = {
  args: { variant: 'inverse' },
  parameters: { docs: { description: { story: 'White surface with dark text, for use on darker or coloured surfaces.' } } },
  decorators: [(Story) => <div style={{ background: 'var(--bg-brand-primary-inverse)', padding: 'var(--gap-24)', borderRadius: 'var(--radius-lg)' }}><Story /></div>],
};
export const Ghost: Story = { args: { variant: 'ghost' } };

export const Large: Story = { args: { size: 'lg' } };

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole('button', { name: 'Button' });
    await expect(button).toBeDisabled();
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const WithoutIcons: Story = { args: { leftIcon: false, rightIcon: false } };

export const CustomIcon: Story = {
  args: {
    children: 'Add to cart',
    leftIcon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    rightIcon: false,
  },
  argTypes: { leftIcon: { control: false } },
  parameters: { docs: { description: { story: 'A custom icon node drawn with `currentColor` picks up the variant’s icon colour.' } } },
};

export const ClickCallsOnClick: Story = {
  name: 'Click calls onClick',
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Button' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Every Figma variant: 5 types × 2 sizes, plus disabled. */
export const AllVariants: Story = {
  name: 'All variants',
  parameters: { layout: 'padded', controls: { disable: true } },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, max-content)', gap: 'var(--gap-20)', alignItems: 'center', padding: 'var(--gap-20)', background: 'var(--bg-brand-tertiary)', borderRadius: 'var(--radius-lg)' }}>
      {[...variants.map((variant) => ({ variant, disabled: false })), { variant: 'brand' as const, disabled: true }].flatMap(({ variant, disabled }) =>
        sizes.map((size) => (
          <Button key={`${variant}-${size}-${disabled}`} {...args} variant={variant} size={size} disabled={disabled}>
            Button
          </Button>
        )),
      )}
    </div>
  ),
};
