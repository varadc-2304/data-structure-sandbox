
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DiskRequest {
  position: number;
  processed: boolean;
  current: boolean;
}

const CLOOKVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<{ from: number; to: number; distance: number }[]>([]);
  const [clookOrder, setClookOrder] = useState<number[]>([]);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition, direction]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= clookOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

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

  const calculateCLOOKOrder = (requests: DiskRequest[], startPosition: number, initialDirection: 'left' | 'right'): number[] => {
    const order: number[] = [];
    const sortedRequests = [...requests].sort((a, b) => a.position - b.position);
    
    if (initialDirection === 'right') {
      // Service requests to the right (including current position)
      const rightRequests = sortedRequests.filter(req => req.position >= startPosition);
      rightRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
      
      // Service remaining requests from the beginning
      const leftRequests = sortedRequests.filter(req => req.position < startPosition);
      leftRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
    } else {
      // Service requests to the left (including current position)
      const leftRequests = sortedRequests.filter(req => req.position <= startPosition).reverse();
      leftRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
      
      // Service remaining requests from the end
      const rightRequests = sortedRequests.filter(req => req.position > startPosition).reverse();
      rightRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
    }
    
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
      const order = calculateCLOOKOrder(resetRequests, initialHeadPosition, direction);
      setClookOrder(order);
    } else {
      setClookOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateCLOOKOrder(requestQueue, initialHeadPosition, direction);
      setClookOrder(order);
    }
  }, [requestQueue, initialHeadPosition, direction]);

  const nextStep = () => {
    if (currentStep >= clookOrder.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    const nextRequestIndex = clookOrder[nextStepIndex];
    const nextRequest = requestQueue[nextRequestIndex];
    
    const seekDistance = Math.abs(currentHeadPosition - nextRequest.position);
    
    setSeekHistory(prev => [...prev, { 
      from: currentHeadPosition, 
      to: nextRequest.position, 
      distance: seekDistance 
    }]);
    
    setTotalSeekTime(prev => prev + seekDistance);
    setCurrentHeadPosition(nextRequest.position);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: clookOrder.slice(0, nextStepIndex + 1).includes(idx),
      current: idx === nextRequestIndex
    }));
    setRequestQueue(updatedRequests);
    
    setCurrentStep(nextStepIndex);
    
    if (nextStepIndex >= clookOrder.length - 1) {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    const newSeekHistory = seekHistory.slice(0, newStep + 1);
    setSeekHistory(newSeekHistory);
    
    const newTotalSeekTime = newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0);
    setTotalSeekTime(newTotalSeekTime);
    
    const newHeadPosition = newStep === -1 ? initialHeadPosition : requestQueue[clookOrder[newStep]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: clookOrder.slice(0, newStep + 1).includes(idx),
      current: newStep >= 0 && clookOrder[newStep] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= clookOrder.length) return;
    
    setCurrentStep(step);
    setIsPlaying(false);
    
    const newHeadPosition = step === -1 ? initialHeadPosition : requestQueue[clookOrder[step]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    // Recalculate seek history up to this step
    const newSeekHistory: { from: number; to: number; distance: number }[] = [];
    let headPos = initialHeadPosition;
    
    for (let i = 0; i <= step; i++) {
      const requestIndex = clookOrder[i];
      const targetPosition = requestQueue[requestIndex].position;
      const seekDistance = Math.abs(headPos - targetPosition);
      newSeekHistory.push({
        from: headPos,
        to: targetPosition,
        distance: seekDistance
      });
      headPos = targetPosition;
    }
    
    setSeekHistory(newSeekHistory);
    setTotalSeekTime(newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0));
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: clookOrder.slice(0, step + 1).includes(idx),
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

  const calculatePosition = (position: number) => {
    const percentage = (position / (diskSize - 1)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getScaleMarkers = () => {
    const markers = [];
    const steps = 5;
    for (let i = 0; i < steps; i++) {
      const position = Math.round((i / (steps - 1)) * (diskSize - 1));
      markers.push(position);
    }
    return markers;
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
                    <Label>Initial Direction</Label>
                    <Select value={direction} onValueChange={(value: 'left' | 'right') => setDirection(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep <= -1}>
                        <SkipBack className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => goToStep(-1)}>
                        <Rewind className="h-3 w-3" />
                      </Button>
                      <Button 
                        className="flex-1 bg-drona-green hover:bg-drona-green/90" 
                        onClick={togglePlayPause}
                        disabled={clookOrder.length === 0}
                      >
                        {isPlaying ? (
                          <><Pause className="mr-2 h-4 w-4" /> Pause</>
                        ) : (
                          <><Play className="mr-2 h-4 w-4" /> {currentStep >= clookOrder.length - 1 ? 'Restart' : 'Play'}</>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => goToStep(clookOrder.length - 1)}>
                        <FastForward className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= clookOrder.length - 1}>
                        <SkipForward className="h-3 w-3" />
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
                      <h3 className="text-sm font-medium text-drona-gray mb-4">Disk Track Visualization</h3>
                      <div className="relative bg-gradient-to-r from-drona-light to-white rounded-xl border-2 border-drona-green/20 p-6 overflow-hidden" style={{ minHeight: "180px" }}>
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-8 right-8 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 shadow-inner"></div>
                        
                        {/* Direction indicator */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <span className="text-sm font-medium text-drona-gray">Direction:</span>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                            {direction === 'right' ? '→' : '←'} C-LOOK {direction.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {/* Scale markers */}
                        <div className="absolute top-1/2 left-8 right-8 flex justify-between items-center transform -translate-y-1/2">
                          {getScaleMarkers().map(pos => (
                            <div key={pos} className="flex flex-col items-center">
                              <div className="w-1 h-8 bg-drona-green rounded-full mb-3"></div>
                              <span className="text-xs font-bold text-drona-dark bg-white px-2 py-1 rounded-full shadow-sm border">{pos}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-1/2 w-6 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full transform -translate-y-1/2 transition-all duration-700 ease-out z-20 shadow-lg border-2 border-white"
                          style={{ 
                            left: `calc(2rem + ${calculatePosition(currentHeadPosition)}% * (100% - 4rem) / 100)`,
                            transform: 'translateY(-50%) translateX(-50%)'
                          }}
                        >
                          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-md border whitespace-nowrap">
                            Head: {currentHeadPosition}
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        
                        {/* Request positions */}
                        {requestQueue.map((req, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-3 transition-all duration-500 z-15",
                              req.processed ? "bg-purple-500 border-white shadow-lg scale-110" : "bg-white border-purple-400 shadow-md",
                              req.current && "ring-4 ring-purple-400/50 scale-125 animate-pulse"
                            )}
                            style={{ 
                              left: `calc(2rem + ${calculatePosition(req.position)}% * (100% - 4rem) / 100)`
                            }}
                          >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap bg-drona-dark text-white px-2 py-1 rounded shadow">
                              {req.position}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">C-LOOK Order</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {clookOrder.map((requestIndex, orderIndex) => (
                          <Badge 
                            key={orderIndex}
                            variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                            className={cn(
                              "text-sm px-3 py-1",
                              orderIndex === currentStep && "bg-purple-500 text-white"
                            )}
                          >
                            {requestQueue[requestIndex]?.position}
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
                            <thead className="bg-drona-light sticky top-0">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Step</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">From</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">To</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Distance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seekHistory.map((seek, idx) => (
                                <tr key={idx} className={cn(
                                  "transition-colors",
                                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                  idx === currentStep && 'bg-purple-100'
                                )}>
                                  <td className="px-4 py-2 text-sm font-medium">{idx + 1}</td>
                                  <td className="px-4 py-2 text-sm">{seek.from}</td>
                                  <td className="px-4 py-2 text-sm">{seek.to}</td>
                                  <td className="px-4 py-2 text-sm font-medium">{seek.distance} cylinders</td>
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
                        C-LOOK (Circular LOOK) combines the advantages of both C-SCAN and LOOK. Like LOOK, it only moves as far as the last request in each direction, and like C-SCAN, it provides more uniform service times.
                      </p>
                      <p className="text-drona-gray">
                        It services requests in one direction until the last request, then jumps directly to the first request in the opposite direction without going to the disk boundary.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function CLOOK_DiskScheduling(requestQueue, initialHeadPosition, direction):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    
    sort requestQueue by position
    
    if direction == "right":
        // Service requests to the right (including current position)
        for each request >= currentHeadPosition:
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
        endfor
        
        // Jump directly to the first remaining request
        if there are requests < initialHeadPosition:
            firstRequest = first request < initialHeadPosition
            seekTime = abs(currentHeadPosition - firstRequest.position)
            totalSeekTime += seekTime
            currentHeadPosition = firstRequest.position
            
            // Service remaining requests in order
            for each remaining request:
                seekTime = abs(currentHeadPosition - request.position)
                totalSeekTime += seekTime
                currentHeadPosition = request.position
            endfor
        endif
    else:
        // Similar logic for left direction
    endif
    
    return totalSeekTime`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Combines benefits of both LOOK and C-SCAN</li>
                        <li>Most efficient seek time among all algorithms</li>
                        <li>Uniform wait times like C-SCAN</li>
                        <li>No unnecessary movement to disk boundaries</li>
                        <li>Best overall performance</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Most complex algorithm to implement</li>
                        <li>Requires sorting and careful track of current direction</li>
                        <li>Overhead may not be justified for simple systems</li>
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
                        C-LOOK typically provides the best overall performance among all disk scheduling algorithms, combining efficiency with fairness.
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
                          <li>LOOK and C-LOOK (Best)</li>
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
