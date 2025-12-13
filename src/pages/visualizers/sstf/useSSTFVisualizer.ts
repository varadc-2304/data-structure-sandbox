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

export const useSSTFVisualizer = () => {
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
  const [sstfOrder, setSstfOrder] = useState<number[]>([]);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= sstfOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, sstfOrder.length, speed]);

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

  const calculateSSTFOrder = (requests: DiskRequest[], startPosition: number): number[] => {
    const order: number[] = [];
    const unprocessed = [...requests];
    let currentPos = startPosition;

    while (unprocessed.length > 0) {
      let minDistance = Infinity;
      let closestIndex = -1;
      let closestOriginalIndex = -1;

      unprocessed.forEach((req, idx) => {
        const distance = Math.abs(currentPos - req.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
          closestOriginalIndex = requests.findIndex((r) => r.position === req.position && !order.includes(requests.indexOf(r)));
        }
      });

      if (closestIndex !== -1) {
        order.push(closestOriginalIndex);
        currentPos = unprocessed[closestIndex].position;
        unprocessed.splice(closestIndex, 1);
      }
    }

    return order;
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

    if (resetRequests.length > 0) {
      const order = calculateSSTFOrder(resetRequests, initialHeadPosition);
      setSstfOrder(order);
    } else {
      setSstfOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateSSTFOrder(requestQueue, initialHeadPosition);
      setSstfOrder(order);
    }
  }, [requestQueue, initialHeadPosition]);

  const nextStep = () => {
    if (currentStep >= sstfOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    const nextRequestIndex = sstfOrder[nextStepIndex];
    const nextRequest = requestQueue[nextRequestIndex];

    const seekDistance = Math.abs(currentHeadPosition - nextRequest.position);

    setSeekHistory((prev) => [...prev, { from: currentHeadPosition, to: nextRequest.position, distance: seekDistance }]);

    setTotalSeekTime((prev) => prev + seekDistance);
    setCurrentHeadPosition(nextRequest.position);

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: sstfOrder.slice(0, nextStepIndex + 1).includes(idx),
      current: idx === nextRequestIndex,
    }));
    setRequestQueue(updatedRequests);

    setCurrentStep(nextStepIndex);

    if (nextStepIndex >= sstfOrder.length - 1) {
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

    const newHeadPosition = newStep === -1 ? initialHeadPosition : requestQueue[sstfOrder[newStep]].position;
    setCurrentHeadPosition(newHeadPosition);

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: sstfOrder.slice(0, newStep + 1).includes(idx),
      current: newStep >= 0 && sstfOrder[newStep] === idx,
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= sstfOrder.length) return;

    setCurrentStep(step);
    setIsPlaying(false);

    const newHeadPosition = step === -1 ? initialHeadPosition : requestQueue[sstfOrder[step]].position;
    setCurrentHeadPosition(newHeadPosition);

    const newSeekHistory: SeekOperation[] = [];
    let headPos = initialHeadPosition;

    for (let i = 0; i <= step; i++) {
      const requestIndex = sstfOrder[i];
      const targetPosition = requestQueue[requestIndex].position;
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
      processed: sstfOrder.slice(0, step + 1).includes(idx),
      current: step >= 0 && sstfOrder[step] === idx,
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= sstfOrder.length - 1) {
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
    if (currentStep < sstfOrder.length - 1) {
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
      sstfOrder,
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
