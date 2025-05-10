
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      await signIn(values.email, values.password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Use navigate to redirect to the home page
      navigate('/', { replace: true });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-drona-green/20 to-drona-green/5">
      
      <Card className="p-8 w-full max-w-md bg-white shadow-xl border border-drona-green/10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-28 h-28 p-2 rounded-full bg-drona-green/5 shadow-inner">
              <img 
                src="/lovable-uploads/c03333c1-1cd7-4c07-9556-89ea83c71d01.png" 
                alt="Drona Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-drona-green">Drona</h1>
          <p className="text-gray-500 mt-2">Welcome to the learning visualization platform</p>
        </div>

        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Username" 
                      {...field} 
                      className="border-drona-green/20 focus:border-drona-green focus-visible:ring-drona-green/20" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      {...field} 
                      className="border-drona-green/20 focus:border-drona-green focus-visible:ring-drona-green/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-drona-green hover:bg-drona-green/90 transition-all duration-300 mt-6" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </div>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Auth;
