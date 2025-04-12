
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

const LinearSearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    resetSearch();
  };

  const resetSearch = () => {
    setCurrentIndex(null);
    setFound(null);
    setIsRunning(false);
  };

  const startSearch = async () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setCurrentIndex(null);
    setFound(null);
    
    // Linear search algorithm
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (array[i] === searchValue) {
        setFound(true);
        setIsRunning(false);
        return;
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
          <h1 className="section-title mb-2">Linear Search Visualization</h1>
          <p className="text-drona-gray mb-8">
            Linear search checks each element of the array one by one until it finds the target value or reaches the end.
            Time Complexity: O(n)
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button onClick={generateRandomArray} variant="outline">
                    Generate Random Array
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
                          ${currentIndex !== null && currentIndex === index ? 'bg-yellow-200 border-yellow-500 scale-110' : 'bg-white border-gray-300'}
                          ${currentIndex !== null && currentIndex < index ? 'opacity-50' : 'opacity-100'}
                          ${found !== null && found === true && currentIndex === index ? 'bg-green-200 border-green-500' : ''}
                        `}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                  
                  {found !== null && (
                    <div className="mt-4 text-center">
                      {found ? (
                        <div className="text-green-600 font-medium">Found {searchValue} at index {currentIndex}!</div>
                      ) : (
                        <div className="text-red-600 font-medium">{searchValue} not found in the array.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Linear Search Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Start from the leftmost element of the array and compare each element with the target value.</li>
                <li>If the current element matches the target value, return the index position.</li>
                <li>If the current element doesn't match, move to the next element.</li>
                <li>If no match is found after checking all elements, return "not found".</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearSearchVisualizer;
