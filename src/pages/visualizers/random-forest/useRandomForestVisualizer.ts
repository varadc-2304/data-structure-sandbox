import { useState, useCallback, useRef, useEffect } from "react";

export interface TreeNode {
  id: number;
  feature: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: string;
  samples: number;
  isLeaf: boolean;
  level: number;
  active: boolean;
  treeIndex: number;
}

export interface DataPoint {
  age: number;
  income: number;
  buys: "Yes" | "No";
}

export interface ForestStep {
  type: "tree_generation" | "prediction" | "voting";
  treeIndex?: number;
  description: string;
  nodeId?: number;
}

export const useRandomForestVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1500);
  const [forest, setForest] = useState<TreeNode[]>([]);
  const [forestSteps, setForestSteps] = useState<ForestStep[]>([]);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [finalPrediction, setFinalPrediction] = useState<string>("");
  const [sampleData, setSampleData] = useState<DataPoint[]>([
    { age: 25, income: 50000, buys: "No" },
    { age: 35, income: 80000, buys: "Yes" },
    { age: 45, income: 60000, buys: "Yes" },
    { age: 20, income: 30000, buys: "No" },
    { age: 35, income: 120000, buys: "Yes" },
  ]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomData = () => {
    const newData: DataPoint[] = [];
    for (let i = 0; i < 8; i++) {
      const age = Math.floor(Math.random() * 40) + 20;
      const income = Math.floor(Math.random() * 100000) + 30000;
      const buys = Math.random() > 0.5 ? "Yes" : "No";
      newData.push({ age, income, buys });
    }
    setSampleData(newData);
    resetVisualization();
  };

  const generateRandomTree = (treeIndex: number): TreeNode => {
    const features = ["Income", "Age"];
    const thresholds = { Income: [45000, 55000, 65000], Age: [25, 30, 35] };

    const randomFeature = features[Math.floor(Math.random() * features.length)];
    const randomThreshold = thresholds[randomFeature as keyof typeof thresholds][Math.floor(Math.random() * thresholds[randomFeature as keyof typeof thresholds].length)];

    return {
      id: treeIndex * 10 + 1,
      feature: randomFeature,
      threshold: randomThreshold,
      samples: 100,
      isLeaf: false,
      level: 0,
      active: false,
      treeIndex,
      left: {
        id: treeIndex * 10 + 2,
        feature: "",
        prediction: Math.random() > 0.4 ? "Yes" : "No",
        samples: 45,
        isLeaf: true,
        level: 1,
        active: false,
        treeIndex,
      },
      right: {
        id: treeIndex * 10 + 3,
        feature: "",
        prediction: Math.random() > 0.6 ? "Yes" : "No",
        samples: 55,
        isLeaf: true,
        level: 1,
        active: false,
        treeIndex,
      },
    };
  };

  const generateForestSteps = useCallback(() => {
    const steps: ForestStep[] = [];
    const numTrees = 3;

    for (let i = 0; i < numTrees; i++) {
      steps.push({
        type: "tree_generation",
        treeIndex: i,
        description: `Generating Decision Tree ${i + 1} with random feature subset`,
      });
    }

    for (let i = 0; i < numTrees; i++) {
      steps.push({
        type: "prediction",
        treeIndex: i,
        description: `Tree ${i + 1} making prediction`,
      });
    }

    steps.push({
      type: "voting",
      description: "Combining predictions through majority voting",
    });

    setForestSteps(steps);
  }, []);

  useEffect(() => {
    generateForestSteps();
  }, [generateForestSteps]);

  const updateForest = useCallback(() => {
    const currentStepData = forestSteps[currentStep];
    if (!currentStepData) return;

    if (currentStepData.type === "tree_generation" && currentStepData.treeIndex !== undefined) {
      setForest((prev) => {
        const newForest = [...prev];
        if (!newForest[currentStepData.treeIndex!]) {
          newForest[currentStepData.treeIndex!] = generateRandomTree(currentStepData.treeIndex!);
        }
        return newForest;
      });
    } else if (currentStepData.type === "prediction" && currentStepData.treeIndex !== undefined) {
      setPredictions((prev) => {
        const newPredictions = [...prev];
        newPredictions[currentStepData.treeIndex!] = Math.random() > 0.5 ? "Yes" : "No";
        return newPredictions;
      });
    } else if (currentStepData.type === "voting") {
      const yesCount = predictions.filter((p) => p === "Yes").length;
      const noCount = predictions.filter((p) => p === "No").length;
      setFinalPrediction(yesCount > noCount ? "Yes" : "No");
    }
  }, [currentStep, forestSteps, predictions]);

  useEffect(() => {
    if (currentStep >= 0) {
      updateForest();
    }
  }, [currentStep, updateForest]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= forestSteps.length - 1) {
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
  }, [isPlaying, currentStep, forestSteps.length, speed]);

  const togglePlayPause = () => {
    if (currentStep >= forestSteps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < forestSteps.length - 1) {
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
    setCurrentStep(Math.max(-1, Math.min(step, forestSteps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(forestSteps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setForest([]);
    setPredictions([]);
    setFinalPrediction("");
  };

  const getStepDescription = () => {
    if (currentStep === -1) return "Ready to build Random Forest";
    const step = forestSteps[currentStep];
    return step ? step.description : "Random Forest complete!";
  };

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      forest,
      forestSteps,
      predictions,
      finalPrediction,
      sampleData,
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
      getStepDescription,
    },
  };
};
