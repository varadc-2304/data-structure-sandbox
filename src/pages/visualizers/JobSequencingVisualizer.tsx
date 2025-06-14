
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface Job {
  id: number;
  profit: number;
  deadline: number;
  isSelected?: boolean;
  color: string;
}

interface Step {
  jobs: Job[];
  selectedJobs: (Job | null)[];
  totalProfit: number;
  currentJobIndex?: number;
  message: string;
  highlightedSlot?: number;
}

const JobSequencingVisualizer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [maxDeadline, setMaxDeadline] = useState<number>(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ];
  
  // Initialize solution when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      generateSteps();
    } else {
      setSteps([]);
      setCurrentStep(-1);
    }
  }, [jobs]);

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
    setSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
  };

  const generateSteps = () => {
    if (jobs.length === 0) return;

    const newSteps: Step[] = [];
    
    // Step 1: Show initial jobs
    newSteps.push({
      jobs: [...jobs],
      selectedJobs: Array(maxDeadline).fill(null),
      totalProfit: 0,
      message: "Initial jobs with their profits and deadlines. We need to select jobs to maximize profit while meeting deadlines."
    });

    // Step 2: Sort jobs by profit
    const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);
    newSteps.push({
      jobs: sortedJobs,
      selectedJobs: Array(maxDeadline).fill(null),
      totalProfit: 0,
      message: "Step 1: Sort jobs by profit in descending order. We use a greedy approach - always try the most profitable job first."
    });

    // Step 3+: Process each job
    const sequence = Array(maxDeadline).fill(null);
    let totalProfit = 0;
    const processedJobs = [...sortedJobs];

    for (let i = 0; i < sortedJobs.length; i++) {
      const currentJob = sortedJobs[i];
      let assigned = false;
      let assignedSlot = -1;

      // Find the latest available slot before the deadline
      for (let slot = Math.min(currentJob.deadline, maxDeadline) - 1; slot >= 0; slot--) {
        if (!sequence[slot]) {
          sequence[slot] = currentJob;
          totalProfit += currentJob.profit;
          processedJobs[i] = { ...currentJob, isSelected: true };
          assigned = true;
          assignedSlot = slot;
          break;
        }
      }

      if (!assigned) {
        processedJobs[i] = { ...currentJob, isSelected: false };
      }

      newSteps.push({
        jobs: [...processedJobs],
        selectedJobs: [...sequence],
        totalProfit: totalProfit,
        currentJobIndex: i,
        highlightedSlot: assignedSlot >= 0 ? assignedSlot : undefined,
        message: assigned 
          ? `Job ${currentJob.id} (profit: ${currentJob.profit}, deadline: ${currentJob.deadline}) is assigned to time slot ${assignedSlot + 1}. Total profit: ${totalProfit}`
          : `Job ${currentJob.id} (profit: ${currentJob.profit}, deadline: ${currentJob.deadline}) cannot be assigned - no available slots before its deadline.`
      });
    }

    // Final step
    newSteps.push({
      jobs: [...processedJobs],
      selectedJobs: [...sequence],
      totalProfit: totalProfit,
      message: `Job sequencing complete! Maximum profit achieved: ${totalProfit}. Selected jobs: ${sequence.filter(job => job !== null).map(job => `Job ${job!.id}`).join(', ')}.`
    });

    setSteps(newSteps);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleRunning = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(-1);
    }
    setIsRunning(!isRunning);
  };

  const skipToStart = () => {
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const skipToEnd = () => {
    setIsRunning(false);
    setCurrentStep(steps.length - 1);
  };

  const handleStepChange = (value: number[]) => {
    setIsRunning(false);
    setCurrentStep(value[0]);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStep, steps.length, speed]);

  const currentStepData = currentStep >= 0 && steps.length > 0 ? steps[currentStep] : null;
  const displayJobs = currentStepData ? currentStepData.jobs : jobs;
  const displaySelectedJobs = currentStepData ? currentStepData.selectedJobs : Array(maxDeadline).fill(null);
  const displayTotalProfit = currentStepData ? currentStepData.totalProfit : 0;
  const currentMessage = currentStepData ? currentStepData.message : 
    jobs.length === 0 ? "Generate random jobs to start the visualization." : "Click 'Start Visualization' to begin.";

  const speedDisplay = (2000 / speed).toFixed(1);

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
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button onClick={generateRandomJobs} disabled={isRunning}>
                    Generate Random Jobs
                  </Button>
                  
                  <Button 
                    onClick={skipToStart} 
                    disabled={steps.length === 0 || currentStep === -1}
                    size="sm"
                  >
                    <SkipBack className="h-4 w-4 mr-1" /> Start
                  </Button>
                  
                  <Button 
                    onClick={prevStep} 
                    disabled={steps.length === 0 || currentStep <= -1}
                    size="sm"
                  >
                    ← Prev
                  </Button>
                  
                  <Button 
                    onClick={toggleRunning} 
                    disabled={steps.length === 0}
                    size="sm"
                  >
                    {isRunning ? (
                      <><Pause className="h-4 w-4 mr-1" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-1" /> {currentStep === -1 ? 'Start' : 'Continue'}</>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={steps.length === 0 || currentStep >= steps.length - 1}
                    size="sm"
                  >
                    Next →
                  </Button>
                  
                  <Button 
                    onClick={skipToEnd} 
                    disabled={steps.length === 0 || currentStep === steps.length - 1}
                    size="sm"
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> End
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline" 
                    disabled={currentStep === -1}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <label className="text-sm font-medium whitespace-nowrap">Animation Speed: {speedDisplay}x</label>
                    <Slider
                      value={[speed]}
                      onValueChange={(value) => setSpeed(value[0])}
                      min={667}
                      max={4000}
                      step={333}
                      className="flex-1"
                      disabled={isRunning}
                    />
                  </div>
                  
                  {steps.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Step:</span>
                      <Slider
                        value={[currentStep]}
                        onValueChange={handleStepChange}
                        min={-1}
                        max={steps.length - 1}
                        step={1}
                        className="flex-1"
                        disabled={isRunning}
                      />
                      <span className="text-sm text-gray-500 w-16">
                        {currentStep + 1}/{steps.length}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700">{currentMessage}</p>
                </div>
                
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
                        {displayJobs.map((job, index) => (
                          <tr 
                            key={job.id} 
                            className={`transition-all duration-500 ${
                              job.isSelected ? 'bg-green-50' : 
                              job.isSelected === false ? 'bg-red-50' : ''
                            } ${
                              currentStepData && currentStepData.currentJobIndex === index ? 'ring-2 ring-yellow-400' : ''
                            }`}
                          >
                            <td className="border p-2">
                              <div className={`w-4 h-4 rounded-full inline-block mr-2 ${job.color}`}></div>
                              Job {job.id}
                            </td>
                            <td className="border p-2">{job.profit}</td>
                            <td className="border p-2">{job.deadline}</td>
                            <td className="border p-2">
                              {job.isSelected === true ? 
                                <span className="text-green-600 font-medium">Selected</span> : 
                                job.isSelected === false ? 
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
                  {maxDeadline > 0 && (
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
                          {displaySelectedJobs.map((job, index) => (
                            <div 
                              key={index} 
                              className={`flex-1 border-r last:border-r-0 flex items-center justify-center transition-all duration-500 ${
                                job ? job.color : 'bg-gray-200'
                              } ${
                                currentStepData && currentStepData.highlightedSlot === index ? 'ring-4 ring-yellow-400' : ''
                              }`}
                            >
                              {job ? (
                                <div className="text-white font-medium text-center">
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
                          Total Profit: {displayTotalProfit}
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
