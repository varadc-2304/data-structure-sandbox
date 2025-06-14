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
    if (!isPlaying) return;
    
    if (currentStep >= sstfOrder.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

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
      
      setRequestQueue(prev => [...prev, ...newRequests]);
      setInputPosition("");
    } catch (error) {
      console.error("Invalid position format or out of range");
    }
  };

  const calculateSSTFOrder = (requests: DiskRequest[], startPosition: number): number[] => {
    const order: number[] = [];
    const unprocessed = [...requests];
    let currentPos = startPosition;
    
    while (unprocessed.length > 0) {
      let minDistance = Infinity;
      let closestIndex = -1;
      let closestOriginalIndex = -1;
      
      unprocessed.forEach((req, idx) => {
        const distance = Math.abs(currentPos - req.position);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
          closestOriginalIndex = requests.findIndex(r => r.position === req.position && !order.includes(requests.indexOf(r)));
        }
      });
      
      if (closestIndex !== -1) {
        order.push(closestOriginalIndex);
        currentPos = unprocessed[closestIndex].position;
        unprocessed.splice(closestIndex, 1);
      }
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
    
    const nextStepIndex = currentStep + 1;
    const nextRequestIndex = sstfOrder[nextStepIndex];
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
      processed: sstfOrder.slice(0, nextStepIndex + 1).includes(idx),
      current: idx === nextRequestIndex
    }));
    setRequestQueue(updatedRequests);
    
    setCurrentStep(nextStepIndex);
    
    if (nextStepIndex >= sstfOrder.length - 1) {
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
    
    const newHeadPosition = newStep === -1 ? initialHeadPosition : requestQueue[sstfOrder[newStep]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: sstfOrder.slice(0, newStep + 1).includes(idx),
      current: newStep >= 0 && sstfOrder[newStep] === idx
    }));
    setRequestQueue(updatedRequests);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= sstfOrder.length) return;
    
    setCurrentStep(step);
    setIsPlaying(false);
    
    const newHeadPosition = step === -1 ? initialHeadPosition : requestQueue[sstfOrder[step]].position;
    setCurrentHeadPosition(newHeadPosition);
    
    // Recalculate seek history up to this step
    const newSeekHistory: { from: number; to: number; distance: number }[] = [];
    let headPos = initialHeadPosition;
    
    for (let i = 0; i <= step; i++) {
      const requestIndex = sstfOrder[i];
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
      processed: sstfOrder.slice(0, step + 1).includes(idx),
      current: step >= 0 && sstfOrder[step] === idx
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

  const calculatePosition = (position: number) => {
    return Math.min(Math.max((position / (diskSize - 1)) * 80, 0), 80);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/disk-scheduling" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Disk Scheduling
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SSTF Disk Scheduling</h1>
          <p className="text-gray-600">Visualize the Shortest Seek Time First disk scheduling algorithm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Disk Size:</label>
                  <Input
                    type="number"
                    min="100"
                    max="1000"
                    value={diskSize}
                    onChange={(e) => setDiskSize(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Head Position:</label>
                  <Input
                    type="number"
                    min="0"
                    max={diskSize - 1}
                    value={initialHeadPosition}
                    onChange={(e) => setInitialHeadPosition(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Request Positions:</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter positions (e.g., 50, 95, 180)"
                      value={inputPosition}
                      onChange={(e) => setInputPosition(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddRequest}>Add</Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Start'}
                  </Button>
                  <Button onClick={resetSimulation} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disk Visualization</CardTitle>
                <CardDescription>Visual representation of disk head movement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 bg-gray-100 rounded-lg p-4 mb-4">
                  {/* Disk track line */}
                  <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                  
                  {/* Scale markers */}
                  <div className="absolute top-1/2 left-8 right-8 flex justify-between transform -translate-y-1/2">
                    {[0, diskSize/4, diskSize/2, 3*diskSize/4, diskSize-1].map((pos, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="w-0.5 h-8 bg-gray-600"></div>
                        <span className="text-xs mt-1">{Math.round(pos)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current head position */}
                  <div 
                    className="absolute top-1/2 w-4 h-8 bg-green-600 rounded transform -translate-y-1/2 transition-all duration-1000 z-10"
                    style={{ 
                      left: `calc(2rem + ${calculatePosition(currentHeadPosition)}%)`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-green-600 text-white px-2 py-1 rounded">
                      {currentHeadPosition}
                    </div>
                  </div>
                  
                  {/* Request positions */}
                  {requestQueue.map((req, idx) => (
                    <div 
                      key={idx}
                      className={`absolute top-1/2 w-3 h-3 rounded-full transform -translate-y-1/2 transition-colors ${
                        req.processed ? 'bg-green-500' : req.current ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        left: `calc(2rem + ${calculatePosition(req.position)}%)`,
                      }}
                    >
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs">
                        {req.position}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">SSTF Order:</h3>
                  <div className="flex flex-wrap gap-2">
                    {sstfOrder.map((requestIndex, orderIndex) => (
                      <Badge 
                        key={orderIndex}
                        variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                        className={cn(
                          "text-sm px-3 py-1",
                          orderIndex === currentStep && "bg-green-500 text-white"
                        )}
                      >
                        {requestQueue[requestIndex]?.position}
                      </Badge>
                    ))}
                  </div>
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
                  <div className="text-2xl font-bold text-green-600">{totalSeekTime}</div>
                  <div className="text-sm text-gray-600">Total Seek Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Average Seek Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{currentHeadPosition}</div>
                  <div className="text-sm text-gray-600">Current Position</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p><strong>SSTF Algorithm:</strong></p>
                  <p>Selects the request that requires the least movement of the disk head from its current position.</p>
                  <p><strong>Time Complexity:</strong> O(n²)</p>
                  <p><strong>Space Complexity:</strong> O(n)</p>
                  <p><strong>Advantages:</strong> Better performance than FCFS, minimizes average seek time.</p>
                  <p><strong>Disadvantages:</strong> Can cause starvation for requests far from the head.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSTFVisualizer;
