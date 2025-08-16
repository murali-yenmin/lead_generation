
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
import { Building, BadgeCheck, BadgeHelp, UserX, MoreHorizontal, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
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
import { fetchClients, setClientsPage, setClientsLimit, setClientsSearchTerm, setClientsStatusFilter, updateClientStatus, Client } from '@/store/slices/clientsSlice';
import { AddClientDialog } from '@/components/add-client-dialog';

export default function ClientsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const { 
    clients, 
    totalClients, 
    page, 
    limit, 
    searchTerm, 
    statusFilter, 
    isLoading,
    updatingClientId,
    error 
  } = useSelector((state: RootState) => state.clients);
  
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [clientToAction, setClientToAction] = useState<{client: Client, action: 'activate' | 'deactivate'} | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  
  const pageCount = Math.ceil(totalClients / limit);

  useEffect(() => {
    if (token) {
        dispatch(fetchClients());
    }
  }, [dispatch, token, page, limit, debouncedSearchTerm, statusFilter]);

  
  const handleActionConfirm = async () => {
      if (!clientToAction) return;
      
      const { client, action } = clientToAction;
      const newStatus = action === 'activate' ? 'active' : 'deactivated';
      
      const result = await dispatch(updateClientStatus({ clientId: client._id, status: newStatus }));
      
      if (updateClientStatus.fulfilled.match(result)) {
        const actionText = action.charAt(0).toUpperCase() + action.slice(1);
        toast({
            title: `Client ${actionText}d`,
            description: `${client.name}'s account has been successfully ${actionText.toLowerCase()}d.`,
            variant: 'success',
        });
      } else {
         toast({
            title: 'Action Failed',
            description: result.payload as string || `Failed to ${action} ${client.name}. Please try again.`,
            variant: 'destructive',
        });
      }

      setClientToAction(null);
  }

  const handleView = (client: Client) => {
      router.push(`/clients/${client._id}`);
  }
  
  const onClientAdded = () => {
    setIsAddClientOpen(false);
    dispatch(fetchClients());
  };

  const columns = useMemo<ColumnDef<Client>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Organization',
      cell: ({ row }) => {
        const client = row.original;
        return (
            <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-muted">
                    <Building className="size-5 text-muted-foreground" />
                </div>
                <p className="font-medium">{client.name}</p>
            </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const client = row.original;
        const isUpdating = updatingClientId === client._id;

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
            deactivated: { variant: 'destructive', icon: UserX, label: 'Deactivated', className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
            pending: { variant: 'default', icon: BadgeHelp, label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
        }
        const statusInfo = statusMap[client.status || 'pending'];

        return (
            <Badge variant={statusInfo.variant as any} className={statusInfo.className}>
                <statusInfo.icon className="mr-1.5" />
                {statusInfo.label}
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
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => {
        const client = row.original;
        const isActive = client.status === 'active';
        const isProtectedClient = client.name === 'Yenmin Communications';
        const isUpdating = updatingClientId === client._id;

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
                    <DropdownMenuItem onClick={() => handleView(client)}>
                        <Eye className="mr-2 h-4 w-4"/>
                        View
                    </DropdownMenuItem>
                    {!isProtectedClient && (
                        <>
                            <DropdownMenuSeparator />
                            {isActive ? (
                                <DropdownMenuItem onClick={() => setClientToAction({client, action: 'deactivate'})} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    <UserX className="mr-2 h-4 w-4"/>
                                    Deactivate
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => setClientToAction({client, action: 'activate'})} className="text-green-600 focus:bg-green-500/10 focus:text-green-700 dark:text-green-400 dark:focus:text-green-400">
                                    <BadgeCheck className="mr-2 h-4 w-4"/>
                                    Activate
                                </DropdownMenuItem>
                            )}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        )
      },
    },
  ], [router, updatingClientId]);
  
  const statusFilterOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'deactivated', label: 'Deactivated' },
  ], []);

  const dialogAction = clientToAction?.action || 'deactivate';
  const dialogActionVerb = dialogAction.charAt(0).toUpperCase() + dialogAction.slice(1);
  const dialogTitle = `${dialogActionVerb} Client?`;
  const dialogDescription = `This will ${dialogAction} the organization ${clientToAction?.client.name}. This will also ${dialogAction} all users within this organization. Are you sure?`;

  return (
    <>
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Building className="size-8" />
            Client Management
          </CardTitle>
          <CardDescription>
            View, search, and manage all client organizations on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <DataTable
            columns={columns}
            data={clients}
            isLoading={isLoading}
            error={error}
            pageCount={pageCount}
            currentPage={page}
            onPageChange={(p) => dispatch(setClientsPage(p))}
            currentLimit={limit}
            onLimitChange={(l) => dispatch(setClientsLimit(l))}
          >
              <DataTableToolbar
                searchTerm={searchTerm}
                onSearchChange={(s) => dispatch(setClientsSearchTerm(s))}
                filters={[
                    {
                        value: statusFilter,
                        onChange: (s) => dispatch(setClientsStatusFilter(s)),
                        placeholder: 'Filter by status',
                        options: statusFilterOptions,
                    }
                ]}
                actions={user?.roleName === 'Super Admin' ? [
                    {
                        label: 'Add Client',
                        onClick: () => setIsAddClientOpen(true),
                    }
                ] : []}
              />
           </DataTable>
        </CardContent>
      </Card>
    </main>
    {user?.roleName === 'Super Admin' && (
      <AddClientDialog
        open={isAddClientOpen}
        onOpenChange={setIsAddClientOpen}
        onClientAdded={onClientAdded}
      />
    )}
    <AlertDialog open={!!clientToAction} onOpenChange={(open) => !open && setClientToAction(null)}>
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
