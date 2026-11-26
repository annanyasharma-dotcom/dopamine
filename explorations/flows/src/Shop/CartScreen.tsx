import { useState } from 'react';
import { BottomSheet } from '@ds/components/BottomSheet';
import { Button } from '@ds/components/Button';
import { CompoundButton } from '@ds/components/CompoundButton';
import { Divider } from '@ds/components/Divider';
import { Hooman } from '@ds/components/Hooman';
import { Icon } from '@ds/components/Icon';
import { Illustration } from '@ds/components/Illustration';
import { InfoBanner } from '@ds/components/InfoBanner';
import { ListItem } from '@ds/components/ListItem';
import { QuantityDropdown } from '@ds/components/QuantityDropdown';
import { Radio } from '@ds/components/Radio';
import { Toggle } from '@ds/components/Toggle';
import { Widget } from '@ds/components/Widget';
import { PageBar, type ShopApi } from './ShopFlow';
import { byId, COINS, coupons, DELIVERY_FEE, FREE_DELIVERY_ABOVE, inr, packImage, pctOff } from './products';

export function CartScreen({ api, initialSheet = false }: { api: ShopApi; initialSheet?: boolean }) {
  const [sheet, setSheet] = useState(initialSheet);
  const [pick, setPick] = useState(api.coupon?.code ?? coupons[0].code);
  const items = Object.entries(api.cart).map(([id, qty]) => ({ p: byId(id), qty }));

  if (!items.length) {
    return (
      <div className="dp-shop__page">
        <PageBar title="Cart" onBack={api.back} />
        <div className="dp-shop__empty dp-shop__empty--full">
          <Hooman name="delivery-confused" height={200} />
          <h2 className="text-h4-bold">Your cart is empty</h2>
          <p className="text-body-base-regular dp-shop__muted">Add medicines and health products to see them here.</p>
          <Button variant="brand" size="lg" leftIcon={false} rightIcon={false} onClick={() => api.go('home')}>
            Browse products
          </Button>
        </div>
      </div>
    );
  }

  const rxItems = items.filter((i) => i.p.rx);
  const productDiscount = api.mrpTotal - api.subtotal;
  const couponOff = api.coupon ? api.coupon.value(api.subtotal) : 0;
  const delivery = api.subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const coinsOff = api.useCoins ? Math.min(COINS / 10, api.subtotal - couponOff) : 0;
  const toPay = api.subtotal - couponOff - coinsOff + delivery;
  const saved = productDiscount + couponOff + coinsOff;
  const blocked = rxItems.length > 0 && !api.rxUploaded;
  const toFree = FREE_DELIVERY_ABOVE - api.subtotal;

  return (
    <div className="dp-shop__page">
      <PageBar title="Cart" subtitle={`${api.count} item${api.count > 1 ? 's' : ''} · Delivering to Home`} onBack={api.back} />
      <main className="dp-shop__scroll dp-cart">
        <div className="dp-cart__pad">
          <InfoBanner chevron={false}>
            {toFree > 0 ? `Add ${inr(toFree)} more for free delivery` : 'Yay! Free delivery in 30 mins'}
          </InfoBanner>
        </div>

        <Widget title="Items" chevron={false} className="dp-cart__card">
          {items.map(({ p, qty }, i) => (
            <div key={p.id}>
              {i > 0 && <Divider variant="dash" />}
              <div className="dp-cart__item">
                <button type="button" className="dp-cart__thumb" onClick={() => api.openProduct(p.id)} aria-label={`Open ${p.name}`}>
                  <img src={packImage(p)} alt="" width={64} height={64} />
                </button>
                <div className="dp-cart__meta">
                  <p className="text-label-base-bold dp-cart__name">{p.name}</p>
                  <p className="text-caption-base-regular dp-shop__muted">{p.quantity}</p>
                  {p.rx && <p className="text-caption-sm-medium dp-cart__rx">Rx · Prescription required</p>}
                  <div className="dp-cart__price">
                    <span className="text-label-base-bold">{inr(p.price * qty)}</span>
                    {p.mrp > p.price && (
                      <>
                        <s className="text-caption-base-regular dp-shop__muted">{inr(p.mrp * qty)}</s>
                        <span className="text-caption-base-medium dp-shop__save">{pctOff(p)}% off</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="dp-cart__controls">
                  <QuantityDropdown
                    value={qty}
                    aria-label={`Quantity of ${p.name}`}
                    onChange={(n) => api.setQty(p.id, n)}
                  />
                  <button
                    type="button"
                    className="dp-cart__remove text-caption-base-medium"
                    onClick={() => {
                      // Toast first: setQty may replace it with a more important coupon warning.
                      api.toast(`${p.name} removed`, 'white');
                      api.setQty(p.id, 0);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" leftIcon={<Icon name="plus-regular" size={20} color="currentColor" />} rightIcon={false} onClick={() => api.go('home')}>
            Add more items
          </Button>
        </Widget>

        {rxItems.length > 0 && (
          <div className={`dp-cart__rxcard${api.rxUploaded ? ' is-done' : ''}`}>
            <Illustration name="documents" size={48} />
            <div className="dp-cart__rxtext">
              <p className="text-label-base-bold">
                {api.rxUploaded ? 'Prescription uploaded' : `${rxItems.length} item needs a prescription`}
              </p>
              <p className="text-caption-base-regular dp-shop__muted">
                {api.rxUploaded ? 'Our pharmacist will verify it before dispatch' : 'Upload a valid prescription to place the order'}
              </p>
            </div>
            {api.rxUploaded ? (
              <Icon name="check-bold" size={24} color="var(--icon-success-base)" label="Uploaded" />
            ) : (
              <CompoundButton
                label="Upload"
                onClick={() => {
                  api.setRxUploaded(true);
                  api.toast('Prescription uploaded');
                }}
              >
                Prescription
              </CompoundButton>
            )}
          </div>
        )}

        <div className="dp-cart__pad dp-cart__stack">
          <ListItem
            media={<Illustration name={api.coupon ? 'discount-green' : 'discount-blue'} size={44} />}
            title={api.coupon ? `${api.coupon.code} applied` : 'Apply coupon'}
            subtitle={api.coupon ? `You save ${inr(couponOff)} with this coupon` : `${coupons.length} offers available`}
            onClick={() => setSheet(true)}
          />
          <div className="dp-cart__coins">
            <Illustration name="coins" size={40} />
            <div className="dp-cart__rxtext">
              <p className="text-label-base-bold">Use {COINS} coins</p>
              <p className="text-caption-base-regular dp-shop__muted">Save {inr(COINS / 10)} on this order</p>
            </div>
            <Toggle checked={api.useCoins} onChange={(e) => api.setUseCoins(e.target.checked)} aria-label={`Use ${COINS} coins`} />
          </div>
        </div>

        <Widget title="Bill summary" chevron={false} className="dp-cart__card">
          <dl className="dp-cart__bill text-body-sm-regular">
            <div><dt>Item total (MRP)</dt><dd>{inr(api.mrpTotal)}</dd></div>
            {productDiscount > 0 && <div className="is-save"><dt>Product discount</dt><dd>−{inr(productDiscount)}</dd></div>}
            {couponOff > 0 && <div className="is-save"><dt>Coupon ({api.coupon!.code})</dt><dd>−{inr(couponOff)}</dd></div>}
            {coinsOff > 0 && <div className="is-save"><dt>Coins</dt><dd>−{inr(coinsOff)}</dd></div>}
            <div><dt>Delivery fee</dt><dd>{delivery ? inr(delivery) : <span className="dp-shop__save">Free</span>}</dd></div>
          </dl>
          <Divider />
          <div className="dp-cart__total">
            <span className="text-label-lg-bold">To pay</span>
            <span className="text-label-lg-bold">{inr(toPay)}</span>
          </div>
          {saved > 0 && <p className="dp-cart__saved text-label-sm-semibold">You’re saving {inr(saved)} on this order</p>}
        </Widget>
        <div className="dp-shop__tail" />
      </main>

      <div className="dp-shop__bottom">
        <div className="dp-cart__pay">
          <span className="text-h5-bold">{inr(toPay)}</span>
          <span className="text-caption-sm-regular dp-shop__muted">{blocked ? 'Upload prescription to continue' : 'Pay on delivery or online'}</span>
        </div>
        <Button variant="brand" size="lg" leftIcon={false} rightIcon={!blocked} disabled={blocked} className="dp-shop__grow" onClick={api.placeOrder}>
          Place order
        </Button>
      </div>

      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        heading="Apply coupon"
        subheading="One coupon per order"
        secondaryAction={
          api.coupon
            ? { children: 'Remove', leftIcon: false, rightIcon: false, onClick: () => { api.setCoupon(null); setSheet(false); } }
            : { children: 'Cancel', leftIcon: false, rightIcon: false, onClick: () => setSheet(false) }
        }
        primaryAction={{
          children: 'Apply',
          leftIcon: false,
          rightIcon: false,
          disabled: api.subtotal < (coupons.find((c) => c.code === pick)?.minOrder ?? 0),
          onClick: () => {
            const c = coupons.find((x) => x.code === pick)!;
            api.setCoupon(c);
            setSheet(false);
            api.toast(`${c.code} applied. You save ${inr(c.value(api.subtotal))}`);
          },
        }}
      >
        <div className="dp-coupons">
          {coupons.map((c) => {
            const ok = api.subtotal >= c.minOrder;
            return (
              <label key={c.code} className={`dp-coupons__row${ok ? '' : ' is-off'}`}>
                <Radio name="coupon" checked={pick === c.code} disabled={!ok} onChange={() => setPick(c.code)} />
                <span className="dp-coupons__text">
                  <span className="dp-coupons__code text-label-sm-bold">{c.code}</span>
                  <span className="text-label-base-bold">{c.title}</span>
                  <span className="text-caption-base-regular dp-shop__muted">
                    {ok ? `${c.description} · Save ${inr(c.value(api.subtotal))}` : `Add ${inr(c.minOrder - api.subtotal)} more to use this`}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </BottomSheet>
    </div>
  );
}

export function OrderPlacedScreen({ api, items }: { api: ShopApi; items: number }) {
  return (
    <div className="dp-shop__page dp-placed">
      <div className="dp-placed__body">
        <Hooman name="delivery-bike" height={200} />
        <h1 className="text-h2-bold">Order placed</h1>
        <p className="text-body-base-regular dp-shop__muted">
          {items} item{items > 1 ? 's' : ''} on the way to Home, HSR Layout. Arriving in about 30 minutes.
        </p>
        <p className="dp-placed__id text-caption-base-medium">Order #1MG-48213</p>
      </div>
      <div className="dp-shop__bottom dp-shop__bottom--stack">
        <Button variant="brand" size="lg" leftIcon={false} rightIcon={false} className="dp-shop__grow" onClick={() => api.toast('Order tracking isn’t part of this prototype', 'info')}>
          Track order
        </Button>
        <Button variant="outline" size="lg" leftIcon={false} rightIcon={false} className="dp-shop__grow" onClick={() => api.go('home')}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
