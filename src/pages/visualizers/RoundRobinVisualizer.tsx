import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Process, GanttChartItem, runRoundRobin } from '@/utils/cpuSchedulingUtils';
import ProcessInput from '@/components/ProcessInput';
import GanttChart from '@/components/GanttChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const RoundRobinVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timeQuantum, setTimeQuantum] = useState(2);
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
    
    if (timeQuantum <= 0) {
      toast({
        title: "Invalid time quantum",
        description: "Time quantum must be a positive integer",
        variant: "destructive",
      });
      return;
    }
    
    // Run Round Robin algorithm
    const { ganttChart: newGanttChart, scheduledProcesses: newScheduledProcesses } = 
      runRoundRobin(processes, timeQuantum);
    
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
      description: `Round Robin scheduling algorithm with time quantum ${timeQuantum} is running`,
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
  
  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setTimeQuantum(value);
    }
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
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">CPU Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Round Robin Scheduling</h1>
          <p className="text-arena-gray text-sm">
            Visualize the Round Robin scheduling algorithm. Each process is assigned a fixed time slot in a cyclic way.
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
                
                <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
                  <Label htmlFor="timeQuantum" className="text-sm font-medium mb-1 block">
                    Time Quantum
                  </Label>
                  <Input
                    id="timeQuantum"
                    type="number"
                    min="1"
                    value={timeQuantum}
                    onChange={handleTimeQuantumChange}
                    className="w-full"
                  />
                  <p className="text-xs text-arena-gray mt-1">
                    The time slice each process gets before being preempted.
                  </p>
                </div>
              </div>
              
              {/* Visualization Controls and Gantt Chart - Takes 2/3 of the screen */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl shadow-md p-4 animate-scale-in" style={{ animationDelay: "0.2s" }}>
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
                      variant="default" 
                      disabled={!ganttChart.length || !isSimulating}
                      size="sm"
                    >
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>

                    <Button 
                      onClick={resumeSimulation} 
                      variant="default" 
                      disabled={!ganttChart.length || isSimulating || currentTime >= totalTime}
                      size="sm"
                    >
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    
                    <Button 
                      onClick={resetSimulation} 
                      variant="default" 
                      disabled={!ganttChart.length}
                      size="sm"
                    >
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={stepBackward} 
                      variant="default" 
                      disabled={!ganttChart.length || currentTime <= 0}
                      size="sm"
                    >
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    
                    <Button 
                      onClick={stepForward} 
                      variant="default" 
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
                  <h2 className="text-lg font-semibold mb-2">About Round Robin Scheduling</h2>
                  <p className="text-arena-gray mb-3 text-sm">
                    Round Robin (RR) is a CPU scheduling algorithm where each process is assigned a fixed time slot (time quantum) in a cyclic way. It is designed especially for time-sharing systems.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Preemptive scheduling algorithm</li>
                          <li>Time slice or quantum is assigned to each process</li>
                          <li>After time quantum expires, process is preempted and added to the end of the ready queue</li>
                          <li>Fair allocation of CPU to all processes</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Performance Factors</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Time quantum affects performance significantly</li>
                          <li>Large time quantum: approximates FCFS</li>
                          <li>Small time quantum: better response time but more context switching overhead</li>
                          <li>Optimal time quantum balances response time and overhead</li>
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
              <h2 className="text-xl font-semibold mb-4">Round Robin Algorithm</h2>
              
              <div className="prose max-w-none text-arena-gray">
                <h3 className="text-lg font-medium text-arena-dark">How Round Robin Works</h3>
                <p>
                  Round Robin (RR) is a CPU scheduling algorithm that is especially designed for time-sharing systems.
                  In Round Robin scheduling, each process is assigned a fixed time slot called a time quantum or time slice.
                  Once a process has executed for the given time quantum, it is preempted and added to the end of the ready queue,
                  allowing the next process in the queue to execute.
                </p>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Algorithm Implementation</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Round Robin Pseudocode</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function runRoundRobin(processes, timeQuantum) {
  let processQueue = copy(processes)
  let readyQueue = []
  let currentTime = 0
  let scheduledProcesses = Array(processes.length).fill(null)
  let ganttChart = []
  
  // Sort by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime)
  
  // While there are processes to execute
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move newly arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift())
    }
    
    if (readyQueue.length === 0) {
      // No process in ready queue, jump to next arrival
      if (processQueue.length > 0) {
        currentTime = processQueue[0].arrivalTime
        continue
      } else {
        break // No more processes to execute
      }
    }
    
    // Get next process from ready queue
    let currentProcess = readyQueue.shift()
    
    // If process is starting for the first time
    if (currentProcess.startTime === undefined) {
      currentProcess.startTime = currentTime
    }
    
    // Calculate execution time for this round
    let executionTime = Math.min(timeQuantum, currentProcess.remainingTime)
    
    // Add to Gantt chart
    ganttChart.push({
      process: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + executionTime
    })
    
    // Update current time and remaining time
    currentTime += executionTime
    currentProcess.remainingTime -= executionTime
    
    // Move newly arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift())
    }
    
    // If process still has remaining time, put it back in ready queue
    if (currentProcess.remainingTime > 0) {
      readyQueue.push(currentProcess)
    } else {
      // Process completed
      currentProcess.finishTime = currentTime
      currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime
      
      // Save completed process
      scheduledProcesses[findIndex(processes, currentProcess.id)] = currentProcess
    }
  }
  
  return { ganttChart, scheduledProcesses: scheduledProcesses.filter(p => p !== null) }
}`}</code></pre>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Performance Metrics</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Key Metrics</h4>
                  <ul className="list-disc pl-5">
                    <li><strong>Waiting Time</strong>: Sum of time periods where process was in ready queue and not executing</li>
                    <li><strong>Turnaround Time</strong>: Process completion time - Process arrival time</li>
                    <li><strong>Response Time</strong>: First time a process gets CPU - Process arrival time</li>
                    <li><strong>Context Switches</strong>: Number of times CPU switched between processes</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Time Quantum Selection</h3>
                <p>
                  The time quantum is a critical parameter in Round Robin scheduling:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Large time quantum</strong>: Approaches FCFS behavior, with fewer context switches but potentially longer waiting times for short processes</li>
                  <li><strong>Small time quantum</strong>: Better responsiveness but increased context switching overhead</li>
                  <li><strong>Optimal time quantum</strong>: Typically should be slightly larger than the majority of CPU bursts to balance throughput and response time</li>
                </ul>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Advantages and Disadvantages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Advantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Fair CPU allocation to all processes</li>
                      <li>Prevents starvation of processes</li>
                      <li>Good for time-sharing systems</li>
                      <li>Better response time for short processes</li>
                    </ul>
                  </div>
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Disadvantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Context switching overhead can be significant</li>
                      <li>Higher average turnaround time than SJF</li>
                      <li>Performance heavily depends on time quantum selection</li>
                      <li>Not optimal for processes with widely varying CPU bursts</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Real-world Applications</h3>
                <p>
                  Round Robin is widely used in various operating systems and environments:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Time-sharing operating systems like Unix, Linux, and Windows</li>
                  <li>Network schedulers for fair bandwidth allocation</li>
                  <li>Process scheduling in multitasking environments</li>
                  <li>As part of multi-level queue and multi-level feedback queue schedulers</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoundRobinVisualizer;
