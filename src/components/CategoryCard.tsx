
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';
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
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  // Google G Logo SVG Component (same as Navbar)
  const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    // Prevent multiple simultaneous sign-in attempts
    if (isSigningIn || isLoading) {
      return;
    }

    setIsSigningIn(true);
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
        setIsSigningIn(false);
        return;
      }

      const result = await signInWithPopup(auth, googleProvider);
      
      // Close dialog immediately after successful sign-in
      setIsDialogOpen(false);
      setIsLoading(false);
      setIsSigningIn(false);
      
      // Wait a bit for auth state to update, then show success message
      setTimeout(() => {
        toast({
          title: "Sign-in Successful",
          description: "Welcome! You have been signed in successfully.",
        });
      }, 100);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Show user-friendly error message
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show error - just close dialog
        setIsDialogOpen(false);
        setIsLoading(false);
        setIsSigningIn(false);
        return;
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
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Multiple popup requests, just close dialog
        setIsDialogOpen(false);
        setIsLoading(false);
        setIsSigningIn(false);
        return;
      } else {
        toast({
          variant: "destructive",
          title: "Sign-in Failed",
          description: error.message || 'An unknown error occurred. Please try again.',
        });
      }
      setIsLoading(false);
      setIsSigningIn(false);
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

    {/* Sign In Dialog - Same as Navbar */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground text-center">
            Welcome to Drona
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access interactive computer science visualizations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
                <GoogleIcon />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Secure</span>
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
