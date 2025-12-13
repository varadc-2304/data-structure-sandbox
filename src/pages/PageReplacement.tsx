import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, MemoryStick, Clock, History } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const PageReplacement = () => {
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
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">Memory Management & Page Replacement</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Explore how operating systems manage virtual memory through page replacement algorithms. 
              Understand the strategies used to decide which pages to evict when physical memory is full.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Virtual Memory Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Page faults and their impact on performance</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Frame allocation and memory management</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Locality of reference and working set</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Thrashing and its prevention strategies</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard
            title="FIFO (First In, First Out)"
            description="Simplest page replacement algorithm that removes the oldest page in memory. Easy to implement but may suffer from Belady's anomaly."
            icon={<Clock size={28} />}
            to="/dashboard/page-replacement/fifo"
          />
          <CategoryCard
            title="LRU (Least Recently Used)"
            description="Replaces the page that hasn't been accessed for the longest time. Performs well but requires tracking page access history."
            icon={<History size={28} />}
            to="/dashboard/page-replacement/lru"
          />
          <CategoryCard
            title="MRU (Most Recently Used)"
            description="Opposite of LRU, replaces the most recently used page. Useful in specific scenarios with certain access patterns."
            icon={<MemoryStick size={28} />}
            to="/dashboard/page-replacement/mru"
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
                    <th className="text-left p-3 font-semibold text-foreground">Implementation</th>
                    <th className="text-left p-3 font-semibold text-foreground">Hardware Support</th>
                    <th className="text-left p-3 font-semibold text-foreground">Belady's Anomaly</th>
                    <th className="text-left p-3 font-semibold text-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">FIFO</td>
                    <td className="p-3">Simple queue</td>
                    <td className="p-3">None</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Poor</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">LRU</td>
                    <td className="p-3">Complex tracking</td>
                    <td className="p-3">High</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Good</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">MRU</td>
                    <td className="p-3">Access tracking</td>
                    <td className="p-3">Medium</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Situational</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Memory Management Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MemoryStick className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Efficient Memory Use</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Maximize physical memory utilization by intelligent page management</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Reduced Page Faults</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Smart algorithms minimize expensive disk I/O operations</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <History className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Predictive Loading</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Anticipate future memory needs based on access patterns</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl mb-3">Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <p>• Belady's optimal algorithm is theoretical and cannot be implemented in practice</p>
              <p>• LRU approximation algorithms like Clock are commonly used in real systems</p>
              <p>• Working set size affects the choice of replacement algorithm</p>
              <p>• Modern CPUs have hardware support for tracking page access patterns</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PageReplacement;
