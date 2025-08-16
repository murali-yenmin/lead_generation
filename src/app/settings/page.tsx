
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchRoles,
  updateRolePermissions,
  Role,
} from '@/store/slices/settingsSlice';
import { Settings, Save, Loader2, ShieldAlert } from 'lucide-react';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';


const ALL_PERMISSIONS = [
  { id: '/dashboard', label: 'Dashboard' },
  { id: '/socialmedia', label: 'Social Media' },
  { id: '/email', label: 'Email' },
  { id: '/google-ads', label: 'Google Ads' },
//   { id: '/users', label: 'User Management' },
//   { id: '/settings', label: 'Settings' },
];

function TableSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 border-b">
                    <div className="w-1/4 space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="w-3/4 grid grid-cols-2 sm:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, j) => (
                            <div key={j} className="flex items-center space-x-2">
                                <Skeleton className="size-4" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}


export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { roles: originalRoles, isLoading, isUpdating, error } = useSelector((state: RootState) => state.settings);
  const { toast } = useToast();

  const [localRoles, setLocalRoles] = useState<Role[]>([]);
  
  const hasChanges = useMemo(() => {
    if (localRoles.length === 0 || originalRoles.length === 0) {
      return false;
    }
    return localRoles.some(localRole => {
        const originalRole = originalRoles.find(r => r._id === localRole._id);
        if (!originalRole) return false;
        
        const localPermissions = [...(localRole.permissions || [])].sort();
        const originalPermissions = [...(originalRole.permissions || [])].sort();
        
        return JSON.stringify(localPermissions) !== JSON.stringify(originalPermissions);
    });
  }, [localRoles, originalRoles]);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    // We filter out Super Admin from the list displayed and managed in the UI
    setLocalRoles(originalRoles.filter(role => role.name !== 'Super Admin'));
  }, [originalRoles]);

  const handlePermissionsChange = (roleId: string, permissionId: string, checked: boolean) => {
    setLocalRoles(prevRoles => prevRoles.map(role => {
        if (role._id === roleId) {
            const currentPermissions = role.permissions || [];
            const newPermissions = checked
                ? [...currentPermissions, permissionId]
                : currentPermissions.filter(p => p !== permissionId);
            return { ...role, permissions: newPermissions };
        }
        return role;
    }));
  };
  
  const handleSaveAllChanges = async () => {
    const changedRoles = localRoles.filter(localRole => {
      const originalRole = originalRoles.find(r => r._id === localRole._id);
      if (!originalRole) return false;
      const localPermissions = [...(localRole.permissions || [])].sort();
      const originalPermissions = [...(originalRole.permissions || [])].sort();
      return JSON.stringify(localPermissions) !== JSON.stringify(originalPermissions);
    });

    if (changedRoles.length === 0) {
        toast({ title: 'No changes to save.', variant: 'info' });
        return;
    }

    const updatePromises = changedRoles.map(role => 
        dispatch(updateRolePermissions({ roleId: role._id, permissions: role.permissions }))
    );

    try {
        await Promise.all(updatePromises);
        toast({
            title: 'Permissions Updated',
            description: `Successfully saved changes for ${changedRoles.length} role(s).`,
            variant: 'success'
        });
    } catch (e) {
        toast({
            title: 'Update Failed',
            description: 'An error occurred while saving the permissions.',
            variant: 'destructive'
        });
    }
  };

  const columns = useMemo<ColumnDef<Role>[]>(() => [
    {
        accessorKey: 'name',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.original;
            return (
                <div className="font-medium align-top">
                    <p className="font-semibold">{role.name}</p>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
            const role = row.original;
            return (
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {ALL_PERMISSIONS.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${role._id}-${permission.id}`}
                            checked={(role.permissions || []).includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionsChange(role._id, permission.id, !!checked)}
                            disabled={isUpdating}
                        />
                        <Label
                            htmlFor={`${role._id}-${permission.id}`}
                            className="font-normal"
                        >
                            {permission.label}
                        </Label>
                        </div>
                    ))}
                </div>
            )
        }
    },
  ], [isUpdating, originalRoles]);


  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
        <div className="space-y-2">
            <h1 className="flex items-center gap-2 text-2xl font-headline font-semibold">
                <Settings className="size-8"/>
                Settings
            </h1>
            <p className="text-muted-foreground">
                Manage application-wide settings. Changes will take effect on the user's next login.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Role-Based Access Control</CardTitle>
                <CardDescription>
                    Define which pages each user role can access. The Super Admin role has full access and cannot be modified.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && localRoles.length === 0 ? (
                    <TableSkeleton />
                ) : (
                    <DataTable
                        columns={columns}
                        data={localRoles}
                        isLoading={false} // Loading handled by the skeleton
                        error={error}
                        pageCount={1}
                        currentPage={1}
                        onPageChange={() => {}}
                        currentLimit={localRoles.length || 5}
                        onLimitChange={() => {}}
                        hidePagination={false}
                    >
                        {/* No Toolbar needed for settings */}
                        <div/>
                    </DataTable>
                )}
            </CardContent>
            <CardFooter className="justify-end pt-6">
                <Button onClick={handleSaveAllChanges} disabled={isUpdating || !hasChanges}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save All Changes
                </Button>
            </CardFooter>
        </Card>
    </main>
  );
}
