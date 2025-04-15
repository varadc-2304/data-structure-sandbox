
import React from 'react';
import Navbar from '@/components/Navbar';
import { Timer, Clock, ListOrdered, RefreshCw, Cpu, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-10 text-center">
          <div className="drona-chip mb-3 animate-fade-in">Operating Systems</div>
          <h1 className="text-3xl md:text-5xl font-bold text-drona-dark mb-4 animate-slide-in bg-clip-text text-transparent bg-gradient-to-r from-drona-green to-blue-600">
            CPU Scheduling Algorithms
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select a CPU scheduling algorithm to visualize how processes are scheduled and executed.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-drona-light to-blue-50 rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
            <div className="flex items-start">
              <Cpu className="h-8 w-8 text-drona-green mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-drona-dark mb-3">What are CPU Scheduling Algorithms?</h2>
                <p className="text-drona-gray mb-3">
                  CPU scheduling algorithms determine which process gets CPU time, in what order, and for how long. They directly impact system efficiency, throughput, and response times.
                </p>
                <p className="text-drona-gray">
                  Understanding these algorithms is essential for optimizing operating system performance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
            {cpuSchedulingAlgorithms.map((algo, index) => (
              <div 
                key={algo.title} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-drona-green/40 animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start mb-4">
                  <div className="bg-drona-green/10 p-3 rounded-lg text-drona-green mr-4">
                    {algo.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-drona-dark">{algo.title}</h3>
                  </div>
                </div>
                <p className="text-drona-gray text-sm mb-5">{algo.description}</p>
                <Link to={algo.to}>
                  <Button className="w-full group hover:bg-drona-green" variant="default">
                    <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    Visualize Algorithm
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <footer className="bg-drona-light/50 py-6 mt-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-drona-gray text-sm">
              <p>© {new Date().getFullYear()} ArenaTools. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CPUScheduling;
