
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Moon, Sun, LogOut, User } from 'lucide-react';
import QuizDialog from '@/components/QuizDialog';
import { navigationItems } from '@/config/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Lock } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    navigate('/dashboard');
    setIsMenuOpen(false);
    setIsLogoutDialogOpen(false);
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
      setIsLoginDialogOpen(false);
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
        setIsLoginDialogOpen(false);
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
        setIsLoginDialogOpen(false);
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleQuizClick = () => {
    setIsQuizDialogOpen(true);
    setIsMenuOpen(false);
  };

  // Google G Logo SVG Component
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

  return (
    <>
      {/* Dark mode button - centered between navbar right edge and screen edge */}
      <div className="fixed top-10 right-[3%] z-50 -translate-y-1/2 hidden md:block">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 bg-card/90 backdrop-blur-lg shadow-lg border border-border rounded-lg"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 overflow-hidden rounded-lg',
          'w-[88%]',
          isScrolled 
            ? 'bg-card/90 backdrop-blur-lg shadow-lg border border-border' 
            : 'bg-card/80 backdrop-blur-md shadow-md border border-border/50'
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center min-w-0 flex-1">
              <Link to="/dashboard" className="flex items-center gap-2">
                <img 
                  src="/DronaLogo.png" 
                  alt="Drona Logo" 
                  className="h-6 w-6 object-contain"
                />
                <span className="text-lg font-bold text-primary">Drona</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-3 flex-shrink-0 flex-1 justify-end flex-nowrap min-w-0">
              {navigationItems.map((item) => {
                if (item.title === "Quiz Me") {
                  return (
                    <button
                      key={item.title}
                      onClick={() => {
                        if (!user) {
                          setIsLoginDialogOpen(true);
                        } else {
                          setIsQuizDialogOpen(true);
                        }
                      }}
                      className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <item.icon className="mr-1 h-4 w-4 flex-shrink-0" /> {item.title}
                    </button>
                  );
                }
                
                const handleNavClick = (e: React.MouseEvent) => {
                  if (!user) {
                    e.preventDefault();
                    setIsLoginDialogOpen(true);
                  }
                };
                
                return (
                  <Link
                    key={item.title}
                    to={user ? item.to : '#'}
                    onClick={handleNavClick}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap flex-shrink-0 px-1", 
                      location.pathname.includes(item.pathMatch) 
                        ? 'text-primary' 
                        : 'text-foreground',
                      !user && 'cursor-not-allowed opacity-75'
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
              
              {/* User menu or Login button */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 px-3 gap-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.name || user.email.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || user.email.split('@')[0]}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsLogoutDialogOpen(true)}
                      className="text-red-500 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsLoginDialogOpen(true)}
                  className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap flex-shrink-0 px-1"
                >
                  <GoogleIcon />
                  <span className="hidden sm:inline ml-2">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="block h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-lg shadow-lg border-t border-border animate-fade-in mt-2">
            {navigationItems.map((item) => {
              if (item.title === "Quiz Me") {
                return (
                  <button
                    key={item.title}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (!user) {
                        setIsLoginDialogOpen(true);
                      } else {
                        setIsQuizDialogOpen(true);
                      }
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <item.icon className="mr-2 h-4 w-4" /> {item.title}
                  </button>
                );
              }
              
              const handleNavClick = (e: React.MouseEvent) => {
                setIsMenuOpen(false);
                if (!user) {
                  e.preventDefault();
                  setIsLoginDialogOpen(true);
                }
              };
              
              return (
                <Link
                  key={item.title}
                  to={user ? item.to : '#'}
                  onClick={handleNavClick}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors", 
                    location.pathname.includes(item.pathMatch) 
                      ? 'text-primary bg-primary/5' 
                      : 'text-foreground',
                    !user && 'cursor-not-allowed opacity-75'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </button>
            ) : (
              <button
                onClick={() => setIsLoginDialogOpen(true)}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <GoogleIcon />
                <span className="ml-2">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <QuizDialog 
        isOpen={isQuizDialogOpen} 
        onClose={() => setIsQuizDialogOpen(false)} 
      />

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sign In Dialog */}
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
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

export default Navbar;
