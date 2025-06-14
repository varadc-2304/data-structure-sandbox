import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SortAsc, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface SortStep {
  array: number[];
  pivotIndex: number;
  low: number;
  high: number;
  i: number;
  j: number;
  partitionedIndices: number[];
  comparison?: string;
}

const QuickSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [pivotIndex, setPivotIndex] = useState<number>(-1);
  const [low, setLow] = useState<number>(-1);
  const [high, setHigh] = useState<number>(-1);
  const [i, setI] = useState<number>(-1);
  const [j, setJ] = useState<number>(-1);
  const [partitionedIndices, setPartitionedIndices] = useState<number[]>([]);
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
  }, [isRunning, currentStep, sortSteps.length, speed]);

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
        .map(val => {
          const num = parseInt(val.trim());
          if (isNaN(num)) throw new Error('Invalid number');
          return num;
        });
      
      if (newArray.length === 0) throw new Error('Empty array');
      
      setArray(newArray);
      setCustomArrayInput('');
      resetSort();
    } catch (error) {
      console.error("Invalid array format");
    }
  };

  const resetSort = () => {
    setPivotIndex(-1);
    setLow(-1);
    setHigh(-1);
    setI(-1);
    setJ(-1);
    setPartitionedIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: SortStep[] = [];
    const arrCopy = [...arr];
    let compCount = 0;
    
    const quickSort = (array: number[], low: number, high: number) => {
      if (low < high) {
        steps.push({
          array: [...array],
          pivotIndex: high,
          low,
          high,
          i: -1,
          j: -1,
          partitionedIndices: [],
          comparison: `Sorting subarray from index ${low} to ${high}, choosing pivot ${array[high]}`
        });
        
        const pivotIndex = partition(array, low, high);
        quickSort(array, low, pivotIndex - 1);
        quickSort(array, pivotIndex + 1, high);
      }
    };
    
    const partition = (array: number[], low: number, high: number): number => {
      const pivot = array[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        compCount++;
        
        steps.push({
          array: [...array],
          pivotIndex: high,
          low,
          high,
          i: i + 1,
          j,
          partitionedIndices: [],
          comparison: `Comparing ${array[j]} with pivot ${pivot}`
        });
        
        if (array[j] <= pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          
          steps.push({
            array: [...array],
            pivotIndex: high,
            low,
            high,
            i,
            j,
            partitionedIndices: [],
            comparison: `${array[j]} ≤ ${pivot}, swapped with element at index ${i}`
          });
        }
      }
      
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      
      steps.push({
        array: [...array],
        pivotIndex: i + 1,
        low,
        high,
        i: -1,
        j: -1,
        partitionedIndices: Array.from({ length: high - low + 1 }, (_, k) => low + k),
        comparison: `Placed pivot ${pivot} at its correct position ${i + 1}`
      });
      
      return i + 1;
    };
    
    steps.push({
      array: [...arrCopy],
      pivotIndex: -1,
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      partitionedIndices: [],
      comparison: 'Starting Quick Sort - Divide and Conquer with partitioning'
    });
    
    quickSort(arrCopy, 0, arrCopy.length - 1);
    
    steps.push({
      array: [...arrCopy],
      pivotIndex: -1,
      low: -1,
      high: -1,
      i: -1,
      j: -1,
      partitionedIndices: Array.from({ length: arrCopy.length }, (_, i) => i),
      comparison: 'Array is completely sorted!'
    });
    
    return { steps, totalComparisons: compCount };
  };

  const startSort = () => {
    if (array.length === 0 || isRunning) return;
    
    resetSort();
    const { steps } = calculateSortSteps(array);
    setSortSteps(steps);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= sortSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    
    const step = sortSteps[nextStepIndex];
    setArray(step.array);
    setPivotIndex(step.pivotIndex);
    setLow(step.low);
    setHigh(step.high);
    setI(step.i);
    setJ(step.j);
    setPartitionedIndices(step.partitionedIndices);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = sortSteps[prevStepIndex];
    setArray(step.array);
    setPivotIndex(step.pivotIndex);
    setLow(step.low);
    setHigh(step.high);
    setI(step.i);
    setJ(step.j);
    setPartitionedIndices(step.partitionedIndices);
    setComparisons(prevStepIndex);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= sortSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    
    const sortStep = sortSteps[step];
    setArray(sortStep.array);
    setPivotIndex(sortStep.pivotIndex);
    setLow(sortStep.low);
    setHigh(sortStep.high);
    setI(sortStep.i);
    setJ(sortStep.j);
    setPartitionedIndices(sortStep.partitionedIndices);
    setComparisons(step);
  };

  const togglePlayPause = () => {
    if (currentStep >= sortSteps.length - 1) {
      startSort();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const getBarHeight = (value: number) => {
    const maxHeight = 200;
    const maxValue = Math.max(...array, 1);
    return (value / maxValue) * maxHeight;
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Quick Sort Visualization</h1>
          <p className="text-lg text-drona-gray">
            Quick sort uses a divide-and-conquer approach by selecting a pivot and partitioning the array around it.
            <span className="font-semibold text-drona-green"> Average Time Complexity: O(n log n)</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Array Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Array Size</Label>
                    <Input
                      type="number"
                      value={arraySize}
                      onChange={(e) => setArraySize(Math.max(5, Math.min(15, parseInt(e.target.value) || 10)))}
                      min={5}
                      max={15}
                      className="border-2 focus:border-drona-green"
                    />
                  </div>
                  
                  <Button 
                    onClick={generateRandomArray} 
                    variant="outline"
                    className="w-full font-semibold border-2 hover:border-drona-green/50"
                  >
                    Generate Random Array
                  </Button>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Custom Array (comma-separated)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., 64, 34, 25, 12"
                        value={customArrayInput}
                        onChange={(e) => setCustomArrayInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateCustomArray()}
                        className="flex-1 border-2 focus:border-drona-green"
                      />
                      <Button 
                        onClick={generateCustomArray}
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
                    disabled={sortSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
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
                    disabled={array.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= sortSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(sortSteps.length - 1)}
                    disabled={sortSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => {
                    resetSort();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {sortSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {sortSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={sortSteps.length}
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
                    <p className="text-sm font-semibold text-drona-gray">Array Size</p>
                    <p className="text-3xl font-bold text-drona-dark">{array.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-xl font-bold text-drona-dark">{sortSteps.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Array Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {array.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <SortAsc className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Generate an array to start visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-end justify-center gap-1 h-60">
                      {array.map((value, index) => (
                        <div
                          key={index}
                          className={`
                            w-10 transition-all flex items-center justify-center font-bold text-white rounded-t-lg
                            ${index === pivotIndex ? 'bg-red-500 scale-110 shadow-lg' : 
                              index === i ? 'bg-orange-500 scale-110 shadow-lg' :
                              index === j ? 'bg-purple-500 scale-110 shadow-lg' :
                              partitionedIndices.includes(index) ? 'bg-green-500' : 'bg-blue-500'}
                          `}
                          style={{ 
                            height: `${getBarHeight(value)}px`,
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>

                    {(low >= 0 && high >= 0) && (
                      <div className="text-center">
                        <p className="text-sm font-semibold text-drona-gray">
                          Current partition: [{low}, {high}]
                          {pivotIndex >= 0 && ` | Pivot: ${array[pivotIndex]} at index ${pivotIndex}`}
                        </p>
                      </div>
                    )}

                    {currentStep >= 0 && currentStep < sortSteps.length && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          {sortSteps[currentStep].comparison}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-center gap-6 flex-wrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
                        <span className="font-medium">Unsorted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                        <span className="font-medium">Pivot</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
                        <span className="font-medium">i (smaller elements)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 mr-2 rounded"></div>
                        <span className="font-medium">j (current element)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                        <span className="font-medium">Partitioned</span>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Quick Sort Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Choose a pivot element (usually the last element).</li>
                          <li>Partition the array so all elements smaller than pivot are on the left.</li>
                          <li>Place the pivot in its correct sorted position.</li>
                          <li>Recursively apply the same process to the left and right subarrays.</li>
                          <li>Continue until all subarrays have been sorted.</li>
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

export default QuickSortVisualizer;
