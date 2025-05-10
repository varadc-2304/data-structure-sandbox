
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { List, Cpu, HardDrive, Folder, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Categories Section - Only show if user is logged in */}
      {user ? (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-drona-dark">Explore Categories</h2>
              <p className="mt-4 text-xl text-drona-gray max-w-3xl mx-auto">
                Dive into our comprehensive collection of visualizations across different domains
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CategoryCard
                title="Data Structures"
                description="Visualize arrays, linked lists, stacks, queues, trees, and graphs with interactive operations."
                icon={<List size={24} />}
                to="/data-structures"
                delay={100}
              />
              <CategoryCard
                title="CPU Scheduling"
                description="Learn about different CPU scheduling algorithms through interactive simulations."
                icon={<Cpu size={24} />}
                to="/cpu-scheduling"
                delay={200}
              />
              <CategoryCard
                title="Page Replacement"
                description="Understand how operating systems manage memory with page replacement algorithms like FIFO, LRU, and MRU."
                icon={<Folder size={24} />}
                to="/page-replacement"
                delay={300}
              />
              <CategoryCard
                title="Disk Scheduling"
                description="Explore disk scheduling algorithms such as FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK."
                icon={<HardDrive size={24} />}
                to="/disk-scheduling"
                delay={400}
              />
              <CategoryCard
                title="Algorithms"
                description="Visualize sorting, searching, and problem-solving algorithms like Binary Search, Quick Sort, and Dynamic Programming."
                icon={<Code size={24} />}
                to="/algorithms"
                delay={500}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-drona-dark mb-6">Get Started with Drona</h2>
            <p className="text-xl text-drona-gray max-w-3xl mx-auto mb-8">
              Log in to access our comprehensive collection of interactive visualizations for computer science concepts.
            </p>
            <Link to="/auth">
              <Button size="lg" className="font-semibold">
                Login to Continue
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
