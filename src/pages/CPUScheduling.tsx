
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { Timer, Clock, ListOrdered, RefreshCw } from 'lucide-react';

const cpuSchedulingAlgorithms = [
  {
    title: 'First Come First Serve (FCFS)',
    description: 'Non-preemptive scheduling algorithm that executes processes in order of arrival.',
    icon: <Clock size={24} />,
    to: '/cpu-scheduling/fcfs',
  },
  {
    title: 'Shortest Job First (SJF)',
    description: 'Scheduling algorithm that executes the process with the shortest burst time first. Supports both preemptive and non-preemptive modes.',
    icon: <Timer size={24} />,
    to: '/cpu-scheduling/sjf',
  },
  {
    title: 'Priority Scheduling',
    description: 'Scheduling algorithm that executes processes based on priority values. Supports both preemptive and non-preemptive modes.',
    icon: <ListOrdered size={24} />,
    to: '/cpu-scheduling/priority',
  },
  {
    title: 'Round Robin (RR)',
    description: 'Time-sliced scheduling algorithm that allocates CPU time in turns. Inherently preemptive with configurable time quantum.',
    icon: <RefreshCw size={24} />,
    to: '/cpu-scheduling/round-robin',
  },
];

const CPUScheduling = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-10 text-center">
          <div className="drona-chip mb-3 animate-fade-in">Interactive Visualizers</div>
          <h1 className="text-3xl font-bold text-drona-dark mb-3 animate-slide-in">CPU Scheduling Algorithms</h1>
          <p className="max-w-2xl mx-auto text-drona-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select a CPU scheduling algorithm to visualize how processes are scheduled and executed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {cpuSchedulingAlgorithms.map((algo, index) => (
            <CategoryCard
              key={algo.title}
              title={algo.title}
              description={algo.description}
              icon={algo.icon}
              to={algo.to}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
      
      <footer className="bg-drona-light py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-drona-gray">
            <p>© {new Date().getFullYear()} ArenaTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CPUScheduling;
