
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
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/forgot-password', values);

      if (response.status === 200) {
        toast({
            variant: 'success',
            title: 'Password Reset Link Sent',
            description: `If an account exists for ${values.email}, a reset link has been sent. Please check your inbox.`,
        });
        form.reset();
      }

    } catch (error) {
       const errorMessage =
        axios.isAxiosError(error) && error.response
          ? error.response.data.message
          : 'An unexpected error occurred. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Request Failed',
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
            Forgot Your Password?
          </CardTitle>
          <CardDescription>
            No problem. Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        disabled={isLoading || form.formState.isSubmitSuccessful}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || form.formState.isSubmitSuccessful}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Login
          </Link>
        </div>
      </Card>
    </main>
  );
}
