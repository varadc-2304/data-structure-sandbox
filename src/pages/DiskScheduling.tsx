import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, HardDrive, Clock, Search, Zap, Eye, RotateCcw } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const DiskScheduling = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24 pb-12">
        <div className="mb-8 md:mb-12">
          <RouterLink to="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">Disk Scheduling Algorithms</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Explore disk scheduling algorithms with interactive visualizations. Understand how disk head movement affects performance.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Disk seek time and rotational latency</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Head movement and cylinder access</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>I/O request queue management</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Optimization goals: throughput and fairness</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Algorithm Performance Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-foreground">Seek Time</th>
                    <th className="text-left p-3 font-semibold text-foreground">Throughput</th>
                    <th className="text-left p-3 font-semibold text-foreground">Fairness</th>
                    <th className="text-left p-3 font-semibold text-foreground">Complexity</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">FCFS</td>
                    <td className="p-3">Variable</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">SSTF</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">SCAN</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">C-SCAN</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">High</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">LOOK</td>
                    <td className="p-3">Low</td>
                    <td className="p-3">High</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">C-LOOK</td>
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
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Disk Scheduling Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Reduced Seek Time</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Minimize disk head movement for faster data access</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Improved Throughput</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Optimize I/O operations for better system performance</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Fair Request Handling</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Ensure uniform service times for all disk requests</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl mb-3">Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <p>• SSTF can cause starvation for distant requests</p>
              <p>• SCAN and C-SCAN provide more uniform service</p>
              <p>• LOOK and C-LOOK reduce unnecessary head movement</p>
              <p>• Disk scheduling impacts overall system performance</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiskScheduling;
