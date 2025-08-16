
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Skeleton } from '@/components/ui/skeleton';
import { Logo } from '@/components/logo';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // The logic in layout.tsx will handle the final redirection.
        // This is a fallback to prevent flashing the login page.
        router.push('/socialmedia');
      } else {
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
      <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Logo className="size-12 animate-pulse" />
                <Skeleton className="h-8 w-48" />
            </div>
        </div>
  );
}
