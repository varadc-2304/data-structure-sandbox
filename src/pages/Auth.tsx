
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@drona.com',
      password: 'password123',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsLoggingIn(true);
      

      
      // If successful, update last_login in users table
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();
      
      if (userData) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('email', values.email);
      }
      
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Login process error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2 bg-clip-text text-transparent bg-gradient-to-r from-drona-green to-blue-600">
            Login to Drona
          </h1>
          <p className="text-drona-gray">
            Access your personalized visualization tools
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your@email.com" 
                      {...field} 
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••" 
                      {...field} 
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-11 mt-6"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-drona-gray">
            Demo credentials are pre-filled for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
