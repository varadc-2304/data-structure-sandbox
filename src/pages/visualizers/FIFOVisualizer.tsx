
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PageFrame {
  id: number;
  page: number | null;
  loaded: boolean;
  highlight: boolean;
}

const FIFOVisualizer = () => {
  const [pageReferences, setPageReferences] = useState<number[]>([]);
  const [inputReference, setInputReference] = useState<string>("");
  const [framesCount, setFramesCount] = useState<number>(3);
  const [frames, setFrames] = useState<PageFrame[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [pageFaults, setPageFaults] = useState<number>(0);
  const [pageHits, setPageHits] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // seconds
  const [referenceHistory, setReferenceHistory] = useState<{ page: number; fault: boolean }[]>([]);

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
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, pageReferences.length, speed]);

  const handleAddReference = () => {
    if (!inputReference.trim()) return;
    
    try {
      // Parse comma-separated values or space-separated values
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
    
    const resetFrames = Array(framesCount).fill(null).map((_, index) => ({
      id: index,
      page: null,
      loaded: false,
      highlight: false
    }));
    setFrames(resetFrames);
  };

  const nextStep = () => {
    if (currentStep >= pageReferences.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStep = currentStep + 1;
    const pageRef = pageReferences[nextStep];
    
    // Check if page is already in frames (page hit)
    const pageInFrames = frames.some(frame => frame.page === pageRef);
    
    // Create copy of frames for modification
    let newFrames = frames.map(frame => ({ ...frame, highlight: false }));
    
    if (pageInFrames) {
      // Page hit - just highlight the frame
      newFrames = newFrames.map(frame => 
        frame.page === pageRef ? { ...frame, highlight: true } : frame
      );
      setPageHits(prev => prev + 1);
    } else {
      // Page fault - replace using FIFO
      const oldestFrameIndex = frames.findIndex(frame => !frame.loaded) !== -1 
        ? frames.findIndex(frame => !frame.loaded) 
        : 0;  // If all frames are loaded, replace the first one (FIFO)
      
      newFrames[oldestFrameIndex] = {
        ...newFrames[oldestFrameIndex],
        page: pageRef,
        loaded: true,
        highlight: true
      };
      
      // Shift the FIFO queue
      if (frames.every(frame => frame.loaded)) {
        // Move the replaced frame to the end of the queue by rotating the array
        newFrames = [
          ...newFrames.slice(1),
          newFrames[0]
        ];
      }
      
      setPageFaults(prev => prev + 1);
    }
    
    setFrames(newFrames);
    setCurrentStep(nextStep);
    setReferenceHistory([...referenceHistory, { page: pageRef, fault: !pageInFrames }]);
  };

  const togglePlayPause = () => {
    if (currentStep >= pageReferences.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
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
          <h1 className="text-3xl font-bold text-drona-dark">FIFO Page Replacement</h1>
          <p className="text-drona-gray">First-In-First-Out page replacement algorithm visualization</p>
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
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={resetSimulation}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button 
                      className="flex-1 bg-drona-green hover:bg-drona-green/90" 
                      onClick={togglePlayPause}
                      disabled={pageReferences.length === 0}
                    >
                      {isPlaying ? (
                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                      ) : (
                        <><Play className="mr-2 h-4 w-4" /> {currentStep >= pageReferences.length - 1 ? 'Restart' : 'Play'}</>
                      )}
                    </Button>
                  </div>
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
                    <CardTitle>FIFO Visualization</CardTitle>
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
                    <CardTitle>FIFO Algorithm</CardTitle>
                    <CardDescription>First-In-First-Out Page Replacement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        FIFO is the simplest page replacement algorithm. In this algorithm, the operating system keeps track of all pages in the memory in a queue, with the oldest page at the front and the most recent page at the rear.
                      </p>
                      <p className="text-drona-gray">
                        When a page needs to be replaced, the oldest page is selected. This is the page that was brought into memory first among all pages currently in memory.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function FIFO_PageReplacement(referenceString, frameCount):
    frames = create empty array of size frameCount
    queue = create empty queue
    pageFaults = 0
    
    for each page in referenceString:
        if page is not in frames:
            if frames is full:
                victimPage = queue.dequeue()
                remove victimPage from frames
            endif
            
            add page to frames
            queue.enqueue(page)
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
                        <li>Simple to understand and implement</li>
                        <li>Low overhead - just need to maintain a queue</li>
                        <li>No need to keep track of when a page was last used</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Does not consider page usage frequency or recency</li>
                        <li>May remove frequently used pages just because they are the oldest</li>
                        <li>Suffers from Belady's Anomaly - increasing frames can sometimes increase page faults</li>
                        <li>Generally performs worse than more sophisticated algorithms like LRU</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding FIFO performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(1)</span> for each page reference lookup and replacement operation.
                      </p>
                      <p className="text-drona-gray">
                        The FIFO algorithm maintains a simple queue data structure. Both lookups to check if a page is in memory and replacement operations when a page fault occurs take constant time.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of page frames.
                      </p>
                      <p className="text-drona-gray">
                        The space required is proportional to the number of page frames in memory. We need to maintain both the frames and the queue tracking the order of page loading.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Belady's Anomaly</h3>
                      <p className="text-drona-gray mb-4">
                        FIFO is subject to Belady's Anomaly, which is the phenomenon where increasing the number of page frames can sometimes increase the number of page faults.
                      </p>
                      <p className="text-drona-gray mb-4">
                        This counterintuitive behavior occurs because with more frames, pages that would be reused soon could be kept longer in memory with fewer frames due to the specific access pattern.
                      </p>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">Example of Belady's Anomaly</h4>
                        <p className="text-sm text-drona-gray mb-2">
                          Consider the reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5
                        </p>
                        <p className="text-sm text-drona-gray">
                          With 3 frames: 9 page faults<br />
                          With 4 frames: 10 page faults
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

export default FIFOVisualizer;
