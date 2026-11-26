import { useRef, useState } from 'react';
import { Banner } from '@ds/components/Banner';
import { CompoundButton } from '@ds/components/CompoundButton';
import { Divider } from '@ds/components/Divider';
import { Footer } from '@ds/components/Footer';
import { Grid, GridItem } from '@ds/components/Grid';
import { Header } from '@ds/components/Header';
import { Hooman } from '@ds/components/Hooman';
import { Illustration } from '@ds/components/Illustration';
import { InfoBanner } from '@ds/components/InfoBanner';
import { Search } from '@ds/components/Search';
import { SkuCard } from '@ds/components/SkuCard';
import { Widget } from '@ds/components/Widget';
import { CartBar, type ShopApi } from './ShopFlow';
import { inr, products } from './products';
import { skuProps } from './sku';

export function HomeScreen({ api }: { api: ShopApi }) {
  const [query, setQuery] = useState('');
  const bestRef = useRef<HTMLDivElement>(null);
  const q = query.trim().toLowerCase();
  const results = q ? products.filter((p) => `${p.name} ${p.quantity} ${p.category}`.toLowerCase().includes(q)) : [];

  const bestsellers = products.filter((p) => ['paracetamol', 'vitc', 'omega3', 'ors', 'whey'].includes(p.id));
  const essentials = products.filter((p) => ['thermo', 'multivit', 'azithro'].includes(p.id));

  return (
    <div className="dp-shop__page">
      <main className="dp-shop__scroll">
        <Header
          locationLabel="Home"
          locationAddress="HSR Layout, Bengaluru"
          cartCount={api.count}
          onCartClick={() => api.go('cart')}
          onLocationClick={() => api.toast('Address picker isn’t part of this prototype', 'info')}
          onProfileClick={() => api.toast('You’re signed in as +91 98765 43210', 'info')}
        />

        <div className="dp-home__search">
          <Search
            placeholder="Search medicines and more"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {q ? (
          <Widget title={results.length ? `Results for “${query.trim()}”` : 'No matches'} chevron={false}>
            {results.length ? (
              <div className="dp-shop__list">
                {results.map((p, i) => (
                  <div key={p.id}>
                    {i > 0 && <Divider variant="dash" />}
                    <SkuCard large={false} orientation="horizontal" {...skuProps(api, p)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="dp-shop__empty">
                <Hooman name="delivery-confused" height={160} />
                <p className="text-body-base-regular dp-shop__muted">Try “vitamin”, “fever” or “protein”.</p>
              </div>
            )}
          </Widget>
        ) : (
          <>
            <div className="dp-home__shortcuts">
              <Grid className="dp-home__grid">
                <GridItem title="Medicines" onClick={() => api.openProduct('paracetamol')}>
                  <Illustration name="meds" size={40} />
                </GridItem>
                <GridItem title="Lab tests" onClick={() => api.toast('Lab tests aren’t part of this prototype', 'info')}>
                  <Illustration name="labs" size={40} />
                </GridItem>
                <GridItem title="Offers" onClick={() => bestRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                  <Illustration name="discount-blue" size={40} />
                </GridItem>
                <GridItem title="Health records" onClick={() => api.toast('Health records aren’t part of this prototype', 'info')}>
                  <Illustration name="documents" size={40} />
                </GridItem>
                <GridItem title="Wallet" onClick={() => api.toast('You have 120 coins to use at checkout', 'info')}>
                  <Illustration name="coins" size={40} />
                </GridItem>
              </Grid>
            </div>

            <div className="dp-home__rx">
              <div>
                <p className="text-label-base-bold">Have a prescription?</p>
                <p className="text-caption-base-regular dp-shop__muted">Upload it and we’ll add the medicines for you</p>
              </div>
              <CompoundButton label="Upload" onClick={() => api.toast('Prescription received. A pharmacist will call you shortly')}>
                Prescription
              </CompoundButton>
            </div>

            <div className="dp-home__pad">
              <Banner
                colour="brand"
                title="20% off your first order"
                subtitle="Use code FIRST20 at checkout"
                cta="Shop now"
                onCtaClick={() => bestRef.current?.scrollIntoView({ behavior: 'smooth' })}
                image={<Hooman name="pharmacist-with-coupon" height={136} />}
              />
            </div>

            <div className="dp-home__pad">
              <InfoBanner chevron={false}>Medicines delivered in 30 minutes to HSR Layout</InfoBanner>
            </div>

            <div ref={bestRef}>
              <Widget title="Bestsellers" subtitle="Most ordered this week" chevron={false}>
                <div className="dp-shop__rail">
                  {bestsellers.map((p) => (
                    <SkuCard
                      key={p.id}
                      {...skuProps(api, p)}
                      tag={p.tag ?? false}
                      deliveryTime="30 mins"
                      rating={p.rating}
                      ratingCount={p.ratingCount}
                      offerPrice={p.price >= 199 ? inr(p.price * 0.8) : undefined}
                      offerCode={p.price >= 199 ? 'FIRST20' : undefined}
                    />
                  ))}
                </div>
              </Widget>
            </div>

            <Widget title="Health essentials" chevron={false}>
              <div className="dp-shop__list">
                {essentials.map((p, i) => (
                  <div key={p.id}>
                    {i > 0 && <Divider variant="dash" />}
                    <SkuCard large={false} orientation="horizontal" {...skuProps(api, p)} />
                  </div>
                ))}
              </div>
            </Widget>

            <div className="dp-home__pad">
              <Banner
                colour="blue"
                title="Full body checkup at home"
                subtitle="80+ tests, sample collected at home"
                cta="Book now"
                onCtaClick={() => api.toast('Lab booking isn’t part of this prototype', 'info')}
                image={<Hooman name="phlebotomist-home-visit" height={136} />}
              />
            </div>

            <Footer />
          </>
        )}
      </main>
      <CartBar api={api} />
    </div>
  );
}
