import type { MouseEvent } from 'react';
import type { ShopApi } from './ShopFlow';
import { inr, packImage, pctOff, type Product } from './products';

/** Opens the PDP when the card itself is tapped, but not its Add / added buttons. */
export const cardClick = (api: ShopApi, id: string) => (e: MouseEvent) => {
  if ((e.target as HTMLElement).closest('button')) return;
  api.openProduct(id);
};

export function skuProps(api: ShopApi, p: Product) {
  const qty = api.cart[p.id] ?? 0;
  return {
    name: p.name,
    quantity: p.quantity,
    imageSrc: packImage(p),
    imageAlt: '',
    price: inr(p.price),
    mrp: p.mrp > p.price ? inr(p.mrp) : undefined,
    discount: p.mrp > p.price ? `${pctOff(p)}% off` : undefined,
    added: qty > 0,
    addedQuantity: qty || 1,
    onAdd: () => api.add(p.id),
    onAddedClick: () => api.openProduct(p.id),
    onClick: cardClick(api, p.id),
    className: 'dp-shop__card',
  };
}
