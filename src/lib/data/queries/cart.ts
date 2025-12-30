/**
 * Real Data Queries - Cart
 * Supabase query implementations for cart data
 */

import { createClient } from '@/lib/supabase/client';
import type { OrderItem } from '../types';

/**
 * Get current user's cart items for checkout
 */
export async function getCheckoutItems(): Promise<OrderItem[]> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      format,
      book:books!cart_items_book_id_fkey (
        id,
        title,
        price,
        author:profiles!books_author_id_fkey (
          full_name,
          pen_name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !cartItems) {
    console.error('[getCheckoutItems] Supabase error:', error);
    return [];
  }

  const gradients = [
    'from-emerald-600 to-teal-800',
    'from-amber-500 to-orange-700',
    'from-blue-600 to-indigo-800',
    'from-rose-500 to-pink-700',
  ];

  return cartItems.map((item, index): OrderItem => {
    const bookRaw = item.book as unknown;
    const book = Array.isArray(bookRaw) 
      ? (bookRaw as Array<{ id: string; title: string; price: number; author: unknown }>)[0]
      : bookRaw as { id: string; title: string; price: number; author: unknown } | null;
    
    const authorRaw = book?.author as unknown;
    const author = Array.isArray(authorRaw)
      ? (authorRaw as Array<{ full_name: string | null; pen_name: string | null }>)[0]
      : authorRaw as { full_name: string | null; pen_name: string | null } | null;

    return {
      id: item.id,
      bookId: book?.id || '',
      title: book?.title || 'Unknown Book',
      author: author?.pen_name || author?.full_name || 'Unknown Author',
      format: item.format || 'EBOOK',
      price: book?.price || 9.99,
      quantity: item.quantity,
      coverGradient: gradients[index % gradients.length],
    };
  });
}

/**
 * Add item to cart
 */
export async function addToCart(bookId: string, format: string = 'EBOOK', quantity: number = 1): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('[addToCart] No authenticated user');
    return false;
  }

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('book_id', bookId)
    .eq('format', format)
    .single();

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);
    
    if (error) {
      console.error('[addToCart] Update error:', error);
      return false;
    }
  } else {
    // Insert new item
    const { error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        book_id: bookId,
        format,
        quantity,
      });
    
    if (error) {
      console.error('[addToCart] Insert error:', error);
      return false;
    }
  }

  return true;
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[updateCartItemQuantity] Error:', error);
    return false;
  }

  return true;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(itemId: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[removeFromCart] Error:', error);
    return false;
  }

  return true;
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<boolean> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('[clearCart] Error:', error);
    return false;
  }

  return true;
}

/**
 * Get cart item count for badge display
 */
export async function getCartCount(): Promise<number> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return 0;
  }

  const { count, error } = await supabase
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('[getCartCount] Error:', error);
    return 0;
  }

  return count || 0;
}
