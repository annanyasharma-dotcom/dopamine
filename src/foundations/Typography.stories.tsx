import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '../tokens/tokens.json';
import { mono, Page, Section, TokenTable } from './doc-blocks';

const meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const spec = (s: { size: number; lineHeight: number; letterSpacing: number }) => (
  <code style={mono}>
    {s.size}/{s.lineHeight} · {s.letterSpacing}
  </code>
);

export const TypeScale: Story = {
  name: 'Type scale',
  render: () => (
    <Page
      title="Type scale"
      description="Typography variables behind the Figma text styles (library Typography collection), plus the local-only scales body-md, caption-large and caption-md. Mobile values are the default; Desktop values apply from 1024px wide (resize the canvas to see samples switch). Values: size/line-height · letter-spacing, in px."
    >
      <TokenTable
        head={['Token', 'Sample', 'Mobile', 'Desktop']}
        rows={tokens.typography.map((t) => [
          <code style={mono}>{t.var}-*</code>,
          <span
            style={{
              fontSize: `var(${t.var}-size)`,
              lineHeight: `var(${t.var}-line-height)`,
              letterSpacing: `var(${t.var}-letter-spacing)`,
              fontWeight: t.name.startsWith('h') || t.name === 'display' ? 700 : 400,
              whiteSpace: 'nowrap',
            }}
          >
            {t.name.replace('-', ' ')}
          </span>,
          spec(t.mobile),
          spec(t.desktop),
        ])}
      />
    </Page>
  ),
};

const families = [...new Set(tokens.textStyles.map((s) => s.family))];

export const TextStyles: Story = {
  name: 'Text styles',
  render: () => (
    <Page
      title="Text styles"
      description={
        <>
          Figma text styles (all 41), available as CSS classes (e.g. <code style={mono}>.text-h1-bold</code>). Each uses the size, line-height and letter-spacing of the Typography variable it is bound to in Figma, so it switches to the Desktop values from 1024px. The Character callouts styles have fixed values, as in Figma.
        </>
      }
    >
      {families.map((f) => (
        <Section key={f} title={f.replace('-', ' ')}>
          <TokenTable
            head={['Class', 'Sample', 'Weight', 'Size']}
            rows={tokens.textStyles
              .filter((s) => s.family === f)
              .map((s) => [
                <code style={mono}>.{s.className}</code>,
                <span className={s.className} style={{ whiteSpace: 'nowrap' }}>The quick brown fox</span>,
                s.weight,
                <code style={mono}>{s.typeToken ? `--font-${s.typeToken}-size` : s.size}</code>,
              ])}
          />
        </Section>
      ))}
    </Page>
  ),
};
