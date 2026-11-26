import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '@ds/components/Button';
import { CounterBadge } from '@ds/components/CounterBadge';
import { Icon } from '@ds/components/Icon';
import { Toast, type ToastType } from '@ds/components/Toast';
import { SignInFlow, type SignInStep } from '../SignIn/SignInFlow';
import { CartScreen, OrderPlacedScreen } from './CartScreen';
import { HomeScreen } from './HomeScreen';
import { ProductScreen } from './ProductScreen';
import { byId, coupons, inr, type Coupon } from './products';
import './Shop.css';

export type ShopRoute = 'signin' | 'home' | 'product' | 'cart' | 'placed';
export type Cart = Record<string, number>;

export interface ShopApi {
  cart: Cart;
  count: number;
  subtotal: number;
  mrpTotal: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  openProduct: (id: string) => void;
  go: (route: ShopRoute) => void;
  back: () => void;
  toast: (label: string, type?: ToastType) => void;
  coupon: Coupon | null;
  setCoupon: (c: Coupon | null) => void;
  rxUploaded: boolean;
  setRxUploaded: (v: boolean) => void;
  useCoins: boolean;
  setUseCoins: (v: boolean) => void;
  placeOrder: () => void;
}

export interface ShopFlowProps {
  /** Screen to open on. @default 'signin' */
  initialRoute?: ShopRoute;
  /** Sign-in step when starting on sign-in. */
  initialSignInStep?: SignInStep;
  /** Product shown when starting on 'product'. @default 'vitc' */
  initialProduct?: string;
  /** Cart contents to start with: product id → quantity. */
  initialCart?: Cart;
  /** Coupon code applied at start. */
  initialCoupon?: string;
  /** Open the coupon sheet on the cart screen (screen gallery). */
  initialCouponSheet?: boolean;
  initialRxUploaded?: boolean;
}

export function ShopFlow({
  initialRoute = 'signin',
  initialSignInStep,
  initialProduct = 'vitc',
  initialCart = {},
  initialCoupon,
  initialCouponSheet = false,
  initialRxUploaded = false,
}: ShopFlowProps) {
  const [stack, setStack] = useState<ShopRoute[]>([initialRoute]);
  const [productId, setProductId] = useState(initialProduct);
  const [cart, setCart] = useState<Cart>(initialCart);
  const [coupon, setCoupon] = useState<Coupon | null>(coupons.find((c) => c.code === initialCoupon) ?? null);
  const [rxUploaded, setRxUploaded] = useState(initialRxUploaded);
  const [useCoins, setUseCoins] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ label: string; type: ToastType; id: number } | null>(null);
  const [lastOrder, setLastOrder] = useState<{ total: number; items: number } | null>(null);
  const route = stack[stack.length - 1];

  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const go = useCallback((r: ShopRoute) => setStack((s) => (r === 'home' ? ['home'] : [...s, r])), []);
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : ['home'])), []);
  const toast = useCallback((label: string, type: ToastType = 'success') => setToastMsg({ label, type, id: Date.now() }), []);

  const { count, subtotal, mrpTotal } = useMemo(() => {
    let count = 0, subtotal = 0, mrpTotal = 0;
    for (const [id, q] of Object.entries(cart)) {
      const p = byId(id);
      count += q;
      subtotal += p.price * q;
      mrpTotal += p.mrp * q;
    }
    return { count, subtotal, mrpTotal };
  }, [cart]);

  const setQty = (id: string, qty: number) => {
    const next = { ...cart };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    setCart(next);
    // Drop a coupon that no longer qualifies.
    const nextSubtotal = Object.entries(next).reduce((sum, [pid, q]) => sum + byId(pid).price * q, 0);
    if (coupon && nextSubtotal < coupon.minOrder) {
      setCoupon(null);
      if (nextSubtotal > 0) toast(`${coupon.code} removed: order is below ${inr(coupon.minOrder)}`, 'warning');
    }
  };

  const api: ShopApi = {
    cart,
    count,
    subtotal,
    mrpTotal,
    add: (id) => {
      setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      toast(`${byId(id).name} added to cart`);
    },
    setQty,
    openProduct: (id) => {
      setProductId(id);
      go('product');
    },
    go,
    back,
    toast,
    coupon,
    setCoupon,
    rxUploaded,
    setRxUploaded,
    useCoins,
    setUseCoins,
    placeOrder: () => {
      setLastOrder({ total: 0, items: count });
      setCart({});
      setCoupon(null);
      setRxUploaded(false);
      setUseCoins(false);
      setToastMsg(null);
      setStack(['placed']);
    },
  };

  let screen: ReactNode;
  switch (route) {
    case 'signin':
      screen = <SignInFlow initialStep={initialSignInStep} onDone={() => setStack(['home'])} />;
      break;
    case 'home':
      screen = <HomeScreen api={api} />;
      break;
    case 'product':
      screen = <ProductScreen key={productId} api={api} product={byId(productId)} />;
      break;
    case 'cart':
      screen = <CartScreen api={api} initialSheet={initialCouponSheet} />;
      break;
    case 'placed':
      screen = <OrderPlacedScreen api={api} items={lastOrder?.items ?? 3} />;
      break;
  }

  return (
    <div className="dp-shop" data-route={route}>
      {screen}
      {toastMsg && (
        <div className="dp-shop__toast" key={toastMsg.id}>
          <Toast type={toastMsg.type} label={toastMsg.label} onDismiss={() => setToastMsg(null)} />
        </div>
      )}
    </div>
  );
}

/* ---------- Shared pieces ---------- */

/** Inner-page bar (PDP, cart). Figma's `PDP` / `cart` page headers aren't built in Dopamine yet. */
export function PageBar({
  title,
  subtitle,
  onBack,
  cartCount,
  onCartClick,
  onSearchClick,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  onBack: () => void;
  cartCount?: number;
  onCartClick?: () => void;
  onSearchClick?: () => void;
}) {
  return (
    <header className="dp-pagebar">
      <button type="button" className="dp-pagebar__icon" onClick={onBack} aria-label="Back">
        <Icon name="arrow-left-regular" size={24} />
      </button>
      <div className="dp-pagebar__title">
        {title && <h1 className="text-h6-bold">{title}</h1>}
        {subtitle && <p className="text-caption-base-regular">{subtitle}</p>}
      </div>
      {onSearchClick && (
        <button type="button" className="dp-pagebar__icon" onClick={onSearchClick} aria-label="Search">
          <Icon name="search-regular" size={24} />
        </button>
      )}
      {onCartClick && (
        <button
          type="button"
          className="dp-pagebar__icon dp-pagebar__cart"
          onClick={onCartClick}
          aria-label={cartCount ? `Cart, ${cartCount} items` : 'Cart'}
        >
          <BagIcon />
          {!!cartCount && <CounterBadge count={cartCount} aria-hidden="true" className="dp-pagebar__badge" />}
        </button>
      )}
    </header>
  );
}

/** Header's own bag artwork, used as a mask so it takes the icon colour. */
export function BagIcon() {
  return <span className="dp-pagebar__bag" aria-hidden="true" />;
}

/** Sticky "view cart" bar shown on home and PDP once the cart has items. */
export function CartBar({ api }: { api: ShopApi }) {
  if (!api.count) return null;
  return (
    <div className="dp-cartbar">
      <div className="dp-cartbar__summary">
        <span className="text-label-base-bold">
          {api.count} item{api.count > 1 ? 's' : ''} · {inr(api.subtotal)}
        </span>
        {api.mrpTotal > api.subtotal && (
          <span className="text-caption-base-medium dp-shop__save">You save {inr(api.mrpTotal - api.subtotal)}</span>
        )}
      </div>
      <Button variant="brand" size="sm" leftIcon={false} rightIcon onClick={() => api.go('cart')}>
        View cart
      </Button>
    </div>
  );
}

export default ShopFlow;
