/**
 * Illustration library registry (Figma icon repo, section node 40002872:9502).
 * Full-colour illustrations drawn on a 120×120 frame. Images are the Figma originals,
 * resized to 3× (360px) for delivery. `usage` is the guidance written in Figma.
 * To add one: export it from Figma into ./images (3× of its frame), add an entry here,
 * and document it in docs/MASTER.md.
 */
import coins from './images/coins.png';
import deliveryBox from './images/delivery-box.png';
import discountBlue from './images/discount-blue.png';
import discountGreen from './images/discount-green.png';
import documents from './images/documents.png';
import labs from './images/labs.png';
import meds from './images/meds.png';
import missingSlot from './images/missing-slot.png';
import phleboBag from './images/phlebo-bag.png';

export interface IllustrationDefinition {
  /** Image URL (for single-image illustrations). Composites are drawn in Illustration.tsx. */
  src?: string;
  /** What it depicts (Figma description, first sentence). */
  description: string;
  /** When to use it (Figma guidance). */
  usage: string;
  /** Figma node id. */
  figma: string;
}

export const illustrations = {
  meds: {
    src: meds,
    description: 'Medicine bottle and blister packs in a paper bag.',
    usage: 'Pharmacy categories, medicine ordering, prescription refills, and medicine order confirmations.',
    figma: '40002872:9480',
  },
  labs: {
    src: labs,
    description: 'Laboratory glassware in an open box.',
    usage: 'Lab-test categories, diagnostic services, health-check packages, and test-booking onboarding or confirmation screens.',
    figma: '40002872:9481',
  },
  coins: {
    src: coins,
    description: 'Gold coin with a rupee symbol.',
    usage: 'Rupee-denominated wallet balances, cashback, rewards, referral credits, and savings summaries. Avoid for non-rupee currencies.',
    figma: '40002872:9482',
  },
  'discount-blue': {
    src: discountBlue,
    description: 'Blue scalloped badge with a percentage symbol.',
    usage: 'Coupons, promotional offers, percentage discounts, and savings banners across pharmacy or diagnostic journeys.',
    figma: '40002872:9483',
  },
  'discount-green': {
    src: discountGreen,
    description: 'Green scalloped badge with a percentage symbol.',
    usage: 'Applied discounts, successful coupon redemption, member savings, and offer confirmations. Pair with explicit text when communicating a success state.',
    figma: '40002872:9484',
  },
  'delivery-box': {
    src: deliveryBox,
    description: 'Sealed cardboard delivery box.',
    usage: 'Order dispatch, shipment tracking, delivery updates, order history, and package-related empty states.',
    figma: '40002872:9485',
  },
  'phlebo-bag': {
    src: phleboBag,
    description: 'Red medical collection bag.',
    usage: 'Home sample collection, phlebotomist visits, collector assignment, appointment preparation, and collection-service information.',
    figma: '40002872:9486',
  },
  'missing-slot': {
    src: missingSlot,
    description: 'Calendar with a warning symbol.',
    usage: 'Unavailable appointment slots, missed bookings, scheduling issues, and prompts to select another date or reschedule. Pair with text explaining the exact issue and next step.',
    figma: '40002872:9487',
  },
  testubes: {
    description: 'Two capped sample tubes containing red liquid.',
    usage: 'Blood tests, diagnostic test details, sample collection instructions, and sample-processing status screens.',
    figma: '40002872:9497',
  },
  documents: {
    src: documents,
    description: 'Folder containing paper documents.',
    usage: 'Medical records, lab reports, prescriptions, document uploads, and report or document empty states.',
    figma: '40002872:9499',
  },
} satisfies Record<string, IllustrationDefinition>;

export type IllustrationName = keyof typeof illustrations;
export const illustrationNames = Object.keys(illustrations) as IllustrationName[];
