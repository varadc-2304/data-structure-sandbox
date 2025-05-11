
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, LogIn, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-drona-green/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-drona-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-full h-1/3 bg-gradient-to-t from-drona-green/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Content */}
          <div className="flex-1">
            <div className="text-left">
              <div className="drona-chip mb-4 animate-fade-in">Algorithm Visualization Platform</div>
              <h1 className="text-4xl font-bold tracking-tight text-drona-dark sm:text-5xl md:text-6xl animate-slide-in">
                All Your Algorithm Visualizations in One Place
              </h1>
              <p className="mt-6 text-lg text-drona-gray md:text-xl max-w-3xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Simulate Data Structures, CPU Scheduling, Disk Management, and more – with full control and clarity.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {user ? (
                  <>
                    <Link
                      to="/data-structures"
                      className="drona-button inline-flex items-center"
                    >
                      Start Exploring
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to="#how-it-works"
                      className="px-6 py-3 bg-white text-drona-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-drona-green/20 inline-flex items-center"
                    >
                      Learn How It Works
                      <Play className="ml-2 h-4 w-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <a
                      href="#contact-form"
                      className="drona-button inline-flex items-center group"
                    >
                      Contact Sales
                      <Mail className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <Link
                      to="#how-it-works"
                      className="px-6 py-3 bg-white text-drona-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-drona-green/20 inline-flex items-center group"
                    >
                      Learn How It Works
                      <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/auth"
                      className="px-6 py-3 bg-white text-drona-dark border border-gray-200 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:border-drona-green/20 inline-flex items-center group"
                    >
                      Login
                      <LogIn className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Hero visualization graphic */}
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-drona-green/5 rounded-xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full p-4">
                  <div className="border border-drona-green/20 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-drona-green/5 rounded-lg p-2 h-32 overflow-hidden">
                        <div className="text-xs font-semibold text-drona-green mb-1">Data Structures</div>
                        <div className="flex justify-center items-center h-24">
                          <HeroVisualizationBinaryTree />
                        </div>
                      </div>
                      <div className="bg-drona-green/5 rounded-lg p-2 h-32 overflow-hidden">
                        <div className="text-xs font-semibold text-drona-green mb-1">CPU Scheduling</div>
                        <div className="flex justify-center items-center h-24">
                          <HeroVisualizationCPU />
                        </div>
                      </div>
                      <div className="bg-drona-green/5 rounded-lg p-2 h-32 overflow-hidden">
                        <div className="text-xs font-semibold text-drona-green mb-1">Page Replacement</div>
                        <div className="flex justify-center items-center h-24">
                          <HeroVisualizationPage />
                        </div>
                      </div>
                      <div className="bg-drona-green/5 rounded-lg p-2 h-32 overflow-hidden">
                        <div className="text-xs font-semibold text-drona-green mb-1">Disk Scheduling</div>
                        <div className="flex justify-center items-center h-24">
                          <HeroVisualizationDisk />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hero visualization mini-components
const HeroVisualizationBinaryTree = () => (
  <svg width="100" height="80" viewBox="0 0 100 80">
    <circle cx="50" cy="10" r="8" fill="#2E8B57" fillOpacity="0.7" />
    <circle cx="25" cy="35" r="8" fill="#2E8B57" fillOpacity="0.7" />
    <circle cx="75" cy="35" r="8" fill="#2E8B57" fillOpacity="0.7" />
    <circle cx="15" cy="60" r="8" fill="#2E8B57" fillOpacity="0.7" />
    <circle cx="35" cy="60" r="8" fill="#2E8B57" fillOpacity="0.7" />
    <line x1="50" y1="18" x2="25" y2="27" stroke="#2E8B57" strokeWidth="2" />
    <line x1="50" y1="18" x2="75" y2="27" stroke="#2E8B57" strokeWidth="2" />
    <line x1="25" y1="43" x2="15" y2="52" stroke="#2E8B57" strokeWidth="2" />
    <line x1="25" y1="43" x2="35" y2="52" stroke="#2E8B57" strokeWidth="2" />
  </svg>
);

const HeroVisualizationCPU = () => (
  <svg width="100" height="80" viewBox="0 0 100 80">
    <rect x="10" y="10" width="80" height="15" rx="2" fill="#2E8B57" fillOpacity="0.5" />
    <rect x="10" y="30" width="60" height="15" rx="2" fill="#2E8B57" fillOpacity="0.7" />
    <rect x="10" y="50" width="40" height="15" rx="2" fill="#2E8B57" fillOpacity="0.9" />
    <text x="15" y="21" fontSize="8" fill="#333">Process 1</text>
    <text x="15" y="41" fontSize="8" fill="#333">Process 2</text>
    <text x="15" y="61" fontSize="8" fill="#333">Process 3</text>
  </svg>
);

const HeroVisualizationPage = () => (
  <svg width="100" height="80" viewBox="0 0 100 80">
    <rect x="10" y="10" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.6" />
    <rect x="35" y="10" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.8" />
    <rect x="60" y="10" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.4" />
    <rect x="10" y="40" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.5" />
    <rect x="35" y="40" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.9" />
    <rect x="60" y="40" width="20" height="20" rx="2" fill="#2E8B57" fillOpacity="0.7" />
    <text x="17" y="23" fontSize="8" fill="#333">P1</text>
    <text x="42" y="23" fontSize="8" fill="#333">P2</text>
    <text x="67" y="23" fontSize="8" fill="#333">P3</text>
    <text x="17" y="53" fontSize="8" fill="#333">P4</text>
    <text x="42" y="53" fontSize="8" fill="#333">P5</text>
    <text x="67" y="53" fontSize="8" fill="#333">P6</text>
  </svg>
);

const HeroVisualizationDisk = () => (
  <svg width="100" height="80" viewBox="0 0 100 80">
    <circle cx="50" cy="40" r="30" stroke="#2E8B57" strokeWidth="1" fill="none" />
    <circle cx="50" cy="40" r="15" stroke="#2E8B57" strokeWidth="1" fill="#2E8B57" fillOpacity="0.1" />
    <line x1="50" y1="40" x2="75" y2="20" stroke="#2E8B57" strokeWidth="2" />
    <circle cx="50" cy="40" r="3" fill="#2E8B57" />
  </svg>
);

export default HeroSection;
