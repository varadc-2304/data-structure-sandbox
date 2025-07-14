
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const OptimalVisualizer = () => {
  const [frames, setFrames] = useState(3);
  const [referenceString, setReferenceString] = useState<number[]>([1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [newPage, setNewPage] = useState('');
  const [memory, setMemory] = useState<(number | null)[]>([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [pageHits, setPageHits] = useState(0);

  const initializeSimulation = () => {
    setMemory(new Array(frames).fill(null));
    setCurrentStep(0);
    setPageFaults(0);
    setPageHits(0);
    setIsRunning(false);
  };

  const addPage = () => {
    if (newPage && !isNaN(Number(newPage))) {
      setReferenceString([...referenceString, Number(newPage)]);
      setNewPage('');
    }
  };

  const removePage = (index: number) => {
    const newString = referenceString.filter((_, i) => i !== index);
    setReferenceString(newString);
    if (currentStep >= newString.length) {
      setCurrentStep(Math.max(0, newString.length - 1));
    }
  };

  const findOptimalPageToReplace = (currentIndex: number, currentMemory: (number | null)[]) => {
    let farthestIndex = -1;
    let pageToReplace = 0;
    
    for (let i = 0; i < currentMemory.length; i++) {
      const page = currentMemory[i];
      if (page === null) continue;
      
      let nextUse = referenceString.length;
      for (let j = currentIndex + 1; j < referenceString.length; j++) {
        if (referenceString[j] === page) {
          nextUse = j;
          break;
        }
      }
      
      if (nextUse > farthestIndex) {
        farthestIndex = nextUse;
        pageToReplace = i;
      }
    }
    
    return pageToReplace;
  };

  React.useEffect(() => {
    initializeSimulation();
  }, [frames, referenceString]);

  React.useEffect(() => {
    if (!isRunning || currentStep >= referenceString.length) return;

    const timer = setTimeout(() => {
      const page = referenceString[currentStep];
      const newMemory = [...memory];
      let newPageFaults = pageFaults;
      let newPageHits = pageHits;

      if (newMemory.includes(page)) {
        newPageHits++;
      } else {
        newPageFaults++;
        const emptyIndex = newMemory.findIndex(frame => frame === null);
        
        if (emptyIndex !== -1) {
          newMemory[emptyIndex] = page;
        } else {
          const replaceIndex = findOptimalPageToReplace(currentStep, newMemory);
          newMemory[replaceIndex] = page;
        }
      }

      setMemory(newMemory);
      setPageFaults(newPageFaults);
      setPageHits(newPageHits);
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 >= referenceString.length) {
        setIsRunning(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, memory, pageFaults, pageHits, referenceString]);

  const toggleSimulation = () => {
    if (currentStep >= referenceString.length) {
      initializeSimulation();
    }
    setIsRunning(!isRunning);
  };

  const hitRate = referenceString.length > 0 ? ((pageHits / Math.max(currentStep, 1)) * 100).toFixed(1) : '0.0';
  const faultRate = referenceString.length > 0 ? ((pageFaults / Math.max(currentStep, 1)) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard/memory-management" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Memory Management
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Optimal Page Replacement</h1>
          <p className="text-gray-600">Visualize the Optimal page replacement algorithm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Frames:</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={frames}
                    onChange={(e) => setFrames(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reference String:</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {referenceString.map((page, index) => (
                      <div key={index} className="flex items-center">
                        <Badge 
                          variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"}
                          className="text-sm px-3 py-1"
                        >
                          {page}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePage(index)}
                          className="ml-1 h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add page"
                      value={newPage}
                      onChange={(e) => setNewPage(e.target.value)}
                      className="w-32"
                    />
                    <Button onClick={addPage} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={toggleSimulation} className="flex items-center gap-2">
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={initializeSimulation} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Frames</CardTitle>
                <CardDescription>Current state of memory frames</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: frames }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-16">Frame {index + 1}:</span>
                      <div className="w-16 h-16 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                        {memory[index] !== null ? (
                          <span className="text-lg font-bold text-blue-600">
                            {memory[index]}
                          </span>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{pageFaults}</div>
                  <div className="text-sm text-gray-600">Page Faults</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{pageHits}</div>
                  <div className="text-sm text-gray-600">Page Hits</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{hitRate}%</div>
                  <div className="text-sm text-gray-600">Hit Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{faultRate}%</div>
                  <div className="text-sm text-gray-600">Fault Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p><strong>Optimal Algorithm:</strong></p>
                  <p>Replaces the page that will not be used for the longest period of time in the future.</p>
                  <p><strong>Time Complexity:</strong> O(n²)</p>
                  <p><strong>Space Complexity:</strong> O(1)</p>
                  <p><strong>Note:</strong> This is a theoretical algorithm that provides the minimum number of page faults but is not practical in real systems as it requires future knowledge.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimalVisualizer;
