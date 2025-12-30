'use server';

/**
 * Author Server Actions
 * 
 * Author-specific operations that are NOT admin-controlled.
 * These include:
 * - Requesting verification (author can request, NOT approve)
 * - Submitting manuscripts for review (author can submit, NOT publish)
 */

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ============================================================================
// TYPES
// ============================================================================

export type AuthorActionResult<T = void> = 
  | { success: true; data?: T }
  | { success: false; error: string };

// ============================================================================
// HELPER: VERIFY AUTHOR
// ============================================================================

async function verifyAuthor(): Promise<{ isAuthor: true; authorId: string } | { isAuthor: false; error: string }> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { isAuthor: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, account_type')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'author' && profile.account_type !== 'author')) {
    return { isAuthor: false, error: 'Author access required' };
  }

  return { isAuthor: true, authorId: user.id };
}

// ============================================================================
// VERIFICATION ACTIONS
// ============================================================================

/**
 * Request verification as an author
 * Author can REQUEST, but cannot APPROVE their own verification
 */
export async function requestVerification(): Promise<AuthorActionResult> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  // Check current verification status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_verified, verification_requested')
    .eq('id', authorCheck.authorId)
    .single();

  if (profile?.is_verified) {
    return { success: false, error: 'Already verified' };
  }

  if (profile?.verification_requested) {
    return { success: false, error: 'Verification already pending' };
  }

  // Request verification
  const { error } = await supabase
    .from('profiles')
    .update({
      verification_requested: true,
      verification_requested_at: new Date().toISOString(),
    })
    .eq('id', authorCheck.authorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/author/profile');
  revalidatePath('/author/settings');
  return { success: true };
}

/**
 * Cancel verification request
 */
export async function cancelVerificationRequest(): Promise<AuthorActionResult> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({
      verification_requested: false,
      verification_requested_at: null,
    })
    .eq('id', authorCheck.authorId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/author/profile');
  revalidatePath('/author/settings');
  return { success: true };
}

/**
 * Get author's verification status
 */
export async function getVerificationStatus(): Promise<AuthorActionResult<{
  isVerified: boolean;
  isPending: boolean;
  requestedAt: string | null;
  notes: string | null;
}>> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('is_verified, verification_requested, verification_requested_at, verification_notes')
    .eq('id', authorCheck.authorId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: {
      isVerified: data.is_verified || false,
      isPending: data.verification_requested || false,
      requestedAt: data.verification_requested_at,
      notes: data.verification_notes,
    },
  };
}

// ============================================================================
// MANUSCRIPT SUBMISSION ACTIONS
// ============================================================================

/**
 * Submit a manuscript for review
 * Author can SUBMIT, but cannot PUBLISH
 */
export async function submitManuscript(bookId: string): Promise<AuthorActionResult> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  // Verify book belongs to author and is in draft status
  const { data: book } = await supabase
    .from('books')
    .select('id, author_id, status, title')
    .eq('id', bookId)
    .single();

  if (!book) {
    return { success: false, error: 'Book not found' };
  }

  if (book.author_id !== authorCheck.authorId) {
    return { success: false, error: 'Not authorized to submit this book' };
  }

  if (book.status !== 'draft') {
    return { success: false, error: `Cannot submit book with status: ${book.status}` };
  }

  // Submit for review
  const { error } = await supabase
    .from('books')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      // Clear any previous rejection
      rejection_reason: null,
      review_notes: null,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/author/manuscripts');
  revalidatePath('/author/books');
  return { success: true };
}

/**
 * Withdraw manuscript from review
 * Returns it to draft status
 */
export async function withdrawManuscript(bookId: string): Promise<AuthorActionResult> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  // Verify book belongs to author
  const { data: book } = await supabase
    .from('books')
    .select('id, author_id, status')
    .eq('id', bookId)
    .single();

  if (!book) {
    return { success: false, error: 'Book not found' };
  }

  if (book.author_id !== authorCheck.authorId) {
    return { success: false, error: 'Not authorized' };
  }

  // Can only withdraw if submitted or in_review (not if approved/published/rejected)
  if (!['submitted', 'in_review', 'pending'].includes(book.status)) {
    return { success: false, error: `Cannot withdraw book with status: ${book.status}` };
  }

  // Return to draft
  const { error } = await supabase
    .from('books')
    .update({
      status: 'draft',
      submitted_at: null,
      reviewed_at: null,
      reviewed_by: null,
    })
    .eq('id', bookId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/author/manuscripts');
  revalidatePath('/author/books');
  return { success: true };
}

/**
 * Get author's manuscript statuses
 */
export async function getAuthorManuscripts(): Promise<AuthorActionResult<Array<{
  id: string;
  title: string;
  status: string;
  submittedAt: string | null;
  rejectionReason: string | null;
}>>> {
  const authorCheck = await verifyAuthor();
  if (!authorCheck.isAuthor) {
    return { success: false, error: authorCheck.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('books')
    .select('id, title, status, submitted_at, rejection_reason')
    .eq('author_id', authorCheck.authorId)
    .order('updated_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: (data || []).map(b => ({
      id: b.id,
      title: b.title,
      status: b.status,
      submittedAt: b.submitted_at,
      rejectionReason: b.rejection_reason,
    })),
  };
}
