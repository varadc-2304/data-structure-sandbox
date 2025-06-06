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

const SSTFVisualizer = () => {
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
  const [sstfOrder, setSstfOrder] = useState<number[]>([]);

  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

  useEffect(() => {
    if (!isPlaying || currentStep >= sstfOrder.length - 1) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, sstfOrder.length, speed]);

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

  const calculateSSTFOrder = (requests: DiskRequest[], startPosition: number): number[] => {
    const order: number[] = [];
    const remaining = [...requests];
    let currentPos = startPosition;

    while (remaining.length > 0) {
      let minDistance = Infinity;
      let closestIndex = 0;

      remaining.forEach((req, index) => {
        const distance = Math.abs(currentPos - req.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      const closest = remaining[closestIndex];
      order.push(requests.findIndex(req => req.position === closest.position && !order.includes(requests.findIndex(r => r === req))));
      currentPos = closest.position;
      remaining.splice(closestIndex, 1);
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
      const order = calculateSSTFOrder(resetRequests, initialHeadPosition);
      setSstfOrder(order);
    } else {
      setSstfOrder([]);
    }
  };

  useEffect(() => {
    if (requestQueue.length > 0) {
      const order = calculateSSTFOrder(requestQueue, initialHeadPosition);
      setSstfOrder(order);
    }
  }, [requestQueue, initialHeadPosition]);

  const nextStep = () => {
    if (currentStep >= sstfOrder.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStep = currentStep + 1;
    const nextRequestIndex = sstfOrder[nextStep];
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
      processed: sstfOrder.slice(0, nextStep + 1).includes(idx),
      current: idx === nextRequestIndex
    }));
    setRequestQueue(updatedRequests);
    
    setCurrentStep(nextStep);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    const newSeekHistory = seekHistory.slice(0, newStep);
    setSeekHistory(newSeekHistory);
    
    const newTotalSeekTime = newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0);
    setTotalSeekTime(newTotalSeekTime);
    
    const newHeadPosition = newStep === -1 ? initialHeadPosition : requestQueue[sstfOrder[newStep]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: sstfOrder.slice(0, newStep + 1).includes(idx),
      current: newStep >= 0 && idx === sstfOrder[newStep]
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= sstfOrder.length) return;
    
    setCurrentStep(step);
    setIsPlaying(false);
    
    const newSeekHistory = seekHistory.slice(0, step + 1);
    setSeekHistory(newSeekHistory);
    
    const newTotalSeekTime = newSeekHistory.reduce((sum, seek) => sum + seek.distance, 0);
    setTotalSeekTime(newTotalSeekTime);
    
    const newHeadPosition = step === -1 ? initialHeadPosition : requestQueue[sstfOrder[step]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: sstfOrder.slice(0, step + 1).includes(idx),
      current: step >= 0 && idx === sstfOrder[step]
    }));
    setRequestQueue(updatedRequests);
  };

  const togglePlayPause = () => {
    if (currentStep >= sstfOrder.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Calculate scale markers based on the current diskSize
  const getScaleMarkers = () => {
    const markers = [0];
    const count = 5; // Number of markers to display
    
    for (let i = 1; i < count - 1; i++) {
      markers.push(Math.round((i / (count - 1)) * diskSize));
    }
    
    markers.push(diskSize - 1);
    return markers;
  };

  // Calculate position as percentage for visual elements
  const calculatePosition = (position: number) => {
    return (position / (diskSize - 1)) * 100;
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
          <h1 className="text-3xl font-bold text-drona-dark">SSTF Disk Scheduling</h1>
          <p className="text-drona-gray">Shortest Seek Time First disk scheduling algorithm visualization</p>
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
                        disabled={requestQueue.length === 0}
                        className="bg-drona-green hover:bg-drona-green/90 flex items-center justify-center"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => goToStep(sstfOrder.length - 1)}
                        className="flex items-center justify-center"
                      >
                        <FastForward className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={nextStep} 
                        disabled={currentStep >= sstfOrder.length - 1}
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
                  
                  {sstfOrder.length > 0 && (
                    <div className="space-y-2">
                      <Label>Step: {currentStep + 1} of {sstfOrder.length}</Label>
                      <Slider
                        value={[currentStep + 1]}
                        onValueChange={([value]) => goToStep(value - 1)}
                        max={sstfOrder.length}
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
                    <CardTitle>SSTF Disk Scheduling Visualization</CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {sstfOrder.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-4">Disk Visualization</h3>
                      <div className="relative bg-drona-light rounded-lg border-2 border-gray-200 p-8" style={{ minHeight: "200px" }}>
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-10 right-10 h-1 bg-gray-400 rounded transform -translate-y-1/2"></div>
                        
                        {/* Scale markers */}
                        <div className="absolute top-1/2 left-10 right-10 flex justify-between items-center transform -translate-y-1/2">
                          {getScaleMarkers().map(pos => (
                            <div key={pos} className="flex flex-col items-center">
                              <div className="w-0.5 h-6 bg-gray-500 mb-2"></div>
                              <span className="text-xs text-gray-600 font-medium">{pos}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Initial head position indicator */}
                        {initialHeadPosition !== currentHeadPosition && (
                          <div 
                            className="absolute top-1/2 w-1 h-10 bg-gray-500 rounded transform -translate-y-1/2"
                            style={{ 
                              left: `calc(10% + ${calculatePosition(initialHeadPosition)}%)`,
                              transform: 'translateY(-50%)'
                            }}
                          >
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                              Start: {initialHeadPosition}
                            </div>
                          </div>
                        )}
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-1/2 w-3 h-12 bg-drona-green rounded transform -translate-y-1/2 transition-all duration-500 z-10"
                          style={{ 
                            left: `calc(10% + ${calculatePosition(currentHeadPosition)}%)`,
                            transform: 'translateY(-50%)'
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
                              left: `calc(10% + ${calculatePosition(req.position)}%)` 
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
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Request Order (SSTF)</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {sstfOrder.map((requestIndex, orderIndex) => (
                          <Badge 
                            key={orderIndex}
                            variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                            className={orderIndex === currentStep ? "bg-drona-green" : ""}
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
                    <CardTitle>SSTF Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>Shortest Seek Time First</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        SSTF selects the request with the minimum seek time from the current head position. This reduces the total seek time compared to FCFS.
                      </p>
                      <p className="text-drona-gray">
                        The algorithm continues to pick the closest unserviced request until all requests are processed.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function SSTF_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    remaining = copy(requestQueue)
    
    while remaining is not empty:
        minDistance = infinity
        closestRequest = null
        
        for each request in remaining:
            distance = abs(currentHeadPosition - request.position)
            if distance < minDistance:
                minDistance = distance
                closestRequest = request
        endfor
        
        totalSeekTime = totalSeekTime + minDistance
        currentHeadPosition = closestRequest.position
        remove closestRequest from remaining
    endwhile
    
    return totalSeekTime`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Better average response time than FCFS</li>
                        <li>Reduces total seek time</li>
                        <li>Simple to understand and implement</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Can cause starvation of requests far from current position</li>
                        <li>Not optimal - can lead to unnecessary back-and-forth movement</li>
                        <li>Performance depends on the distribution of requests</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding SSTF performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n²)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        For each request to be processed, the algorithm searches through all remaining requests to find the closest one.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        The space required is proportional to the number of requests to track which ones have been processed.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Average Performance</h3>
                      <p className="text-drona-gray mb-4">
                        SSTF generally performs better than FCFS but can still result in high variance in response times due to the possibility of starvation.
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

export default SSTFVisualizer;
