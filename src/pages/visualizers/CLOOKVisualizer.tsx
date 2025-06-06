import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, SkipBack, FastForward, Rewind } from 'lucide-react';
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

interface DiskRequest {
  position: number;
  processed: boolean;
  current: boolean;
}

const CLOOKVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<{ from: number; to: number; distance: number }[]>([]);
  const [clookOrder, setClookOrder] = useState<(number | 'jump')[]>([]);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

  useEffect(() => {
    if (!isPlaying || currentStep >= clookOrder.length - 1) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, clookOrder.length, speed]);

  const handleAddRequest = () => {
    if (!inputPosition.trim()) return;
    
    try {
      const newPositions = inputPosition
        .split(/[,\s]+/)
        .filter(Boolean)
        .map(pos => {
          const parsedPos = parseInt(pos.trim());
          if (isNaN(parsedPos) || parsedPos < 0 || parsedPos >= diskSize) {
            throw new Error('Invalid position');
          }
          return parsedPos;
        });
      
      const newRequests = newPositions.map(position => ({
        position,
        processed: false,
        current: false
      }));
      
      setRequestQueue([...requestQueue, ...newRequests]);
      setInputPosition("");
    } catch (error) {
      console.error("Invalid position format or out of range");
    }
  };

  const calculateCLOOKOrder = (requests: DiskRequest[], startPosition: number): (number | 'jump')[] => {
    const order: (number | 'jump')[] = [];
    const sortedRequests = [...requests].sort((a, b) => a.position - b.position);
    
    const rightRequests = sortedRequests.filter(req => req.position >= startPosition);
    const leftRequests = sortedRequests.filter(req => req.position < startPosition);
    
    // Service requests to the right first
    rightRequests.forEach(req => {
      const index = requests.findIndex(r => r.position === req.position);
      order.push(index);
    });
    
    // If there are requests to the left, add a jump and then service them
    if (leftRequests.length > 0 && rightRequests.length > 0) {
      order.push('jump');
    }
    
    leftRequests.forEach(req => {
      const index = requests.findIndex(r => r.position === req.position);
      order.push(index);
    });
    
    return order;
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setSeekHistory([]);
    setCurrentHeadPosition(initialHeadPosition);
    
    const resetRequests = requestQueue.map(req => ({
      ...req,
      processed: false,
      current: false
    }));
    setRequestQueue(resetRequests);
    
    if (resetRequests.length > 0) {
      const order = calculateCLOOKOrder(resetRequests, initialHeadPosition);
      setClookOrder(order);
    } else {
      setClookOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateCLOOKOrder(requestQueue, initialHeadPosition);
      setClookOrder(order);
    }
  }, [requestQueue, initialHeadPosition]);

  const nextStep = () => {
    if (currentStep >= clookOrder.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStep = currentStep + 1;
    const nextItem = clookOrder[nextStep];
    
    let targetPosition: number;
    let seekDistance: number;
    
    if (nextItem === 'jump') {
      // Jump to the smallest request position
      const leftRequests = requestQueue.filter(req => req.position < initialHeadPosition);
      targetPosition = Math.min(...leftRequests.map(req => req.position));
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
    } else {
      const nextRequest = requestQueue[nextItem as number];
      targetPosition = nextRequest.position;
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
    }
    
    setSeekHistory(prev => [...prev, { 
      from: currentHeadPosition, 
      to: targetPosition, 
      distance: seekDistance 
    }]);
    
    setTotalSeekTime(prev => prev + seekDistance);
    setCurrentHeadPosition(targetPosition);
    
    if (nextItem !== 'jump') {
      const updatedRequests = requestQueue.map((req, idx) => ({
        ...req,
        processed: clookOrder.slice(0, nextStep + 1).filter(item => typeof item === 'number').includes(idx),
        current: idx === nextItem
      }));
      setRequestQueue(updatedRequests);
    }
    
    setCurrentStep(nextStep);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    const newSeekHistory = seekHistory.slice(0, newStep + 1);
    setSeekHistory(newSeekHistory);
    
    const newTotalSeekTime = newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0);
    setTotalSeekTime(newTotalSeekTime);
    
    const newHeadPosition = newStep === -1 ? initialHeadPosition : seekHistory[newStep].to;
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: clookOrder.slice(0, newStep + 1).filter(item => typeof item === 'number').includes(idx),
      current: newStep >= 0 && clookOrder[newStep] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= clookOrder.length) return;
    
    setCurrentStep(step);
    setIsPlaying(false);
    
    // Recalculate state for the target step
    let newHeadPosition = initialHeadPosition;
    let newSeekHistory: { from: number; to: number; distance: number }[] = [];
    
    for (let i = 0; i <= step; i++) {
      const item = clookOrder[i];
      let targetPosition: number;
      
      if (item === 'jump') {
        const leftRequests = requestQueue.filter(req => req.position < initialHeadPosition);
        targetPosition = Math.min(...leftRequests.map(req => req.position));
      } else {
        targetPosition = requestQueue[item as number].position;
      }
      
      const seekDistance = Math.abs(newHeadPosition - targetPosition);
      newSeekHistory.push({
        from: newHeadPosition,
        to: targetPosition,
        distance: seekDistance
      });
      
      newHeadPosition = targetPosition;
    }
    
    setSeekHistory(newSeekHistory);
    setTotalSeekTime(newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0));
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: clookOrder.slice(0, step + 1).filter(item => typeof item === 'number').includes(idx),
      current: step >= 0 && clookOrder[step] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= clookOrder.length - 1) {
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
          <Link to="/disk-scheduling" className="flex items-center text-drona-green hover:underline mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Disk Scheduling
          </Link>
          <h1 className="text-3xl font-bold text-drona-dark">C-LOOK Disk Scheduling</h1>
          <p className="text-drona-gray">Circular LOOK disk scheduling algorithm visualization</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>Set up the disk scheduling simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="diskSize">Disk Size</Label>
                    <Input
                      id="diskSize"
                      type="number"
                      min={100}
                      max={1000}
                      value={diskSize}
                      onChange={(e) => setDiskSize(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="initialHeadPosition">Initial Head Position</Label>
                    <Input
                      id="initialHeadPosition"
                      type="number"
                      min={0}
                      max={diskSize - 1}
                      value={initialHeadPosition}
                      onChange={(e) => setInitialHeadPosition(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Request Position</Label>
                    <div className="flex mt-1">
                      <Input
                        id="position"
                        placeholder="e.g., 50, 95, 180"
                        value={inputPosition}
                        onChange={(e) => setInputPosition(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddRequest()}
                        className="rounded-r-none"
                      />
                      <Button onClick={handleAddRequest} className="rounded-l-none">Add</Button>
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
                    <div className="grid grid-cols-5 gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={prevStep} 
                        disabled={currentStep <= -1}
                        className="flex items-center justify-center"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToStep(-1)}
                        className="flex items-center justify-center"
                      >
                        <Rewind className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm"
                        onClick={togglePlayPause}
                        disabled={clookOrder.length === 0}
                        className="bg-drona-green hover:bg-drona-green/90 flex items-center justify-center"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToStep(clookOrder.length - 1)}
                        className="flex items-center justify-center"
                      >
                        <FastForward className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={nextStep} 
                        disabled={currentStep >= clookOrder.length - 1}
                        className="flex items-center justify-center"
                      >
                        <SkipForward className="h-4 w-4" />
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
                  
                  {clookOrder.length > 0 && (
                    <div className="space-y-2">
                      <Label>Step: {currentStep + 1} of {clookOrder.length}</Label>
                      <Slider
                        value={[currentStep + 1]}
                        onValueChange={([value]) => goToStep(value - 1)}
                        max={clookOrder.length}
                        min={0}
                        step={1}
                        className="w-full"
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Total Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">{totalSeekTime} cylinders</p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Average Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">
                      {seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : '0'} cylinders
                    </p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Current Head Position</p>
                    <p className="text-2xl font-bold text-drona-dark">{currentHeadPosition}</p>
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
                    <CardTitle>C-LOOK Disk Scheduling Visualization</CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {clookOrder.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-4">Disk Visualization</h3>
                      <div className="relative bg-drona-light rounded-lg border-2 border-gray-200 p-8 overflow-hidden" style={{ minHeight: "200px" }}>
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-16 right-16 h-1 bg-gray-400 rounded transform -translate-y-1/2"></div>
                        
                        {/* Scale markers */}
                        <div className="absolute top-1/2 left-16 right-16 flex justify-between items-center transform -translate-y-1/2">
                          {[0, Math.floor(diskSize / 4), Math.floor(diskSize / 2), Math.floor(3 * diskSize / 4), diskSize - 1].map(pos => (
                            <div key={pos} className="flex flex-col items-center">
                              <div className="w-0.5 h-6 bg-gray-500 mb-2"></div>
                              <span className="text-xs text-gray-600 font-medium">{pos}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Initial head position indicator */}
                        <div 
                          className="absolute top-1/2 w-1 h-10 bg-gray-500 rounded transform -translate-y-1/2"
                          style={{ 
                            left: `calc(4rem + ${Math.min(Math.max((initialHeadPosition / (diskSize - 1)) * (100 - 8), 0), 100 - 8)}%)`,
                            transform: 'translateY(-50%) translateX(-50%)'
                          }}
                        >
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                            Start: {initialHeadPosition}
                          </div>
                        </div>
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-1/2 w-3 h-12 bg-drona-green rounded transform -translate-y-1/2 transition-all duration-500 z-10"
                          style={{ 
                            left: `calc(4rem + ${Math.min(Math.max((currentHeadPosition / (diskSize - 1)) * (100 - 8), 0), 100 - 8)}%)`,
                            transform: 'translateY(-50%) translateX(-50%)'
                          }}
                        >
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-sm font-bold text-drona-green whitespace-nowrap">
                            Head: {currentHeadPosition}
                          </div>
                        </div>
                        
                        {/* Request positions */}
                        {requestQueue.map((req, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300",
                              req.processed ? "bg-drona-green border-drona-green" : "bg-white border-gray-400",
                              req.current && "ring-4 ring-drona-green ring-opacity-50 scale-125"
                            )}
                            style={{ 
                              left: `calc(4rem + ${Math.min(Math.max((req.position / (diskSize - 1)) * (100 - 8), 0), 100 - 8)}%)`
                            }}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
                              {req.position}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">C-LOOK Order</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {clookOrder.map((item, orderIndex) => (
                          <Badge 
                            key={orderIndex}
                            variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                            className={orderIndex === currentStep ? "bg-drona-green" : ""}
                          >
                            {item === 'jump' ? "➥" : requestQueue[item as number]?.position}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Seek Operations</h3>
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                        {seekHistory.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">No operations yet</div>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-drona-light">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Step</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">From</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">To</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Distance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seekHistory.map((seek, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                  <td className="px-4 py-2 text-sm">{seek.from}</td>
                                  <td className="px-4 py-2 text-sm">{seek.to}</td>
                                  <td className="px-4 py-2 text-sm">{seek.distance} cylinders</td>
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
                    <CardTitle>C-LOOK Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>Circular LOOK Algorithm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        C-LOOK is an improved version of LOOK where the disk arm serves requests only in one direction (typically right) and when it reaches the last request in that direction, it jumps to the lowest position and starts moving in the same direction again.
                      </p>
                      <p className="text-drona-gray">
                        This provides more uniform wait times compared to LOOK, as the longest waiting time is reduced.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function CLOOK_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    
    sort requestQueue by position
    
    // Service requests to the right of head position
    for each request >= currentHeadPosition:
        seekTime = abs(currentHeadPosition - request.position)
        totalSeekTime += seekTime
        currentHeadPosition = request.position
    endfor
    
    // If there are requests to the left, jump to lowest position
    if any requests < initialHeadPosition:
        lowestRequest = min position in requestQueue
        seekTime = abs(currentHeadPosition - lowestRequest)
        totalSeekTime += seekTime
        currentHeadPosition = lowestRequest
        
        // Continue servicing requests from lowest to below initial position
        for each request < initialHeadPosition (in ascending order):
            if request.position > lowestRequest:
                seekTime = abs(currentHeadPosition - request.position)
                totalSeekTime += seekTime
                currentHeadPosition = request.position
            endif
        endfor
    endif
    
    return totalSeekTime`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>More uniform wait times than LOOK and SCAN</li>
                        <li>Better seek time performance than C-SCAN</li>
                        <li>No unnecessary movements like in SCAN and C-SCAN</li>
                        <li>Eliminates starvation</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>More complex to implement than simpler algorithms</li>
                        <li>Large jumps can occur when moving from highest to lowest request</li>
                        <li>Performance depends on request distribution</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding C-LOOK performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n log n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        The time complexity is dominated by the sorting of requests by their positions.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        Space is needed to store and sort the request positions.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Average Performance</h3>
                      <p className="text-drona-gray mb-4">
                        C-LOOK generally provides the best performance among disk scheduling algorithms, with more uniform wait times and reduced seek overhead.
                      </p>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">Performance Comparison</h4>
                        <p className="text-sm text-drona-gray mb-2">
                          Relative performance ranking (from worst to best):
                        </p>
                        <ol className="list-decimal pl-5 text-sm text-drona-gray">
                          <li>FCFS (First-Come-First-Served)</li>
                          <li>SSTF (Shortest Seek Time First)</li>
                          <li>SCAN (Elevator)</li>
                          <li>C-SCAN (Circular SCAN)</li>
                          <li>LOOK and C-LOOK</li>
                        </ol>
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

export default CLOOKVisualizer;
