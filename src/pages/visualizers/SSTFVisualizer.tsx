
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Save, Download, Upload, HardDriveDownload, Sliders, PlusCircle, Trash2 } from 'lucide-react';
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";

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
  const [processedOrder, setProcessedOrder] = useState<DiskRequest[]>([]);
  const [inputPosition, setInputPosition] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [totalSeekTime, setTotalSeekTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [seekHistory, setSeekHistory] = useState<{ from: number; to: number; distance: number }[]>([]);
  const [showHeadPath, setShowHeadPath] = useState<boolean>(true);
  const [presets, setPresets] = useState<{name: string, requests: number[]}[]>([
    { name: "Random Light", requests: [34, 98, 125, 65, 22] },
    { name: "Random Heavy", requests: [12, 56, 128, 45, 92, 180, 150, 33] },
    { name: "Sequential", requests: [20, 40, 60, 80, 100, 120, 140, 160] },
    { name: "Scattered", requests: [10, 195, 45, 165, 80, 120] },
  ]);
  const [savedConfigurations, setSavedConfigurations] = useState<{name: string, diskSize: number, headPos: number, requests: number[]}[]>([]);
  const [newPresetName, setNewPresetName] = useState<string>("");

  // Initialize simulation
  useEffect(() => {
    resetSimulation();
  }, [initialHeadPosition]);

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
      
      toast({
        title: "Requests added",
        description: `Added ${newRequests.length} new disk requests.`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error adding requests",
        description: "Please check that all positions are valid numbers within disk size range.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setTotalSeekTime(0);
    setIsPlaying(false);
    setSeekHistory([]);
    setCurrentHeadPosition(initialHeadPosition);
    setProcessedOrder([]);
    
    const resetRequests = requestQueue.map(req => ({
      ...req,
      processed: false,
      current: false
    }));
    setRequestQueue(resetRequests);
  };

  const nextStep = () => {
    if (currentStep >= requestQueue.length - 1 || requestQueue.length === 0) {
      setIsPlaying(false);
      return;
    }
    
    // Find closest unprocessed request to current head position
    let closestRequestIndex = -1;
    let minDistance = Infinity;
    
    for (let i = 0; i < requestQueue.length; i++) {
      if (!requestQueue[i].processed) {
        const distance = Math.abs(currentHeadPosition - requestQueue[i].position);
        if (distance < minDistance) {
          minDistance = distance;
          closestRequestIndex = i;
        }
      }
    }
    
    if (closestRequestIndex === -1) {
      setIsPlaying(false);
      return;
    }
    
    const nextRequest = requestQueue[closestRequestIndex];
    
    // Update history
    setSeekHistory([
      ...seekHistory,
      { 
        from: currentHeadPosition, 
        to: nextRequest.position, 
        distance: minDistance 
      }
    ]);
    
    // Update total seek time
    setTotalSeekTime(prev => prev + minDistance);
    
    // Update head position
    setCurrentHeadPosition(nextRequest.position);
    
    // Update request as processed
    const updatedRequests = requestQueue.map((req, idx) => ({
      ...req,
      processed: req.processed || idx === closestRequestIndex,
      current: idx === closestRequestIndex
    }));
    setRequestQueue(updatedRequests);
    
    // Add to processed order
    setProcessedOrder([...processedOrder, nextRequest]);
    
    // Update current step
    setCurrentStep(currentStep + 1);
  };

  const togglePlayPause = () => {
    if (currentStep >= requestQueue.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const loadPreset = (preset: {name: string, requests: number[]}) => {
    const newRequests = preset.requests.map(position => ({
      position,
      processed: false,
      current: false
    }));
    
    setRequestQueue(newRequests);
    resetSimulation();
    
    toast({
      title: "Preset loaded",
      description: `Loaded preset: ${preset.name}`,
      duration: 2000,
    });
  };

  const saveCurrentConfig = () => {
    if (requestQueue.length === 0) {
      toast({
        title: "Cannot save",
        description: "Add some disk requests before saving a configuration",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const configName = prompt("Enter a name for this configuration");
    if (!configName) return;

    const newConfig = {
      name: configName,
      diskSize,
      headPos: initialHeadPosition,
      requests: requestQueue.map(req => req.position)
    };

    setSavedConfigurations([...savedConfigurations, newConfig]);
    
    toast({
      title: "Configuration saved",
      description: `Saved as: ${configName}`,
      duration: 2000,
    });
  };

  const loadSavedConfig = (config: {name: string, diskSize: number, headPos: number, requests: number[]}) => {
    setDiskSize(config.diskSize);
    setInitialHeadPosition(config.headPos);
    
    const newRequests = config.requests.map(position => ({
      position,
      processed: false,
      current: false
    }));
    
    setRequestQueue(newRequests);
    resetSimulation();
    
    toast({
      title: "Configuration loaded",
      description: `Loaded: ${config.name}`,
      duration: 2000,
    });
  };

  const addCustomPreset = () => {
    if (!newPresetName || requestQueue.length === 0) {
      toast({
        title: "Cannot create preset",
        description: "Please provide a name and have some requests in the queue",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    const newPreset = {
      name: newPresetName,
      requests: requestQueue.map(req => req.position)
    };
    
    setPresets([...presets, newPreset]);
    setNewPresetName("");
    
    toast({
      title: "Preset created",
      description: `Created preset: ${newPresetName}`,
      duration: 2000,
    });
  };

  const clearAllRequests = () => {
    if (requestQueue.length > 0) {
      setRequestQueue([]);
      resetSimulation();
      
      toast({
        title: "Queue cleared",
        description: "All disk requests have been removed",
        duration: 2000,
      });
    }
  };

  // Function to generate a demo
  const generateRandomRequests = (count = 8) => {
    const newRequests = Array.from({ length: count }, () => ({
      position: Math.floor(Math.random() * diskSize),
      processed: false,
      current: false
    }));
    
    setRequestQueue(newRequests);
    resetSimulation();
    
    toast({
      title: "Random requests generated",
      description: `Added ${count} random disk requests`,
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <div className="page-container pt-20">
        <div className="mb-4">
          <Link to="/disk-scheduling" className="flex items-center text-drona-green hover:underline mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Disk Scheduling
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-drona-green to-blue-600">SSTF Disk Scheduling</h1>
          <p className="text-drona-gray">Shortest Seek Time First disk scheduling algorithm visualization</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-t-4 border-t-drona-green shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-drona-green" />
                  Configuration
                </CardTitle>
                <CardDescription>Set up the disk scheduling simulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="diskSize">Disk Size</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <Slider 
                        id="diskSize" 
                        min={100} 
                        max={500} 
                        step={10} 
                        value={[diskSize]}
                        onValueChange={(value) => setDiskSize(value[0])}
                        className="flex-grow"
                      />
                      <span className="text-sm font-medium bg-drona-light px-2 py-1 rounded w-12 text-center">
                        {diskSize}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="initialHeadPosition">Initial Head Position</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <Slider 
                        id="initialHeadPosition" 
                        min={0} 
                        max={diskSize - 1} 
                        step={1}
                        value={[initialHeadPosition]}
                        onValueChange={(value) => setInitialHeadPosition(value[0])}
                        className="flex-grow"
                      />
                      <span className="text-sm font-medium bg-drona-light px-2 py-1 rounded w-12 text-center">
                        {initialHeadPosition}
                      </span>
                    </div>
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
                    <p className="text-xs text-drona-gray mt-1">Enter comma-separated values between 0 and {diskSize-1}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => generateRandomRequests(8)}
                      className="text-xs"
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Random Requests
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearAllRequests}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Clear All
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Simulation Speed</Label>
                      <span className="text-sm text-drona-gray">{speed}x</span>
                    </div>
                    <Slider 
                      min={0.5} 
                      max={5} 
                      step={0.5} 
                      value={[speed]} 
                      onValueChange={(value) => setSpeed(value[0])}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="showPath"
                      checked={showHeadPath}
                      onCheckedChange={setShowHeadPath}
                    />
                    <Label htmlFor="showPath" className="text-sm">Show head movement path</Label>
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
                        <><Play className="mr-2 h-4 w-4" /> {currentStep >= requestQueue.length - 1 ? 'Restart' : 'Play'}</>
                      )}
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Preset Scenarios</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <PlusCircle className="h-3 w-3 mr-1" /> Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Preset</DialogTitle>
                            <DialogDescription>
                              Save the current request pattern as a reusable preset
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="presetName">Preset Name</Label>
                              <Input 
                                id="presetName" 
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                                placeholder="e.g., My Custom Pattern" 
                              />
                            </div>
                            <Button onClick={addCustomPreset} className="w-full">
                              Create Preset
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((preset, idx) => (
                        <Button 
                          key={idx} 
                          variant="outline" 
                          size="sm"
                          className="text-xs justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                          onClick={() => loadPreset(preset)}
                          title={`Load ${preset.name}: ${preset.requests.join(', ')}`}
                        >
                          <HardDriveDownload className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={saveCurrentConfig}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save Config
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="h-3 w-3 mr-1" /> Load Config
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Saved Configurations</DialogTitle>
                          <DialogDescription>
                            Select a saved disk scheduling configuration
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[300px] overflow-y-auto py-4">
                          {savedConfigurations.length === 0 ? (
                            <div className="text-center p-4 text-gray-400">
                              No saved configurations
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {savedConfigurations.map((config, idx) => (
                                <Button 
                                  key={idx}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => loadSavedConfig(config)}
                                >
                                  <div className="truncate">
                                    <span className="font-medium">{config.name}</span>
                                    <span className="text-xs text-drona-gray ml-2">
                                      ({config.requests.length} requests)
                                    </span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-blue-600 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-blue-600" />
                  Statistics
                </CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Total Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">{totalSeekTime} cylinders</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Average Seek Time</p>
                    <p className="text-2xl font-bold text-drona-dark">
                      {seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : '0'} cylinders
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-drona-gray">Current Head Position</p>
                    <p className="text-2xl font-bold text-drona-dark">{currentHeadPosition}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="visualization" className="h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualization" className="h-full">
                <Card className="h-full shadow-sm">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center">
                      <HardDriveDownload className="h-5 w-5 mr-2 text-drona-green" />
                      SSTF Disk Scheduling Visualization
                    </CardTitle>
                    <CardDescription>
                      Step: {currentStep + 1} of {requestQueue.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Disk Visualization</h3>
                      <div className="relative h-20 bg-gradient-to-r from-drona-light to-blue-50 rounded-lg overflow-hidden mb-4 border border-gray-200">
                        {/* Disk track representation */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 z-10"></div>
                        
                        {/* Head path line representation */}
                        {showHeadPath && seekHistory.length > 0 && (
                          <svg className="absolute inset-0 w-full h-full z-20" overflow="visible">
                            <polyline
                              points={
                                [
                                  `${(initialHeadPosition / diskSize) * 100}%,50%`,
                                  ...seekHistory.map(seek => 
                                    `${(seek.to / diskSize) * 100}%,50%`
                                  )
                                ].join(' ')
                              }
                              fill="none"
                              stroke="rgba(34, 197, 94, 0.5)"
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                          </svg>
                        )}
                        
                        {/* Initial head position */}
                        <div 
                          className="absolute top-0 h-full w-1 bg-gray-500"
                          style={{ left: `${(initialHeadPosition / diskSize) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                            Start: {initialHeadPosition}
                          </div>
                        </div>
                        
                        {/* Current head position */}
                        <div 
                          className="absolute top-0 h-full w-1.5 bg-drona-green transition-all duration-500 z-30"
                          style={{ left: `${(currentHeadPosition / diskSize) * 100}%` }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-drona-green whitespace-nowrap">
                            Current Head: {currentHeadPosition}
                          </div>
                          {/* Top part of the disk head */}
                          <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-drona-green rounded-full border-2 border-white shadow-md"></div>
                          {/* Bottom part of the disk head */}
                          <div className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-drona-green rounded-full border-2 border-white shadow-md"></div>
                        </div>
                        
                        {/* Request positions */}
                        {requestQueue.map((req, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full z-25 transition-all duration-300",
                              req.processed ? "bg-drona-green/70" : "bg-gray-400/70",
                              req.current && "ring-2 ring-drona-green ring-offset-1 scale-125"
                            )}
                            style={{ 
                              left: `${(req.position / diskSize) * 100}%`,
                              boxShadow: req.current ? "0 0 8px rgba(34, 197, 94, 0.6)" : "none" 
                            }}
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
                            className={cn(
                              request.current && "bg-drona-green animate-pulse",
                              "transition-all duration-300"
                            )}
                          >
                            {request.position}
                          </Badge>
                        ))}
                        {requestQueue.length === 0 && (
                          <div className="text-sm text-gray-400 italic">No requests in queue. Add some using the configuration panel.</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-drona-gray mb-2">Seek Operations</h3>
                      <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg shadow-inner">
                        {seekHistory.length === 0 ? (
                          <div className="p-4 text-center text-gray-400">No operations yet</div>
                        ) : (
                          <table className="w-full">
                            <thead className="bg-drona-light sticky top-0 z-10">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Step</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">From</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">To</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Distance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {seekHistory.map((seek, idx) => (
                                <tr 
                                  key={idx} 
                                  className={cn(
                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                    idx === seekHistory.length - 1 && 'bg-drona-green/10'
                                  )}
                                >
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
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>SSTF Disk Scheduling Algorithm</CardTitle>
                    <CardDescription>Shortest Seek Time First Disk Scheduling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">How it works</h3>
                      <p className="text-drona-gray mb-4">
                        The Shortest Seek Time First (SSTF) algorithm selects the disk request that requires the least head movement from the current position.
                      </p>
                      <p className="text-drona-gray">
                        It prioritizes minimizing the seek time for each individual request, always choosing the closest request to process next.
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-drona-dark mb-2">Pseudocode</h3>
                      <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                        <pre className="font-mono text-sm">
{`function SSTF_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    processedRequests = []
    remainingRequests = copy of requestQueue
    
    while remainingRequests is not empty:
        // Find request with minimum seek time from current position
        minSeekTime = INFINITY
        nextRequest = null
        
        for each request in remainingRequests:
            seekTime = abs(currentHeadPosition - request.position)
            
            if seekTime < minSeekTime:
                minSeekTime = seekTime
                nextRequest = request
            endif
        endfor
        
        // Process the selected request
        totalSeekTime = totalSeekTime + minSeekTime
        currentHeadPosition = nextRequest.position
        processedRequests.append(nextRequest)
        remove nextRequest from remainingRequests
    endwhile
    
    return totalSeekTime, processedRequests`}
                        </pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-drona-dark mb-2">Advantages and Disadvantages</h3>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Advantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Better average response time than FCFS</li>
                        <li>Reduces total seek time compared to FCFS</li>
                        <li>Simple to understand and implement</li>
                        <li>Good for systems where minimizing seek time is a priority</li>
                      </ul>
                      
                      <h4 className="text-sm font-medium text-drona-green mt-4 mb-2">Disadvantages</h4>
                      <ul className="list-disc pl-5 text-drona-gray space-y-1">
                        <li>Can lead to starvation of some requests</li>
                        <li>Requests far from the head may wait indefinitely if new closer requests keep arriving</li>
                        <li>Not optimal for overall throughput in some cases</li>
                        <li>No predictable wait time for individual requests</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card className="shadow-sm">
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
                        For each request we process (n requests), we need to scan through all remaining requests (up to n) to find the closest one.
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
                      <h3 className="font-medium text-drona-dark mb-2">Comparison with Other Algorithms</h3>
                      <p className="text-drona-gray mb-4">
                        SSTF performs better than FCFS in terms of average seek time and total throughput, but it can lead to starvation of some requests. Scan-based algorithms like SCAN and C-SCAN are generally preferred in practical systems as they provide a better balance between performance and fairness.
                      </p>
                      
                      <div className="bg-drona-light p-4 rounded-lg mt-4">
                        <h4 className="text-sm font-medium text-drona-dark mb-2">Use Cases</h4>
                        <p className="text-sm text-drona-gray mb-2">
                          SSTF is particularly useful in:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-drona-gray">
                          <li>Systems with light to moderate loads</li>
                          <li>When average seek time is more important than fairness</li>
                          <li>Settings where request patterns tend to be clustered</li>
                          <li>When throughput is the primary concern</li>
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

export default SSTFVisualizer;
