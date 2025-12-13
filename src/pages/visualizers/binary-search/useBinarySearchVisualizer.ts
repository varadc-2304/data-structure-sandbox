import { useEffect, useMemo, useState } from "react";

export interface SearchStep {
  left: number;
  right: number;
  mid: number;
  comparison: string;
}

export const useBinarySearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [arraySize, setArraySize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= searchSteps.length - 1 || found !== null) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentStep, searchSteps.length, speed, found]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100)).sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  const generateCustomArray = () => {
    if (!customArrayInput.trim()) return;
    try {
      const newArray = customArrayInput
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((val) => {
          const num = parseInt(val.trim(), 10);
          if (isNaN(num)) throw new Error("Invalid number");
          return num;
        })
        .sort((a, b) => a - b);

      if (newArray.length === 0) throw new Error("Empty array");

      setArray(newArray);
      setCustomArrayInput("");
      resetSearch();
    } catch (error) {
      console.error("Invalid array format", error);
    }
  };

  const calculateSearchSteps = (arr: number[], target: number) => {
    const steps: SearchStep[] = [];
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      let comparison = "";

      if (arr[middle] === target) {
        comparison = "Found!";
        steps.push({ left: low, right: high, mid: middle, comparison });
        break;
      } else if (arr[middle] < target) {
        comparison = `${arr[middle]} < ${target}, search right`;
        steps.push({ left: low, right: high, mid: middle, comparison });
        low = middle + 1;
      } else {
        comparison = `${arr[middle]} > ${target}, search left`;
        steps.push({ left: low, right: high, mid: middle, comparison });
        high = middle - 1;
      }
    }

    return steps;
  };

  const resetSearch = () => {
    setLeft(null);
    setRight(null);
    setMid(null);
    setFound(null);
    setIsRunning(false);
    setCurrentStep(-1);
    setComparisons(0);
    setSearchSteps([]);
  };

  const nextStep = () => {
    if (currentStep >= searchSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);

    const step = searchSteps[nextStepIndex];
    setLeft(step.left);
    setRight(step.right);
    setMid(step.mid);
    setComparisons((prev) => prev + 1);

    if (step.comparison === "Found!") {
      setFound(true);
      setIsRunning(false);
    } else if (nextStepIndex >= searchSteps.length - 1) {
      setFound(false);
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setComparisons(Math.max(0, newStep + 1));

    if (newStep === -1) {
      setLeft(null);
      setRight(null);
      setMid(null);
      setFound(null);
    } else {
      const step = searchSteps[newStep];
      setLeft(step.left);
      setRight(step.right);
      setMid(step.mid);

      if (step.comparison === "Found!") {
        setFound(true);
      } else {
        setFound(null);
      }
    }
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= searchSteps.length) return;

    setCurrentStep(step);
    setIsRunning(false);
    setComparisons(Math.max(0, step + 1));

    if (step === -1) {
      setLeft(null);
      setRight(null);
      setMid(null);
      setFound(null);
    } else {
      const searchStep = searchSteps[step];
      setLeft(searchStep.left);
      setRight(searchStep.right);
      setMid(searchStep.mid);

      if (searchStep.comparison === "Found!") {
        setFound(true);
      } else if (step >= searchSteps.length - 1) {
        setFound(false);
      } else {
        setFound(null);
      }
    }
  };

  const startSearch = () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    resetSearch();
    const steps = calculateSearchSteps(array, searchValue);
    setSearchSteps(steps);
    setIsRunning(true);
  };

  const togglePlayPause = () => {
    if (currentStep >= searchSteps.length - 1 || found !== null) {
      startSearch();
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleSearchValueChange = (value: string) => {
    if (value === "") {
      setSearchValue(null);
      return;
    }
    const num = Number(value);
    if (!Number.isNaN(num)) {
      setSearchValue(num);
    }
  };

  const statusText = useMemo(() => {
    if (found === true) return "Value found!";
    if (found === false) return "Value not found.";
    if (isRunning) return "Searching...";
    return "Ready";
  }, [found, isRunning]);

  return {
    state: {
      array,
      customArrayInput,
      arraySize,
      searchValue,
      left,
      right,
      mid,
      found,
      isRunning,
      speed,
      currentStep,
      comparisons,
      searchSteps,
      statusText,
    },
    actions: {
      setArray,
      setArraySize,
      setCustomArrayInput,
      setSpeed,
      setIsRunning,
      handleSearchValueChange,
      generateRandomArray,
      generateCustomArray,
      resetSearch,
      startSearch,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
    },
  };
};

