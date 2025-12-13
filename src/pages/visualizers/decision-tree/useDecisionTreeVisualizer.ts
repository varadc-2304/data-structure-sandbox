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
}

export const useDecisionTreeVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const buildTree = (): TreeNode => {
    return {
      id: 1,
      feature: "Income",
      threshold: 55000,
      samples: 100,
      isLeaf: false,
      level: 0,
      active: false,
      left: {
        id: 2,
        feature: "Age",
        threshold: 30,
        samples: 40,
        isLeaf: false,
        level: 1,
        active: false,
        left: {
          id: 4,
          feature: "",
          prediction: "No",
          samples: 25,
          isLeaf: true,
          level: 2,
          active: false,
        },
        right: {
          id: 5,
          feature: "",
          prediction: "Yes",
          samples: 15,
          isLeaf: true,
          level: 2,
          active: false,
        },
      },
      right: {
        id: 3,
        feature: "",
        prediction: "Yes",
        samples: 60,
        isLeaf: true,
        level: 1,
        active: false,
      },
    };
  };

  const [tree, setTree] = useState<TreeNode>(buildTree());

  const getAllNodes = (node: TreeNode): TreeNode[] => {
    const nodes: TreeNode[] = [node];
    if (node.left) nodes.push(...getAllNodes(node.left));
    if (node.right) nodes.push(...getAllNodes(node.right));
    return nodes;
  };

  const allNodes = getAllNodes(tree);
  const maxSteps = allNodes.length;

  const updateTree = useCallback(() => {
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
    const updatedTree = JSON.parse(JSON.stringify(buildTree()));
    const nodes = getAllNodes(updatedTree);
    nodes.forEach((node, index) => {
      node.active = index <= currentStep;
    });
    setTree(updatedTree);
  }, [currentStep]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateTree, speed);
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
  }, [isPlaying, speed, updateTree]);

  const togglePlayPause = () => {
    if (currentStep >= maxSteps - 1) {
      resetVisualization();
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
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, maxSteps - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getStepDescription = () => {
    if (currentStep === -1) return "Ready to build decision tree";
    if (currentStep === 0) return "Root: Split on Income ≤ $55,000";
    if (currentStep === 1) return "Left branch: Split on Age ≤ 30";
    if (currentStep === 2) return "Leaf: Age ≤ 30 → No";
    if (currentStep === 3) return "Leaf: Age > 30 → Yes";
    if (currentStep === 4) return "Leaf: Income > $55,000 → Yes";
    return "Decision tree construction complete!";
  };

  return {
    state: {
      tree,
      isPlaying,
      currentStep,
      speed,
      maxSteps,
    },
    actions: {
      setSpeed,
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
