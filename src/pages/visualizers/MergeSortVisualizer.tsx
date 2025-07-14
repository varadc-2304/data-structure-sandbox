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
  leftArray: number[];
  rightArray: number[];
  mergedArray: number[];
  leftPointer: number;
  rightPointer: number;
  mergedPointer: number;
  activeIndices: number[];
  comparison?: string;
}

const MergeSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(8);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [leftArray, setLeftArray] = useState<number[]>([]);
  const [rightArray, setRightArray] = useState<number[]>([]);
  const [mergedArray, setMergedArray] = useState<number[]>([]);
  const [leftPointer, setLeftPointer] = useState<number>(-1);
  const [rightPointer, setRightPointer] = useState<number>(-1);
  const [mergedPointer, setMergedPointer] = useState<number>(-1);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
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
    setLeftArray([]);
    setRightArray([]);
    setMergedArray([]);
    setLeftPointer(-1);
    setRightPointer(-1);
    setMergedPointer(-1);
    setActiveIndices([]);
    setIsRunning(false);
    setSortSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSortSteps = (arr: number[]) => {
    const steps: SortStep[] = [];
    let compCount = 0;
    
    const mergeSort = (array: number[], start: number = 0): number[] => {
      if (array.length <= 1) return array;
      
      const mid = Math.floor(array.length / 2);
      const left = array.slice(0, mid);
      const right = array.slice(mid);
      
      steps.push({
        array: [...arr],
        leftArray: left,
        rightArray: right,
        mergedArray: [],
        leftPointer: -1,
        rightPointer: -1,
        mergedPointer: -1,
        activeIndices: Array.from({ length: array.length }, (_, i) => start + i),
        comparison: `Dividing array into left [${left.join(', ')}] and right [${right.join(', ')}]`
      });
      
      const sortedLeft = mergeSort(left, start);
      const sortedRight = mergeSort(right, start + mid);
      
      return merge(sortedLeft, sortedRight, start);
    };
    
    const merge = (left: number[], right: number[], start: number): number[] => {
      const result: number[] = [];
      let leftIndex = 0;
      let rightIndex = 0;
      
      steps.push({
        array: [...arr],
        leftArray: left,
        rightArray: right,
        mergedArray: [],
        leftPointer: 0,
        rightPointer: 0,
        mergedPointer: 0,
        activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
        comparison: `Starting to merge [${left.join(', ')}] and [${right.join(', ')}]`
      });
      
      while (leftIndex < left.length && rightIndex < right.length) {
        compCount++;
        
        if (left[leftIndex] <= right[rightIndex]) {
          result.push(left[leftIndex]);
          steps.push({
            array: [...arr],
            leftArray: left,
            rightArray: right,
            mergedArray: [...result],
            leftPointer: leftIndex,
            rightPointer: rightIndex,
            mergedPointer: result.length - 1,
            activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
            comparison: `${left[leftIndex]} ≤ ${right[rightIndex]}, taking ${left[leftIndex]} from left`
          });
          leftIndex++;
        } else {
          result.push(right[rightIndex]);
          steps.push({
            array: [...arr],
            leftArray: left,
            rightArray: right,
            mergedArray: [...result],
            leftPointer: leftIndex,
            rightPointer: rightIndex,
            mergedPointer: result.length - 1,
            activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
            comparison: `${left[leftIndex]} > ${right[rightIndex]}, taking ${right[rightIndex]} from right`
          });
          rightIndex++;
        }
      }
      
      while (leftIndex < left.length) {
        result.push(left[leftIndex]);
        steps.push({
          array: [...arr],
          leftArray: left,
          rightArray: right,
          mergedArray: [...result],
          leftPointer: leftIndex,
          rightPointer: -1,
          mergedPointer: result.length - 1,
          activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
          comparison: `Taking remaining element ${left[leftIndex]} from left`
        });
        leftIndex++;
      }
      
      while (rightIndex < right.length) {
        result.push(right[rightIndex]);
        steps.push({
          array: [...arr],
          leftArray: left,
          rightArray: right,
          mergedArray: [...result],
          leftPointer: -1,
          rightPointer: rightIndex,
          mergedPointer: result.length - 1,
          activeIndices: Array.from({ length: left.length + right.length }, (_, i) => start + i),
          comparison: `Taking remaining element ${right[rightIndex]} from right`
        });
        rightIndex++;
      }
      
      steps.push({
        array: [...arr],
        leftArray: [],
        rightArray: [],
        mergedArray: result,
        leftPointer: -1,
        rightPointer: -1,
        mergedPointer: -1,
        activeIndices: Array.from({ length: result.length }, (_, i) => start + i),
        comparison: `Merged result: [${result.join(', ')}]`
      });
      
      return result;
    };
    
    steps.push({
      array: [...arr],
      leftArray: [],
      rightArray: [],
      mergedArray: [],
      leftPointer: -1,
      rightPointer: -1,
      mergedPointer: -1,
      activeIndices: [],
      comparison: 'Starting Merge Sort - Divide and Conquer approach'
    });
    
    const sortedArray = mergeSort([...arr]);
    
    steps.push({
      array: sortedArray,
      leftArray: [],
      rightArray: [],
      mergedArray: [],
      leftPointer: -1,
      rightPointer: -1,
      mergedPointer: -1,
      activeIndices: [],
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
    setLeftArray(step.leftArray);
    setRightArray(step.rightArray);
    setMergedArray(step.mergedArray);
    setLeftPointer(step.leftPointer);
    setRightPointer(step.rightPointer);
    setMergedPointer(step.mergedPointer);
    setActiveIndices(step.activeIndices);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = sortSteps[prevStepIndex];
    setArray(step.array);
    setLeftArray(step.leftArray);
    setRightArray(step.rightArray);
    setMergedArray(step.mergedArray);
    setLeftPointer(step.leftPointer);
    setRightPointer(step.rightPointer);
    setMergedPointer(step.mergedPointer);
    setActiveIndices(step.activeIndices);
    setComparisons(prevStepIndex);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= sortSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    
    const sortStep = sortSteps[step];
    setArray(sortStep.array);
    setLeftArray(sortStep.leftArray);
    setRightArray(sortStep.rightArray);
    setMergedArray(sortStep.mergedArray);
    setLeftPointer(sortStep.leftPointer);
    setRightPointer(sortStep.rightPointer);
    setMergedPointer(sortStep.mergedPointer);
    setActiveIndices(sortStep.activeIndices);
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
    const maxHeight = 150;
    const maxValue = Math.max(...array, 1);
    return (value / maxValue) * maxHeight;
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Merge Sort Visualization</h1>
          <p className="text-lg text-drona-gray">
            Merge sort divides the array into smaller subarrays, sorts them, and then merges them back together.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n log n)</span>
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
                      onChange={(e) => setArraySize(Math.max(4, Math.min(16, parseInt(e.target.value) || 8)))}
                      min={4}
                      max={16}
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
                    <div className="flex items-end justify-center gap-1 h-40">
                      {array.map((value, index) => (
                        <div
                          key={index}
                          className={`
                            w-8 transition-all flex items-center justify-center font-bold text-white rounded-t-lg text-sm
                            ${activeIndices.includes(index) ? 'bg-yellow-500 scale-110 shadow-lg' : 'bg-blue-500'}
                          `}
                          style={{ 
                            height: `${getBarHeight(value)}px`,
                          }}
                        >
                          {value}
                        </div>
                      ))}
                    </div>

                    {(leftArray.length > 0 || rightArray.length > 0 || mergedArray.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {leftArray.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-drona-dark">Left Array</h3>
                            <div className="flex gap-1 justify-center">
                              {leftArray.map((value, index) => (
                                <div
                                  key={index}
                                  className={`
                                    w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm
                                    ${index === leftPointer ? 'bg-red-500 scale-110' : 'bg-blue-400'}
                                  `}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {rightArray.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-drona-dark">Right Array</h3>
                            <div className="flex gap-1 justify-center">
                              {rightArray.map((value, index) => (
                                <div
                                  key={index}
                                  className={`
                                    w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm
                                    ${index === rightPointer ? 'bg-red-500 scale-110' : 'bg-green-400'}
                                  `}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {mergedArray.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-drona-dark">Merged Array</h3>
                            <div className="flex gap-1 justify-center">
                              {mergedArray.map((value, index) => (
                                <div
                                  key={index}
                                  className={`
                                    w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm
                                    ${index === mergedPointer ? 'bg-purple-500 scale-110' : 'bg-gray-500'}
                                  `}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                        <span className="font-medium">Original Array</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
                        <span className="font-medium">Active Section</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-400 mr-2 rounded"></div>
                        <span className="font-medium">Left Array</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-400 mr-2 rounded"></div>
                        <span className="font-medium">Right Array</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                        <span className="font-medium">Current Pointer</span>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Merge Sort Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Divide the array into two halves recursively until each subarray has only one element.</li>
                          <li>Merge the subarrays back together by comparing elements from both sides.</li>
                          <li>Always take the smaller element and place it in the merged array.</li>
                          <li>Continue until all elements are merged into a single sorted array.</li>
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

export default MergeSortVisualizer;
