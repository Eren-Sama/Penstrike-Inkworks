'use server';

/**
 * Admin Server Actions
 * 
 * All admin-only operations go through these server actions.
 * Every action:
 * 1. Verifies the caller is an admin
 * 2. Performs the operation
 * 3. Logs the action to audit_log
 * 
 * These actions are NOT accessible via mock mode.
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ============================================================================
// TYPES
// ============================================================================

export type AdminActionResult<T = void> = 
  | { success: true; data?: T }
  | { success: false; error: string };

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface VerificationQueueItem {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  primary_genre: string | null;
  is_verified: boolean;
  verification_requested: boolean;
  verification_requested_at: string | null;
  joined_at: string;
  book_count: number;
  published_count: number;
}

export interface ManuscriptQueueItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  genre: string | null;
  status: string;
  created_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  rejection_reason: string | null;
  author_id: string;
  author_name: string;
  author_email: string;
  author_verified: boolean;
  reviewer_id: string | null;
  reviewer_name: string | null;
}

// ============================================================================
// HELPER: VERIFY ADMIN
// ============================================================================

async function verifyAdmin(): Promise<{ isAdmin: true; adminId: string } | { isAdmin: false; error: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { isAdmin: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return { isAdmin: false, error: 'Not authorized - admin access required' };
  }

  return { isAdmin: true, adminId: user.id };
}

// ============================================================================
// HELPER: AUDIT LOG
// ============================================================================

async function logAdminAction(
  adminId: string,
  actionType: string,
  targetType: string,
  targetId: string,
  oldValue?: Record<string, unknown> | null,
  newValue?: Record<string, unknown> | null,
  notes?: string
): Promise<void> {
  const supabase = await createClient();
  
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action_type: actionType,
    target_type: targetType,
    target_id: targetId,
    old_value: oldValue || null,
    new_value: newValue || null,
    notes: notes || null,
  });
}

// ============================================================================
// VERIFICATION ACTIONS
// ============================================================================

/**
 * Get verification queue
 */
export async function getVerificationQueue(): Promise<AdminActionResult<VerificationQueueItem[]>> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      pen_name,
      avatar_url,
      bio,
      primary_genre,
      is_verified,
      verification_requested,
      verification_requested_at,
      created_at
    `)
    .or('role.eq.author,account_type.eq.author')
    .order('verification_requested', { ascending: false })
    .order('verification_requested_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  // Get book counts for each author
  const authorIds = data.map(a => a.id);
  const { data: bookCounts } = await supabase
    .from('books')
    .select('author_id, status')
    .in('author_id', authorIds);

  const countMap = new Map<string, { total: number; published: number }>();
  bookCounts?.forEach(b => {
    const current = countMap.get(b.author_id) || { total: 0, published: 0 };
    current.total++;
    if (b.status === 'published') current.published++;
    countMap.set(b.author_id, current);
  });

  const queue: VerificationQueueItem[] = data.map(p => ({
    id: p.id,
    email: p.email,
    display_name: p.pen_name || p.full_name || p.email,
    avatar_url: p.avatar_url,
    bio: p.bio,
    primary_genre: p.primary_genre,
    is_verified: p.is_verified,
    verification_requested: p.verification_requested,
    verification_requested_at: p.verification_requested_at,
    joined_at: p.created_at,
    book_count: countMap.get(p.id)?.total || 0,
    published_count: countMap.get(p.id)?.published || 0,
  }));

  return { success: true, data: queue };
}

/**
 * Approve author verification
 */
export async function approveVerification(
  authorId: string,
  notes?: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  // Get current state for audit
  const { data: oldProfile } = await supabase
    .from('profiles')
    .select('is_verified, verification_requested, verification_notes')
    .eq('id', authorId)
    .single();

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      is_verified: true,
      verification_requested: false,
      verification_notes: notes || null,
      verified_at: new Date().toISOString(),
      verified_by: adminCheck.adminId,
    })
    .eq('id', authorId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log action
  await logAdminAction(
    adminCheck.adminId,
    'VERIFY_AUTHOR',
    'profile',
    authorId,
    oldProfile,
    { is_verified: true, verification_requested: false },
    notes
  );

  revalidatePath('/admin/authors');
  return { success: true };
}

/**
 * Reject author verification
 */
export async function rejectVerification(
  authorId: string,
  reason: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  if (!reason?.trim()) {
    return { success: false, error: 'Rejection reason is required' };
  }

  const supabase = await createClient();

  // Get current state for audit
  const { data: oldProfile } = await supabase
    .from('profiles')
    .select('is_verified, verification_requested, verification_notes')
    .eq('id', authorId)
    .single();

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      verification_requested: false,
      verification_notes: reason,
    })
    .eq('id', authorId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log action
  await logAdminAction(
    adminCheck.adminId,
    'REJECT_VERIFICATION',
    'profile',
    authorId,
    oldProfile,
    { verification_requested: false },
    reason
  );

  revalidatePath('/admin/authors');
  return { success: true };
}

/**
 * Revoke author verification
 */
export async function revokeVerification(
  authorId: string,
  reason: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  if (!reason?.trim()) {
    return { success: false, error: 'Revocation reason is required' };
  }

  const supabase = await createClient();

  // Get current state for audit
  const { data: oldProfile } = await supabase
    .from('profiles')
    .select('is_verified, verification_notes')
    .eq('id', authorId)
    .single();

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      is_verified: false,
      verification_notes: `Revoked: ${reason}`,
      verified_at: null,
      verified_by: null,
    })
    .eq('id', authorId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log action
  await logAdminAction(
    adminCheck.adminId,
    'REVOKE_VERIFICATION',
    'profile',
    authorId,
    oldProfile,
    { is_verified: false },
    reason
  );

  revalidatePath('/admin/authors');
  return { success: true };
}

// ============================================================================
// MANUSCRIPT/PUBLISHING ACTIONS
// ============================================================================

/**
 * Get manuscript review queue
 */
export async function getManuscriptQueue(): Promise<AdminActionResult<ManuscriptQueueItem[]>> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('books')
    .select(`
      id,
      title,
      slug,
      description,
      genre,
      status,
      created_at,
      submitted_at,
      reviewed_at,
      review_notes,
      rejection_reason,
      author:profiles!books_author_id_fkey (
        id,
        full_name,
        pen_name,
        email,
        is_verified
      ),
      reviewer:profiles!books_reviewed_by_fkey (
        id,
        full_name,
        pen_name
      )
    `)
    .in('status', ['submitted', 'in_review', 'pending'])
    .order('submitted_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  const queue: ManuscriptQueueItem[] = (data || []).map(b => {
    // Supabase returns relations as arrays, get first element
    const author = Array.isArray(b.author) ? b.author[0] : b.author;
    const reviewer = Array.isArray(b.reviewer) ? b.reviewer[0] : b.reviewer;
    
    return {
      id: b.id,
      title: b.title,
      slug: b.slug,
      description: b.description,
      genre: b.genre,
      status: b.status,
      created_at: b.created_at,
      submitted_at: b.submitted_at,
      reviewed_at: b.reviewed_at,
      review_notes: b.review_notes,
      rejection_reason: b.rejection_reason,
      author_id: (author as { id: string })?.id || '',
      author_name: (author as { pen_name?: string; full_name?: string })?.pen_name || 
                   (author as { pen_name?: string; full_name?: string })?.full_name || 'Unknown',
      author_email: (author as { email: string })?.email || '',
      author_verified: (author as { is_verified: boolean })?.is_verified || false,
      reviewer_id: (reviewer as { id: string })?.id || null,
      reviewer_name: (reviewer as { pen_name?: string; full_name?: string })?.pen_name || 
                     (reviewer as { pen_name?: string; full_name?: string })?.full_name || null,
    };
  });

  return { success: true, data: queue };
}

/**
 * Start reviewing a manuscript
 */
export async function startManuscriptReview(bookId: string): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  // Get current state
  const { data: oldBook } = await supabase
    .from('books')
    .select('status, reviewed_by')
    .eq('id', bookId)
    .single();

  if (oldBook?.status !== 'submitted' && oldBook?.status !== 'pending') {
    return { success: false, error: 'Manuscript is not in review queue' };
  }

  // Update to in_review
  const { error } = await supabase
    .from('books')
    .update({
      status: 'in_review',
      reviewed_by: adminCheck.adminId,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(
    adminCheck.adminId,
    'START_REVIEW',
    'book',
    bookId,
    oldBook,
    { status: 'in_review', reviewed_by: adminCheck.adminId }
  );

  revalidatePath('/admin/manuscripts');
  return { success: true };
}

/**
 * Approve manuscript for publishing
 */
export async function approveManuscript(
  bookId: string,
  notes?: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  // Get current state
  const { data: oldBook } = await supabase
    .from('books')
    .select('status, review_notes')
    .eq('id', bookId)
    .single();

  if (!['submitted', 'pending', 'in_review'].includes(oldBook?.status || '')) {
    return { success: false, error: 'Manuscript is not in review' };
  }

  // Update to approved
  const { error } = await supabase
    .from('books')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminCheck.adminId,
      review_notes: notes || null,
      rejection_reason: null,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(
    adminCheck.adminId,
    'APPROVE_MANUSCRIPT',
    'book',
    bookId,
    oldBook,
    { status: 'approved' },
    notes
  );

  revalidatePath('/admin/manuscripts');
  return { success: true };
}

/**
 * Reject manuscript
 */
export async function rejectManuscript(
  bookId: string,
  reason: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  if (!reason?.trim()) {
    return { success: false, error: 'Rejection reason is required' };
  }

  const supabase = await createClient();

  // Get current state
  const { data: oldBook } = await supabase
    .from('books')
    .select('status, rejection_reason')
    .eq('id', bookId)
    .single();

  // Update to rejected
  const { error } = await supabase
    .from('books')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminCheck.adminId,
      rejection_reason: reason,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(
    adminCheck.adminId,
    'REJECT_MANUSCRIPT',
    'book',
    bookId,
    oldBook,
    { status: 'rejected' },
    reason
  );

  revalidatePath('/admin/manuscripts');
  return { success: true };
}

/**
 * Publish an approved manuscript
 */
export async function publishBook(bookId: string): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  // Get current state
  const { data: oldBook } = await supabase
    .from('books')
    .select('status')
    .eq('id', bookId)
    .single();

  if (oldBook?.status !== 'approved') {
    return { success: false, error: 'Only approved manuscripts can be published' };
  }

  // Update to published
  const { error } = await supabase
    .from('books')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(
    adminCheck.adminId,
    'PUBLISH_BOOK',
    'book',
    bookId,
    oldBook,
    { status: 'published' }
  );

  revalidatePath('/admin/manuscripts');
  revalidatePath('/admin/books');
  revalidatePath('/bookstore');
  return { success: true };
}

/**
 * Unpublish a book (soft action - moves to archived)
 */
export async function unpublishBook(
  bookId: string,
  reason: string
): Promise<AdminActionResult> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  if (!reason?.trim()) {
    return { success: false, error: 'Unpublish reason is required' };
  }

  const supabase = await createClient();

  // Get current state
  const { data: oldBook } = await supabase
    .from('books')
    .select('status')
    .eq('id', bookId)
    .single();

  if (oldBook?.status !== 'published') {
    return { success: false, error: 'Book is not published' };
  }

  // Update to archived (soft unpublish)
  const { error } = await supabase
    .from('books')
    .update({
      status: 'draft', // Return to draft so author can resubmit
      review_notes: `Unpublished: ${reason}`,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(
    adminCheck.adminId,
    'UNPUBLISH_BOOK',
    'book',
    bookId,
    oldBook,
    { status: 'draft' },
    reason
  );

  revalidatePath('/admin/books');
  revalidatePath('/bookstore');
  return { success: true };
}

// ============================================================================
// ADMIN STATS
// ============================================================================

export interface AdminStats {
  totalUsers: number;
  totalAuthors: number;
  verifiedAuthors: number;
  pendingVerifications: number;
  totalBooks: number;
  publishedBooks: number;
  pendingManuscripts: number;
  totalOrders: number;
}

export async function getAdminStats(): Promise<AdminActionResult<AdminStats>> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  // Get counts in parallel
  const [
    usersRes,
    authorsRes,
    verifiedRes,
    pendingVerifRes,
    booksRes,
    publishedRes,
    pendingMsRes,
    ordersRes,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).or('role.eq.author,account_type.eq.author'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('verification_requested', true).eq('is_verified', false),
    supabase.from('books').select('id', { count: 'exact', head: true }),
    supabase.from('books').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('books').select('id', { count: 'exact', head: true }).in('status', ['submitted', 'in_review', 'pending']),
    supabase.from('purchases').select('id', { count: 'exact', head: true }),
  ]);

  return {
    success: true,
    data: {
      totalUsers: usersRes.count || 0,
      totalAuthors: authorsRes.count || 0,
      verifiedAuthors: verifiedRes.count || 0,
      pendingVerifications: pendingVerifRes.count || 0,
      totalBooks: booksRes.count || 0,
      publishedBooks: publishedRes.count || 0,
      pendingManuscripts: pendingMsRes.count || 0,
      totalOrders: ordersRes.count || 0,
    },
  };
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export interface AuditLogEntry {
  id: string;
  created_at: string;
  admin_id: string;
  admin_name: string;
  action_type: string;
  target_type: string;
  target_id: string;
  notes: string | null;
}

export async function getAuditLog(limit: number = 50): Promise<AdminActionResult<AuditLogEntry[]>> {
  const adminCheck = await verifyAdmin();
  if (!adminCheck.isAdmin) {
    return { success: false, error: adminCheck.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_audit_log')
    .select(`
      id,
      created_at,
      admin_id,
      action_type,
      target_type,
      target_id,
      notes,
      admin:profiles!admin_audit_log_admin_id_fkey (
        full_name,
        pen_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { success: false, error: error.message };
  }

  const entries: AuditLogEntry[] = (data || []).map(e => ({
    id: e.id,
    created_at: e.created_at,
    admin_id: e.admin_id,
    admin_name: (e.admin as { pen_name?: string; full_name?: string })?.pen_name || 
                (e.admin as { pen_name?: string; full_name?: string })?.full_name || 'Unknown',
    action_type: e.action_type,
    target_type: e.target_type,
    target_id: e.target_id,
    notes: e.notes,
  }));

  return { success: true, data: entries };
}
