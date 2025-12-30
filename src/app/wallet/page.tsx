'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  Plus,
  ArrowDown,
  ArrowUp,
  CreditCard,
  Bank,
  Receipt,
  SpinnerGap,
  Clock,
  CheckCircle,
  Gift,
  ShoppingCart,
  BookOpen,
  ArrowRight,
  Info
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'refund' | 'gift';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
  reference?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'debit',
    amount: 25.98,
    description: 'Purchase: The Midnight Garden & The Art of Stillness',
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    reference: '#PI-12345678',
  },
  {
    id: '2',
    type: 'credit',
    amount: 50.00,
    description: 'Wallet Top-up via Credit Card',
    date: '2024-01-10T14:20:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'gift',
    amount: 10.00,
    description: 'Welcome Bonus - New Account',
    date: '2024-01-05T09:00:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'refund',
    amount: 8.99,
    description: 'Refund: Digital Horizons (Order Cancelled)',
    date: '2024-01-03T16:45:00Z',
    status: 'completed',
    reference: '#PI-87654321',
  },
];

const addFundsAmounts = [10, 25, 50, 100];

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(34.02);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/wallet');
    }
  }, [user, authLoading, router]);

  const handleAddFunds = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (!amount || amount < 5) {
      toast.error('Minimum top-up amount is ₹5');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBalance(prev => prev + amount);
    setTransactions(prev => [
      {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Wallet Top-up via Credit Card',
        date: new Date().toISOString(),
        status: 'completed',
      },
      ...prev,
    ]);
    
    setProcessing(false);
    setShowAddFunds(false);
    setSelectedAmount(null);
    setCustomAmount('');
    toast.success(`${formatCurrency(amount)} added to your wallet!`);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'credit':
        return { icon: ArrowDown, color: 'text-emerald-600', bg: 'bg-emerald-100' };
      case 'debit':
        return { icon: ShoppingCart, color: 'text-ink-600', bg: 'bg-parchment-100' };
      case 'refund':
        return { icon: ArrowUp, color: 'text-blue-600', bg: 'bg-blue-100' };
      case 'gift':
        return { icon: Gift, color: 'text-purple-600', bg: 'bg-purple-100' };
      default:
        return { icon: Receipt, color: 'text-ink-500', bg: 'bg-parchment-100' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 flex items-center justify-center">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 to-cream-100 py-24">
      <div className="container-editorial max-w-4xl mx-auto">
        <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-yellow/20">
                <Wallet weight="duotone" className="h-8 w-8 text-accent-yellow" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-ink-900">My Wallet</h1>
                <p className="text-ink-600">Manage your balance and transactions</p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <p className="text-parchment-400 mb-2">Available Balance</p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-serif text-5xl font-bold">{formatCurrency(balance)}</span>
                <span className="text-parchment-400">INR</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setShowAddFunds(true)}
                  className="bg-accent-yellow text-ink-900 hover:bg-accent-amber"
                >
                  <Plus weight="bold" className="h-4 w-4" />
                  Add Funds
                </Button>
                <Link href="/bookstore">
                  <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20">
                    <BookOpen weight="duotone" className="h-4 w-4" />
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Add Funds Modal */}
          {showAddFunds && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-up">
                <h2 className="font-serif text-2xl font-bold text-ink-900 mb-6">Add Funds</h2>
                
                {/* Preset Amounts */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {addFundsAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={cn(
                        'py-3 rounded-xl font-semibold transition-all',
                        selectedAmount === amount
                          ? 'bg-ink-900 text-white'
                          : 'bg-parchment-100 text-ink-700 hover:bg-parchment-200'
                      )}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink-700 mb-2">Or enter custom amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-semibold">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      placeholder="0.00"
                      min="5"
                      className="input w-full pl-8 text-lg font-semibold"
                    />
                  </div>
                  <p className="text-xs text-ink-400 mt-1">Minimum: ₹5.00</p>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-4 bg-parchment-50 rounded-xl flex items-center gap-3">
                  <CreditCard weight="duotone" className="h-8 w-8 text-ink-500" />
                  <div className="flex-1">
                    <p className="font-medium text-ink-900">Credit Card</p>
                    <p className="text-sm text-ink-500">•••• 4242</p>
                  </div>
                  <button className="text-sm text-emerald-600 hover:underline">Change</button>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowAddFunds(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddFunds}
                    disabled={processing || (!selectedAmount && !customAmount)}
                    className="btn-accent flex-1"
                  >
                    {processing ? (
                      <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Add {formatCurrency(selectedAmount || parseFloat(customAmount) || 0)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-emerald-100">
                  <ArrowDown weight="bold" className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-ink-600">Total Added</span>
              </div>
              <p className="font-serif text-2xl font-bold text-ink-900">{formatCurrency(60)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-parchment-100">
                  <ShoppingCart weight="bold" className="h-5 w-5 text-ink-600" />
                </div>
                <span className="text-ink-600">Total Spent</span>
              </div>
              <p className="font-serif text-2xl font-bold text-ink-900">{formatCurrency(25.98)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-parchment-200 shadow-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-purple-100">
                  <Gift weight="bold" className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-ink-600">Bonuses Earned</span>
              </div>
              <p className="font-serif text-2xl font-bold text-ink-900">{formatCurrency(10)}</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-parchment-200 shadow-card">
            <div className="p-6 border-b border-parchment-200">
              <h2 className="font-serif text-xl font-bold text-ink-900">Transaction History</h2>
            </div>
            
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <Receipt weight="duotone" className="h-16 w-16 text-parchment-300 mx-auto mb-4" />
                <p className="text-ink-600">No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-parchment-100">
                {transactions.map((transaction, index) => {
                  const { icon: Icon, color, bg } = getTransactionIcon(transaction.type);
                  const isPositive = transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'gift';
                  
                  return (
                    <div 
                      key={transaction.id}
                      className="p-4 hover:bg-parchment-50/50 transition-colors flex items-center gap-4"
                      style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                        transition: `all 0.3s ease ${index * 50}ms`
                      }}
                    >
                      <div className={cn('p-3 rounded-xl', bg)}>
                        <Icon weight="duotone" className={cn('h-5 w-5', color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink-900 truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-ink-500">
                          <Clock weight="regular" className="h-3.5 w-3.5" />
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.reference && (
                            <span className="text-ink-400">• {transaction.reference}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={cn(
                          'font-semibold',
                          isPositive ? 'text-emerald-600' : 'text-ink-900'
                        )}>
                          {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-ink-400">
                          <CheckCircle weight="fill" className="h-3 w-3 text-emerald-500" />
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <Info weight="fill" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">Wallet Benefits</p>
              <p className="text-sm text-blue-700">
                Use your wallet balance for faster checkout and earn bonus rewards on select purchases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
