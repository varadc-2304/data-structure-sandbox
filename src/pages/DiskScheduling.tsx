
import React from 'react';
import { Link } from 'react-router-dom';
import { HardDrive, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-8 text-center">
          <div className="drona-chip mb-3">Operating Systems</div>
          <h1 className="text-3xl md:text-4xl font-bold text-drona-dark">Disk Scheduling Algorithms</h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray">
            Understand how operating systems optimize disk access with different scheduling algorithms.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-drona-light rounded-xl p-6 mb-10">
            <h2 className="text-xl font-semibold text-drona-dark mb-3">What are Disk Scheduling Algorithms?</h2>
            <p className="text-drona-gray mb-3">
              Disk scheduling algorithms determine the order in which disk I/O requests are serviced. Their main goal is to minimize disk head movement and reduce the total time required to serve requests.
            </p>
            <p className="text-drona-gray">
              These algorithms are crucial for improving the overall performance of secondary storage devices like hard drives.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {algorithms.map((algorithm) => (
              <Link 
                key={algorithm.id} 
                to={`/disk-scheduling/${algorithm.id}`} 
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

export default DiskScheduling;
