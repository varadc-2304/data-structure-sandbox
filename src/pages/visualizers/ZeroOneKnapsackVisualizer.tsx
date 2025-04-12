
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
}

interface Step {
  table: number[][];
  currentItem?: Item;
  currentWeight?: number;
  selected?: boolean;
  message: string;
}

const ZeroOneKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Item 1", weight: 2, value: 10 },
    { id: 2, name: "Item 2", weight: 3, value: 20 },
    { id: 3, name: "Item 3", weight: 5, value: 30 },
    { id: 4, name: "Item 4", weight: 7, value: 40 },
  ]);
  const [capacity, setCapacity] = useState<number>(10);
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(800);
  const [optimalValue, setOptimalValue] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  // Initialize solution
  useEffect(() => {
    solveKnapsack();
  }, [items, capacity]);

  const addItem = () => {
    if (name && weight && value) {
      const newItem: Item = {
        id: items.length + 1,
        name: name,
        weight: parseInt(weight),
        value: parseInt(value),
      };
      setItems([...items, newItem]);
      setName("");
      setWeight("");
      setValue("");
    }
  };

  const solveKnapsack = () => {
    if (items.length === 0) return;

    setIsRunning(false);
    setCurrentStep(-1);

    const n = items.length;
    const w = capacity;
    
    // Create a table for DP
    const dp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(w + 1).fill(0));

    const steps: Step[] = [
      {
        table: JSON.parse(JSON.stringify(dp)),
        message: "Initializing the DP table with zeros. Each cell dp[i][j] will represent the maximum value that can be obtained with first i items and a capacity of j."
      }
    ];

    // Fill the dp table
    for (let i = 1; i <= n; i++) {
      const currentItem = items[i - 1];
      
      for (let j = 0; j <= w; j++) {
        // If the weight of the current item is more than the current capacity, we can't include it
        if (currentItem.weight > j) {
          dp[i][j] = dp[i - 1][j];
          steps.push({
            table: JSON.parse(JSON.stringify(dp)),
            currentItem: currentItem,
            currentWeight: j,
            selected: false,
            message: `Item ${currentItem.name} weighs ${currentItem.weight}, which is more than the current capacity ${j}. We can't include it, so we take the value from the previous row: dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i][j]}`
          });
        } else {
          // If we include the current item, we add its value to the optimal value from the remaining capacity
          const includeItem = currentItem.value + dp[i - 1][j - currentItem.weight];
          
          // If we don't include the current item, we take the value from the previous calculation
          const excludeItem = dp[i - 1][j];
          
          // Take the maximum of both choices
          dp[i][j] = Math.max(includeItem, excludeItem);
          
          const selected = includeItem > excludeItem;
          steps.push({
            table: JSON.parse(JSON.stringify(dp)),
            currentItem: currentItem,
            currentWeight: j,
            selected: selected,
            message: selected 
              ? `Include ${currentItem.name}: ${currentItem.value} + dp[${i - 1}][${j - currentItem.weight}] = ${currentItem.value} + ${dp[i - 1][j - currentItem.weight]} = ${includeItem} > Exclude: ${excludeItem}. So dp[${i}][${j}] = ${dp[i][j]}`
              : `Exclude ${currentItem.name}: dp[${i - 1}][${j}] = ${excludeItem} >= Include: ${includeItem}. So dp[${i}][${j}] = ${dp[i][j]}`
          });
        }
      }
    }

    // Determine which items were selected
    const selected: Item[] = [];
    let remainingCapacity = w;
    for (let i = n; i > 0; i--) {
      if (dp[i][remainingCapacity] !== dp[i - 1][remainingCapacity]) {
        selected.push(items[i - 1]);
        remainingCapacity -= items[i - 1].weight;
      }
    }

    steps.push({
      table: JSON.parse(JSON.stringify(dp)),
      message: `Final solution: Maximum value = ${dp[n][w]}. Selected items: ${selected.map(item => item.name).join(", ")}.`
    });

    setSteps(steps);
    setOptimalValue(dp[n][w]);
    setSelectedItems(selected);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const toggleRunning = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(-1);
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(current => current + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStep, steps.length, speed]);

  // Get the current step to display
  const currentTable = currentStep >= 0 && steps.length > 0
    ? steps[currentStep].table
    : Array(items.length + 1).fill(0).map(() => Array(capacity + 1).fill(0));
    
  const currentMessage = currentStep >= 0 && steps.length > 0
    ? steps[currentStep].message
    : "Click 'Start Visualization' to see the 0/1 Knapsack algorithm in action.";

  const currentHighlight = currentStep >= 0 && steps.length > 0 && steps[currentStep].currentItem
    ? { item: steps[currentStep].currentItem, weight: steps[currentStep].currentWeight, selected: steps[currentStep].selected }
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">0-1 Knapsack Problem Visualization</h1>
          <p className="text-drona-gray mb-8">
            The 0-1 Knapsack problem is a classic optimization problem where we need to maximize the value 
            of items placed in a knapsack without exceeding its weight capacity.
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Setup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Knapsack Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      disabled={isRunning}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Add New Item</label>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                        disabled={isRunning}
                      />
                      <input
                        type="number"
                        placeholder="Weight"
                        min="1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                        disabled={isRunning}
                      />
                      <input
                        type="number"
                        placeholder="Value"
                        min="1"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2"
                        disabled={isRunning}
                      />
                    </div>
                    <Button onClick={addItem} disabled={isRunning || !name || !weight || !value} className="w-full">
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Available Items</h3>
                  <div className="overflow-auto max-h-60 border border-gray-300 rounded">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr key={item.id} className={
                            currentHighlight && currentHighlight.item.id === item.id
                              ? currentHighlight.selected
                                ? 'bg-green-100'
                                : 'bg-red-100'
                              : ''
                          }>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.weight}</td>
                            <td className="px-4 py-2">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Speed:</label>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="200"
                    value={speed}
                    onChange={(e) => setSpeed(parseInt(e.target.value))}
                    className="w-32"
                    disabled={isRunning}
                  />
                </div>
                
                <Button onClick={toggleRunning} disabled={steps.length === 0}>
                  {isRunning ? (
                    <><Pause className="mr-2 h-4 w-4" /> Pause</>
                  ) : (
                    <><Play className="mr-2 h-4 w-4" /> {currentStep === -1 ? 'Start Visualization' : 'Continue'}</>
                  )}
                </Button>
                
                <Button onClick={resetVisualization} variant="outline" disabled={isRunning || currentStep === -1}>
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dynamic Programming Table</h2>
              
              <div className="overflow-auto">
                <table className="border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 bg-gray-50">Item \ Weight</th>
                      {Array.from({ length: capacity + 1 }, (_, i) => (
                        <th 
                          key={i} 
                          className={`
                            border border-gray-300 px-4 py-2 bg-gray-50
                            ${currentHighlight && currentHighlight.weight === i ? 'bg-yellow-100' : ''}
                          `}>
                          {i}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTable.map((row, i) => (
                      <tr key={i}>
                        <td className={`
                          border border-gray-300 px-4 py-2 font-medium
                          ${currentHighlight && i === items.indexOf(currentHighlight.item) + 1 ? 'bg-yellow-100' : ''}
                        `}>
                          {i === 0 ? '0' : items[i-1].name}
                        </td>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className={`
                              border border-gray-300 px-4 py-2 text-center
                              ${currentHighlight && i === items.indexOf(currentHighlight.item) + 1 && j === currentHighlight.weight ? 'bg-yellow-200 font-bold' : ''}
                            `}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-700">{currentMessage}</p>
              </div>
              
              {currentStep === steps.length - 1 && (
                <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
                  <h3 className="font-semibold text-green-800">Final Solution</h3>
                  <p className="text-green-700">Maximum value: {optimalValue}</p>
                  <p className="text-green-700">
                    Selected items: {selectedItems.map(item => item.name).join(", ")}
                  </p>
                </div>
              )}
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">0-1 Knapsack Problem Explanation</h2>
              <p className="text-drona-gray mb-4">
                In the 0-1 Knapsack problem, we have a set of items, each with a weight and a value.
                We need to determine which items to include in the knapsack such that the total weight is less than or equal to the given capacity,
                and the total value is as large as possible.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Dynamic Programming Solution</h3>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Create a table dp[n+1][capacity+1] where dp[i][j] represents the maximum value that can be obtained using the first i items with a capacity of j.</li>
                <li>Initialize the first row and column with 0 (no items or no capacity means 0 value).</li>
                <li>For each item i and each capacity j, decide whether to include the item or not:
                  <ul className="list-disc list-inside pl-6 mt-1">
                    <li>If the item's weight {'>'} j, we cannot include it: dp[i][j] = dp[i-1][j]</li>
                    <li>Otherwise, we take the maximum of including or excluding the item:
                      dp[i][j] = max(dp[i-1][j], value[i-1] + dp[i-1][j-weight[i-1]])</li>
                  </ul>
                </li>
                <li>The final answer is in dp[n][capacity], which gives the maximum value possible.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroOneKnapsackVisualizer;
