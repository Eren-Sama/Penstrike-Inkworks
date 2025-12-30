'use server';

import { createClient } from '@/lib/supabase/server';

// Get user's wishlist
export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated', items: [] };
  }

  const { data: items, error } = await supabase
    .from('wishlists')
    .select(`
      *,
      book:books (
        id,
        title,
        slug,
        price,
        cover_image,
        genre,
        status,
        author:profiles (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, items: [] };
  }

  return { items: items || [] };
}

// Add to wishlist
export async function addToWishlist(bookId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('wishlists')
    .insert({
      user_id: user.id,
      book_id: bookId,
    });

  if (error) {
    if (error.code === '23505') {
      return { error: 'Already in wishlist' };
    }
    return { error: error.message };
  }

  return { success: true };
}

// Remove from wishlist
export async function removeFromWishlist(wishlistItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishlistItemId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Remove from wishlist by book ID
export async function removeFromWishlistByBook(bookId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('book_id', bookId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Check if a book is in wishlist
export async function isInWishlist(bookId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { inWishlist: false };
  }

  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .single();

  return { inWishlist: !!data, wishlistId: data?.id };
}

// Get wishlist count
export async function getWishlistCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0 };
  }

  const { count, error } = await supabase
    .from('wishlists')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    return { count: 0 };
  }

  return { count: count || 0 };
}

// Move wishlist item to cart
export async function moveToCart(wishlistItemId: string, bookId: string, format: string = 'EBOOK') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Add to cart
  const { error: cartError } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      book_id: bookId,
      format,
      quantity: 1,
    }, {
      onConflict: 'user_id,book_id,format'
    });

  if (cartError) {
    return { error: cartError.message };
  }

  // Remove from wishlist
  const { error: wishlistError } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', wishlistItemId)
    .eq('user_id', user.id);

  if (wishlistError) {
    return { error: wishlistError.message };
  }

  return { success: true };
}
