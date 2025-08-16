
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
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from './ui/skeleton';
import { AppDispatch, RootState } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
  
  export function UserProfile() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const getInitials = (name?: string) => {
  if (!name) return ''; // return empty string if name is missing
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};


    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/auth/login');
        router.refresh();
    };

    if (!isAuthenticated || !user) {
        return (
             <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="hidden flex-col items-start md:flex">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                </div>
            </div>
        )
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-full p-1 transition-colors hover:bg-accent">
            <Avatar className="h-8 w-8">
              {user.image && user.image[0] && <AvatarImage src={user.image[0].url} alt={user.name} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col items-start text-left md:flex">
              <span className="text-sm font-medium leading-none">
                Welcome, {user?.name?.split(' ')[0]}
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
