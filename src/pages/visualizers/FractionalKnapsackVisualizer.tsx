import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, SortAsc } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface Item {
  id: number;
  weight: number;
  value: number;
  fraction: number;
}

interface Step {
  items: Item[];
  knapsackWeight: number;
  message: string;
}

const FractionalKnapsackVisualizer = () => {
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
    const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    let currentWeight = 0;
    let currentStep = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      items: sortedItems.map(item => ({ ...item })),
      knapsackWeight: currentWeight,
      message: "Starting Fractional Knapsack Algorithm",
    });

    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const availableWeight = knapsackCapacity - currentWeight;

      newSteps.push({
        items: sortedItems.map(it => (it.id === item.id ? { ...it } : { ...it })),
        knapsackWeight: currentWeight,
        message: `Considering item ${item.id} (weight: ${item.weight}, value: ${item.value})`,
      });

      if (item.weight <= availableWeight) {
        currentWeight += item.weight;
        sortedItems[i] = { ...item, fraction: 1 };

        newSteps.push({
          items: sortedItems.map(it => (it.id === item.id ? { ...it, fraction: 1 } : { ...it })),
          knapsackWeight: currentWeight,
          message: `Added item ${item.id} completely. Knapsack weight is now ${currentWeight}`,
        });
      } else {
        const fraction = availableWeight / item.weight;
        currentWeight = knapsackCapacity;
        sortedItems[i] = { ...item, fraction: fraction };

        newSteps.push({
          items: sortedItems.map(it => (it.id === item.id ? { ...it, fraction: fraction } : { ...it })),
          knapsackWeight: currentWeight,
          message: `Added fraction ${fraction.toFixed(2)} of item ${item.id}. Knapsack is now full.`,
        });
        break;
      }

      if (currentWeight === knapsackCapacity) {
        newSteps.push({
          items: sortedItems.map(it => ({ ...it })),
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
    setItems(items.map(item => ({ ...item, fraction: 0 })));
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= steps.length) return;
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />

      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Fractional Knapsack Visualization</h1>
          <p className="text-lg text-drona-gray">
            The fractional knapsack problem involves selecting items with maximum value to fit into a knapsack with a limited capacity, allowing fractions of items to be taken.
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
                      onChange={(e) => setKnapsackCapacity(Number(e.target.value))}
                      className="border-2 focus:border-drona-green"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Add Item</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Weight"
                        value={newItemWeight}
                        onChange={(e) => setNewItemWeight(Number(e.target.value))}
                        className="flex-1 border-2 focus:border-drona-green"
                      />
                      <Input
                        type="number"
                        placeholder="Value"
                        value={newItemValue}
                        onChange={(e) => setNewItemValue(Number(e.target.value))}
                        className="flex-1 border-2 focus:border-drona-green"
                      />
                    </div>
                    <Button onClick={handleAddItem} className="w-full bg-drona-green hover:bg-drona-green/90 font-semibold">Add Item</Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Animation Speed: {speed}x
                    </Label>
                    <Slider
                      value={[speed]}
                      onValueChange={([value]) => setSpeed(value)}
                      max={3}
                      min={0.5}
                      step={0.5}
                      className="w-full"
                    />
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
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep <= 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={handlePlayPause}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(currentStep + 1)}
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
                  onClick={handleReset}
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
                    <p className="text-3xl font-bold text-drona-dark">{currentStep}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Value</p>
                    <p className="text-3xl font-bold text-drona-dark">
                      {steps.length > 0
                        ? steps[currentStep].items.reduce((acc, item) => acc + item.value * item.fraction, 0).toFixed(2)
                        : '0'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Knapsack Weight</p>
                    <p className="text-xl font-bold text-drona-dark">
                      {steps.length > 0 ? steps[currentStep].knapsackWeight : '0'} / {knapsackCapacity}
                    </p>
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
                {steps.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Package className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Play to start the visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {steps[currentStep].items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 border-2 border-drona-green/10">
                          <h3 className="font-bold text-lg text-drona-dark">Item {item.id}</h3>
                          <p className="text-drona-gray font-medium">Weight: {item.weight}</p>
                          <p className="text-drona-gray font-medium">Value: {item.value}</p>
                          <p className="text-drona-green font-semibold">
                            Fraction: {(item.fraction * 100).toFixed(0)}%
                          </p>
                          <p className="text-drona-dark font-bold">
                            Value in Knapsack: {(item.value * item.fraction).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                      <p className="text-lg font-semibold text-drona-dark">
                        {steps[currentStep].message}
                      </p>
                    </div>

                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Fractional Knapsack Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Calculate the value-to-weight ratio for each item.</li>
                          <li>Sort the items in descending order based on this ratio.</li>
                          <li>Starting with the highest ratio, add each item to the knapsack until it is full.</li>
                          <li>If an item cannot fit completely, take a fraction of it to fill the remaining capacity.</li>
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
