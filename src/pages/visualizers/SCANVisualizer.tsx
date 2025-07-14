
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

const SCANVisualizer = () => {
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
  const [scanOrder, setScanOrder] = useState<(number | 'boundary')[]>([]);
  const [isMovingToEdge, setIsMovingToEdge] = useState<boolean>(false);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition, direction]);

  useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= scanOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, scanOrder.length, speed]);

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
      
      setRequestQueue(prev => [...prev, ...newRequests]);
      setInputPosition("");
    } catch (error) {
      console.error("Invalid position format or out of range");
    }
  };

  const calculateSCANOrder = (requests: DiskRequest[], startPosition: number, initialDirection: 'left' | 'right'): (number | 'boundary')[] => {
    const order: (number | 'boundary')[] = [];
    const sortedRequests = [...requests].sort((a, b) => a.position - b.position);
    
    const leftRequests = sortedRequests.filter(req => req.position < startPosition).reverse();
    const rightRequests = sortedRequests.filter(req => req.position > startPosition);
    
    if (initialDirection === 'right') {
      rightRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
      
      if (rightRequests.length > 0) {
        order.push('boundary');
      }
      
      leftRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
    } else {
      leftRequests.forEach(req => {
        const index = requests.findIndex(r => r.position === req.position);
        order.push(index);
      });
      
      if (leftRequests.length > 0) {
        order.push('boundary');
      }
      
      rightRequests.reverse().forEach(req => {
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
    setIsMovingToEdge(false);
    
    const resetRequests = requestQueue.map(req => ({
      ...req,
      processed: false,
      current: false
    }));
    setRequestQueue(resetRequests);
    
    if (resetRequests.length > 0) {
      const order = calculateSCANOrder(resetRequests, initialHeadPosition, direction);
      setScanOrder(order);
    } else {
      setScanOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateSCANOrder(requestQueue, initialHeadPosition, direction);
      setScanOrder(order);
    }
  }, [requestQueue, initialHeadPosition, direction]);

  const nextStep = () => {
    if (currentStep >= scanOrder.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    const nextItem = scanOrder[nextStepIndex];
    
    let targetPosition: number;
    let seekDistance: number;
    
    if (nextItem === 'boundary') {
      targetPosition = direction === 'right' ? diskSize - 1 : 0;
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
      setIsMovingToEdge(true);
    } else {
      const nextRequest = requestQueue[nextItem as number];
      targetPosition = nextRequest.position;
      seekDistance = Math.abs(currentHeadPosition - targetPosition);
      setIsMovingToEdge(false);
    }
    
    setSeekHistory(prev => [...prev, { 
      from: currentHeadPosition, 
      to: targetPosition, 
      distance: seekDistance 
    }]);
    
    setTotalSeekTime(prev => prev + seekDistance);
    setCurrentHeadPosition(targetPosition);
    
    if (nextItem !== 'boundary') {
      const updatedRequests = requestQueue.map((req, idx) => ({
        ...req,
        processed: scanOrder.slice(0, nextStepIndex + 1).filter(item => typeof item === 'number').includes(idx),
        current: idx === nextItem
      }));
      setRequestQueue(updatedRequests);
    }
    
    setCurrentStep(nextStepIndex);
    
    if (nextStepIndex >= scanOrder.length - 1) {
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
    
    const newHeadPosition = newStep === -1 ? initialHeadPosition : seekHistory[newStep].to;
    setCurrentHeadPosition(newHeadPosition);
    
    setIsMovingToEdge(newStep >= 0 && scanOrder[newStep] === 'boundary');
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: scanOrder.slice(0, newStep + 1).filter(item => typeof item === 'number').includes(idx),
      current: newStep >= 0 && scanOrder[newStep] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= scanOrder.length) return;
    
    setCurrentStep(step);
    setIsPlaying(false);
    
    let newHeadPosition = initialHeadPosition;
    let newSeekHistory: { from: number; to: number; distance: number }[] = [];
    
    for (let i = 0; i <= step; i++) {
      const item = scanOrder[i];
      let targetPosition: number;
      
      if (item === 'boundary') {
        targetPosition = direction === 'right' ? diskSize - 1 : 0;
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
    setIsMovingToEdge(step >= 0 && scanOrder[step] === 'boundary');
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: scanOrder.slice(0, step + 1).filter(item => typeof item === 'number').includes(idx),
      current: step >= 0 && scanOrder[step] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= scanOrder.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const calculatePosition = (position: number) => {
    return Math.min(Math.max((position / (diskSize - 1)) * 80, 0), 80);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-4">
          <Link to="/dashboard/disk-scheduling" className="flex items-center text-drona-green hover:underline mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Disk Scheduling
          </Link>
          <h1 className="text-3xl font-bold text-drona-dark">SCAN Disk Scheduling</h1>
          <p className="text-drona-gray">SCAN (Elevator) disk scheduling algorithm visualization</p>
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
                        <SelectItem value="left">Left (0)</SelectItem>
                        <SelectItem value="right">Right ({diskSize - 1})</SelectItem>
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
                        disabled={scanOrder.length === 0}
                        className="bg-drona-green hover:bg-drona-green/90 flex items-center justify-center"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToStep(scanOrder.length - 1)}
                        className="flex items-center justify-center"
                      >
                        <FastForward className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={nextStep} 
                        disabled={currentStep >= scanOrder.length - 1}
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
                  
                  {scanOrder.length > 0 && (
                    <div className="space-y-2">
                      <Label>Step: {currentStep + 1} of {scanOrder.length}</Label>
                      <Slider
                        value={[currentStep + 1]}
                        onValueChange={([value]) => goToStep(value - 1)}
                        max={scanOrder.length}
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
                    <CardTitle>SCAN Disk Scheduling Visualization</CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {scanOrder.length}
                      {isMovingToEdge && (
                        <Badge className="ml-2 bg-blue-500">Moving to Edge</Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-4">Disk Track Visualization</h3>
                      <div className="relative bg-gradient-to-r from-drona-light to-white rounded-xl border-2 border-drona-green/20 p-6 overflow-hidden" style={{ minHeight: "180px" }}>
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-12 right-12 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 shadow-inner"></div>
                        
                        {/* Direction indicator */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                          <span className="text-sm font-medium text-drona-gray">Direction:</span>
                          <Badge variant="outline" className="bg-drona-green/10 text-drona-green border-drona-green">
                            {direction === 'right' ? '→' : '←'} {direction.toUpperCase()}
                          </Badge>
                        </div>
                        
                        {/* Scale markers */}
                        <div className="absolute top-1/2 left-12 right-12 flex justify-between items-center transform -translate-y-1/2">
                          {[0, Math.floor(diskSize / 4), Math.floor(diskSize / 2), Math.floor(3 * diskSize / 4), diskSize - 1].map(pos => (
                            <div key={pos} className="flex flex-col items-center">
                              <div className="w-1 h-8 bg-drona-green rounded-full mb-3"></div>
                              <span className="text-xs font-bold text-drona-dark bg-white px-2 py-1 rounded-full shadow-sm border">{pos}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-1/2 w-6 h-16 bg-gradient-to-b from-drona-green to-drona-green/80 rounded-full transform -translate-y-1/2 z-20 shadow-lg border-2 border-white transition-all duration-1000 ease-in-out"
                          style={{ 
                            left: `calc(3rem + ${calculatePosition(currentHeadPosition)}%)`,
                          }}
                        >
                          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm font-bold text-drona-green bg-white px-3 py-1 rounded-full shadow-md border whitespace-nowrap">
                            Head: {currentHeadPosition}
                          </div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        
                        {/* Initial head position indicator (if different) */}
                        {initialHeadPosition !== currentHeadPosition && (
                          <div 
                            className="absolute top-1/2 w-2 h-12 bg-gray-400 rounded transform -translate-y-1/2 z-10 opacity-60"
                            style={{ 
                              left: `calc(3rem + ${calculatePosition(initialHeadPosition)}%)`,
                            }}
                          >
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap bg-white px-2 py-1 rounded shadow">
                              Start: {initialHeadPosition}
                            </div>
                          </div>
                        )}
                        
                        {/* Request positions */}
                        {requestQueue.map((req, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border-3 transition-all duration-500 z-15",
                              req.processed ? "bg-drona-green border-white shadow-lg scale-110" : "bg-white border-drona-green shadow-md",
                              req.current && "ring-4 ring-drona-green/50 scale-125 animate-pulse"
                            )}
                            style={{ 
                              left: `calc(3rem + ${calculatePosition(req.position)}%)`
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
                      <h3 className="text-sm font-medium text-drona-gray mb-2">SCAN Order</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {scanOrder.map((item, orderIndex) => (
                          <Badge 
                            key={orderIndex}
                            variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                            className={cn(
                              "text-sm px-3 py-1",
                              orderIndex === currentStep && "bg-drona-green text-white"
                            )}
                          >
                            {item === 'boundary' ? (direction === 'right' ? diskSize - 1 : 0) : requestQueue[item as number]?.position}
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
                                  idx === currentStep && 'bg-drona-green/10'
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
                    <CardTitle>SCAN Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>SCAN (Elevator Algorithm)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        SCAN works like an elevator. The disk arm starts at one end and moves toward the other end, servicing requests along the way until it reaches the other end of the disk, then reverses direction.
                      </p>
                      <p className="text-drona-gray">
                        The head continues to move in its current direction until it reaches the boundary, serving all requests in that direction before reversing.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function SCAN_DiskScheduling(requestQueue, initialHeadPosition, direction):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    
    sort requestQueue by position
    
    if direction == "right":
        // Service requests to the right
        for each request >= currentHeadPosition:
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
        endfor
        
        // Go to end of disk
        seekTime = abs(currentHeadPosition - (diskSize - 1))
        totalSeekTime += seekTime
        currentHeadPosition = diskSize - 1
        
        // Service remaining requests (to the left)
        for each request < initialHeadPosition (in reverse order):
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
        endfor
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
                        <li>Eliminates starvation - all requests are eventually served</li>
                        <li>Provides better response time than FCFS and SSTF</li>
                        <li>Simple to implement and understand</li>
                        <li>Uniform wait times</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Longer seek times for requests just missed by the head</li>
                        <li>Unnecessary movement to disk boundaries even if no requests exist there</li>
                        <li>More seek time compared to optimized algorithms like C-SCAN</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding SCAN performance characteristics</CardDescription>
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
                        SCAN provides better performance than FCFS and SSTF, with uniform wait times and no starvation.
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

export default SCANVisualizer;
