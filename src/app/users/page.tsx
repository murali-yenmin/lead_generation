

'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BadgeCheck, BadgeHelp, Building, MoreHorizontal, Eye, UserX, AlertTriangle, UserCheck, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { fetchUsers, setPage, setLimit, setSearchTerm, setRoleFilter, setStatusFilter, updateUserStatus } from '@/store/slices/usersSlice';
import { AddUserDialog } from '@/components/add-user-dialog';
import { Role } from '@/store/slices/settingsSlice';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  roleName: string;
  organizationName: string;
  status: 'active' | 'pending' | 'deactivated';
  createdAt: string;
  image?: { name: string, url: string }[] | null;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { 
    users, 
    totalUsers, 
    page, 
    limit, 
    searchTerm, 
    roleFilter, 
    statusFilter, 
    isLoading,
    updatingUserId,
    error 
  } = useSelector((state: RootState) => state.users);
  
  const { user: currentUser, token } = useSelector((state: RootState) => state.auth);
  const { roles: allRoles } = useSelector((state: RootState) => state.settings);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<{user: User, action: 'activate' | 'deactivate'} | null>(null);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  
  const pageCount = Math.ceil(totalUsers / limit);

  useEffect(() => {
    if (token) {
        dispatch(fetchUsers());
    }
  }, [dispatch, token, page, limit, debouncedSearchTerm, roleFilter, statusFilter]);

  const roles = useMemo(() => {
    return allRoles.map(r => r.name);
  }, [allRoles]);
  
  const handleActionConfirm = async () => {
      if (!userToAction) return;
      
      const { user, action } = userToAction;
      const newStatus = action === 'activate' ? 'active' : 'deactivated';
      
      const result = await dispatch(updateUserStatus({ userId: user._id, status: newStatus }));
      
      if (updateUserStatus.fulfilled.match(result)) {
        const actionText = action.charAt(0).toUpperCase() + action.slice(1);
        toast({
            title: `User ${actionText}d`,
            description: `${user.name}'s account has been successfully ${actionText.toLowerCase()}d.`,
            variant: 'success',
        });
      } else {
         toast({
            title: 'Action Failed',
            description: result.payload as string || `Failed to ${action} ${user.name}. Please try again.`,
            variant: 'destructive',
        });
      }

      setUserToAction(null);
  }

  const handleView = (user: User) => {
      router.push(`/users/${user._id}`);
  }

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
        accessorKey: 'organizationName',
        header: 'Organization',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Building className="size-4 text-muted-foreground" />
                <span>{row.original.organizationName || 'N/A'}</span>
            </div>
        )
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
      cell: ({ row }) => {
        const user = row.original;
        const isUpdating = updatingUserId === user._id;

        if (isUpdating) {
            return (
                <Badge variant="outline" className="animate-pulse">
                    <Loader2 className="mr-1.5 animate-spin" />
                    Updating...
                </Badge>
            )
        }

        const statusMap = {
            active: { variant: 'secondary', icon: BadgeCheck, label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
            pending: { variant: 'default', icon: BadgeHelp, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
            deactivated: { variant: 'destructive', icon: UserX, label: 'Deactivated', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
        }
        const { variant, icon: Icon, label, className } = statusMap[user.status] || statusMap.pending;

        return (
            <Badge variant={variant as any} className={className}>
                <Icon className="mr-1.5" />
                {label}
            </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Date Joined',
      cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
    },
     {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const user = row.original;
        const isSuperAdmin = user.roleName === 'Super Admin';
        const isActive = user.status === 'active';
        const isUpdating = updatingUserId === user._id;

        return (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleView(user)}>
                        <Eye className="mr-2 h-4 w-4"/>
                        View
                    </DropdownMenuItem>
                    {!isSuperAdmin && <DropdownMenuSeparator />}
                    {!isSuperAdmin && (
                        <>
                        {isActive ? (
                             <DropdownMenuItem onClick={() => setUserToAction({user, action: 'deactivate'})} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <UserX className="mr-2 h-4 w-4"/>
                                Deactivate Account
                            </DropdownMenuItem>
                        ) : (
                             <DropdownMenuItem onClick={() => setUserToAction({user, action: 'activate'})} className="text-green-600 focus:bg-green-500/10 focus:text-green-700 dark:text-green-400 dark:focus:text-green-400">
                                <UserCheck className="mr-2 h-4 w-4"/>
                                Activate Account
                            </DropdownMenuItem>
                        )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        )
      },
    },
  ], [roles, router, updatingUserId]);
  
  const roleFilterOptions = useMemo(() => [
      { value: 'all', label: 'All Roles' },
      ...roles.map(role => ({ value: role, label: role }))
  ], [roles]);

  const statusFilterOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'deactivated', label: 'Deactivated' },
  ], []);

  const onUserAdded = () => {
    setIsAddUserOpen(false);
    dispatch(fetchUsers());
  }

  const dialogAction = userToAction?.action || 'deactivate';
  const dialogActionVerb = dialogAction.charAt(0).toUpperCase() + dialogAction.slice(1);
  const dialogTitle = `${dialogActionVerb} Account?`;
  const dialogDescription = `This will ${dialogAction} the account for ${userToAction?.user.name} (${userToAction?.user.email}). They will ${dialogAction === 'deactivate' ? 'lose all' : 'regain'} access to the platform. Are you sure?`;

  return (
    <>
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Users className="size-8" />
            User Management
          </CardTitle>
          <CardDescription>
            View, search, and manage all users in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            error={error}
            pageCount={pageCount}
            currentPage={page}
            onPageChange={(p) => dispatch(setPage(p))}
            currentLimit={limit}
            onLimitChange={(l) => dispatch(setLimit(l))}
          >
              <DataTableToolbar
                searchTerm={searchTerm}
                onSearchChange={(s) => dispatch(setSearchTerm(s))}
                filters={[
                    {
                        value: roleFilter,
                        onChange: (r) => dispatch(setRoleFilter(r)),
                        placeholder: 'Filter by role',
                        options: roleFilterOptions,
                    },
                    {
                        value: statusFilter,
                        onChange: (s) => dispatch(setStatusFilter(s)),
                        placeholder: 'Filter by status',
                        options: statusFilterOptions,
                    }
                ]}
                actions={[
                    {
                        label: 'Add user',
                        onClick: () => setIsAddUserOpen(true),
                    }
                ]}
              />
           </DataTable>
        </CardContent>
      </Card>
    </main>
     <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onUserAdded={onUserAdded}
        currentUser={currentUser}
      />
      <AlertDialog open={!!userToAction} onOpenChange={(open) => !open && setUserToAction(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className={dialogAction === 'deactivate' ? 'text-destructive' : 'text-green-500'} />
                {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>
                {dialogDescription}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleActionConfirm}
                className={dialogAction === 'deactivate' 
                    ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    : "bg-green-600 hover:bg-green-600/90 text-white"
                }
            >
                {dialogActionVerb}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
