import { useState, useCallback, useRef, useEffect } from "react";

export interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
  predicted?: number;
}

export interface TrainingStep {
  epoch: number;
  weights: { w0: number; w1: number; w2: number };
  cost: number;
  accuracy: number;
  description: string;
}

export const useLogisticRegressionVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: 2, y: 3, label: 0 },
    { x: 3, y: 3, label: 0 },
    { x: 1, y: 2, label: 0 },
    { x: 2, y: 1, label: 0 },
    { x: 7, y: 8, label: 1 },
    { x: 8, y: 7, label: 1 },
    { x: 6, y: 6, label: 1 },
    { x: 9, y: 8, label: 1 },
    { x: 4, y: 5, label: 0 },
    { x: 5, y: 4, label: 0 },
    { x: 6, y: 7, label: 1 },
    { x: 7, y: 6, label: 1 },
  ]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomData = () => {
    const newDataPoints: DataPoint[] = [];

    for (let i = 0; i < 8; i++) {
      newDataPoints.push({
        x: Math.random() * 4 + 1,
        y: Math.random() * 4 + 1,
        label: 0,
      });
    }

    for (let i = 0; i < 8; i++) {
      newDataPoints.push({
        x: Math.random() * 4 + 5,
        y: Math.random() * 4 + 5,
        label: 1,
      });
    }

    for (let i = 0; i < 4; i++) {
      newDataPoints.push({
        x: Math.random() * 2 + 4,
        y: Math.random() * 2 + 4,
        label: Math.random() > 0.5 ? 1 : 0,
      });
    }

    setDataPoints(newDataPoints);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const sigmoid = (z: number): number => {
    const clampedZ = Math.max(-500, Math.min(500, z));
    return 1 / (1 + Math.exp(-clampedZ));
  };

  const calculateAccuracy = (weights: { w0: number; w1: number; w2: number }): number => {
    let correct = 0;
    dataPoints.forEach((point) => {
      const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
      const prediction = sigmoid(z);
      const predictedClass = prediction >= 0.5 ? 1 : 0;
      if (predictedClass === point.label) correct++;
    });
    return (correct / dataPoints.length) * 100;
  };

  const generateTrainingSteps = useCallback(() => {
    const steps: TrainingStep[] = [];
    let weights = { w0: 0, w1: 0, w2: 0 };
    const learningRate = 0.3;
    const epochs = 20;

    steps.push({
      epoch: 0,
      weights: { ...weights },
      cost: 0,
      accuracy: calculateAccuracy(weights),
      description: `Initial state: All weights set to 0. Starting gradient descent optimization.`,
    });

    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalCost = 0;
      const gradients = { w0: 0, w1: 0, w2: 0 };

      dataPoints.forEach((point) => {
        const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
        const prediction = sigmoid(z);
        const error = prediction - point.label;
        const epsilon = 1e-15;
        const clampedPrediction = Math.max(epsilon, Math.min(1 - epsilon, prediction));
        totalCost += -point.label * Math.log(clampedPrediction) - (1 - point.label) * Math.log(1 - clampedPrediction);
        gradients.w0 += error;
        gradients.w1 += error * point.x;
        gradients.w2 += error * point.y;
      });

      totalCost /= dataPoints.length;

      weights.w0 -= (learningRate * gradients.w0) / dataPoints.length;
      weights.w1 -= (learningRate * gradients.w1) / dataPoints.length;
      weights.w2 -= (learningRate * gradients.w2) / dataPoints.length;

      const accuracy = calculateAccuracy(weights);

      steps.push({
        epoch: epoch + 1,
        weights: { ...weights },
        cost: totalCost,
        accuracy: accuracy,
        description: `Epoch ${epoch + 1}: Updated weights using gradient descent. Cost: ${totalCost.toFixed(4)}, Accuracy: ${accuracy.toFixed(1)}%`,
      });
    }

    setTrainingSteps(steps);
  }, [dataPoints]);

  useEffect(() => {
    generateTrainingSteps();
  }, [generateTrainingSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= trainingSteps.length - 1) {
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
  }, [isPlaying, currentStep, trainingSteps.length, speed]);

  const togglePlayPause = () => {
    if (currentStep >= trainingSteps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < trainingSteps.length - 1) {
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
    setCurrentStep(Math.max(-1, Math.min(step, trainingSteps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(trainingSteps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getCurrentWeights = () => {
    if (currentStep >= 0 && currentStep < trainingSteps.length) {
      return trainingSteps[currentStep].weights;
    }
    return { w0: 0, w1: 0, w2: 0 };
  };

  const getDecisionBoundary = () => {
    const weights = getCurrentWeights();
    const points = [];

    if (Math.abs(weights.w2) > 1e-10) {
      for (let x = 0; x <= 10; x += 0.5) {
        const y = -(weights.w0 + weights.w1 * x) / weights.w2;
        if (y >= 0 && y <= 10) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  const getPrediction = (point: DataPoint) => {
    const weights = getCurrentWeights();
    const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
    return sigmoid(z);
  };

  const getStepDescription = () => {
    if (currentStep === -1) return "Ready to train logistic regression model. Click play to start!";
    const step = trainingSteps[currentStep];
    return step ? step.description : "Training complete!";
  };

  const getPredictionConfidence = (point: DataPoint) => {
    const prediction = getPrediction(point);
    return Math.abs(prediction - 0.5) * 2;
  };

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      trainingSteps,
      dataPoints,
    },
    actions: {
      setSpeed,
      generateRandomData,
      togglePlayPause,
      nextStep,
      prevStep,
      goToStep,
      skipToStart,
      skipToEnd,
      resetVisualization,
      getCurrentWeights,
      getDecisionBoundary,
      getPrediction,
      getStepDescription,
      getPredictionConfidence,
    },
  };
};
