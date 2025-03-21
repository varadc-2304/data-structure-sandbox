
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Process, GanttChartItem, runPriorityNonPreemptive, runPriorityPreemptive } from '@/utils/cpuSchedulingUtils';
import ProcessInput from '@/components/ProcessInput';
import GanttChart from '@/components/GanttChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PriorityVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [isPreemptive, setIsPreemptive] = useState(false);
  
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
    
    // Run Priority algorithm
    const { ganttChart: newGanttChart, scheduledProcesses: newScheduledProcesses } = isPreemptive
      ? runPriorityPreemptive(processes)
      : runPriorityNonPreemptive(processes);
    
    setGanttChart(newGanttChart);
    setScheduledProcesses(newScheduledProcesses);
    
    if (newGanttChart.length > 0) {
      setTotalTime(newGanttChart[newGanttChart.length - 1].endTime);
      setCurrentTime(0);
      setIsSimulating(true);
    }
    
    toast({
      title: "Simulation started",
      description: `Priority (${isPreemptive ? 'Preemptive' : 'Non-preemptive'}) scheduling algorithm is running`,
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
      
      <div className="page-container pt-32">
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">CPU Scheduling Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Priority Scheduling</h1>
          <p className="text-arena-gray">
            Visualize the Priority scheduling algorithm. Processes are executed based on priority values (lower number = higher priority).
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Process Input Section */}
          <ProcessInput processes={processes} setProcesses={setProcesses} includePriority={true} />
          
          {/* Visualization Controls */}
          <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
            
            <div className="mb-4 flex items-center space-x-2">
              <Switch
                id="isPreemptive"
                checked={isPreemptive}
                onCheckedChange={setIsPreemptive}
              />
              <Label
                htmlFor="isPreemptive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable Preemption (Higher priority processes can preempt lower priority ones)
              </Label>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Button 
                onClick={runSimulation} 
                className="bg-arena-red hover:bg-arena-red/90"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Simulation
              </Button>
              
              <Button 
                onClick={pauseSimulation} 
                variant="outline" 
                disabled={!ganttChart.length || !isSimulating}
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>

              <Button 
                onClick={resumeSimulation} 
                variant="outline" 
                disabled={!ganttChart.length || isSimulating || currentTime >= totalTime}
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
              
              <Button 
                onClick={resetSimulation} 
                variant="outline" 
                disabled={!ganttChart.length}
              >
                <SkipBack className="mr-2 h-4 w-4" />
                Reset
              </Button>
              
              <Button 
                onClick={stepBackward} 
                variant="outline" 
                disabled={!ganttChart.length || currentTime <= 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={stepForward} 
                variant="outline" 
                disabled={!ganttChart.length || currentTime >= totalTime}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <div className="ml-auto flex items-center bg-arena-light px-3 py-2 rounded-md">
                <Timer className="mr-2 h-4 w-4 text-arena-red" />
                <span className="text-arena-dark font-medium">Time: {currentTime} / {totalTime}</span>
              </div>
            </div>
            
            {/* Gantt Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Gantt Chart</h3>
              <GanttChart data={ganttChart} currentTime={currentTime} className="border border-gray-200" />
            </div>
            
            {/* Scheduled Processes */}
            {scheduledProcesses.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Scheduled Processes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-arena-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finish</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scheduledProcesses.map((process) => (
                        <tr key={process.id} className={currentTime >= process.startTime! ? "bg-green-50" : "bg-white"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                              {process.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.arrivalTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.burstTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.priority}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.startTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.finishTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.waitingTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{process.turnaroundTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* Algorithm Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl font-semibold mb-2">About Priority Scheduling</h2>
            <p className="text-arena-gray mb-4">
              Priority Scheduling is a scheduling algorithm that selects the process with the highest priority for execution. Lower priority number indicates higher priority.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Card className="bg-arena-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Non-preemptive Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-arena-gray space-y-1">
                    <li>Once a process starts executing, it continues until completion</li>
                    <li>Higher priority processes that arrive later must wait</li>
                    <li>Can lead to "priority inversion" - lower priority process holds resource needed by high priority process</li>
                    <li>Simple to implement but less responsive</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-arena-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Preemptive Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-arena-gray space-y-1">
                    <li>Running process is preempted when a higher priority process arrives</li>
                    <li>More responsive for high priority processes</li>
                    <li>Can lead to starvation of low priority processes</li>
                    <li>Requires more context switching, leading to more overhead</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityVisualizer;
