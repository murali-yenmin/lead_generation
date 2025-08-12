
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserCog, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
  image: z.string().nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine(data => {
    if (data.newPassword && !data.currentPassword) {
        return false;
    }
    return true;
}, {
    message: "Please enter your current password to set a new one.",
    path: ["currentPassword"],
});


type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // In a real application, you'd fetch this from a session or context
  const [user, setUser] = useState({
    name: 'Yenmin Communications',
    email: 'info@yenmin.com',
    image: null as string | null,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      image: user.image,
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    console.log('Profile updated with:', values);
    setUser(prev => ({ ...prev, name: values.name, email: values.email, image: values.image }));
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated.',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        fieldChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <UserCog className="size-8" />
            User Profile
          </CardTitle>
          <CardDescription>
            Manage your account settings and personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
                  <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                          <FormItem className="w-full md:w-48 flex flex-col items-center gap-2">
                              <FormLabel>Profile Picture</FormLabel>
                               <FormControl>
                                  <div className="relative group w-32 h-32">
                                    <Avatar className="h-32 w-32">
                                      {field.value && <AvatarImage src={field.value} alt={form.watch('name')} />}
                                      <AvatarFallback className="text-4xl">{getInitials(form.watch('name'))}</AvatarFallback>
                                    </Avatar>
                                    <label htmlFor="picture" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                                      <Pencil className="w-8 h-8"/>
                                    </label>
                                    <input ref={fileInputRef} id="picture" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, field.onChange)} />
                                  </div>
                                </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />

                  <div className="grid flex-1 gap-6 w-full">
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
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
              </div>

               <div>
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <p className="text-sm text-muted-foreground">Leave these fields blank if you do not want to change your password.</p>
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>

              <Button type="submit">Update Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
