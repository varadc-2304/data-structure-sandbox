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
  valuePerWeight: number;
}

interface KnapsackStep {
  items: Item[];
  currentItemIndex: number;
  selectedItems: Item[];
  remainingCapacity: number;
  totalValue: number;
}

const FractionalKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(20);
  const [customItemsInput, setCustomItemsInput] = useState<string>('');
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [remainingCapacity, setRemainingCapacity] = useState<number>(capacity);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [knapsackSteps, setKnapsackSteps] = useState<KnapsackStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

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
      weight: Math.floor(Math.random() * 10) + 1,
      value: Math.floor(Math.random() * 50) + 1,
      valuePerWeight: 0,
    }));
    
    const itemsWithValuePerWeight = newItems.map(item => ({
      ...item,
      valuePerWeight: item.value / item.weight,
    }));
    
    setItems(itemsWithValuePerWeight);
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
            valuePerWeight: 0,
          };
        });
        
      const itemsWithValuePerWeight = newItems.map(item => ({
        ...item,
        valuePerWeight: item.value / item.weight,
      }));
      
      setItems(itemsWithValuePerWeight);
      setCustomItemsInput('');
      resetKnapsack();
    } catch (error) {
      console.error("Invalid items format");
    }
  };

  const resetKnapsack = () => {
    setCurrentItemIndex(-1);
    setSelectedItems([]);
    setRemainingCapacity(capacity);
    setTotalValue(0);
    setIsRunning(false);
    setKnapsackSteps([]);
    setCurrentStep(-1);
  };

  const calculateKnapsackSteps = (initialItems: Item[], initialCapacity: number) => {
    const steps: KnapsackStep[] = [];
    let currentCapacity = initialCapacity;
    let currentValue = 0;
    const sortedItems = [...initialItems].sort((a, b) => b.valuePerWeight - a.valuePerWeight);
    const selected: Item[] = [];
    
    steps.push({
      items: [...sortedItems],
      currentItemIndex: -1,
      selectedItems: [...selected],
      remainingCapacity: currentCapacity,
      totalValue: currentValue,
    });
    
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      
      steps.push({
        items: [...sortedItems],
        currentItemIndex: i,
        selectedItems: [...selected],
        remainingCapacity: currentCapacity,
        totalValue: currentValue,
      });
      
      if (currentCapacity >= item.weight) {
        selected.push(item);
        currentValue += item.value;
        currentCapacity -= item.weight;
      } else {
        const fraction = currentCapacity / item.weight;
        const fractionalItem = { ...item, fraction: fraction };
        selected.push(fractionalItem);
        currentValue += item.value * fraction;
        currentCapacity = 0;
      }
      
      steps.push({
        items: [...sortedItems],
        currentItemIndex: i,
        selectedItems: [...selected],
        remainingCapacity: currentCapacity,
        totalValue: currentValue,
      });
      
      if (currentCapacity === 0) {
        break;
      }
    }
    
    steps.push({
      items: [...sortedItems],
      currentItemIndex: sortedItems.length,
      selectedItems: [...selected],
      remainingCapacity: currentCapacity,
      totalValue: currentValue,
    });
    
    return steps;
  };

  const startKnapsack = () => {
    if (items.length === 0 || isRunning) return;
    
    resetKnapsack();
    const steps = calculateKnapsackSteps(items, capacity);
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
    setItems(step.items);
    setCurrentItemIndex(step.currentItemIndex);
    setSelectedItems(step.selectedItems);
    setRemainingCapacity(step.remainingCapacity);
    setTotalValue(step.totalValue);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = knapsackSteps[prevStepIndex];
    setItems(step.items);
    setCurrentItemIndex(step.currentItemIndex);
    setSelectedItems(step.selectedItems);
    setRemainingCapacity(step.remainingCapacity);
    setTotalValue(step.totalValue);
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
    setItems(knapsackStep.items);
    setCurrentItemIndex(knapsackStep.currentItemIndex);
    setSelectedItems(knapsackStep.selectedItems);
    setRemainingCapacity(knapsackStep.remainingCapacity);
    setTotalValue(knapsackStep.totalValue);
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
            The Fractional Knapsack problem uses a greedy approach by selecting items with the highest value-to-weight ratio.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n log n)</span>
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
                      onChange={(e) => setCapacity(Math.max(10, Math.min(30, parseInt(e.target.value) || 20)))}
                      min={10}
                      max={30}
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
                      Custom Items (name, weight, value; ...)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Item1, 5, 60; Item2, 10, 100"
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
                    <p className="text-sm font-semibold text-drona-gray">Total Value</p>
                    <p className="text-3xl font-bold text-drona-dark">{totalValue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Remaining Capacity</p>
                    <p className="text-xl font-bold text-drona-dark">{remainingCapacity.toFixed(2)}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`
                            p-4 rounded-lg border-2 shadow-md
                            ${index === currentItemIndex ? 'border-drona-green/70 bg-drona-light' : 'border-drona-green/20'}
                          `}
                        >
                          <h3 className="text-lg font-semibold text-drona-dark">{item.name}</h3>
                          <p className="text-drona-gray">Weight: {item.weight}</p>
                          <p className="text-drona-gray">Value: {item.value}</p>
                          <p className="text-drona-gray">Value/Weight: {item.valuePerWeight.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-drona-dark mb-2">Selected Items</h2>
                      {selectedItems.length === 0 ? (
                        <p className="text-drona-gray">No items selected yet.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-2">
                          {selectedItems.map((item, index) => (
                            <li key={index} className="text-drona-gray">
                              {item.name} - Weight: {item.weight}, Value: {item.value}
                              {item.fraction && `, Fraction: ${item.fraction.toFixed(2)}`}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                      <div>
                        <p className="text-lg font-semibold text-drona-dark">Total Value:</p>
                        <p className="text-2xl font-bold text-drona-green">{totalValue.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-drona-dark">Remaining Capacity:</p>
                        <p className="text-2xl font-bold text-drona-green">{remainingCapacity.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Fractional Knapsack Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Calculate the value-to-weight ratio for each item.</li>
                          <li>Sort items in descending order based on this ratio.</li>
                          <li>Select items with the highest ratio until the knapsack is full.</li>
                          <li>If an item cannot fit entirely, take a fraction of it to fill the remaining capacity.</li>
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
