
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { SortAsc } from 'lucide-react';

const BubbleSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [currentSwapIndices, setCurrentSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    resetSort();
  };

  const resetSort = () => {
    setCurrentSwapIndices([]);
    setSortedIndices([]);
    setIsRunning(false);
  };

  const startSort = async () => {
    if (array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setSortedIndices([]);
    
    const arrCopy = [...array];
    const n = arrCopy.length;
    
    // Bubble sort algorithm
    for (let i = 0; i < n; i++) {
      let swapped = false;
      
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentSwapIndices([j, j + 1]);
        
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, speed));
        
        if (arrCopy[j] > arrCopy[j + 1]) {
          // Swap elements
          [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];
          setArray([...arrCopy]);
          swapped = true;
        }
      }
      
      // Mark this position as sorted
      setSortedIndices(prev => [...prev, n - i - 1]);
      
      // If no swapping occurred in this pass, array is sorted
      if (!swapped) break;
    }
    
    // Mark all elements as sorted
    setCurrentSwapIndices([]);
    setSortedIndices(Array.from({ length: n }, (_, i) => i));
    setIsRunning(false);
  };

  const getBarHeight = (value: number) => {
    const maxHeight = 200;
    const maxValue = Math.max(...array, 1);
    return (value / maxValue) * maxHeight;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Bubble Sort Visualization</h1>
          <p className="text-drona-gray mb-8">
            Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
            Time Complexity: O(n²)
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button onClick={generateRandomArray} variant="outline">
                    Generate Random Array
                  </Button>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Speed:</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  <Button onClick={startSort} disabled={isRunning || array.length === 0}>
                    <SortAsc className="mr-2 h-4 w-4" /> 
                    Start Sort
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-end justify-center gap-1 h-60">
                    {array.map((value, index) => (
                      <div
                        key={index}
                        className={`
                          w-12 transition-all flex items-center justify-center
                          ${currentSwapIndices.includes(index) ? 'bg-yellow-500' : 
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
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Bubble Sort Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Start from the first element, compare adjacent elements and swap them if they are in the wrong order.</li>
                <li>After each pass, the largest element "bubbles up" to the end of the array.</li>
                <li>Repeat the process for the remaining elements, excluding the already sorted ones at the end.</li>
                <li>Continue until no more swaps are needed, which means the array is sorted.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;
