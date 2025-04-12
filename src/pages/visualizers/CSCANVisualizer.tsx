
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

interface DiskRequest {
  position: number;
  processed: boolean;
  current: boolean;
}

const CSCANVisualizer = () => {
  const [diskSize, setDiskSize] = useState<number>(200);
  const [initialHeadPosition, setInitialHeadPosition] = useState<number>(50);
  const [currentHeadPosition, setCurrentHeadPosition] = useState<number>(50);
  const [requestQueue, setRequestQueue] = useState<DiskRequest[]>([]);
  const [processedOrder, setProcessedOrder] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<{ from: number; to: number; distance: number }[]>([]);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [initialDirection, setInitialDirection] = useState<'up' | 'down'>('up');
  const [showJump, setShowJump] = useState<boolean>(false);

  // Initialize simulation
  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition, initialDirection]);

  // Handle play/pause
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed, requestQueue, direction, showJump]);

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
    } catch (error) {
      console.error("Invalid position format or out of range");
    }
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setSeekHistory([]);
    setCurrentHeadPosition(initialHeadPosition);
    setProcessedOrder([]);
    setDirection(initialDirection);
    setShowJump(false);
    
    const resetRequests = requestQueue.map(req => ({
      ...req,
      processed: false,
      current: false
    }));
    setRequestQueue(resetRequests);
  };

  const nextStep = () => {
    // Handle the wrap-around animation step
    if (showJump) {
      if (direction === 'up') {
        // Jump from end to beginning
        const seekDistance = currentHeadPosition + (diskSize - currentHeadPosition);
        setSeekHistory([...seekHistory, { from: currentHeadPosition, to: 0, distance: seekDistance }]);
        setTotalSeekTime(prev => prev + seekDistance);
        setCurrentHeadPosition(0);
        setShowJump(false);
      }
      return;
    }
    
    // Check if all requests are processed
    if (requestQueue.every(req => req.processed)) {
      setIsPlaying(false);
      return;
    }
    
    // Get unprocessed requests
    const unprocessedRequests = requestQueue.filter(req => !req.processed);
    
    if (unprocessedRequests.length === 0) {
      setIsPlaying(false);
      return;
    }
    
    // For C-SCAN, we only move in one direction (up in this case)
    // When we reach the end, we jump back to the beginning
    
    // Find next request according to C-SCAN algorithm
    let nextRequest: DiskRequest | null = null;
    let needsJump = false;
    
    if (direction === 'up') {
      // Find the closest request that is >= current head position
      const requestsAhead = unprocessedRequests.filter(req => req.position >= currentHeadPosition);
      
      if (requestsAhead.length > 0) {
        // Sort by position ascending
        requestsAhead.sort((a, b) => a.position - b.position);
        nextRequest = requestsAhead[0];
      } else {
        // Reached the end, need to jump to beginning and continue in the same direction
        needsJump = true;
        setShowJump(true);
        
        // When we execute the next step, we'll have jumped to position 0
        // and will process the request with the lowest position
        const lowestPositionRequest = [...unprocessedRequests].sort((a, b) => a.position - b.position)[0];
        nextRequest = lowestPositionRequest;
      }
    }
    
    if (needsJump) {
      // If we need to jump, we'll show an animation step of the head moving to the end of the disk
      // and then in the next step, we'll jump to the beginning
      const seekToEnd = diskSize - 1 - currentHeadPosition;
      setSeekHistory([...seekHistory, { from: currentHeadPosition, to: diskSize - 1, distance: seekToEnd }]);
      setCurrentHeadPosition(diskSize - 1);
      setTotalSeekTime(prev => prev + seekToEnd);
      return;
    }
    
    if (!nextRequest) {
      setIsPlaying(false);
      return;
    }
    
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
    const updatedRequests = requestQueue.map(req => ({
      ...req,
      processed: req.processed || req.position === nextRequest!.position,
      current: req.position === nextRequest!.position
    }));
    setRequestQueue(updatedRequests);
    
    // Add to processed order
    setProcessedOrder([...processedOrder, nextRequest]);
    
    // Update current step
    setCurrentStep(prev => prev + 1);
  };

  const togglePlayPause = () => {
    if (requestQueue.every(req => req.processed)) {
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
          <h1 className="text-3xl font-bold text-drona-dark">C-SCAN Disk Scheduling</h1>
          <p className="text-drona-gray">Circular SCAN disk scheduling algorithm visualization</p>
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
                    <div className="flex mt-1">
                      <Button 
                        variant="default"
                        className="w-full bg-drona-green hover:bg-drona-green/90"
                      >
                        Upward Only (→)
                      </Button>
                    </div>
                    <p className="text-xs text-drona-gray mt-1">C-SCAN only moves in one direction</p>
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
                      disabled={requestQueue.length === 0}
                    >
                      {isPlaying ? (
                        <><Pause className="mr-2 h-4 w-4" /> Pause</>
                      ) : (
                        <><Play className="mr-2 h-4 w-4" /> {requestQueue.every(req => req.processed) ? 'Restart' : 'Play'}</>
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
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Total Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">{totalSeekTime} cylinders</p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Average Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">
                      {seekHistory.length ? (totalSeekTime / processedOrder.length).toFixed(2) : '0'} cylinders
                    </p>
                  </div>
                  <div className="bg-drona-light p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm text-drona-gray">Current Head Position</p>
                      <p className="text-2xl font-bold text-drona-dark">{currentHeadPosition}</p>
                    </div>
                    <div className="bg-white px-3 py-1 rounded-full text-sm border">
                      Direction: Upward →
                    </div>
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
                    <CardTitle>C-SCAN Disk Scheduling Visualization</CardTitle>
                    <CardDescription>
                      Processed: {processedOrder.length} of {requestQueue.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Disk Visualization</h3>
                      <div className="relative h-16 bg-drona-light rounded-lg overflow-hidden mb-2">
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
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-drona-green">
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
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs">
                              {req.position}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-drona-gray">
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
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seekHistory.map((seek, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-4 py-2 text-sm">{idx + 1}</td>
                                  <td className="px-4 py-2 text-sm">{seek.from}</td>
                                  <td className="px-4 py-2 text-sm">{seek.to}</td>
                                  <td className="px-4 py-2 text-sm">{seek.distance} cylinders</td>
                                  <td className="px-4 py-2">
                                    {seek.from === diskSize - 1 && seek.to === 0 ? (
                                      <Badge variant="outline" className="border-drona-green text-drona-green">Jump</Badge>
                                    ) : (
                                      <Badge variant="outline">Seek</Badge>
                                    )}
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
                    <CardTitle>C-SCAN Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>Circular SCAN Algorithm</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        Circular SCAN (C-SCAN) is a variant of the SCAN algorithm that provides a more uniform wait time for sectors. Rather than reversing direction when it reaches the end of the disk, it jumps back to the beginning and continues in the same direction.
                      </p>
                      <p className="text-drona-gray">
                        This approach is like an elevator that only goes up and then returns to the ground floor to start over, rather than reversing its path to go back down.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function CSCAN_DiskScheduling(requestQueue, initialHeadPosition, diskSize):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    processedRequests = []
    remainingRequests = copy of requestQueue
    
    while remainingRequests is not empty:
        // Process all requests from current position to the end of disk
        sortedRequests = sort remainingRequests by position ascending
        nextRequests = filter sortedRequests where position >= currentHeadPosition
        
        for each request in nextRequests:
            seekDistance = abs(currentHeadPosition - request.position)
            totalSeekTime = totalSeekTime + seekDistance
            currentHeadPosition = request.position
            processedRequests.append(request)
            remove request from remainingRequests
        endfor
        
        // If there are still requests remaining
        if remainingRequests is not empty:
            // Add seek time to the end of disk
            seekDistance = abs(currentHeadPosition - (diskSize - 1))
            totalSeekTime = totalSeekTime + seekDistance
            
            // Add seek time from the beginning to first request
            seekDistance = diskSize - 1  // Jump from end to beginning
            totalSeekTime = totalSeekTime + seekDistance
            currentHeadPosition = 0
            
            // Process all requests from the beginning
            sortedRequests = sort remainingRequests by position ascending
        endif
    endwhile
    
    return totalSeekTime, processedRequests`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>More uniform wait time compared to SCAN</li>
                        <li>Avoids the clustering effect at the center of the disk that SCAN can experience</li>
                        <li>Provides better throughput for high loads</li>
                        <li>More fair service across the disk</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Higher seek time compared to SCAN when the jumps are considered</li>
                        <li>More complex to implement than FCFS</li>
                        <li>Not as adaptive to localized workloads as SSTF</li>
                        <li>The cost of the jump is usually included in the total seek time</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>Understanding C-SCAN performance characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
                      <p className="text-drona-gray mb-4">
                        <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n log n)</span> where n is the number of disk requests.
                      </p>
                      <p className="text-drona-gray">
                        Like SCAN, the time complexity is dominated by sorting the requests, which is typically O(n log n). Processing the requests after sorting is O(n).
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
                      <h3 className="font-medium text-drona-dark mb-2">Comparison with SCAN</h3>
                      <p className="text-drona-gray mb-4">
                        C-SCAN provides more uniform waiting times compared to SCAN. In SCAN, requests at the edges of the disk can experience longer waiting times, while C-SCAN addresses this by treating the disk as a circular list.
                      </p>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">Real-world Applications</h4>
                        <p className="text-sm text-drona-gray">
                          C-SCAN is particularly effective in:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-drona-gray mt-2">
                          <li>Systems with evenly distributed disk requests</li>
                          <li>Environments where fairness in service time is important</li>
                          <li>High-traffic servers where minimizing maximum wait time is crucial</li>
                          <li>Systems where requests are frequently made to all areas of the disk</li>
                        </ul>
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

export default CSCANVisualizer;
