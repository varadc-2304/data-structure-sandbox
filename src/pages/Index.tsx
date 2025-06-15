
import React from 'react';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import { Database, Cpu, MemoryStick, HardDrive, Calculator, Brain, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <Hero />
      
      <div className="page-container py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-drona-dark mb-4">
            Explore Computer Science Concepts
          </h2>
          <p className="text-xl text-drona-gray max-w-3xl mx-auto leading-relaxed">
            Interactive visualizations to help you understand algorithms, data structures, 
            and system concepts through engaging animations and step-by-step explanations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <CategoryCard
            title="Data Structures"
            description="Visualize arrays, linked lists, trees, graphs and understand how data is organized and accessed."
            icon={<Database size={32} />}
            to="/data-structures"
            delay={100}
          />
          <CategoryCard
            title="Algorithms"
            description="Explore sorting, searching, and optimization algorithms with step-by-step animations."
            icon={<Calculator size={32} />}
            to="/algorithms"
            delay={200}
          />
          <CategoryCard
            title="CPU Scheduling"
            description="Learn process scheduling algorithms like FCFS, SJF, Round Robin with interactive Gantt charts."
            icon={<Cpu size={32} />}
            to="/cpu-scheduling"
            delay={300}
          />
          <CategoryCard
            title="Memory Management"
            description="Understand page replacement algorithms including FIFO, LRU, and Optimal with visual simulations."
            icon={<MemoryStick size={32} />}
            to="/page-replacement"
            delay={400}
          />
          <CategoryCard
            title="Disk Scheduling"
            description="Visualize disk scheduling algorithms like SCAN, C-SCAN, LOOK with seek time calculations."
            icon={<HardDrive size={32} />}
            to="/disk-scheduling"
            delay={500}
          />
          <CategoryCard
            title="ECE Algorithms"
            description="Explore electrical engineering algorithms including signal processing and communication systems."
            icon={<Zap size={32} />}
            to="/ece-algorithms"
            delay={600}
          />
          <CategoryCard
            title="AI Algorithms"
            description="Discover machine learning and artificial intelligence algorithms with interactive demonstrations."
            icon={<Brain size={32} />}
            to="/ai-algorithms"
            delay={700}
          />
        </div>
        
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-8 border-2 border-drona-green/20">
            <h3 className="text-2xl font-bold text-drona-dark mb-4">
              Learn by Doing
            </h3>
            <p className="text-lg text-drona-gray max-w-2xl mx-auto">
              Our interactive visualizations make complex concepts easy to understand. 
              Step through algorithms, manipulate data structures, and see real-time results.
            </p>
          </div>
        </div>
        
        {/* Copyright Notice */}
        <div className="mt-16 text-center text-sm text-drona-gray">
          © 2025 Ikshvaku Innovations. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Index;
