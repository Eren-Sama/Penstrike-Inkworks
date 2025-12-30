'use client';

import { useState } from 'react';
import {
  User,
  Gear,
  Bell,
  Shield,
  Database,
  Globe,
  EnvelopeSimple,
  FloppyDisk,
  CheckCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const tabs = [
  { id: 'general', label: 'General', icon: Gear },
  { id: 'users', label: 'User Management', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-ink-900">Admin Settings</h1>
        <p className="text-ink-600 mt-1">Configure platform settings and preferences</p>
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
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Platform Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Platform Name</label>
                    <input type="text" defaultValue="Penstrike Inkworks" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Support Email</label>
                    <input type="email" defaultValue="support@penstrike.com" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Default Royalty Rate</label>
                    <select className="select w-full">
                      <option value="60">60%</option>
                      <option value="70" selected>70%</option>
                      <option value="80">80%</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Feature Flags</h2>
                <div className="space-y-4">
                  {[
                    { label: 'AI Cover Generation', enabled: true },
                    { label: 'Audiobook Creation', enabled: true },
                    { label: 'Beta Features', enabled: false },
                    { label: 'Maintenance Mode', enabled: false },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-center justify-between py-3">
                      <span className="font-medium text-ink-900">{feature.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={feature.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-parchment-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSave} className="gap-2">
                  <FloppyDisk weight="duotone" className="h-4 w-4" />
                  Save Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">User Management Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Auto-Approve Authors</label>
                  <select className="select w-full">
                    <option value="no">No - Manual approval required</option>
                    <option value="yes">Yes - Auto-approve all</option>
                    <option value="verified">Only verified email accounts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Free AI Credits for New Authors</label>
                  <input type="number" defaultValue={50} className="input w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">Maximum Books per Author</label>
                  <input type="number" defaultValue={100} className="input w-full" />
                </div>
              </div>
              <Button variant="primary" onClick={handleSave} className="mt-6 gap-2">
                <FloppyDisk weight="duotone" className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
                <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Two-Factor Authentication</label>
                    <select className="select w-full">
                      <option value="optional">Optional for all users</option>
                      <option value="required">Required for admins</option>
                      <option value="all">Required for all users</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Session Timeout (minutes)</label>
                    <input type="number" defaultValue={60} className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-700 mb-2">Maximum Login Attempts</label>
                    <input type="number" defaultValue={5} className="input w-full" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900">Security Audit</p>
                    <p className="text-sm text-amber-700 mt-1">Last security audit: December 15, 2024. All systems passed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-2xl bg-white border border-parchment-200 shadow-card p-8 animate-fade-up">
              <h2 className="font-serif text-xl font-bold text-ink-900 mb-6">Notification Settings</h2>
              <div className="space-y-6">
                {[
                  { label: 'New author registrations', enabled: true },
                  { label: 'New manuscript submissions', enabled: true },
                  { label: 'Report notifications', enabled: true },
                  { label: 'System alerts', enabled: true },
                  { label: 'Daily digest', enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-parchment-100 last:border-0">
                    <span className="font-medium text-ink-900">{item.label}</span>
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
        </div>
      </div>
    </div>
  );
}
