import { useEffect, useMemo, useState } from "react";

export interface LinearSearchStep {
  index: number;
  comparison: string;
}

export const useLinearSearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [arraySize, setArraySize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [searchSteps, setSearchSteps] = useState<LinearSearchStep[]>([]);

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
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
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
        });
      if (newArray.length === 0) throw new Error("Empty array");
      setArray(newArray);
      setCustomArrayInput("");
      resetSearch();
    } catch (error) {
      console.error("Invalid array format", error);
    }
  };

  const calculateSearchSteps = (arr: number[], target: number) => {
    const steps: LinearSearchStep[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        steps.push({ index: i, comparison: "Found!" });
        break;
      } else {
        steps.push({ index: i, comparison: `${arr[i]} ≠ ${target}` });
      }
    }
    return steps;
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFound(null);
    setFoundIndex(null);
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
    setCurrentIndex(step.index);
    setComparisons((prev) => prev + 1);
    if (step.comparison === "Found!") {
      setFound(true);
      setFoundIndex(step.index);
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
      setCurrentIndex(null);
      setFound(null);
      setFoundIndex(null);
    } else {
      const step = searchSteps[newStep];
      setCurrentIndex(step.index);
      if (step.comparison === "Found!") {
        setFound(true);
        setFoundIndex(step.index);
      } else {
        setFound(null);
        setFoundIndex(null);
      }
    }
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= searchSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
    setComparisons(Math.max(0, step + 1));
    if (step === -1) {
      setCurrentIndex(null);
      setFound(null);
      setFoundIndex(null);
    } else {
      const searchStep = searchSteps[step];
      setCurrentIndex(searchStep.index);
      if (searchStep.comparison === "Found!") {
        setFound(true);
        setFoundIndex(searchStep.index);
      } else if (step >= searchSteps.length - 1) {
        setFound(false);
      } else {
        setFound(null);
        setFoundIndex(null);
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
    if (found === true) return `Value found at index ${foundIndex}!`;
    if (found === false) return "Value not found.";
    if (isRunning) return "Searching...";
    return "Ready";
  }, [found, foundIndex, isRunning]);

  return {
    state: {
      array,
      customArrayInput,
      arraySize,
      searchValue,
      currentIndex,
      found,
      foundIndex,
      isRunning,
      speed,
      currentStep,
      comparisons,
      searchSteps,
      statusText,
    },
    actions: {
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
