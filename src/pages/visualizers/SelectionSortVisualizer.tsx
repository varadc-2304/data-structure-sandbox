
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SortAsc, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

const SelectionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(10);
  const [customArrayInput, setCustomArrayInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [minIndex, setMinIndex] = useState<number | null>(null);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
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
    setCurrentIndex(null);
    setMinIndex(null);
    setSortedIndices([]);
    setIsRunning(false);
  };

  const startSort = async () => {
    if (array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setSortedIndices([]);
    
    const arrCopy = [...array];
    const n = arrCopy.length;
    
    // Selection sort algorithm
    for (let i = 0; i < n - 1; i++) {
      setCurrentIndex(i);
      let minIdx = i;
      setMinIndex(minIdx);
      
      for (let j = i + 1; j < n; j++) {
        // Wait for animation to show comparison
        await new Promise(resolve => setTimeout(resolve, speed / 2));
        
        if (arrCopy[j] < arrCopy[minIdx]) {
          minIdx = j;
          setMinIndex(j);
        }
      }
      
      // Wait for animation before the swap
      await new Promise(resolve => setTimeout(resolve, speed));
      
      // Swap the found minimum element with the first element
      if (minIdx !== i) {
        [arrCopy[i], arrCopy[minIdx]] = [arrCopy[minIdx], arrCopy[i]];
        setArray([...arrCopy]);
      }
      
      // Mark this position as sorted
      setSortedIndices(prev => [...prev, i]);
    }
    
    // Mark all elements as sorted
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setCurrentIndex(null);
    setMinIndex(null);
    setIsRunning(false);
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Selection Sort Visualization</h1>
          <p className="text-lg text-drona-gray">
            Selection sort finds the minimum element in the unsorted part of the array and swaps it with the first unsorted element.
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
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
                
                <Button 
                  onClick={startSort} 
                  disabled={isRunning || array.length === 0}
                  className="w-full bg-drona-green hover:bg-drona-green/90 font-semibold"
                >
                  <SortAsc className="mr-2 h-4 w-4" /> 
                  Start Sort
                </Button>
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
                            ${currentIndex === index ? 'bg-yellow-500 scale-110 shadow-lg' : 
                              minIndex === index ? 'bg-purple-500 scale-105' : 
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
                    
                    <div className="flex justify-center gap-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
                        <span className="font-medium">Unsorted</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
                        <span className="font-medium">Current position</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-purple-500 mr-2 rounded"></div>
                        <span className="font-medium">Current minimum</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                        <span className="font-medium">Sorted</span>
                      </div>
                    </div>
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">How Selection Sort Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Find the minimum element in the unsorted part of the array.</li>
                          <li>Swap it with the first element in the unsorted part.</li>
                          <li>Move the boundary between sorted and unsorted parts one element to the right.</li>
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

export default SelectionSortVisualizer;
