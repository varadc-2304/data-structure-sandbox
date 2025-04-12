
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    // Create a sorted array for binary search
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setLeft(null);
    setRight(null);
    setMid(null);
    setFound(null);
    setIsRunning(false);
  };

  const startSearch = async () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setLeft(0);
    setRight(array.length - 1);
    setMid(null);
    setFound(null);
    
    let low = 0;
    let high = array.length - 1;
    
    // Binary search algorithm
    while (low <= high) {
      setLeft(low);
      setRight(high);
      
      const middle = Math.floor((low + high) / 2);
      setMid(middle);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (array[middle] === searchValue) {
        setFound(true);
        setIsRunning(false);
        return;
      }
      
      if (array[middle] < searchValue) {
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    
    setFound(false);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Binary Search Visualization</h1>
          <p className="text-drona-gray mb-8">
            Binary search works on sorted arrays by repeatedly dividing the search interval in half.
            Time Complexity: O(log n)
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button onClick={generateRandomArray} variant="outline">
                    Generate Sorted Array
                  </Button>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Search Value:</label>
                    <input
                      type="number"
                      value={searchValue === null ? '' : searchValue}
                      onChange={(e) => setSearchValue(e.target.value ? parseInt(e.target.value) : null)}
                      className="border border-gray-300 rounded px-3 py-1 w-20"
                      placeholder="Value"
                    />
                  </div>
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
                  <Button onClick={startSearch} disabled={isRunning || searchValue === null || array.length === 0}>
                    <Search className="mr-2 h-4 w-4" /> 
                    Start Search
                  </Button>
                </div>
                
                <div className="mt-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {array.map((value, index) => (
                      <div
                        key={index}
                        className={`
                          w-12 h-12 flex items-center justify-center rounded border-2 transition-all 
                          ${mid !== null && mid === index ? 'bg-yellow-200 border-yellow-500 scale-110' : 'bg-white border-gray-300'}
                          ${left !== null && right !== null ? 
                            index < left || index > right ? 'opacity-25' : 'opacity-100' : 'opacity-100'}
                          ${found !== null && found === true && mid === index ? 'bg-green-200 border-green-500' : ''}
                        `}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  
                  {found !== null && (
                    <div className="mt-4 text-center">
                      {found ? (
                        <div className="text-green-600 font-medium">Found {searchValue} at index {mid}!</div>
                      ) : (
                        <div className="text-red-600 font-medium">{searchValue} not found in the array.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Binary Search Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Binary search requires a sorted array.</li>
                <li>Compare the target value with the middle element of the array.</li>
                <li>If the target matches the middle element, return the position.</li>
                <li>If the target is greater than the middle element, search in the right half.</li>
                <li>If the target is smaller than the middle element, search in the left half.</li>
                <li>Repeat steps 2-5 until the target is found or the search space is empty.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinarySearchVisualizer;
