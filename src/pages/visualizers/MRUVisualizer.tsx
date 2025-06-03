import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PageFrame {
  id: number;
  page: number | null;
  lastUsed: number;
  loaded: boolean;
  highlight: boolean;
}

interface SimulationStep {
  frames: PageFrame[];
  faults: number;
  hits: number;
  history: { page: number; fault: boolean }[];
}

const MRUVisualizer = () => {
  const [pageReferences, setPageReferences] = useState<number[]>([]);
  const [inputReference, setInputReference] = useState<string>("");
  const [framesCount, setFramesCount] = useState<number>(3);
  const [frames, setFrames] = useState<PageFrame[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [pageFaults, setPageFaults] = useState<number>(0);
  const [pageHits, setPageHits] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [referenceHistory, setReferenceHistory] = useState<{ page: number; fault: boolean }[]>([]);
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Initialize frames
  useEffect(() => {
    const newFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      lastUsed: 0,
      loaded: false,
      highlight: false
    }));
    setFrames(newFrames);
    resetSimulation();
  }, [framesCount]);

  const simulateStep = (stepIndex: number, currentFrames: PageFrame[], currentFaults: number, currentHits: number, currentHistory: { page: number; fault: boolean }[]) => {
    if (stepIndex >= pageReferences.length) return null;
    
    const pageRef = pageReferences[stepIndex];
    const pageInFrames = currentFrames.findIndex(frame => frame.page === pageRef);
    
    let newFrames = currentFrames.map(frame => ({ ...frame, highlight: false }));
    let newFaults = currentFaults;
    let newHits = currentHits;
    
    if (pageInFrames !== -1) {
      // Page hit
      newFrames[pageInFrames] = { 
        ...newFrames[pageInFrames], 
        lastUsed: stepIndex,
        highlight: true 
      };
      newHits++;
    } else {
      // Page fault
      const emptyFrameIndex = newFrames.findIndex(frame => !frame.loaded);
      
      if (emptyFrameIndex !== -1) {
        newFrames[emptyFrameIndex] = {
          ...newFrames[emptyFrameIndex],
          page: pageRef,
          lastUsed: stepIndex,
          loaded: true,
          highlight: true
        };
      } else {
        // Find MRU frame
        let mruIndex = 0;
        for (let i = 1; i < newFrames.length; i++) {
          if (newFrames[i].lastUsed > newFrames[mruIndex].lastUsed) {
            mruIndex = i;
          }
        }
        
        newFrames[mruIndex] = {
          ...newFrames[mruIndex],
          page: pageRef,
          lastUsed: stepIndex,
          highlight: true
        };
      }
      newFaults++;
    }
    
    const newHistory = [...currentHistory, { page: pageRef, fault: pageInFrames === -1 }];
    
    return {
      frames: newFrames,
      faults: newFaults,
      hits: newHits,
      history: newHistory
    };
  };

  const precomputeSimulation = () => {
    const steps: SimulationStep[] = [];
    let currentFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      lastUsed: 0,
      loaded: false,
      highlight: false
    }));
    let currentFaults = 0;
    let currentHits = 0;
    let currentHistory: { page: number; fault: boolean }[] = [];

    // Initial state
    steps.push({
      frames: [...currentFrames],
      faults: currentFaults,
      hits: currentHits,
      history: [...currentHistory]
    });

    for (let i = 0; i < pageReferences.length; i++) {
      const result = simulateStep(i, currentFrames, currentFaults, currentHits, currentHistory);
      if (result) {
        currentFrames = result.frames;
        currentFaults = result.faults;
        currentHits = result.hits;
        currentHistory = result.history;
        
        steps.push({
          frames: [...currentFrames],
          faults: currentFaults,
          hits: currentHits,
          history: [...currentHistory]
        });
      }
    }

    setSimulationSteps(steps);
    return steps;
  };

  const updateToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= simulationSteps.length) return;
    
    const step = simulationSteps[stepIndex];
    setFrames(step.frames);
    setPageFaults(step.faults);
    setPageHits(step.hits);
    setReferenceHistory(step.history);
    setCurrentStep(stepIndex - 1); // Adjust for 0-based indexing
  };

  // Handle auto-play
  useEffect(() => {
    if (!autoPlay || currentStep >= pageReferences.length - 1) return;

    const timer = setTimeout(() => {
      const nextStepIndex = currentStep + 2; // +2 because steps include initial state
      if (nextStepIndex < simulationSteps.length) {
        updateToStep(nextStepIndex);
      } else {
        setAutoPlay(false);
      }
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [autoPlay, currentStep, pageReferences.length, speed, simulationSteps]);

  const handleAddReference = () => {
    if (!inputReference.trim()) return;
    
    try {
      const newReferences = inputReference
        .split(/[,\s]+/)
        .filter(Boolean)
        .map(ref => {
          const parsedRef = parseInt(ref.trim());
          if (isNaN(parsedRef) || parsedRef < 0) {
            throw new Error('Invalid reference');
          }
          return parsedRef;
        });
      
      setPageReferences([...pageReferences, ...newReferences]);
      setInputReference("");
    } catch (error) {
      console.error("Invalid reference format");
    }
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setPageFaults(0);
    setPageHits(0);
    setAutoPlay(false);
    setReferenceHistory([]);
    setSimulationSteps([]);
    
    const resetFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      lastUsed: 0,
      loaded: false,
      highlight: false
    }));
    setFrames(resetFrames);
  };

  const handlePlayPause = () => {
    if (pageReferences.length === 0) return;
    
    if (simulationSteps.length === 0) {
      precomputeSimulation();
    }
    
    if (currentStep >= pageReferences.length - 1) {
      resetSimulation();
      setTimeout(() => {
        const steps = precomputeSimulation();
        setAutoPlay(true);
        updateToStep(1);
      }, 100);
    } else {
      setAutoPlay(!autoPlay);
    }
  };

  const handleStepForward = () => {
    if (simulationSteps.length === 0) precomputeSimulation();
    const nextStepIndex = currentStep + 2;
    if (nextStepIndex < simulationSteps.length) {
      updateToStep(nextStepIndex);
    }
  };

  const handleStepBackward = () => {
    if (simulationSteps.length === 0) precomputeSimulation();
    const prevStepIndex = Math.max(0, currentStep + 1);
    updateToStep(prevStepIndex);
  };

  const handleRewind = () => {
    if (simulationSteps.length === 0) precomputeSimulation();
    updateToStep(0);
  };

  const handleFastForward = () => {
    if (simulationSteps.length === 0) precomputeSimulation();
    updateToStep(simulationSteps.length - 1);
  };

  const handleSliderChange = (value: number[]) => {
    if (simulationSteps.length === 0) precomputeSimulation();
    setAutoPlay(false);
    updateToStep(value[0]);
  };

  useEffect(() => {
    if (pageReferences.length > 0 && simulationSteps.length === 0) {
      precomputeSimulation();
    }
  }, [pageReferences]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-4">
          <Link to="/page-replacement" className="flex items-center text-drona-green hover:underline mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Page Replacement
          </Link>
          <h1 className="text-3xl font-bold text-drona-dark">MRU Page Replacement</h1>
          <p className="text-drona-gray">Most Recently Used page replacement algorithm visualization</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up the page replacement simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frames">Number of Frames</Label>
                    <Input
                      id="frames"
                      type="number"
                      min={1}
                      max={10}
                      value={framesCount}
                      onChange={(e) => setFramesCount(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reference">Page Reference</Label>
                    <div className="flex mt-1">
                      <Input
                        id="reference"
                        placeholder="e.g., 1, 2, 3, 4"
                        value={inputReference}
                        onChange={(e) => setInputReference(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReference()}
                        className="rounded-r-none"
                      />
                      <Button onClick={handleAddReference} className="rounded-l-none">Add</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Simulation Speed</Label>
                    <div className="flex items-center mt-1">
                      <input 
                        type="range" 
                        min={0.5} 
                        max={3} 
                        step={0.5} 
                        value={speed} 
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="ml-2 text-sm text-drona-gray">{speed}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRewind}
                        disabled={pageReferences.length === 0}
                      >
                        <Rewind className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleStepBackward}
                        disabled={pageReferences.length === 0 || currentStep < 0}
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        className="flex-1 bg-drona-green hover:bg-drona-green/90" 
                        onClick={handlePlayPause}
                        disabled={pageReferences.length === 0}
                      >
                        {autoPlay ? (
                          <><Pause className="mr-2 h-4 w-4" /> Pause</>
                        ) : (
                          <><Play className="mr-2 h-4 w-4" /> {currentStep >= pageReferences.length - 1 ? 'Restart' : 'Play'}</>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleStepForward}
                        disabled={pageReferences.length === 0 || currentStep >= pageReferences.length - 1}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleFastForward}
                        disabled={pageReferences.length === 0}
                      >
                        <FastForward className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={resetSimulation}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  {pageReferences.length > 0 && (
                    <div>
                      <Label>Step Control</Label>
                      <div className="mt-2">
                        <Slider
                          value={[currentStep + 1]}
                          max={pageReferences.length}
                          min={0}
                          step={1}
                          onValueChange={handleSliderChange}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-drona-gray mt-1">
                          <span>0</span>
                          <span>{pageReferences.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Page Faults</p>
                    <p className="text-2xl font-bold text-drona-dark">{pageFaults}</p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Page Hits</p>
                    <p className="text-2xl font-bold text-drona-dark">{pageHits}</p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Fault Rate</p>
                    <p className="text-2xl font-bold text-drona-dark">
                      {referenceHistory.length ? ((pageFaults / referenceHistory.length) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Hit Rate</p>
                    <p className="text-2xl font-bold text-drona-dark">
                      {referenceHistory.length ? ((pageHits / referenceHistory.length) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="visualization">
              <TabsList className="mb-4">
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualization">
                <Card>
                  <CardHeader>
                    <CardTitle>MRU Visualization</CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {pageReferences.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Reference String</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pageReferences.map((page, idx) => (
                          <Badge 
                            key={idx}
                            variant={idx === currentStep ? "default" : "outline"}
                            className={idx === currentStep ? "bg-drona-green" : ""}
                          >
                            {page}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Memory Frames</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {frames.map((frame, idx) => (
                          <div 
                            key={frame.id} 
                            className={cn(
                              "border border-gray-200 rounded-lg p-4 flex items-center justify-center transition-all", 
                              frame.highlight && "bg-drona-green/10 border-drona-green"
                            )}
                          >
                            <div className="text-center">
                              <div className="font-medium">Frame {idx}</div>
                              {frame.page !== null ? (
                                <div className={cn("text-2xl font-bold mt-1", frame.highlight && "text-drona-green")}>
                                  Page {frame.page}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-2xl mt-1">Empty</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Access History</h3>
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                        {referenceHistory.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">No history yet</div>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-drona-light">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Step</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Page</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {referenceHistory.map((item, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                  <td className="px-4 py-2 text-sm">Page {item.page}</td>
                                  <td className="px-4 py-2">
                                    <Badge variant={item.fault ? "destructive" : "outline"}
                                      className={!item.fault ? "border-drona-green text-drona-green" : ""}>
                                      {item.fault ? 'Fault' : 'Hit'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="algorithm">
                <Card>
                  <CardHeader>
                    <CardTitle>MRU Algorithm</CardTitle>
                    <CardDescription>Most Recently Used Page Replacement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        MRU is the opposite of LRU - it replaces the page that has been most recently used. The algorithm keeps track of when each page was last accessed.
                      </p>
                      <p className="text-drona-gray">
                        When a page fault occurs and all frames are full, the page that was most recently used is evicted and replaced with the new page.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function MRU_PageReplacement(referenceString, frameCount):
    frames = create empty array of size frameCount
    pageLastUsed = empty map to track when each page was last used
    pageFaults = 0
    currentTime = 0
    
    for each page in referenceString:
        currentTime++
        
        if page is in frames:
            // Page hit - update last used time
            pageLastUsed[page] = currentTime
        else:
            // Page fault
            if frames is not full:
                // Add page to empty frame
                add page to frames
            else:
                // Find most recently used page
                mruPage = page with maximum pageLastUsed value
                replace mruPage in frames with page
            endif
            
            pageLastUsed[page] = currentTime
            pageFaults++
        endif
    endfor
    
    return pageFaults`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Simple to implement like LRU</li>
                        <li>Can perform well in certain specific workload patterns</li>
                        <li>Useful for specific cases where most recently used pages are less likely to be needed again</li>
                        <li>Works well with cyclic access patterns where oldest pages are needed soon</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Generally performs worse than LRU in most real-world scenarios</li>
                        <li>Does not take advantage of temporal locality</li>
                        <li>May evict pages that are likely to be used again soon</li>
                        <li>Requires tracking of page access times like LRU</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding MRU performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> for each page reference operation, where n is the number of frames.
                      </p>
                      <p className="text-drona-gray">
                        MRU needs to search through all frames to find the most recently used page when a page fault occurs, similar to LRU.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of page frames.
                      </p>
                      <p className="text-drona-gray">
                        Additional space is required for storing the "last used" timestamps for each page in memory, just like in LRU.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">When MRU Performs Well</h3>
                      <p className="text-drona-gray mb-4">
                        MRU can outperform other algorithms in specific workloads:
                      </p>
                      
                      <ul className="list-disc pl-5 text-drona-gray space-y-1 mb-4">
                        <li>When access patterns are cyclic or reverse to typical patterns</li>
                        <li>In databases with full table scans where data is unlikely to be reused immediately</li>
                        <li>When dealing with large sequential arrays that are processed once</li>
                      </ul>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">Real-world Example</h4>
                        <p className="text-sm text-drona-gray">
                          In a database system performing sequential reads of records, the MRU policy can be effective since the most recently used pages are unlikely to be needed again soon, while older pages may be needed for joins or aggregations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MRUVisualizer;
