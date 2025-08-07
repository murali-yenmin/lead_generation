
'use client';

import { useEffect, useState } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { Logo } from '@/components/logo';
import { UserProfile } from '@/components/user-profile';
import { ReduxProvider } from '@/store/Provider';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">
              Auto Post

            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2">
            <Logo className="size-8 md:hidden" />
            <h1 className="text-xl font-headline font-semibold md:hidden">
              Auto Post
            </h1>
          </div>
          <div className="flex-1">
            {/* Potentially add breadcrumbs or page title here */}
          </div>
          <UserProfile />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="size-12 animate-pulse" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      console.log(token,"token")
      const isAuth = !!token;
      setIsAuthenticated(isAuth);

      if (!isAuth) {

        router.push('/auth/login');

      }
    } catch (error) {
      setIsAuthenticated(false);
      if (!pathname.startsWith('/auth')) {
        router.push('/auth/login');
      }
    }
  }, [pathname, router]);


  const Layout = isAuthenticated ? AppLayout : AuthLayout;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Auto Post</title>
        <meta name="description" content="AI-powered lead generation tools" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <ReduxProvider>
          {isAuthenticated === null ? (
            <LoadingScreen />
          ) : (
            <Layout>{children}</Layout>
          )}
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
