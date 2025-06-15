
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, HardDrive, Clock, Scan, Search, Eye, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiskScheduling = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-12">
          <Link to="/" className="flex items-center text-drona-green hover:underline mb-6 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-drona-dark mb-4">Disk Scheduling Algorithms</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Understand how operating systems optimize disk I/O operations through intelligent scheduling algorithms. 
              Minimize seek time and maximize throughput with various disk head movement strategies.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">Disk Performance Factors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Seek time: Moving the disk head to the target track</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Rotational latency: Waiting for sector rotation</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Transfer time: Actual data read/write operation</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Queue management and request ordering</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="FCFS (First Come First Serve)"
            description="Processes disk requests in arrival order. Simple but may result in excessive head movement and poor performance."
            icon={<Clock size={28} />}
            to="/disk-scheduling/fcfs"
            delay={100}
          />
          <CategoryCard
            title="SSTF (Shortest Seek Time First)"
            description="Services the request closest to current head position. Reduces seek time but may cause starvation of distant requests."
            icon={<Search size={28} />}
            to="/disk-scheduling/sstf"
            delay={200}
          />
          <CategoryCard
            title="SCAN (Elevator Algorithm)"
            description="Head moves in one direction serving requests until reaching end, then reverses. Provides uniform wait times."
            icon={<Scan size={28} />}
            to="/disk-scheduling/scan"
            delay={300}
          />
          <CategoryCard
            title="C-SCAN (Circular SCAN)"
            description="Head moves in one direction only, jumping to beginning when reaching end. More uniform service times than SCAN."
            icon={<RotateCcw size={28} />}
            to="/disk-scheduling/c-scan"
            delay={400}
          />
          <CategoryCard
            title="LOOK"
            description="Similar to SCAN but reverses direction when no more requests exist in current direction. More efficient than SCAN."
            icon={<Eye size={28} />}
            to="/disk-scheduling/look"
            delay={500}
          />
          <CategoryCard
            title="C-LOOK (Circular LOOK)"
            description="Combines benefits of C-SCAN and LOOK. Head serves requests in one direction then jumps to lowest unserved request."
            icon={<HardDrive size={28} />}
            to="/disk-scheduling/c-look"
            delay={600}
          />
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-6 text-center">
              Algorithm Performance Analysis
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-green-200">
                    <th className="text-left p-3 font-semibold text-drona-dark">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Seek Pattern</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Starvation</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Throughput</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Best Use Case</th>
                  </tr>
                </thead>
                <tbody className="text-drona-gray">
                  <tr className="border-b border-green-100">
                    <td className="p-3 font-medium">FCFS</td>
                    <td className="p-3">Random movement</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Poor</td>
                    <td className="p-3">Light workloads</td>
                  </tr>
                  <tr className="border-b border-green-100">
                    <td className="p-3 font-medium">SSTF</td>
                    <td className="p-3">Shortest distance</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Good</td>
                    <td className="p-3">Clustered requests</td>
                  </tr>
                  <tr className="border-b border-green-100">
                    <td className="p-3 font-medium">SCAN</td>
                    <td className="p-3">Back and forth</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Very Good</td>
                    <td className="p-3">Heavy workloads</td>
                  </tr>
                  <tr className="border-b border-green-100">
                    <td className="p-3 font-medium">C-SCAN</td>
                    <td className="p-3">Circular sweep</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Excellent</td>
                    <td className="p-3">Uniform distribution</td>
                  </tr>
                  <tr className="border-b border-green-100">
                    <td className="p-3 font-medium">LOOK</td>
                    <td className="p-3">Optimized sweep</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Very Good</td>
                    <td className="p-3">Moderate workloads</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">C-LOOK</td>
                    <td className="p-3">Optimized circular</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Excellent</td>
                    <td className="p-3">Real-time systems</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-4 text-center">
              Disk Scheduling Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HardDrive className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Reduced Seek Time</h4>
                <p className="text-sm text-drona-gray">Minimize disk head movement for faster access</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Better Response Time</h4>
                <p className="text-sm text-drona-gray">Improved average response time for I/O requests</p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scan className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Higher Throughput</h4>
                <p className="text-sm text-drona-gray">Process more requests per unit time</p>
              </div>
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Fair Access</h4>
                <p className="text-sm text-drona-gray">Prevent starvation of distant requests</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-drona-dark mb-3">🚀 Modern Considerations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <p>• SSDs don't have mechanical seek time, changing algorithm effectiveness</p>
              <p>• NCQ (Native Command Queuing) allows drives to reorder requests internally</p>
              <p>• RAID systems require coordination across multiple drives</p>
              <p>• Real-time systems may need deadline-aware scheduling algorithms</p>
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
