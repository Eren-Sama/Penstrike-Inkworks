'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle,
  SpinnerGap,
  BookOpen,
  ArrowLeft,
  Wallet,
  Receipt,
  MapPin,
  EnvelopeSimple,
  Phone,
  User,
  CaretDown,
  Truck,
  Package,
  Lightning,
  Check
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { getCheckoutItems, getShippingOptions, clearCart, type OrderItem, type ShippingOption } from '@/lib/data';

// Map shipping option icons (icons can't be stored in data layer)
const shippingIconMap: Record<string, typeof Package> = {
  standard: Package,
  express: Truck,
  overnight: Lightning,
};

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [shippingOptionsData, setShippingOptionsData] = useState<ShippingOption[]>([]);

  // Load checkout data
  const loadCheckoutData = useCallback(async () => {
    try {
      setLoading(true);
      const [items, options] = await Promise.all([
        getCheckoutItems(),
        Promise.resolve(getShippingOptions())
      ]);
      setOrderItems(items);
      setShippingOptionsData(options);
    } catch (error) {
      console.error('Failed to load checkout data:', error);
      toast.error('Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });
  
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    } else if (user) {
      // Pre-fill email from user profile
      setShippingInfo(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.full_name?.split(' ')[0] || '',
        lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [user, authLoading, router]);

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingOptionsData.find(s => s.id === selectedShipping)?.price || 0;
  const hasPhysicalItems = orderItems.some(item => 
    item.format === 'PAPERBACK' || item.format === 'HARDCOVER'
  );
  const tax = subtotal * 0.08; // 8% tax estimate
  const total = subtotal + (hasPhysicalItems ? shippingCost : 0) + tax;

  const validateStep1 = () => {
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (hasPhysicalItems && (!shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode)) {
      toast.error('Please fill in shipping address');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.cardName) {
      toast.error('Please fill in all payment details');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart after successful order
    await clearCart();
    
    setOrderComplete(true);
    setProcessing(false);
    toast.success('Order placed successfully!');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center py-24">
        <div className="max-w-lg w-full mx-auto px-4">
          <div className="bg-white rounded-2xl border border-parchment-200 shadow-elegant p-8 text-center animate-fade-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle weight="fill" className="h-12 w-12 text-emerald-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-ink-900 mb-2">Order Confirmed!</h1>
            <p className="text-ink-600 mb-6">
              Thank you for your purchase. You'll receive an email confirmation shortly.
            </p>
            <div className="bg-parchment-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-ink-500 mb-1">Order Number</p>
              <p className="font-mono text-lg font-bold text-ink-900">#PI-{Date.now().toString().slice(-8)}</p>
            </div>
            <div className="space-y-3">
              <Link href="/orders">
                <Button className="btn-accent w-full">
                  <Receipt weight="duotone" className="h-5 w-5" />
                  View Order Details
                </Button>
              </Link>
              <Link href="/bookstore">
                <Button className="btn-secondary w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-6xl mx-auto">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Back to Cart */}
          <Link href="/cart" className="inline-flex items-center gap-2 text-ink-600 hover:text-ink-900 mb-8">
            <ArrowLeft weight="bold" className="h-4 w-4" />
            Back to Cart
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-accent-yellow/20">
              <CreditCard weight="duotone" className="h-8 w-8 text-accent-yellow" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-ink-900">Checkout</h1>
              <p className="text-ink-600">Complete your purchase securely</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Payment' },
              { num: 3, label: 'Review' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  disabled={s.num > step}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl transition-all',
                    step === s.num
                      ? 'bg-ink-900 text-white'
                      : step > s.num
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-parchment-100 text-ink-400'
                  )}
                >
                  {step > s.num ? (
                    <Check weight="bold" className="h-4 w-4" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {s.num}
                    </span>
                  )}
                  <span className="hidden sm:inline font-medium">{s.label}</span>
                </button>
                {i < 2 && (
                  <div className={cn(
                    'w-12 h-0.5 mx-2',
                    step > s.num ? 'bg-emerald-400' : 'bg-parchment-200'
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-8 animate-fade-up">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Shipping Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                        className="input w-full"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                        className="input w-full"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <EnvelopeSimple weight="duotone" className="inline h-4 w-4 mr-1" />
                        Email *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="input w-full"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <Phone weight="duotone" className="inline h-4 w-4 mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="input w-full"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {hasPhysicalItems && (
                    <>
                      <div className="border-t border-parchment-200 my-8" />
                      
                      <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">
                        <MapPin weight="duotone" className="inline h-5 w-5 mr-2" />
                        Delivery Address
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-ink-700 mb-2">Street Address *</label>
                          <input
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            className="input w-full"
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-ink-700 mb-2">City *</label>
                            <input
                              type="text"
                              value={shippingInfo.city}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                              className="input w-full"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ink-700 mb-2">State</label>
                            <input
                              type="text"
                              value={shippingInfo.state}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                              className="input w-full"
                              placeholder="NY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-ink-700 mb-2">ZIP Code *</label>
                            <input
                              type="text"
                              value={shippingInfo.zipCode}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                              className="input w-full"
                              placeholder="10001"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-parchment-200 my-8" />
                      
                      <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">Shipping Method</h3>
                      <div className="space-y-3">
                        {shippingOptionsData.map((option) => (
                          <label
                            key={option.id}
                            className={cn(
                              'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                              selectedShipping === option.id
                                ? 'border-accent-yellow bg-accent-yellow/5'
                                : 'border-parchment-200 hover:border-parchment-300'
                            )}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="hidden"
                            />
                            <div className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                              selectedShipping === option.id
                                ? 'border-accent-yellow'
                                : 'border-parchment-300'
                            )}>
                              {selectedShipping === option.id && (
                                <div className="w-2.5 h-2.5 rounded-full bg-accent-yellow" />
                              )}
                            </div>
                            {(() => {
                              const Icon = shippingIconMap[option.id];
                              return <Icon weight="duotone" className="h-6 w-6 text-ink-500" />;
                            })()}
                            <div className="flex-1">
                              <p className="font-medium text-ink-900">{option.name}</p>
                              <p className="text-sm text-ink-500">{option.days}</p>
                            </div>
                            <p className="font-semibold text-ink-900">
                              {option.price === 0 ? 'Free' : formatCurrency(option.price)}
                            </p>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex justify-end mt-8">
                    <Button onClick={handleNextStep} className="btn-accent btn-lg">
                      Continue to Payment
                      <ArrowLeft weight="bold" className="h-5 w-5 rotate-180" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-8 animate-fade-up">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Payment Details</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Name on Card *</label>
                      <input
                        type="text"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className="input w-full"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Card Number *</label>
                      <div className="relative">
                        <CreditCard weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                          className="input w-full pl-10"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Expiry Date *</label>
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: formatExpiry(e.target.value) })}
                          className="input w-full"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          className="input w-full"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-8 p-4 bg-parchment-50 rounded-xl">
                    <Lock weight="fill" className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-ink-600">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button onClick={() => setStep(1)} className="btn-secondary">
                      <ArrowLeft weight="bold" className="h-5 w-5" />
                      Back
                    </Button>
                    <Button onClick={handleNextStep} className="btn-accent btn-lg">
                      Review Order
                      <ArrowLeft weight="bold" className="h-5 w-5 rotate-180" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-8 animate-fade-up">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Review Your Order</h2>
                  
                  {/* Shipping Summary */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-ink-900">Shipping Details</h3>
                      <button onClick={() => setStep(1)} className="text-sm text-emerald-600 hover:underline">
                        Edit
                      </button>
                    </div>
                    <div className="bg-parchment-50 rounded-xl p-4">
                      <p className="text-ink-900">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p className="text-ink-600 text-sm">{shippingInfo.email}</p>
                      {hasPhysicalItems && (
                        <>
                          <p className="text-ink-600 text-sm mt-2">{shippingInfo.address}</p>
                          <p className="text-ink-600 text-sm">
                            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-ink-900">Payment Method</h3>
                      <button onClick={() => setStep(2)} className="text-sm text-emerald-600 hover:underline">
                        Edit
                      </button>
                    </div>
                    <div className="bg-parchment-50 rounded-xl p-4 flex items-center gap-3">
                      <CreditCard weight="duotone" className="h-8 w-8 text-ink-500" />
                      <div>
                        <p className="text-ink-900">•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</p>
                        <p className="text-sm text-ink-500">Expires {paymentInfo.expiry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-medium text-ink-900 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-parchment-50 rounded-xl">
                          <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${item.coverGradient} flex items-center justify-center`}>
                            <BookOpen weight="duotone" className="h-5 w-5 text-white/30" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-ink-900">{item.title}</p>
                            <p className="text-sm text-ink-500">{item.format} × {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-ink-900">{formatCurrency(item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button onClick={() => setStep(2)} className="btn-secondary">
                      <ArrowLeft weight="bold" className="h-5 w-5" />
                      Back
                    </Button>
                    <Button onClick={handlePlaceOrder} disabled={processing} className="btn-accent btn-lg">
                      {processing ? (
                        <>
                          <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShieldCheck weight="bold" className="h-5 w-5" />
                          Place Order • {formatCurrency(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:w-80">
              <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6 sticky top-24">
                <h3 className="font-serif text-lg font-bold text-ink-900 mb-4">Order Summary</h3>
                
                {/* Items Preview */}
                <div className="space-y-3 mb-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`w-10 h-14 rounded-lg bg-gradient-to-br ${item.coverGradient} flex items-center justify-center`}>
                        <BookOpen weight="duotone" className="h-4 w-4 text-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{item.title}</p>
                        <p className="text-xs text-ink-500">{item.format}</p>
                      </div>
                      <p className="text-sm font-semibold text-ink-900">{formatCurrency(item.price)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-parchment-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-ink-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {hasPhysicalItems && (
                    <div className="flex justify-between text-sm text-ink-600">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-ink-600">
                    <span>Tax (est.)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-ink-900 pt-2 border-t border-parchment-200">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3 text-ink-400">
                  <ShieldCheck weight="fill" className="h-4 w-4" />
                  <span className="text-xs">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
