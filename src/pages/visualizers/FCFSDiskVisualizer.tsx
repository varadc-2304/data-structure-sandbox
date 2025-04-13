
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

interface DiskRequest {
  position: number;
  processed: boolean;
  current: boolean;
}

const FCFSDiskVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // seconds
  const [seekHistory, setSeekHistory] = useState<{ from: number; to: number; distance: number }[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Initialize simulation
  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Handle play/pause
  useEffect(() => {
    if (!isPlaying || currentStep >= requestQueue.length - 1) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, requestQueue.length, speed]);

  const handleAddRequest = () => {
    if (!inputPosition.trim()) return;
    
    try {
      // Parse comma-separated values or space-separated values
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
      
      addLog(`Added ${newPositions.length} requests: ${newPositions.join(', ')}`);
    } catch (error) {
      console.error("Invalid position format or out of range");
      addLog("Error: Invalid position format or out of range");
    }
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
    
    addLog("Simulation reset");
  };

  const nextStep = () => {
    if (currentStep >= requestQueue.length - 1) {
      setIsPlaying(false);
      return;
    }
    
    const nextStep = currentStep + 1;
    const nextRequest = requestQueue[nextStep];
    
    // Calculate seek distance
    const seekDistance = Math.abs(currentHeadPosition - nextRequest.position);
    
    // Update history
    setSeekHistory([
      ...seekHistory,
      { 
        from: currentHeadPosition, 
        to: nextRequest.position, 
        distance: seekDistance 
      }
    ]);
    
    // Update total seek time
    setTotalSeekTime(prev => prev + seekDistance);
    
    // Update head position
    setCurrentHeadPosition(nextRequest.position);
    
    // Update request as processed
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: idx <= nextStep,
      current: idx === nextStep
    }));
    setRequestQueue(updatedRequests);
    
    // Update current step
    setCurrentStep(nextStep);
    
    addLog(`Disk head moved from ${currentHeadPosition} to ${nextRequest.position} (distance: ${seekDistance})`);
  };

  const prevStep = () => {
    if (currentStep <= 0) {
      return;
    }
    
    const prevStep = currentStep - 1;
    
    // Get the previous seek operation from history
    const prevSeek = seekHistory[prevStep];
    
    // Update total seek time
    setTotalSeekTime(prev => prev - prevSeek.distance);
    
    // Update head position
    setCurrentHeadPosition(prevSeek.from);
    
    // Update request queue
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: idx <= prevStep,
      current: idx === prevStep
    }));
    setRequestQueue(updatedRequests);
    
    // Update history
    setSeekHistory(seekHistory.slice(0, -1));
    
    // Update current step
    setCurrentStep(prevStep);
    
    addLog(`Reversed: Disk head moved back from ${prevSeek.to} to ${prevSeek.from}`);
  };

  const togglePlayPause = () => {
    if (currentStep >= requestQueue.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
      addLog(isPlaying ? "Simulation paused" : "Simulation started");
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
          <h1 className="text-3xl font-bold text-drona-dark">FCFS Disk Scheduling</h1>
          <p className="text-drona-gray">First-Come-First-Served disk scheduling algorithm visualization</p>
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
                      <Button onClick={handleAddRequest} className="bg-drona-green hover:bg-drona-green/90 rounded-l-none">Add</Button>
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
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetSimulation}
                      className="flex items-center justify-center"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button 
                      className="bg-drona-green hover:bg-drona-green/90 flex items-center justify-center" 
                      onClick={togglePlayPause}
                      disabled={requestQueue.length === 0}
                    >
                      {isPlaying ? (
                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                      ) : (
                        <><Play className="mr-2 h-4 w-4" /> {currentStep >= requestQueue.length - 1 ? 'Restart' : 'Play'}</>
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep <= 0}
                      className="flex items-center justify-center"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={nextStep}
                      disabled={currentStep >= requestQueue.length - 1}
                      className="flex items-center justify-center"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
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
                    <CardTitle>FCFS Disk Scheduling Visualization</CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {requestQueue.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Disk Visualization</h3>
                      <div className="relative h-16 bg-drona-light rounded-lg overflow-hidden mb-4">
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400"></div>
                        
                        {/* Initial head position */}
                        <div 
                          className="absolute top-0 h-full w-0.5 bg-gray-500"
                          style={{ left: `${(initialHeadPosition / diskSize) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                            Start: {initialHeadPosition}
                          </div>
                        </div>
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-0 h-full w-1 bg-drona-green transition-all duration-500"
                          style={{ left: `${(currentHeadPosition / diskSize) * 100}%` }}
                        >
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-drona-green whitespace-nowrap">
                            Head: {currentHeadPosition}
                          </div>
                        </div>
                        
                        {/* Request positions */}
                        {requestQueue.map((req, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full",
                              req.processed ? "bg-drona-green/60" : "bg-gray-400",
                              req.current && "ring-2 ring-drona-green ring-offset-1"
                            )}
                            style={{ left: `${(req.position / diskSize) * 100}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                              {req.position}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-drona-gray mt-6">
                        <span>0</span>
                        <span>{Math.floor(diskSize / 4)}</span>
                        <span>{Math.floor(diskSize / 2)}</span>
                        <span>{Math.floor(3 * diskSize / 4)}</span>
                        <span>{diskSize - 1}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Request Queue</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {requestQueue.map((request, idx) => (
                          <Badge 
                            key={idx}
                            variant={request.current ? "default" : request.processed ? "secondary" : "outline"}
                            className={request.current ? "bg-drona-green" : ""}
                          >
                            {request.position}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
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
                    
                    {/* Log box */}
                    <div>
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Operation Log</h3>
                      <ScrollArea className="h-32 w-full border border-gray-200 rounded-lg">
                        {logs.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">No logs yet</div>
                        ) : (
                          <div className="p-2">
                            {logs.map((log, idx) => (
                              <div key={idx} className="py-1 px-2 text-sm border-b border-gray-100 last:border-b-0">
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="algorithm">
                <Card>
                  <CardHeader>
                    <CardTitle>FCFS Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>First-Come-First-Served Disk Scheduling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        FCFS is the simplest disk scheduling algorithm. In this algorithm, the disk requests are serviced strictly in the order they arrive, regardless of the location on the disk.
                      </p>
                      <p className="text-drona-gray">
                        The disk head simply moves to the locations in the request queue one by one, without any optimization for seek time.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function FCFS_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    
    for each request in requestQueue:
        seekDistance = abs(currentHeadPosition - request.position)
        totalSeekTime = totalSeekTime + seekDistance
        currentHeadPosition = request.position
    endfor
    
    return totalSeekTime`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Simple to understand and implement</li>
                        <li>Fair to all requests - no starvation</li>
                        <li>Low overhead - just need to maintain a queue</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Does not optimize for seek time or disk arm movement</li>
                        <li>Can lead to long average seek times</li>
                        <li>Poor performance with random request patterns</li>
                        <li>Generally performs worse than most other disk scheduling algorithms</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding FCFS performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        The FCFS algorithm processes each request exactly once in the order they arrive, resulting in linear time complexity.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        The space required is proportional to the number of requests in the queue.
                      </p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Average Performance</h3>
                      <p className="text-drona-gray mb-4">
                        FCFS generally exhibits poor performance compared to other disk scheduling algorithms. The average seek time can be very high, especially with random request patterns.
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

export default FCFSDiskVisualizer;
