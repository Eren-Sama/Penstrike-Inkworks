import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Middleware runs in Edge Runtime - validate env at module load
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase environment variables in middleware.\n' +
    'Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Type-narrowed constants after validation
const SUPABASE_URL: string = supabaseUrl;
const SUPABASE_ANON_KEY: string = supabaseAnonKey;

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected routes - require authentication
  // Note: '/author' is the author dashboard, '/authors' is the public authors listing page
  const protectedRoutes = ['/author/', '/author', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Exact match for '/author' or starts with '/author/'
    if (route === '/author') {
      return pathname === '/author' || pathname.startsWith('/author/');
    }
    return pathname.startsWith(route);
  });
  
  // Exclude public routes that start with similar patterns
  const publicRoutes = ['/authors'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isPublicRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (user && isProtectedRoute && !isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type, role')
      .eq('id', user.id)
      .single();

    const accountType = profile?.account_type;
    const role = profile?.role;

    // Admin routes - only for admins (check role column)
    if (pathname.startsWith('/admin')) {
      // Check for admin role
      if (role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        url.searchParams.set('error', 'unauthorized');
        return NextResponse.redirect(url);
      }
    }

    // Author routes - only for authors (or admins can access too)
    if (pathname.startsWith('/author') && accountType !== 'author' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/bookstore';
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && user) {
    // Get profile to determine where to redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type, role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();
    // Admins go to admin dashboard, authors to author dashboard, readers to bookstore
    if (profile?.role === 'admin') {
      url.pathname = '/admin';
    } else if (profile?.account_type === 'author') {
      url.pathname = '/author';
    } else {
      url.pathname = '/bookstore';
    }
    return NextResponse.redirect(url);
  }

  // Handle /dashboard redirect based on role
  if (pathname === '/dashboard' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type, role')
      .eq('id', user.id)
      .single();

    const url = request.nextUrl.clone();
    // Admins go to admin dashboard, authors to author dashboard, readers to bookstore
    if (profile?.role === 'admin') {
      url.pathname = '/admin';
    } else if (profile?.account_type === 'author') {
      url.pathname = '/author';
    } else {
      url.pathname = '/bookstore';
    }
    return NextResponse.redirect(url);
  }

  // If not logged in and trying to access /dashboard, redirect to login
  if (pathname === '/dashboard' && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
