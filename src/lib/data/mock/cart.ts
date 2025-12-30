/**
 * Mock Cart/Order Data
 * Extracted from checkout page
 */

import type { OrderItem, ShippingOption } from '../types';

export const mockOrderItems: OrderItem[] = [
  {
    id: '1',
    bookId: 'book-1',
    title: 'The Midnight Garden',
    author: 'Victoria Ashford',
    format: 'PAPERBACK',
    price: 16.99,
    quantity: 1,
    coverGradient: 'from-emerald-600 to-teal-800',
  },
  {
    id: '2',
    bookId: 'book-2',
    title: 'The Art of Stillness',
    author: 'Elena Ramirez',
    format: 'EBOOK',
    price: 8.99,
    quantity: 1,
    coverGradient: 'from-amber-500 to-orange-700',
  },
];

export const shippingOptions: ShippingOption[] = [
  { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 4.99, days: '2-3 business days' },
  { id: 'overnight', name: 'Overnight', price: 14.99, days: 'Next business day' },
];
