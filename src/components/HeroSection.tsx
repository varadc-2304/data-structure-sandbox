
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-drona-green/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-drona-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-drona-green/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40 p-3 rounded-full bg-white/50 backdrop-blur-sm shadow-lg">
              <img 
                src="/lovable-uploads/c03333c1-1cd7-4c07-9556-89ea83c71d01.png" 
                alt="Drona Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="drona-chip mb-3 animate-fade-in">Interactive Educational Platform</div>
            <h1 className="text-4xl font-bold tracking-tight text-drona-dark sm:text-5xl md:text-6xl animate-slide-in">
              Visualize &amp; Learn
              <span className="block text-drona-green mt-1">Computer Science Concepts</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-lg text-drona-gray sm:text-xl md:mt-5 md:text-2xl md:max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              An intuitive platform to master data structures, algorithms, and operating system concepts through interactive visualizations.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {user ? (
                <>
                  <Link
                    to="/data-structures"
                    className="drona-button inline-flex items-center"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/algorithms"
                    className="px-6 py-3 bg-white text-drona-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-drona-green/20 inline-flex items-center"
                  >
                    Explore Algorithms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="drona-button inline-flex items-center group"
                  >
                    Start For Free
                    <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    className="px-6 py-3 bg-white text-drona-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-drona-green/20 inline-flex items-center group"
                  >
                    Contact Sales
                    <Mail className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Hero cards (optional visual enhancement) */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {['DS', 'CPU', 'OS', 'Algo'].map((item, i) => (
              <div 
                key={i}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center transition-all hover:shadow-xl hover:border-drona-green/20 hover:-translate-y-1"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="text-xl font-bold text-drona-green">{item}</div>
                <div className="text-sm text-drona-gray mt-2">Visualizer</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Wave SVG divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-[50px] md:h-[70px]"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,37.5L48,46.9C96,56.3,192,74.7,288,74.7C384,74.7,480,56.3,576,46.9C672,37.5,768,37.5,864,46.9C960,56.3,1056,74.7,1152,65.3C1248,56.3,1344,18.8,1392,0L1440,0L1440,75L0,75Z"
            fill="#F5F7F5"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
