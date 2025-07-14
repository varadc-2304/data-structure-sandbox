
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface Job {
  id: number;
  profit: number;
  deadline: number;
  isSelected?: boolean;
}

interface SequencingStep {
  jobs: Job[];
  currentJobIndex: number;
  selectedJobs: Job[];
  timeSlots: (number | null)[];
  totalProfit: number;
  comparison?: string;
}

const JobSequencingVisualizer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [numJobs, setNumJobs] = useState<number>(5);
  const [customJobsInput, setCustomJobsInput] = useState<string>('');
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(-1);
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [timeSlots, setTimeSlots] = useState<(number | null)[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sequencingSteps, setSequencingSteps] = useState<SequencingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= sequencingSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, sequencingSteps.length, speed]);

  const generateRandomJobs = () => {
    const newJobs = Array.from({ length: numJobs }, (_, index) => ({
      id: index + 1,
      profit: Math.floor(Math.random() * 100) + 10,
      deadline: Math.floor(Math.random() * numJobs) + 1,
    }));
    setJobs(newJobs);
    resetSequencing();
  };

  const generateCustomJobs = () => {
    if (!customJobsInput.trim()) return;
    
    try {
      const newJobs = customJobsInput
        .split(';')
        .filter(Boolean)
        .map((jobStr, index) => {
          const [profitStr, deadlineStr] = jobStr.split(',').map(s => s.trim());
          const profit = parseInt(profitStr);
          const deadline = parseInt(deadlineStr);
          
          if (isNaN(profit) || isNaN(deadline)) {
            throw new Error('Invalid job format');
          }
          
          return {
            id: index + 1,
            profit,
            deadline
          };
        });
      
      if (newJobs.length === 0) throw new Error('Empty job list');
      
      setJobs(newJobs);
      setCustomJobsInput('');
      resetSequencing();
    } catch (error) {
      console.error("Invalid job format");
    }
  };

  const resetSequencing = () => {
    setCurrentJobIndex(-1);
    setSelectedJobs([]);
    setTimeSlots([]);
    setTotalProfit(0);
    setIsRunning(false);
    setSequencingSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSequencingSteps = (initialJobs: Job[]) => {
    const steps: SequencingStep[] = [];
    const jobsCopy = [...initialJobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = jobsCopy.reduce((max, job) => Math.max(max, job.deadline), 0);
    let currentTimeSlots: (number | null)[] = Array(maxDeadline).fill(null);
    let currentSelectedJobs: Job[] = [];
    let currentTotalProfit = 0;
    
    steps.push({
      jobs: structuredClone(jobsCopy),
      currentJobIndex: -1,
      selectedJobs: structuredClone(currentSelectedJobs),
      timeSlots: [...currentTimeSlots],
      totalProfit: currentTotalProfit,
      comparison: 'Starting Job Sequencing - Sorting jobs by profit'
    });
    
    for (let i = 0; i < jobsCopy.length; i++) {
      const job = jobsCopy[i];
      setCurrentJobIndex(i);
      
      steps.push({
        jobs: structuredClone(jobsCopy.map((j, idx) => idx === i ? { ...j, isSelected: true } : j)),
        currentJobIndex: i,
        selectedJobs: structuredClone(currentSelectedJobs),
        timeSlots: [...currentTimeSlots],
        totalProfit: currentTotalProfit,
        comparison: `Selecting job ${job.id} with profit ${job.profit} and deadline ${job.deadline}`
      });
      
      let slotFound = false;
      for (let j = Math.min(maxDeadline - 1, job.deadline - 1); j >= 0; j--) {
        if (currentTimeSlots[j] === null) {
          currentTimeSlots[j] = job.id;
          currentTotalProfit += job.profit;
          currentSelectedJobs.push(job);
          slotFound = true;
          
          steps.push({
            jobs: structuredClone(jobsCopy.map(j => ({ ...j, isSelected: false }))),
            currentJobIndex: i,
            selectedJobs: structuredClone(currentSelectedJobs),
            timeSlots: [...currentTimeSlots],
            totalProfit: currentTotalProfit,
            comparison: `Assigned job ${job.id} to time slot ${j + 1}`
          });
          
          break;
        }
      }
      
      if (!slotFound) {
        steps.push({
          jobs: structuredClone(jobsCopy.map(j => ({ ...j, isSelected: false }))),
          currentJobIndex: i,
          selectedJobs: structuredClone(currentSelectedJobs),
          timeSlots: [...currentTimeSlots],
          totalProfit: currentTotalProfit,
          comparison: `Job ${job.id} could not be scheduled`
        });
      }
    }
    
    steps.push({
      jobs: structuredClone(jobsCopy.map(j => ({ ...j, isSelected: false }))),
      currentJobIndex: -1,
      selectedJobs: structuredClone(currentSelectedJobs),
      timeSlots: [...currentTimeSlots],
      totalProfit: currentTotalProfit,
      comparison: `Job sequencing complete. Total profit: ${currentTotalProfit}`
    });
    
    return { steps };
  };

  const startSequencing = () => {
    if (jobs.length === 0 || isRunning) return;
    
    resetSequencing();
    const { steps } = calculateSequencingSteps(jobs);
    setSequencingSteps(steps);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= sequencingSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    
    const step = sequencingSteps[nextStepIndex];
    setJobs(step.jobs);
    setCurrentJobIndex(step.currentJobIndex);
    setSelectedJobs(step.selectedJobs);
    setTimeSlots(step.timeSlots);
    setTotalProfit(step.totalProfit);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = sequencingSteps[prevStepIndex];
    setJobs(step.jobs);
    setCurrentJobIndex(step.currentJobIndex);
    setSelectedJobs(step.selectedJobs);
    setTimeSlots(step.timeSlots);
    setTotalProfit(step.totalProfit);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= sequencingSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    
    const sequencingStep = sequencingSteps[step];
    setJobs(sequencingStep.jobs);
    setCurrentJobIndex(sequencingStep.currentJobIndex);
    setSelectedJobs(sequencingStep.selectedJobs);
    setTimeSlots(sequencingStep.timeSlots);
    setTotalProfit(sequencingStep.totalProfit);
  };

  const togglePlayPause = () => {
    if (currentStep >= sequencingSteps.length - 1) {
      startSequencing();
    } else {
      setIsRunning(!isRunning);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Job Sequencing Visualization</h1>
          <p className="text-lg text-drona-gray">
            Job Sequencing with Deadlines uses a greedy approach to maximize profit by selecting jobs with highest profit first.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n²)</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Jobs Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Number of Random Jobs</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={numJobs}
                        onChange={(e) => setNumJobs(Math.max(1, Math.min(10, parseInt(e.target.value) || 5)))}
                        min={1}
                        max={10}
                        className="flex-1 border-2 focus:border-drona-green"
                        placeholder="Enter number of jobs"
                      />
                      <Button 
                        onClick={generateRandomJobs} 
                        className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-drona-gray">Enter a number between 1 and 10</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Custom Jobs (profit, deadline; ...)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 60, 2; 100, 1; 20, 3"
                        value={customJobsInput}
                        onChange={(e) => setCustomJobsInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateCustomJobs()}
                        className="flex-1 border-2 focus:border-drona-green"
                      />
                      <Button 
                        onClick={generateCustomJobs}
                        className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                      >
                        Set
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {speed}x
                  </Label>
                  <div className="flex items-center mt-1">
                    <input 
                      type="range" 
                      min={0.5} 
                      max={3} 
                      step={0.5} 
                      value={speed} 
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(0)}
                    disabled={sequencingSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    disabled={jobs.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= sequencingSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(sequencingSteps.length - 1)}
                    disabled={sequencingSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => {
                    resetSequencing();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {sequencingSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {sequencingSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={sequencingSteps.length}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Step</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Number of Jobs</p>
                    <p className="text-3xl font-bold text-drona-dark">{jobs.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-xl font-bold text-drona-dark">{sequencingSteps.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Profit</p>
                    <p className="text-xl font-bold text-drona-dark">{totalProfit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Job Sequencing Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {jobs.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Briefcase className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Generate jobs to start visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {jobs.map((job, index) => (
                        <Card 
                          key={job.id}
                          className={`border-2 shadow-md ${index === currentJobIndex ? 'border-drona-green/70 shadow-lg scale-105' : 'border-drona-green/20'}`}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold text-drona-dark">
                              Job {job.id}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-drona-gray font-medium">Profit: {job.profit}</p>
                            <p className="text-drona-gray font-medium">Deadline: {job.deadline}</p>
                            <p className="text-sm text-drona-gray">
                              {selectedJobs.find(j => j.id === job.id) ? 'Scheduled' : 'Not Scheduled'}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-drona-dark mb-2">Scheduled Jobs</h3>
                      {selectedJobs.length === 0 ? (
                        <p className="text-drona-gray font-medium">No jobs scheduled yet.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-1 text-drona-gray font-medium">
                          {selectedJobs.map(job => (
                            <li key={job.id}>
                              Job {job.id} (Profit: {job.profit}, Deadline: {job.deadline})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-drona-dark mb-2">Time Slots</h3>
                      {timeSlots.every(slot => slot === null) ? (
                        <p className="text-drona-gray font-medium">No jobs scheduled in any time slot.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {timeSlots.map((jobId, index) => (
                            <div key={index} className="bg-drona-light p-3 rounded-lg border border-drona-green/20">
                              <p className="text-sm font-semibold text-drona-dark">
                                Time Slot {index + 1}:
                              </p>
                              <p className="text-drona-gray font-medium">
                                {jobId === null ? 'Empty' : `Job ${jobId}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {currentStep >= 0 && currentStep < sequencingSteps.length && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          {sequencingSteps[currentStep].comparison}
                        </p>
                      </div>
                    )}
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Job Sequencing Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Sort jobs by profit in descending order.</li>
                          <li>Iterate through each job and find an available time slot before its deadline.</li>
                          <li>If a slot is found, assign the job to that slot and add its profit to the total profit.</li>
                          <li>Continue until all jobs have been considered.</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSequencingVisualizer;
