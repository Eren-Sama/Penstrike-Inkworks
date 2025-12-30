'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  EnvelopeSimple,
  Lock,
  Bell,
  Wallet,
  Shield,
  Globe,
  Phone,
  FloppyDisk,
  CheckCircle,
  SpinnerGap,
  Camera,
  Heart,
  BookOpen,
  Eye,
  EyeSlash,
  Gear,
  SignOut,
  Warning,
  At,
  WarningCircle,
  Trash
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';
import { uploadAvatarImage, deleteAvatarImage } from '@/lib/data';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Gear },
];

interface ProfileFormData {
  full_name: string;
  username: string;
  phone: string;
  location: string;
  bio: string;
  avatar_url: string | null;
}

interface NotificationSettings {
  email_new_releases: boolean;
  email_order_updates: boolean;
  email_newsletter: boolean;
  email_recommendations: boolean;
}

interface PreferenceSettings {
  favorite_genres: string[];
  show_reading_activity: boolean;
  show_wishlist_public: boolean;
}

const GENRE_OPTIONS = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 
  'Fantasy', 'Thriller', 'Horror', 'Biography', 'Self-Help',
  'History', 'Poetry', 'Young Adult', 'Children', 'Business'
];

export default function ReaderSettingsPage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [originalUsername, setOriginalUsername] = useState<string>('');
  
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    phone: '',
    location: '',
    bio: '',
    avatar_url: null,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_new_releases: true,
    email_order_updates: true,
    email_newsletter: false,
    email_recommendations: true,
  });

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    favorite_genres: [],
    show_reading_activity: true,
    show_wishlist_public: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Handle auth state
  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      router.push('/login?redirect=/settings');
      return;
    }
    
    // Redirect authors to author settings
    if (authUser.account_type === 'author') {
      router.push('/author/settings');
      return;
    }
    
    // Populate form with auth user data
    setUserEmail(authUser.email || '');
    setOriginalUsername(authUser.username || '');
    setFormData({
      full_name: authUser.full_name || '',
      username: authUser.username || '',
      phone: authUser.phone || '',
      location: authUser.location || '',
      bio: authUser.bio || '',
      avatar_url: authUser.avatar_url || null,
    });
    
    setLoading(false);
  }, [authUser, authLoading, router]);

  // Fetch additional preferences from DB
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!authUser || authLoading) return;
      
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferences, notification_settings')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        // Load preferences if stored
        if (profile.preferences) {
          try {
            const prefs = typeof profile.preferences === 'string' 
              ? JSON.parse(profile.preferences) 
              : profile.preferences;
            setPreferences(prev => ({ ...prev, ...prefs }));
          } catch (e) {
            console.error('Failed to parse preferences:', e);
          }
        }
        
        // Load notification settings if stored
        if (profile.notification_settings) {
          try {
            const notifSettings = typeof profile.notification_settings === 'string'
              ? JSON.parse(profile.notification_settings)
              : profile.notification_settings;
            setNotifications(prev => ({ ...prev, ...notifSettings }));
          } catch (e) {
            console.error('Failed to parse notification settings:', e);
          }
        }
      }
    };

    fetchPreferences();
  }, [authUser, authLoading]);

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Only letters, numbers, and underscores allowed');
      return false;
    }
    
    // If username hasn't changed, it's valid
    if (username === originalUsername) {
      setUsernameError(null);
      return true;
    }
    
    setUsernameChecking(true);
    const supabase = createClient();
    
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .neq('id', authUser?.id || '')
      .single();
    
    setUsernameChecking(false);
    
    if (existing) {
      setUsernameError('Username is already taken');
      return false;
    }
    
    setUsernameError(null);
    return true;
  };

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData(prev => ({ ...prev, username: sanitized }));
    
    // Debounced check
    if (sanitized.length >= 3) {
      const timer = setTimeout(() => {
        checkUsernameAvailability(sanitized);
      }, 500);
      return () => clearTimeout(timer);
    } else if (sanitized.length > 0) {
      setUsernameError('Username must be at least 3 characters');
    } else {
      setUsernameError(null);
    }
  };

  const handleSave = async () => {
    if (!authUser) return;
    
    // Validate username before saving
    if (formData.username && formData.username !== originalUsername) {
      const isValid = await checkUsernameAvailability(formData.username);
      if (!isValid) {
        toast.error('Please fix username errors before saving');
        return;
      }
    }
    
    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        username: formData.username || null,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        preferences: preferences,
        notification_settings: notifications,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authUser.id);

    setSaving(false);
    if (!error) {
      setOriginalUsername(formData.username);
      setSaved(true);
      toast.success('Changes saved successfully');
      refreshProfile();
      setTimeout(() => setSaved(false), 3000);
    } else {
      toast.error('Failed to save changes');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    // Validate file size on client side for better UX
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only images are allowed');
      return;
    }

    setUploading(true);

    // Use the data layer storage function
    const formData = new FormData();
    formData.append('file', file);
    
    const result = await uploadAvatarImage(formData);

    if (!result.success) {
      console.error('Upload error:', result.error);
      toast.error(result.error || 'Failed to upload image');
      setUploading(false);
      return;
    }

    setFormData(prev => ({ ...prev, avatar_url: result.url || null }));
    refreshProfile();
    setUploading(false);
    toast.success('Profile photo updated');
  };

  const handleAvatarRemove = async () => {
    if (!authUser) return;
    
    setRemovingAvatar(true);
    
    const result = await deleteAvatarImage();
    
    if (!result.success) {
      console.error('Remove error:', result.error);
      toast.error(result.error || 'Failed to remove photo');
      setRemovingAvatar(false);
      return;
    }
    
    setFormData(prev => ({ ...prev, avatar_url: null }));
    refreshProfile();
    setRemovingAvatar(false);
    toast.success('Profile photo removed');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword
    });

    setChangingPassword(false);
    
    if (error) {
      toast.error('Failed to update password');
    } else {
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const toggleGenre = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      favorite_genres: prev.favorite_genres.includes(genre)
        ? prev.favorite_genres.filter(g => g !== genre)
        : [...prev.favorite_genres, genre]
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-parchment-100 to-cream-100 flex items-center justify-center py-20">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  if (!authUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-parchment-100 to-cream-100 py-24">
      <div className="container-editorial max-w-6xl mx-auto">
        <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink-900">Account Settings</h1>
            <p className="text-ink-600 mt-1">Manage your profile and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tabs */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-4 sticky top-24">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300',
                        activeTab === tab.id
                          ? 'bg-ink-900 text-white'
                          : 'text-ink-600 hover:bg-parchment-100'
                      )}
                    >
                      <tab.icon weight="duotone" className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Profile Information</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      {formData.avatar_url ? (
                        <img 
                          src={formData.avatar_url} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-yellow to-accent-amber flex items-center justify-center text-white text-3xl font-bold">
                          {formData.full_name?.charAt(0) || 'R'}
                        </div>
                      )}
                      {(uploading || removingAvatar) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <SpinnerGap weight="bold" className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-parchment-300 text-sm font-medium text-ink-700 hover:bg-parchment-100 cursor-pointer transition-colors">
                          <Camera weight="duotone" className="h-4 w-4" />
                          {uploading ? 'Uploading...' : 'Upload Photo'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarUpload}
                            disabled={uploading || removingAvatar}
                          />
                        </label>
                        {formData.avatar_url && (
                          <button
                            onClick={handleAvatarRemove}
                            disabled={uploading || removingAvatar}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash weight="duotone" className="h-4 w-4" />
                            {removingAvatar ? 'Removing...' : 'Remove'}
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-ink-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        placeholder="Your full name"
                        className="input w-full" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <div className="flex items-center gap-2">
                          <At weight="duotone" className="h-4 w-4 text-ink-400" />
                          Username
                        </div>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.username}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          placeholder="your_username"
                          className={cn(
                            "input w-full",
                            usernameError && "border-red-300 focus:ring-red-500",
                            !usernameError && formData.username.length >= 3 && "border-emerald-300 focus:ring-emerald-500"
                          )}
                        />
                        {usernameChecking && (
                          <SpinnerGap weight="bold" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-ink-400" />
                        )}
                        {!usernameChecking && !usernameError && formData.username.length >= 3 && (
                          <CheckCircle weight="fill" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                        )}
                        {!usernameChecking && usernameError && (
                          <WarningCircle weight="fill" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                      {usernameError && (
                        <p className="text-xs text-red-500 mt-1">{usernameError}</p>
                      )}
                      {!usernameError && formData.username.length >= 3 && (
                        <p className="text-xs text-emerald-600 mt-1">Username is available</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <div className="flex items-center gap-2">
                          <EnvelopeSimple weight="duotone" className="h-4 w-4 text-ink-400" />
                          Email
                        </div>
                      </label>
                      <input 
                        type="email" 
                        value={userEmail}
                        disabled
                        className="input w-full bg-parchment-50 cursor-not-allowed" 
                      />
                      <p className="text-xs text-ink-400 mt-1">Email cannot be changed here</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone weight="duotone" className="h-4 w-4 text-ink-400" />
                          Phone Number
                        </div>
                      </label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                        className="input w-full" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        <div className="flex items-center gap-2">
                          <Globe weight="duotone" className="h-4 w-4 text-ink-400" />
                          Location
                        </div>
                      </label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                        className="input w-full" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ink-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us a bit about yourself and your reading interests..."
                        rows={4}
                        className="input w-full resize-none"
                      />
                      <p className="text-xs text-ink-400 mt-1">{formData.bio.length}/500 characters</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-8">
                    {saved && (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle weight="fill" className="h-4 w-4" />
                        Changes saved
                      </span>
                    )}
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-accent"
                    >
                      {saving ? (
                        <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk weight="duotone" className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6 animate-fade-up">
                  {/* Password Change */}
                  <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8">
                    <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Change Password</h2>
                    
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input 
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            className="input w-full pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                          >
                            {showCurrentPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">New Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                            className="input w-full pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                          >
                            {showNewPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-700 mb-2">Confirm New Password</label>
                        <input 
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                          className="input w-full" 
                        />
                      </div>
                      <Button 
                        onClick={handlePasswordChange}
                        disabled={changingPassword || !passwordData.newPassword}
                        className="btn-primary"
                      >
                        {changingPassword ? (
                          <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                        ) : (
                          <Lock weight="duotone" className="h-4 w-4" />
                        )}
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="rounded-2xl bg-white border border-red-200 shadow-card p-8">
                    <h2 className="font-serif text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                      <Warning weight="duotone" className="h-5 w-5" />
                      Danger Zone
                    </h2>
                    <p className="text-ink-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                  <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-parchment-200">
                      <div>
                        <h3 className="font-medium text-ink-900">New Releases</h3>
                        <p className="text-sm text-ink-500">Get notified when your favorite authors release new books</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.email_new_releases}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email_new_releases: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-parchment-200">
                      <div>
                        <h3 className="font-medium text-ink-900">Order Updates</h3>
                        <p className="text-sm text-ink-500">Receive updates about your orders and purchases</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.email_order_updates}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email_order_updates: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-parchment-200">
                      <div>
                        <h3 className="font-medium text-ink-900">Newsletter</h3>
                        <p className="text-sm text-ink-500">Weekly digest of what's new on Penstrike Inkworks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.email_newsletter}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email_newsletter: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div>
                        <h3 className="font-medium text-ink-900">Personalized Recommendations</h3>
                        <p className="text-sm text-ink-500">Book recommendations based on your reading preferences</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={notifications.email_recommendations}
                          onChange={(e) => setNotifications(prev => ({ ...prev, email_recommendations: e.target.checked }))}
                        />
                        <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-8">
                    {saved && (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle weight="fill" className="h-4 w-4" />
                        Changes saved
                      </span>
                    )}
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-accent"
                    >
                      {saving ? (
                        <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk weight="duotone" className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6 animate-fade-up">
                  {/* Favorite Genres */}
                  <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8">
                    <h2 className="font-serif text-xl font-bold text-ink-900 mb-2">Reading Preferences</h2>
                    <p className="text-ink-500 mb-6">Help us recommend books you'll love</p>
                    
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-3">Favorite Genres</label>
                      <div className="flex flex-wrap gap-2">
                        {GENRE_OPTIONS.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={cn(
                              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                              preferences.favorite_genres.includes(genre)
                                ? 'bg-accent-yellow text-ink-900'
                                : 'bg-parchment-100 text-ink-600 hover:bg-parchment-200'
                            )}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8">
                    <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Privacy</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-parchment-200">
                        <div>
                          <h3 className="font-medium text-ink-900">Show Reading Activity</h3>
                          <p className="text-sm text-ink-500">Allow others to see what books you're reading</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.show_reading_activity}
                            onChange={(e) => setPreferences(prev => ({ ...prev, show_reading_activity: e.target.checked }))}
                          />
                          <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-medium text-ink-900">Public Wishlist</h3>
                          <p className="text-sm text-ink-500">Allow others to see your book wishlist</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={preferences.show_wishlist_public}
                            onChange={(e) => setPreferences(prev => ({ ...prev, show_wishlist_public: e.target.checked }))}
                          />
                          <div className="w-11 h-6 bg-parchment-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-yellow"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    {saved && (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle weight="fill" className="h-4 w-4" />
                        Changes saved
                      </span>
                    )}
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-accent"
                    >
                      {saving ? (
                        <SpinnerGap weight="bold" className="h-4 w-4 animate-spin" />
                      ) : (
                        <FloppyDisk weight="duotone" className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Warning weight="fill" className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-900">Delete Account</h3>
                <p className="text-sm text-ink-500">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-ink-600 mb-6">
              Are you sure you want to delete your account? All your data, including purchased books, 
              reviews, and reading history will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </Button>
              <Button 
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  // Delete account logic here
                  toast.error('Account deletion requires email confirmation. Please contact support.');
                  setShowDeleteModal(false);
                }}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
