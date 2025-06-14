import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface Item {
  id: number;
  weight: number;
  value: number;
}

interface Step {
  knapsackWeight: number;
  takenItems: { id: number; fraction: number }[];
  currentItemIndex: number;
  message: string;
}

const FractionalKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [knapsackCapacity, setKnapsackCapacity] = useState<number>(10);
  const [customItemsInput, setCustomItemsInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);

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
  }, [isRunning, currentStep, steps.length, speed]);

  const generateRandomItems = () => {
    const newItems = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      weight: Math.floor(Math.random() * 8) + 2,
      value: Math.floor(Math.random() * 20) + 5,
    }));
    setItems(newItems);
    resetSimulation();
  };

  const generateCustomItems = () => {
    if (!customItemsInput.trim()) return;

    try {
      const newItems = customItemsInput
        .split(';')
        .filter(Boolean)
        .map((itemStr, index) => {
          const values = itemStr.split(',').map(val => parseInt(val.trim()));
          if (values.length !== 2 || values.some(isNaN)) {
            throw new Error('Invalid item format');
          }
          return { id: index + 1, weight: values[0], value: values[1] };
        });

      if (newItems.length === 0) throw new Error('Empty items');

      setItems(newItems);
      setCustomItemsInput('');
      resetSimulation();
    } catch (error) {
      console.error("Invalid items format");
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSteps([]);
    setCurrentStep(-1);
    setHighlightedItem(null);
  };

  const calculateSteps = (items: Item[], capacity: number) => {
    const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    let currentWeight = 0;
    let takenItems: { id: number; fraction: number }[] = [];
    let stepCounter = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      knapsackWeight: 0,
      takenItems: [],
      currentItemIndex: -1,
      message: 'Starting Fractional Knapsack Simulation',
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      newSteps.push({
        knapsackWeight: currentWeight,
        takenItems: [...takenItems],
        currentItemIndex: i,
        message: `Considering item ${item.id} (Weight: ${item.weight}, Value: ${item.value})`,
      });

      if (currentWeight + item.weight <= capacity) {
        // Take the whole item
        takenItems.push({ id: item.id, fraction: 1 });
        currentWeight += item.weight;
        newSteps.push({
          knapsackWeight: currentWeight,
          takenItems: [...takenItems],
          currentItemIndex: i,
          message: `Took item ${item.id} entirely`,
        });
      } else {
        // Take a fraction of the item
        const remainingCapacity = capacity - currentWeight;
        const fraction = remainingCapacity / item.weight;
        takenItems.push({ id: item.id, fraction: fraction });
        currentWeight = capacity;
        newSteps.push({
          knapsackWeight: currentWeight,
          takenItems: [...takenItems],
          currentItemIndex: i,
          message: `Took ${fraction.toFixed(2)} of item ${item.id}`,
        });
        break; // Knapsack is full
      }

      if (currentWeight === capacity) {
        break; // Knapsack is full
      }
    }

    newSteps.push({
      knapsackWeight: currentWeight,
      takenItems: [...takenItems],
      currentItemIndex: sortedItems.length,
      message: 'Knapsack is full or no more items to consider',
    });

    return newSteps;
  };

  const startSimulation = () => {
    if (items.length === 0 || isRunning) return;

    resetSimulation();
    const calculatedSteps = calculateSteps(items, knapsackCapacity);
    setSteps(calculatedSteps);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    setHighlightedItem(steps[nextStepIndex].currentItemIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;

    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    setHighlightedItem(steps[prevStepIndex].currentItemIndex);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= steps.length) return;

    setCurrentStep(step);
    setIsRunning(false);
    setHighlightedItem(steps[step].currentItemIndex);
  };

  const togglePlayPause = () => {
    if (items.length === 0) return;

    if (isRunning) {
      setIsRunning(false);
    } else {
      if (steps.length === 0) {
        startSimulation();
      } else {
        setIsRunning(true);
      }
    }
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Fractional Knapsack Visualization</h1>
          <p className="text-lg text-drona-gray">
            The fractional knapsack problem involves selecting items with maximum value to fit into a knapsack with a limited capacity, where you can take fractions of items.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n log n)</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Knapsack Capacity</Label>
                    <Input
                      type="number"
                      value={knapsackCapacity}
                      onChange={(e) => setKnapsackCapacity(Math.max(5, Math.min(20, parseInt(e.target.value) || 10)))}
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
                    <Label className="text-sm font-semibold text-drona-dark">Custom Items (weight, value; ...)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 5,60; 3,50; 4,70"
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
                    disabled={steps.length === 0}
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
                    disabled={currentStep >= steps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(steps.length - 1)}
                    disabled={steps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => {
                    resetSimulation();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {steps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {steps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={steps.length}
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
                    <p className="text-sm font-semibold text-drona-gray">Items Count</p>
                    <p className="text-3xl font-bold text-drona-dark">{items.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-xl font-bold text-drona-dark">{steps.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Knapsack Capacity</p>
                    <p className="text-xl font-bold text-drona-dark">{knapsackCapacity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Knapsack Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <SortAsc className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Generate items to start the simulation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Items Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-drona-dark">Available Items</h3>
                      <div className="grid gap-4">
                        {items.map((item, index) => {
                          const taken = currentStep >= 0 && steps[currentStep]?.takenItems.find(t => t.id === item.id);
                          const fractionTaken = taken ? taken.fraction : 0;
                          
                          return (
                            <div
                              key={item.id}
                              className={`
                                p-4 rounded-lg border-2 transition-all
                                ${index === highlightedItem ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg' :
                                  fractionTaken > 0 ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white'}
                              `}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-bold text-lg">Item {item.id}</span>
                                  <div className="text-sm text-gray-600">
                                    Weight: {item.weight} | Value: {item.value} | Ratio: {(item.value / item.weight).toFixed(2)}
                                  </div>
                                </div>
                                {fractionTaken > 0 && (
                                  <div className="text-right">
                                    <div className="text-green-600 font-bold">
                                      {fractionTaken === 1 ? 'Fully Taken' : `${(fractionTaken * 100).toFixed(1)}% Taken`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Weight: {(item.weight * fractionTaken).toFixed(2)} | 
                                      Value: {(item.value * fractionTaken).toFixed(2)}
                                    </div>
                                  </div>
                                )}
                              </div>
                              {fractionTaken > 0 && fractionTaken < 1 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all"
                                      style={{ width: `${fractionTaken * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Knapsack Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-drona-dark">Knapsack</h3>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-lg text-drona-dark font-medium">
                          Capacity: {knapsackCapacity} | Current Weight:{' '}
                          {currentStep >= 0 ? steps[currentStep].knapsackWeight.toFixed(2) : '0'}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                          <div
                            className="bg-drona-green h-4 rounded-full transition-all"
                            style={{
                              width:
                                items.length > 0
                                  ? `${
                                      currentStep >= 0
                                        ? (steps[currentStep].knapsackWeight / knapsackCapacity) * 100
                                        : 0
                                    }%`
                                  : '0%',
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {currentStep >= 0 && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          Step {currentStep + 1}: {steps[currentStep].message}
                        </p>
                      </div>
                    )}

                    {/* Current State */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-drona-dark">Current State</h3>
                      {currentStep >= 0 ? (
                        <ul className="list-disc list-inside text-drona-gray font-medium">
                          {steps[currentStep].takenItems.map((taken, index) => {
                            const item = items.find(i => i.id === taken.id);
                            return (
                              item && (
                                <li key={index}>
                                  Took {taken.fraction === 1 ? 'all' : `${(taken.fraction * 100).toFixed(1)}%`} of item {item.id}{' '}
                                  (Weight: {(item.weight * taken.fraction).toFixed(2)}, Value:{' '}
                                  {(item.value * taken.fraction).toFixed(2)})
                                </li>
                              )
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-drona-gray font-medium">No items taken yet.</p>
                      )}
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Fractional Knapsack Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Calculate the value-to-weight ratio for each item.</li>
                          <li>Sort items in descending order based on this ratio.</li>
                          <li>Iterate through the sorted items, adding them to the knapsack until it's full.</li>
                          <li>If an item can't fit completely, take a fraction of it to fill the remaining capacity.</li>
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

export default FractionalKnapsackVisualizer;
