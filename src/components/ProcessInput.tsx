
import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
  
  return (
    <div className="space-y-6">
      <div className="bg-arena-light p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Add Process</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrival Time</Label>
            <Input
              id="arrivalTime"
              type="number"
              min="0"
              step="1"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder="Arrival Time"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="burstTime">Burst Time</Label>
            <Input
              id="burstTime"
              type="number"
              min="1"
              step="1"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              placeholder="Burst Time"
            />
          </div>
          
          {includePriority && (
            <div className="space-y-2">
              <Label htmlFor="priority">Priority (Lower is Higher)</Label>
              <Input
                id="priority"
                type="number"
                min="0"
                step="1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="Priority"
              />
            </div>
          )}
          
          {includeTimeQuantum && (
            <div className="space-y-2">
              <Label htmlFor="timeQuantum">Time Quantum</Label>
              <Input
                id="timeQuantum"
                type="number"
                min="1"
                step="1"
                value={timeQuantum}
                onChange={(e) => handleTimeQuantumChange(e.target.value)}
                placeholder="Time Quantum"
              />
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleAddProcess} 
          className="mt-4 bg-arena-red hover:bg-arena-red/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
      </div>
      
      {processes.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Process List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-arena-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst Time</th>
                  {includePriority && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processes.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                        {process.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{process.arrivalTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{process.burstTime}</td>
                    {includePriority && (
                      <td className="px-6 py-4 whitespace-nowrap">{process.priority}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleRemoveProcess(process.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessInput;
