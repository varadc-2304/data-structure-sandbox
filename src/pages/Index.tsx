
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { List, Cpu, HardDrive, Folder, Code } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container py-16 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
  );
};

export default Index;
