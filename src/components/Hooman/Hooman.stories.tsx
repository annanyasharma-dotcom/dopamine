import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Hooman } from './Hooman';
import { hoomanCharacters, hoomanNames, hoomans, type HoomanCharacter } from './hoomans';

const characterLabels: Record<HoomanCharacter, string> = {
  delivery: 'Delivery partner',
  doctor: 'Doctor',
  pharmacist: 'Pharmacist',
  phlebotomist: 'Phlebotomist',
};

const meta = {
  title: 'Components/Hooman',
  component: Hooman,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'TATA 1mg character illustrations (“hoomans”) from the Figma page “3d icons”: delivery partner, doctor, pharmacist and phlebotomist. Each pose comes with its usage guidance from Figma — see the character stories. They are supporting imagery: decorative by default, always paired with copy that states the real status, offer or action. For small object illustrations use `Illustration`.',
      },
    },
  },
  args: { name: 'delivery-with-box', height: 240 },
  argTypes: {
    name: { control: 'select', options: hoomanNames },
    height: { control: { type: 'number', min: 40, max: 600 }, table: { defaultValue: { summary: '240' } } },
    label: { control: 'text', description: 'Accessible name; omit for decorative use.' },
  },
} satisfies Meta<typeof Hooman>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function CharacterLibrary({ character }: { character: HoomanCharacter }) {
  const names = hoomanNames.filter((n) => hoomans[n].character === character);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap-16)', fontFamily: 'var(--font-family-base)' }}>
      {names.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)', padding: 'var(--gap-16)', border: '1px solid var(--border-neutrals-secondary)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'grid', placeItems: 'center', height: 200, borderRadius: 'var(--radius-md)', background: 'var(--bg-brand-secondary)' }}>
            <Hooman name={name} height={180} style={{ maxWidth: '100%' }} />
          </div>
          <code style={{ fontSize: 13, fontWeight: 700 }}>{name}</code>
          <span style={{ fontSize: 13, color: 'var(--text-brand-tertiary)' }}>{hoomans[name].description}</span>
          <span style={{ fontSize: 13, lineHeight: '18px' }}>
            <strong>Use for:</strong> {hoomans[name].usage}
          </span>
        </div>
      ))}
    </div>
  );
}

const library = (character: HoomanCharacter): Story => ({
  name: characterLabels[character],
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => <CharacterLibrary character={character} />,
});

/** Every delivery-partner pose with its Figma usage guidance. */
export const Delivery = library('delivery');
/** Every doctor pose with its Figma usage guidance. */
export const Doctor = library('doctor');
/** Every pharmacist pose with its Figma usage guidance. */
export const Pharmacist = library('pharmacist');
/** Every phlebotomist pose with its Figma usage guidance. */
export const Phlebotomist = library('phlebotomist');

/** All 22 hoomans at a glance. */
export const Overview: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-24)', fontFamily: 'var(--font-family-base)' }}>
      {hoomanCharacters.map((c) => (
        <div key={c} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)' }}>
          <strong style={{ fontSize: 15 }}>{characterLabels[c]}</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--gap-16)' }}>
            {hoomanNames
              .filter((n) => hoomans[n].character === c)
              .map((n) => (
                <Hooman key={n} name={n} height={120} title={n} />
              ))}
          </div>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('.dp-hooman')).toHaveLength(hoomanNames.length);
  },
};

/** The same hooman at different heights; the width follows the aspect ratio. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--gap-24)' }}>
      {[80, 120, 180, 240].map((h) => (
        <Hooman key={h} name="delivery-bike-side" height={h} />
      ))}
    </div>
  ),
};

export const Accessible: Story = {
  name: 'Test: accessible label',
  args: { name: 'delivery-bike-side', label: 'Order out for delivery' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Order out for delivery' })).toBeVisible();
  },
};
