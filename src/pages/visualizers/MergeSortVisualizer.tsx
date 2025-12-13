import React from "react";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MergeSortControls from "./merge-sort/MergeSortControls";
import MergeSortVisualization from "./merge-sort/MergeSortVisualization";
import MergeSortStats from "./merge-sort/MergeSortStats";
import { useMergeSortVisualizer } from "./merge-sort/useMergeSortVisualizer";

const MergeSortVisualizer = () => {
  const {
    state: {
      array,
      arraySize,
      customArrayInput,
      leftArray,
      rightArray,
      mergedArray,
      activeIndices,
      leftPointer,
      rightPointer,
      mergedPointer,
      isRunning,
      speed,
      sortSteps,
      currentStep,
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
  } = useMergeSortVisualizer();

  const handleStartOrToggle = () => {
    if (sortSteps.length === 0) {
      startSort();
    } else {
      togglePlayPause();
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Merge Sort</h1>
          <p className="text-muted-foreground text-sm">Merge sort divides the array into smaller subarrays, sorts them, and then merges them back together.</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-full justify-start bg-secondary p-1 h-auto">
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
                <MergeSortControls
                  arraySize={arraySize}
                  customArrayInput={customArrayInput}
                  speed={speed}
                  sortStepsCount={sortSteps.length}
                  currentStep={currentStep}
                  isRunning={isRunning}
                  onArraySizeChange={setArraySize}
                  onCustomArrayChange={setCustomArrayInput}
                  onGenerateRandom={generateRandomArray}
                  onGenerateCustom={generateCustomArray}
                  onSpeedChange={setSpeed}
                  onStartOrToggle={handleStartOrToggle}
                  onPrev={prevStep}
                  onNext={nextStep}
                  onFirst={() => goToStep(0)}
                  onLast={() => goToStep(sortSteps.length - 1)}
                  onGoToStep={goToStep}
                  onReset={() => {
                    resetSort();
                    setIsRunning(false);
                  }}
                />
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={handleStartOrToggle} variant="default" size="sm" disabled={isRunning || array.length === 0}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={() => togglePlayPause()} variant="outline" disabled={!sortSteps.length || !isRunning} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={handleStartOrToggle} variant="outline" disabled={!sortSteps.length || isRunning || currentStep >= sortSteps.length - 1} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={() => { resetSort(); setIsRunning(false); }} variant="outline" disabled={!sortSteps.length} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={prevStep} variant="outline" disabled={!sortSteps.length || currentStep <= -1} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextStep} variant="outline" disabled={!sortSteps.length || currentStep >= sortSteps.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    {sortSteps.length > 0 && (
                      <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                        <Timer className="mr-2 h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium text-sm">
                          Step: {currentStep + 1} / {sortSteps.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    <MergeSortVisualization
                      array={array}
                      leftArray={leftArray}
                      rightArray={rightArray}
                      mergedArray={mergedArray}
                      activeIndices={activeIndices}
                      leftPointer={leftPointer}
                      rightPointer={rightPointer}
                      mergedPointer={mergedPointer}
                      comparisonText={comparisonText}
                      getBarHeight={getBarHeight}
                    />
                  </div>

                  <MergeSortStats currentStep={currentStep} arrayLength={array.length} sortStepsCount={sortSteps.length} />
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About Merge Sort</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Merge Sort is a divide-and-conquer sorting algorithm that divides the array into halves, sorts them, and then merges them back together.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Stable sorting algorithm</li>
                          <li>Guaranteed O(n log n) performance</li>
                          <li>Not in-place (requires extra space)</li>
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
                          <li>Worst Case: O(n log n)</li>
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
                    Merge Sort – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Merge Sort is a divide-and-conquer sorting algorithm that divides the array into halves, sorts them recursively, and then merges them back together.
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
                        <span className="flex-1">Divide array into two halves</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Recursively sort both halves</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Merge sorted halves back together</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Compare and combine elements in order</span>
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
                          <span className="flex-1 pt-1">If array has only one element, return (base case)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Divide the array into two halves</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Recursively sort the left half</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">Recursively sort the right half</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">Merge the two sorted halves by comparing elements</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                          <span className="flex-1 pt-1">Place smaller element first, then continue merging</span>
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
{`MergeSort(array, left, right):
    if left < right:
        mid = (left + right) / 2
        MergeSort(array, left, mid)
        MergeSort(array, mid + 1, right)
        Merge(array, left, mid, right)

Merge(array, left, mid, right):
    leftArray = array[left..mid]
    rightArray = array[mid+1..right]
    i = 0, j = 0, k = left
    
    while i < leftArray.length and j < rightArray.length:
        if leftArray[i] <= rightArray[j]:
            array[k] = leftArray[i]
            i++
        else:
            array[k] = rightArray[j]
            j++
        k++
    
    Copy remaining elements`}
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

export default MergeSortVisualizer;
