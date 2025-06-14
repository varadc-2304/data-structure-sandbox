
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { Search, Play, Pause, SkipBack, SkipForward, RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= array.length - 1 || found === true) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, array.length, speed, found]);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
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

  const resetSearch = () => {
    setCurrentIndex(null);
    setFound(null);
    setIsRunning(false);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const nextStep = () => {
    if (currentStep >= array.length - 1 || found === true) {
      setIsRunning(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    setCurrentIndex(nextStepIndex);
    setComparisons(prev => prev + 1);
    
    if (array[nextStepIndex] === searchValue) {
      setFound(true);
      setIsRunning(false);
    } else if (nextStepIndex >= array.length - 1) {
      setFound(false);
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    setCurrentIndex(newStep >= 0 ? newStep : null);
    setComparisons(Math.max(0, newStep + 1));
    setFound(null);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= array.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    setCurrentIndex(step >= 0 ? step : null);
    setComparisons(Math.max(0, step + 1));
    
    if (step >= 0 && array[step] === searchValue) {
      setFound(true);
    } else if (step >= array.length - 1) {
      setFound(false);
    } else {
      setFound(null);
    }
  };

  const startSearch = () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    
    resetSearch();
    setIsRunning(true);
  };

  const togglePlayPause = () => {
    if (currentStep >= array.length - 1 || found !== null) {
      resetSearch();
      setIsRunning(true);
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
            Linear search checks each element sequentially until the target is found. 
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
                    Animation Speed: {((1000 - speed) / 100).toFixed(1)}x
                  </Label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={900}
                    min={100}
                    step={100}
                    className="w-full"
                  />
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
                    onClick={prevStep} 
                    disabled={currentStep <= -1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(-1)}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <RotateCcw className="h-4 w-4" />
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
                    onClick={() => goToStep(array.length - 1)}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= array.length - 1 || found === true}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={startSearch} 
                  disabled={isRunning || searchValue === null || array.length === 0}
                  className="w-full bg-drona-green hover:bg-drona-green/90 font-semibold"
                >
                  <Search className="mr-2 h-4 w-4" /> 
                  Start Search
                </Button>
                
                {array.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {array.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={array.length}
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
                    <p className="text-3xl font-bold text-drona-dark">
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
                      {array.map((value, index) => (
                        <div
                          key={index}
                          className={`
                            w-16 h-16 flex items-center justify-center rounded-xl border-3 transition-all duration-300 font-bold text-lg
                            ${currentIndex !== null && currentIndex === index 
                              ? 'bg-yellow-200 border-yellow-500 scale-110 shadow-lg' 
                              : 'bg-white border-gray-300 hover:border-gray-400'}
                            ${currentIndex !== null && currentIndex < index ? 'opacity-40' : 'opacity-100'}
                            ${found !== null && found === true && currentIndex === index 
                              ? 'bg-green-200 border-green-500 animate-pulse' : ''}
                          `}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                    
                    {found !== null && (
                      <div className="text-center p-6 rounded-xl border-2 bg-gradient-to-r from-drona-light to-white">
                        {found ? (
                          <div className="text-green-600 text-xl font-bold">
                            ✅ Found {searchValue} at index {currentIndex}!
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
                          <li>Start from the leftmost element of the array</li>
                          <li>Compare each element with the target value</li>
                          <li>If match is found, return the index position</li>
                          <li>If no match after checking all elements, return "not found"</li>
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
