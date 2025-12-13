import { useState, useEffect } from "react";

export interface Item {
  id: number;
  weight: number;
  value: number;
  fraction: number;
}

export interface Step {
  items: Item[];
  knapsackWeight: number;
  message: string;
}

export const useFractionalKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 10, value: 60, fraction: 0 },
    { id: 2, weight: 20, value: 100, fraction: 0 },
    { id: 3, weight: 30, value: 120, fraction: 0 },
  ]);
  const [knapsackCapacity, setKnapsackCapacity] = useState<number>(50);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [newItemWeight, setNewItemWeight] = useState<number>(0);
  const [newItemValue, setNewItemValue] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps.length, speed]);

  const calculateFractionalKnapsack = () => {
    const sortedItems = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
    let currentWeight = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      items: sortedItems.map((item) => ({ ...item })),
      knapsackWeight: currentWeight,
      message: "Starting Fractional Knapsack Algorithm",
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const availableWeight = knapsackCapacity - currentWeight;

      newSteps.push({
        items: sortedItems.map((it) => (it.id === item.id ? { ...it } : { ...it })),
        knapsackWeight: currentWeight,
        message: `Considering item ${item.id} (weight: ${item.weight}, value: ${item.value})`,
      });

      if (item.weight <= availableWeight) {
        currentWeight += item.weight;
        sortedItems[i] = { ...item, fraction: 1 };

        newSteps.push({
          items: sortedItems.map((it) => (it.id === item.id ? { ...it, fraction: 1 } : { ...it })),
          knapsackWeight: currentWeight,
          message: `Added item ${item.id} completely. Knapsack weight is now ${currentWeight}`,
        });
      } else {
        const fraction = availableWeight / item.weight;
        currentWeight = knapsackCapacity;
        sortedItems[i] = { ...item, fraction: fraction };

        newSteps.push({
          items: sortedItems.map((it) => (it.id === item.id ? { ...it, fraction: fraction } : { ...it })),
          knapsackWeight: currentWeight,
          message: `Added fraction ${fraction.toFixed(2)} of item ${item.id}. Knapsack is now full.`,
        });
        break;
      }

      if (currentWeight === knapsackCapacity) {
        newSteps.push({
          items: sortedItems.map((it) => ({ ...it })),
          knapsackWeight: currentWeight,
          message: "Knapsack is full.",
        });
        break;
      }
    }

    setSteps(newSteps);
  };

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      weight: newItemWeight,
      value: newItemValue,
      fraction: 0,
    };
    setItems([...items, newItem]);
    setNewItemWeight(0);
    setNewItemValue(0);
  };

  const handlePlayPause = () => {
    if (steps.length === 0) {
      calculateFractionalKnapsack();
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setItems(items.map((item) => ({ ...item, fraction: 0 })));
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= steps.length) return;
    setCurrentStep(step);
  };

  return {
    state: {
      items,
      knapsackCapacity,
      steps,
      currentStep,
      isRunning,
      speed,
      newItemWeight,
      newItemValue,
    },
    actions: {
      setKnapsackCapacity,
      setSpeed,
      setNewItemWeight,
      setNewItemValue,
      handleAddItem,
      handlePlayPause,
      handleReset,
      goToStep,
      setCurrentStep,
    },
  };
};
