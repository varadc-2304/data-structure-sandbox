
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import { List, Cpu, HardDrive, Folder } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      
      <div className="page-container py-16">
        <div className="mb-12 text-center">
          <div className="drona-chip mb-4">Choose a Category</div>
          <h2 className="section-title text-center">Explore Our Tools</h2>
          <p className="max-w-2xl mx-auto text-drona-gray">
            Interactive visualizations to help you understand complex computer science concepts.
            Select a category to get started.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
        </div>
      </div>
      
      <footer className="bg-drona-light py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-drona-gray">
            <p>© {new Date().getFullYear()} Drona. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
