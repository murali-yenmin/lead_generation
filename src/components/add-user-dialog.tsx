
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addUser, fetchOrganizations, fetchTeamsForOrg, createTeam } from '@/store/slices/usersSlice';
import { fetchRoles } from '@/store/slices/settingsSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  organizationId: z.string().min(1, { message: 'Please select an organization.' }),
  roleId: z.string().min(1, { message: 'Please select a role.' }),
  teamId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
  currentUser: {
    roleName: string;
    organizationId: string;
    permissions?: string[]; // Assuming permissions include role level info or similar
    roleLevel?: number; // Let's assume we can get the level
  } | null;
}

export function AddUserDialog({ open, onOpenChange, onUserAdded, currentUser }: AddUserDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { organizations, teams, status } = useSelector((state: RootState) => state.users);
  const { roles } = useSelector((state: RootState) => state.settings);
  
  const [newTeamName, setNewTeamName] = useState('');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      organizationId: '',
      roleId: '',
      teamId: '',
    },
  });

  const isSuperAdmin = currentUser?.roleName === 'Super Admin';
  const currentUserRole = roles.find(role => role.name === currentUser?.roleName);
  const currentUserLevel = currentUserRole?.level || 0;

  const filteredRoles = roles ? roles.filter(role => role.level < currentUserLevel) : [];

  useEffect(() => {
    if (open) {
      if (isSuperAdmin) {
        dispatch(fetchOrganizations());
      } else if (currentUser) {
        form.setValue('organizationId', currentUser.organizationId);
      }
      dispatch(fetchRoles());
    } else {
        form.reset();
    }
  }, [open, isSuperAdmin, currentUser, dispatch, form]);
  
  const selectedOrgId = form.watch('organizationId');

  useEffect(() => {
    if (selectedOrgId) {
        dispatch(fetchTeamsForOrg(selectedOrgId));
    }
  }, [selectedOrgId, dispatch]);

  const handleAddNewTeam = async () => {
    if (!newTeamName.trim() || !selectedOrgId) return;

    try {
        const result = await dispatch(createTeam({ organizationId: selectedOrgId, name: newTeamName })).unwrap();
        toast({
            title: 'Team Created',
            description: `Successfully created the "${newTeamName}" team.`,
            variant: 'success'
        });
        form.setValue('teamId', result._id);
        setNewTeamName('');
    } catch (e: any) {
        toast({
            title: 'Failed to Create Team',
            description: e,
            variant: 'destructive'
        })
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
        await dispatch(addUser(values)).unwrap();
        toast({
            title: 'User Created',
            description: `An invitation has been sent to ${values.email}.`,
            variant: 'success'
        });
        onUserAdded();
    } catch (e: any) {
        toast({
            title: 'Failed to Create User',
            description: e,
            variant: 'destructive'
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details below to invite a new user to the platform.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isSuperAdmin}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map(org => (
                        <SelectItem key={org._id} value={org._id}>{org.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {filteredRoles.map(role => (
                            <SelectItem key={role._id} value={role._id}>{role.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === 'no-team' ? '' : value)} value={field.value || 'no-team'} disabled={!selectedOrgId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="no-team">No Team</SelectItem>
                        {teams.map(team => (
                            <SelectItem key={team._id} value={team._id}>{team.name}</SelectItem>
                        ))}
                        <div className="p-2 mt-2 border-t">
                            <div className="flex items-center gap-2">
                                <Input 
                                    placeholder="New team name..."
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="button" size="sm" onClick={handleAddNewTeam} disabled={!newTeamName.trim()}>
                                    <PlusCircle className="mr-2 size-4" /> Add
                                </Button>
                            </div>
                        </div>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Invite User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
