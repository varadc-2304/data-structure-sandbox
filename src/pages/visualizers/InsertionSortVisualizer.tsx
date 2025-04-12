
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { SortAsc } from 'lucide-react';

const InsertionSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [sortedUpToIndex, setSortedUpToIndex] = useState<number>(-1);
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
    setSortedUpToIndex(-1);
    setIsRunning(false);
  };

  const startSort = async () => {
    if (array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setSortedUpToIndex(0);
    
    const arrCopy = [...array];
    const n = arrCopy.length;
    
    // Insertion sort algorithm
    for (let i = 1; i < n; i++) {
      let key = arrCopy[i];
      let j = i - 1;
      
      setCurrentIndex(i);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      while (j >= 0 && arrCopy[j] > key) {
        arrCopy[j + 1] = arrCopy[j];
        setCurrentIndex(j);
        setArray([...arrCopy]);
        
        await new Promise(resolve => setTimeout(resolve, speed));
        j--;
      }
      
      arrCopy[j + 1] = key;
      setArray([...arrCopy]);
      setSortedUpToIndex(i);
      
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setCurrentIndex(null);
    setSortedUpToIndex(n - 1);
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
          <h1 className="section-title mb-2">Insertion Sort Visualization</h1>
          <p className="text-drona-gray mb-8">
            Insertion sort builds the sorted array one item at a time, taking items from the unsorted part and inserting them at the correct position.
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
                            index <= sortedUpToIndex ? 'bg-green-500' : 'bg-blue-500'}
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
                      <span>Current element</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 mr-2"></div>
                      <span>Sorted portion</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Insertion Sort Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Start with the second element as the 'current element'.</li>
                <li>Compare the current element with all elements in the sorted portion.</li>
                <li>Shift elements in the sorted portion to the right if they are greater than the current element.</li>
                <li>Insert the current element at the correct position in the sorted portion.</li>
                <li>Move to the next unsorted element and repeat until the array is sorted.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVisualizer;
