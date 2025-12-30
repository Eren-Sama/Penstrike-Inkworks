'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  EnvelopeSimple,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Phone,
  FloppyDisk,
  UploadSimple,
  CheckCircle,
  SpinnerGap,
  TwitterLogo,
  InstagramLogo,
  FacebookLogo,
  LinkedinLogo,
  BookOpen,
  Link as LinkIcon,
  Camera,
  Trash
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { uploadAvatarImage, deleteAvatarImage } from '@/lib/data';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment', icon: CreditCard },
];

interface ProfileFormData {
  full_name: string;
  pen_name: string;
  genre: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  twitter: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  goodreads: string;
  avatar_url: string | null;
}

export default function AuthorSettingsPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [originalData, setOriginalData] = useState<ProfileFormData | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    pen_name: '',
    genre: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    twitter: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    goodreads: '',
    avatar_url: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || '');

      // Fetch from canonical columns (NOT JSONB)
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          full_name,
          pen_name,
          bio,
          phone,
          location,
          website,
          twitter,
          instagram,
          facebook,
          linkedin,
          goodreads,
          primary_genre,
          avatar_url
        `)
        .eq('id', user.id)
        .single();

      if (profile) {
        // Read from canonical columns - no JSONB fallbacks
        const profileData = {
          full_name: profile.full_name || '',
          pen_name: profile.pen_name || '',
          genre: profile.primary_genre || '',
          bio: profile.bio || '',
          phone: profile.phone || '',
          location: profile.location || '',
          website: profile.website || '',
          twitter: profile.twitter || '',
          instagram: profile.instagram || '',
          facebook: profile.facebook || '',
          linkedin: profile.linkedin || '',
          goodreads: profile.goodreads || '',
          avatar_url: profile.avatar_url,
        };
        setFormData(profileData);
        setOriginalData(profileData);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    // Pen name is required for authors
    if (!formData.pen_name.trim()) {
      toast.error('Pen name is required for author accounts');
      return;
    }

    // Check if any changes were made
    if (originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      toast.warning('No changes made');
      return;
    }

    setSaving(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSaving(false);
        toast.error('You must be logged in to save changes');
        return;
      }

      // Helper: Convert empty string to null for clean DB storage
      const emptyToNull = (val: string | undefined): string | null => {
        if (!val || val.trim() === '') return null;
        return val.trim();
      };

      // Write to CANONICAL COLUMNS (not JSONB)
      // Note: is_verified is NOT included - it's admin-controlled
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: emptyToNull(formData.full_name),
          pen_name: formData.pen_name.trim(), // Required field
          bio: emptyToNull(formData.bio),
          phone: emptyToNull(formData.phone),
          location: emptyToNull(formData.location),
          website: emptyToNull(formData.website),
          twitter: emptyToNull(formData.twitter),
          instagram: emptyToNull(formData.instagram),
          facebook: emptyToNull(formData.facebook),
          linkedin: emptyToNull(formData.linkedin),
          goodreads: emptyToNull(formData.goodreads),
          primary_genre: emptyToNull(formData.genre),
          // Clear deprecated JSONB to prevent stale data leaks
          social_links: '{}',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        toast.error(`Failed to save profile: ${error.message}`);
        return;
      }

      if (!data) {
        console.error('Profile update returned no data - update may have failed');
        toast.error('Failed to save profile. Please try again.');
        return;
      }

      // Update was successful - fire toast, refresh profile state, update original
      toast.success('Profile saved successfully!');
      setSaved(true);
      setOriginalData({ ...formData });
      setTimeout(() => setSaved(false), 3000);
      
      // Refresh AuthContext profile to update routing source of truth
      await refreshProfile();
    } catch (err) {
      console.error('Unexpected error saving profile:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size on client side for better UX
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
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
    setUploading(false);
    toast.success('Profile photo updated');
  };

  const handleAvatarRemove = async () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <SpinnerGap weight="bold" className="h-8 w-8 animate-spin text-accent-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-ink-900">Settings</h1>
        <p className="text-ink-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-4">
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
                      {formData.full_name?.charAt(0) || formData.pen_name?.charAt(0) || 'A'}
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
                  <label className="block text-sm font-medium text-ink-700 mb-2">Pen Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.pen_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, pen_name: e.target.value }))}
                    placeholder="Your pen name"
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Primary Genre <span className="text-rose-500">*</span></label>
                  <select 
                    value={formData.genre}
                    onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="">Select your genre</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Literary Fiction">Literary Fiction</option>
                    <option value="Horror">Horror</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Historical Fiction">Historical Fiction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Your real name (optional)"
                    className="input w-full" 
                  />
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
                  <label className="block text-sm font-medium text-ink-700 mb-2">Bio</label>
                  <textarea 
                    className="textarea w-full h-32" 
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell readers about yourself, your writing journey, and what inspires your stories..."
                  />
                  <p className="text-xs text-ink-400 mt-1">{formData.bio.length}/500 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe weight="duotone" className="h-4 w-4 text-ink-400" />
                      Website
                    </div>
                  </label>
                  <input 
                    type="url" 
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com" 
                    className="input w-full" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="input w-full" 
                  />
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8 pt-8 border-t border-parchment-200">
                <h3 className="font-serif text-lg font-semibold text-ink-900 mb-4">Social Media & Links</h3>
                <p className="text-sm text-ink-500 mb-6">Connect your social profiles to help readers find you</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <TwitterLogo weight="duotone" className="h-4 w-4 text-ink-400" />
                        Twitter / X
                      </div>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm">@</span>
                      <input 
                        type="text" 
                        value={formData.twitter}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value.replace('@', '') }))}
                        placeholder="username"
                        className="input w-full pl-8" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <InstagramLogo weight="duotone" className="h-4 w-4 text-ink-400" />
                        Instagram
                      </div>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 text-sm">@</span>
                      <input 
                        type="text" 
                        value={formData.instagram}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value.replace('@', '') }))}
                        placeholder="username"
                        className="input w-full pl-8" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FacebookLogo weight="duotone" className="h-4 w-4 text-ink-400" />
                        Facebook
                      </div>
                    </label>
                    <input 
                      type="url" 
                      value={formData.facebook}
                      onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                      placeholder="https://facebook.com/yourpage"
                      className="input w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <LinkedinLogo weight="duotone" className="h-4 w-4 text-ink-400" />
                        LinkedIn
                      </div>
                    </label>
                    <input 
                      type="url" 
                      value={formData.linkedin}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="input w-full" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-700 mb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen weight="duotone" className="h-4 w-4 text-ink-400" />
                        Goodreads Author Page
                      </div>
                    </label>
                    <input 
                      type="url" 
                      value={formData.goodreads}
                      onChange={(e) => setFormData(prev => ({ ...prev, goodreads: e.target.value }))}
                      placeholder="https://goodreads.com/author/show/..."
                      className="input w-full" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-8">
                {saved && (
                  <span className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle weight="fill" className="h-4 w-4" />
                    Changes saved
                  </span>
                )}
                <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2">
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

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Email Address</h2>
                <div className="flex gap-4">
                  <input type="email" defaultValue="alice@example.com" className="input flex-1" />
                  <Button variant="outline">Update Email</Button>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Current Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Confirm New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                </div>
                <Button variant="primary" className="mt-6">Update Password</Button>
              </div>

              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <h2 className="font-serif text-xl font-bold text-rose-900 mb-2">Danger Zone</h2>
                <p className="text-rose-700 mb-4">Permanently delete your account and all associated data.</p>
                <Button variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-100">
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { label: 'New sales', description: 'Get notified when someone purchases your book', enabled: true },
                  { label: 'New reviews', description: 'Get notified when someone leaves a review', enabled: true },
                  { label: 'Manuscript status', description: 'Updates on your manuscript review process', enabled: true },
                  { label: 'Marketing tips', description: 'Receive promotional tips and strategies', enabled: false },
                  { label: 'Newsletter', description: 'Weekly updates from Penstrike Inkworks', enabled: false },
                  { label: 'Payment notifications', description: 'Royalty payments and financial updates', enabled: true },
                ].map((item, index) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-parchment-100 last:border-0">
                    <div>
                      <p className="font-medium text-ink-900">{item.label}</p>
                      <p className="text-sm text-ink-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-parchment-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={handleSave} className="mt-6 gap-2">
                <FloppyDisk weight="duotone" className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Payment Method</h2>
                <div className="p-4 rounded-xl bg-parchment-50 border border-parchment-200 flex items-center gap-4 mb-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    BANK
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink-900">Direct Deposit</p>
                    <p className="text-sm text-ink-500">Account ending in ****4523</p>
                  </div>
                  <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500" />
                </div>
                <Button variant="outline">Update Payment Method</Button>
              </div>

              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Tax Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Tax ID / SSN</label>
                    <input type="text" defaultValue="***-**-4589" className="input w-full" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Tax Form</label>
                    <p className="text-ink-600">W-9 on file (submitted Dec 2023)</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Update Tax Information</Button>
              </div>

              <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-3">
                  <Shield weight="duotone" className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Your information is secure</p>
                    <p className="text-sm text-blue-700 mt-1">All payment and tax information is encrypted and stored securely in compliance with financial regulations.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
