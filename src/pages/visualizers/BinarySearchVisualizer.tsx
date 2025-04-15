
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Search, Play, Pause, SkipBack, SkipForward, RefreshCcw } from 'lucide-react';

const BinarySearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchHistory, setSearchHistory] = useState<Array<{
    left: number | null,
    right: number | null,
    mid: number | null,
    found: boolean | null
  }>>([]);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 8; // 8-12 elements
    // Create a sorted array for binary search
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
      .sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
    
    // Set a random value from the array as the search target
    if (newArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * newArray.length);
      setSearchValue(newArray[randomIndex]);
    }
  };

  const resetSearch = () => {
    // Clear any running timeouts
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setLeft(null);
    setRight(null);
    setMid(null);
    setFound(null);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSearchHistory([]);
  };

  const calculateSearchHistory = (inputArray: number[], target: number) => {
    const history = [];
    let low = 0;
    let high = inputArray.length - 1;
    
    // Initial state
    history.push({
      left: low,
      right: high,
      mid: null,
      found: null
    });
    
    // Binary search algorithm
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      
      // Record the state with current middle
      history.push({
        left: low,
        right: high,
        mid: middle,
        found: null
      });
      
      if (inputArray[middle] === target) {
        // Found the target
        history.push({
          left: low,
          right: high,
          mid: middle,
          found: true
        });
        break;
      }
      
      if (inputArray[middle] < target) {
        low = middle + 1;
      } else {
        high = middle - 1;
      }
    }
    
    // If the target was not found
    if (low > high) {
      history.push({
        left: null,
        right: null,
        mid: null,
        found: false
      });
    }
    
    return history;
  };

  const startSearch = async () => {
    if (searchValue === null || array.length === 0 || isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    
    // Calculate all search steps if not already calculated
    if (searchHistory.length === 0) {
      const history = calculateSearchHistory([...array], searchValue);
      setSearchHistory(history);
      setCurrentStep(0);
    }
    
    // Function to process the next step
    const processNextStep = () => {
      if (currentStep < searchHistory.length - 1 && !isPaused) {
        setCurrentStep(prev => prev + 1);
        const nextState = searchHistory[currentStep + 1];
        setLeft(nextState.left);
        setRight(nextState.right);
        setMid(nextState.mid);
        setFound(nextState.found);
        
        // Schedule next step
        searchTimeoutRef.current = setTimeout(() => {
          processNextStep();
        }, speed);
      } else if (currentStep >= searchHistory.length - 1) {
        setIsRunning(false);
      }
    };
    
    // Start processing steps
    if (currentStep < searchHistory.length - 1) {
      processNextStep();
    } else {
      setIsRunning(false);
    }
  };

  const pauseSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeSearch = () => {
    if (!isRunning) return;
    setIsPaused(false);
    startSearch();
  };

  const nextStep = () => {
    if (currentStep < searchHistory.length - 1) {
      // Clear any running timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      
      setIsPaused(true);
      setCurrentStep(prev => prev + 1);
      const nextState = searchHistory[currentStep + 1];
      setLeft(nextState.left);
      setRight(nextState.right);
      setMid(nextState.mid);
      setFound(nextState.found);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      // Clear any running timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      
      setIsPaused(true);
      setCurrentStep(prev => prev - 1);
      const prevState = searchHistory[currentStep - 1];
      setLeft(prevState.left);
      setRight(prevState.right);
      setMid(prevState.mid);
      setFound(prevState.found);
    }
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
                    <RefreshCcw className="mr-2 h-4 w-4" />
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
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {!isRunning ? (
                    <Button onClick={startSearch} disabled={array.length === 0 || searchValue === null}>
                      <Play className="mr-2 h-4 w-4" /> 
                      Start Search
                    </Button>
                  ) : isPaused ? (
                    <Button onClick={resumeSearch}>
                      <Play className="mr-2 h-4 w-4" /> 
                      Resume
                    </Button>
                  ) : (
                    <Button onClick={pauseSearch}>
                      <Pause className="mr-2 h-4 w-4" /> 
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={previousStep} disabled={currentStep <= 0 || (!isPaused && isRunning)} variant="outline">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={nextStep} disabled={currentStep >= searchHistory.length - 1 || (!isPaused && isRunning)} variant="outline">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={resetSearch} variant="outline" className="ml-auto">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reset
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
