import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SortAsc, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface SortStep {
  array: number[];
  currentIndex: number;
  comparing: number;
  sortedIndices: number[];
  comparison?: string;
}

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [comparing, setComparing] = useState<number>(-1);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
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
    setCurrentIndex(-1);
    setComparing(-1);
    setSortedIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const togglePlayPause = () => {
    if (array.length === 0) return;
    
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (sortSteps.length === 0) {
        startSort();
      } else {
        setIsRunning(true);
      }
    }
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: SortStep[] = [];
    const arrCopy = [...arr];
    const n = arrCopy.length;
    let compCount = 0;
    
    steps.push({
      array: [...arrCopy],
      currentIndex: -1,
      comparing: -1,
      sortedIndices: [],
      comparison: 'Starting Insertion Sort'
    });
    
    for (let i = 1; i < n; i++) {
      let key = arrCopy[i];
      let j = i - 1;
      
      steps.push({
        array: [...arrCopy],
        currentIndex: i,
        comparing: -1,
        sortedIndices: Array.from({ length: i }, (_, k) => k),
        comparison: `Inserting element ${key} at index ${i} into the sorted sequence`
      });
      
      while (j >= 0 && arrCopy[j] > key) {
        compCount++;
        
        steps.push({
          array: [...arrCopy],
          currentIndex: i,
          comparing: j,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          comparison: `Comparing ${arrCopy[j]} with ${key}`
        });
        
        arrCopy[j + 1] = arrCopy[j];
        
        steps.push({
          array: [...arrCopy],
          currentIndex: i,
          comparing: j,
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          comparison: `${arrCopy[j]} is greater than ${key}, moving ${arrCopy[j]} to the right`
        });
        
        j = j - 1;
      }
      
      arrCopy[j + 1] = key;
      
      steps.push({
        array: [...arrCopy],
        currentIndex: j + 1,
        comparing: -1,
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        comparison: `Inserted ${key} at index ${j + 1}`
      });
    }
    
    steps.push({
      array: [...arrCopy],
      currentIndex: -1,
      comparing: -1,
      sortedIndices: Array.from({ length: n }, (_, i) => i),
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
    setCurrentIndex(step.currentIndex);
    setComparing(step.comparing);
    setSortedIndices(step.sortedIndices);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = sortSteps[prevStepIndex];
    setArray(step.array);
    setCurrentIndex(step.currentIndex);
    setComparing(step.comparing);
    setSortedIndices(step.sortedIndices);
    setComparisons(prevStepIndex);
  };

  const getBarHeight = (value: number) => {
    const maxHeight = 200;
    const maxValue = Math.max(...array, 1);
    return (value / maxValue) * maxHeight;
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= sortSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    
    const sortStep = sortSteps[step];
    setArray(sortStep.array);
    setCurrentIndex(sortStep.currentIndex);
    setComparing(sortStep.comparing);
    setSortedIndices(sortStep.sortedIndices);
    setComparisons(step);
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Insertion Sort Visualization</h1>
          <p className="text-lg text-drona-gray">
            Insertion sort builds the sorted array one element at a time by inserting each element into its correct position.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n²)</span>
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
                      onChange={(e) => setArraySize(Math.max(5, Math.min(20, parseInt(e.target.value) || 10)))}
                      min={5}
                      max={20}
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
                    <ChevronsRight className="h-4 w-4" />
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
                            w-12 transition-all flex items-center justify-center font-bold text-white rounded-t-lg
                            ${index === comparing ? 'bg-orange-500 scale-110 shadow-lg' : 
                              index === currentIndex ? 'bg-red-500 scale-110 shadow-lg' :
                              sortedIndices.includes(index) ? 'bg-green-500' : 'bg-blue-500'}
                          `}
                          style={{ 
                            height: `${getBarHeight(value)}px`,
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>

                    {currentStep >= 0 && currentStep < sortSteps.length && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          {sortSteps[currentStep].comparison}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
                        <span className="font-medium">Unsorted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                        <span className="font-medium">Current Index</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-500 mr-2 rounded"></div>
                        <span className="font-medium">Comparing</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                        <span className="font-medium">Sorted</span>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Insertion Sort Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Start with the second element of the array.</li>
                          <li>Compare the current element to the elements in the sorted portion.</li>
                          <li>Shift elements greater than the current element to the right.</li>
                          <li>Insert the current element into its correct position.</li>
                          <li>Repeat until the entire array is sorted.</li>
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

export default InsertionSortVisualizer;
