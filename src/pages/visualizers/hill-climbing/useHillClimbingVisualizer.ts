import { useState, useCallback, useRef, useEffect } from "react";

export interface Position {
  x: number;
  y: number;
  value: number;
}

export interface Step {
  position: Position;
  neighbors: Position[];
  bestNeighbor?: Position;
  description: string;
  isStuck?: boolean;
}

const landscapes = [
  (x: number, y: number): number => {
    const peak1 = 100 * Math.exp(-((x - 3) ** 2 + (y - 3) ** 2) / 2);
    const peak2 = 80 * Math.exp(-((x - 7) ** 2 + (y - 7) ** 2) / 1.5);
    const peak3 = 60 * Math.exp(-((x - 2) ** 2 + (y - 8) ** 2) / 1.2);
    const peak4 = 90 * Math.exp(-((x - 8) ** 2 + (y - 2) ** 2) / 1.8);
    const noise = 5 * Math.sin(x) * Math.cos(y);
    return peak1 + peak2 + peak3 + peak4 + noise;
  },
  (x: number, y: number): number => {
    const centralPeak = 150 * Math.exp(-((x - 5) ** 2 + (y - 5) ** 2) / 3);
    const plateau = 40 * Math.exp(-((x - 2) ** 2 + (y - 2) ** 2) / 8);
    const ridge = 30 * Math.exp(-((x - 8) ** 2) / 2) * Math.exp(-((y - 8) ** 2) / 2);
    return centralPeak + plateau + ridge;
  },
  (x: number, y: number): number => {
    const peak1 = 120 * Math.exp(-((x - 1) ** 2 + (y - 9) ** 2) / 1.5);
    const peak2 = 100 * Math.exp(-((x - 9) ** 2 + (y - 1) ** 2) / 1.8);
    const peak3 = 80 * Math.exp(-((x - 5) ** 2 + (y - 8) ** 2) / 2);
    const peak4 = 70 * Math.exp(-((x - 2) ** 2 + (y - 2) ** 2) / 1.2);
    const valley = -20 * Math.exp(-((x - 5) ** 2 + (y - 5) ** 2) / 4);
    return peak1 + peak2 + peak3 + peak4 + valley + 20;
  },
];

export const mapNames = ["Multi-Peak Landscape", "Central Peak with Plateau", "Valley with Local Maxima"];

export const useHillClimbingVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1500);
  const [steps, setSteps] = useState<Step[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [startPosition, setStartPosition] = useState<Position>({ x: 1, y: 1, value: 0 });
  const [currentMap, setCurrentMap] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getHeight = (x: number, y: number, mapIndex?: number): number => {
    const landscapeIndex = mapIndex !== undefined ? mapIndex : currentMap;
    return landscapes[landscapeIndex](x, y);
  };

  const changeMap = () => {
    const newMapIndex = (currentMap + 1) % landscapes.length;
    setCurrentMap(newMapIndex);
    const newHeight = getHeight(startPosition.x, startPosition.y, newMapIndex);
    setStartPosition({ ...startPosition, value: newHeight });
    resetVisualization();
  };

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isPlaying) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 50);
    const y = Math.floor((event.clientY - rect.top) / 40);

    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
      const newStart = { x, y, value: getHeight(x, y) };
      setStartPosition(newStart);
      resetVisualization();
    }
  };

  const getNeighbors = (pos: Position): Position[] => {
    const neighbors: Position[] = [];
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newX = pos.x + dx;
      const newY = pos.y + dy;

      if (newX >= 0 && newX <= 10 && newY <= 10) {
        neighbors.push({
          x: newX,
          y: newY,
          value: getHeight(newX, newY),
        });
      }
    });

    return neighbors;
  };

  const generateHillClimbingSteps = useCallback(() => {
    const newSteps: Step[] = [];
    const newPath: Position[] = [startPosition];
    let currentPos = startPosition;
    let stuck = false;

    newSteps.push({
      position: currentPos,
      neighbors: [],
      description: `Starting hill climbing at position (${currentPos.x}, ${currentPos.y}) with height ${currentPos.value.toFixed(2)}`,
    });

    for (let i = 0; i < 15 && !stuck; i++) {
      const neighbors = getNeighbors(currentPos);
      const bestNeighbor = neighbors.reduce((best, neighbor) => (neighbor.value > best.value ? neighbor : best));

      if (bestNeighbor.value <= currentPos.value) {
        newSteps.push({
          position: currentPos,
          neighbors,
          bestNeighbor,
          description: `Local maximum reached! No neighbor has higher value than ${currentPos.value.toFixed(2)}`,
          isStuck: true,
        });
        stuck = true;
      } else {
        newSteps.push({
          position: currentPos,
          neighbors,
          bestNeighbor,
          description: `Moving from (${currentPos.x}, ${currentPos.y}) to (${bestNeighbor.x}, ${bestNeighbor.y}). Height: ${currentPos.value.toFixed(2)} → ${bestNeighbor.value.toFixed(2)}`,
        });

        currentPos = bestNeighbor;
        newPath.push(currentPos);
      }
    }

    setSteps(newSteps);
    setPath(newPath);
  }, [startPosition, currentMap]);

  useEffect(() => {
    const newHeight = getHeight(startPosition.x, startPosition.y);
    setStartPosition((prev) => ({ ...prev, value: newHeight }));
  }, [currentMap]);

  useEffect(() => {
    generateHillClimbingSteps();
  }, [generateHillClimbingSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const togglePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, steps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(steps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getStepDescription = () => {
    if (currentStep === -1) return "Ready to start hill climbing algorithm";
    const step = steps[currentStep];
    return step ? step.description : "Hill climbing complete!";
  };

  const getCurrentPosition = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].position;
    }
    return null;
  };

  const getCurrentNeighbors = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].neighbors;
    }
    return [];
  };

  const getBestNeighbor = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].bestNeighbor;
    }
    return null;
  };

  const getColorForHeight = (height: number): string => {
    const maxHeight = 200;
    const intensity = Math.min(height / maxHeight, 1);
    const red = Math.floor(255 * (1 - intensity));
    const green = Math.floor(255 * intensity);
    return `rgb(${red}, ${green}, 0)`;
  };

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      steps,
      path,
      startPosition,
      currentMap,
    },
    actions: {
      setSpeed,
      changeMap,
      handleMapClick,
      togglePlayPause,
      nextStep,
      prevStep,
      goToStep,
      skipToStart,
      skipToEnd,
      resetVisualization,
      getStepDescription,
      getCurrentPosition,
      getCurrentNeighbors,
      getBestNeighbor,
      getHeight,
      getColorForHeight,
    },
  };
};
