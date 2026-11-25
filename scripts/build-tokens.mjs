// Converts the Figma exports in src/tokens into:
//   src/tokens/tokens.css   – CSS custom properties + text-style classes
//   src/tokens/tokens.json  – flattened data the Storybook foundation pages render
// Run: npm run tokens
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/tokens');
const variables = JSON.parse(readFileSync(join(dir, 'figma-variables.json'), 'utf8'));
const stylesCss = readFileSync(join(dir, 'figma-styles.css'), 'utf8');

// Each array entry is { CollectionName: { modes: { ModeName: tree } } }
const collection = (name) => variables.find((c) => c[name])?.[name].modes;
const isToken = (n) => n && typeof n === 'object' && '$value' in n;
const round = (n) => Math.round(n * 100) / 100;
const px = (n) => `${round(n)}px`;

/** Walk a token tree → [{ path: string[], token }] */
function flatten(tree, path = []) {
  return Object.entries(tree).flatMap(([k, v]) =>
    isToken(v) ? [{ path: [...path, k], token: v }] : flatten(v, [...path, k]),
  );
}

const cssVar = (path) => `--${path.join('-')}`;
const groupBy = (items, key) => {
  const out = [];
  for (const it of items) {
    const g = key(it);
    let bucket = out.find((b) => b.group === g);
    if (!bucket) out.push((bucket = { group: g, items: [] }));
    bucket.items.push(it);
  }
  return out;
};

// ---- Primitives (colors) ------------------------------------------------
const primitiveValues = {};
const primitives = flatten(Object.values(collection('Primitives'))[0]).map(({ path, token }) => {
  primitiveValues[path.join('.')] = token.$value;
  return { group: path[1], name: path.at(-1), var: cssVar(path), value: token.$value };
});
// Semantic tokens can also alias raw Utility values (e.g. text/brand/secondary-inverse → alpha/white/90).
for (const { path, token } of flatten(collection('Utility').Value)) {
  if (!String(token.$value).startsWith('{')) primitiveValues[path.join('.')] = token.$value;
}

/** "{color.cool-neutral.900}" → { var(--color-cool-neutral-900), #0d0d0d, alias } */
function resolve(value) {
  const m = typeof value === 'string' && value.match(/^\{(.+)\}$/);
  if (!m) return { css: value, value, alias: null };
  return { css: `var(${cssVar(m[1].split('.'))})`, value: primitiveValues[m[1]], alias: m[1].replace(/^color\./, '') };
}

// ---- Semantic (Light) ---------------------------------------------------
const semanticTree = collection('Semantic').Light;
const semantic = {};
for (const [category, tree] of Object.entries(semanticTree)) {
  const items = flatten(tree, [category]).map(({ path, token }) => {
    const r = resolve(token.$value);
    return { group: path[1], name: path.slice(2).join('-'), var: cssVar(path), css: r.css, value: r.value, alias: r.alias };
  });
  semantic[category] = groupBy(items, (i) => i.group);
}

// ---- Utility ------------------------------------------------------------
const utilityTree = collection('Utility').Value;
const utilityItems = flatten(utilityTree).map(({ path, token }) => {
  const r = resolve(token.$value);
  return { section: path[0], group: path.length > 2 ? path[1] : path[0], name: path.at(-1), var: cssVar(path.map((p) => p.toLowerCase())), css: r.css, value: r.value, alias: r.alias };
});
const utility = groupBy(utilityItems, (i) => i.section).map((s) => ({ section: s.group, groups: groupBy(s.items, (i) => i.group) }));

// ---- Extra: radius / stroke / gap ---------------------------------------
const extra = collection('Extra')['Mode 1'];
const dimension = (key) =>
  flatten(extra[key], [key])
    .map(({ path, token }) => ({ name: path.at(-1), var: cssVar(path), value: token.$value }))
    .sort((a, b) => a.value - b.value);
const radius = dimension('radius');
const stroke = dimension('stroke');
const gap = dimension('gap');

// ---- Typography (Mobile default, Desktop ≥1024px) -----------------------
const typo = collection('Typography');
const typeRows = flatten(typo.Mobile).map(({ path }) => path.slice(0, -1).join('-'));
const typeNames = [...new Set(typeRows)];
const typeValue = (mode, name, prop) => {
  const path = [...name.split('-'), prop];
  // body-md etc. are nested; display/h1 are flat
  let node = typo[mode];
  for (const p of path) node = node?.[p];
  return node?.$value;
};
const typography = typeNames.map((name) => ({
  name,
  var: `--font-${name}`,
  mobile: { size: typeValue('Mobile', name, 'size'), lineHeight: typeValue('Mobile', name, 'line-height'), letterSpacing: round(typeValue('Mobile', name, 'letter-spacing')) },
  desktop: { size: typeValue('Desktop', name, 'size'), lineHeight: typeValue('Desktop', name, 'line-height'), letterSpacing: round(typeValue('Desktop', name, 'letter-spacing')) },
}));

// ---- Pasted styles: brand colors, text styles, shadows -------------------
const decls = [...stylesCss.matchAll(/^\s*(--[\w-]+):\s*(.+?);\s*$/gm)].map(([, name, value]) => ({ name, value: value.trim() }));
const brand = decls.filter((d) => d.name.startsWith('--c-p--')).map((d) => ({ name: d.name.slice(7), var: d.name, value: d.value }));

const weights = { regular: 400, medium: 500, semibold: 600, bold: 700 };
// Text styles that line up with a Typography variable get its responsive size/line-height/letter-spacing.
const styleToType = { display: 'display', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6', 'body-base': 'body-md', 'body-sm': 'body-sm', 'caption-base': 'caption-md', 'caption-sm': 'caption-sm' };
const textStyles = decls
  .filter((d) => /--(regular|medium|semibold|bold)$/.test(d.name) && d.value.endsWith('px'))
  .map((d) => {
    const [family, weight] = d.name.slice(2).split('--');
    const type = styleToType[family];
    return {
      name: `${family}/${weight}`,
      className: `text-${family}-${weight}`,
      family,
      weight: weights[weight],
      size: d.value,
      typeToken: type ?? null,
    };
  });

const effectNames = ['xs', 's', 'md', 'lg', 'xl', 'xxl'];
const shadows = decls
  .filter((d) => effectNames.includes(d.name.slice(2)))
  .map((d) => ({ name: d.name.slice(2), var: `--shadow-${d.name.slice(2)}`, value: d.value.replace(/8\.800000190734863px/, '8.8px') }));

// ---- Emit CSS -----------------------------------------------------------
const line = (v, val) => `  ${v}: ${val};`;
const typeVars = (mode) =>
  typography.flatMap((t) => [
    line(`${t.var}-size`, px(t[mode].size)),
    line(`${t.var}-line-height`, px(t[mode].lineHeight)),
    line(`${t.var}-letter-spacing`, px(t[mode].letterSpacing)),
  ]);

const css = `/* AUTO-GENERATED by scripts/build-tokens.mjs — do not edit by hand. */

:root {
  --font-family-base: 'Figtree', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  /* Primitives */
${primitives.map((p) => line(p.var, p.value)).join('\n')}

  /* Brand (c-p) */
${brand.map((b) => line(b.var, b.value)).join('\n')}

  /* Semantic — Light */
${Object.values(semantic).flat().flatMap((g) => g.items).map((i) => line(i.var, i.css)).join('\n')}

  /* Utility */
${utilityItems.map((i) => line(i.var, i.css)).join('\n')}

  /* Radius */
${radius.map((r) => line(r.var, px(r.value))).join('\n')}

  /* Stroke */
${stroke.map((s) => line(s.var, px(s.value))).join('\n')}

  /* Gap */
${gap.map((g) => line(g.var, px(g.value))).join('\n')}

  /* Shadows */
${shadows.map((s) => line(s.var, s.value)).join('\n')}

  /* Typography — Mobile */
${typeVars('mobile').join('\n')}
}

/* Typography — Desktop */
@media (min-width: 1024px) {
  :root {
${typeVars('desktop').map((l) => '  ' + l).join('\n')}
  }
}

/* Text styles */
${textStyles
  .map((s) => {
    const t = s.typeToken && `--font-${s.typeToken}`;
    return `.${s.className} {
  font-family: var(--font-family-base);
  font-weight: ${s.weight};
  font-size: ${t ? `var(${t}-size)` : s.size};${t ? `\n  line-height: var(${t}-line-height);\n  letter-spacing: var(${t}-letter-spacing);` : ''}
}`;
  })
  .join('\n')}
`;

writeFileSync(join(dir, 'tokens.css'), css);
writeFileSync(
  join(dir, 'tokens.json'),
  JSON.stringify({ primitives: groupBy(primitives, (p) => p.group), brand, semantic, utility, radius, stroke, gap, shadows, typography, textStyles }, null, 2),
);
console.log(`tokens: ${primitives.length} primitives, ${brand.length} brand, ${Object.values(semantic).flat().flatMap((g) => g.items).length} semantic, ${utilityItems.length} utility, ${typography.length} type scales, ${textStyles.length} text styles, ${shadows.length} shadows`);
