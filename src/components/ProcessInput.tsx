
import React, { useState } from 'react';
import { Plus, Trash, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Process, createNewProcess } from '@/utils/cpuSchedulingUtils';

interface ProcessInputProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  includePriority?: boolean;
  includeTimeQuantum?: boolean;
}

const ProcessInput: React.FC<ProcessInputProps> = ({
  processes,
  setProcesses,
  includePriority = false,
  includeTimeQuantum = false
}) => {
  const [arrivalTime, setArrivalTime] = useState('0');
  const [burstTime, setBurstTime] = useState('');
  const [priority, setPriority] = useState('0');
  const [timeQuantum, setTimeQuantum] = useState('2');
  const [randomJobCount, setRandomJobCount] = useState('');
  
  const { toast } = useToast();
  
  const handleAddProcess = () => {
    // Validate inputs
    if (burstTime.trim() === '' || isNaN(Number(burstTime)) || Number(burstTime) <= 0) {
      toast({
        title: "Invalid input",
        description: "Burst time must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(Number(arrivalTime)) || Number(arrivalTime) < 0) {
      toast({
        title: "Invalid input",
        description: "Arrival time must be a non-negative number",
        variant: "destructive",
      });
      return;
    }
    
    if (includePriority && (isNaN(Number(priority)) || Number(priority) < 0)) {
      toast({
        title: "Invalid input",
        description: "Priority must be a non-negative number",
        variant: "destructive",
      });
      return;
    }
    
    // Create new process
    const newProcess = createNewProcess(
      processes,
      Number(arrivalTime),
      Number(burstTime),
      includePriority ? Number(priority) : undefined
    );
    
    setProcesses([...processes, newProcess]);
    setBurstTime('');
    toast({
      title: "Process added",
      description: `Added process ${newProcess.id} successfully`,
    });
  };
  
  const handleRemoveProcess = (id: string) => {
    setProcesses(processes.filter(process => process.id !== id));
    toast({
      title: "Process removed",
      description: `Removed process ${id} successfully`,
    });
  };
  
  const handleTimeQuantumChange = (value: string) => {
    if (value === '' || (!isNaN(Number(value)) && Number(value) > 0)) {
      setTimeQuantum(value);
    }
  };

  const handleGenerateRandomJobs = () => {
    if (randomJobCount.trim() === '' || isNaN(Number(randomJobCount)) || Number(randomJobCount) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number for job count",
        variant: "destructive",
      });
      return;
    }

    const count = Number(randomJobCount);
    const jobData: Array<{ arrivalTime: number; burstTime: number }> = [];

    // Generate random arrival times and burst times
    for (let i = 0; i < count; i++) {
      const arrivalTime = Math.floor(Math.random() * 16); // 0-15
      const burstTime = Math.floor(Math.random() * 6) + 1; // 1-6
      jobData.push({ arrivalTime, burstTime });
    }

    // Sort by arrival time to have logical head and tail structure
    jobData.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Create processes in sorted order with priority based on job number
    const newProcesses: Process[] = [];
    for (let i = 0; i < count; i++) {
      const priority = includePriority ? i : undefined; // Priority 0 to n-1 based on arrival order
      
      const newProcess = createNewProcess(
        [...processes, ...newProcesses],
        jobData[i].arrivalTime,
        jobData[i].burstTime,
        priority
      );
      
      newProcesses.push(newProcess);
    }

    setProcesses([...processes, ...newProcesses]);
    setRandomJobCount('');
    toast({
      title: "Random jobs generated",
      description: `Generated ${count} random jobs successfully (sorted by arrival time)`,
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-foreground">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="randomJobCount" className="text-xs text-muted-foreground">Generate Random Jobs</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="randomJobCount"
                type="number"
                min="1"
                step="1"
                value={randomJobCount}
                onChange={(e) => setRandomJobCount(e.target.value)}
                placeholder="Count"
                className="h-8 text-sm"
              />
              <Button 
                onClick={handleGenerateRandomJobs} 
                size="sm"
                className="h-8"
              >
                <Shuffle className="h-3.5 w-3.5 mr-1.5" />
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              AT: 0-15, BT: 1-6{includePriority ? ', P: 0-10' : ''}
            </p>
          </div>

          <div className="border-t pt-3">
            <Label className="text-xs text-muted-foreground mb-2 block">Add Process</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="arrivalTime" className="text-xs text-foreground">Arrival</Label>
                <Input
                  id="arrivalTime"
                  type="number"
                  min="0"
                  step="1"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  placeholder="0"
                  className="h-8 text-sm mt-0.5"
                />
              </div>
              
              <div>
                <Label htmlFor="burstTime" className="text-xs text-foreground">Burst</Label>
                <Input
                  id="burstTime"
                  type="number"
                  min="1"
                  step="1"
                  value={burstTime}
                  onChange={(e) => setBurstTime(e.target.value)}
                  placeholder="BT"
                  className="h-8 text-sm mt-0.5"
                />
              </div>
              
              {includePriority && (
                <div>
                  <Label htmlFor="priority" className="text-xs text-foreground">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    step="1"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="0"
                    className="h-8 text-sm mt-0.5"
                  />
                </div>
              )}
              
              {includeTimeQuantum && (
                <div>
                  <Label htmlFor="timeQuantum" className="text-xs text-foreground">Quantum</Label>
                  <Input
                    id="timeQuantum"
                    type="number"
                    min="1"
                    step="1"
                    value={timeQuantum}
                    onChange={(e) => handleTimeQuantumChange(e.target.value)}
                    placeholder="2"
                    className="h-8 text-sm mt-0.5"
                  />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleAddProcess} 
              size="sm"
              className="w-full h-8 mt-2"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {processes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Processes ({processes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">ID</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">AT</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">BT</th>
                    {includePriority && (
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">P</th>
                    )}
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {processes.map((process) => (
                    <tr key={process.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: process.color }}></div>
                          <span className="text-xs font-medium text-foreground">{process.id}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-foreground">{process.arrivalTime}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-foreground">{process.burstTime}</td>
                      {includePriority && (
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-foreground">{process.priority}</td>
                      )}
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveProcess(process.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessInput;
