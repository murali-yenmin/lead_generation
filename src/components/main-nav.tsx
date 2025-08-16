
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AreaChart, Briefcase, Mail, Megaphone, Users, Settings, Building } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const defaultNavItems = [
  // { href: '/dashboard', label: 'Dashboard', icon: <AreaChart />, permission: '/dashboard' },
  { href: '/socialmedia', label: 'Social Media', icon: <Briefcase />, permission: '/socialmedia' },
  { href: '/email', label: 'Email', icon: <Mail />, permission: '/email' },
  { href: '/google-ads', label: 'Google Ads', icon: <Megaphone />, permission: '/google-ads' },
  { href: '/users', label: 'Users', icon: <Users />, permission: '/users' },
  { href: '/clients', label: 'Clients', icon: <Building />, permission: '/clients' },
  { href: '/settings', label: 'Settings', icon: <Settings />, permission: '/settings' },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  // In a real app, permissions would come from the user's role, fetched from the backend.
  // For now, we'll simulate it. Super Admins see everything.
  // This would be replaced with something like `user.role.permissions`
  const userPermissions = user?.roleName === 'Super Admin' 
    ? defaultNavItems.map(item => item.permission) 
    : user?.permissions || [];

  const navItems = defaultNavItems.filter(item => userPermissions.includes(item.permission));


  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
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
