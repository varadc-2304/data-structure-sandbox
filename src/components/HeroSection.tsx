
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-drona-green/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-drona-green/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-16 md:pt-32 md:pb-20 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 animate-fade-in flex justify-center">
            <div className="relative w-32 h-32 md:w-40 md:h-40">
              <img 
                src="/lovable-uploads/c03333c1-1cd7-4c07-9556-89ea83c71d01.png" 
                alt="Drona Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="text-center">
            <div className="drona-chip mb-3 animate-fade-in">Interactive Visualizations</div>
            <h1 className="text-3xl font-bold tracking-tight text-drona-dark sm:text-4xl md:text-5xl animate-slide-in">
              Visualize &amp; Learn
              <span className="block text-drona-green mt-1">Computer Science Concepts</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-drona-gray sm:text-lg md:mt-3 md:text-xl md:max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              An intuitive platform to master data structures, algorithms, and operating system concepts through interactive visualizations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
