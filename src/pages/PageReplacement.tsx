
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';

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
      id: 'mru',
      name: 'MRU',
      fullName: 'Most Recently Used',
      description: 'Replaces the page that has been used most recently when a page fault occurs.',
      icon: <FileText size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-8 text-center">
          <div className="drona-chip mb-3">Operating Systems</div>
          <h1 className="text-3xl md:text-4xl font-bold text-drona-dark">Page Replacement Algorithms</h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray">
            Understand how operating systems manage memory with page replacement algorithms.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-drona-light rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold text-drona-dark mb-3">What are Page Replacement Algorithms?</h2>
            <p className="text-drona-gray mb-3">
              Page replacement algorithms decide which memory pages to page out, or swap out, when a page of memory needs to be allocated. They are crucial for optimizing the performance of operating systems with virtual memory.
            </p>
            <p className="text-drona-gray">
              These algorithms aim to reduce the number of page faults that occur in the system, thus improving overall system performance.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {algorithms.map((algorithm) => (
              <Link 
                key={algorithm.id} 
                to={`/page-replacement/${algorithm.id}`} 
                className="drona-card block"
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
                  <div className="mt-4 flex items-center text-drona-green font-medium text-sm">
                    Visualize <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageReplacement;
