/**
 * Mock Data - Orders
 * Demo data for orders page
 */

export interface MockOrderItem {
  id: string;
  bookId: string;
  title: string;
  author: string;
  authorId: string;
  coverUrl?: string;
  format: 'ebook' | 'paperback' | 'hardcover' | 'audiobook';
  price: number;
  quantity: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: MockOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  paymentMethod: string;
  shippingAddress?: string;
}

export const mockUserOrders: MockOrder[] = [
  {
    id: '1',
    orderNumber: 'PI-20240115-8432',
    date: '2024-01-15T10:30:00Z',
    status: 'shipped',
    items: [
      {
        id: '1',
        bookId: 'midnight-garden',
        title: 'The Midnight Garden',
        author: 'Elena Vasquez',
        authorId: 'elena-vasquez',
        format: 'paperback',
        price: 16.99,
        quantity: 1,
      },
      {
        id: '2',
        bookId: 'art-stillness',
        title: 'The Art of Stillness',
        author: 'Kenji Tanaka',
        authorId: 'kenji-tanaka',
        format: 'ebook',
        price: 8.99,
        quantity: 1,
      },
    ],
    subtotal: 25.98,
    shipping: 0,
    discount: 0,
    total: 25.98,
    trackingNumber: '1Z999AA10123456784',
    estimatedDelivery: '2024-01-20',
    paymentMethod: 'Visa •••• 4242',
    shippingAddress: '123 Main Street, New York, NY 10001',
  },
  {
    id: '2',
    orderNumber: 'PI-20240110-7651',
    date: '2024-01-10T14:20:00Z',
    status: 'delivered',
    items: [
      {
        id: '3',
        bookId: 'whispers-wind',
        title: 'Whispers in the Wind',
        author: 'Sarah Mitchell',
        authorId: 'sarah-mitchell',
        format: 'hardcover',
        price: 24.99,
        quantity: 1,
      },
    ],
    subtotal: 24.99,
    shipping: 4.99,
    discount: 2.50,
    total: 27.48,
    estimatedDelivery: '2024-01-13',
    deliveredDate: '2024-01-12',
    paymentMethod: 'Wallet Balance',
    shippingAddress: '456 Oak Avenue, Los Angeles, CA 90001',
  },
  {
    id: '3',
    orderNumber: 'PI-20240105-4523',
    date: '2024-01-05T09:15:00Z',
    status: 'processing',
    items: [
      {
        id: '4',
        bookId: 'digital-horizons',
        title: 'Digital Horizons',
        author: 'Marcus Chen',
        authorId: 'marcus-chen',
        format: 'ebook',
        price: 12.99,
        quantity: 1,
      },
      {
        id: '5',
        bookId: 'last-sunset',
        title: 'The Last Sunset',
        author: 'Amara Okonkwo',
        authorId: 'amara-okonkwo',
        format: 'audiobook',
        price: 19.99,
        quantity: 1,
      },
    ],
    subtotal: 32.98,
    shipping: 0,
    discount: 3.30,
    total: 29.68,
    paymentMethod: 'Mastercard •••• 5678',
  },
  {
    id: '4',
    orderNumber: 'PI-20231220-1234',
    date: '2023-12-20T16:45:00Z',
    status: 'cancelled',
    items: [
      {
        id: '6',
        bookId: 'silent-echoes',
        title: 'Silent Echoes',
        author: 'James Morrison',
        authorId: 'james-morrison',
        format: 'paperback',
        price: 14.99,
        quantity: 2,
      },
    ],
    subtotal: 29.98,
    shipping: 4.99,
    discount: 0,
    total: 34.97,
    paymentMethod: 'Visa •••• 4242',
  },
];
