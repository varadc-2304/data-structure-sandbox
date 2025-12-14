import React from "react";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TowerOfHanoiControls from "./tower-of-hanoi/TowerOfHanoiControls";
import TowerOfHanoiVisualization from "./tower-of-hanoi/TowerOfHanoiVisualization";
import { useTowerOfHanoiVisualizer } from "./tower-of-hanoi/useTowerOfHanoiVisualizer";
import PlaybackControls from "@/components/PlaybackControls";

const TowerOfHanoiVisualizer = () => {
  const towerNames = ["Source", "Auxiliary", "Destination"];
  
  const {
    state: {
      numDisks,
      towers,
      hanoiSteps,
      currentStep,
      isRunning,
      speed,
      movingDisk,
      fromTower,
      toTower,
      isInTransit,
      moves,
    },
    actions: {
      setNumDisks,
      setSpeed,
      generateTowers,
      resetTowers,
      startHanoi,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      setIsRunning,
    },
  } = useTowerOfHanoiVisualizer();

  const handleStart = () => {
    if (hanoiSteps.length === 0 && numDisks > 0) {
      startHanoi();
    } else if (hanoiSteps.length > 0) {
      // Toggle play/pause if steps exist
      if (isRunning) {
        setIsRunning(false);
      } else {
        setIsRunning(true);
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleResume = () => {
    if (hanoiSteps.length > 0 && currentStep < hanoiSteps.length - 1) {
      setIsRunning(true);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 pb-12">
        <div className="mb-6">
          <Link to="/dashboard/algorithms" className="inline-flex items-center text-primary hover:underline mb-4 font-medium transition-colors text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tower of Hanoi</h1>
          <p className="text-muted-foreground text-sm">Move all disks from the source tower to the destination tower using the auxiliary tower, following the rules.</p>
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
          <TowerOfHanoiControls
            numDisks={numDisks}
            speed={speed}
            currentStep={currentStep}
            stepsCount={hanoiSteps.length}
            isRunning={isRunning}
            moves={moves}
            onNumDisksChange={setNumDisks}
            onSpeedChange={setSpeed}
            onStartOrToggle={handleStart}
            onPrev={prevStep}
            onNext={nextStep}
            onFirst={() => goToStep(0)}
            onLast={() => goToStep(hanoiSteps.length - 1)}
            onGoToStep={goToStep}
            onReset={resetTowers}
          />
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-4">
                    <PlaybackControls
                      isRunning={isRunning}
                      currentStep={currentStep}
                      totalSteps={hanoiSteps.length}
                      onPlay={handleStart}
                      onPause={handlePause}
                      onResume={handleResume}
                      onReset={() => { resetTowers(); setIsRunning(false); }}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onFirst={() => goToStep(0)}
                      onLast={() => goToStep(hanoiSteps.length - 1)}
                      disabled={numDisks === 0}
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    {hanoiSteps.length > 0 && currentStep >= 0 && currentStep < hanoiSteps.length && (
                      <div className="mb-4 bg-card border border-border rounded-lg p-4 animate-in fade-in duration-300">
                        <p className="text-sm font-semibold text-foreground">
                          Step {currentStep + 1} / {hanoiSteps.length}
                          {currentStep === 0 && " - Initial State: All disks on Source tower"}
                          {movingDisk !== null && fromTower !== null && toTower !== null && currentStep > 0 && (
                            <span className="ml-2">- Moving disk <span className="font-bold text-primary">{movingDisk}</span> from <span className="font-bold">{towerNames[fromTower]}</span> to <span className="font-bold">{towerNames[toTower]}</span></span>
                          )}
                        </p>
                      </div>
                    )}
                    <TowerOfHanoiVisualization
                      towers={towers}
                      movingDisk={movingDisk}
                      fromTower={fromTower}
                      toTower={toTower}
                      isInTransit={isInTransit}
                      numDisks={numDisks}
                      speed={speed}
                    />
                  </div>

                  {hanoiSteps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Step</p>
                          <p className="text-xl font-bold text-foreground">{currentStep + 1} / {hanoiSteps.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Moves</p>
                          <p className="text-xl font-bold text-foreground">{moves}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About Tower of Hanoi</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Tower of Hanoi is a mathematical puzzle that demonstrates recursion and divide-and-conquer principles.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Rules</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Only one disk can be moved at a time</li>
                          <li>Only the top disk can be moved</li>
                          <li>No disk on top of a smaller disk</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Complexity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Minimum Moves: 2^n - 1</li>
                          <li>Time: O(2^n)</li>
                          <li>Space: O(n)</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-card rounded-lg border border-border p-6 md:p-8">
              <div className="space-y-8">
                <div className="border-b border-border pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Tower of Hanoi – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Tower of Hanoi is a classic recursive problem that demonstrates divide-and-conquer thinking and recursion.
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Key Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-foreground">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Move n-1 disks to auxiliary tower</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Move largest disk to destination</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Move n-1 disks from auxiliary to destination</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Algorithm (Step-by-Step)
                  </h2>
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-5">
                      <ol className="space-y-4 text-sm text-foreground">
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                          <span className="flex-1 pt-1">If n == 1, move disk directly from source to destination (base case)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Move n-1 disks from source to auxiliary tower (using destination as temporary)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Move the largest disk from source to destination</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">Move n-1 disks from auxiliary to destination (using source as temporary)</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Pseudocode
                  </h2>
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-5">
                      <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`TowerOfHanoi(n, source, destination, auxiliary):
    if n == 1:
        move disk from source to destination
    else:
        TowerOfHanoi(n-1, source, auxiliary, destination)
        move disk from source to destination
        TowerOfHanoi(n-1, auxiliary, destination, source)`}
                      </pre>
                    </CardContent>
                  </Card>
            </div>
          </div>
        </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TowerOfHanoiVisualizer;
