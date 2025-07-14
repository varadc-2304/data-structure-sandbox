import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, HardDrive, Clock, Search, Zap, Eye, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiskScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-12">
          <Link to="/dashboard" className="flex items-center text-drona-green hover:underline mb-6 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-drona-dark mb-4">Disk Scheduling Algorithms</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Explore disk scheduling algorithms with interactive visualizations. Understand how disk head movement affects performance.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Disk seek time and rotational latency</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Head movement and cylinder access</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>I/O request queue management</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Optimization goals: throughput and fairness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="FCFS (First Come First Serve)"
            description="Processes disk requests in the order they arrive. Simple but may result in inefficient seek patterns."
            icon={<Clock size={28} />}
            to="/dashboard/disk-scheduling/fcfs"
          />
          <CategoryCard
            title="SSTF (Shortest Seek Time First)"
            description="Selects the request with minimum seek time from current head position. Reduces average seek time."
            icon={<Search size={28} />}
            to="/dashboard/disk-scheduling/sstf"
          />
          <CategoryCard
            title="SCAN (Elevator Algorithm)"
            description="Head moves in one direction serving requests until end, then reverses direction. Provides uniform wait times."
            icon={<Zap size={28} />}
            to="/dashboard/disk-scheduling/scan"
          />
          <CategoryCard
            title="C-SCAN (Circular SCAN)"
            description="Like SCAN but returns to beginning after reaching end. Provides more uniform wait times than SCAN."
            icon={<RotateCcw size={28} />}
            to="/dashboard/disk-scheduling/c-scan"
          />
          <CategoryCard
            title="LOOK"
            description="Improved SCAN that only goes as far as the last request in each direction. Reduces unnecessary movement."
            icon={<Eye size={28} />}
            to="/dashboard/disk-scheduling/look"
          />
          <CategoryCard
            title="C-LOOK (Circular LOOK)"
            description="Circular version of LOOK algorithm. Combines benefits of C-SCAN and LOOK for optimal performance."
            icon={<HardDrive size={28} />}
            to="/dashboard/disk-scheduling/c-look"
          />
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-6 text-center">
              Algorithm Performance Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left p-3 font-semibold text-drona-dark">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Seek Time</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Throughput</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Fairness</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Complexity</th>
                  </tr>
                </thead>
                <tbody className="text-drona-gray">
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">FCFS</td>
                    <td className="p-3">Variable</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">SSTF</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">SCAN</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">C-SCAN</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">High</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">LOOK</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">C-LOOK</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">High</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-4 text-center">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Seek Time</h4>
                <p className="text-sm text-drona-gray">Time to move head to target cylinder</p>
              </div>
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Rotational Latency</h4>
                <p className="text-sm text-drona-gray">Time for sector to rotate under head</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Transfer Time</h4>
                <p className="text-sm text-drona-gray">Time to transfer data to/from disk</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-drona-dark mb-3">💡 Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <p>• SSTF can cause starvation for distant requests</p>
              <p>• SCAN and C-SCAN provide more uniform service</p>
              <p>• LOOK and C-LOOK reduce unnecessary head movement</p>
              <p>• Disk scheduling impacts overall system performance</p>
            </div>
          </div>
        </div>
        
        {/* Copyright Notice */}
        <div className="mt-16 text-center text-sm text-drona-gray">
          © 2024 Ikshvaku Innovations. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default DiskScheduling;
