
// Types for CPU scheduling
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  remainingTime?: number;
  priority?: number;
  startTime?: number;
  finishTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  color?: string;
}

export interface GanttChartItem {
  process: string;
  startTime: number;
  endTime: number;
  color: string;
}

// Color palette for processes
const colors = [
  '#F87171', // red-400
  '#60A5FA', // blue-400
  '#34D399', // green-400
  '#A78BFA', // purple-400
  '#FBBF24', // yellow-400
  '#F472B6', // pink-400
  '#2DD4BF', // teal-400
  '#FB923C', // orange-400
];

export const getProcessColor = (index: number): string => {
  return colors[index % colors.length];
};

// Helper function for creating new process with auto ID
export const createNewProcess = (
  processes: Process[],
  arrivalTime: number,
  burstTime: number,
  priority?: number
): Process => {
  const nextId = `P${processes.length + 1}`;
  const color = getProcessColor(processes.length);
  
  return {
    id: nextId,
    arrivalTime,
    burstTime,
    remainingTime: burstTime,
    priority: priority || 0,
    color
  };
};

// FCFS Algorithm
export const runFCFS = (processes: Process[]): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0) return { ganttChart: [], scheduledProcesses: [] };
  
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const ganttChart: GanttChartItem[] = [];
  const scheduledProcesses: Process[] = [];
  
  let currentTime = 0;
  
  sortedProcesses.forEach(process => {
    const p = { ...process };
    
    // Update current time if process arrives after current time
    if (p.arrivalTime > currentTime) {
      currentTime = p.arrivalTime;
    }
    
    // Set start time and update finish time
    p.startTime = currentTime;
    p.finishTime = currentTime + p.burstTime;
    
    // Calculate waiting and turnaround time
    p.waitingTime = p.startTime - p.arrivalTime;
    p.turnaroundTime = p.finishTime - p.arrivalTime;
    
    // Add to Gantt chart
    ganttChart.push({
      process: p.id,
      startTime: p.startTime,
      endTime: p.finishTime,
      color: p.color || '#F87171'
    });
    
    // Update current time
    currentTime = p.finishTime;
    
    scheduledProcesses.push(p);
  });
  
  return { ganttChart, scheduledProcesses };
};

// SJF Non-preemptive Algorithm
export const runSJFNonPreemptive = (processes: Process[]): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0) return { ganttChart: [], scheduledProcesses: [] };
  
  const processQueue = [...processes].map(p => ({ ...p }));
  const ganttChart: GanttChartItem[] = [];
  const scheduledProcesses: Process[] = [];
  
  let currentTime = 0;
  
  while (processQueue.length > 0) {
    // Find all processes that have arrived by current time
    const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No process has arrived yet, jump to the next arrival
      const nextArrival = Math.min(...processQueue.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the process with shortest burst time
    const shortestJob = availableProcesses.reduce((prev, curr) => 
      prev.burstTime < curr.burstTime ? prev : curr
    );
    
    // Remove from queue
    const index = processQueue.findIndex(p => p.id === shortestJob.id);
    processQueue.splice(index, 1);
    
    // Set start time and update finish time
    shortestJob.startTime = currentTime;
    shortestJob.finishTime = currentTime + shortestJob.burstTime;
    
    // Calculate waiting and turnaround time
    shortestJob.waitingTime = shortestJob.startTime - shortestJob.arrivalTime;
    shortestJob.turnaroundTime = shortestJob.finishTime - shortestJob.arrivalTime;
    
    // Add to Gantt chart
    ganttChart.push({
      process: shortestJob.id,
      startTime: shortestJob.startTime,
      endTime: shortestJob.finishTime,
      color: shortestJob.color || '#F87171'
    });
    
    // Update current time
    currentTime = shortestJob.finishTime;
    
    scheduledProcesses.push(shortestJob);
  }
  
  return { ganttChart, scheduledProcesses };
};

// SJF Preemptive (SRTF) Algorithm
export const runSJFPreemptive = (processes: Process[]): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0) return { ganttChart: [], scheduledProcesses: [] };
  
  // Create deep copy of processes
  const processQueue = [...processes].map(p => ({ 
    ...p, 
    remainingTime: p.burstTime,
    startTime: undefined,
    finishTime: undefined
  }));
  
  const ganttChart: GanttChartItem[] = [];
  const completedProcesses: Process[] = [];
  const timePoints = [
    ...new Set([
      ...processQueue.map(p => p.arrivalTime),
      ...processQueue.map(p => p.arrivalTime + p.burstTime)
    ])
  ].sort((a, b) => a - b);
  
  let currentTime = 0;
  let currentProcess: Process | null = null;
  
  // While there are processes to execute
  while (processQueue.some(p => p.remainingTime! > 0)) {
    // Find next process to execute
    let nextProcess: Process | null = null;
    let shortestRemainingTime = Infinity;
    
    // Find available processes at current time
    for (const process of processQueue) {
      if (process.arrivalTime <= currentTime && process.remainingTime! > 0) {
        if (process.remainingTime! < shortestRemainingTime) {
          nextProcess = process;
          shortestRemainingTime = process.remainingTime!;
        }
      }
    }
    
    // If no process available, jump to next arrival
    if (nextProcess === null) {
      const notArrivedProcesses = processQueue.filter(p => p.arrivalTime > currentTime && p.remainingTime! > 0);
      if (notArrivedProcesses.length > 0) {
        currentTime = Math.min(...notArrivedProcesses.map(p => p.arrivalTime));
      } else {
        break; // No more processes to execute
      }
      continue;
    }
    
    // Process switch detected
    if (currentProcess !== nextProcess) {
      // If we had a process running before, record its execution
      if (currentProcess !== null && ganttChart.length > 0) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
      }
      
      // Start new process
      if (nextProcess.startTime === undefined) {
        nextProcess.startTime = currentTime;
      }
      
      ganttChart.push({
        process: nextProcess.id,
        startTime: currentTime,
        endTime: currentTime, // Will be updated later
        color: nextProcess.color || '#F87171'
      });
      
      currentProcess = nextProcess;
    }
    
    // Determine how long to run the current process
    let runUntil = currentTime + nextProcess.remainingTime!;
    
    // Find if another process arrives or finishes before this one finishes
    const nextEventTime = timePoints.find(t => t > currentTime);
    if (nextEventTime !== undefined && nextEventTime < runUntil) {
      runUntil = nextEventTime;
    }
    
    // Execute process for the determined duration
    const executionTime = runUntil - currentTime;
    nextProcess.remainingTime! -= executionTime;
    currentTime = runUntil;
    
    // If process completed
    if (nextProcess.remainingTime === 0) {
      nextProcess.finishTime = currentTime;
      nextProcess.turnaroundTime = nextProcess.finishTime - nextProcess.arrivalTime;
      nextProcess.waitingTime = nextProcess.turnaroundTime - nextProcess.burstTime;
      
      // Mark latest gantt chart entry as completed
      ganttChart[ganttChart.length - 1].endTime = currentTime;
      
      // Save completed process
      const completedProcess = { ...nextProcess };
      completedProcesses.push(completedProcess);
      
      currentProcess = null;
    }
  }
  
  // Merge consecutive gantt chart entries for the same process
  const mergedGanttChart: GanttChartItem[] = [];
  for (const item of ganttChart) {
    if (mergedGanttChart.length === 0 || 
        mergedGanttChart[mergedGanttChart.length - 1].process !== item.process) {
      mergedGanttChart.push({ ...item });
    } else {
      mergedGanttChart[mergedGanttChart.length - 1].endTime = item.endTime;
    }
  }
  
  return { 
    ganttChart: mergedGanttChart, 
    scheduledProcesses: completedProcesses 
  };
};

// Priority Non-preemptive Algorithm
export const runPriorityNonPreemptive = (processes: Process[]): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0) return { ganttChart: [], scheduledProcesses: [] };
  
  const processQueue = [...processes].map(p => ({ ...p }));
  const ganttChart: GanttChartItem[] = [];
  const scheduledProcesses: Process[] = [];
  
  let currentTime = 0;
  
  while (processQueue.length > 0) {
    // Find all processes that have arrived by current time
    const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);
    
    if (availableProcesses.length === 0) {
      // No process has arrived yet, jump to the next arrival
      const nextArrival = Math.min(...processQueue.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the process with highest priority (lower number = higher priority)
    const highestPriorityProcess = availableProcesses.reduce((prev, curr) => 
      (prev.priority || 0) < (curr.priority || 0) ? prev : curr
    );
    
    // Remove from queue
    const index = processQueue.findIndex(p => p.id === highestPriorityProcess.id);
    processQueue.splice(index, 1);
    
    // Set start time and update finish time
    highestPriorityProcess.startTime = currentTime;
    highestPriorityProcess.finishTime = currentTime + highestPriorityProcess.burstTime;
    
    // Calculate waiting and turnaround time
    highestPriorityProcess.waitingTime = highestPriorityProcess.startTime - highestPriorityProcess.arrivalTime;
    highestPriorityProcess.turnaroundTime = highestPriorityProcess.finishTime - highestPriorityProcess.arrivalTime;
    
    // Add to Gantt chart
    ganttChart.push({
      process: highestPriorityProcess.id,
      startTime: highestPriorityProcess.startTime,
      endTime: highestPriorityProcess.finishTime,
      color: highestPriorityProcess.color || '#F87171'
    });
    
    // Update current time
    currentTime = highestPriorityProcess.finishTime;
    
    scheduledProcesses.push(highestPriorityProcess);
  }
  
  return { ganttChart, scheduledProcesses };
};

// Priority Preemptive Algorithm
export const runPriorityPreemptive = (processes: Process[]): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0) return { ganttChart: [], scheduledProcesses: [] };
  
  // Create deep copy of processes
  const processQueue = [...processes].map(p => ({ 
    ...p, 
    remainingTime: p.burstTime,
    startTime: undefined,
    finishTime: undefined
  }));
  
  const ganttChart: GanttChartItem[] = [];
  const completedProcesses: Process[] = [];
  
  // Get all unique time points for events (arrivals)
  const timePoints = [...new Set(processQueue.map(p => p.arrivalTime))].sort((a, b) => a - b);
  
  let currentTime = 0;
  let currentProcess: Process | null = null;
  
  // While there are processes to execute
  while (processQueue.some(p => p.remainingTime! > 0)) {
    // Find next process to execute based on priority
    let nextProcess: Process | null = null;
    let highestPriority = Infinity;
    
    // Find available processes at current time
    for (const process of processQueue) {
      if (process.arrivalTime <= currentTime && process.remainingTime! > 0) {
        if ((process.priority || 0) < highestPriority) {
          nextProcess = process;
          highestPriority = process.priority || 0;
        }
      }
    }
    
    // If no process available, jump to next arrival
    if (nextProcess === null) {
      const notArrivedProcesses = processQueue.filter(p => p.arrivalTime > currentTime && p.remainingTime! > 0);
      if (notArrivedProcesses.length > 0) {
        currentTime = Math.min(...notArrivedProcesses.map(p => p.arrivalTime));
      } else {
        break; // No more processes to execute
      }
      continue;
    }
    
    // Process switch detected
    if (currentProcess !== nextProcess) {
      // If we had a process running before, record its execution
      if (currentProcess !== null && ganttChart.length > 0) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
      }
      
      // Start new process
      if (nextProcess.startTime === undefined) {
        nextProcess.startTime = currentTime;
      }
      
      ganttChart.push({
        process: nextProcess.id,
        startTime: currentTime,
        endTime: currentTime, // Will be updated later
        color: nextProcess.color || '#F87171'
      });
      
      currentProcess = nextProcess;
    }
    
    // Determine next context switch point
    let nextEventTime = Infinity;
    
    // Next process arrival that could preempt
    for (const process of processQueue) {
      if (process.arrivalTime > currentTime && process.arrivalTime < nextEventTime && 
          (process.priority || 0) < (nextProcess.priority || 0)) {
        nextEventTime = process.arrivalTime;
      }
    }
    
    // If no preemption will occur, run until completion
    if (nextEventTime === Infinity) {
      nextEventTime = currentTime + nextProcess.remainingTime!;
    }
    
    // Execute process for the determined duration
    const executionTime = nextEventTime - currentTime;
    nextProcess.remainingTime! -= executionTime;
    currentTime = nextEventTime;
    
    // If process completed
    if (nextProcess.remainingTime === 0) {
      nextProcess.finishTime = currentTime;
      nextProcess.turnaroundTime = nextProcess.finishTime - nextProcess.arrivalTime;
      nextProcess.waitingTime = nextProcess.turnaroundTime - nextProcess.burstTime;
      
      // Mark latest gantt chart entry as completed
      ganttChart[ganttChart.length - 1].endTime = currentTime;
      
      // Save completed process
      const completedProcess = { ...nextProcess };
      completedProcesses.push(completedProcess);
      
      currentProcess = null;
    } else if (ganttChart.length > 0) {
      // Update end time of current gantt chart entry
      ganttChart[ganttChart.length - 1].endTime = currentTime;
    }
  }
  
  // Merge consecutive gantt chart entries for the same process
  const mergedGanttChart: GanttChartItem[] = [];
  for (const item of ganttChart) {
    if (mergedGanttChart.length === 0 || 
        mergedGanttChart[mergedGanttChart.length - 1].process !== item.process) {
      mergedGanttChart.push({ ...item });
    } else {
      mergedGanttChart[mergedGanttChart.length - 1].endTime = item.endTime;
    }
  }
  
  return { 
    ganttChart: mergedGanttChart, 
    scheduledProcesses: completedProcesses 
  };
};

// Round Robin Algorithm
export const runRoundRobin = (processes: Process[], timeQuantum: number): {
  ganttChart: GanttChartItem[];
  scheduledProcesses: Process[];
} => {
  if (processes.length === 0 || timeQuantum <= 0) 
    return { ganttChart: [], scheduledProcesses: [] };
  
  // Create deep copy of processes
  const processQueue = [...processes].map(p => ({ 
    ...p, 
    remainingTime: p.burstTime,
    startTime: undefined,
    finishTime: undefined
  }));
  
  const ganttChart: GanttChartItem[] = [];
  const scheduledProcesses: Process[] = Array(processes.length).fill(null);
  
  // Sort by arrival time
  processQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let readyQueue: Process[] = [];
  let currentTime = 0;
  
  // While there are processes to execute
  while (processQueue.length > 0 || readyQueue.length > 0) {
    // Move newly arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    if (readyQueue.length === 0) {
      // No process in ready queue, jump to next arrival
      if (processQueue.length > 0) {
        currentTime = processQueue[0].arrivalTime;
        continue;
      } else {
        break; // No more processes to execute
      }
    }
    
    // Get next process from ready queue
    const currentProcess = readyQueue.shift()!;
    
    // If process is starting for the first time
    if (currentProcess.startTime === undefined) {
      currentProcess.startTime = currentTime;
    }
    
    // Calculate execution time for this round
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);
    
    // Add to Gantt chart
    ganttChart.push({
      process: currentProcess.id,
      startTime: currentTime,
      endTime: currentTime + executionTime,
      color: currentProcess.color || '#F87171'
    });
    
    // Update current time and remaining time
    currentTime += executionTime;
    currentProcess.remainingTime! -= executionTime;
    
    // Move newly arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    // If process still has remaining time, put it back in ready queue
    if (currentProcess.remainingTime! > 0) {
      readyQueue.push(currentProcess);
    } else {
      // Process completed
      currentProcess.finishTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.finishTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      
      // Save completed process
      const processIndex = processes.findIndex(p => p.id === currentProcess.id);
      scheduledProcesses[processIndex] = { ...currentProcess };
    }
  }
  
  // Merge consecutive gantt chart entries for the same process
  const mergedGanttChart: GanttChartItem[] = [];
  for (const item of ganttChart) {
    if (mergedGanttChart.length === 0 || 
        mergedGanttChart[mergedGanttChart.length - 1].process !== item.process) {
      mergedGanttChart.push({ ...item });
    } else {
      mergedGanttChart[mergedGanttChart.length - 1].endTime = item.endTime;
    }
  }
  
  return { 
    ganttChart: mergedGanttChart, 
    scheduledProcesses: scheduledProcesses.filter(p => p !== null) 
  };
};
