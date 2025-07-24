
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loginSchema, changePasswordSchema, type LoginFormData, type ChangePasswordFormData } from '@/lib/validation';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate input data
      const formData: LoginFormData = { username, password };
      const validationResult = loginSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      // Sanitize email input
      const sanitizedEmail = username.trim().toLowerCase();

      // Query the auth table using email and password
      const { data: authUser, error } = await supabase
        .from('auth')
        .select('id, email, name, role')
        .eq('email', sanitizedEmail)
        .eq('password', password)
        .single();

      if (error || !authUser) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password",
        });
        return;
      }

      // Set user in context
      setUser({
        id: authUser.id,
        email: authUser.email
      });

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate input data
      const formData: ChangePasswordFormData = { 
        username, 
        currentPassword: password, 
        newPassword 
      };
      const validationResult = changePasswordSchema.safeParse(formData);
      
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      // Sanitize email input
      const sanitizedEmail = username.trim().toLowerCase();

      // First validate current credentials
      const { data: authUser, error: validateError } = await supabase
        .from('auth')
        .select('id')
        .eq('email', sanitizedEmail)
        .eq('password', password)
        .single();

      if (validateError || !authUser) {
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: "Invalid email or current password",
        });
        return;
      }

      // Update password
      const { error: updateError } = await supabase
        .from('auth')
        .update({ password: newPassword })
        .eq('id', authUser.id);

      if (updateError) {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "Failed to update password",
        });
        return;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated",
      });

      // Reset form and go back to login
      setUsername('');
      setPassword('');
      setNewPassword('');
      setErrors({});
      setIsChangePassword(false);
    } catch (error) {
      console.error('Change password error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while changing password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/6f3dd66f-503a-45c3-9ff8-6a169b14f030.png" 
              alt="Drona Logo" 
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-drona-green">
            {isChangePassword ? 'Change Password' : 'Welcome to Drona'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isChangePassword ? handleChangePassword : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your email address"
                required
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {isChangePassword ? 'Current Password' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isChangePassword ? "Enter your current password" : "Enter your password"}
                required
                className={errors.password || errors.currentPassword ? 'border-red-500' : ''}
              />
              {(errors.password || errors.currentPassword) && (
                <p className="text-sm text-red-500">{errors.password || errors.currentPassword}</p>
              )}
            </div>
            {isChangePassword && (
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password (min 8 chars, mixed case, number)"
                  required
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? (isChangePassword ? 'Updating...' : 'Logging in...') 
                : (isChangePassword ? 'Update Password' : 'Login')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsChangePassword(!isChangePassword);
                setUsername('');
                setPassword('');
                setNewPassword('');
                setErrors({});
              }}
              className="text-sm"
            >
              {isChangePassword ? 'Back to Login' : 'Change Password'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
