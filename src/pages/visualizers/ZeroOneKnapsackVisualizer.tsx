import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface Item {
  id: number;
  name: string;
  weight: number;
  value: number;
}

interface KnapsackStep {
  dpTable: number[][];
  currentItem: number;
  currentWeight: number;
  selectedItems: number[];
}

const ZeroOneKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(10);
  const [customItemsInput, setCustomItemsInput] = useState<string>('');
  const [dpTable, setDpTable] = useState<number[][]>([[]]);
  const [currentItem, setCurrentItem] = useState<number>(-1);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [knapsackSteps, setKnapsackSteps] = useState<KnapsackStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

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
        .split(';')
        .filter(Boolean)
        .map((itemStr, i) => {
          const [name, weightStr, valueStr] = itemStr.split(',').map(s => s.trim());
          const weight = parseInt(weightStr || '');
          const value = parseInt(valueStr || '');
          
          if (!name || isNaN(weight) || isNaN(value)) {
            throw new Error('Invalid item format');
          }
          
          return {
            id: i + 1,
            name,
            weight,
            value,
          };
        });
      
      setItems(newItems);
      setCustomItemsInput('');
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
    
    const initialDpTable = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    steps.push({
      dpTable: initialDpTable.map(row => [...row]),
      currentItem: -1,
      currentWeight: 0,
      selectedItems: [],
    });
    
    const dpTable = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        compCount++;
        
        const item = items[i - 1];
        
        if (item.weight <= w) {
          dpTable[i][w] = Math.max(
            item.value + dpTable[i - 1][w - item.weight],
            dpTable[i - 1][w]
          );
        } else {
          dpTable[i][w] = dpTable[i - 1][w];
        }
        
        steps.push({
          dpTable: dpTable.map(row => [...row]),
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
    
    steps.forEach(step => step.selectedItems = [...selected]);
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">0/1 Knapsack Visualization</h1>
          <p className="text-lg text-drona-gray">
            The 0/1 Knapsack problem uses dynamic programming to find the optimal selection of items.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n×W)</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Items Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Capacity</Label>
                    <Input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(Math.max(5, Math.min(20, parseInt(e.target.value) || 10)))}
                      min={5}
                      max={20}
                      className="border-2 focus:border-drona-green"
                    />
                  </div>
                  
                  <Button 
                    onClick={generateRandomItems} 
                    variant="outline"
                    className="w-full font-semibold border-2 hover:border-drona-green/50"
                  >
                    Generate Random Items
                  </Button>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Custom Items (name, weight, value; separated by semicolons)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Item1,5,6; Item2,3,4"
                        value={customItemsInput}
                        onChange={(e) => setCustomItemsInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateCustomItems()}
                        className="flex-1 border-2 focus:border-drona-green"
                      />
                      <Button 
                        onClick={generateCustomItems}
                        className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                      >
                        Set
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {speed}x
                  </Label>
                  <div className="flex items-center mt-1">
                    <input 
                      type="range" 
                      min={0.5} 
                      max={3} 
                      step={0.5} 
                      value={speed} 
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(0)}
                    disabled={knapsackSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    disabled={items.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= knapsackSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(knapsackSteps.length - 1)}
                    disabled={knapsackSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => {
                    resetKnapsack();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {knapsackSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {knapsackSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={knapsackSteps.length}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Step</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Number of Items</p>
                    <p className="text-3xl font-bold text-drona-dark">{items.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-xl font-bold text-drona-dark">{knapsackSteps.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Knapsack Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Package className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Generate items to start visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Items List */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-drona-dark">Items:</h3>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <li
                              key={item.id}
                              className={`p-3 rounded-lg border-2 ${
                                index === currentItem ? 'border-drona-green shadow-md' : 'border-drona-green/20'
                              }`}
                            >
                              <span className="font-semibold">{item.name}</span> - Weight: {item.weight}, Value: {item.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* DP Table */}
                      <div>
                        <h3 className="text-xl font-bold text-drona-dark">DP Table:</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-drona-green/20">
                            <thead>
                              <tr>
                                <th className="border border-drona-green/20 p-2">Item</th>
                                {[...Array(capacity + 1)].map((_, i) => (
                                  <th key={i} className="border border-drona-green/20 p-2">Weight: {i}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dpTable.map((row, i) => (
                                <tr key={i}>
                                  <td className="border border-drona-green/20 p-2">{i === 0 ? 'Empty' : items[i - 1]?.name}</td>
                                  {row.map((value, j) => (
                                    <td
                                      key={j}
                                      className={`border border-drona-green/20 p-2 text-center ${
                                        currentItem === i - 1 && currentWeight === j ? 'bg-drona-green/10 font-semibold' : ''
                                      }`}
                                    >
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Selected Items */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-drona-dark">Selected Items:</h3>
                      {selectedItems.length === 0 ? (
                        <p className="text-drona-gray">No items selected.</p>
                      ) : (
                        <ul className="space-y-2">
                          {selectedItems.map(index => (
                            <li key={items[index].id} className="p-3 rounded-lg border-2 border-drona-green/20">
                              <span className="font-semibold">{items[index].name}</span> - Weight: {items[index].weight}, Value: {items[index].value}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How 0/1 Knapsack Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Create a DP table to store maximum values for different weights.</li>
                          <li>Iterate through each item and weight to fill the DP table.</li>
                          <li>If the item's weight is less than or equal to the current weight, choose the maximum value between including and excluding the item.</li>
                          <li>Backtrack from the last cell to find the selected items.</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroOneKnapsackVisualizer;
