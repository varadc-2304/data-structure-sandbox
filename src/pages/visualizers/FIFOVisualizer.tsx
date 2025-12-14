import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FIFOControls from "./fifo/FIFOControls";
import FIFOVisualization from "./fifo/FIFOVisualization";
import FIFOStats from "./fifo/FIFOStats";
import FIFOAlgorithmInfo from "./fifo/FIFOAlgorithmInfo";
import { useFIFOVisualizer } from "./fifo/useFIFOVisualizer";

const FIFOVisualizer = () => {
  const {
    state: {
      pageReferences,
      inputReference,
      framesCount,
      frames,
      currentStep,
      pageFaults,
      pageHits,
      isPlaying,
      speed,
      referenceHistory,
    },
    actions: {
      setInputReference,
      setFramesCount,
      setSpeed,
      handleAddReference,
      handleRemoveReference,
      resetSimulation,
      nextStep,
      previousStep,
      goToStep,
      togglePlayPause,
      fastForward,
      rewind,
    },
  } = useFIFOVisualizer();

  const runSimulation = () => {
    if (pageReferences.length === 0) return;
    resetSimulation();
    togglePlayPause();
  };

  const pauseSimulation = () => {
    if (isPlaying) togglePlayPause();
  };

  const resumeSimulation = () => {
    if (!isPlaying && currentStep < pageReferences.length - 1) togglePlayPause();
  };

  const handleNextStep = () => {
    if (isPlaying) {
      togglePlayPause(); // Pause the simulation
    }
    nextStep();
  };

  const handlePreviousStep = () => {
    if (isPlaying) {
      togglePlayPause(); // Pause the simulation
    }
    previousStep();
  };

  const isSimulationEnded = currentStep >= pageReferences.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2 text-foreground">Page Replacement Visualization</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">First In First Out (FIFO)</h1>
          <p className="text-muted-foreground text-sm">Visualize the FIFO page replacement algorithm. The oldest page in memory is replaced when a new page is needed.</p>
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
                <FIFOControls
                  framesCount={framesCount}
                  inputReference={inputReference}
                  speed={speed}
                  currentStep={currentStep}
                  pageReferencesLength={pageReferences.length}
                  isPlaying={isPlaying}
                  pageReferences={pageReferences}
                  onFramesCountChange={setFramesCount}
                  onInputReferenceChange={setInputReference}
                  onSpeedChange={(value) => setSpeed(value[0])}
                  onAddReference={handleAddReference}
                  onRemoveReference={handleRemoveReference}
                  onRewind={rewind}
                  onPreviousStep={previousStep}
                  onTogglePlayPause={togglePlayPause}
                  onNextStep={nextStep}
                  onFastForward={fastForward}
                  onReset={resetSimulation}
                  onGoToStep={goToStep}
                />

                <div className="mt-4">
                  <FIFOStats pageFaults={pageFaults} pageHits={pageHits} referenceHistory={referenceHistory} />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-2xl shadow-md p-4 animate-scale-in border border-border" style={{ animationDelay: "0.2s" }}>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={runSimulation} variant="default" size="sm" disabled={pageReferences.length === 0 || (isPlaying && !isSimulationEnded)}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={pauseSimulation} variant="outline" disabled={referenceHistory.length === 0 || !isPlaying || isSimulationEnded} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={resumeSimulation} variant="outline" disabled={referenceHistory.length === 0 || isPlaying || isSimulationEnded} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={resetSimulation} variant="outline" disabled={referenceHistory.length === 0} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={handlePreviousStep} variant="outline" disabled={referenceHistory.length === 0 || currentStep <= -1} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={handleNextStep} variant="outline" disabled={referenceHistory.length === 0 || currentStep >= pageReferences.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    {pageReferences.length > 0 && (
                      <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                        <Timer className="mr-2 h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium text-sm">
                          Step: {currentStep + 1} / {pageReferences.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <FIFOVisualization
                      pageReferences={pageReferences}
                      currentStep={currentStep}
                      frames={frames}
                      referenceHistory={referenceHistory}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-2xl shadow-md p-4 animate-scale-in text-sm border border-border" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">About First In First Out</h2>
                  <p className="text-muted-foreground mb-3 text-sm">FIFO (First In First Out) is the simplest page replacement algorithm. When a page fault occurs and all frames are full, the oldest page in memory is replaced.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Simple queue-based implementation</li>
                          <li>Easy to understand and implement</li>
                          <li>No need to track access history</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Limitations</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>May suffer from Belady's anomaly</li>
                          <li>Does not consider page usage patterns</li>
                          <li>May replace frequently used pages</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
              <FIFOAlgorithmInfo type="algorithm" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FIFOVisualizer;
