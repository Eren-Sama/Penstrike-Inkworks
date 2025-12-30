/**
 * Author Manuscripts Queries
 * Real implementations for author manuscripts page
 */

import { createClient } from '@/lib/supabase/client';
import type { AuthorManuscript } from '../mock/authorManuscripts';

/**
 * Get manuscripts for current logged-in author
 * In real mode, returns actual manuscripts from database
 */
export async function getAuthorManuscripts(): Promise<AuthorManuscript[]> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  // Query manuscripts for current user
  const { data: manuscripts, error } = await supabase
    .from('manuscripts')
    .select('*')
    .eq('author_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !manuscripts) {
    console.error('[getAuthorManuscripts] Error:', error);
    return [];
  }

  // Map to AuthorManuscript format
  return manuscripts.map((ms): AuthorManuscript => ({
    id: ms.id,
    title: ms.title || 'Untitled',
    description: ms.description || '',
    status: ms.status || 'DRAFT',
    wordCount: ms.word_count || 0,
    genre: ms.genre ? (Array.isArray(ms.genre) ? ms.genre : [ms.genre]) : [],
    createdAt: ms.created_at,
    updatedAt: ms.updated_at,
    versions: ms.version || 1,
  }));
}
