import { useState, useEffect } from "react";

export interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface KnapsackStep {
  dpTable: number[][];
  currentItem: number;
  currentWeight: number;
  selectedItems: number[];
}

export const useKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(10);
  const [customItemsInput, setCustomItemsInput] = useState<string>("");
  const [dpTable, setDpTable] = useState<number[][]>([[]]);
  const [currentItem, setCurrentItem] = useState<number>(-1);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [knapsackSteps, setKnapsackSteps] = useState<KnapsackStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  const generateRandomItems = () => {
    const newItems = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      weight: Math.floor(Math.random() * 8) + 1,
      value: Math.floor(Math.random() * 20) + 1,
    }));
    setItems(newItems);
    resetKnapsack();
  };

  const generateCustomItems = () => {
    if (!customItemsInput.trim()) return;

    try {
      const newItems = customItemsInput
        .split(";")
        .filter(Boolean)
        .map((itemStr, i) => {
          const [name, weightStr, valueStr] = itemStr.split(",").map((s) => s.trim());
          const weight = parseInt(weightStr || "");
          const value = parseInt(valueStr || "");

          if (!name || isNaN(weight) || isNaN(value)) {
            throw new Error("Invalid item format");
          }

          return {
            id: i + 1,
            name,
            weight,
            value,
          };
        });

      setItems(newItems);
      setCustomItemsInput("");
      resetKnapsack();
    } catch (error) {
      console.error("Invalid items format");
    }
  };

  const resetKnapsack = () => {
    setDpTable([[]]);
    setCurrentItem(-1);
    setCurrentWeight(0);
    setSelectedItems([]);
    setIsRunning(false);
    setKnapsackSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateKnapsackSteps = (items: Item[], capacity: number) => {
    const steps: KnapsackStep[] = [];
    const n = items.length;
    let compCount = 0;

    const initialDpTable = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));
    steps.push({
      dpTable: initialDpTable.map((row) => [...row]),
      currentItem: -1,
      currentWeight: 0,
      selectedItems: [],
    });

    const dpTable = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        compCount++;

        const item = items[i - 1];

        if (item.weight <= w) {
          dpTable[i][w] = Math.max(item.value + dpTable[i - 1][w - item.weight], dpTable[i - 1][w]);
        } else {
          dpTable[i][w] = dpTable[i - 1][w];
        }

        steps.push({
          dpTable: dpTable.map((row) => [...row]),
          currentItem: i - 1,
          currentWeight: w,
          selectedItems: [],
        });
      }
    }

    const selected: number[] = [];
    let w = capacity;
    for (let i = n; i > 0 && w > 0; i--) {
      if (dpTable[i][w] !== dpTable[i - 1][w]) {
        selected.push(i - 1);
        w -= items[i - 1].weight;
      }
    }

    steps.forEach((step) => (step.selectedItems = [...selected]));

    return { steps, totalComparisons: compCount };
  };

  const startKnapsack = () => {
    if (items.length === 0 || isRunning) return;

    resetKnapsack();
    const { steps } = calculateKnapsackSteps(items, capacity);
    setKnapsackSteps(steps);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= knapsackSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);

    const step = knapsackSteps[nextStepIndex];
    setDpTable(step.dpTable);
    setCurrentItem(step.currentItem);
    setCurrentWeight(step.currentWeight);
    setSelectedItems(step.selectedItems);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;

    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);

    const step = knapsackSteps[prevStepIndex];
    setDpTable(step.dpTable);
    setCurrentItem(step.currentItem);
    setCurrentWeight(step.currentWeight);
    setSelectedItems(step.selectedItems);
    setComparisons(prevStepIndex);
  };

  const togglePlayPause = () => {
    if (currentStep >= knapsackSteps.length - 1) {
      startKnapsack();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= knapsackSteps.length) return;

    setCurrentStep(step);
    setIsRunning(false);

    const knapsackStep = knapsackSteps[step];
    setDpTable(knapsackStep.dpTable);
    setCurrentItem(knapsackStep.currentItem);
    setCurrentWeight(knapsackStep.currentWeight);
    setSelectedItems(knapsackStep.selectedItems);
    setComparisons(step);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= knapsackSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, knapsackSteps.length, speed]);

  return {
    state: {
      items,
      capacity,
      customItemsInput,
      dpTable,
      currentItem,
      currentWeight,
      selectedItems,
      isRunning,
      speed,
      knapsackSteps,
      currentStep,
      comparisons,
    },
    actions: {
      setCapacity,
      setCustomItemsInput,
      setSpeed,
      generateRandomItems,
      generateCustomItems,
      resetKnapsack,
      startKnapsack,
      nextStep,
      prevStep,
      togglePlayPause,
      goToStep,
    },
  };
};
