import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Plus, SkipBack, SkipForward, Trash2 } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
  ratio: number;
  fractionTaken?: number;
  color: string;
}

interface Step {
  message: string;
  items: Item[];
  knapsackItems: Item[];
  totalValue: number;
  totalWeight: number;
  currentItemId?: number;
  action?: 'sort' | 'add_full' | 'add_partial' | 'complete';
}

const FractionalKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(20);
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ];

  // Generate steps when items or capacity change
  useEffect(() => {
    if (items.length > 0) {
      generateSteps();
    } else {
      setSteps([]);
      setCurrentStep(-1);
    }
  }, [items, capacity]);

  const addItem = () => {
    if (name && weight && value) {
      const newItem: Item = {
        id: items.length + 1,
        name: name,
        weight: parseInt(weight),
        value: parseInt(value),
        ratio: parseFloat((parseInt(value) / parseInt(weight)).toFixed(2)),
        color: colors[items.length % colors.length]
      };
      setItems([...items, newItem]);
      setName("");
      setWeight("");
      setValue("");
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const generateRandomItems = () => {
    resetVisualization();
    
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 items
    const newItems: Item[] = [];
    
    for (let i = 0; i < count; i++) {
      const weight = Math.floor(Math.random() * 10) + 5; // 5-14
      const value = Math.floor(Math.random() * 50) + 10; // 10-59
      newItems.push({
        id: i + 1,
        name: `Item ${i + 1}`,
        weight: weight,
        value: value,
        ratio: parseFloat((value / weight).toFixed(2)),
        color: colors[i % colors.length]
      });
    }
    
    setItems(newItems);
  };

  const generateSteps = () => {
    if (items.length === 0) return;

    const steps: Step[] = [];
    
    // Step 1: Initial state
    steps.push({
      message: "Initial items with their weights, values, and value-to-weight ratios.",
      items: [...items],
      knapsackItems: [],
      totalValue: 0,
      totalWeight: 0,
      action: 'sort'
    });

    // Step 2: Sort items by ratio
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    steps.push({
      message: "Items sorted by value-to-weight ratio in descending order. We always take items with the highest ratio first.",
      items: sortedItems,
      knapsackItems: [],
      totalValue: 0,
      totalWeight: 0,
      action: 'sort'
    });

    // Process each item
    let totalWeight = 0;
    let totalValue = 0;
    const knapsackItems: Item[] = [];

    for (const item of sortedItems) {
      if (totalWeight + item.weight <= capacity) {
        // Take the whole item
        const fullItem = { ...item, fractionTaken: 1 };
        knapsackItems.push(fullItem);
        totalWeight += item.weight;
        totalValue += item.value;
        
        steps.push({
          message: `Taking the entire ${item.name} (Weight: ${item.weight}, Value: ${item.value}). Current total: Weight ${totalWeight}/${capacity}, Value ${totalValue.toFixed(2)}`,
          items: sortedItems,
          knapsackItems: [...knapsackItems],
          totalValue: parseFloat(totalValue.toFixed(2)),
          totalWeight: parseFloat(totalWeight.toFixed(2)),
          currentItemId: item.id,
          action: 'add_full'
        });
      } else {
        // Take a fraction of the item
        const remainingCapacity = capacity - totalWeight;
        if (remainingCapacity > 0) {
          const fraction = remainingCapacity / item.weight;
          const fractionalItem = { ...item, fractionTaken: fraction };
          knapsackItems.push(fractionalItem);
          totalWeight += remainingCapacity;
          totalValue += item.value * fraction;
          
          steps.push({
            message: `Taking ${(fraction * 100).toFixed(0)}% of ${item.name} (Weight: ${remainingCapacity.toFixed(2)}, Value: ${(item.value * fraction).toFixed(2)}). Knapsack is now full.`,
            items: sortedItems,
            knapsackItems: [...knapsackItems],
            totalValue: parseFloat(totalValue.toFixed(2)),
            totalWeight: parseFloat(totalWeight.toFixed(2)),
            currentItemId: item.id,
            action: 'add_partial'
          });
        }
        break;
      }
    }

    // Final step
    steps.push({
      message: `Algorithm complete! Maximum value achieved: ${totalValue.toFixed(2)} with total weight: ${totalWeight.toFixed(2)}/${capacity}`,
      items: sortedItems,
      knapsackItems: [...knapsackItems],
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalWeight: parseFloat(totalWeight.toFixed(2)),
      action: 'complete'
    });

    setSteps(steps);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleRunning = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(-1);
    }
    setIsRunning(!isRunning);
  };

  const skipToStart = () => {
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const skipToEnd = () => {
    setIsRunning(false);
    setCurrentStep(steps.length - 1);
  };

  const handleStepChange = (value: number[]) => {
    setIsRunning(false);
    setCurrentStep(value[0]);
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

  const currentStepData = currentStep >= 0 && steps.length > 0 ? steps[currentStep] : null;
  const speedDisplay = (2000 / speed).toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Fractional Knapsack Visualization</h1>
          <p className="text-drona-gray mb-8">
            The Fractional Knapsack Problem involves selecting fractions of items to maximize value while staying within a weight constraint.
            Unlike the 0/1 knapsack, items can be broken into fractions.
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Setup</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">Knapsack Capacity:</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      min="1"
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
                    <Button onClick={addItem} disabled={isRunning || !name || !weight || !value} className="w-full mb-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                    <Button onClick={generateRandomItems} variant="outline" className="w-full">
                      Generate Random Items
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
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ratio</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                              No items added yet. Add items to get started.
                            </td>
                          </tr>
                        ) : (
                          (currentStepData?.items || items).map((item) => {
                            const isCurrentItem = currentStepData?.currentItemId === item.id;
                            return (
                              <tr key={item.id} className={isCurrentItem ? 'bg-yellow-100' : ''}>
                                <td className="px-4 py-2">
                                  <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                                    {item.name}
                                  </div>
                                </td>
                                <td className="px-4 py-2">{item.weight}</td>
                                <td className="px-4 py-2">{item.value}</td>
                                <td className="px-4 py-2">{item.ratio}</td>
                                <td className="px-4 py-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeItem(item.id)}
                                    disabled={isRunning}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <label className="text-sm font-medium whitespace-nowrap">Animation Speed: {speedDisplay}x</label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={667}
                    max={4000}
                    step={333}
                    className="flex-1"
                    disabled={isRunning}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={skipToStart} 
                    disabled={steps.length === 0 || currentStep === -1}
                    size="sm"
                  >
                    <SkipBack className="h-4 w-4 mr-1" /> Start
                  </Button>
                  
                  <Button 
                    onClick={prevStep} 
                    disabled={steps.length === 0 || currentStep <= -1}
                    size="sm"
                  >
                    ← Prev
                  </Button>
                  
                  <Button 
                    onClick={toggleRunning} 
                    disabled={steps.length === 0}
                    size="sm"
                  >
                    {isRunning ? (
                      <><Pause className="h-4 w-4 mr-1" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-1" /> {currentStep === -1 ? 'Start' : 'Continue'}</>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={steps.length === 0 || currentStep >= steps.length - 1}
                    size="sm"
                  >
                    Next →
                  </Button>
                  
                  <Button 
                    onClick={skipToEnd} 
                    disabled={steps.length === 0 || currentStep === steps.length - 1}
                    size="sm"
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> End
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline" 
                    disabled={currentStep === -1}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>
              </div>
              
              {steps.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Step:</span>
                    <Slider
                      value={[currentStep]}
                      onValueChange={handleStepChange}
                      min={-1}
                      max={steps.length - 1}
                      step={1}
                      className="flex-1"
                      disabled={isRunning}
                    />
                    <span className="text-sm text-gray-500 w-16">
                      {currentStep + 1}/{steps.length}
                    </span>
                  </div>
                </div>
              )}
              
              {currentStepData && (
                <div className="mt-4 bg-gray-100 p-3 rounded-md">
                  <p className="font-medium">Current step: {currentStepData.message}</p>
                </div>
              )}
            </Card>
            
            {items.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Knapsack Visualization</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <div>Capacity: {capacity}</div>
                    <div>Used: {currentStepData?.totalWeight || 0}/{capacity}</div>
                  </div>
                  
                  <div className="relative w-full h-6 bg-gray-200 rounded-full mb-4">
                    <div 
                      className="absolute top-0 left-0 h-6 bg-drona-green rounded-full transition-all duration-500"
                      style={{ width: `${((currentStepData?.totalWeight || 0) / capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {currentStepData?.knapsackItems && currentStepData.knapsackItems.length > 0 ? (
                  <div>
                    <div className="mb-2 font-medium">Selected Items:</div>
                    <div className="space-y-2">
                      {currentStepData.knapsackItems.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                          <span>{item.name}: </span>
                          {item.fractionTaken === 1 ? (
                            <span className="ml-1">Whole item (W: {item.weight}, V: {item.value})</span>
                          ) : (
                            <span className="ml-1">
                              {(item.fractionTaken! * 100).toFixed(0)}% of item 
                              (W: {(item.weight * item.fractionTaken!).toFixed(2)}, 
                              V: {(item.value * item.fractionTaken!).toFixed(2)})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 font-medium">
                      Total Value: {currentStepData.totalValue}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    {items.length === 0 ? "Add items to get started" : "Empty knapsack"}
                  </div>
                )}
              </Card>
            )}
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Fractional Knapsack Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Calculate the value-to-weight ratio for each item.</li>
                <li>Sort items by value-to-weight ratio in descending order.</li>
                <li>Take items with the highest ratio first, until the knapsack is full.</li>
                <li>If an item can't fit completely, take the fraction that fits.</li>
              </ol>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Greedy Approach</h3>
                <p className="text-drona-gray">
                  Fractional Knapsack uses a greedy approach, always taking the item with the highest value-to-weight ratio first.
                  This approach guarantees an optimal solution for the fractional knapsack problem, unlike the 0/1 knapsack problem where items cannot be divided.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualizer;
