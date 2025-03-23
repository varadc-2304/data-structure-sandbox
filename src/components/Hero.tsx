
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-arena-red/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-arena-red/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-24 pb-10 md:pt-28 md:pb-12">
          <div className="text-center">
            <div className="arena-chip mb-3 animate-fade-in">Interactive Visualizations</div>
            <h1 className="text-3xl font-bold tracking-tight text-arena-dark sm:text-4xl md:text-5xl animate-slide-in">
              Visualize &amp; Learn
              <span className="block text-arena-red mt-1">Computer Science Concepts</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-arena-gray sm:text-lg md:mt-3 md:text-xl md:max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Understand data structures and algorithms through interactive visualizations.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/data-structures"
                className="arena-button inline-flex items-center"
              >
                Explore Data Structures
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/cpu-scheduling"
                className="px-6 py-3 bg-white text-arena-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-arena-red/20 inline-flex items-center"
              >
                CPU Scheduling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
