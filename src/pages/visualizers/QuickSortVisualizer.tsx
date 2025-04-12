
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { SortAsc } from 'lucide-react';

const QuickSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [pivotIndex, setPivotIndex] = useState<number | null>(null);
  const [currentIndices, setCurrentIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    resetVisualization();
  };

  const resetVisualization = () => {
    setPivotIndex(null);
    setCurrentIndices([]);
    setSortedIndices([]);
    setIsRunning(false);
  };

  const startSort = async () => {
    if (array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setSortedIndices([]);
    
    const arrCopy = [...array];
    await quickSort(arrCopy, 0, arrCopy.length - 1);
    
    // Mark all elements as sorted
    setSortedIndices(Array.from({ length: arrCopy.length }, (_, i) => i));
    setPivotIndex(null);
    setCurrentIndices([]);
    setIsRunning(false);
  };

  const quickSort = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      // Partition the array and get pivot index
      const pivotIdx = await partition(arr, low, high);
      
      // Mark pivot as sorted
      setSortedIndices(prev => [...prev, pivotIdx]);
      
      // Recursively sort elements before and after the pivot
      await quickSort(arr, low, pivotIdx - 1);
      await quickSort(arr, pivotIdx + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      setSortedIndices(prev => [...prev, low]);
    }
  };

  const partition = async (arr: number[], low: number, high: number) => {
    // Choose rightmost element as pivot
    const pivot = arr[high];
    setPivotIndex(high);
    
    // Wait to show pivot selection
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Index of smaller element
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      // Highlight current element being compared
      setCurrentIndices([j]);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      // If current element is smaller than the pivot
      if (arr[j] < pivot) {
        i++;
        
        // Swap arr[i] and arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        
        // Highlight swapped elements
        setCurrentIndices([i, j]);
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    // Swap arr[i+1] and arr[high] (put the pivot element in its correct position)
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    
    // Highlight final pivot position
    setPivotIndex(i + 1);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    return i + 1;
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
          <h1 className="section-title mb-2">Quick Sort Visualization</h1>
          <p className="text-drona-gray mb-8">
            Quick sort is a divide-and-conquer algorithm that picks an element as a pivot and partitions the array around it.
            Time Complexity: Average O(n log n), Worst case O(n²)
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
                          ${pivotIndex === index ? 'bg-red-500' : 
                            currentIndices.includes(index) ? 'bg-yellow-500' : 
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
                      <div className="w-4 h-4 bg-red-500 mr-2"></div>
                      <span>Pivot</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                      <span>Comparing/Swapping</span>
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
              <h2 className="text-xl font-semibold mb-3">How Quick Sort Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Select a pivot element from the array.</li>
                <li>Rearrange the array so that all elements less than the pivot come before it, and all elements greater come after it. The pivot is then in its final sorted position.</li>
                <li>Recursively apply the above steps to the sub-arrays before and after the pivot.</li>
                <li>The base case is arrays of size 0 or 1, which are already sorted.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVisualizer;
