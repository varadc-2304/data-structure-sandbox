
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Chrome } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  delay?: number;
}

const CategoryCard = ({ title, description, icon, to, className, delay = 0 }: CategoryCardProps) => {
  const { user, setUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Validate Firebase config before attempting sign-in
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      if (!apiKey || apiKey === 'your-api-key') {
        toast({
          variant: "destructive",
          title: "Configuration Error",
          description: "Firebase is not properly configured. Please check your environment variables.",
        });
        setIsLoading(false);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      console.log('Sign-in successful:', result.user);
      // Firebase auth state listener will automatically update the user state
      // No need to manually call setUser
      setIsDialogOpen(false);
      setIsLoading(false);
      
      toast({
        title: "Sign-in Successful",
        description: "Welcome! You have been signed in successfully.",
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Show user-friendly error message
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error
        console.log('User closed the popup');
      } else if (error.code === 'auth/popup-blocked') {
        toast({
          variant: "destructive",
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
        });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast({
          variant: "destructive",
          title: "Unauthorized Domain",
          description: "This domain is not authorized. Please check Firebase configuration.",
        });
      } else if (error.code === 'auth/network-request-failed') {
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Please check your internet connection and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sign-in Failed",
          description: error.message || 'An unknown error occurred. Please try again.',
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link 
        to={user ? to : '#'}
        onClick={handleClick}
        className={cn(
          "group bg-card rounded-lg p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300 block h-full section-shadow hover:scale-[1.02]",
          className
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all duration-300 group-hover:scale-110 section-shadow">
            <div className="text-primary group-hover:text-primary-foreground transition-colors duration-300">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground flex-grow mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="text-primary font-medium flex items-center text-sm mt-auto group-hover:gap-2 transition-all duration-300">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>

    {/* Sign In Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground text-center">
            Welcome to Drona
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to access interactive computer science visualizations
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-primary" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-primary" />
              <span>Encrypted</span>
            </div>
          </div>
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full h-12 text-base flex items-center justify-center gap-3"
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Chrome className="h-5 w-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default CategoryCard;
