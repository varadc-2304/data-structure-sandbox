
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

const RoundRobinVisualizer = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [scheduledProcesses, setScheduledProcesses] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [timeQuantum, setTimeQuantum] = useState(2);
  
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
      
      <div className="page-container pt-32">
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">CPU Scheduling Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Round Robin Scheduling</h1>
          <p className="text-arena-gray">
            Visualize the Round Robin scheduling algorithm. Each process is assigned a fixed time slot in a cyclic way.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Process Input Section */}
          <ProcessInput processes={processes} setProcesses={setProcesses} />
          
          {/* Visualization Controls */}
          <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
            
            <div className="mb-4 max-w-xs">
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
            <h2 className="text-xl font-semibold mb-2">About Round Robin Scheduling</h2>
            <p className="text-arena-gray mb-4">
              Round Robin (RR) is a CPU scheduling algorithm where each process is assigned a fixed time slot (time quantum) in a cyclic way. It is designed especially for time-sharing systems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Card className="bg-arena-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-arena-gray space-y-1">
                    <li>Preemptive scheduling algorithm</li>
                    <li>Time slice or quantum is assigned to each process</li>
                    <li>After time quantum expires, process is preempted and added to the end of the ready queue</li>
                    <li>Fair allocation of CPU to all processes</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-arena-light">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-arena-gray space-y-1">
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
    </div>
  );
};

export default RoundRobinVisualizer;
