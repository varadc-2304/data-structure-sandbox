
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { List, Cpu, HardDrive, Folder, Code, Sparkles, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />
      
      <div className="page-container py-20 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="drona-chip mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4 inline mr-2" />
            Learning Made Visual
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gradient mb-6 animate-slide-in leading-tight">
            Master Computer Science
          </h1>
          <p className="max-w-4xl mx-auto text-xl text-drona-gray leading-relaxed animate-fade-in font-medium" style={{ animationDelay: '0.2s' }}>
            Dive into interactive visualizations of data structures, algorithms, and operating system concepts.
            <span className="block mt-2 text-drona-green font-bold">Learn by seeing, understand by doing.</span>
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <CategoryCard
            title="Data Structures"
            description="Visualize arrays, linked lists, stacks, queues, trees, and graphs with interactive operations and real-time animations."
            icon={<List size={28} />}
            to="/data-structures"
            delay={100}
          />
          <CategoryCard
            title="CPU Scheduling"
            description="Learn about different CPU scheduling algorithms through interactive simulations and performance comparisons."
            icon={<Cpu size={28} />}
            to="/cpu-scheduling"
            delay={200}
          />
          <CategoryCard
            title="Page Replacement"
            description="Understand how operating systems manage memory with page replacement algorithms like FIFO, LRU, and MRU."
            icon={<Folder size={28} />}
            to="/page-replacement"
            delay={300}
          />
          <CategoryCard
            title="Disk Scheduling"
            description="Explore disk scheduling algorithms such as FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK with visual head movements."
            icon={<HardDrive size={28} />}
            to="/disk-scheduling"
            delay={400}
          />
          <CategoryCard
            title="Algorithms"
            description="Visualize sorting, searching, and problem-solving algorithms like Binary Search, Quick Sort, and Dynamic Programming."
            icon={<Code size={28} />}
            to="/algorithms"
            delay={500}
          />
          <CategoryCard
            title="ECE Algorithms"
            description="Explore Electrical and Computer Engineering algorithms including the Viterbi Algorithm for optimal sequence detection."
            icon={<Zap size={28} />}
            to="/ece-algorithms"
            delay={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
