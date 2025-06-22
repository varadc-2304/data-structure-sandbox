
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import QuizDialog from '@/components/QuizDialog';
import { navigationItems } from '@/config/navigation';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const location = useLocation();

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
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-drona-green">Drona</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                if (item.title === "Quiz Me") {
                  return (
                    <button
                      key={item.title}
                      onClick={() => setIsQuizDialogOpen(true)}
                      className="flex items-center font-medium text-drona-dark hover:text-drona-green transition-colors"
                    >
                      <item.icon className="mr-1 h-4 w-4" /> {item.title}
                    </button>
                  );
                }
                
                return (
                  <Link
                    key={item.title}
                    to={item.to}
                    className={cn(
                      "font-medium transition-colors hover:text-drona-green", 
                      location.pathname.includes(item.pathMatch) ? 'text-drona-green' : 'text-drona-dark'
                    )}
                  >
                    {item.title}
                  </Link>
                );
              })}
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
            {navigationItems.map((item) => {
              if (item.title === "Quiz Me") {
                return (
                  <button
                    key={item.title}
                    onClick={handleQuizClick}
                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-drona-dark hover:bg-drona-green/10 hover:text-drona-green"
                  >
                    <item.icon className="mr-2 h-4 w-4" /> {item.title}
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium hover:bg-drona-green/10", 
                    location.pathname.includes(item.pathMatch) ? 'text-drona-green bg-drona-green/5' : 'text-drona-dark'
                  )}
                  onClick={() => setIsMenuOpen(false)}
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
