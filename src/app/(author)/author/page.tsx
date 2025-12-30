'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  TrendUp,
  CurrencyDollar,
  Eye,
  Star,
  ArrowUpRight,
  Plus,
  Sparkle,
  Clock,
  CheckCircle,
  WarningCircle,
  Palette,
  Microphone,
  ChartBar,
  CalendarBlank,
  Lightning,
  ArrowRight,
  DownloadSimple,
  Users,
  Moon,
  SunHorizon,
  Diamond,
  Leaf,
  SpinnerGap,
  type Icon
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { 
  getAuthorDashboardStats, 
  getRecentSales, 
  getDashboardManuscripts, 
  getAICredits,
  type DashboardStat,
  type RecentSale,
  type DashboardManuscript,
  type AICredits
} from '@/lib/data';

// Icon mappings (icons can't be stored in data layer)
const statIconMap: Record<string, Icon> = {
  CurrencyDollar,
  BookOpen,
  Users,
  Star,
};

const saleIconMap: Record<string, Icon> = {
  Moon,
  Sparkle,
  SunHorizon,
};

const manuscriptIconMap: Record<string, Icon> = {
  Diamond,
  Leaf,
  SunHorizon,
};

const statusColors: Record<string, { bg: string; text: string; icon: Icon }> = {
  DRAFT: { bg: 'bg-ink-100', text: 'text-ink-700', icon: Clock },
  EDITING: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  REVIEW: { bg: 'bg-blue-100', text: 'text-blue-700', icon: WarningCircle },
  APPROVED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  PUBLISHED: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  REJECTED: { bg: 'bg-rose-100', text: 'text-rose-700', icon: WarningCircle },
};

const formatBadge: Record<string, string> = {
  eBook: 'bg-blue-100 text-blue-700',
  Paperback: 'bg-amber-100 text-amber-700',
  Audiobook: 'bg-purple-100 text-purple-700',
};

export default function AuthorDashboardPage() {
  const [userName, setUserName] = useState<string>('Author');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [manuscripts, setManuscripts] = useState<DashboardManuscript[]>([]);
  const [aiCredits, setAICredits] = useState<AICredits>({ used: 0, total: 100, resetDate: '' });

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      const [statsData, salesData, manuscriptsData, creditsData] = await Promise.all([
        getAuthorDashboardStats(),
        getRecentSales(),
        getDashboardManuscripts(),
        getAICredits(),
      ]);
      setStats(statsData);
      setRecentSales(salesData);
      setManuscripts(manuscriptsData);
      setAICredits(creditsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, pen_name')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          // Use pen_name if available, otherwise use full_name
          setUserName(profile.pen_name || profile.full_name || user.email?.split('@')[0] || 'Author');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-3xl font-bold text-ink-900">
              Welcome back, {loading ? '...' : userName}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
              <CheckCircle weight="fill" className="h-3 w-3" />
              Verified Author
            </span>
          </div>
          <p className="text-ink-600">Here&apos;s what&apos;s happening with your books today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <DownloadSimple weight="bold" className="h-4 w-4" />
            Export Data
          </Button>
          <Link href="/author/manuscripts/new">
            <Button variant="primary" className="gap-2 shadow-glow-soft">
              <Plus weight="bold" className="h-4 w-4" />
              New Manuscript
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = statIconMap[stat.iconName] || BookOpen;
          return (
          <div 
            key={stat.label} 
            className={`relative p-6 rounded-2xl bg-gradient-to-br ${stat.bgGradient} border border-white/50 shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-fade-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Icon */}
            <StatIcon weight="light" className="absolute -right-4 -bottom-4 h-32 w-32 text-ink-900/5" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                  <StatIcon weight="duotone" className="h-6 w-6 text-white" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  <TrendUp weight="bold" className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-ink-900 mb-1">{stat.value}</p>
              <p className="text-sm text-ink-600">{stat.label}</p>
            </div>
          </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Sales */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
            <div className="p-6 border-b border-parchment-100 flex items-center justify-between bg-gradient-to-r from-parchment-50 to-white">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink-900">Recent Sales</h2>
                <p className="text-sm text-ink-500 mt-1">Your latest book sales and earnings</p>
              </div>
              <Link 
                href="/author/royalties" 
                className="inline-flex items-center gap-1 text-sm font-semibold text-accent-warm hover:text-accent-amber transition-colors"
              >
                View All <ArrowUpRight weight="bold" className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-parchment-100">
              {recentSales.map((sale, i) => {
                const SaleIcon = saleIconMap[sale.iconName] || Moon;
                return (
                  <div 
                    key={i} 
                    className="p-5 flex items-center justify-between hover:bg-parchment-50/50 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-20 bg-gradient-to-br rounded-lg flex items-center justify-center shadow-md",
                        sale.color
                      )}>
                        <SaleIcon weight="duotone" className="h-6 w-6 text-white" />
                      </div>
                    <div>
                      <p className="font-semibold text-ink-900">{sale.title}</p>
                      <span className={cn(
                        'inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium',
                        formatBadge[sale.format]
                      )}>
                        {sale.format}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-ink-900 text-lg">{formatCurrency(sale.amount)}</p>
                    <p className="text-xs text-ink-500">{sale.date}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Credits Card */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 text-white shadow-elegant overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold">AI Credits</h2>
                <Sparkle weight="duotone" className="h-6 w-6 text-white/80" />
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 text-white/90">
                  <span>Used this month</span>
                  <span className="font-semibold">{aiCredits.used}/{aiCredits.total}</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(aiCredits.used / aiCredits.total) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-white/70 mb-4">Resets on {aiCredits.resetDate}</p>
              <Link href="/author/ai-studio">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
                  <Lightning weight="fill" className="mr-2 h-4 w-4" />
                  Open AI Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-6">
            <h2 className="font-serif text-lg font-bold text-ink-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {([
                { href: '/author/manuscripts/new', icon: FileText, label: 'Upload Manuscript', gradient: 'from-blue-500 to-indigo-600' },
                { href: '/author/ai-studio/cover', icon: Palette, label: 'Generate Cover', gradient: 'from-pink-500 to-rose-600' },
                { href: '/author/ai-studio/audiobook', icon: Microphone, label: 'Create Audiobook', gradient: 'from-orange-500 to-amber-600' },
                { href: '/author/analytics', icon: ChartBar, label: 'View Analytics', gradient: 'from-emerald-500 to-teal-600' },
              ] as { href: string; icon: Icon; label: string; gradient: string }[]).map((action, index) => (
                <Link 
                  key={index}
                  href={action.href} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-parchment-50 transition-all duration-300 group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <action.icon weight="duotone" className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-ink-900 group-hover:text-accent-warm transition-colors">{action.label}</span>
                  <ArrowRight weight="bold" className="h-4 w-4 text-ink-300 ml-auto group-hover:text-accent-warm group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manuscripts Table */}
      <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
        <div className="p-6 border-b border-parchment-100 flex items-center justify-between bg-gradient-to-r from-parchment-50 to-white">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink-900">My Manuscripts</h2>
            <p className="text-sm text-ink-500 mt-1">Track and manage your writing projects</p>
          </div>
          <Link 
            href="/author/manuscripts" 
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent-warm hover:text-accent-amber transition-colors"
          >
            View All <ArrowUpRight weight="bold" className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-parchment-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {manuscripts.map((ms, i) => {
                const status = statusColors[ms.status];
                const StatusIcon = status.icon;
                const MsIcon = manuscriptIconMap[ms.iconName] || Diamond;
                return (
                  <tr 
                    key={ms.id} 
                    className="hover:bg-parchment-50/50 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-14 bg-gradient-to-br rounded flex items-center justify-center shadow-sm",
                          ms.color
                        )}>
                          <MsIcon weight="duotone" className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-ink-900">{ms.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize',
                        status.bg, status.text
                      )}>
                        <StatusIcon weight="fill" className="h-3 w-3" />
                        {ms.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 w-32">
                        <div className="flex-1 h-2 bg-parchment-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-accent-yellow to-accent-amber rounded-full transition-all duration-500"
                            style={{ width: `${ms.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-ink-600 w-10">{ms.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-500">{ms.lastUpdated}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/author/manuscripts/${ms.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-accent-warm hover:bg-accent-yellow/10 transition-colors"
                      >
                        Edit
                        <ArrowRight weight="bold" className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-accent-yellow/20 via-accent-amber/10 to-accent-yellow/20 border border-accent-yellow/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent-yellow/30 flex items-center justify-center">
            <Sparkle weight="duotone" className="h-6 w-6 text-accent-warm" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink-900">Pro Tip: Boost Your Sales</h3>
            <p className="text-sm text-ink-600">Add an audiobook version to increase your reach by up to 40%</p>
          </div>
        </div>
        <Link href="/author/ai-studio/audiobook">
          <Button variant="primary" className="gap-2 shadow-glow-soft whitespace-nowrap">
            <Microphone weight="duotone" className="h-4 w-4" />
            Create Audiobook
          </Button>
        </Link>
      </div>
    </div>
  );
}
