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
    }, 1500 / speed);

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
      
      setRequestQueue([...requestQueue, ...newRequests]);
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
    
    const nextStep = currentStep + 1;
    const nextItem = scanOrder[nextStep];
    
    let targetPosition: number;
    let seekDistance: number;
    
    if (nextItem === 'boundary') {
      targetPosition = direction === 'right' ? diskSize - 1 : 0;
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
    
    if (nextItem !== 'boundary') {
      const updatedRequests = requestQueue.map((req, idx) => ({
        ...req,
        processed: scanOrder.slice(0, nextStep + 1).filter(item => typeof item === 'number').includes(idx),
        current: idx === nextItem
      }));
      setRequestQueue(updatedRequests);
    }
    
    setCurrentStep(nextStep);
    
    if (nextStep >= scanOrder.length - 1) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/disk-scheduling" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Disk Scheduling
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SCAN Disk Scheduling</h1>
          <p className="text-gray-600">Visualize the SCAN (Elevator) disk scheduling algorithm</p>
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
                  <label className="block text-sm font-medium mb-2">Direction:</label>
                  <Select value={direction} onValueChange={(value: 'left' | 'right') => setDirection(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-2">
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
                    className="absolute top-1/2 w-4 h-8 bg-blue-600 rounded transform -translate-y-1/2 transition-all duration-1000 z-10"
                    style={{ 
                      left: `calc(2rem + ${calculatePosition(currentHeadPosition)}%)`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded">
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
                  <h3 className="text-sm font-medium mb-2">Processing Order:</h3>
                  <div className="flex flex-wrap gap-2">
                    {scanOrder.map((item, orderIndex) => (
                      <Badge 
                        key={orderIndex}
                        variant={orderIndex === currentStep ? "default" : orderIndex < currentStep ? "secondary" : "outline"}
                        className="text-sm"
                      >
                        {item === 'boundary' ? (direction === 'right' ? diskSize - 1 : 0) : requestQueue[item as number]?.position}
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
                  <div className="text-2xl font-bold text-blue-600">{totalSeekTime}</div>
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
                  <p><strong>SCAN Algorithm:</strong></p>
                  <p>Also known as the Elevator algorithm. The disk arm moves in one direction until it reaches the end, then reverses direction.</p>
                  <p><strong>Time Complexity:</strong> O(n log n)</p>
                  <p><strong>Space Complexity:</strong> O(1)</p>
                  <p><strong>Advantages:</strong> Eliminates starvation and provides uniform wait times.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCANVisualizer;
