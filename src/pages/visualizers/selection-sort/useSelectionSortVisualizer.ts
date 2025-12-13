import { useEffect, useMemo, useState } from "react";

export interface SelectionStep {
  array: number[];
  currentIndex: number;
  scanIndex: number;
  minIndex: number;
  sortedIndices: number[];
  comparison?: string;
}

export const useSelectionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [scanIndex, setScanIndex] = useState<number>(-1);
  const [minIndex, setMinIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<SelectionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentStep, steps.length, speed]);

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
    setSortedIndices([]);
    setCurrentIndex(-1);
    setScanIndex(-1);
    setMinIndex(-1);
    setIsRunning(false);
    setSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSteps = (arr: number[]) => {
    const result: SelectionStep[] = [];
    const copy = [...arr];
    const n = copy.length;
    let comp = 0;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      result.push({
        array: [...copy],
        currentIndex: i,
        scanIndex: i,
        minIndex: minIdx,
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        comparison: `Start pass ${i + 1}, assume index ${i} (${copy[i]}) is min`,
      });

      for (let j = i + 1; j < n; j++) {
        comp++;
        result.push({
          array: [...copy],
          currentIndex: i,
          scanIndex: j,
          minIndex: minIdx,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          comparison: `Compare ${copy[j]} with current min ${copy[minIdx]}`,
        });
        if (copy[j] < copy[minIdx]) {
          minIdx = j;
          result.push({
            array: [...copy],
            currentIndex: i,
            scanIndex: j,
            minIndex: minIdx,
            sortedIndices: Array.from({ length: i }, (_, k) => k),
            comparison: `New min at index ${j} (${copy[j]})`,
          });
        }
      }

      if (minIdx !== i) {
        [copy[i], copy[minIdx]] = [copy[minIdx], copy[i]];
        result.push({
          array: [...copy],
          currentIndex: i,
          scanIndex: minIdx,
          minIndex: minIdx,
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          comparison: `Swap index ${i} with min index ${minIdx}`,
        });
      }

      result.push({
        array: [...copy],
        currentIndex: i,
        scanIndex: minIdx,
        minIndex: minIdx,
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        comparison: `Position ${i} fixed`,
      });
    }

    setComparisons(comp);
    return result;
  };

  const startSort = () => {
    if (array.length === 0 || isRunning) return;
    resetSort();
    const s = calculateSteps(array);
    setSteps(s);
    setIsRunning(true);
  };

  const applyStep = (index: number) => {
    const step = steps[index];
    setArray(step.array);
    setCurrentIndex(step.currentIndex);
    setScanIndex(step.scanIndex);
    setMinIndex(step.minIndex);
    setSortedIndices(step.sortedIndices);
    setCurrentStep(index);
  };

  const nextStep = () => {
    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }
    applyStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    applyStep(currentStep - 1);
  };

  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    setIsRunning(false);
    applyStep(index);
  };

  const comparisonText = useMemo(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].comparison;
    }
    return undefined;
  }, [currentStep, steps]);

  return {
    state: {
      array,
      arraySize,
      customArrayInput,
      currentIndex,
      scanIndex,
      minIndex,
      sortedIndices,
      isRunning,
      speed,
      steps,
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
    },
  };
};

