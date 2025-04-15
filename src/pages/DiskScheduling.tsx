
import React from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, Play, Disc } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const DiskScheduling = () => {
  const algorithms = [
    {
      id: 'fcfs',
      name: 'FCFS',
      fullName: 'First-Come-First-Served',
      description: 'Services disk requests in the order they arrive without any optimization.',
      icon: <HardDrive size={24} />,
    },
    {
      id: 'sstf',
      name: 'SSTF',
      fullName: 'Shortest Seek Time First',
      description: 'Selects the disk request that requires the least head movement from the current position.',
      icon: <HardDrive size={24} />,
    },
    {
      id: 'scan',
      name: 'SCAN',
      fullName: 'Elevator Algorithm',
      description: 'Moves the disk head in one direction until all requests are serviced, then changes direction.',
      icon: <HardDrive size={24} />,
    },
    {
      id: 'c-scan',
      name: 'C-SCAN',
      fullName: 'Circular SCAN',
      description: 'A variant of SCAN that always moves the head in the same direction.',
      icon: <HardDrive size={24} />,
    },
    {
      id: 'look',
      name: 'LOOK',
      fullName: 'LOOK Algorithm',
      description: 'An improved version of SCAN that only moves as far as the last request in each direction.',
      icon: <HardDrive size={24} />,
    },
    {
      id: 'c-look',
      name: 'C-LOOK',
      fullName: 'Circular LOOK',
      description: 'A variant of LOOK that always moves in one direction, similar to C-SCAN.',
      icon: <HardDrive size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-10 text-center">
          <div className="drona-chip mb-3 animate-fade-in">Operating Systems</div>
          <h1 className="text-3xl md:text-5xl font-bold text-drona-dark mb-4 animate-slide-in bg-clip-text text-transparent bg-gradient-to-r from-drona-green to-blue-600">
            Disk Scheduling Algorithms
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Understand how operating systems optimize disk access with different scheduling algorithms.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-drona-light to-blue-50 rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
            <div className="flex items-start">
              <Disc className="h-8 w-8 text-drona-green mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-drona-dark mb-3">What are Disk Scheduling Algorithms?</h2>
                <p className="text-drona-gray mb-3">
                  Disk scheduling algorithms determine the order in which disk I/O requests are serviced. Their main goal is to minimize disk head movement and reduce the total time required to serve requests.
                </p>
                <p className="text-drona-gray">
                  These algorithms are crucial for improving the overall performance of secondary storage devices like hard drives.
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
                    <Link to={`/disk-scheduling/${algorithm.id}`}>
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

export default DiskScheduling;
