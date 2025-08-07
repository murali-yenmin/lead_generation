
'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
  
  export function UserProfile() {
    // In a real application, you'd fetch user data from a session or context
    const user = {
      name: 'Yenmin',
      email: 'info@yenmin.com',
      image: null, // or a URL to an image: 'https://github.com/shadcn.png'
    };
  
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('');
    };
    const router = useRouter();

      const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
        router.push('/auth/login');
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-accent">
            <Avatar className="h-8 w-8">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start text-left md:flex">
              <span className="text-sm font-medium leading-none">
                Welcome, {user.name.split(' ')[0]}
              </span>
              <span className="text-xs leading-none text-muted-foreground">
                {user.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
