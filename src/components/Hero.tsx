
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden hero-gradient">
      {/* Enhanced background elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-radial from-drona-green/10 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-radial from-drona-green/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-radial from-blue-500/5 to-transparent rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="text-center">
            <div className="drona-chip mb-6 animate-bounce-in">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Interactive Visualizations
            </div>
            <h1 className="text-4xl font-black tracking-tight text-drona-dark sm:text-5xl md:text-7xl animate-slide-in leading-tight">
              Visualize &amp; Learn
              <span className="block text-gradient mt-2">Computer Science</span>
            </h1>
            <p className="mt-6 max-w-4xl mx-auto text-xl text-drona-gray sm:text-2xl md:mt-8 leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.2s' }}>
              Master data structures and algorithms through 
              <span className="text-drona-green font-bold"> immersive interactive visualizations</span> 
              that make complex concepts crystal clear.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link
                to="/data-structures"
                className="group px-10 py-5 bg-gradient-to-r from-drona-green to-drona-green/90 text-white rounded-2xl font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center text-lg border border-drona-green/20 backdrop-blur-sm"
              >
                Explore Data Structures
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/page-replacement"
                className="group px-10 py-5 bg-white/80 text-drona-dark border-2 border-drona-green/30 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-drona-green/5 hover:border-drona-green/50 backdrop-blur-sm inline-flex items-center text-lg"
              >
                Page Replacement
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
