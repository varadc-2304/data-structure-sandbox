import { useEffect, useMemo, useState } from "react";

interface SortStep {
  array: number[];
  leftArray: number[];
  rightArray: number[];
  mergedArray: number[];
  leftPointer: number;
  rightPointer: number;
  mergedPointer: number;
  activeIndices: number[];
  comparison?: string;
}

export const useMergeSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>("");
  const [leftArray, setLeftArray] = useState<number[]>([]);
  const [rightArray, setRightArray] = useState<number[]>([]);
  const [mergedArray, setMergedArray] = useState<number[]>([]);
  const [leftPointer, setLeftPointer] = useState<number>(-1);
  const [rightPointer, setRightPointer] = useState<number>(-1);
  const [mergedPointer, setMergedPointer] = useState<number>(-1);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
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

  const resetSort = () => {
    setLeftArray([]);
    setRightArray([]);
    setMergedArray([]);
    setLeftPointer(-1);
    setRightPointer(-1);
    setMergedPointer(-1);
    setActiveIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

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

  const calculateSortSteps = (arr: number[]) => {
    const steps: SortStep[] = [];
    let compCount = 0;

    const mergeSort = (input: number[], start: number = 0): number[] => {
      if (input.length <= 1) return input;

      const mid = Math.floor(input.length / 2);
      const left = input.slice(0, mid);
      const right = input.slice(mid);

      steps.push({
        array: [...arr],
        leftArray: left,
        rightArray: right,
        mergedArray: [],
        leftPointer: -1,
        rightPointer: -1,
        mergedPointer: -1,
        activeIndices: Array.from({ length: input.length }, (_, i) => start + i),
        comparison: `Dividing array into left [${left.join(", ")}] and right [${right.join(", ")}]`,
      });

      const sortedLeft = mergeSort(left, start);
      const sortedRight = mergeSort(right, start + mid);

      return merge(sortedLeft, sortedRight, start);
    };

    const merge = (left: number[], right: number[], start: number): number[] => {
      const result: number[] = [];
      let leftIndex = 0;
      let rightIndex = 0;

      steps.push({
        array: [...arr],
        leftArray: left,
        rightArray: right,
        mergedArray: [],
        leftPointer: 0,
        rightPointer: 0,
        mergedPointer: 0,
        activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
        comparison: `Starting to merge [${left.join(", ")}] and [${right.join(", ")}]`,
      });

      while (leftIndex < left.length && rightIndex < right.length) {
        compCount++;

        if (left[leftIndex] <= right[rightIndex]) {
          result.push(left[leftIndex]);
          steps.push({
            array: [...arr],
            leftArray: left,
            rightArray: right,
            mergedArray: [...result],
            leftPointer: leftIndex,
            rightPointer: rightIndex,
            mergedPointer: result.length - 1,
            activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
            comparison: `${left[leftIndex]} ≤ ${right[rightIndex]}, taking ${left[leftIndex]} from left`,
          });
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          steps.push({
            array: [...arr],
            leftArray: left,
            rightArray: right,
            mergedArray: [...result],
            leftPointer: leftIndex,
            rightPointer: rightIndex,
            mergedPointer: result.length - 1,
            activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
            comparison: `${left[leftIndex]} > ${right[rightIndex]}, taking ${right[rightIndex]} from right`,
          });
          rightIndex++;
        }
      }

      while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        steps.push({
          array: [...arr],
          leftArray: left,
          rightArray: right,
          mergedArray: [...result],
          leftPointer: leftIndex,
          rightPointer: -1,
          mergedPointer: result.length - 1,
          activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
          comparison: `Taking remaining element ${left[leftIndex]} from left`,
        });
        leftIndex++;
      }

      while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        steps.push({
          array: [...arr],
          leftArray: left,
          rightArray: right,
          mergedArray: [...result],
          leftPointer: -1,
          rightPointer: rightIndex,
          mergedPointer: result.length - 1,
          activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
          comparison: `Taking remaining element ${right[rightIndex]} from right`,
        });
        rightIndex++;
      }

      steps.push({
        array: [...arr],
        leftArray: [],
        rightArray: [],
        mergedArray: result,
        leftPointer: -1,
        rightPointer: -1,
        mergedPointer: -1,
        activeIndices: Array.from({ length: result.length }, (_, i) => start + i),
        comparison: `Merged result: [${result.join(", ")}]`,
      });

      return result;
    };

    steps.push({
      array: [...arr],
      leftArray: [],
      rightArray: [],
      mergedArray: [],
      leftPointer: -1,
      rightPointer: -1,
      mergedPointer: -1,
      activeIndices: [],
      comparison: "Starting Merge Sort - Divide and Conquer approach",
    });

    const sortedArray = mergeSort([...arr]);

    steps.push({
      array: sortedArray,
      leftArray: [],
      rightArray: [],
      mergedArray: [],
      leftPointer: -1,
      rightPointer: -1,
      mergedPointer: -1,
      activeIndices: [],
      comparison: "Array is completely sorted!",
    });

    return { steps, totalComparisons: compCount };
  };

  const startSort = () => {
    if (array.length === 0 || isRunning) return;
    resetSort();
    const { steps } = calculateSortSteps(array);
    setSortSteps(steps);
    if (steps.length > 0) {
      setCurrentStep(0);
      const step = steps[0];
      setStepState(step, 0);
    }
    setIsRunning(true);
  };

  const setStepState = (step: SortStep, stepIndex: number) => {
    if (stepIndex < 0) return;
    setArray(step.array);
    setLeftArray(step.leftArray);
    setRightArray(step.rightArray);
    setMergedArray(step.mergedArray);
    setLeftPointer(step.leftPointer);
    setRightPointer(step.rightPointer);
    setMergedPointer(step.mergedPointer);
    setActiveIndices(step.activeIndices);
    setComparisons(stepIndex);
  };

  const nextStep = () => {
    if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    const step = sortSteps[nextStepIndex];
    setStepState(step, nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    const step = sortSteps[prevStepIndex];
    setStepState(step, prevStepIndex);
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= sortSteps.length) return;
    setCurrentStep(stepIndex);
    setIsRunning(false);
    const step = sortSteps[stepIndex];
    setStepState(step, stepIndex);
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
    const maxHeight = 150;
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
      leftArray,
      rightArray,
      mergedArray,
      leftPointer,
      rightPointer,
      mergedPointer,
      activeIndices,
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

