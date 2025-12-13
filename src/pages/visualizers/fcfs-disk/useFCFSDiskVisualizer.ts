import { useState, useEffect } from "react";

export interface DiskRequest {
  position: number;
  processed: boolean;
  current: boolean;
}

export interface SeekOperation {
  from: number;
  to: number;
  distance: number;
}

export const useFCFSDiskVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<SeekOperation[]>([]);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= requestQueue.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, requestQueue.length, speed]);

  const handleAddRequest = () => {
    if (!inputPosition.trim()) return;

    try {
      const newPositions = inputPosition
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((pos) => {
          const parsedPos = parseInt(pos.trim());
          if (isNaN(parsedPos) || parsedPos < 0 || parsedPos >= diskSize) {
            throw new Error("Invalid position");
          }
          return parsedPos;
        });

      const newRequests = newPositions.map((position) => ({
        position,
        processed: false,
        current: false,
      }));

      setRequestQueue((prev) => [...prev, ...newRequests]);
      setInputPosition("");
    } catch (error) {
      console.error("Invalid position format or out of range");
    }
  };

  const generateRandomRequests = (count: number) => {
    if (count <= 0 || count > 50) return;
    
    const positions = new Set<number>();
    while (positions.size < count) {
      const randomPos = Math.floor(Math.random() * diskSize);
      positions.add(randomPos);
    }
    
    const newRequests = Array.from(positions).map((position) => ({
      position,
      processed: false,
      current: false,
    }));
    
    setRequestQueue((prev) => [...prev, ...newRequests]);
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setSeekHistory([]);
    setCurrentHeadPosition(initialHeadPosition);

    const resetRequests = requestQueue.map((req) => ({
      ...req,
      processed: false,
      current: false,
    }));
    setRequestQueue(resetRequests);
  };

  const nextStep = () => {
    if (currentStep >= requestQueue.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    const nextRequest = requestQueue[nextStepIndex];

    const seekDistance = Math.abs(currentHeadPosition - nextRequest.position);

    setSeekHistory((prev) => [...prev, { from: currentHeadPosition, to: nextRequest.position, distance: seekDistance }]);

    setTotalSeekTime((prev) => prev + seekDistance);

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: idx <= nextStepIndex,
      current: idx === nextStepIndex,
    }));
    setRequestQueue(updatedRequests);

    setCurrentStep(nextStepIndex);
    setCurrentHeadPosition(nextRequest.position);

    if (nextStepIndex >= requestQueue.length - 1) {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;

    const newStep = currentStep - 1;
    setCurrentStep(newStep);

    const newSeekHistory = seekHistory.slice(0, newStep + 1);
    setSeekHistory(newSeekHistory);

    const newTotalSeekTime = newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0);
    setTotalSeekTime(newTotalSeekTime);

    const newHeadPosition = newStep === -1 ? initialHeadPosition : requestQueue[newStep].position;
    setCurrentHeadPosition(newHeadPosition);

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: idx <= newStep,
      current: newStep >= 0 && idx === newStep,
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= requestQueue.length) return;

    setCurrentStep(step);
    setIsPlaying(false);

    const newHeadPosition = step === -1 ? initialHeadPosition : requestQueue[step].position;
    setCurrentHeadPosition(newHeadPosition);

    const newSeekHistory: SeekOperation[] = [];
    let headPos = initialHeadPosition;

    for (let i = 0; i <= step; i++) {
      const targetPosition = requestQueue[i].position;
      const seekDistance = Math.abs(headPos - targetPosition);
      newSeekHistory.push({
        from: headPos,
        to: targetPosition,
        distance: seekDistance,
      });
      headPos = targetPosition;
    }

    setSeekHistory(newSeekHistory);
    setTotalSeekTime(newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0));

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: idx <= step,
      current: step >= 0 && idx === step,
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= requestQueue.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const runSimulation = () => {
    if (requestQueue.length === 0) return;
    resetSimulation();
    setIsPlaying(true);
  };

  const pauseSimulation = () => {
    setIsPlaying(false);
  };

  const resumeSimulation = () => {
    if (currentStep < requestQueue.length - 1) {
      setIsPlaying(true);
    }
  };

  const calculatePosition = (position: number) => {
    return Math.min(Math.max((position / (diskSize - 1)) * 80, 0), 80);
  };

  return {
    state: {
      diskSize,
      initialHeadPosition,
      currentHeadPosition,
      requestQueue,
      inputPosition,
      currentStep,
      totalSeekTime,
      isPlaying,
      speed,
      seekHistory,
    },
    actions: {
      setDiskSize,
      setInitialHeadPosition,
      setInputPosition,
      setSpeed,
      handleAddRequest,
      generateRandomRequests,
      runSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      calculatePosition,
    },
  };
};
