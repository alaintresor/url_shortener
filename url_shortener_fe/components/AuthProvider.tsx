'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { refreshToken, clearUser } from '@/store/slices/userSlice';
import { useRouter, usePathname } from 'next/navigation';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAppSelector((state) => state.user);

  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Function to check token validity and refresh if needed
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');

      // If no token and not on a public route, redirect to login
      if (!token && !isPublicRoute) {
        dispatch(clearUser());
        router.push('/login');
        return;
      }

      // If we have a token but no user data, try to refresh the token
      if (token && !user && !isPublicRoute) {
        try {
          await dispatch(refreshToken()).unwrap();
        } catch (error) {
          // If refresh fails, clear user and redirect to login
          dispatch(clearUser());
          router.push('/login');
        }
      }
    };

    // Check auth on mount and when pathname changes
    checkAuth();
  }, [dispatch, router, pathname, user, isPublicRoute]);

  // Show loading state while checking authentication
  if (loading && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
} 