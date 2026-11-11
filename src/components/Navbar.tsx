
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, Moon, Sun } from 'lucide-react';
import QuizDialog from '@/components/QuizDialog';
import { navigationItems } from '@/config/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
                      onClick={() => setIsQuizDialogOpen(true)}
                      className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      <item.icon className="mr-1 h-4 w-4 flex-shrink-0" /> {item.title}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap flex-shrink-0 px-1", 
                      location.pathname.includes(item.pathMatch) 
                        ? 'text-primary' 
                        : 'text-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
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
                      setIsQuizDialogOpen(true);
                    }}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <item.icon className="mr-2 h-4 w-4" /> {item.title}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors", 
                    location.pathname.includes(item.pathMatch) 
                      ? 'text-primary bg-primary/5' 
                      : 'text-foreground'
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <QuizDialog 
        isOpen={isQuizDialogOpen} 
        onClose={() => setIsQuizDialogOpen(false)} 
      />
    </>
  );
};

export default Navbar;
