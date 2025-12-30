'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  EnvelopeSimple, 
  Lock, 
  Eye, 
  EyeSlash, 
  SpinnerGap,
  User,
  CheckCircle,
  ArrowRight,
  WarningCircle,
  Feather,
  BookOpen,
  EnvelopeOpen,
  At,
  XCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type AccountType = 'reader' | 'author';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<AccountType>(
    roleParam === 'author' ? 'author' : 'reader'
  );
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    penName: '',
    agreeTerms: false,
  });
  
  // Username validation states
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Debounced username check
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('invalid');
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    // Check valid characters (alphanumeric only, no spaces or special chars)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      setUsernameStatus('invalid');
      setUsernameError('Only letters and numbers allowed');
      return;
    }

    if (username.length > 20) {
      setUsernameStatus('invalid');
      setUsernameError('Username must be 20 characters or less');
      return;
    }

    setUsernameStatus('checking');
    setUsernameError(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (error) {
        console.error('Username check error:', error);
        setUsernameStatus('idle');
        return;
      }

      if (data) {
        setUsernameStatus('taken');
        setUsernameError('This username is already taken');
      } else {
        setUsernameStatus('available');
        setUsernameError(null);
      }
    } catch (err) {
      console.error('Username check error:', err);
      setUsernameStatus('idle');
    }
  }, []);

  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsernameAvailability(formData.username);
      } else {
        setUsernameStatus('idle');
        setUsernameError(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, checkUsernameAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.username || usernameStatus !== 'available') {
      setError('Please choose a valid, available username');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    // Pen name is REQUIRED for authors - no exceptions
    if (accountType === 'author' && !formData.penName.trim()) {
      setError('Pen name is required for author accounts');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.username.toLowerCase(),
            account_type: accountType,
            pen_name: accountType === 'author' ? formData.penName : undefined,
          },
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // Check if email confirmation is required OR account created successfully
      if (data.user) {
        // Manually create profile in case trigger doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: formData.email,
            full_name: formData.name,
            username: formData.username.toLowerCase(),
            pen_name: accountType === 'author' ? formData.penName : null,
            account_type: accountType,
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't fail signup if profile creation fails - the trigger might handle it
        }

        // Account created - show success and redirect to login
        setSuccess('Your account has been created successfully! Redirecting to login...');
        
        // Wait 2 seconds then redirect to login
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 2000);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-ink-900">
          Create your account
        </h1>
        <p className="text-ink-600">
          Start your publishing journey today
        </p>
      </div>

      {/* Account Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { type: 'reader' as AccountType, icon: BookOpen, label: 'Reader', desc: 'Discover books' },
          { type: 'author' as AccountType, icon: Feather, label: 'Author', desc: 'Publish books' },
        ].map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => setAccountType(option.type)}
            className={cn(
              'relative p-4 rounded-xl border-2 text-left transition-all duration-300',
              accountType === option.type
                ? 'border-accent-yellow bg-accent-yellow/5 shadow-glow-soft scale-[1.02]'
                : 'border-parchment-200 bg-white hover:border-parchment-300 hover:bg-parchment-50 scale-[0.98] opacity-70'
            )}
          >
            {accountType === option.type && (
              <CheckCircle weight="fill" className="absolute top-3 right-3 h-5 w-5 text-accent-yellow animate-bounce" />
            )}
            <option.icon className={cn(
              'h-6 w-6 mb-2 transition-colors',
              accountType === option.type ? 'text-accent-warm' : 'text-ink-400'
            )} />
            <div className="font-medium text-ink-900">{option.label}</div>
            <div className="text-xs text-ink-500">{option.desc}</div>
          </button>
        ))}
      </div>

      {/* Success Alert */}
      {success && (
        <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <EnvelopeOpen weight="duotone" className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-emerald-900">Check your email</h3>
            <p className="text-sm text-emerald-700">{success}</p>
          </div>
          <Link href="/login" className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline">
            Go to login
          </Link>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <WarningCircle weight="fill" className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form - Hidden when success */}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label className="label">Full name</label>
          <div className="relative group">
            <User weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input pl-12 w-full"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="label">Username</label>
          <div className="relative group">
            <At weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/\s/g, '') }))}
              className={cn(
                "input pl-12 pr-12 w-full",
                usernameStatus === 'available' && 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100',
                (usernameStatus === 'taken' || usernameStatus === 'invalid') && 'border-red-400 focus:border-red-500 focus:ring-red-100'
              )}
              placeholder="yourname"
              maxLength={20}
            />
            {usernameStatus === 'checking' && (
              <SpinnerGap weight="bold" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 animate-spin" />
            )}
            {usernameStatus === 'available' && (
              <CheckCircle weight="fill" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
            )}
            {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
              <XCircle weight="fill" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
            )}
          </div>
          {usernameError && (
            <p className="text-xs text-red-600 animate-fade-in">{usernameError}</p>
          )}
          {usernameStatus === 'available' && (
            <p className="text-xs text-emerald-600 animate-fade-in">Username is available!</p>
          )}
          {usernameStatus === 'idle' && formData.username === '' && (
            <p className="text-xs text-ink-500">Letters and numbers only. 3-20 characters.</p>
          )}
        </div>

        {/* Pen Name (for authors) */}
        {accountType === 'author' && (
          <div className="space-y-2 animate-fade-up">
            <label className="label">Pen name <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Feather weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
              <input
                type="text"
                required
                value={formData.penName}
                onChange={(e) => setFormData(prev => ({ ...prev, penName: e.target.value }))}
                className="input pl-12 w-full"
                placeholder="Your author name (required)"
              />
            </div>
            <p className="text-xs text-ink-500">This will be your public author identity</p>
          </div>
        )}

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
          <label className="label">Password</label>
          <div className="relative group">
            <Lock weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="input pl-12 pr-12 w-full"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
            >
              {showPassword ? <EyeSlash weight="bold" className="h-5 w-5" /> : <Eye weight="bold" className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength */}
          {formData.password && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1.5 flex-1 rounded-full transition-all duration-300',
                      i < strength ? strengthColors[strength - 1] : 'bg-parchment-200'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-500">
                Password strength: <span className={cn(
                  'font-medium',
                  strength >= 3 ? 'text-emerald-600' : strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                )}>{strengthLabels[strength - 1] || 'Too weak'}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="label">Confirm password</label>
          <div className="relative group">
            <Lock weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 group-focus-within:text-accent-yellow transition-colors duration-200" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={cn(
                'input pl-12 w-full',
                formData.confirmPassword && formData.password !== formData.confirmPassword && 'border-red-400'
              )}
              placeholder="Confirm your password"
            />
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <CheckCircle weight="fill" className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
            className="mt-1 w-4 h-4 rounded border-parchment-300 text-accent-yellow focus:ring-accent-yellow/30"
          />
          <label htmlFor="terms" className="text-sm text-ink-600 leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-accent-warm hover:text-accent-amber transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="font-medium text-accent-warm hover:text-accent-amber transition-colors">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary btn-lg justify-center group mt-6"
        >
          {isLoading ? (
            <>
              <SpinnerGap weight="bold" className="h-5 w-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight weight="bold" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
      )}

      {/* Sign In Link */}
      {!success && (
        <p className="text-center text-sm text-ink-600 pt-4">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-accent-warm hover:text-accent-amber transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
