"use client";

import type { Metadata } from "next";
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
import { MainNav } from "@/components/main-nav";
import { Logo } from "@/components/logo";
import { UserProfile } from "@/components/user-profile";
import { ReduxProvider } from "@/store/Provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
});

// Metadata is now static as we are using 'use client'
// To make it dynamic, you would generate it in a child server component
// export const metadata: Metadata = {
//   title: 'SocialAutoPost',
//   description: 'AI-powered lead generation tools',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Social Post</title>
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
          <SidebarProvider>
            <Sidebar collapsible="icon" side="left" variant="sidebar">
              <SidebarHeader>
                <div className="flex items-center gap-2">
                  <Logo className="size-8" />
                  <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">
                   AutoPost 
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
                    AutoPost
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
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
