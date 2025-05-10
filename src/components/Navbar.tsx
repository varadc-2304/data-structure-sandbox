
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, LogOut, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/c03333c1-1cd7-4c07-9556-89ea83c71d01.png" 
                alt="Drona Logo" 
                className="h-10 w-10 object-contain mr-2"
              />
              <span className="text-xl font-bold text-drona-green">Drona</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/data-structures"
                  className={cn(
                    "font-medium transition-colors hover:text-drona-green", 
                    location.pathname.includes('/data-structures') ? 'text-drona-green' : 'text-drona-dark'
                  )}
                >
                  Data Structures
                </Link>
                <Link
                  to="/cpu-scheduling"
                  className={cn(
                    "font-medium transition-colors hover:text-drona-green", 
                    location.pathname.includes('/cpu-scheduling') ? 'text-drona-green' : 'text-drona-dark'
                  )}
                >
                  CPU Scheduling
                </Link>
                <Link
                  to="/page-replacement"
                  className={cn(
                    "font-medium transition-colors hover:text-drona-green", 
                    location.pathname.includes('/page-replacement') ? 'text-drona-green' : 'text-drona-dark'
                  )}
                >
                  Page Replacement
                </Link>
                <Link
                  to="/disk-scheduling"
                  className={cn(
                    "font-medium transition-colors hover:text-drona-green", 
                    location.pathname.includes('/disk-scheduling') ? 'text-drona-green' : 'text-drona-dark'
                  )}
                >
                  Disk Scheduling
                </Link>
                <Link
                  to="/algorithms"
                  className={cn(
                    "font-medium transition-colors hover:text-drona-green", 
                    location.pathname.includes('/algorithms') ? 'text-drona-green' : 'text-drona-dark'
                  )}
                >
                  Algorithms
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center font-medium text-drona-dark hover:text-drona-green transition-colors"
                >
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border border-drona-green text-drona-green hover:bg-drona-green hover:text-white transition-colors"
                  onClick={() => window.scrollTo({ top: document.getElementById('features')?.offsetTop - 100, behavior: 'smooth' })}
                >
                  Features
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center border border-drona-green text-drona-green hover:bg-drona-green hover:text-white transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Sales
                </Button>
                <Link to="/auth">
                  <Button className="flex items-center bg-drona-green hover:bg-drona-green/90">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-drona-dark hover:text-drona-green focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-lg shadow-lg animate-fade-in">
          {user ? (
            <>
              <Link
                to="/data-structures"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                  location.pathname.includes('/data-structures') ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Data Structures
              </Link>
              <Link
                to="/cpu-scheduling"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                  location.pathname.includes('/cpu-scheduling') ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                CPU Scheduling
              </Link>
              <Link
                to="/page-replacement"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                  location.pathname.includes('/page-replacement') ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Page Replacement
              </Link>
              <Link
                to="/disk-scheduling"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                  location.pathname.includes('/disk-scheduling') ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Disk Scheduling
              </Link>
              <Link
                to="/algorithms"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                  location.pathname.includes('/algorithms') ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Algorithms
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-drona-dark hover:bg-drona-green/10 hover:text-drona-green"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.scrollTo({ top: document.getElementById('features')?.offsetTop - 100, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-drona-dark hover:bg-drona-green/10 hover:text-drona-green"
              >
                Features
              </button>
              <button
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-drona-dark hover:bg-drona-green/10 hover:text-drona-green"
              >
                <Mail className="mr-2 h-4 w-4" /> Contact Sales
              </button>
              <Link
                to="/auth"
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-drona-green hover:bg-drona-green/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
