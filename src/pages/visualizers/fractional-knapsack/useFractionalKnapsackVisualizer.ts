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
  const [items, setItems] = useState<Item[]>([]);
  const [knapsackCapacity, setKnapsackCapacity] = useState<number>(50);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
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
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentStep, steps.length, speed]);

  const calculateFractionalKnapsack = (): Step[] => {
    const sortedItems = [...items].sort((a, b) => b.value / b.weight - a.value / a.weight);
    let currentWeight = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      items: sortedItems.map((item) => ({ ...item })),
      knapsackWeight: currentWeight,
      message: `Starting Fractional Knapsack Algorithm. Sorting ${items.length} items by value-to-weight ratio (descending).`,
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const availableWeight = knapsackCapacity - currentWeight;

      const ratio = item.value / item.weight;
      newSteps.push({
        items: sortedItems.map((it) => (it.id === item.id ? { ...it } : { ...it })),
        knapsackWeight: currentWeight,
        message: `Considering item ${item.id} (weight: ${item.weight}, value: ${item.value}, ratio: ${ratio.toFixed(2)}). Remaining capacity: ${knapsackCapacity - currentWeight}`,
      });

      if (item.weight <= availableWeight) {
        currentWeight += item.weight;
        sortedItems[i] = { ...item, fraction: 1 };

        const totalValue = sortedItems.filter(it => it.fraction > 0).reduce((acc, it) => acc + it.value * it.fraction, 0);
        newSteps.push({
          items: sortedItems.map((it) => (it.id === item.id ? { ...it, fraction: 1 } : { ...it })),
          knapsackWeight: currentWeight,
          message: `✓ Added item ${item.id} completely (100%). Knapsack weight: ${currentWeight}/${knapsackCapacity}, Total value: ${totalValue.toFixed(2)}`,
        });
      } else {
        const fraction = availableWeight / item.weight;
        currentWeight = knapsackCapacity;
        sortedItems[i] = { ...item, fraction: fraction };

        const totalValue = sortedItems.filter(it => it.fraction > 0).reduce((acc, it) => acc + it.value * it.fraction, 0);
        newSteps.push({
          items: sortedItems.map((it) => (it.id === item.id ? { ...it, fraction: fraction } : { ...it })),
          knapsackWeight: currentWeight,
          message: `✓ Added ${(fraction * 100).toFixed(0)}% of item ${item.id} (partial). Knapsack is now full (${currentWeight}/${knapsackCapacity}). Total value: ${totalValue.toFixed(2)}`,
        });
        break;
      }

      if (currentWeight === knapsackCapacity) {
        const totalValue = sortedItems.filter(it => it.fraction > 0).reduce((acc, it) => acc + it.value * it.fraction, 0);
        newSteps.push({
          items: sortedItems.map((it) => ({ ...it })),
          knapsackWeight: currentWeight,
          message: `Knapsack is full. Final total value: ${totalValue.toFixed(2)}`,
        });
        break;
      }
    }

    return newSteps;
  };

  const generateRandomItems = () => {
    const numItems = Math.floor(Math.random() * 5) + 3; // 3 to 7 items
    const newItems = Array.from({ length: numItems }, (_, i) => ({
      id: i + 1,
      weight: Math.floor(Math.random() * 30) + 5, // 5 to 34
      value: Math.floor(Math.random() * 100) + 10, // 10 to 109
      fraction: 0,
    }));
    // Reset first, then set new items
    setSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setItems(newItems);
  };

  const handleAddItem = () => {
    if (newItemWeight <= 0 || newItemValue <= 0) return;
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
      const newSteps = calculateFractionalKnapsack();
      setSteps(newSteps);
      if (newSteps.length > 0) {
        setCurrentStep(0);
      }
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setItems(items.map((item) => ({ ...item, fraction: 0 })));
  };

  const nextStep = () => {
    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    setCurrentStep(currentStep - 1);
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
      generateRandomItems,
      setIsRunning,
      nextStep,
      prevStep,
    },
  };
};
