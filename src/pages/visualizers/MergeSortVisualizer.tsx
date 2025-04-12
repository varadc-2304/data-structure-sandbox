
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { SortAsc } from 'lucide-react';

const MergeSortVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [auxiliaryArray, setAuxiliaryArray] = useState<number[]>([]);
  const [colorKey, setColorKey] = useState<Record<number, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    setAuxiliaryArray([...newArray]);
    resetColors();
    setIsRunning(false);
  };

  const resetColors = () => {
    const newColorKey: Record<number, string> = {};
    for (let i = 0; i < array.length; i++) {
      newColorKey[i] = 'bg-blue-500';
    }
    setColorKey(newColorKey);
  };

  const startSort = async () => {
    if (array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    resetColors();
    
    const arrCopy = [...array];
    const auxCopy = [...array];
    
    await mergeSort(arrCopy, auxCopy, 0, arrCopy.length - 1);
    
    // Mark all elements as sorted
    const finalColorKey: Record<number, string> = {};
    for (let i = 0; i < arrCopy.length; i++) {
      finalColorKey[i] = 'bg-green-500';
    }
    setColorKey(finalColorKey);
    setIsRunning(false);
  };

  const mergeSort = async (mainArray: number[], auxiliaryArray: number[], startIdx: number, endIdx: number) => {
    if (startIdx === endIdx) return;
    
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    
    // Update color for the current subarray
    const newColorKey = { ...colorKey };
    for (let i = startIdx; i <= endIdx; i++) {
      newColorKey[i] = 'bg-yellow-500';
    }
    setColorKey(newColorKey);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Sort left half
    await mergeSort(auxiliaryArray, mainArray, startIdx, middleIdx);
    
    // Sort right half
    await mergeSort(auxiliaryArray, mainArray, middleIdx + 1, endIdx);
    
    // Merge the two halves
    await doMerge(mainArray, auxiliaryArray, startIdx, middleIdx, endIdx);
  };
  
  const doMerge = async (mainArray: number[], auxiliaryArray: number[], startIdx: number, middleIdx: number, endIdx: number) => {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    
    while (i <= middleIdx && j <= endIdx) {
      // Update color for the comparing elements
      const newColorKey = { ...colorKey };
      newColorKey[i] = 'bg-purple-500';
      newColorKey[j] = 'bg-purple-500';
      setColorKey(newColorKey);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        mainArray[k] = auxiliaryArray[i];
        i++;
      } else {
        mainArray[k] = auxiliaryArray[j];
        j++;
      }
      k++;
    }
    
    while (i <= middleIdx) {
      const newColorKey = { ...colorKey };
      newColorKey[i] = 'bg-purple-500';
      setColorKey(newColorKey);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      mainArray[k] = auxiliaryArray[i];
      i++;
      k++;
    }
    
    while (j <= endIdx) {
      const newColorKey = { ...colorKey };
      newColorKey[j] = 'bg-purple-500';
      setColorKey(newColorKey);
      await new Promise(resolve => setTimeout(resolve, speed));
      
      mainArray[k] = auxiliaryArray[j];
      j++;
      k++;
    }
    
    // Update the displayed array after merge
    setArray([...mainArray]);
    setAuxiliaryArray([...auxiliaryArray]);
    
    // Mark merged subarray as sorted
    const newColorKey = { ...colorKey };
    for (let idx = startIdx; idx <= endIdx; idx++) {
      newColorKey[idx] = 'bg-green-500';
    }
    setColorKey(newColorKey);
    await new Promise(resolve => setTimeout(resolve, speed));
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
          <h1 className="section-title mb-2">Merge Sort Visualization</h1>
          <p className="text-drona-gray mb-8">
            Merge sort is a divide-and-conquer algorithm that divides the array in half, sorts each half, and then merges them back together.
            Time Complexity: O(n log n)
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
                          ${colorKey[index] || 'bg-blue-500'}
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
                      <span>Current subarray</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 mr-2"></div>
                      <span>Comparing</span>
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
              <h2 className="text-xl font-semibold mb-3">How Merge Sort Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Divide the unsorted array into n subarrays, each containing one element (a single element is considered sorted).</li>
                <li>Repeatedly merge subarrays to produce new sorted subarrays until there is only one subarray remaining.</li>
                <li>When merging two sorted subarrays, compare the smallest elements of both and place the smaller one in the result array.</li>
                <li>Continue this process until all elements are merged into one sorted array.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeSortVisualizer;
