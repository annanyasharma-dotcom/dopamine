import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Icon } from './Icon';
import { iconNames, icons } from './icons';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Icon library. Each icon is the original Figma SVG; its colour comes from CSS (`color` prop, ideally a token), so one file serves every colour. Icons are decorative by default; pass `label` when the icon carries meaning on its own.',
      },
    },
  },
  args: { name: 'bestseller' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'number', min: 8, max: 96 }, description: 'Square size in px. Default: the native Figma size.' },
    color: { control: 'color', description: 'Any CSS colour. Default: the icon’s Figma colour.' },
    label: { control: 'text', description: 'Accessible name; omit for decorative icons.' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every icon in the library, at its native size and colour. */
export const Library: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--gap-16)', fontFamily: 'var(--font-family-base)' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-8)', padding: 'var(--gap-16)', border: '1px solid var(--border-neutrals-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'grid', placeItems: 'center', width: 64, height: 64, borderRadius: 'var(--radius-md)', background: name === 'check' ? 'var(--bg-brand-coral)' : 'var(--bg-brand-secondary)' }}>
            <Icon name={name} size={32} />
          </div>
          <strong style={{ fontSize: 13 }}>{name}</strong>
          <code style={{ fontSize: 11, color: 'var(--text-brand-tertiary)' }}>
            {icons[name].width}×{icons[name].height}px
          </code>
        </div>
      ))}
    </div>
  ),
};

const repoNames = iconNames.filter((n) => n.endsWith('-regular'));

/** The Figma Icon repo: every icon in its regular and bold (phone: filled) weight. */
export const IconRepo: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--gap-16)', fontFamily: 'var(--font-family-base)' }}>
      {repoNames.map((regular) => {
        const base = regular.replace(/-regular$/, '');
        // Bold first: `close-filled` is a separate component icon, not the repo's close.
        const heavy = iconNames.find((n) => n === `${base}-bold`) ?? iconNames.find((n) => n === `${base}-filled`)!;
        return (
          <div key={base} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-8)', padding: 'var(--gap-16)', border: '1px solid var(--border-neutrals-secondary)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--gap-16)' }}>
              {[regular, heavy].map((name) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--gap-4)' }}>
                  <div style={{ display: 'grid', placeItems: 'center', width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--bg-brand-secondary)' }}>
                    <Icon name={name} />
                  </div>
                  <code style={{ fontSize: 11, color: 'var(--text-brand-tertiary)' }}>{name.slice(base.length + 1)}</code>
                </div>
              ))}
            </div>
            <strong style={{ fontSize: 13 }}>{base}</strong>
          </div>
        );
      })}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('.dp-icon')).toHaveLength(repoNames.length * 2);
  },
};

export const Bestseller: Story = { args: { name: 'bestseller' } };

export const Check: Story = {
  args: { name: 'check' },
  decorators: [(Story) => <div style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 8, background: 'var(--bg-brand-coral)' }}><Story /></div>],
};

/** The same file in any colour: pass a token through `color`. */
export const Recolour: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--gap-16)' }}>
      <Icon name="check" color="var(--icon-brand-coral)" />
      <Icon name="check" color="var(--icon-success-base)" />
      <Icon name="check" color="var(--icon-brand-primary)" />
      <Icon name="bestseller" size={24} color="var(--icon-brand-coral)" />
    </div>
  ),
};

/** Decorative by default; with `label` it is announced. */
export const Accessible: Story = {
  args: { name: 'check', color: 'var(--icon-success-base)', label: 'Verified' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Verified' })).toBeVisible();
  },
};
