
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { SortAsc } from 'lucide-react';

const SelectionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [minIndex, setMinIndex] = useState<number | null>(null);
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Selection Sort Visualization</h1>
          <p className="text-drona-gray mb-8">
            Selection sort finds the minimum element in the unsorted part of the array and swaps it with the first unsorted element.
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
                          ${currentIndex === index ? 'bg-yellow-500' : 
                            minIndex === index ? 'bg-purple-500' : 
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
                  
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                      <span>Current position</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 mr-2"></div>
                      <span>Current minimum</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 mr-2"></div>
                      <span>Sorted</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Selection Sort Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Find the minimum element in the unsorted part of the array.</li>
                <li>Swap it with the first element in the unsorted part.</li>
                <li>Move the boundary between sorted and unsorted parts one element to the right.</li>
                <li>Repeat until the entire array is sorted.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSortVisualizer;
