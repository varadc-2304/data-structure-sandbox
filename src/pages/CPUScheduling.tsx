import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Clock, Timer, RotateCcw, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const CPUScheduling = () => {
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
            <h1 className="text-5xl font-bold text-drona-dark mb-4">CPU Scheduling Algorithms</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Understand how operating systems manage process execution with interactive Gantt charts and performance metrics. 
              Explore different scheduling strategies and their impact on system efficiency.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Process arrival and burst times</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Waiting time and turnaround time calculations</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>CPU utilization and throughput metrics</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Preemptive vs non-preemptive scheduling</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CategoryCard
            title="First Come First Serve"
            description="Simplest scheduling algorithm where processes are executed in arrival order. Non-preemptive with potential convoy effect."
            icon={<Clock size={28} />}
            to="/dashboard/cpu-scheduling/fcfs"
          />
          <CategoryCard
            title="Shortest Job First"
            description="Optimal algorithm that minimizes average waiting time by executing shortest jobs first. Can be preemptive or non-preemptive."
            icon={<Timer size={28} />}
            to="/dashboard/cpu-scheduling/sjf"
          />
          <CategoryCard
            title="Round Robin"
            description="Time-sharing algorithm with fixed time quantum. Ensures fairness by giving each process equal CPU time slices."
            icon={<RotateCcw size={28} />}
            to="/dashboard/cpu-scheduling/round-robin"
          />
          <CategoryCard
            title="Priority Scheduling"
            description="Processes are scheduled based on priority levels. Higher priority processes get CPU first, with aging to prevent starvation."
            icon={<TrendingUp size={28} />}
            to="/dashboard/cpu-scheduling/priority"
          />
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-6 text-center">
              Scheduling Algorithm Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left p-3 font-semibold text-drona-dark">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Preemptive</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Complexity</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Starvation</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Use Case</th>
                  </tr>
                </thead>
                <tbody className="text-drona-gray">
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">FCFS</td>
                    <td className="p-3">No</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Batch systems</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">SJF</td>
                    <td className="p-3">Optional</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Known burst times</td>
                  </tr>
                  <tr className="border-b border-blue-100">
                    <td className="p-3 font-medium">Round Robin</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Time-sharing systems</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Priority</td>
                    <td className="p-3">Optional</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Real-time systems</td>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Turnaround Time</h4>
                <p className="text-sm text-drona-gray">Total time from submission to completion</p>
              </div>
              <div>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Timer className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Waiting Time</h4>
                <p className="text-sm text-drona-gray">Time spent waiting in the ready queue</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Response Time</h4>
                <p className="text-sm text-drona-gray">Time from submission to first response</p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RotateCcw className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Throughput</h4>
                <p className="text-sm text-drona-gray">Number of processes completed per unit time</p>
              </div>
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

export default CPUScheduling;
