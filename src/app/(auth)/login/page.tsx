'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnvelopeSimple, Lock, Eye, EyeSlash, SpinnerGap, ArrowRight, WarningCircle, CheckCircle } from '@phosphor-icons/react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  // Check if user just registered
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Account created successfully! Please sign in.');
    }
    if (searchParams.get('error') === 'auth_callback_error') {
      setError('There was an error with the authentication. Please try again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (data.user) {
        // Get user profile to check account type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', data.user.id)
          .single();

        // If no profile exists, create one with default reader role
        if (profileError || !profile) {
          console.log('No profile found, creating default profile...');
          await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || null,
              account_type: data.user.user_metadata?.account_type || 'reader',
            }, { onConflict: 'id' });
          
          // Redirect based on metadata account type
          const accountType = data.user.user_metadata?.account_type || 'reader';
          if (accountType === 'author') {
            router.push('/author');
          } else {
            router.push('/bookstore');
          }
        } else {
          // Redirect based on profile account type
          if (profile.account_type === 'author') {
            router.push('/author');
          } else {
            router.push('/bookstore');
          }
        }
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (oauthError) {
        throw new Error(oauthError.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-ink-900">
          Welcome back
        </h1>
        <p className="text-ink-600">
          Sign in to continue your publishing journey
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <WarningCircle weight="fill" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <label className="label">Email address</label>
          <div className="relative group">
            <EnvelopeSimple weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input pl-12 w-full"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="label mb-0">Password</label>
            <Link href="/forgot-password" className="text-sm font-medium text-accent-warm hover:text-accent-amber transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="input pl-12 pr-12 w-full"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
            >
              {showPassword ? <EyeSlash weight="bold" className="h-5 w-5" /> : <Eye weight="bold" className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            checked={formData.remember}
            onChange={(e) => setFormData(prev => ({ ...prev, remember: e.target.checked }))}
            className="w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow/30"
          />
          <label htmlFor="remember" className="text-sm text-ink-600">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary btn-lg justify-center group"
        >
          {isLoading ? (
            <>
              <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-parchment-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-gradient-to-b from-parchment-50 to-cream-100 text-sm text-ink-500">
            or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="flex items-center justify-center gap-3 px-8 py-3 rounded-xl border border-parchment-300 bg-white hover:bg-parchment-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <SpinnerGap weight="bold" className="h-5 w-5 animate-spin text-ink-500" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span className="text-sm font-medium text-ink-700">
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </span>
        </button>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-ink-600">
        Do not have an account?{' '}
        <Link href="/signup" className="font-semibold text-accent-warm hover:text-accent-amber transition-colors">
          Create one for free
        </Link>
      </p>
    </div>
  );
}
