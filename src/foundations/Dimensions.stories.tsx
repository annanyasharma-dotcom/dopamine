import type { Meta, StoryObj } from '@storybook/react-vite';
import tokens from '../tokens/tokens.json';
import { Grid, mono, Page, TokenTable } from './doc-blocks';

const meta = {
  title: 'Foundations/Dimensions',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Label = ({ v, value }: { v: string; value: string }) => (
  <div style={{ display: 'grid', gap: 2, marginTop: 8 }}>
    <code style={mono}>{v}</code>
    <code style={{ ...mono, color: 'var(--text-brand-quartenary)' }}>{value}</code>
  </div>
);

export const Gap: Story = {
  render: () => (
    <Page title="Gap" description="Spacing scale from the Extra collection, for flex/grid gaps and padding.">
      <TokenTable
        head={['Token', 'Value', 'Preview']}
        rows={tokens.gap.map((t) => [
          <code style={mono}>{t.var}</code>,
          `${t.value}px`,
          <div style={{ height: 16, width: `var(${t.var})`, background: 'var(--bg-brand-coral)', borderRadius: 2 }} />,
        ])}
      />
    </Page>
  ),
};

export const Radius: Story = {
  render: () => (
    <Page title="Radius" description="Corner radius tokens.">
      <Grid min={120}>
        {tokens.radius.map((t) => (
          <div key={t.var}>
            <div style={{ height: 80, background: 'var(--bg-brand-tertiary)', border: '1px solid var(--border-neutrals-tertiary)', borderRadius: `var(${t.var})` }} />
            <Label v={t.var} value={`${t.value}px`} />
          </div>
        ))}
      </Grid>
    </Page>
  ),
};

export const Stroke: Story = {
  render: () => (
    <Page title="Stroke" description="Border width tokens.">
      <Grid min={120}>
        {tokens.stroke.map((t) => (
          <div key={t.var}>
            <div style={{ height: 80, borderRadius: 'var(--radius-md)', border: `var(${t.var}) solid var(--border-neutrals-quartenary)`, background: 'var(--bg-brand-secondary)' }} />
            <Label v={t.var} value={`${t.value}px`} />
          </div>
        ))}
      </Grid>
    </Page>
  ),
};

export const Shadows: Story = {
  render: () => (
    <Page title="Shadows" description="Figma effect styles, exposed as --shadow-* variables.">
      <div style={{ background: 'var(--bg-brand-secondary)', padding: 32, borderRadius: 'var(--radius-lg)' }}>
        <Grid min={150}>
          {tokens.shadows.map((t) => (
            <div key={t.var}>
              <div style={{ height: 96, background: 'var(--bg-brand-primary)', borderRadius: 'var(--radius-lg)', boxShadow: `var(${t.var})` }} />
              <Label v={t.var} value={t.value} />
            </div>
          ))}
        </Grid>
      </div>
    </Page>
  ),
};
