'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash,
  Plus,
  Minus,
  BookOpen,
  Headphones,
  Book,
  ArrowRight,
  SpinnerGap,
  ShieldCheck,
  CreditCard,
  Wallet,
  Tag
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import {
  getCheckoutItems,
  updateCartItemQuantity as updateCartQuantity,
  removeFromCart as removeCartItem,
  type OrderItem
} from '@/lib/data';

// CartItem type matches OrderItem from data layer
type CartItem = OrderItem;

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Load cart items from data layer
  const loadCartItems = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const items = await getCheckoutItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Load cart when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadCartItems();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, loadCartItems]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
    }
  }, [user, authLoading, router]);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'AUDIOBOOK':
        return Headphones;
      case 'EBOOK':
        return BookOpen;
      default:
        return Book;
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    
    // Optimistic update
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Persist to data layer
    const success = await updateCartQuantity(id, newQuantity);
    if (!success) {
      // Revert on failure
      setCartItems(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - delta }
            : item
        )
      );
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = cartItems.find(i => i.id === id);
    
    // Optimistic update
    setCartItems(prev => prev.filter(item => item.id !== id));
    
    // Persist to data layer
    const success = await removeCartItem(id);
    if (success) {
      toast.success('Item removed from cart');
    } else {
      // Revert on failure
      if (itemToRemove) {
        setCartItems(prev => [...prev, itemToRemove]);
      }
      toast.error('Failed to remove item');
    }
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true);
      toast.success('Promo code applied!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const proceedToCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-accent-yellow/20">
              <ShoppingCart weight="duotone" className="h-8 w-8 text-accent-yellow" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-ink-900">Shopping Cart</h1>
              <p className="text-ink-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-parchment-200 shadow-card">
              <ShoppingCart weight="duotone" className="h-20 w-20 text-parchment-300 mx-auto mb-6" />
              <h2 className="font-serif text-2xl font-bold text-ink-900 mb-2">Your cart is empty</h2>
              <p className="text-ink-600 mb-8">Discover amazing books from independent authors</p>
              <Link href="/bookstore">
                <Button className="btn-accent">
                  Browse Bookstore
                  <ArrowRight weight="bold" className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {cartItems.map((item, index) => {
                  const FormatIcon = getFormatIcon(item.format);
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6 flex gap-6"
                      style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                        transition: `all 0.5s ease ${index * 100}ms`
                      }}
                    >
                      {/* Cover */}
                      <Link href={`/bookstore/${item.bookId}`}>
                        <div className={`w-20 h-28 rounded-xl bg-gradient-to-br ${item.coverGradient} flex items-center justify-center flex-shrink-0`}>
                          <BookOpen weight="duotone" className="h-8 w-8 text-white/30" />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/bookstore/${item.bookId}`}>
                          <h3 className="font-serif text-lg font-semibold text-ink-900 hover:text-emerald-600 transition-colors">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-ink-500 text-sm mb-2">{item.author}</p>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-parchment-100 rounded-lg text-xs text-ink-600">
                            <FormatIcon weight="duotone" className="h-3.5 w-3.5" />
                            {item.format}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-1.5 rounded-lg border border-parchment-200 text-ink-600 hover:bg-parchment-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-ink-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1.5 rounded-lg border border-parchment-200 text-ink-600 hover:bg-parchment-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-serif text-xl font-semibold text-ink-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-xl text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
                      >
                        <Trash weight="bold" className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}

                {/* Continue Shopping */}
                <Link
                  href="/bookstore"
                  className="block text-center py-4 text-ink-600 hover:text-ink-900 font-medium"
                >
                  ← Continue Shopping
                </Link>
              </div>

              {/* Order Summary */}
              <div className="lg:w-96">
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6 sticky top-24">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Order Summary</h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ink-700 mb-2">Promo Code</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          disabled={promoApplied}
                          className="input pl-9 w-full"
                        />
                      </div>
                      <Button
                        onClick={applyPromo}
                        disabled={promoApplied || !promoCode}
                        className="btn-secondary"
                      >
                        {promoApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {promoApplied && (
                      <p className="text-sm text-emerald-600 mt-2">10% discount applied!</p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-parchment-200 pt-4 mb-6">
                    <div className="flex justify-between text-ink-600">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount (10%)</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-ink-600">
                      <span>Shipping</span>
                      <span className="text-emerald-600">Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-ink-900 pt-3 border-t border-parchment-200">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={proceedToCheckout}
                    disabled={processing}
                    className="btn-accent w-full btn-lg mb-4"
                  >
                    {processing ? (
                      <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight weight="bold" className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 text-ink-400">
                    <div className="flex items-center gap-1 text-xs">
                      <ShieldCheck weight="fill" className="h-4 w-4" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <CreditCard weight="fill" className="h-4 w-4" />
                      <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Wallet weight="fill" className="h-4 w-4" />
                      <span>Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
