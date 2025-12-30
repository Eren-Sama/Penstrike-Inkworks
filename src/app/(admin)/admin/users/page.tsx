'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MagnifyingGlass,
  Funnel,
  DotsThreeVertical,
  User,
  EnvelopeSimple,
  Calendar,
  Shield,
  Prohibit,
  CheckCircle,
  PencilSimple,
  Trash,
  Plus,
  DownloadSimple,
  CaretLeft,
  CaretRight,
  SpinnerGap,
  X,
  BookOpen,
  ShoppingBag
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import { getAdminUsers, type AdminUser } from '@/lib/data';

const roleColors: Record<string, string> = {
  READER: 'bg-parchment-200 text-ink-700',
  AUTHOR: 'bg-accent-yellow/20 text-accent-warm',
  EDITOR: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-error/20 text-error',
  SUPER_ADMIN: 'bg-error/20 text-error',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-success/20 text-success',
  INACTIVE: 'bg-parchment-200 text-ink-500',
  SUSPENDED: 'bg-error/20 text-error',
  PENDING: 'bg-accent-yellow/20 text-accent-warm',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // View user profile
  const handleViewProfile = (user: AdminUser) => {
    setSelectedUser(user);
    setActiveMenu(null);
  };

  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-ink-900">Users</h1>
          <p className="text-ink-600">Manage all platform users and their permissions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <DownloadSimple weight="bold" className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="primary">
            <Plus weight="bold" className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-2xl font-bold text-ink-900">{users.length}</p>
          <p className="text-sm text-ink-500">Total Users</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-success">
            {users.filter(u => u.status === 'ACTIVE').length}
          </p>
          <p className="text-sm text-ink-500">Active</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-accent-warm">
            {users.filter(u => u.role === 'AUTHOR').length}
          </p>
          <p className="text-sm text-ink-500">Authors</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-bold text-error">
            {users.filter(u => u.status === 'SUSPENDED').length}
          </p>
          <p className="text-sm text-ink-500">Suspended</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Roles</option>
              <option value="READER">Reader</option>
              <option value="AUTHOR">Author</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input py-2"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-parchment-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-ink-600 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-parchment-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-ink-900">{user.name}</p>
                        <p className="text-sm text-ink-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      roleColors[user.role]
                    )}>
                      <Shield weight="duotone" className="h-3 w-3" />
                      {user.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      statusColors[user.status]
                    )}>
                      {user.status === 'ACTIVE' && <CheckCircle weight="fill" className="h-3 w-3" />}
                      {user.status === 'SUSPENDED' && <Prohibit weight="bold" className="h-3 w-3" />}
                      {user.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-600">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-ink-600">
                    {user.ordersCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 hover:bg-parchment-100 rounded-lg transition-colors"
                      >
                        <DotsThreeVertical weight="bold" className="h-4 w-4 text-ink-500" />
                      </button>
                      
                      {activeMenu === user.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-parchment-200 z-20">
                            <button
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                              onClick={() => handleViewProfile(user)}
                            >
                              <User weight="duotone" className="h-4 w-4" />
                              View Profile
                            </button>
                            <button
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                              onClick={() => setActiveMenu(null)}
                            >
                              <PencilSimple weight="duotone" className="h-4 w-4" />
                              Edit User
                            </button>
                            <button
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-700 hover:bg-parchment-100"
                              onClick={() => setActiveMenu(null)}
                            >
                              <EnvelopeSimple weight="duotone" className="h-4 w-4" />
                              Send Email
                            </button>
                            {user.status !== 'SUSPENDED' ? (
                              <button
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-parchment-100"
                                onClick={() => setActiveMenu(null)}
                              >
                                <Prohibit weight="bold" className="h-4 w-4" />
                                Suspend User
                              </button>
                            ) : (
                              <button
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-success hover:bg-parchment-100"
                                onClick={() => setActiveMenu(null)}
                              >
                                <CheckCircle weight="fill" className="h-4 w-4" />
                                Reactivate
                              </button>
                            )}
                            <button
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-parchment-100"
                              onClick={() => setActiveMenu(null)}
                            >
                              <Trash weight="duotone" className="h-4 w-4" />
                              Delete User
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-parchment-200 flex items-center justify-between">
          <p className="text-sm text-ink-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-parchment-200 hover:bg-parchment-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CaretLeft weight="bold" className="h-4 w-4" />
            </button>
            <span className="text-sm text-ink-600">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded border border-parchment-200 hover:bg-parchment-100"
            >
              <CaretRight weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-ink-900/50 z-40"
            onClick={() => setSelectedUser(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto animate-slide-left">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-parchment-200 p-4 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-ink-900">User Profile</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-parchment-100 transition-colors"
              >
                <X weight="bold" className="h-5 w-5 text-ink-500" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Avatar & Basic Info */}
              <div className="text-center mb-6">
                {selectedUser.avatar ? (
                  <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-ink-900">{selectedUser.name}</h3>
                <p className="text-ink-500">{selectedUser.email}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className={cn(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                    roleColors[selectedUser.role]
                  )}>
                    <Shield weight="duotone" className="h-3 w-3" />
                    {selectedUser.role}
                  </span>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold',
                    statusColors[selectedUser.status]
                  )}>
                    {selectedUser.status === 'ACTIVE' && <CheckCircle weight="fill" className="h-3 w-3" />}
                    {selectedUser.status === 'SUSPENDED' && <Prohibit weight="bold" className="h-3 w-3" />}
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-parchment-50 text-center">
                  <ShoppingBag weight="duotone" className="h-6 w-6 text-ink-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-ink-900">{selectedUser.ordersCount}</p>
                  <p className="text-xs text-ink-500">Orders</p>
                </div>
                <div className="p-4 rounded-xl bg-parchment-50 text-center">
                  <Calendar weight="duotone" className="h-6 w-6 text-ink-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-ink-900">
                    {new Date(selectedUser.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-ink-500">Joined</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-center gap-2">
                  <EnvelopeSimple weight="duotone" className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2">
                  <PencilSimple weight="duotone" className="h-4 w-4" />
                  Edit User
                </Button>
                {selectedUser.status !== 'SUSPENDED' ? (
                  <Button variant="outline" className="w-full justify-center gap-2 text-error border-error hover:bg-error/10">
                    <Prohibit weight="bold" className="h-4 w-4" />
                    Suspend User
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full justify-center gap-2 text-success border-success hover:bg-success/10">
                    <CheckCircle weight="fill" className="h-4 w-4" />
                    Reactivate User
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
