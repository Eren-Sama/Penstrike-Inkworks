'use server';

import { createClient } from '@/lib/supabase/server';

// Get user's cart items
export async function getCartItems() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated', items: [] };
  }

  const { data: items, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      book:books (
        id,
        title,
        slug,
        price,
        cover_image,
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

// Add item to cart
export async function addToCart(bookId: string, format: string = 'EBOOK', quantity: number = 1) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
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
      return { error: error.message };
    }
    return { success: true, message: 'Cart updated' };
  }

  // Add new item
  const { error } = await supabase
    .from('cart_items')
    .insert({
      user_id: user.id,
      book_id: bookId,
      format,
      quantity,
    });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: 'Added to cart' };
}

// Update cart item quantity
export async function updateCartQuantity(itemId: string, quantity: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
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
    return { error: error.message };
  }

  return { success: true };
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Clear cart
export async function clearCart() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Get cart count
export async function getCartCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0 };
  }

  const { count, error } = await supabase
    .from('cart_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    return { count: 0 };
  }

  return { count: count || 0 };
}
