import { Accordion } from '@ds/components/Accordion';
import { Badge } from '@ds/components/Badge';
import { Button } from '@ds/components/Button';
import { Divider } from '@ds/components/Divider';
import { Illustration } from '@ds/components/Illustration';
import { InfoBanner } from '@ds/components/InfoBanner';
import { QuantityDropdown } from '@ds/components/QuantityDropdown';
import { Rating } from '@ds/components/Rating';
import { SkuCard } from '@ds/components/SkuCard';
import { SpecialButton } from '@ds/components/SpecialButton';
import { Tag } from '@ds/components/Tag';
import { Widget } from '@ds/components/Widget';
import { skuProps } from './sku';
import { PageBar, type ShopApi } from './ShopFlow';
import { FREE_DELIVERY_ABOVE, inr, packImage, pctOff, products, type Product } from './products';

export function ProductScreen({ api, product: p }: { api: ShopApi; product: Product }) {
  const qty = api.cart[p.id] ?? 0;
  const similar = products.filter((x) => x.id !== p.id && x.category === p.category).slice(0, 3);
  const offer = p.price >= 199 ? Math.round(p.price * 0.8) : null;

  return (
    <div className="dp-shop__page">
      <PageBar
        onBack={api.back}
        onSearchClick={() => api.go('home')}
        cartCount={api.count}
        onCartClick={() => api.go('cart')}
      />
      <main className="dp-shop__scroll">
        <div className="dp-pdp__media">
          {p.tag && <Tag type={p.tag} className="dp-pdp__tag" />}
          <img src={packImage(p)} alt={p.name} width={220} height={220} />
          <div className="dp-pdp__dots" aria-hidden="true">
            <span className="is-on" />
            <span />
            <span />
          </div>
        </div>

        <section className="dp-pdp__info">
          <h1 className="text-h4-bold">{p.name}</h1>
          <p className="text-body-sm-regular dp-shop__muted">{p.quantity}</p>
          <div className="dp-pdp__rating">
            <Rating value={p.rating} type={p.rating >= 4 ? 'good' : 'avg'} />
            <span className="text-caption-base-regular dp-shop__muted">{p.ratingCount.replace(/[()]/g, '')} ratings</span>
          </div>

          <div className="dp-pdp__price">
            <span className="text-h3-bold">{inr(p.price)}</span>
            {p.mrp > p.price && (
              <>
                <s className="text-body-base-regular dp-shop__muted">MRP {inr(p.mrp)}</s>
                <Badge colour="green">{pctOff(p)}% off</Badge>
              </>
            )}
          </div>
          <p className="text-caption-sm-regular dp-shop__muted">Inclusive of all taxes</p>

          {offer && (
            <div className="dp-pdp__offer">
              <span className="text-body-sm-regular">Get it for</span>
              <SpecialButton chevron={false}>{inr(offer)}</SpecialButton>
              <span className="text-body-sm-regular">with code <b>FIRST20</b> on your first order</span>
            </div>
          )}
        </section>

        <div className="dp-pdp__stack">
          {p.rx && (
            <InfoBanner icon={<Illustration name="documents" size={40} />} chevron={false}>
              Prescription required. You can upload it in the cart before placing the order.
            </InfoBanner>
          )}
          <InfoBanner chevron={false}>
            Get it in 30 mins · Free delivery above {inr(FREE_DELIVERY_ABOVE)}
          </InfoBanner>
        </div>

        <div className="dp-pdp__stack">
          <Accordion title="Product highlights" defaultExpanded lines={0}>
            <ul className="dp-pdp__bullets">
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="How to use">{p.howToUse}</Accordion>
          <Accordion title="Safety information">{p.safety}</Accordion>
        </div>

        {similar.length > 0 && (
          <Widget title="You may also like" chevron={false}>
            <div className="dp-shop__list">
              {similar.map((x, i) => (
                <div key={x.id}>
                  {i > 0 && <Divider variant="dash" />}
                  <SkuCard large={false} orientation="horizontal" {...skuProps(api, x)} />
                </div>
              ))}
            </div>
          </Widget>
        )}
        <div className="dp-shop__tail" />
      </main>

      <div className="dp-shop__bottom">
        {qty === 0 ? (
          <Button variant="brand" size="lg" leftIcon={false} rightIcon={false} className="dp-shop__grow" onClick={() => api.add(p.id)}>
            Add to cart
          </Button>
        ) : (
          <>
            <div className="dp-pdp__qty">
              <span className="text-caption-base-regular dp-shop__muted">In cart</span>
              <QuantityDropdown
                value={qty}
                options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                onChange={(n) => {
                  api.setQty(p.id, n);
                  if (n === 0) api.toast('Removed from cart', 'white');
                }}
              />
            </div>
            <Button variant="brand" size="lg" leftIcon={false} rightIcon className="dp-shop__grow" onClick={() => api.go('cart')}>
              Go to cart
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
