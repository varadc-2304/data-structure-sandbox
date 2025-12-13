import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, Timer, RotateCcw, TrendingUp } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const CPUScheduling = () => {
  return (
    <>
      <SEO 
        title="CPU Scheduling Algorithms | FCFS, SJF, Round Robin, Priority | Drona"
        description="Understand how operating systems manage process execution with interactive Gantt charts. Explore FCFS, Shortest Job First, Round Robin, and Priority scheduling algorithms with performance metrics and visualizations."
        keywords="CPU scheduling, FCFS algorithm, shortest job first, round robin scheduling, priority scheduling, operating system, process scheduling, Gantt chart, CPU scheduling simulator"
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24 pb-12">
        <div className="mb-8 md:mb-12">
          <RouterLink to="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">CPU Scheduling Algorithms</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Understand how operating systems manage process execution with interactive Gantt charts and performance metrics. 
              Explore different scheduling strategies and their impact on system efficiency.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Process arrival and burst times</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Waiting time and turnaround time calculations</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>CPU utilization and throughput metrics</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Preemptive vs non-preemptive scheduling</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Scheduling Algorithm Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-foreground">Preemptive</th>
                    <th className="text-left p-3 font-semibold text-foreground">Complexity</th>
                    <th className="text-left p-3 font-semibold text-foreground">Starvation</th>
                    <th className="text-left p-3 font-semibold text-foreground">Use Case</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">FCFS</td>
                    <td className="p-3">No</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Batch systems</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">SJF</td>
                    <td className="p-3">Optional</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">Possible</td>
                    <td className="p-3">Known burst times</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Round Robin</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Time-sharing systems</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Priority</td>
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
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              CPU Scheduling Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Efficient Resource Utilization</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Maximize CPU usage by intelligent process scheduling</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Timer className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Reduced Waiting Time</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Minimize process waiting time for better responsiveness</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Fair Process Execution</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Ensure all processes get fair CPU time allocation</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl mb-3">Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <p>• Round Robin prevents starvation by giving each process a time slice</p>
              <p>• SJF minimizes average waiting time but requires knowing burst times</p>
              <p>• Preemptive scheduling allows higher priority processes to interrupt</p>
              <p>• Context switching overhead affects overall system performance</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default CPUScheduling;
