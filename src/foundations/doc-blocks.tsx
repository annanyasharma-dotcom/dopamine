import type { CSSProperties, ReactNode } from 'react';

export const mono: CSSProperties = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };

export function Page({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-family-base)', color: 'var(--text-brand-primary)', padding: 32, maxWidth: 1200 }}>
      <h1 style={{ fontSize: 32, lineHeight: '40px', margin: '0 0 8px', fontWeight: 700 }}>{title}</h1>
      {description && <p style={{ margin: '0 0 32px', color: 'var(--text-brand-tertiary)', fontSize: 14, lineHeight: '20px', maxWidth: 720 }}>{description}</p>}
      <div style={{ display: 'grid', gap: 40 }}>{children}</div>
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 18, lineHeight: '24px', margin: '0 0 4px', fontWeight: 600, textTransform: 'capitalize' }}>{title}</h2>
      {note && <p style={{ margin: '0 0 12px', color: 'var(--text-brand-tertiary)', fontSize: 13 }}>{note}</p>}
      <div style={{ marginTop: note ? 0 : 12 }}>{children}</div>
    </section>
  );
}

export function Grid({ min = 150, children }: { min?: number; children: ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 16 }}>{children}</div>;
}

const checker: CSSProperties = {
  backgroundImage:
    'linear-gradient(45deg,#e5e5e5 25%,transparent 25%),linear-gradient(-45deg,#e5e5e5 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#e5e5e5 75%),linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)',
  backgroundSize: '12px 12px',
  backgroundPosition: '0 0,0 6px,6px -6px,-6px 0',
};

export type ColorToken = { name: string; var: string; value: string; alias?: string | null };
export type SwatchKind = 'fill' | 'text' | 'icon' | 'border';

export function Swatch({ token, kind = 'fill' }: { token: ColorToken; kind?: SwatchKind }) {
  const color = `var(${token.var})`;
  const inverse = token.name.includes('inverse');
  const isAlpha = token.value?.startsWith('rgba');
  const stageBg = inverse ? 'var(--color-cool-neutral-900)' : 'var(--color-base-white)';

  let preview: ReactNode;
  if (kind === 'text') preview = <span style={{ color, fontSize: 28, fontWeight: 600 }}>Aa</span>;
  else if (kind === 'icon') preview = <span style={{ width: 28, height: 28, borderRadius: 999, background: color, display: 'block' }} />;
  else if (kind === 'border') preview = <span style={{ width: 56, height: 36, borderRadius: 8, border: `2px solid ${color}`, display: 'block' }} />;

  return (
    <div style={{ border: '1px solid var(--border-neutrals-secondary)', borderRadius: 12, overflow: 'hidden', background: 'var(--color-base-white)' }}>
      <div style={{ height: 72, position: 'relative', ...(isAlpha ? checker : {}) }}>
        {kind === 'fill' ? (
          <div style={{ position: 'absolute', inset: 0, background: color }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: stageBg, display: 'grid', placeItems: 'center' }}>{preview}</div>
        )}
      </div>
      <div style={{ padding: '8px 10px', display: 'grid', gap: 2 }}>
        <strong style={{ fontSize: 13 }}>{token.name}</strong>
        <code style={{ ...mono, color: 'var(--text-brand-secondary)', wordBreak: 'break-all' }}>{token.var}</code>
        <code style={{ ...mono, color: 'var(--text-brand-quartenary)' }}>{token.value}</code>
        {token.alias && <code style={{ ...mono, color: 'var(--text-info-base)' }}>→ {token.alias}</code>}
      </div>
    </div>
  );
}

export function TokenTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  const cell: CSSProperties = { padding: '10px 12px', borderBottom: '1px solid var(--border-neutrals-primary)', textAlign: 'left', verticalAlign: 'middle' };
  return (
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
      <thead>
        <tr>{head.map((h) => <th key={h} style={{ ...cell, color: 'var(--text-brand-tertiary)', fontWeight: 500, borderBottomColor: 'var(--border-neutrals-secondary)' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((c, j) => <td key={j} style={cell}>{c}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
