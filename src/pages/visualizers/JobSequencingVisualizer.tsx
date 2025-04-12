
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { ArrowRight, Play, RotateCcw } from 'lucide-react';

interface Job {
  id: number;
  profit: number;
  deadline: number;
  isSelected?: boolean;
  color: string;
}

const JobSequencingVisualizer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<(Job | null)[]>([]);
  const [maxDeadline, setMaxDeadline] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [visualizationStep, setVisualizationStep] = useState<number>(-1);
  const [isVisualizationComplete, setIsVisualizationComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ];
  
  const generateRandomJobs = () => {
    resetVisualization();
    
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 jobs
    const newJobs: Job[] = [];
    
    for (let i = 0; i < count; i++) {
      newJobs.push({
        id: i + 1,
        profit: Math.floor(Math.random() * 90) + 10, // 10-99
        deadline: Math.floor(Math.random() * 5) + 1, // 1-5
        color: colors[i % colors.length]
      });
    }
    
    const maxDl = Math.max(...newJobs.map(job => job.deadline));
    
    setJobs(newJobs);
    setMaxDeadline(maxDl);
  };
  
  const resetVisualization = () => {
    setSelectedJobs([]);
    setTotalProfit(0);
    setVisualizationStep(-1);
    setIsVisualizationComplete(false);
    setCurrentStep("");
  };
  
  const startVisualization = () => {
    if (jobs.length === 0) return;
    
    resetVisualization();
    setVisualizationStep(0);
  };
  
  const nextStep = () => {
    if (visualizationStep === 0) {
      // Step 1: Sort jobs by profit
      const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
      setJobs(sortedJobs);
      setVisualizationStep(1);
      setCurrentStep("Sorted jobs by profit in descending order");
    }
    else if (visualizationStep === 1) {
      // Step 2: Sequence jobs
      sequenceJobs();
      setVisualizationStep(2);
    }
  };
  
  const sequenceJobs = () => {
    const result = jobSequencing(jobs, maxDeadline);
    setSelectedJobs(result.sequence);
    setTotalProfit(result.profit);
    setIsVisualizationComplete(true);
    setCurrentStep("Assigned jobs to slots based on deadlines");
    
    // Update the original jobs array to mark selected jobs
    const updatedJobs = [...jobs];
    result.selectedJobIds.forEach(id => {
      const jobIndex = updatedJobs.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        updatedJobs[jobIndex] = {
          ...updatedJobs[jobIndex],
          isSelected: true
        };
      }
    });
    setJobs(updatedJobs);
  };
  
  const jobSequencing = (jobs: Job[], maxDeadline: number) => {
    // Sort jobs by profit in descending order
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    
    // Initialize slots
    const sequence = Array(maxDeadline).fill(null);
    let totalProfit = 0;
    const selectedJobIds: number[] = [];
    
    // Assign jobs to slots
    for (const job of sortedJobs) {
      // Find the latest available slot before the deadline
      for (let i = Math.min(job.deadline, maxDeadline) - 1; i >= 0; i--) {
        if (!sequence[i]) {
          sequence[i] = job;
          totalProfit += job.profit;
          selectedJobIds.push(job.id);
          break;
        }
      }
    }
    
    return {
      sequence,
      profit: totalProfit,
      selectedJobIds
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Job Sequencing Visualization</h1>
          <p className="text-drona-gray mb-8">
            The Job Sequencing Problem involves selecting jobs to maximize profit when each job has a deadline and profit.
            Each job takes one unit of time, and only one job can be scheduled at a time.
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <Button onClick={generateRandomJobs}>
                    Generate Random Jobs
                  </Button>
                  
                  <Button 
                    onClick={startVisualization} 
                    disabled={jobs.length === 0 || visualizationStep > -1}
                  >
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={visualizationStep === -1 || isVisualizationComplete}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" /> Next Step
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline" 
                    disabled={visualizationStep === -1}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
                
                {currentStep && (
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="font-medium">Current step: {currentStep}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-6">
                  {/* Available jobs */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Jobs</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Job</th>
                          <th className="border p-2 text-left">Profit</th>
                          <th className="border p-2 text-left">Deadline</th>
                          <th className="border p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job) => (
                          <tr 
                            key={job.id} 
                            className={`transition-all duration-500 ${job.isSelected ? 'bg-green-50' : ''}`}
                          >
                            <td className="border p-2">
                              <div className={`w-4 h-4 rounded-full inline-block mr-2 ${job.color}`}></div>
                              Job {job.id}
                            </td>
                            <td className="border p-2">{job.profit}</td>
                            <td className="border p-2">{job.deadline}</td>
                            <td className="border p-2">
                              {job.isSelected ? 
                                <span className="text-green-600 font-medium">Selected</span> : 
                                visualizationStep >= 2 ? 
                                  <span className="text-red-600">Not selected</span> : 
                                  '-'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Schedule timeline */}
                  {visualizationStep >= 2 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Job Schedule</h3>
                      <div className="border p-4 rounded-md bg-gray-50">
                        <div className="flex mb-2">
                          {Array.from({ length: maxDeadline }, (_, i) => (
                            <div key={i} className="flex-1 text-center font-medium border-r last:border-r-0">
                              Time {i + 1}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex h-16">
                          {selectedJobs.map((job, index) => (
                            <div 
                              key={index} 
                              className={`flex-1 border-r last:border-r-0 flex items-center justify-center ${job?.color || 'bg-gray-200'}`}
                            >
                              {job ? (
                                <div className="text-white font-medium">
                                  Job {job.id}
                                  <div className="text-xs">Profit: {job.profit}</div>
                                </div>
                              ) : (
                                <div className="text-gray-500">Empty</div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 font-medium text-right">
                          Total Profit: {totalProfit}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Job Sequencing Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Sort all jobs in decreasing order of profit.</li>
                <li>Initialize the result sequence with 'empty' slots.</li>
                <li>For each job in the sorted order:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Find the latest empty slot before the deadline.</li>
                    <li>If such a slot exists, assign the job to that slot.</li>
                  </ul>
                </li>
              </ol>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Greedy Approach</h3>
                <p className="text-drona-gray">
                  Job Sequencing uses a greedy approach that prioritizes jobs with higher profits.
                  By assigning each job to the latest possible time slot before its deadline,
                  the algorithm maximizes the number of jobs that can be completed while respecting their deadlines.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSequencingVisualizer;
