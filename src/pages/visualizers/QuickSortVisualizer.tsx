import React from "react";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import QuickSortControls from "./quick-sort/QuickSortControls";
import QuickSortVisualization from "./quick-sort/QuickSortVisualization";
import { useQuickSortVisualizer } from "./quick-sort/useQuickSortVisualizer";
import PlaybackControls from "@/components/PlaybackControls";

const QuickSortVisualizer = () => {
  const {
    state: {
      array,
      arraySize,
      customArrayInput,
      pivotIndex,
      low,
      high,
      i,
      j,
      partitionedIndices,
      isRunning,
      speed,
      sortSteps,
      currentStep,
      comparisons,
      comparisonText,
    },
    actions: {
      setArraySize,
      setCustomArrayInput,
      setSpeed,
      generateRandomArray,
      generateCustomArray,
      resetSort,
      startSort,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      getBarHeight,
      setIsRunning,
    },
  } = useQuickSortVisualizer();

  const handleStart = () => {
    if (sortSteps.length === 0 && array.length > 0) {
      startSort();
    } else if (sortSteps.length > 0) {
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
    if (sortSteps.length > 0 && currentStep < sortSteps.length - 1) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Quick Sort</h1>
          <p className="text-muted-foreground text-sm">Quick sort uses a divide-and-conquer approach by selecting a pivot and partitioning the array around it.</p>
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
          <QuickSortControls
            arraySize={arraySize}
            customArrayInput={customArrayInput}
            speed={speed}
            currentStep={currentStep}
            stepsCount={sortSteps.length}
            isRunning={isRunning}
            comparisons={comparisons}
            onArraySizeChange={setArraySize}
            onCustomArrayChange={setCustomArrayInput}
            onSpeedChange={setSpeed}
            onGenerateRandom={generateRandomArray}
            onGenerateCustom={generateCustomArray}
            onStartOrToggle={handleStart}
            onPrev={prevStep}
            onNext={nextStep}
            onFirst={() => goToStep(0)}
            onLast={() => goToStep(sortSteps.length - 1)}
            onGoToStep={goToStep}
            onReset={resetSort}
          />
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-4">
                    <PlaybackControls
                      isRunning={isRunning}
                      currentStep={currentStep}
                      totalSteps={sortSteps.length}
                      onPlay={handleStart}
                      onPause={handlePause}
                      onResume={handleResume}
                      onReset={() => { resetSort(); setIsRunning(false); }}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onFirst={() => goToStep(0)}
                      onLast={() => goToStep(sortSteps.length - 1)}
                      disabled={array.length === 0}
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    <QuickSortVisualization
                      array={array}
                      pivotIndex={pivotIndex}
                      low={low}
                      high={high}
                      i={i}
                      j={j}
                      partitionedIndices={partitionedIndices}
                      comparisonText={comparisonText}
                      getBarHeight={getBarHeight}
                    />
                  </div>

                  {sortSteps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Step</p>
                          <p className="text-xl font-bold text-foreground">{currentStep + 1} / {sortSteps.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Array Size</p>
                          <p className="text-xl font-bold text-foreground">{array.length}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About Quick Sort</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Quick Sort is a highly efficient divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around it.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>In-place sorting</li>
                          <li>Very fast average case</li>
                          <li>Widely used in practice</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Best Case: O(n log n)</li>
                          <li>Average Case: O(n log n)</li>
                          <li>Worst Case: O(n²)</li>
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
                    Quick Sort – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Quick Sort is a divide-and-conquer sorting algorithm that works by selecting a pivot element and partitioning the array around it.
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
                        <span className="flex-1">Choose a pivot element</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Partition array: smaller elements left, larger right</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Recursively sort left and right partitions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Pivot is already in correct position</span>
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
                          <span className="flex-1 pt-1">Choose a pivot element (typically last element)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Partition the array: elements less than pivot go left, greater go right</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Place pivot in its correct position</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">Recursively sort the left subarray</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">Recursively sort the right subarray</span>
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
{`QuickSort(array, low, high):
    if low < high:
        pivotIndex = Partition(array, low, high)
        QuickSort(array, low, pivotIndex - 1)
        QuickSort(array, pivotIndex + 1, high)

Partition(array, low, high):
    pivot = array[high]
    i = low - 1
    
    for j = low to high - 1:
        if array[j] < pivot:
            i++
            swap(array[i], array[j])
    
    swap(array[i + 1], array[high])
    return i + 1`}
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

export default QuickSortVisualizer;
