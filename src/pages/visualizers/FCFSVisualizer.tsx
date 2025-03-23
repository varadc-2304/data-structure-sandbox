import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Process, GanttChartItem, runFCFS } from '@/utils/cpuSchedulingUtils';
import ProcessInput from '@/components/ProcessInput';
import GanttChart from '@/components/GanttChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';

const FCFSVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  
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
                  className="bg-arena-red hover:bg-arena-red/90"
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
      </div>
    </div>
  );
};

export default FCFSVisualizer;
