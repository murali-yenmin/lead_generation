"use client";

import { useEffect, useState } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MainNav, defaultNavItems } from "@/components/main-nav";
import { Logo } from "@/components/logo";
import { UserProfile } from "@/components/user-profile";
import { ReduxProvider } from "@/store/Provider";
import { usePathname, useRouter } from "next/navigation"; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { checkInitialAuth } from "@/store/slices/authSlice";
import { LoadingScreen } from "@/components/loadingScreen";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
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



function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(checkInitialAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage = pathname.startsWith("/auth");

    if (isAuthenticated && user) {
      if (isAuthPage || pathname === "/") {
        // Filter sidebar menu based on user permissions
        const userPermissions =
          user.roleName === "Super Admin"
            ? defaultNavItems.map((item) => item.permission)
            : user.permissions || [];

        // Find the first sidebar item the user has permission for
        const firstAllowedNav = defaultNavItems.find((item) =>
          userPermissions.includes(item.permission)
        );

        if (firstAllowedNav) router.push(firstAllowedNav?.href);
      }
    } else {
      if (!isAuthPage) router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);
 

  if (!isAuthenticated && !pathname.startsWith("/auth")) {
    return <LoadingScreen />;
  }

  if (isAuthenticated && (pathname.startsWith("/auth") || pathname === "/")) {
    return <LoadingScreen />;
  }

  const Layout = isAuthenticated ? AppLayout : AuthLayout;

  return <Layout>{children}</Layout>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Auto Post</title>
        <meta name="description" content="AI-powered lead generation tools" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <ReduxProvider>
          <RootLayoutContent>{children}</RootLayoutContent>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
