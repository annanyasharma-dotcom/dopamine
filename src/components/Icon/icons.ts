/**
 * Icon library registry. Each entry is an original Figma SVG export (unmodified) in ./svg,
 * with its native size from Figma. The `*-regular` / `*-bold` / `*-filled` entries are the
 * Figma Icon repo (section 40002796:1640); the rest come from individual components. To add an icon: export the SVG from Figma into ./svg,
 * add an entry here, and document it in docs/MASTER.md.
 */
import arrowLeft from './svg/arrow-left.svg';
import bestseller from './svg/bestseller.svg';
import chevronDown from './svg/chevron-down.svg';
import chevronUp from './svg/chevron-up.svg';
import check from './svg/check.svg';
import chevronRight from './svg/chevron-right.svg';
import chevronRightSmall from './svg/chevron-right-small.svg';
import close from './svg/close.svg';
import closeFilled from './svg/close-filled.svg';
import goodExperience from './svg/good-experience.svg';
import info from './svg/info.svg';
import restart from './svg/restart.svg';
import search from './svg/search.svg';
import star from './svg/star.svg';
import upload from './svg/upload.svg';
// Icon repo (Figma section 40002796:1640): every icon in a regular and a bold (or filled) weight.
import arrowUpRegular from './svg/arrow-up-regular.svg';
import arrowUpBold from './svg/arrow-up-bold.svg';
import arrowDownRegular from './svg/arrow-down-regular.svg';
import arrowDownBold from './svg/arrow-down-bold.svg';
import arrowLeftRegular from './svg/arrow-left-regular.svg';
import arrowLeftBold from './svg/arrow-left-bold.svg';
import arrowRightRegular from './svg/arrow-right-regular.svg';
import arrowRightBold from './svg/arrow-right-bold.svg';
import checkRegular from './svg/check-regular.svg';
import checkBold from './svg/check-bold.svg';
import chevronUpRegular from './svg/chevron-up-regular.svg';
import chevronUpBold from './svg/chevron-up-bold.svg';
import chevronDownRegular from './svg/chevron-down-regular.svg';
import chevronDownBold from './svg/chevron-down-bold.svg';
import chevronLeftRegular from './svg/chevron-left-regular.svg';
import chevronLeftBold from './svg/chevron-left-bold.svg';
import chevronRightRegular from './svg/chevron-right-regular.svg';
import chevronRightBold from './svg/chevron-right-bold.svg';
import closeRegular from './svg/close-regular.svg';
import closeBold from './svg/close-bold.svg';
import phoneTelephoneRegular from './svg/phone-telephone-regular.svg';
import phoneTelephoneFilled from './svg/phone-telephone-filled.svg';
import plusRegular from './svg/plus-regular.svg';
import plusBold from './svg/plus-bold.svg';
import searchRegular from './svg/search-regular.svg';
import searchBold from './svg/search-bold.svg';

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
  'arrow-left': {
    src: arrowLeft,
    width: 16,
    height: 16,
    defaultColor: 'var(--icon-brand-primary)', /* Figma #0d0d0d (light chip) */
    figma: 'Leading Arrow Icon (Chip, node 40002646:32582)',
  },
  'chevron-down': {
    src: chevronDown,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-down, bold=false (Accordian rest, node 40002779:962)',
  },
  'chevron-up': {
    src: chevronUp,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron (Accordian expanded, node 40002779:984)',
  },
  'chevron-right-small': {
    src: chevronRightSmall,
    width: 12,
    height: 12,
    defaultColor: 'var(--icon-brand-primary-inverse)', /* Figma white */
    figma: 'chevron-right (special button, node 40002779:834)',
  },
  upload: {
    src: upload,
    width: 20,
    height: 20,
    defaultColor: 'var(--icon-brand-primary-inverse)', /* Figma white */
    figma: 'upload_24dp (compount button, node 40002858:3759)',
  },
  // Icon repo (Figma section 40002796:1640). Named `<icon>-regular` / `<icon>-bold`
  // (`-filled` for phone-telephone) after the Figma variant, so they don't clash with the
  // component-specific icons above, which are drawn differently.
  'arrow-up-regular': {
    src: arrowUpRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-up, bold=false (Icon repo, node 40002796:1657)',
  },
  'arrow-up-bold': {
    src: arrowUpBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-up, bold=true (Icon repo, node 40002796:1659)',
  },
  'arrow-down-regular': {
    src: arrowDownRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-down, bold=false (Icon repo, node 40002796:1652)',
  },
  'arrow-down-bold': {
    src: arrowDownBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-down, bold=true (Icon repo, node 40002796:1654)',
  },
  'arrow-left-regular': {
    src: arrowLeftRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-left, bold=false (Icon repo, node 40002796:1647)',
  },
  'arrow-left-bold': {
    src: arrowLeftBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-left, bold=true (Icon repo, node 40002796:1649)',
  },
  'arrow-right-regular': {
    src: arrowRightRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-right, bold=false (Icon repo, node 40002796:1642)',
  },
  'arrow-right-bold': {
    src: arrowRightBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'arrow-right, bold=true (Icon repo, node 40002796:1644)',
  },
  'check-regular': {
    src: checkRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'check, bold=false (Icon repo, node 40002796:1662)',
  },
  'check-bold': {
    src: checkBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'check, bold=true (Icon repo, node 40002796:1664)',
  },
  'chevron-up-regular': {
    src: chevronUpRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-up, bold=false (Icon repo, node 40002796:1682)',
  },
  'chevron-up-bold': {
    src: chevronUpBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-up, bold=true (Icon repo, node 40002796:1684)',
  },
  'chevron-down-regular': {
    src: chevronDownRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-down, bold=false (Icon repo, node 40002796:1672)',
  },
  'chevron-down-bold': {
    src: chevronDownBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-down, bold=true (Icon repo, node 40002796:1674)',
  },
  'chevron-left-regular': {
    src: chevronLeftRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-left, bold=false (Icon repo, node 40002796:1677)',
  },
  'chevron-left-bold': {
    src: chevronLeftBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-left, bold=true (Icon repo, node 40002796:1679)',
  },
  'chevron-right-regular': {
    src: chevronRightRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-right, bold=false (Icon repo, node 40002796:1667)',
  },
  'chevron-right-bold': {
    src: chevronRightBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'chevron-right, bold=true (Icon repo, node 40002796:1669)',
  },
  'close-regular': {
    src: closeRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'close, bold=false (Icon repo, node 40002796:1687)',
  },
  'close-bold': {
    src: closeBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'close, bold=true (Icon repo, node 40002796:1689)',
  },
  'phone-telephone-regular': {
    src: phoneTelephoneRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'phone-telephone, filled=false (Icon repo, node 40002796:1692)',
  },
  'phone-telephone-filled': {
    src: phoneTelephoneFilled,
    width: 24,
    height: 24,
    defaultColor: 'var(--icon-brand-primary)', /* Figma #0d0d0d fill, black outline */
    figma: 'phone-telephone, filled=true (Icon repo, node 40002796:1694)',
  },
  'plus-regular': {
    src: plusRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'plus, bold=false (Icon repo, node 40002796:1697)',
  },
  'plus-bold': {
    src: plusBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'plus, bold=true (Icon repo, node 40002796:1699)',
  },
  'search-regular': {
    src: searchRegular,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'search, bold=false (Icon repo, node 40002796:1702)',
  },
  'search-bold': {
    src: searchBold,
    width: 24,
    height: 24,
    defaultColor: 'var(--color-base-black)', /* Figma black (raw fill) */
    figma: 'search, bold=true (Icon repo, node 40002796:1704)',
  },
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as IconName[];
