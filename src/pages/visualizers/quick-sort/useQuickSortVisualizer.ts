import { useEffect, useMemo, useState } from "react";

export interface QuickSortStep {
  array: number[];
  pivotIndex: number;
  low: number;
  high: number;
  i: number;
  j: number;
  partitionedIndices: number[];
  comparison?: string;
}

export const useQuickSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [pivotIndex, setPivotIndex] = useState<number>(-1);
  const [low, setLow] = useState<number>(-1);
  const [high, setHigh] = useState<number>(-1);
  const [i, setI] = useState<number>(-1);
  const [j, setJ] = useState<number>(-1);
  const [partitionedIndices, setPartitionedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sortSteps, setSortSteps] = useState<QuickSortStep[]>([]);
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
    setPivotIndex(-1);
    setLow(-1);
    setHigh(-1);
    setI(-1);
    setJ(-1);
    setPartitionedIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: QuickSortStep[] = [];
    const arrCopy = [...arr];
    let compCount = 0;

    const quickSort = (array: number[], low: number, high: number) => {
      if (low < high) {
        steps.push({
          array: [...array],
          pivotIndex: high,
          low,
          high,
          i: -1,
          j: -1,
          partitionedIndices: [],
          comparison: `Sorting subarray from index ${low} to ${high}, choosing pivot ${array[high]}`,
        });

        const pivotIndex = partition(array, low, high);
        quickSort(array, low, pivotIndex - 1);
        quickSort(array, pivotIndex + 1, high);
      }
    };

    const partition = (array: number[], low: number, high: number): number => {
      const pivot = array[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        compCount++;

        steps.push({
          array: [...array],
          pivotIndex: high,
          low,
          high,
          i: i + 1,
          j,
          partitionedIndices: [],
          comparison: `Comparing ${array[j]} with pivot ${pivot}`,
        });

        if (array[j] <= pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];

          steps.push({
            array: [...array],
            pivotIndex: high,
            low,
            high,
            i,
            j,
            partitionedIndices: [],
            comparison: `${array[j]} ≤ ${pivot}, swapped with element at index ${i}`,
          });
        }
      }

      [array[i + 1], array[high]] = [array[high], array[i + 1]];

      steps.push({
        array: [...array],
        pivotIndex: i + 1,
        low,
        high,
        i: -1,
        j: -1,
        partitionedIndices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        comparison: `Placed pivot ${pivot} at its correct position ${i + 1}`,
      });

      return i + 1;
    };

    steps.push({
      array: [...arrCopy],
      pivotIndex: -1,
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      partitionedIndices: [],
      comparison: "Starting Quick Sort - Divide and Conquer with partitioning",
    });

    quickSort(arrCopy, 0, arrCopy.length - 1);

    steps.push({
      array: [...arrCopy],
      pivotIndex: -1,
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      partitionedIndices: Array.from({ length: arrCopy.length }, (_, idx) => idx),
      comparison: "Array is completely sorted!",
    });

    setComparisons(compCount);
    return steps;
  };

  const startSort = () => {
    if (array.length === 0 || isRunning) return;
    resetSort();
    const steps = calculateSortSteps(array);
    setSortSteps(steps);
    if (steps.length > 0) {
      setCurrentStep(0);
      applyStep(0);
    }
    setIsRunning(true);
  };

  const applyStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
    const step = sortSteps[stepIndex];
    setArray(step.array);
    setPivotIndex(step.pivotIndex);
    setLow(step.low);
    setHigh(step.high);
    setI(step.i);
    setJ(step.j);
    setPartitionedIndices(step.partitionedIndices);
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
    if (currentStep >= sortSteps.length - 1) {
      startSort();
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const getBarHeight = (value: number) => {
    if (array.length === 0) return 40;
    const maxHeight = 200;
    const maxValue = Math.max(...array, 1);
    return (value / maxValue) * maxHeight;
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
      pivotIndex,
      low,
      high,
      i,
      j,
      partitionedIndices,
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
      generateRandomArray,
      generateCustomArray,
      resetSort,
      startSort,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      getBarHeight,
      setIsRunning,
    },
  };
};
