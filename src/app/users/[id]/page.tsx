
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, User, Building, Mail, Shield, Calendar, Activity, BadgeCheck, UserX, BadgeHelp } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const getInitials = (name: string = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const StatusBadge = ({ status }: { status: 'active' | 'pending' | 'deactivated' }) => {
    const statusMap = {
        active: { variant: 'secondary', icon: BadgeCheck, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        pending: { variant: 'default', icon: BadgeHelp, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
        deactivated: { variant: 'destructive', icon: UserX, label: 'Deactivated', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
    }
    const { variant, icon: Icon, label, className } = statusMap[status] || statusMap.pending;

    return (
        <Badge variant={variant as any} className={className}>
            <Icon className="mr-1.5" />
            {label}
        </Badge>
    )
};


function UserDetailPageSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                 </div>
            </CardContent>
        </Card>
    );
}

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  const { users, isLoading } = useSelector((state: RootState) => state.users);
  const user = users.find((u) => u._id === userId);
  
  if (isLoading) {
    return (
        <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
            <UserDetailPageSkeleton />
        </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>User Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The user you are looking for does not exist or could not be found.</p>
            </CardContent>
        </Card>
        <Button variant="outline" asChild>
            <Link href="/users">
                <ArrowLeft className="mr-2" />
                Back to User Management
            </Link>
        </Button>
      </main>
    );
  }
  
  const userImage = user.image && user.image[0] ? user.image[0].url : null;

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-semibold">User Details</h1>
        </div>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border">
              {userImage && <AvatarImage src={userImage} />}
              <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-2xl font-headline flex items-center gap-3">
                    {user.name}
                    <StatusBadge status={user.status} />
                </CardTitle>
                <CardDescription>
                    User profile and information.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex items-center gap-3">
                    <User className="size-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="font-semibold">{user.name}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Mail className="size-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="font-semibold">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Building className="size-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Organization</p>
                        <p className="font-semibold">{user.organizationName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Shield className="size-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Role</p>
                        <p className="font-semibold">{user.roleName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="size-5 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Date Joined</p>
                        <p className="font-semibold">{format(new Date(user.createdAt), 'PPP')}</p>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
