import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { Search, Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SearchStep {
  index: number;
  comparison: string;
}

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [arraySize, setArraySize] = useState<number>(10);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= searchSteps.length - 1 || found !== null) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, searchSteps.length, speed, found]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    resetSearch();
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
      resetSearch();
    } catch (error) {
      console.error("Invalid array format");
    }
  };

  const calculateSearchSteps = (arr: number[], target: number) => {
    const steps: SearchStep[] = [];
    
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        steps.push({ index: i, comparison: 'Found!' });
        break;
      } else {
        steps.push({ index: i, comparison: `${arr[i]} ≠ ${target}` });
      }
    }
    
    return steps;
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFound(null);
    setFoundIndex(null);
    setIsRunning(false);
    setCurrentStep(-1);
    setComparisons(0);
    setSearchSteps([]);
  };

  const nextStep = () => {
    if (currentStep >= searchSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    
    const step = searchSteps[nextStepIndex];
    setCurrentIndex(step.index);
    setComparisons(prev => prev + 1);
    
    if (step.comparison === 'Found!') {
      setFound(true);
      setFoundIndex(step.index);
      setIsRunning(false);
    } else if (nextStepIndex >= searchSteps.length - 1) {
      setFound(false);
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setComparisons(Math.max(0, newStep + 1));
    
    if (newStep === -1) {
      setCurrentIndex(null);
      setFound(null);
      setFoundIndex(null);
    } else {
      const step = searchSteps[newStep];
      setCurrentIndex(step.index);
      
      if (step.comparison === 'Found!') {
        setFound(true);
        setFoundIndex(step.index);
      } else {
        setFound(null);
        setFoundIndex(null);
      }
    }
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= searchSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    setComparisons(Math.max(0, step + 1));
    
    if (step === -1) {
      setCurrentIndex(null);
      setFound(null);
      setFoundIndex(null);
    } else {
      const searchStep = searchSteps[step];
      setCurrentIndex(searchStep.index);
      
      if (searchStep.comparison === 'Found!') {
        setFound(true);
        setFoundIndex(searchStep.index);
      } else if (step >= searchSteps.length - 1) {
        setFound(false);
        setFoundIndex(null);
      } else {
        setFound(null);
        setFoundIndex(null);
      }
    }
  };

  const startSearch = () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    
    resetSearch();
    const steps = calculateSearchSteps(array, searchValue);
    setSearchSteps(steps);
    
    if (steps.length === 0) {
      setFound(false);
    } else {
      setIsRunning(true);
    }
  };

  const togglePlayPause = () => {
    if (currentStep >= searchSteps.length - 1 || found !== null) {
      startSearch();
    } else {
      setIsRunning(!isRunning);
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Linear Search Visualization</h1>
          <p className="text-lg text-drona-gray">
            Linear search checks each element sequentially until the target is found or the array ends.
            <span className="font-semibold text-drona-green"> Time Complexity: O(n)</span>
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
                        placeholder="e.g., 10, 25, 30, 45"
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
                  <Label className="text-sm font-semibold text-drona-dark">Search Value</Label>
                  <Input
                    type="number"
                    value={searchValue === null ? '' : searchValue}
                    onChange={(e) => setSearchValue(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Enter value to search"
                    className="border-2 focus:border-drona-green"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {(10 - (speed / 100)).toFixed(1)}x
                  </Label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={900}
                    min={100}
                    step={100}
                    className="w-full"
                  />
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
                    onClick={() => goToStep(-1)}
                    disabled={searchSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= -1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    disabled={searchValue === null || array.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= searchSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(searchSteps.length - 1)}
                    disabled={searchSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => {
                    resetSearch();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {searchSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {searchSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={searchSteps.length}
                      min={0}
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
                    <p className="text-sm font-semibold text-drona-gray">Comparisons Made</p>
                    <p className="text-3xl font-bold text-drona-dark">{comparisons}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Array Size</p>
                    <p className="text-3xl font-bold text-drona-dark">{array.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Index</p>
                    <p className="text-xl font-bold text-drona-dark">
                      {currentIndex !== null ? currentIndex : '-'}
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
                <CardTitle className="text-2xl font-bold text-drona-dark">Array Visualization</CardTitle>
                {searchValue !== null && (
                  <p className="text-lg font-semibold text-drona-green">
                    Searching for: <span className="text-2xl">{searchValue}</span>
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-8">
                {array.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Search className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Generate an array to start visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-wrap justify-center gap-3">
                      {array.map((value, index) => {
                        let elementClass = 'w-16 h-16 flex items-center justify-center rounded-xl border-3 transition-all duration-300 font-bold text-lg ';
                        
                        if (currentIndex === index) {
                          elementClass += 'bg-yellow-200 border-yellow-500 scale-110 shadow-lg ';
                        } else if (foundIndex === index && found) {
                          elementClass += 'bg-green-200 border-green-500 animate-pulse ';
                        } else if (currentIndex !== null && index < currentIndex) {
                          elementClass += 'bg-red-100 border-red-300 ';
                        } else {
                          elementClass += 'bg-white border-gray-300 ';
                        }
                        
                        return (
                          <div key={index} className={elementClass}>
                            {value}
                          </div>
                        );
                      })}
                    </div>
                    
                    {currentStep >= 0 && currentStep < searchSteps.length && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          {searchSteps[currentStep].comparison}
                        </p>
                      </div>
                    )}
                    
                    {found !== null && (
                      <div className="text-center p-6 rounded-xl border-2 bg-gradient-to-r from-drona-light to-white">
                        {found ? (
                          <div className="text-green-600 text-xl font-bold">
                            ✅ Found {searchValue} at index {foundIndex}!
                            <div className="text-sm font-medium text-drona-gray mt-2">
                              Total comparisons: {comparisons}
                            </div>
                          </div>
                        ) : (
                          <div className="text-red-600 text-xl font-bold">
                            ❌ {searchValue} not found in the array.
                            <div className="text-sm font-medium text-drona-gray mt-2">
                              Total comparisons: {comparisons}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Linear Search Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Start from the first element of the array</li>
                          <li>Compare the current element with the target value</li>
                          <li>If they match, return the current index</li>
                          <li>If they don't match, move to the next element</li>
                          <li>Repeat until the element is found or array ends</li>
                          <li>If array ends without finding the element, return "not found"</li>
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

export default LinearSearchVisualizer;
