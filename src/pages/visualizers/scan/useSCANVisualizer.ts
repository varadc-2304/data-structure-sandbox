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

export const useSCANVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<SeekOperation[]>([]);
  const [scanOrder, setScanOrder] = useState<(number | "boundary")[]>([]);
  const [isMovingToEdge, setIsMovingToEdge] = useState<boolean>(false);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition, direction]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= scanOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, scanOrder.length, speed]);

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

  const calculateSCANOrder = (requests: DiskRequest[], startPosition: number, initialDirection: "left" | "right"): (number | "boundary")[] => {
    const order: (number | "boundary")[] = [];
    const sortedRequests = [...requests].sort((a, b) => a.position - b.position);

    const leftRequests = sortedRequests.filter((req) => req.position < startPosition).reverse();
    const rightRequests = sortedRequests.filter((req) => req.position > startPosition);

    if (initialDirection === "right") {
      rightRequests.forEach((req) => {
        const index = requests.findIndex((r) => r.position === req.position);
        order.push(index);
      });

      if (rightRequests.length > 0) {
        order.push("boundary");
      }

      leftRequests.forEach((req) => {
        const index = requests.findIndex((r) => r.position === req.position);
        order.push(index);
      });
    } else {
      leftRequests.forEach((req) => {
        const index = requests.findIndex((r) => r.position === req.position);
        order.push(index);
      });

      if (leftRequests.length > 0) {
        order.push("boundary");
      }

      rightRequests.reverse().forEach((req) => {
        const index = requests.findIndex((r) => r.position === req.position);
        order.push(index);
      });
    }

    return order;
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setSeekHistory([]);
    setCurrentHeadPosition(initialHeadPosition);
    setIsMovingToEdge(false);

    const resetRequests = requestQueue.map((req) => ({
      ...req,
      processed: false,
      current: false,
    }));
    setRequestQueue(resetRequests);

    if (resetRequests.length > 0) {
      const order = calculateSCANOrder(resetRequests, initialHeadPosition, direction);
      setScanOrder(order);
    } else {
      setScanOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateSCANOrder(requestQueue, initialHeadPosition, direction);
      setScanOrder(order);
    }
  }, [requestQueue, initialHeadPosition, direction]);

  const nextStep = () => {
    if (currentStep >= scanOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    const nextItem = scanOrder[nextStepIndex];

    let targetPosition: number;
    let seekDistance: number;

    if (nextItem === "boundary") {
      targetPosition = direction === "right" ? diskSize - 1 : 0;
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
      setIsMovingToEdge(true);
    } else {
      const nextRequest = requestQueue[nextItem as number];
      targetPosition = nextRequest.position;
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
      setIsMovingToEdge(false);
    }

    setSeekHistory((prev) => [...prev, { from: currentHeadPosition, to: targetPosition, distance: seekDistance }]);

    setTotalSeekTime((prev) => prev + seekDistance);
    setCurrentHeadPosition(targetPosition);

    if (nextItem !== "boundary") {
      const updatedRequests = requestQueue.map((req, idx) => ({
        ...req,
        processed: scanOrder.slice(0, nextStepIndex + 1).filter((item) => typeof item === "number").includes(idx),
        current: idx === nextItem,
      }));
      setRequestQueue(updatedRequests);
    }

    setCurrentStep(nextStepIndex);

    if (nextStepIndex >= scanOrder.length - 1) {
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

    const newHeadPosition = newStep === -1 ? initialHeadPosition : seekHistory[newStep].to;
    setCurrentHeadPosition(newHeadPosition);

    setIsMovingToEdge(newStep >= 0 && scanOrder[newStep] === "boundary");

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: scanOrder.slice(0, newStep + 1).filter((item) => typeof item === "number").includes(idx),
      current: newStep >= 0 && scanOrder[newStep] === idx,
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= scanOrder.length) return;

    setCurrentStep(step);
    setIsPlaying(false);

    let newHeadPosition = initialHeadPosition;
    let newSeekHistory: SeekOperation[] = [];

    for (let i = 0; i <= step; i++) {
      const item = scanOrder[i];
      let targetPosition: number;

      if (item === "boundary") {
        targetPosition = direction === "right" ? diskSize - 1 : 0;
      } else {
        targetPosition = requestQueue[item as number].position;
      }

      const seekDistance = Math.abs(newHeadPosition - targetPosition);
      newSeekHistory.push({
        from: newHeadPosition,
        to: targetPosition,
        distance: seekDistance,
      });

      newHeadPosition = targetPosition;
    }

    setSeekHistory(newSeekHistory);
    setTotalSeekTime(newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0));
    setCurrentHeadPosition(newHeadPosition);
    setIsMovingToEdge(step >= 0 && scanOrder[step] === "boundary");

    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: scanOrder.slice(0, step + 1).filter((item) => typeof item === "number").includes(idx),
      current: step >= 0 && scanOrder[step] === idx,
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= scanOrder.length - 1) {
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
    if (currentStep < scanOrder.length - 1) {
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
      direction,
      currentHeadPosition,
      requestQueue,
      inputPosition,
      currentStep,
      totalSeekTime,
      isPlaying,
      speed,
      seekHistory,
      scanOrder,
      isMovingToEdge,
    },
    actions: {
      setDiskSize,
      setInitialHeadPosition,
      setDirection,
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
