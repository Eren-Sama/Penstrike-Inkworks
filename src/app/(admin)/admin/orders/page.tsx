'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Funnel,
  DownloadSimple,
  Eye,
  DotsThree,
  CheckCircle,
  Clock,
  WarningCircle,
  ArrowsClockwise,
  Package,
  CaretLeft,
  CaretRight,
  Truck,
  type Icon
} from '@phosphor-icons/react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui';

const orders = [
  { id: 'PS-7829', customer: 'John Smith', email: 'john@example.com', items: 3, total: 45.97, status: 'completed', date: '2024-12-19', shipping: 'Standard' },
  { id: 'PS-7828', customer: 'Emily Johnson', email: 'emily@example.com', items: 1, total: 16.99, status: 'processing', date: '2024-12-19', shipping: 'Express' },
  { id: 'PS-7827', customer: 'Michael Brown', email: 'michael@example.com', items: 2, total: 28.98, status: 'completed', date: '2024-12-18', shipping: 'Standard' },
  { id: 'PS-7826', customer: 'Sarah Davis', email: 'sarah@example.com', items: 4, total: 67.96, status: 'shipped', date: '2024-12-18', shipping: 'Express' },
  { id: 'PS-7825', customer: 'James Wilson', email: 'james@example.com', items: 1, total: 9.99, status: 'refunded', date: '2024-12-17', shipping: 'Standard' },
  { id: 'PS-7824', customer: 'Lisa Anderson', email: 'lisa@example.com', items: 2, total: 34.98, status: 'pending', date: '2024-12-17', shipping: 'Standard' },
  { id: 'PS-7823', customer: 'Robert Taylor', email: 'robert@example.com', items: 5, total: 89.95, status: 'completed', date: '2024-12-16', shipping: 'Express' },
  { id: 'PS-7822', customer: 'Jennifer Martinez', email: 'jennifer@example.com', items: 1, total: 12.99, status: 'shipped', date: '2024-12-16', shipping: 'Standard' },
];

const statusConfig: Record<string, { bg: string; text: string; icon: Icon }> = {
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
  processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ArrowsClockwise },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck },
  refunded: { bg: 'bg-rose-100', text: 'text-rose-700', icon: WarningCircle },
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink-900">Orders</h1>
          <p className="text-ink-600 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <DownloadSimple weight="bold" className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12 w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-parchment-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-parchment-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-ink-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-ink-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-ink-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-ink-500 uppercase tracking-wider">Shipping</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-ink-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-ink-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-100">
              {filteredOrders.map((order, index) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-parchment-50/50 transition-colors animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-ink-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-ink-900">{order.customer}</p>
                      <p className="text-sm text-ink-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-parchment-100 text-ink-700 text-sm font-medium">
                        {order.items}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-ink-900">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize',
                        status.bg, status.text
                      )}>
                        <StatusIcon weight="fill" className="h-3 w-3" />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-ink-600">{order.shipping}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-600">{order.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors">
                          <Eye weight="duotone" className="h-4 w-4" />
                        </button>
                        <button className="p-2 rounded-lg text-ink-500 hover:bg-parchment-100 transition-colors">
                          <DotsThree weight="bold" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-parchment-100 flex items-center justify-between">
          <p className="text-sm text-ink-600">
            Showing <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors disabled:opacity-50">
              <CaretLeft weight="bold" className="h-4 w-4" />
            </button>
            <button className="px-3 py-1 rounded-lg bg-ink-900 text-white text-sm font-medium">1</button>
            <button className="px-3 py-1 rounded-lg text-ink-600 hover:bg-parchment-100 text-sm font-medium">2</button>
            <button className="px-3 py-1 rounded-lg text-ink-600 hover:bg-parchment-100 text-sm font-medium">3</button>
            <button className="p-2 rounded-lg border border-parchment-200 text-ink-500 hover:bg-parchment-50 transition-colors">
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
