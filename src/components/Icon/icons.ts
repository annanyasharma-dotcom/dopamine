/**
 * Icon library registry. Each entry is an original Figma SVG export (unmodified) in ./svg,
 * with its native size from Figma. To add an icon: export the SVG from Figma into ./svg,
 * add an entry here, and document it in docs/MASTER.md.
 */
import bestseller from './svg/bestseller.svg';
import check from './svg/check.svg';

export interface IconDefinition {
  /** URL of the SVG file. */
  src: string;
  /** Native width in px, from Figma. */
  width: number;
  /** Native height in px, from Figma. */
  height: number;
  /** Colour the icon has in Figma (CSS value). Used when no colour is set. */
  defaultColor: string;
  /** Figma source of the icon. */
  figma: string;
}

export const icons = {
  bestseller: {
    src: bestseller,
    width: 14,
    height: 14,
    defaultColor: 'var(--color-sunshine-yellow-300)', /* Figma #722902 */
    figma: 'Bestseller Icon (SKU › Bestseller Badge, node I40002748:2567;40002741:3636)',
  },
  check: {
    src: check,
    width: 24,
    height: 24,
    defaultColor: 'var(--icon-brand-primary-inverse)', /* Figma white */
    figma: 'check (SKU › Add Action Button, node I40002756:2810;40002779:756)',
  },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];
