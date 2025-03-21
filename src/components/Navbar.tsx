
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
              <span className="text-xl font-bold text-arena-red">Arena<span className="text-arena-dark">Tools</span></span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/data-structures"
              className={cn(
                "font-medium transition-colors hover:text-arena-red", 
                location.pathname.includes('/data-structures') ? 'text-arena-red' : 'text-arena-dark'
              )}
            >
              Data Structures
            </Link>
            <Link
              to="/cpu-scheduling"
              className={cn(
                "font-medium transition-colors hover:text-arena-red", 
                location.pathname.includes('/cpu-scheduling') ? 'text-arena-red' : 'text-arena-dark'
              )}
            >
              CPU Scheduling
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-arena-dark hover:text-arena-red focus:outline-none"
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
          <Link
            to="/data-structures"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium hover:bg-arena-red/10", 
              location.pathname.includes('/data-structures') ? 'text-arena-red bg-arena-red/5' : 'text-arena-dark'
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Data Structures
          </Link>
          <Link
            to="/cpu-scheduling"
            className={cn(
              "block px-3 py-2 rounded-md text-base font-medium hover:bg-arena-red/10", 
              location.pathname.includes('/cpu-scheduling') ? 'text-arena-red bg-arena-red/5' : 'text-arena-dark'
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            CPU Scheduling
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
