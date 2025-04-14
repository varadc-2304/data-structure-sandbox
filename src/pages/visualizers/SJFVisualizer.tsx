import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Process, GanttChartItem, runSJFNonPreemptive, runSJFPreemptive } from '@/utils/cpuSchedulingUtils';
import ProcessInput from '@/components/ProcessInput';
import GanttChart from '@/components/GanttChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SJFVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);
  
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  
  const runSimulation = () => {
    if (processes.length === 0) {
      toast({
        title: "No processes",
        description: "Add at least one process to run the simulation",
        variant: "destructive",
      });
      return;
    }
    
    // Run SJF algorithm
    const { ganttChart: newGanttChart, scheduledProcesses: newScheduledProcesses } = isPreemptive
      ? runSJFPreemptive(processes)
      : runSJFNonPreemptive(processes);
    
    setGanttChart(newGanttChart);
    setScheduledProcesses(newScheduledProcesses);
    
    if (newGanttChart.length > 0) {
      setTotalTime(newGanttChart[newGanttChart.length - 1].endTime);
      setCurrentTime(0);
      setIsSimulating(true);
      
      // Calculate average waiting and turnaround times
      if (newScheduledProcesses.length > 0) {
        const totalWaiting = newScheduledProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
        const totalTurnaround = newScheduledProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
        
        setAvgWaitingTime(totalWaiting / newScheduledProcesses.length);
        setAvgTurnaroundTime(totalTurnaround / newScheduledProcesses.length);
      }
    }
    
    toast({
      title: "Simulation started",
      description: `Shortest Job First (${isPreemptive ? 'Preemptive' : 'Non-preemptive'}) scheduling algorithm is running`,
    });
  };
  
  const pauseSimulation = () => {
    setIsSimulating(false);
    
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resumeSimulation = () => {
    if (currentTime < totalTime) {
      setIsSimulating(true);
    }
  };
  
  const resetSimulation = () => {
    pauseSimulation();
    setCurrentTime(0);
  };
  
  const stepBackward = () => {
    pauseSimulation();
    setCurrentTime(prev => Math.max(0, prev - 1));
  };
  
  const stepForward = () => {
    pauseSimulation();
    setCurrentTime(prev => Math.min(totalTime, prev + 1));
  };
  
  // Timer effect
  useEffect(() => {
    if (isSimulating) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 1;
          if (next > totalTime) {
            pauseSimulation();
            return totalTime;
          }
          return next;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isSimulating, totalTime]);
  
  useEffect(() => {
    // Reset simulation when algorithm type changes
    resetSimulation();
    setGanttChart([]);
    setScheduledProcesses([]);
  }, [isPreemptive]);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">CPU Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Shortest Job First (SJF)</h1>
          <p className="text-arena-gray text-sm">
            Visualize the Shortest Job First scheduling algorithm. The process with the shortest burst time is executed first.
          </p>
        </div>
        
        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-4 w-full justify-start bg-arena-light p-1">
            <TabsTrigger value="visualizer" className="data-[state=active]:bg-white data-[state=active]:text-arena-dark px-6">
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="data-[state=active]:bg-white data-[state=active]:text-arena-dark px-6">
              Algorithm
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Process Input Section - Takes 1/3 of the screen */}
              <div className="md:col-span-1">
                <ProcessInput processes={processes} setProcesses={setProcesses} />
              </div>
              
              {/* Visualization Controls and Gantt Chart - Takes 2/3 of the screen */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl shadow-md p-4 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="mb-3 flex items-center space-x-2">
                    <Switch
                      id="isPreemptive"
                      checked={isPreemptive}
                      onCheckedChange={setIsPreemptive}
                    />
                    <Label
                      htmlFor="isPreemptive"
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Preemption (Shortest Remaining Time First)
                    </Label>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button 
                      onClick={runSimulation} 
                      variant="default"
                      size="sm"
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    
                    <Button 
                      onClick={pauseSimulation} 
                      variant="outline" 
                      disabled={!ganttChart.length || !isSimulating}
                      size="sm"
                    >
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>

                    <Button 
                      onClick={resumeSimulation} 
                      variant="outline" 
                      disabled={!ganttChart.length || isSimulating || currentTime >= totalTime}
                      size="sm"
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    
                    <Button 
                      onClick={resetSimulation} 
                      variant="outline" 
                      disabled={!ganttChart.length}
                      size="sm"
                    >
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={stepBackward} 
                      variant="outline" 
                      disabled={!ganttChart.length || currentTime <= 0}
                      size="sm"
                    >
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    
                    <Button 
                      onClick={stepForward} 
                      variant="outline" 
                      disabled={!ganttChart.length || currentTime >= totalTime}
                      size="sm"
                    >
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    
                    <div className="ml-auto flex items-center bg-arena-light px-2 py-1 rounded-md">
                      <Timer className="mr-2 h-3 w-3 text-arena-red" />
                      <span className="text-arena-dark font-medium text-sm">Time: {currentTime} / {totalTime}</span>
                    </div>
                  </div>
                  
                  {/* Gantt Chart */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Gantt Chart</h3>
                    <GanttChart data={ganttChart} currentTime={currentTime} className="border border-gray-200" />
                  </div>
                  
                  {/* Performance Metrics */}
                  {scheduledProcesses.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-arena-light">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-arena-gray">Average Waiting Time</p>
                          <p className="text-xl font-bold text-arena-dark">{avgWaitingTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-arena-light">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-arena-gray">Average Turnaround Time</p>
                          <p className="text-xl font-bold text-arena-dark">{avgTurnaroundTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Scheduled Processes */}
                  {scheduledProcesses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Scheduled Processes</h3>
                      <div className="overflow-x-auto max-h-[150px]">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-arena-light">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finish</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {scheduledProcesses.map((process) => (
                              <tr key={process.id} className={currentTime >= process.startTime! ? "bg-green-50" : "bg-white"}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                                    {process.id}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.arrivalTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.burstTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.startTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.finishTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.waitingTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.turnaroundTime}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Algorithm Info - Takes full width at the bottom but smaller */}
              <div className="md:col-span-3">
                <div className="bg-white rounded-2xl shadow-md p-4 animate-scale-in text-sm" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2">About Shortest Job First</h2>
                  <p className="text-arena-gray mb-3 text-sm">
                    Shortest Job First (SJF) is a scheduling algorithm that selects the process with the smallest execution time to execute next. It can be both preemptive and non-preemptive.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Non-preemptive SJF</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Once a process starts executing, it continues until completion</li>
                          <li>Minimizes average waiting time</li>
                          <li>Works well when burst times are known in advance</li>
                          <li>May cause starvation for long processes</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Preemptive SJF (SRTF)</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Also known as Shortest Remaining Time First (SRTF)</li>
                          <li>Process with shortest remaining time is selected for execution</li>
                          <li>Preemption occurs when a new process arrives with shorter burst time</li>
                          <li>Optimal for minimizing average waiting time</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in">
              <h2 className="text-xl font-semibold mb-4">Shortest Job First Algorithm</h2>
              
              <div className="prose max-w-none text-arena-gray">
                <h3 className="text-lg font-medium text-arena-dark">How SJF Works</h3>
                <p>
                  Shortest Job First (SJF) is a scheduling algorithm that selects the process with the smallest execution time.
                  It comes in two variants:
                </p>
                <ul>
                  <li><strong>Non-preemptive SJF</strong>: Once a process starts executing, it continues until completion.</li>
                  <li><strong>Preemptive SJF</strong>: Also known as Shortest Remaining Time First (SRTF), where a running process can be preempted if a new process arrives with a shorter burst time.</li>
                </ul>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Algorithm Implementation</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Non-preemptive SJF Pseudocode</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function runSJFNonPreemptive(processes) {
  let processQueue = copy(processes)
  let currentTime = 0
  let scheduledProcesses = []
  let ganttChart = []
  
  while (processQueue.length > 0) {
    // Find all processes that have arrived by current time
    let availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime)
    
    if (availableProcesses.length === 0) {
      // No process has arrived yet, jump to next arrival
      currentTime = nextArrivalTime(processQueue)
      continue
    }
    
    // Find the process with shortest burst time
    let shortestJob = findShortestJob(availableProcesses)
    
    // Remove from queue
    processQueue.remove(shortestJob)
    
    // Set start time and calculate finish time
    shortestJob.startTime = currentTime
    shortestJob.finishTime = currentTime + shortestJob.burstTime
    
    // Calculate waiting and turnaround times
    shortestJob.waitingTime = shortestJob.startTime - shortestJob.arrivalTime
    shortestJob.turnaroundTime = shortestJob.finishTime - shortestJob.arrivalTime
    
    // Add to Gantt chart
    ganttChart.push({
      process: shortestJob.id,
      startTime: shortestJob.startTime,
      endTime: shortestJob.finishTime
    })
    
    // Update current time
    currentTime = shortestJob.finishTime
    
    scheduledProcesses.push(shortestJob)
  }
  
  return { ganttChart, scheduledProcesses }
}`}</code></pre>
                </div>
                
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Preemptive SJF (SRTF) Pseudocode</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function runSJFPreemptive(processes) {
  let processQueue = copy(processes)
  let currentTime = 0
  let scheduledProcesses = []
  let ganttChart = []
  
  // While there are processes to execute
  while (some processes have remaining time) {
    // Find next process to execute
    let nextProcess = null
    let shortestRemainingTime = Infinity
    
    // Find available processes at current time
    for each process in processQueue {
      if (process.arrivalTime <= currentTime && process.remainingTime > 0) {
        if (process.remainingTime < shortestRemainingTime) {
          nextProcess = process
          shortestRemainingTime = process.remainingTime
        }
      }
    }
    
    // If no process available, jump to next arrival
    if (nextProcess === null) {
      currentTime = nextArrivalTime(processQueue)
      continue
    }
    
    // Process switch detected - update Gantt chart
    if (currentProcess changed) {
      update previous Gantt chart entry
      create new Gantt chart entry
    }
    
    // Execute process until next process arrives or current process finishes
    let runUntil = calculate_next_event_time()
    let executionTime = runUntil - currentTime
    
    nextProcess.remainingTime -= executionTime
    currentTime = runUntil
    
    // If process completed
    if (nextProcess.remainingTime === 0) {
      update process metrics (finishTime, turnaroundTime, waitingTime)
      update Gantt chart
      add to completed processes
    }
  }
  
  return { ganttChart, scheduledProcesses }
}`}</code></pre>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Performance Metrics</h3>
                <p>
                  SJF is known to be optimal in terms of average waiting time.
                </p>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Key Metrics</h4>
                  <ul className="list-disc pl-5">
                    <li><strong>Waiting Time</strong>: Process start time - Process arrival time</li>
                    <li><strong>Turnaround Time</strong>: Process completion time - Process arrival time</li>
                    <li><strong>Response Time</strong>: First time a process gets CPU - Process arrival time</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Advantages and Disadvantages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Advantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Optimal for minimizing average waiting time</li>
                      <li>Reduces the average turnaround time</li>
                      <li>Preemptive version (SRTF) gives even better performance</li>
                    </ul>
                  </div>
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Disadvantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Process starvation for longer processes</li>
                      <li>Requires knowledge of burst time in advance</li>
                      <li>Preemptive version has higher context switching overhead</li>
                      <li>Difficult to implement in practice due to burst time prediction</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Real-world Applications</h3>
                <p>
                  SJF is primarily a theoretical algorithm but its concepts influence modern scheduling:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Used with predicted burst times in some batch processing systems</li>
                  <li>Elements of SJF exist in multi-level feedback queue schedulers</li>
                  <li>Task schedulers in distributed computing sometimes employ SJF principles</li>
                  <li>Web servers may use SJF-like approaches for serving small files first</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SJFVisualizer;
