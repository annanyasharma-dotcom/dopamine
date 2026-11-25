import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Illustration } from './Illustration';
import { illustrationNames, illustrations } from './illustrations';

const meta = {
  title: 'Components/Illustration',
  component: Illustration,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Full-colour illustrations from the Figma icon repo (120×120 frame). Each comes with its usage guidance from Figma — see the **Library** story. Decorative by default; pass `label` when the illustration carries meaning on its own. For one-colour UI icons use `Icon`.',
      },
    },
  },
  args: { name: 'meds', size: 120 },
  argTypes: {
    name: { control: 'select', options: illustrationNames },
    size: { control: { type: 'number', min: 24, max: 240 }, table: { defaultValue: { summary: '120' } } },
    label: { control: 'text', description: 'Accessible name; omit for decorative use.' },
  },
} satisfies Meta<typeof Illustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Every illustration with its Figma usage guidance. */
export const Library: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap-16)', fontFamily: 'var(--font-family-base)' }}>
      {illustrationNames.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)', padding: 'var(--gap-16)', border: '1px solid var(--border-neutrals-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'grid', placeItems: 'center', height: 150, borderRadius: 'var(--radius-md)', background: 'var(--bg-brand-secondary)' }}>
            <Illustration name={name} />
          </div>
          <code style={{ fontSize: 13, fontWeight: 700 }}>{name}</code>
          <span style={{ fontSize: 13, color: 'var(--text-brand-tertiary)' }}>{illustrations[name].description}</span>
          <span style={{ fontSize: 13, lineHeight: '18px' }}>
            <strong>Use for:</strong> {illustrations[name].usage}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** The same illustration at different sizes. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--gap-24)' }}>
      {[40, 64, 120, 180].map((s) => (
        <Illustration key={s} name="testubes" size={s} />
      ))}
    </div>
  ),
};

export const Accessible: Story = {
  name: 'Test: accessible label',
  args: { name: 'delivery-box', label: 'Order shipped' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Order shipped' })).toBeVisible();
  },
};
