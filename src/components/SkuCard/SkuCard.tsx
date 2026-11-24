import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Icon } from '../Icon';
import './SkuCard.css';

/** Figma `orientation`. Horizontal exists only for the small card. */
export type SkuCardOrientation = 'vertical' | 'horizontal';

export interface SkuCardProps extends Omit<ComponentPropsWithRef<'article'>, 'children'> {
  /** Figma `large`. Large = 132px card with full-width Add bar, ratings and offer (vertical only). @default true */
  large?: boolean;
  /** Figma `orientation`. Ignored when `large` (Figma has no large horizontal card). @default 'vertical' */
  orientation?: SkuCardOrientation;
  /** Figma `added?`. Shows the added state. Set it only after the cart confirms. @default false */
  added?: boolean;
  /** Figma `tag`. Shows the “Bestseller” badge on the image (large only). @default true */
  tag?: boolean;

  /** Product name; clamped to 2 lines. */
  name: ReactNode;
  /** Pack size / variant, e.g. “250gm powder”. */
  quantity?: ReactNode;
  /** Product image URL. Without it the image area is an empty white box, as in Figma. */
  imageSrc?: string;
  /** Alt text for the image. @default '' (decorative; the name is shown as text) */
  imageAlt?: string;
  /** Delivery time, e.g. “30 mins”. Shown with the lightning icon (“Get in …” on the large card). */
  deliveryTime?: ReactNode;
  /** Selling price, e.g. “₹93”. */
  price: ReactNode;
  /** Original price, shown struck through, e.g. “₹100”. */
  mrp?: ReactNode;
  /** Discount text, e.g. “7% off”. */
  discount?: ReactNode;

  /** Rating value, e.g. 4.2 (large only). */
  rating?: number | string;
  /** Rating count, e.g. “(10K+)” (large only). */
  ratingCount?: ReactNode;
  /** Price with the coupon, e.g. “₹75” (large only). */
  offerPrice?: ReactNode;
  /** Text before the code. @default 'Use Code on cart' (large only) */
  offerText?: ReactNode;
  /** Coupon code, e.g. “PILGRIM20” (large only). */
  offerCode?: ReactNode;
  /** Quantity in the cart, shown as “{n} added” on the large card. @default 1 */
  addedQuantity?: number;

  /** Called when Add (large bar or small + button) is pressed while not added. */
  onAdd?: () => void;
  /** Called when the added control (large “1 added” bar or small ✓ button) is pressed. */
  onAddedClick?: () => void;
}

function Delivery({ time, prefix }: { time: ReactNode; prefix?: ReactNode }) {
  return (
    <div className="dp-sku__delivery">
      {prefix && <span className="dp-sku__delivery-prefix">{prefix}</span>}
      <span className="dp-sku__delivery-time">{time}</span>
      <span className="dp-sku__delivery-icon" aria-hidden="true">
        <span className="dp-sku__mask dp-sku__mask--lightning" />
      </span>
    </div>
  );
}

function Pricing({ price, mrp, discount, stacked }: { price: ReactNode; mrp?: ReactNode; discount?: ReactNode; stacked: boolean }) {
  const values = (
    <>
      <span className="dp-sku__price">{price}</span>
      {mrp != null && (
        <s className="dp-sku__mrp">
          <span className="dp-sku__sr-only">Original price </span>
          {mrp}
        </s>
      )}
    </>
  );
  const off = discount != null && <span className="dp-sku__discount">{discount}</span>;
  return stacked ? (
    <div className="dp-sku__pricing dp-sku__pricing--stacked">
      <div className="dp-sku__price-row">{values}</div>
      {off}
    </div>
  ) : (
    <div className="dp-sku__pricing dp-sku__price-row">
      {values}
      {off}
    </div>
  );
}

export function SkuCard({
  large = true,
  orientation = 'vertical',
  added = false,
  tag = true,
  name,
  quantity,
  imageSrc,
  imageAlt = '',
  deliveryTime,
  price,
  mrp,
  discount,
  rating,
  ratingCount,
  offerPrice,
  offerText = 'Use Code on cart',
  offerCode,
  addedQuantity = 1,
  onAdd,
  onAddedClick,
  className,
  ...rest
}: SkuCardProps) {
  const layout = large ? 'large' : orientation === 'horizontal' ? 'horizontal' : 'compact';
  const classes = ['dp-sku', `dp-sku--${layout}`, added && 'dp-sku--added', className].filter(Boolean).join(' ');
  const handleAction = added ? onAddedClick : onAdd;
  const image = imageSrc ? <img className="dp-sku__image" src={imageSrc} alt={imageAlt} /> : null;

  if (layout === 'large') {
    return (
      <article {...rest} className={classes}>
        <div className="dp-sku__media">
          {image}
          {tag && (
            <span className="dp-sku__tag">
              <Icon name="bestseller" />
              Bestseller
            </span>
          )}
        </div>

        <button type="button" className="dp-sku__add-bar" onClick={handleAction}>
          {added ? (
            <>
              <span>{addedQuantity} added</span>
              <span className="dp-sku__added-chevron" aria-hidden="true">
                <span className="dp-sku__mask dp-sku__mask--chevron" />
              </span>
            </>
          ) : (
            'Add'
          )}
        </button>

        <div className="dp-sku__text">
          <p className="dp-sku__name">{name}</p>
          {quantity != null && <p className="dp-sku__quantity">{quantity}</p>}
        </div>

        {rating != null && (
          <div className="dp-sku__rating">
            <span className="dp-sku__rating-badge">
              <span className="dp-sku__sr-only">Rated </span>
              {rating}
              <span className="dp-sku__mask dp-sku__mask--star" aria-hidden="true" />
            </span>
            {ratingCount != null && <span className="dp-sku__rating-count">{ratingCount}</span>}
          </div>
        )}

        <div className="dp-sku__purchase">
          {deliveryTime != null && <Delivery time={deliveryTime} prefix="Get in" />}
          <Pricing price={price} mrp={mrp} discount={discount} stacked={false} />
          {offerPrice != null && (
            <div className="dp-sku__offer">
              <span className="dp-sku__offer-badge">
                {offerPrice}
                <span className="dp-sku__mask dp-sku__mask--offer-chevron" aria-hidden="true" />
              </span>
              <span className="dp-sku__offer-text">
                <span className="dp-sku__offer-label">{offerText}</span>
                {offerCode != null && <span className="dp-sku__offer-code">{offerCode}</span>}
              </span>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article {...rest} className={classes}>
      <div className="dp-sku__content">
        <div className="dp-sku__thumb">{image}</div>
        <div className="dp-sku__details">
          <p className="dp-sku__name">{name}</p>
          {quantity != null && <p className="dp-sku__quantity">{quantity}</p>}
          {deliveryTime != null && <Delivery time={deliveryTime} />}
          <Pricing price={price} mrp={mrp} discount={discount} stacked />
        </div>
        <button type="button" className="dp-sku__add-fab" onClick={handleAction} aria-label={added ? 'Added to cart' : 'Add to cart'}>
          {added ? <Icon name="check" color="var(--icon-brand-primary-inverse)" /> : <span className="dp-sku__mask dp-sku__mask--plus" aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}

export default SkuCard;
