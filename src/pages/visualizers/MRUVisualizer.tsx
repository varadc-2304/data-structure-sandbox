
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
  loaded: boolean;
  highlight: boolean;
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
  const [simulationHistory, setSimulationHistory] = useState<{
    frames: PageFrame[];
    faults: number;
    hits: number;
    history: { page: number; fault: boolean }[];
  }[]>([]);

  // Initialize frames
  useEffect(() => {
    const newFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      loaded: false,
      highlight: false
    }));
    setFrames(newFrames);
    resetSimulation();
  }, [framesCount]);

  // Handle play/pause
  useEffect(() => {
    if (!isPlaying || currentStep >= pageReferences.length - 1) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, pageReferences.length, speed]);

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
    setIsPlaying(false);
    setReferenceHistory([]);
    setSimulationHistory([]);
    
    const resetFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      loaded: false,
      highlight: false
    }));
    setFrames(resetFrames);
  };

  const simulateStep = (stepIndex: number, currentFrames: PageFrame[], currentFaults: number, currentHits: number, currentHistory: { page: number; fault: boolean }[]) => {
    if (stepIndex >= pageReferences.length) return null;
    
    const pageRef = pageReferences[stepIndex];
    const pageInFrames = currentFrames.some(frame => frame.page === pageRef);
    
    let newFrames = currentFrames.map(frame => ({ ...frame, highlight: false }));
    let newFaults = currentFaults;
    let newHits = currentHits;
    let newHistory = [...currentHistory];
    
    if (pageInFrames) {
      newFrames = newFrames.map(frame => 
        frame.page === pageRef ? { ...frame, highlight: true } : frame
      );
      newHits++;
    } else {
      // Check if there's an empty frame first
      const emptyFrameIndex = newFrames.findIndex(frame => !frame.loaded);
      
      if (emptyFrameIndex !== -1) {
        // Use empty frame
        newFrames[emptyFrameIndex] = {
          ...newFrames[emptyFrameIndex],
          page: pageRef,
          loaded: true,
          highlight: true
        };
      } else {
        // All frames are full, use MRU replacement
        // Find the most recently used page
        let mostRecentFrameIndex = 0;
        let mostRecentTime = -1;
        
        // Track when each page was last used
        const pageLastUsed = new Map();
        
        // Reconstruct the usage history to find the most recently used frame
        for (let i = 0; i <= stepIndex; i++) {
          const historyPage = pageReferences[i];
          pageLastUsed.set(historyPage, i);
        }
        
        // Find the frame with the most recent usage
        for (let i = 0; i < newFrames.length; i++) {
          if (newFrames[i].page !== null) {
            const lastUsed = pageLastUsed.get(newFrames[i].page) || -1;
            if (lastUsed > mostRecentTime) {
              mostRecentTime = lastUsed;
              mostRecentFrameIndex = i;
            }
          }
        }
        
        // Replace the most recently used frame
        newFrames[mostRecentFrameIndex] = {
          ...newFrames[mostRecentFrameIndex],
          page: pageRef,
          loaded: true,
          highlight: true
        };
      }
      
      newFaults++;
    }
    
    newHistory.push({ page: pageRef, fault: !pageInFrames });
    
    return {
      frames: newFrames,
      faults: newFaults,
      hits: newHits,
      history: newHistory
    };
  };

  const nextStep = () => {
    if (currentStep >= pageReferences.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    const result = simulateStep(nextStepIndex, frames, pageFaults, pageHits, referenceHistory);
    
    if (result) {
      setFrames(result.frames);
      setPageFaults(result.faults);
      setPageHits(result.hits);
      setReferenceHistory(result.history);
      setCurrentStep(nextStepIndex);
      
      // Save to history
      const newHistory = [...simulationHistory];
      newHistory[nextStepIndex] = result;
      setSimulationHistory(newHistory);
    }
  };

  const previousStep = () => {
    if (currentStep <= -1) return;
    
    const prevStepIndex = currentStep - 1;
    
    if (prevStepIndex === -1) {
      resetSimulation();
      return;
    }
    
    const prevState = simulationHistory[prevStepIndex];
    if (prevState) {
      setFrames(prevState.frames);
      setPageFaults(prevState.faults);
      setPageHits(prevState.hits);
      setReferenceHistory(prevState.history);
      setCurrentStep(prevStepIndex);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < -1 || stepIndex >= pageReferences.length) return;
    
    if (stepIndex === -1) {
      resetSimulation();
      return;
    }
    
    // Simulate from beginning to target step
    let currentFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      loaded: false,
      highlight: false
    }));
    let currentFaults = 0;
    let currentHits = 0;
    let currentHistory: { page: number; fault: boolean }[] = [];
    
    for (let i = 0; i <= stepIndex; i++) {
      const result = simulateStep(i, currentFrames, currentFaults, currentHits, currentHistory);
      if (result) {
        currentFrames = result.frames;
        currentFaults = result.faults;
        currentHits = result.hits;
        currentHistory = result.history;
      }
    }
    
    setFrames(currentFrames);
    setPageFaults(currentFaults);
    setPageHits(currentHits);
    setReferenceHistory(currentHistory);
    setCurrentStep(stepIndex);
  };

  const togglePlayPause = () => {
    if (currentStep >= pageReferences.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const fastForward = () => {
    goToStep(pageReferences.length - 1);
  };

  const rewind = () => {
    resetSimulation();
  };

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
                      <Button onClick={handleAddReference} className="rounded-l-none bg-drona-green hover:bg-drona-green/90">Add</Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Simulation Speed</Label>
                    <div className="mt-2">
                      <Slider 
                        value={[speed]} 
                        onValueChange={(value) => setSpeed(value[0])}
                        min={0.5} 
                        max={3} 
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-drona-gray mt-1">
                        <span>0.5x</span>
                        <span>{speed}x</span>
                        <span>3x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Controls */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Playback Controls</CardTitle>
                <CardDescription>Control the simulation flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={rewind}
                      disabled={currentStep === -1}
                      className="flex-1"
                    >
                      <Rewind className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={previousStep}
                      disabled={currentStep <= -1}
                      className="flex-1"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={togglePlayPause}
                      disabled={pageReferences.length === 0}
                      className="flex-1 bg-drona-green hover:bg-drona-green/90"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={nextStep}
                      disabled={currentStep >= pageReferences.length - 1}
                      className="flex-1"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={fastForward}
                      disabled={currentStep >= pageReferences.length - 1}
                      className="flex-1"
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

                  {pageReferences.length > 0 && (
                    <div>
                      <Label>Step: {currentStep + 1} of {pageReferences.length}</Label>
                      <Slider 
                        value={[currentStep + 1]} 
                        onValueChange={(value) => goToStep(value[0] - 1)}
                        min={0} 
                        max={pageReferences.length}
                        step={1}
                        className="w-full mt-2"
                      />
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
                      <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                        {pageReferences.map((page, idx) => (
                          <Badge 
                            key={idx}
                            variant={idx === currentStep ? "default" : "outline"}
                            className={cn(
                              "transition-all duration-200",
                              idx === currentStep ? "bg-drona-green scale-110" : "",
                              idx < currentStep ? "opacity-60" : ""
                            )}
                          >
                            {page}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Memory Frames</h3>
                      <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
                        {frames.map((frame, idx) => (
                          <div 
                            key={frame.id} 
                            className={cn(
                              "border-2 rounded-lg p-6 flex items-center justify-center transition-all duration-300 min-h-[80px]", 
                              frame.highlight ? "bg-drona-green/10 border-drona-green shadow-lg transform scale-105" : "bg-white border-gray-200"
                            )}
                          >
                            <div className="text-center">
                              <div className="font-medium text-sm text-gray-500 mb-1">Frame {idx}</div>
                              {frame.page !== null ? (
                                <div className={cn("text-3xl font-bold", frame.highlight ? "text-drona-green" : "text-gray-700")}>
                                  {frame.page}
                                </div>
                              ) : (
                                <div className="text-gray-400 text-2xl">Empty</div>
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
                        MRU (Most Recently Used) is a page replacement algorithm that removes the page that was most recently accessed. This is counter-intuitive compared to LRU, but can be optimal in certain access patterns where the most recently used page is unlikely to be accessed again soon.
                      </p>
                      <p className="text-drona-gray">
                        When a page fault occurs and all frames are occupied, the algorithm selects the page that was accessed most recently for replacement.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function MRU_PageReplacement(referenceString, frameCount):
    frames = create empty array of size frameCount
    accessTime = create empty map
    pageFaults = 0
    currentTime = 0
    
    for each page in referenceString:
        if page is not in frames:
            if frames is full:
                // Find most recently used page
                mostRecentTime = -1
                victimPage = null
                
                for each framePage in frames:
                    if accessTime[framePage] > mostRecentTime:
                        mostRecentTime = accessTime[framePage]
                        victimPage = framePage
                    endif
                endfor
                
                remove victimPage from frames
            endif
            
            add page to frames
            pageFaults++
        endif
        
        accessTime[page] = currentTime++
    endfor
    
    return pageFaults`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Characteristics</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Use Cases</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Sequential access patterns where recently accessed pages won't be needed soon</li>
                        <li>One-time sequential scans of large datasets</li>
                        <li>Situations where temporal locality is inverse (anti-locality)</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Limitations</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Counter-intuitive behavior - removes recently used pages</li>
                        <li>Poor performance with typical locality of reference patterns</li>
                        <li>Not commonly used in practice for general-purpose systems</li>
                        <li>Requires tracking of access times for all pages</li>
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
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> for each page reference, where n is the number of frames.
                      </p>
                      <p className="text-drona-gray">
                        Unlike FIFO, MRU requires scanning all frames to find the most recently used page during replacement, making it slower than simpler algorithms.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of page frames.
                      </p>
                      <p className="text-drona-gray">
                        Requires additional space to track access times or recency information for each page in memory.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Comparison with Other Algorithms</h3>
                      <p className="text-drona-gray mb-4">
                        MRU typically performs worse than LRU and FIFO for most workloads due to its counter-intuitive replacement strategy.
                      </p>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">When MRU might be better</h4>
                        <p className="text-sm text-drona-gray mb-2">
                          Consider a sequential scan through a large database:
                        </p>
                        <p className="text-sm text-drona-gray">
                          Reference pattern: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12...
                          <br />
                          With 3 frames, once frames are full, the most recently accessed page is least likely to be accessed again in this sequential pattern.
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
