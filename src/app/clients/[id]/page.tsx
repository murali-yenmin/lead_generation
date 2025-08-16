
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Building, Mail, Globe, Calendar, Users, BadgeCheck, UserX, BadgeHelp, MoreHorizontal, Eye, Settings, Linkedin, Save, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fetchClientById, Client, updateClientSettings } from '@/store/slices/clientsSlice';
import { fetchUsersByOrganization, User } from '@/store/slices/usersSlice';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const getInitials = (name: string = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const settingsFormSchema = z.object({
    socialMediaUrl: z.string().optional(),
    emailUrl: z.string().optional(),
});
type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const StatusBadge = ({ status }: { status: 'active' | 'pending' | 'deactivated' }) => {
    const statusMap = {
        active: { variant: 'secondary', icon: BadgeCheck, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        pending: { variant: 'default', icon: BadgeHelp, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
        deactivated: { variant: 'destructive', icon: UserX, label: 'Deactivated', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
    }
    const statusInfo = statusMap[status] || statusMap.pending;

    return (
        <Badge variant={statusInfo.variant as any} className={statusInfo.className}>
            <statusInfo.icon className="mr-1.5" />
            {statusInfo.label}
        </Badge>
    )
};

function ClientDetailSkeleton() {
    return (
        <div className="space-y-8">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Skeleton className="size-16 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                 <Skeleton className="h-4 w-24" />
                                 <Skeleton className="h-6 w-full" />
                            </div>
                        ))}
                     </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end  pt-6">
                    <Skeleton className="h-10 w-36" />
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { selectedClient, isLoading, error, isUpdatingSettings } = useSelector((state: RootState) => state.clients);
  const { users, isLoading: isLoadingUsers } = useSelector((state: RootState) => state.users);
  
  const settingsForm = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
        socialMediaUrl: '',
        emailUrl: '',
    },
  });

  useEffect(() => {
    if (clientId) {
      dispatch(fetchClientById(clientId));
      dispatch(fetchUsersByOrganization(clientId));
    }
  }, [dispatch, clientId]);
  
  useEffect(() => {
    if (selectedClient) {
        settingsForm.reset({
            socialMediaUrl: selectedClient.settings?.socialMediaUrl || '',
            emailUrl: selectedClient.settings?.emailUrl || '',
        });
    }
  }, [selectedClient, settingsForm]);

  const onSettingsSubmit = async (values: SettingsFormValues) => {
    if (!selectedClient) return;

    const result = await dispatch(updateClientSettings({ clientId: selectedClient._id, settings: values }));

    if (updateClientSettings.fulfilled.match(result)) {
        toast({
            title: 'Settings Saved',
            description: "The client's settings have been updated successfully.",
            variant: 'success'
        });
    } else {
        toast({
            title: 'Save Failed',
            description: result.payload as string || 'An error occurred while saving settings.',
            variant: 'destructive'
        });
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => {
        const user = row.original;
        const userImage = user.image && user.image[0] ? user.image[0].url : null;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              {userImage && <AvatarImage src={userImage} />}
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'roleName',
      header: 'Role',
       cell: ({ row }) => (
        <Badge variant="outline">{row.original.roleName || 'N/A'}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
            <Link href={`/users/${row.original._id}`}>
                <Eye className="mr-2 h-4 w-4"/>
                View
            </Link>
        </Button>
      ),
    },
  ], []);

  if (isLoading || !selectedClient?._id) {
      return (
         <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                    <Link href="/clients"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <Skeleton className="h-6 w-32" />
            </div>
            <ClientDetailSkeleton />
        </main>
      )
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Client Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{error || 'The client you are looking for does not exist.'}</p>
            </CardContent>
        </Card>
        <Button variant="outline" asChild>
            <Link href="/clients">
                <ArrowLeft className="mr-2" />
                Back to Client Management
            </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-xl font-semibold">Client Details</h1>
      </div>
      <div className="space-y-8">
        <Card className="w-full">
            <CardHeader>
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                    <Building className="size-10 text-muted-foreground"/>
                </div>
                <div>
                <CardTitle className="text-2xl font-headline flex items-center gap-3">
                    {selectedClient.name}
                    <StatusBadge status={selectedClient.status} />
                </CardTitle>
                <CardDescription>
                    Client profile and information for {selectedClient.name}.
                </CardDescription>
                </div>
            </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <Globe className="size-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Domain</p>
                            <p className="font-semibold">{selectedClient.domain || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="size-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Date Joined</p>
                            <p className="font-semibold">{format(new Date(selectedClient.createdAt), 'PPP')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="size-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <p className="font-semibold">{users.length}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="size-6"/>
                    Settings
                </CardTitle>
                <CardDescription>
                    Configure organization-specific settings and links.
                </CardDescription>
            </CardHeader>
            <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={settingsForm.control}
                            name="socialMediaUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">                                     
                                        Social Media URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Social Media webhook Path" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={settingsForm.control}
                            name="emailUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">                                         
                                        Email URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Email webhook Path" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="justify-end  pt-6">
                        <Button type="submit" disabled={isUpdatingSettings}>
                           {isUpdatingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           <Save className="mr-2 h-4 w-4" />
                            Save Settings
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>

        <Card>
             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Users className="size-6" />
                    Users in this Organization
                </CardTitle>
                <CardDescription>
                    A list of all users associated with {selectedClient.name}.
                </CardDescription>
             </CardHeader>
             <CardContent>
                <DataTable
                    columns={columns}
                    data={users}
                    isLoading={isLoadingUsers}
                    error={null} // Error handled at page level
                    pageCount={1}
                    currentPage={1}
                    onPageChange={() => {}}
                    currentLimit={users.length || 10}
                    onLimitChange={() => {}}
                    hidePagination={false}
                 >
                   <div />
                </DataTable>
             </CardContent>
        </Card>
      </div>
    </main>
  );
}
