'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowLeft,
  MagnifyingGlass,
  CaretDown,
  CaretRight,
  Receipt,
  SpinnerGap,
  BookOpen,
  DownloadSimple,
  Star,
  ArrowClockwise,
  Copy,
  Check,
  CalendarBlank,
  CreditCard,
  MapPin,
  Eye,
  Headphones,
  FileText,
  HardDrives
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import {
  getFullUserOrders,
  type MockOrder as Order,
  type MockOrderItem as OrderItem
} from '@/lib/data';

const statusConfig = {
  processing: {
    icon: Clock,
    color: 'text-amber-600',
    bgGradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'Processing',
    description: 'Your order is being prepared',
  },
  shipped: {
    icon: Truck,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Shipped',
    description: 'On its way to you',
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Delivered',
    description: 'Successfully delivered',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-rose-500',
    bgLight: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Cancelled',
    description: 'Order was cancelled',
  },
};

const formatIcons = {
  ebook: FileText,
  paperback: BookOpen,
  hardcover: HardDrives,
  audiobook: Headphones,
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load orders from data layer
  const loadOrders = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const orderData = await getFullUserOrders();
      setOrders(orderData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Load orders when user is available
  useEffect(() => {
    if (user && !authLoading) {
      loadOrders();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading, loadOrders]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders');
    }
  }, [user, authLoading, router]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReorder = (order: Order) => {
    toast.success('Items added to cart!');
    router.push('/cart');
  };

  const handleDownload = (item: OrderItem) => {
    toast.success(`Downloading ${item.title}...`);
  };

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    toast.success('Order number copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-cream-50 to-parchment-100 flex items-center justify-center">
        <div className="text-center">
          <SpinnerGap weight="bold" className="h-10 w-10 animate-spin text-accent-yellow mx-auto" />
          <p className="mt-4 text-ink-500 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const orderStats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-cream-50 to-parchment-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent-yellow rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-amber rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="container-editorial py-12 relative">
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-parchment-400 mb-6">
              <Link href="/bookstore" className="hover:text-parchment-200 transition-colors">
                Store
              </Link>
              <CaretRight weight="bold" className="h-3 w-3" />
              <span className="text-parchment-200">Order History</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-3">
                  Order History
                </h1>
                <p className="text-parchment-300 text-lg">
                  Track, manage, and reorder your purchases
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-3">
                {[
                  { label: 'Total', value: orderStats.total, icon: Package },
                  { label: 'Active', value: orderStats.processing + orderStats.shipped, icon: Clock },
                  { label: 'Delivered', value: orderStats.delivered, icon: CheckCircle },
                ].map((stat) => (
                  <div 
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <stat.icon weight="duotone" className="h-4 w-4 text-accent-yellow" />
                      <span className="text-xs text-parchment-400">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-editorial py-8">
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-parchment-200 focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['all', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => {
                const isActive = statusFilter === status;
                const config = status === 'all' 
                  ? { icon: Package, label: 'All', color: 'text-ink-600' }
                  : statusConfig[status];
                const Icon = config.icon;
                
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
                      isActive 
                        ? 'bg-ink-900 text-white shadow-md' 
                        : 'bg-white text-ink-600 border border-parchment-200 hover:border-ink-200 hover:bg-parchment-50'
                    )}
                  >
                    <Icon weight={isActive ? 'fill' : 'duotone'} className="h-4 w-4" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-parchment-200 p-16 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-parchment-100 flex items-center justify-center mx-auto mb-6">
                <Receipt weight="duotone" className="h-10 w-10 text-parchment-400" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">No orders found</h2>
              <p className="text-ink-500 mb-8 max-w-md mx-auto">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters to find what you\'re looking for' 
                  : "You haven't placed any orders yet. Start exploring our bookstore!"}
              </p>
              <Link href="/bookstore">
                <Button className="btn-accent text-base px-8 py-3">
                  <BookOpen weight="duotone" className="h-5 w-5" />
                  Browse Books
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                const isExpanded = expandedOrder === order.id;
                
                return (
                  <div 
                    key={order.id}
                    className={cn(
                      'bg-white rounded-2xl border overflow-hidden transition-all duration-300',
                      isExpanded 
                        ? 'shadow-xl border-ink-200' 
                        : 'shadow-sm border-parchment-200 hover:shadow-md hover:border-parchment-300'
                    )}
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                      transition: `all 0.4s ease ${index * 60}ms`
                    }}
                  >
                    {/* Order Card Header */}
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Status Badge & Order Info */}
                        <div className="flex items-start gap-4">
                          {/* Status Icon with Gradient */}
                          <div className={cn(
                            'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg',
                            `bg-gradient-to-br ${status.bgGradient}`
                          )}>
                            <StatusIcon weight="fill" className="h-7 w-7 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                              <span className={cn('font-semibold', status.color)}>{status.label}</span>
                              <span className="text-ink-300">•</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyOrderNumber(order.orderNumber);
                                }}
                                className="flex items-center gap-1.5 text-ink-500 hover:text-ink-700 transition-colors group"
                              >
                                <span className="font-mono text-sm">{order.orderNumber}</span>
                                {copiedId === order.orderNumber ? (
                                  <Check weight="bold" className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <Copy weight="regular" className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500">
                              <span className="flex items-center gap-1.5">
                                <CalendarBlank weight="duotone" className="h-4 w-4" />
                                {formatDate(order.date)}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <CreditCard weight="duotone" className="h-4 w-4" />
                                {order.paymentMethod}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Package weight="duotone" className="h-4 w-4" />
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right: Total & Expand Button */}
                        <div className="flex items-center gap-4 lg:gap-6">
                          <div className="text-right">
                            <p className="text-sm text-ink-400 mb-0.5">Order Total</p>
                            <p className="font-serif text-2xl font-bold text-ink-900">{formatCurrency(order.total)}</p>
                          </div>
                          <div className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                            isExpanded ? 'bg-ink-900 text-white' : 'bg-parchment-100 text-ink-600'
                          )}>
                            <CaretDown 
                              weight="bold" 
                              className={cn('h-5 w-5 transition-transform duration-300', isExpanded && 'rotate-180')} 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Progress for Shipped Orders */}
                      {order.status === 'shipped' && order.trackingNumber && (
                        <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                                <Truck weight="fill" className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-blue-900">Package in transit</p>
                                <p className="text-sm text-blue-600 font-mono">{order.trackingNumber}</p>
                              </div>
                            </div>
                            {order.estimatedDelivery && (
                              <div className="text-right">
                                <p className="text-xs text-blue-500 uppercase tracking-wide">Estimated Arrival</p>
                                <p className="font-semibold text-blue-900">
                                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-parchment-100 animate-in slide-in-from-top-2 duration-300">
                        {/* Order Items */}
                        <div className="p-6">
                          <h3 className="font-semibold text-ink-900 mb-4 flex items-center gap-2">
                            <BookOpen weight="duotone" className="h-5 w-5 text-accent-warm" />
                            Order Items
                          </h3>
                          <div className="space-y-4">
                            {order.items.map((item) => {
                              const FormatIcon = formatIcons[item.format];
                              return (
                                <div key={item.id} className="flex gap-4 p-4 bg-parchment-50/70 rounded-xl border border-parchment-100 hover:border-parchment-200 transition-colors">
                                  {/* Book Cover */}
                                  <Link 
                                    href={`/book/${item.bookId}`}
                                    className="relative w-20 h-28 bg-gradient-to-br from-parchment-200 to-parchment-300 rounded-lg flex-shrink-0 overflow-hidden group shadow-md"
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <BookOpen weight="duotone" className="h-8 w-8 text-parchment-400" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                      <Eye weight="bold" className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </Link>
                                  
                                  {/* Book Info */}
                                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                      <Link 
                                        href={`/book/${item.bookId}`}
                                        className="font-semibold text-ink-900 hover:text-accent-warm transition-colors line-clamp-1 text-lg"
                                      >
                                        {item.title}
                                      </Link>
                                      <Link 
                                        href={`/authors/${item.authorId}`}
                                        className="text-ink-500 hover:text-ink-700 transition-colors text-sm"
                                      >
                                        by {item.author}
                                      </Link>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className={cn(
                                        'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize',
                                        status.bgLight, status.borderColor, 'border'
                                      )}>
                                        <FormatIcon weight="duotone" className="h-3.5 w-3.5" />
                                        {item.format}
                                      </span>
                                      <span className="text-sm text-ink-400">Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                  
                                  {/* Price & Actions */}
                                  <div className="text-right flex flex-col justify-between py-1">
                                    <p className="font-bold text-ink-900 text-lg">{formatCurrency(item.price * item.quantity)}</p>
                                    <div className="flex flex-col gap-1.5 items-end">
                                      {(item.format === 'ebook' || item.format === 'audiobook') && order.status !== 'cancelled' && (
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(item);
                                          }}
                                          className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                        >
                                          <DownloadSimple weight="bold" className="h-4 w-4" />
                                          Download
                                        </button>
                                      )}
                                      {order.status === 'delivered' && (
                                        <Link 
                                          href={`/reviews/write?book=${item.bookId}`}
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1.5 text-sm text-accent-amber hover:text-accent-warm font-medium px-3 py-1.5 rounded-lg bg-accent-yellow/10 hover:bg-accent-yellow/20 transition-colors"
                                        >
                                          <Star weight="bold" className="h-4 w-4" />
                                          Review
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Order Details Grid */}
                        <div className="px-6 pb-6 grid md:grid-cols-2 gap-6">
                          {/* Order Summary */}
                          <div className="bg-parchment-50/70 rounded-xl p-5 border border-parchment-100">
                            <h4 className="font-semibold text-ink-900 mb-4 flex items-center gap-2">
                              <Receipt weight="duotone" className="h-5 w-5 text-accent-warm" />
                              Order Summary
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-ink-500">Subtotal</span>
                                <span className="text-ink-700 font-medium">{formatCurrency(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-ink-500">Shipping</span>
                                <span className="text-ink-700 font-medium">{order.shipping === 0 ? 'Free' : formatCurrency(order.shipping)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-emerald-600">Discount Applied</span>
                                  <span className="text-emerald-600 font-medium">-{formatCurrency(order.discount)}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-lg pt-3 border-t border-parchment-200">
                                <span className="text-ink-900">Total</span>
                                <span className="text-ink-900">{formatCurrency(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div className="bg-parchment-50/70 rounded-xl p-5 border border-parchment-100">
                              <h4 className="font-semibold text-ink-900 mb-4 flex items-center gap-2">
                                <MapPin weight="duotone" className="h-5 w-5 text-accent-warm" />
                                Shipping Address
                              </h4>
                              <p className="text-ink-600 text-sm leading-relaxed">{order.shippingAddress}</p>
                              {order.status === 'delivered' && order.deliveredDate && (
                                <p className="mt-3 text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                                  <CheckCircle weight="fill" className="h-4 w-4" />
                                  Delivered on {formatFullDate(order.deliveredDate)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="px-6 pb-6 flex flex-wrap gap-3">
                          {order.status !== 'cancelled' && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(order);
                              }}
                              className="btn-secondary"
                            >
                              <ArrowClockwise weight="bold" className="h-4 w-4" />
                              Reorder
                            </Button>
                          )}
                          {order.status === 'shipped' && order.trackingNumber && (
                            <a
                              href={`https://track.example.com/${order.trackingNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="btn btn-secondary inline-flex items-center gap-2"
                            >
                              <Truck weight="bold" className="h-4 w-4" />
                              Track Package
                            </a>
                          )}
                          <Link
                            href={`/support?order=${order.orderNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="btn btn-secondary inline-flex items-center gap-2"
                          >
                            Need Help?
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
