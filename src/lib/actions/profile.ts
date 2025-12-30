'use server';

import { createClient } from '@/lib/supabase/server';

// Update user profile
export async function updateUserProfile(data: {
  full_name?: string;
  username?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  goodreads?: string;
  pen_name?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // If username is being updated, check availability
  if (data.username) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', data.username.toLowerCase())
      .neq('id', user.id)
      .single();

    if (existing) {
      return { error: 'Username is already taken' };
    }

    // Ensure username is lowercase
    data.username = data.username.toLowerCase();
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Check username availability
export async function checkUsernameAvailable(username: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!username || username.length < 3) {
    return { available: false, error: 'Username must be at least 3 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { available: false, error: 'Only letters, numbers, and underscores allowed' };
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase())
    .neq('id', user?.id || '')
    .single();

  return { available: !existing };
}

// Update password
export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Upload avatar
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided' };
  }

  const fileExt = file.name.split('.').pop();
  const filePath = `avatars/${user.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id);

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
}

// Get current user profile
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated', profile: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return { error: error.message, profile: null };
  }

  return { profile };
}

// Update notification settings
export async function updateNotificationSettings(settings: {
  email_new_releases?: boolean;
  email_order_updates?: boolean;
  email_newsletter?: boolean;
  email_recommendations?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      notification_settings: settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Update preferences
export async function updatePreferences(preferences: {
  favorite_genres?: string[];
  show_reading_activity?: boolean;
  show_wishlist_public?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Delete account
export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Note: This will cascade delete profile and related data
  // due to the ON DELETE CASCADE constraint
  const { error } = await supabase.auth.admin.deleteUser(user.id);

  if (error) {
    // If admin delete fails, try to delete profile only
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    return { success: true, message: 'Profile deleted. Please contact support to fully delete auth account.' };
  }

  return { success: true };
}
