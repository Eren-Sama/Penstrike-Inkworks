import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/bookstore';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get the user to check account type
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get profile to check account type
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('account_type')
          .eq('id', user.id)
          .single();
        
        // If no profile exists (OAuth signup), create one
        if (profileError || !profile) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
              account_type: user.user_metadata?.account_type || 'reader',
            }, { onConflict: 'id' });
          
          // Default redirect for new OAuth users
          return NextResponse.redirect(`${origin}/bookstore`);
        }
        
        // Redirect based on account type
        if (profile.account_type === 'author') {
          return NextResponse.redirect(`${origin}/author`);
        } else {
          return NextResponse.redirect(`${origin}/bookstore`);
        }
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
