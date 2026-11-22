import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '../tokens/tokens.json';
import { Grid, Page, Section, Swatch, type SwatchKind } from './doc-blocks';

const meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primitives: Story = {
  render: () => (
    <Page title="Primitive colors" description="Raw palette from the Figma “Primitives” collection (1mg mode). Use semantic tokens in components; primitives are the source they point to.">
      {tokens.primitives.map((g) => (
        <Section key={g.group} title={g.group.replace(/-/g, ' ')}>
          <Grid min={130}>{g.items.map((t) => <Swatch key={t.var} token={t} />)}</Grid>
        </Section>
      ))}
    </Page>
  ),
};

export const Brand: Story = {
  render: () => (
    <Page title="Brand colors (c-p)" description="Figma colour styles: brown, gold and cream.">
      <Grid min={150}>{tokens.brand.map((t) => <Swatch key={t.var} token={t} />)}</Grid>
    </Page>
  ),
};

const kinds: Record<string, SwatchKind> = { bg: 'fill', text: 'text', icon: 'icon', border: 'border' };
const labels: Record<string, string> = { bg: 'Background', text: 'Text', icon: 'Icon', border: 'Border' };

const semanticStory = (category: keyof typeof tokens.semantic): Story => ({
  name: labels[category],
  render: () => (
    <Page title={`Semantic · ${labels[category]}`} description={`Light-mode “${category}” tokens from the Semantic collection. Each one aliases a primitive (shown with →).`}>
      {tokens.semantic[category].map((g) => (
        <Section key={g.group} title={g.group}>
          <Grid min={170}>{g.items.map((t) => <Swatch key={t.var} token={t} kind={kinds[category]} />)}</Grid>
        </Section>
      ))}
    </Page>
  ),
});

export const SemanticBackground = semanticStory('bg');
export const SemanticText = semanticStory('text');
export const SemanticIcon = semanticStory('icon');
export const SemanticBorder = semanticStory('border');

export const Utility: Story = {
  render: () => (
    <Page title="Utility colors" description="Alpha overlays, HIH health-status colours and category colours.">
      {tokens.utility.map((s) => (
        <Section key={s.section} title={s.section === 'HIH' ? 'HIH status' : s.section}>
          <div style={{ display: 'grid', gap: 20 }}>
            {s.groups.map((g) => (
              <div key={g.group}>
                {s.groups.length > 1 && <h3 style={{ fontSize: 14, margin: '0 0 8px', fontWeight: 500, textTransform: 'capitalize' }}>{g.group}</h3>}
                <Grid min={130}>{g.items.map((t) => <Swatch key={t.var} token={t} />)}</Grid>
              </div>
            ))}
          </div>
        </Section>
      ))}
    </Page>
  ),
};
