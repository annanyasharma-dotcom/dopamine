import type { TagType } from '@ds/components/Tag';

export type PackKind = 'strip' | 'box' | 'bottle' | 'jar' | 'tube';

export interface Product {
  id: string;
  name: string;
  quantity: string;
  price: number;
  mrp: number;
  rating: number;
  ratingCount: string;
  tag?: TagType | false;
  rx?: boolean;
  pack: PackKind;
  colour: string;
  highlights: string[];
  howToUse: string;
  safety: string;
  category: 'medicine' | 'wellness' | 'device';
}

/** Sample catalogue for the prototype. Names are generic; prices are illustrative. */
export const products: Product[] = [
  {
    id: 'paracetamol',
    name: 'Paracetamol 650 mg Tablet',
    quantity: 'Strip of 15 tablets',
    price: 30,
    mrp: 34,
    rating: 4.5,
    ratingCount: '(12K+)',
    tag: 'bestseller',
    pack: 'strip',
    colour: '#ff5443',
    category: 'medicine',
    highlights: ['Relieves fever and mild to moderate pain', 'Gentle on the stomach when taken after food', 'Starts working in about 30 minutes'],
    howToUse: 'Take one tablet with water, or as advised by your doctor. Keep at least 4 to 6 hours between doses and do not take more than 4 tablets in 24 hours.',
    safety: 'Do not take with other medicines that contain paracetamol. Consult a doctor if you have liver or kidney disease, or if fever lasts more than 3 days.',
  },
  {
    id: 'vitc',
    name: 'Vitamin C 1000 mg Effervescent',
    quantity: 'Tube of 20 tablets, orange',
    price: 249,
    mrp: 299,
    rating: 4.3,
    ratingCount: '(4.1K)',
    tag: 'promoted',
    pack: 'tube',
    colour: '#f58a07',
    category: 'wellness',
    highlights: ['Supports everyday immunity', 'Dissolves in water, orange flavour', 'No added sugar'],
    howToUse: 'Dissolve one tablet in a glass of water (200 ml) and drink once a day, preferably in the morning.',
    safety: 'Not for children under 12. Do not exceed the recommended daily dose. Food supplement, not a substitute for a varied diet.',
  },
  {
    id: 'azithro',
    name: 'Azithromycin 500 mg Tablet',
    quantity: 'Strip of 3 tablets',
    price: 119,
    mrp: 132,
    rating: 4.4,
    ratingCount: '(2.3K)',
    tag: false,
    rx: true,
    pack: 'strip',
    colour: '#2f6fd6',
    category: 'medicine',
    highlights: ['Antibiotic for bacterial infections', 'Usually taken once a day', 'Prescription required'],
    howToUse: 'Take exactly as prescribed by your doctor and finish the full course, even if you feel better.',
    safety: 'Prescription medicine. Tell your doctor about any allergies, heart rhythm problems or other medicines you take.',
  },
  {
    id: 'omega3',
    name: 'Omega-3 Fish Oil 1000 mg',
    quantity: 'Bottle of 60 softgels',
    price: 549,
    mrp: 699,
    rating: 4.2,
    ratingCount: '(6.8K)',
    tag: 'bestseller',
    pack: 'bottle',
    colour: '#0b6fa4',
    category: 'wellness',
    highlights: ['Supports heart and joint health', 'Triple-filtered, no fishy aftertaste', 'One softgel a day'],
    howToUse: 'Take one softgel daily after a meal, or as directed by a healthcare professional.',
    safety: 'Consult a doctor if you are pregnant, nursing or taking blood thinners.',
  },
  {
    id: 'whey',
    name: 'Whey Protein, Chocolate',
    quantity: '1 kg jar',
    price: 1899,
    mrp: 2499,
    rating: 4.1,
    ratingCount: '(3.2K)',
    tag: 'promoted',
    pack: 'jar',
    colour: '#6b3e26',
    category: 'wellness',
    highlights: ['24 g protein per scoop', 'Mixes easily in milk or water', 'Lab tested for purity'],
    howToUse: 'Mix one scoop (33 g) in 200 ml of milk or water. Have it after a workout or between meals.',
    safety: 'Not for children or pregnant women. Store in a cool, dry place and close the lid after use.',
  },
  {
    id: 'ors',
    name: 'ORS Electrolyte Drink, Lemon',
    quantity: 'Pack of 4 × 200 ml',
    price: 116,
    mrp: 128,
    rating: 4.6,
    ratingCount: '(9.4K)',
    tag: 'bestseller',
    pack: 'box',
    colour: '#12a150',
    category: 'wellness',
    highlights: ['Restores fluids and electrolytes', 'Ready to drink, lemon flavour', 'Useful in heat and after exercise'],
    howToUse: 'Drink one pack slowly over 15 to 20 minutes. Shake well before use and consume within 24 hours of opening.',
    safety: 'For diarrhoea in children, follow the advice of a doctor. People on a low-sodium diet should consult a doctor.',
  },
  {
    id: 'thermo',
    name: 'Digital Thermometer',
    quantity: '1 unit',
    price: 199,
    mrp: 350,
    rating: 4.0,
    ratingCount: '(1.9K)',
    tag: false,
    pack: 'box',
    colour: '#864291',
    category: 'device',
    highlights: ['Reading in about 60 seconds', 'Fever beep alert', 'Water-resistant tip'],
    howToUse: 'Place the tip under the tongue or in the armpit and wait for the beep. Clean the tip with alcohol before and after use.',
    safety: 'Keep away from children. Replace the battery when the display dims.',
  },
  {
    id: 'multivit',
    name: 'Multivitamin for Men',
    quantity: 'Bottle of 60 tablets',
    price: 499,
    mrp: 650,
    rating: 4.3,
    ratingCount: '(5.5K)',
    tag: false,
    pack: 'bottle',
    colour: '#156437',
    category: 'wellness',
    highlights: ['25 vitamins and minerals', 'Supports energy and stamina', 'One tablet a day'],
    howToUse: 'Take one tablet daily after breakfast with water.',
    safety: 'Do not exceed the recommended dose. Consult a doctor if you have a medical condition.',
  },
];

export const byId = (id: string) => products.find((p) => p.id === id)!;

export const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const pctOff = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

/* ---------- Pack illustrations (neutral SVG packshots, no brand marks) ---------- */

const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = c(n >> 16), g = c((n >> 8) & 255), b = c(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

function packSvg(kind: PackKind, colour: string): string {
  const dark = shade(colour, -0.18);
  const light = shade(colour, 0.25);
  const shadow = '<ellipse cx="80" cy="146" rx="52" ry="7" fill="#000" opacity=".10"/>';
  const label = (x: number, y: number, w: number, h: number) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fff"/><rect x="${x + 8}" y="${y + 9}" width="${w * 0.55}" height="6" rx="3" fill="${colour}"/><rect x="${x + 8}" y="${y + 21}" width="${w * 0.75}" height="4" rx="2" fill="#c4c4c4"/><rect x="${x + 8}" y="${y + 30}" width="${w * 0.4}" height="4" rx="2" fill="#dbdbdb"/>`;
  let body = '';
  switch (kind) {
    case 'strip': {
      let pills = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) pills += `<circle cx="${42 + c * 26}" cy="${58 + r * 26}" r="9" fill="#fff" stroke="#c9ced6" stroke-width="2"/>`;
      body = `<g transform="rotate(-8 80 85)"><rect x="24" y="34" width="112" height="100" rx="10" fill="#e3e7ec"/><rect x="24" y="34" width="112" height="16" rx="8" fill="${colour}"/><rect x="24" y="42" width="112" height="8" fill="${colour}"/>${pills}<rect x="24" y="34" width="112" height="100" rx="10" fill="none" stroke="#c9ced6" stroke-width="2"/></g>`;
      break;
    }
    case 'box':
      body = `<path d="M38 40 L58 26 L132 26 L112 40 Z" fill="${light}"/><path d="M112 40 L132 26 L132 128 L112 142 Z" fill="${dark}"/><rect x="38" y="40" width="74" height="102" fill="${colour}"/>${label(44, 70, 62, 40)}`;
      break;
    case 'bottle':
      body = `<rect x="62" y="18" width="36" height="20" rx="4" fill="${dark}"/><rect x="66" y="36" width="28" height="8" fill="${shade(colour, -0.3)}"/><rect x="44" y="42" width="72" height="100" rx="16" fill="${colour}"/><rect x="50" y="48" width="8" height="84" rx="4" fill="#fff" opacity=".25"/>${label(52, 72, 56, 42)}`;
      break;
    case 'jar':
      body = `<rect x="34" y="30" width="92" height="22" rx="6" fill="${dark}"/><rect x="30" y="50" width="100" height="92" rx="14" fill="${colour}"/><rect x="38" y="56" width="8" height="78" rx="4" fill="#fff" opacity=".2"/>${label(46, 72, 68, 44)}`;
      break;
    case 'tube':
      body = `<rect x="58" y="16" width="44" height="18" rx="5" fill="#fff" stroke="#dbdbdb" stroke-width="2"/><rect x="56" y="32" width="48" height="110" rx="10" fill="${colour}"/><rect x="62" y="38" width="7" height="98" rx="3.5" fill="#fff" opacity=".3"/><rect x="62" y="64" width="36" height="40" rx="4" fill="#fff"/><circle cx="80" cy="78" r="7" fill="${light}"/><rect x="68" y="92" width="24" height="4" rx="2" fill="#c4c4c4"/>`;
      break;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">${shadow}${body}</svg>`;
}

const cache = new Map<string, string>();
export const packImage = (p: Product) => {
  if (!cache.has(p.id)) cache.set(p.id, `data:image/svg+xml;utf8,${encodeURIComponent(packSvg(p.pack, p.colour))}`);
  return cache.get(p.id)!;
};

/* ---------- Coupons ---------- */

export interface Coupon {
  code: string;
  title: string;
  description: string;
  minOrder: number;
  value: (subtotal: number) => number;
}

export const coupons: Coupon[] = [
  {
    code: 'FIRST20',
    title: '20% off your first order',
    description: 'Up to ₹150 off on orders above ₹199',
    minOrder: 199,
    value: (s) => Math.min(Math.round(s * 0.2), 150),
  },
  {
    code: 'HEALTH50',
    title: 'Flat ₹50 off',
    description: 'On orders above ₹499',
    minOrder: 499,
    value: () => 50,
  },
];

export const FREE_DELIVERY_ABOVE = 299;
export const DELIVERY_FEE = 49;
export const COINS = 120; // 1 coin = ₹0.10
