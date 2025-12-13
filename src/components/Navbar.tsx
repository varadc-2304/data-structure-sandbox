
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Moon, Sun, LogOut, User, Chrome } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
      setIsLoginDialogOpen(false);
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

  return (
    <>
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
            <div className="flex items-center min-w-0">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-lg font-bold text-primary">Drona</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
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
                      className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      <item.icon className="mr-1 h-4 w-4" /> {item.title}
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
                      "text-sm font-medium transition-colors hover:text-primary", 
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
              
              {/* Dark mode toggle */}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginDialogOpen(true)}
                  className="h-9"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
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
                <Chrome className="mr-2 h-4 w-4" /> Sign In
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

export default Navbar;
