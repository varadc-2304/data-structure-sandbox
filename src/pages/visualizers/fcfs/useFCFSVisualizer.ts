import { useState, useEffect, useRef } from "react";
import { Process, GanttChartItem, runFCFS } from "@/utils/cpuSchedulingUtils";
import { useToast } from "@/components/ui/use-toast";

export const useFCFSVisualizer = () => {
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

    const { ganttChart: newGanttChart, scheduledProcesses: newScheduledProcesses } = runFCFS(processes);

    setGanttChart(newGanttChart);
    setScheduledProcesses(newScheduledProcesses);

    if (newGanttChart.length > 0) {
      setTotalTime(newGanttChart[newGanttChart.length - 1].endTime);
      setCurrentTime(0);
      setIsSimulating(true);

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
    setCurrentTime((prev) => Math.max(0, prev - 1));
  };

  const stepForward = () => {
    pauseSimulation();
    setCurrentTime((prev) => Math.min(totalTime, prev + 1));
  };

  useEffect(() => {
    if (isSimulating) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }

      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
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

  return {
    state: {
      processes,
      ganttChart,
      scheduledProcesses,
      currentTime,
      isSimulating,
      totalTime,
      avgWaitingTime,
      avgTurnaroundTime,
    },
    actions: {
      setProcesses,
      runSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      stepBackward,
      stepForward,
    },
  };
};
