import { useState, useCallback, useRef, useEffect } from "react";

export interface Point {
  x: number;
  y: number;
  cluster: number;
  id: number;
}

export interface Centroid {
  x: number;
  y: number;
  cluster: number;
  prevX?: number;
  prevY?: number;
}

export interface Step {
  points: Point[];
  centroids: Centroid[];
  description: string;
  convergence?: number;
}

export const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export const useKMeansVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [k, setK] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomPoints = (count: number = 50): Point[] => {
    const points: Point[] = [];
    const clusterCenters = [
      { x: 150, y: 150 },
      { x: 350, y: 150 },
      { x: 250, y: 300 },
      { x: 150, y: 300 },
      { x: 350, y: 300 },
    ];

    for (let i = 0; i < count; i++) {
      const centerIndex = i % clusterCenters.length;
      const center = clusterCenters[centerIndex];
      points.push({
        x: center.x + (Math.random() - 0.5) * 100,
        y: center.y + (Math.random() - 0.5) * 100,
        cluster: -1,
        id: i,
      });
    }

    return points;
  };

  const initializeCentroids = (points: Point[], k: number): Centroid[] => {
    const centroids: Centroid[] = [];
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: Math.random() * 450 + 50,
        y: Math.random() * 350 + 50,
        cluster: i,
      });
    }
    return centroids;
  };

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const assignPointsToClusters = (points: Point[], centroids: Centroid[]): Point[] => {
    return points.map((point) => {
      let minDistance = Infinity;
      let closestCluster = 0;

      centroids.forEach((centroid, index) => {
        const distance = calculateDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = index;
        }
      });

      return { ...point, cluster: closestCluster };
    });
  };

  const updateCentroids = (points: Point[], centroids: Centroid[]): Centroid[] => {
    return centroids.map((centroid) => {
      const clusterPoints = points.filter((p) => p.cluster === centroid.cluster);

      if (clusterPoints.length === 0) {
        return centroid;
      }

      const newX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const newY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;

      return {
        ...centroid,
        prevX: centroid.x,
        prevY: centroid.y,
        x: newX,
        y: newY,
      };
    });
  };

  const calculateConvergence = (oldCentroids: Centroid[], newCentroids: Centroid[]): number => {
    let totalMovement = 0;
    for (let i = 0; i < oldCentroids.length; i++) {
      totalMovement += calculateDistance(oldCentroids[i], newCentroids[i]);
    }
    return totalMovement;
  };

  const runKMeans = useCallback((points: Point[], k: number): Step[] => {
    const steps: Step[] = [];
    let currentPoints = [...points];
    let centroids = initializeCentroids(points, k);

    steps.push({
      points: currentPoints.map((p) => ({ ...p, cluster: -1 })),
      centroids: [...centroids],
      description: `Initialize ${k} random centroids`,
    });

    const maxIterations = 20;
    let converged = false;

    for (let iteration = 0; iteration < maxIterations && !converged; iteration++) {
      currentPoints = assignPointsToClusters(currentPoints, centroids);
      steps.push({
        points: [...currentPoints],
        centroids: [...centroids],
        description: `Iteration ${iteration + 1}: Assign points to nearest centroids`,
      });

      const oldCentroids = [...centroids];
      centroids = updateCentroids(currentPoints, centroids);
      const convergence = calculateConvergence(oldCentroids, centroids);

      steps.push({
        points: [...currentPoints],
        centroids: [...centroids],
        description: `Iteration ${iteration + 1}: Update centroids to cluster centers`,
        convergence,
      });

      if (convergence < 1) {
        converged = true;
        steps.push({
          points: [...currentPoints],
          centroids: [...centroids],
          description: `Converged! Centroids have stabilized.`,
          convergence,
        });
      }
    }

    return steps;
  }, []);

  const [points] = useState<Point[]>(() => generateRandomPoints(50));
  const [steps, setSteps] = useState<Step[]>(() => runKMeans(generateRandomPoints(50), 3));
  const maxSteps = steps.length;

  const regenerateData = () => {
    const newPoints = generateRandomPoints(50);
    const newSteps = runKMeans(newPoints, k);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const updateK = (newK: number[]) => {
    const kValue = newK[0];
    setK(kValue);
    const newSteps = runKMeans(points, kValue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const updateStep = useCallback(() => {
    setCurrentStep((prev) => {
      const newStep = prev + 1;
      if (newStep >= maxSteps) {
        setIsPlaying(false);
        return maxSteps - 1;
      }
      return newStep;
    });
  }, [maxSteps]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateStep, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, updateStep]);

  const togglePlayPause = () => {
    if (currentStep >= maxSteps - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, maxSteps - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      k,
      steps,
      maxSteps,
      points,
    },
    actions: {
      setSpeed,
      regenerateData,
      updateK,
      togglePlayPause,
      nextStep,
      prevStep,
      goToStep,
      skipToStart,
      skipToEnd,
      resetVisualization,
    },
  };
};
