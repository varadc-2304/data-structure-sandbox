import { useEffect, useMemo, useState } from "react";

export interface InsertionSortStep {
  array: number[];
  currentIndex: number;
  comparing: number;
  sortedIndices: number[];
  comparison?: string;
}

export const useInsertionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [comparing, setComparing] = useState<number>(-1);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sortSteps, setSortSteps] = useState<InsertionSortStep[]>([]);
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
    setCurrentIndex(-1);
    setComparing(-1);
    setSortedIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: InsertionSortStep[] = [];
    const arrCopy = [...arr];
    let compCount = 0;

    steps.push({
      array: [...arrCopy],
      currentIndex: -1,
      comparing: -1,
      sortedIndices: [],
      comparison: "Starting Insertion Sort",
    });

    for (let i = 1; i < arrCopy.length; i++) {
      const key = arrCopy[i];
      let j = i - 1;

      steps.push({
        array: [...arrCopy],
        currentIndex: i,
        comparing: i,
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        comparison: `Processing element at index ${i} (${key})`,
      });

      while (j >= 0 && arrCopy[j] > key) {
        compCount++;
        steps.push({
          array: [...arrCopy],
          currentIndex: i,
          comparing: j,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          comparison: `Comparing ${arrCopy[j]} > ${key}, shifting ${arrCopy[j]} right`,
        });

        arrCopy[j + 1] = arrCopy[j];
        steps.push({
          array: [...arrCopy],
          currentIndex: i,
          comparing: j,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          comparison: `Shifted ${arrCopy[j]} to position ${j + 1}`,
        });
        j--;
      }

      if (j >= 0) {
        compCount++;
      }

      arrCopy[j + 1] = key;
      steps.push({
        array: [...arrCopy],
        currentIndex: -1,
        comparing: -1,
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        comparison: `Inserted ${key} at position ${j + 1}`,
      });
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
    setCurrentIndex(step.currentIndex);
    setComparing(step.comparing);
    setSortedIndices(step.sortedIndices);
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    applyStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    applyStep(currentStep - 1);
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
    setIsRunning(false);
    applyStep(stepIndex);
  };

  const togglePlayPause = () => {
    if (array.length === 0) return;
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (sortSteps.length === 0) {
        startSort();
      } else {
        setIsRunning(true);
      }
    }
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
      currentIndex,
      comparing,
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
      togglePlayPause,
    },
  };
};
