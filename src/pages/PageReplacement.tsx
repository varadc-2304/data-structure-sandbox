
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Play, Cpu } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const PageReplacement = () => {
  const algorithms = [
    {
      id: 'fifo',
      name: 'FIFO',
      fullName: 'First-In-First-Out',
      description: 'Replaces the oldest page in memory when a page fault occurs.',
      icon: <FileText size={24} />,
    },
    {
      id: 'lru',
      name: 'LRU',
      fullName: 'Least Recently Used',
      description: 'Replaces the page that has not been used for the longest period of time.',
      icon: <FileText size={24} />,
    },
    {
      id: 'optimal',
      name: 'Optimal',
      fullName: 'Optimal Page Replacement',
      description: 'Replaces the page that will not be used for the longest period of time in the future.',
      icon: <FileText size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-10 text-center">
          <div className="drona-chip mb-3 animate-fade-in">Operating Systems</div>
          <h1 className="text-3xl md:text-5xl font-bold text-drona-dark mb-4 animate-slide-in bg-clip-text text-transparent bg-gradient-to-r from-drona-green to-blue-600">
            Page Replacement Algorithms
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Understand how operating systems manage memory with page replacement algorithms.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-drona-light to-blue-50 rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
            <div className="flex items-start">
              <Cpu className="h-8 w-8 text-drona-green mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-drona-dark mb-3">What are Page Replacement Algorithms?</h2>
                <p className="text-drona-gray mb-3">
                  Page replacement algorithms decide which memory pages to page out, or swap out, when a page of memory needs to be allocated. They are crucial for optimizing the performance of operating systems with virtual memory.
                </p>
                <p className="text-drona-gray">
                  These algorithms aim to reduce the number of page faults that occur in the system, thus improving overall system performance.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {algorithms.map((algorithm, index) => (
              <div 
                key={algorithm.id} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-drona-green/40 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-drona-green/10 text-drona-green mr-3">
                      {algorithm.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-drona-dark">{algorithm.name}</h3>
                      <p className="text-xs text-drona-gray">{algorithm.fullName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-drona-gray flex-grow">{algorithm.description}</p>
                  <div className="mt-4">
                    <Link to={`/memory-management/${algorithm.id}`}>
                      <Button
                        variant="default"
                        className="w-full group hover:bg-drona-green"
                      >
                        <Play className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                        Visualize Algorithm
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageReplacement;
