import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Process, GanttChartItem, runFCFS } from '@/utils/cpuSchedulingUtils';
import ProcessInput from '@/components/ProcessInput';
import GanttChart from '@/components/GanttChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const FCFSVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
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
    
    // Run FCFS algorithm
    const { ganttChart: newGanttChart, scheduledProcesses: newScheduledProcesses } = runFCFS(processes);
    
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
      description: "First Come First Serve scheduling algorithm is running",
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
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">CPU Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">First Come First Serve (FCFS)</h1>
          <p className="text-arena-gray text-sm">
            Visualize the First Come First Serve scheduling algorithm. Processes are executed in the order they arrive.
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
                      <Timer className="mr-2 h-3 w-3 text-arena-green" />
                      <span className="text-arena-dark font-medium text-sm">Time: {currentTime}s / {totalTime}s</span>
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
                          <p className="text-xl font-bold text-arena-dark">{avgWaitingTime.toFixed(2)}s</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-arena-light">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-arena-gray">Average Turnaround Time</p>
                          <p className="text-xl font-bold text-arena-dark">{avgTurnaroundTime.toFixed(2)}s</p>
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
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finish (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround (s)</th>
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
                  <h2 className="text-lg font-semibold mb-2">About First Come First Serve</h2>
                  <p className="text-arena-gray mb-3 text-sm">
                    First Come First Serve (FCFS) is the simplest CPU scheduling algorithm. In this scheme, the process that requests the CPU first is allocated the CPU first.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Non-preemptive scheduling algorithm</li>
                          <li>Easy to understand and implement</li>
                          <li>Processes are executed in the order they arrive</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Limitations</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Not optimal for minimizing average waiting time</li>
                          <li>Suffers from "convoy effect": short processes wait for long processes</li>
                          <li>Not suitable for interactive systems</li>
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
              <h2 className="text-xl font-semibold mb-4">First Come First Serve Algorithm</h2>
              
              <div className="prose max-w-none text-arena-gray">
                <h3 className="text-lg font-medium text-arena-dark">How FCFS Works</h3>
                <p>
                  First Come First Serve (FCFS) is the simplest CPU scheduling algorithm. 
                  In this scheduling algorithm, processes are executed in the order they arrive in the ready queue.
                  It is a non-preemptive algorithm, meaning once a process starts executing, it continues until it completes or is blocked.
                </p>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Algorithm Implementation</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">FCFS Pseudocode</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function runFCFS(processes) {
  // Sort processes by arrival time
  let sortedProcesses = sort(processes, by: arrivalTime)
  let currentTime = 0
  let scheduledProcesses = []
  let ganttChart = []
  
  for each process in sortedProcesses {
    // Update current time if process arrives after current time
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime
    }
    
    // Set start time and calculate finish time
    process.startTime = currentTime
    process.finishTime = currentTime + process.burstTime
    
    // Calculate waiting and turnaround times
    process.waitingTime = process.startTime - process.arrivalTime
    process.turnaroundTime = process.finishTime - process.arrivalTime
    
    // Add to Gantt chart
    ganttChart.push({
      process: process.id,
      startTime: process.startTime,
      endTime: process.finishTime
    })
    
    // Update current time and add to scheduled processes
    currentTime = process.finishTime
    scheduledProcesses.push(process)
  }
  
  return { ganttChart, scheduledProcesses }
}`}</code></pre>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Performance Metrics</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Calculating Metrics</h4>
                  <ul className="list-disc pl-5">
                    <li><strong>Waiting Time</strong>: Process start time - Process arrival time</li>
                    <li><strong>Turnaround Time</strong>: Process completion time - Process arrival time</li>
                    <li><strong>Response Time</strong>: Process start time - Process arrival time (same as waiting time in FCFS)</li>
                  </ul>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Advantages and Disadvantages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Advantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Simple and easy to implement</li>
                      <li>No starvation - every process gets a chance to execute</li>
                      <li>Fair for processes that arrived earlier</li>
                    </ul>
                  </div>
                  <div className="bg-arena-light p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Disadvantages</h4>
                    <ul className="list-disc pl-5">
                      <li>Not optimal for minimizing average waiting time</li>
                      <li>Convoy effect: short processes wait for long processes</li>
                      <li>Poor performance for interactive systems</li>
                      <li>Not suitable for time-sharing systems</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Real-world Applications</h3>
                <p>
                  While FCFS is rarely used as the primary scheduling algorithm in modern operating systems due to its limitations,
                  it is still used in certain scenarios:
                </p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Batch processing systems where jobs are executed sequentially</li>
                  <li>Simple embedded systems with predictable workloads</li>
                  <li>As a fallback algorithm in multi-level feedback queue schedulers</li>
                  <li>Print spoolers and other sequential job execution environments</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FCFSVisualizer;
