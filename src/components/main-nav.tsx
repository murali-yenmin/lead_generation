"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AreaChart, Briefcase, Mail, Megaphone } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
  // { href: '/dashboard', icon: <AreaChart />, label: 'Dashboard' },
  { href: "/socialmedia", icon: <Briefcase />, label: "Social Media" },
  { href: "/email", icon: <Mail />, label: "Email" },
  // { href: "/google-ads", icon: <Megaphone />, label: "Google Ads" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              pathname === item.href ||
              (pathname === "/" && item.href === "/socialmedia")
            }
            tooltip={item.label}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
