import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, MemoryStick, Clock, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageReplacement = () => {
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
            <h1 className="text-5xl font-bold text-drona-dark mb-4">Memory Management & Page Replacement</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Explore how operating systems manage virtual memory through page replacement algorithms. 
              Understand the strategies used to decide which pages to evict when physical memory is full.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">Virtual Memory Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Page faults and their impact on performance</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Frame allocation and memory management</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Locality of reference and working set</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Thrashing and its prevention strategies</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CategoryCard
            title="FIFO (First In, First Out)"
            description="Simplest page replacement algorithm that removes the oldest page in memory. Easy to implement but may suffer from Belady's anomaly."
            icon={<Clock size={28} />}
            to="/page-replacement/fifo"
          />
          <CategoryCard
            title="LRU (Least Recently Used)"
            description="Replaces the page that hasn't been accessed for the longest time. Performs well but requires tracking page access history."
            icon={<History size={28} />}
            to="/page-replacement/lru"
          />
          <CategoryCard
            title="MRU (Most Recently Used)"
            description="Opposite of LRU, replaces the most recently used page. Useful in specific scenarios with certain access patterns."
            icon={<MemoryStick size={28} />}
            to="/page-replacement/mru"
          />
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-6 text-center">
              Algorithm Performance Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="text-left p-3 font-semibold text-drona-dark">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Implementation</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Hardware Support</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Belady's Anomaly</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Performance</th>
                  </tr>
                </thead>
                <tbody className="text-drona-gray">
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">FIFO</td>
                    <td className="p-3">Simple queue</td>
                    <td className="p-3">None</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Poor</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">LRU</td>
                    <td className="p-3">Complex tracking</td>
                    <td className="p-3">High</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Good</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">MRU</td>
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
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-4 text-center">
              Memory Management Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MemoryStick className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Efficient Memory Use</h4>
                <p className="text-sm text-drona-gray">Maximize physical memory utilization by intelligent page management</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Reduced Page Faults</h4>
                <p className="text-sm text-drona-gray">Smart algorithms minimize expensive disk I/O operations</p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <History className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Predictive Loading</h4>
                <p className="text-sm text-drona-gray">Anticipate future memory needs based on access patterns</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
            <h3 className="text-xl font-bold text-drona-dark mb-3">💡 Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <p>• Belady's optimal algorithm is theoretical and cannot be implemented in practice</p>
              <p>• LRU approximation algorithms like Clock are commonly used in real systems</p>
              <p>• Working set size affects the choice of replacement algorithm</p>
              <p>• Modern CPUs have hardware support for tracking page access patterns</p>
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

export default PageReplacement;
