
'use client';

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
import { Eye, EyeOff, Loader2, KeyRound } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

const formSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


type FormValues = z.infer<typeof formSchema>;

function ResetPasswordForm() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true);

        if (!token) {
            toast({
                variant: 'destructive',
                title: 'Missing Token',
                description: 'The password reset token is missing from the URL.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/auth/reset-password', {
                token,
                password: values.password,
            });

            if (response.status === 200) {
                toast({
                    variant: 'success',
                    title: 'Password Reset Successful',
                    description: 'You can now log in with your new password.',
                });
                router.push('/auth/login');
            }
        } catch (error) {
            const errorMessage =
            axios.isAxiosError(error) && error.response
                ? error.response.data.message
                : 'An unexpected error occurred. Please try again.';
            toast({
                variant: 'destructive',
                title: 'Reset Failed',
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 p-4 sm:px-6 md:gap-8 md:p-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl font-headline">
                        {/* <KeyRound className="size-8" /> */}
                        Reset Your Password
                    </CardTitle>
                    <CardDescription>
                       Enter a new password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!token ? (
                        <div className="text-center text-destructive">
                            <p>Error: The reset token is missing or invalid. Please request a new link.</p>
                        </div>
                    ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <div className="relative">
                                    <FormControl>
                                        <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...field}
                                        disabled={isLoading}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <div className="relative">
                                    <FormControl>
                                        <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...field}
                                        disabled={isLoading}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                    </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    </Form>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}


export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
