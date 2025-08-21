"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Skeleton } from "@/components/ui/skeleton"; 
import { defaultNavItems } from "@/components/main-nav";
import { Logo } from "@/components/logo";

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const pathname = usePathname();

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

        if (firstAllowedNav) {
          router.push(firstAllowedNav.href);
        }
      }
    } else {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Logo className="h-12 w-12 animate-spin" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}
