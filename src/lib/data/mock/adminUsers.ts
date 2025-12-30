/**
 * Mock Admin Users Data
 * Extracted from admin users page
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'READER' | 'AUTHOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  joinedAt: string;
  ordersCount: number;
  avatar: string | null;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'READER',
    status: 'ACTIVE',
    joinedAt: '2024-01-15',
    ordersCount: 12,
    avatar: null,
  },
  {
    id: '2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'AUTHOR',
    status: 'ACTIVE',
    joinedAt: '2024-02-20',
    ordersCount: 5,
    avatar: null,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'READER',
    status: 'SUSPENDED',
    joinedAt: '2023-11-10',
    ordersCount: 8,
    avatar: null,
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    role: 'AUTHOR',
    status: 'ACTIVE',
    joinedAt: '2024-03-05',
    ordersCount: 3,
    avatar: null,
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'EDITOR',
    status: 'ACTIVE',
    joinedAt: '2023-09-01',
    ordersCount: 0,
    avatar: null,
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    role: 'READER',
    status: 'INACTIVE',
    joinedAt: '2023-06-20',
    ordersCount: 2,
    avatar: null,
  },
  {
    id: '7',
    name: 'Robert Chen',
    email: 'robert@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    joinedAt: '2023-01-10',
    ordersCount: 0,
    avatar: null,
  },
];
