/**
 * Icon library registry. Each entry is an original Figma SVG export (unmodified) in ./svg,
 * with its native size from Figma. To add an icon: export the SVG from Figma into ./svg,
 * add an entry here, and document it in docs/MASTER.md.
 */
import bestseller from './svg/bestseller.svg';
import check from './svg/check.svg';
import chevronRight from './svg/chevron-right.svg';
import close from './svg/close.svg';
import closeFilled from './svg/close-filled.svg';
import goodExperience from './svg/good-experience.svg';
import info from './svg/info.svg';
import restart from './svg/restart.svg';
import search from './svg/search.svg';
import star from './svg/star.svg';

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
  'chevron-right': {
    src: chevronRight,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-right (Widget node 40002852:2412, list node 40002852:2423)',
  },
  close: {
    src: close,
    width: 24,
    height: 24,
    defaultColor: '#181a1f', /* Figma Color/Icons/Primary (no token) */
    figma: 'Dismiss Icon (Toast, node 40002646:31676)',
  },
  info: {
    src: info,
    width: 20.5,
    height: 20.5,
    defaultColor: 'var(--icon-brand-primary)', /* Figma #0d0d0d (white toast); toasts recolour it per type */
    figma: 'Information Icon Shapes (Toast › Status Information Icon, drawn at 20.5px inside a 24px box)',
  },
  star: {
    src: star,
    width: 14,
    height: 14,
    defaultColor: 'var(--icon-brand-primary-inverse)', /* Figma white */
    figma: 'rating-star (Rating, node 40002796:2367)',
  },
  'close-filled': {
    src: closeFilled,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'close, bold=false (Bottom Sheet › Close Button, node 40002779:992)',
  },
  restart: {
    src: restart,
    width: 14,
    height: 14,
    defaultColor: 'var(--text-info-base)', /* Figma #1772bb */
    figma: 'Restart (.Tags › State=Previously Bought, node 40002741:3633)',
  },
  'good-experience': {
    src: goodExperience,
    width: 14,
    height: 14,
    defaultColor: 'var(--color-sunrise-glow-200)', /* Figma #6f2305 */
    figma: 'Good experience (.Tags › State=Promoted, node 40002741:3639)',
  },
  search: {
    src: search,
    width: 18,
    height: 18,
    defaultColor: 'var(--icon-brand-coral)', /* Figma #ff5443 */
    figma: 'search (Search, node 40002849:1914)',
  },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];
