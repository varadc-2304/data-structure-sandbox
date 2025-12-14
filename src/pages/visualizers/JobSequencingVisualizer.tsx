import React, { useEffect } from "react";
import { Briefcase, ArrowLeft, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useJobSequencingVisualizer } from "./job-sequencing/useJobSequencingVisualizer";
import PlaybackControls from "@/components/PlaybackControls";
import SpeedControl from "@/components/SpeedControl";

const JobSequencingVisualizer = () => {
  const {
    state: { jobs, numJobs, customJobsInput, currentJobIndex, selectedJobs, timeSlots, totalProfit, isRunning, speed, sequencingSteps, currentStep },
    actions: { setNumJobs, setCustomJobsInput, setSpeed, generateRandomJobs, generateCustomJobs, resetSequencing, startSequencing, nextStep, prevStep, goToStep, togglePlayPause, setIsRunning },
  } = useJobSequencingVisualizer();

  // Auto-generate jobs on mount
  useEffect(() => {
    if (jobs.length === 0) {
      generateRandomJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    if (sequencingSteps.length === 0 && jobs.length > 0) {
      startSequencing();
    } else if (sequencingSteps.length > 0) {
      // Toggle play/pause if steps exist
      if (isRunning) {
        setIsRunning(false);
      } else {
        setIsRunning(true);
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (sequencingSteps.length > 0 && currentStep < sequencingSteps.length - 1) {
      setIsRunning(true);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 pb-12">
        <div className="mb-6">
          <Link to="/dashboard/algorithms" className="inline-flex items-center text-primary hover:underline mb-4 font-medium transition-colors text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Sequencing</h1>
          <p className="text-muted-foreground text-sm">Job Sequencing with Deadlines uses a greedy approach to maximize profit by selecting jobs with highest profit first.</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-fit justify-start bg-secondary p-1 h-auto">
            <TabsTrigger 
              value="visualizer" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger 
              value="algorithm" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Algorithm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-6">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Jobs Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Number of Random Jobs</Label>
                    <div className="flex gap-2">
                          <Input type="number" value={numJobs} onChange={(e) => setNumJobs(Math.max(1, Math.min(10, parseInt(e.target.value) || 5)))} min={1} max={10} className="flex-1" placeholder="Enter number of jobs" />
                          <Button onClick={generateRandomJobs}>
                        Generate
                      </Button>
                    </div>
                        <p className="text-xs text-muted-foreground">Enter a number between 1 and 10</p>
                  </div>
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Custom Jobs (profit, deadline; ...)</Label>
                    <div className="flex gap-2">
                          <Input placeholder="e.g., 60, 2; 100, 1; 20, 3" value={customJobsInput} onChange={(e) => setCustomJobsInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateCustomJobs()} className="flex-1" />
                          <Button onClick={generateCustomJobs}>
                        Set
                      </Button>
                    </div>
                  </div>
                </div>
                <SpeedControl
                  speed={speed}
                  onSpeedChange={setSpeed}
                  min={0.5}
                  max={3}
                  step={0.5}
                />
              </CardContent>
            </Card>
          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-4">
                    <PlaybackControls
                      isRunning={isRunning}
                      currentStep={currentStep}
                      totalSteps={sequencingSteps.length}
                      onPlay={handleStart}
                      onPause={handlePause}
                      onResume={handleResume}
                      onReset={() => { resetSequencing(); setIsRunning(false); }}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onFirst={() => goToStep(0)}
                      onLast={() => goToStep(sequencingSteps.length - 1)}
                      disabled={jobs.length === 0}
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    {jobs.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <div className="text-center">
                          <Briefcase className="mx-auto h-16 w-16 mb-4 opacity-50" />
                          <p className="text-xl font-semibold">Generate jobs to start visualization</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Step-by-step explanation */}
                        {currentStep >= 0 && currentStep < sequencingSteps.length && (
                          <Card className="bg-card border border-border animate-in fade-in duration-300">
                            <CardContent className="p-4 space-y-2">
                              <p className="text-sm font-semibold text-foreground">Step {currentStep + 1} Explanation:</p>
                              <p className="text-sm text-foreground">{sequencingSteps[currentStep].comparison}</p>
                            </CardContent>
                          </Card>
                        )}

                        {/* Jobs Grid */}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-3">Jobs (Sorted by Profit)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {jobs.map((job, index) => {
                              const isCurrent = index === currentJobIndex;
                              const isScheduled = selectedJobs.find((j) => j.id === job.id) !== undefined;
                              let borderClass = "border-border";
                              let bgClass = "bg-card";
                              if (isCurrent) {
                                borderClass = "border-primary dark:border-primary shadow-lg";
                                bgClass = "bg-primary/5 dark:bg-primary/10";
                              } else if (isScheduled) {
                                borderClass = "border-green-500 dark:border-green-600";
                                bgClass = "bg-green-50 dark:bg-green-900/20";
                              }
                              return (
                                <Card 
                                  key={job.id} 
                                  className={`border-2 ${borderClass} ${bgClass} transition-all duration-300 ${
                                    isCurrent ? "scale-105 animate-pulse" : "hover:scale-105"
                                  }`}
                                >
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                      <CardTitle className="text-lg font-semibold text-foreground">Job {job.id}</CardTitle>
                                      {isScheduled && (
                                        <span className="text-xs bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded animate-in fade-in">
                                          Scheduled
                                        </span>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground">Profit:</span>
                                      <span className="font-bold text-foreground text-lg">${job.profit}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm text-muted-foreground">Deadline:</span>
                                      <span className="font-semibold text-foreground">Slot {job.deadline}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>

                        {/* Time Slots Timeline */}
                        {timeSlots.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">Time Slots Timeline</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                              {timeSlots.map((jobId, index) => {
                                const isFilled = jobId !== null;
                                const job = jobs.find(j => j.id === jobId);
                                return (
                                  <Card 
                                    key={index} 
                                    className={`border-2 transition-all duration-300 ${
                                      isFilled 
                                        ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20 shadow-md animate-in zoom-in" 
                                        : "border-border bg-card dark:bg-card"
                                    }`}
                                  >
                                    <CardContent className="p-4 text-center">
                                      <p className="text-xs text-muted-foreground mb-2">Slot {index + 1}</p>
                                      {isFilled ? (
                                        <div className="space-y-1">
                                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {jobId}
                                          </div>
                                          {job && (
                                            <p className="text-xs text-foreground">
                                              ${job.profit}
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-muted-foreground text-sm">Empty</div>
                                      )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Scheduled Jobs Summary */}
                        {selectedJobs.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Scheduled Jobs Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedJobs.map((job) => (
                                <Card key={job.id} className="bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600 animate-in slide-in-from-left">
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-foreground">Job {job.id}</span>
                                      <span className="text-sm text-muted-foreground">Deadline: {job.deadline}</span>
                                    </div>
                                    <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                                      Profit: ${job.profit}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {sequencingSteps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Step</p>
                          <p className="text-xl font-bold text-foreground">{currentStep + 1} / {sequencingSteps.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Total Profit</p>
                          <p className="text-xl font-bold text-foreground">${totalProfit}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About Job Sequencing</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Job Sequencing with Deadlines is a greedy algorithm that schedules jobs to maximize profit while meeting deadlines.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Greedy algorithm</li>
                          <li>Maximizes profit</li>
                          <li>Respects deadlines</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Best Case: O(n²)</li>
                          <li>Average Case: O(n²)</li>
                          <li>Worst Case: O(n²)</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-card rounded-lg border border-border p-6 md:p-8">
              <div className="space-y-8">
                <div className="border-b border-border pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Job Sequencing with Deadlines – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Job Sequencing with Deadlines is a greedy algorithm that schedules jobs to maximize profit while ensuring each job is completed before its deadline.
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Key Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-foreground">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Sort jobs by profit in descending order</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">For each job, find latest available time slot before deadline</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">If slot found, schedule job and add to profit</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Continue until all jobs are considered</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Algorithm (Step-by-Step)
                  </h2>
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-5">
                      <ol className="space-y-4 text-sm text-foreground">
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                          <span className="flex-1 pt-1">Sort all jobs by profit in descending order</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Initialize an array of time slots (all empty)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">For each job in sorted order:</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1">Find the latest available time slot before the job's deadline</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1">If a slot is found, assign the job to that slot</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                          <span className="flex-1">Add the job's profit to the total profit</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Pseudocode
                  </h2>
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-5">
                      <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`JobSequencing(jobs):
    // Sort by profit descending
    sort jobs by profit descending
    
    maxDeadline = max(job.deadline for job in jobs)
    timeSlots = array[maxDeadline]  // All null initially
    totalProfit = 0
    
    for each job in jobs:
        // Find latest available slot before deadline
        for slot = job.deadline - 1 down to 0:
            if timeSlots[slot] == null:
                timeSlots[slot] = job
                totalProfit += job.profit
                break
    
    return totalProfit, timeSlots`}
                      </pre>
              </CardContent>
            </Card>
          </div>
        </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JobSequencingVisualizer;
