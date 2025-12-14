import React, { useState } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SCANVisualization from "./scan/SCANVisualization";
import SCANAlgorithmInfo from "./scan/SCANAlgorithmInfo";
import { useSCANVisualizer } from "./scan/useSCANVisualizer";

const SCANVisualizer = () => {
  const {
    state: {
      diskSize,
      initialHeadPosition,
      direction,
      currentHeadPosition,
      requestQueue,
      inputPosition,
      currentStep,
      totalSeekTime,
      isPlaying,
      speed,
      seekHistory,
      scanOrder,
      isMovingToEdge,
    },
    actions: {
      setDiskSize,
      setInitialHeadPosition,
      setDirection,
      setInputPosition,
      setSpeed,
      handleAddRequest,
      generateRandomRequests,
      runSimulation,
      pauseSimulation,
      resumeSimulation,
      resetSimulation,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      calculatePosition,
    },
  } = useSCANVisualizer();

  const [numPositions, setNumPositions] = useState<string>("");

  const avgSeekTime = seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : "0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <Link to="/dashboard/disk-scheduling" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Disk Scheduling
          </Link>
          <div className="arena-chip mb-2 text-foreground">Disk Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SCAN (Elevator Algorithm)</h1>
          <p className="text-muted-foreground text-sm">Visualize the SCAN disk scheduling algorithm. The head moves in one direction serving requests until the end, then reverses direction.</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-fit justify-start bg-secondary p-1 h-auto">
            <TabsTrigger 
              value="visualizer" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger 
              value="algorithm" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Algorithm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Card className="bg-card rounded-2xl shadow-md p-4 border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="diskSize">Disk Size</Label>
                      <Input id="diskSize" type="number" min={100} max={1000} value={diskSize} onChange={(e) => setDiskSize(Number(e.target.value))} className="mt-1" />
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
                      <Label htmlFor="direction">Direction</Label>
                      <Select value={direction} onValueChange={(value) => setDirection(value as "left" | "right")}>
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
                      <Label htmlFor="numPositions">Number of Positions</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="numPositions"
                          type="number"
                          min={1}
                          max={50}
                          placeholder="e.g., 5"
                          value={numPositions}
                          onChange={(e) => setNumPositions(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && numPositions && generateRandomRequests(Number(numPositions))}
                          className="h-8 text-sm"
                        />
                        <Button 
                          onClick={() => {
                            if (numPositions) {
                              generateRandomRequests(Number(numPositions));
                              setNumPositions("");
                            }
                          }}
                          size="sm"
                          className="h-8"
                        >
                          Generate
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Enter number (1-50) to generate random positions</p>
                    </div>

                    <div>
                      <Label htmlFor="position">Request Position (Manual)</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="position"
                          placeholder="e.g., 50, 95, 180"
                          value={inputPosition}
                          onChange={(e) => setInputPosition(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddRequest()}
                          className="h-8 text-sm"
                        />
                        <Button onClick={handleAddRequest} size="sm" className="h-8">
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Simulation Speed</Label>
                      <div className="flex items-center mt-1">
                        <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-green-600" />
                        <span className="ml-2 text-sm text-green-600 font-medium">{speed}x</span>
                      </div>
                    </div>

                    {scanOrder.length > 0 && (
                      <div className="space-y-2">
                        <Label>
                          Step: {currentStep + 1} of {scanOrder.length}
                        </Label>
                        <Slider value={[currentStep + 1]} onValueChange={([value]) => goToStep(value - 1)} max={scanOrder.length} min={0} step={1} className="w-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-2xl shadow-md p-4 border border-border animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={runSimulation} variant="default" size="sm" disabled={requestQueue.length === 0 || isPlaying}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={pauseSimulation} variant="outline" disabled={requestQueue.length === 0 || !isPlaying} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={resumeSimulation} variant="outline" disabled={requestQueue.length === 0 || isPlaying || currentStep >= scanOrder.length - 1} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={resetSimulation} variant="outline" disabled={requestQueue.length === 0} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={prevStep} variant="outline" disabled={requestQueue.length === 0 || currentStep <= -1} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextStep} variant="outline" disabled={requestQueue.length === 0 || currentStep >= scanOrder.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                      <Timer className="mr-2 h-3 w-3 text-primary" />
                      <span className="text-foreground font-medium text-sm">
                        Step: {currentStep + 1} / {scanOrder.length || 1}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Disk Visualization</h3>
                <SCANVisualization
                  diskSize={diskSize}
                  initialHeadPosition={initialHeadPosition}
                  currentHeadPosition={currentHeadPosition}
                  requestQueue={requestQueue}
                  currentStep={currentStep}
                  scanOrder={scanOrder}
                  seekHistory={seekHistory}
                  direction={direction}
                  isMovingToEdge={isMovingToEdge}
                  calculatePosition={calculatePosition}
                />
                  </div>

                  {scanOrder.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Total Seek Time</p>
                          <p className="text-xl font-bold text-foreground">{totalSeekTime} cylinders</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Average Seek Time</p>
                          <p className="text-xl font-bold text-foreground">{avgSeekTime} cylinders</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {scanOrder.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Request Order</h3>
                      <div className="overflow-x-auto max-h-[150px]">
                        <table className="min-w-full divide-y divide-border text-sm">
                          <thead className="bg-secondary">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Position</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Seek Time</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {scanOrder.map((request, index) => (
                              <tr key={index} className={index <= currentStep ? "bg-primary/10" : "bg-card"}>
                                <td className="px-3 py-2 whitespace-nowrap">{request.position}</td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {index > 0 && index <= currentStep
                                    ? Math.abs(request.position - scanOrder[index - 1].position)
                                    : index === 0 && currentStep >= 0
                                    ? Math.abs(request.position - initialHeadPosition)
                                    : "-"}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {index <= currentStep ? "Completed" : index === currentStep + 1 ? "Processing" : "Pending"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-2xl shadow-md p-4 border border-border animate-scale-in text-sm" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">About SCAN Algorithm</h2>
                  <p className="text-muted-foreground mb-3 text-sm">SCAN (also known as the Elevator Algorithm) moves the disk head in one direction, serving all requests in that direction until the end, then reverses direction.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Provides uniform wait times</li>
                          <li>No starvation</li>
                          <li>Better than FCFS and SSTF</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Limitations</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>May move to edge unnecessarily</li>
                          <li>Not optimal for all workloads</li>
                          <li>Requires direction management</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
              </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
                <SCANAlgorithmInfo type="algorithm" />
              </TabsContent>
            </Tabs>
      </div>
    </div>
  );
};

export default SCANVisualizer;
