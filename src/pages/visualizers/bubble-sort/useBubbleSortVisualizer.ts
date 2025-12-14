import { useEffect, useMemo, useState } from "react";

export interface SortStep {
  array: number[];
  currentSwapIndices: number[];
  sortedIndices: number[];
  comparison?: string;
}

export const useBubbleSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [currentSwapIndices, setCurrentSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sortSteps, setSortSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentStep, sortSteps.length, speed]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    resetSort();
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
      resetSort();
    } catch (error) {
      console.error("Invalid array format", error);
    }
  };

  const resetSort = () => {
    setCurrentSwapIndices([]);
    setSortedIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: SortStep[] = [];
    const arrCopy = [...arr];
    const n = arrCopy.length;
    let compCount = 0;

    steps.push({
      array: [...arrCopy],
      currentSwapIndices: [],
      sortedIndices: [],
      comparison: "Starting Bubble Sort",
    });

    for (let i = 0; i < n; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        compCount++;

        steps.push({
          array: [...arrCopy],
          currentSwapIndices: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
          comparison: `Comparing ${arrCopy[j]} and ${arrCopy[j + 1]}`,
        });

        if (arrCopy[j] > arrCopy[j + 1]) {
          [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];
          swapped = true;

          steps.push({
            array: [...arrCopy],
            currentSwapIndices: [j, j + 1],
            sortedIndices: Array.from({ length: i }, (_, k) => n - 1 - k),
            comparison: `Swapped ${arrCopy[j + 1]} and ${arrCopy[j]}`,
          });
        }
      }

      steps.push({
        array: [...arrCopy],
        currentSwapIndices: [],
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
        comparison: `Position ${n - i} is sorted`,
      });

      if (!swapped) break;
    }

    setComparisons(compCount);
    return steps;
  };

  const startSort = () => {
    if (array.length === 0 || isRunning) return;
    resetSort();
    const steps = calculateSortSteps(array);
    setSortSteps(steps);
    if (steps.length > 0) {
      applyStep(0);
    }
    setIsRunning(true);
  };

  const applyStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
    const step = sortSteps[stepIndex];
    setArray(step.array);
    setCurrentSwapIndices(step.currentSwapIndices);
    setSortedIndices(step.sortedIndices);
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    const nextIndex = currentStep + 1;
    applyStep(nextIndex);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    const prevIndex = currentStep - 1;
    applyStep(prevIndex);
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
    setIsRunning(false);
    applyStep(stepIndex);
  };

  const comparisonText = useMemo(() => {
    if (currentStep >= 0 && currentStep < sortSteps.length) {
      return sortSteps[currentStep].comparison;
    }
    return undefined;
  }, [currentStep, sortSteps]);

  return {
    state: {
      array,
      arraySize,
      customArrayInput,
      currentSwapIndices,
      sortedIndices,
      isRunning,
      speed,
      sortSteps,
      currentStep,
      comparisons,
      comparisonText,
    },
    actions: {
      setArraySize,
      setCustomArrayInput,
      setSpeed,
      setIsRunning,
      generateRandomArray,
      generateCustomArray,
      resetSort,
      startSort,
      nextStep,
      prevStep,
      goToStep,
    },
  };
};

