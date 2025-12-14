import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFractionalKnapsackVisualizer } from "./fractional-knapsack/useFractionalKnapsackVisualizer";
import PlaybackControls from "@/components/PlaybackControls";
import SpeedControl from "@/components/SpeedControl";

const FractionalKnapsackVisualizer = () => {
  const {
    state: { items, knapsackCapacity, steps, currentStep, isRunning, speed, newItemWeight, newItemValue },
    actions: { setKnapsackCapacity, setSpeed, setNewItemWeight, setNewItemValue, handleAddItem, handlePlayPause, handleReset, goToStep, setCurrentStep, generateRandomItems, setIsRunning, nextStep, prevStep },
  } = useFractionalKnapsackVisualizer();

  const handleStart = () => {
    if (steps.length === 0 && items.length > 0) {
      handlePlayPause();
    } else if (steps.length > 0) {
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
    if (steps.length > 0 && currentStep < steps.length - 1) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Fractional Knapsack</h1>
          <p className="text-muted-foreground text-sm">The fractional knapsack problem involves selecting items with maximum value to fit into a knapsack with a limited capacity, allowing fractions of items to be taken.</p>
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
              <div className="md:col-span-1 space-y-6">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Knapsack Capacity</Label>
                    <Input type="number" value={knapsackCapacity} onChange={(e) => setKnapsackCapacity(Number(e.target.value))} min={1} />
                  </div>
                  <Button onClick={generateRandomItems} variant="outline" className="w-full font-semibold">
                    Generate Random Items
                  </Button>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-foreground">Add Item</Label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Weight" value={newItemWeight} onChange={(e) => setNewItemWeight(Number(e.target.value))} className="flex-1" />
                      <Input type="number" placeholder="Value" value={newItemValue} onChange={(e) => setNewItemValue(Number(e.target.value))} className="flex-1" />
                    </div>
                    <Button onClick={handleAddItem} className="w-full">
                      Add Item
                    </Button>
                  </div>
                  <SpeedControl
                    speed={speed}
                    onSpeedChange={setSpeed}
                    min={0.5}
                    max={3}
                    step={0.5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-4">
                    <PlaybackControls
                      isRunning={isRunning}
                      currentStep={currentStep}
                      totalSteps={steps.length}
                      onPlay={handleStart}
                      onPause={handlePause}
                      onResume={handleResume}
                      onReset={() => { handleReset(); setIsRunning(false); }}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onFirst={() => goToStep(0)}
                      onLast={() => goToStep(steps.length - 1)}
                      disabled={items.length === 0}
                    />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    {items.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        <div className="text-center">
                          <Package className="mx-auto h-16 w-16 mb-4 opacity-50" />
                          <p className="text-xl font-semibold">Generate items to start visualization</p>
                        </div>
                      </div>
                    ) : steps.length === 0 ? (
                      <div className="space-y-4">
                        <Card className="bg-card border border-border animate-in fade-in">
                          <CardContent className="p-4">
                            <p className="text-sm text-foreground">Items ready. Click Run to start the Fractional Knapsack algorithm.</p>
                          </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {items.map((item, idx) => {
                            const ratio = item.value / item.weight;
                            return (
                              <Card 
                                key={item.id} 
                                className="border-2 border-border hover:scale-105 transition-all duration-300 animate-in zoom-in"
                                style={{ animationDelay: `${idx * 50}ms` }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-foreground">Item {item.id}</h3>
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">
                                      Weight: <span className="font-medium text-foreground">{item.weight}</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                      Value: <span className="font-medium text-foreground">{item.value}</span>
                                    </p>
                                    <p className="text-primary font-semibold">
                                      Ratio: <span className="font-bold">{ratio.toFixed(2)}</span>
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Step-by-step explanation */}
                        {currentStep >= 0 && currentStep < steps.length && (
                          <Card className="bg-card border border-border animate-in fade-in duration-300">
                            <CardContent className="p-4 space-y-2">
                              <p className="text-sm font-semibold text-foreground">Step {currentStep + 1} Explanation:</p>
                              <p className="text-sm text-foreground">{steps[currentStep].message}</p>
                              {steps[currentStep].items.some(item => item.fraction > 0) && (
                                <div className="mt-2 pt-2 border-t border-border">
                                  <p className="text-xs text-muted-foreground">Items are sorted by value-to-weight ratio (greedy approach). Higher ratio items are selected first.</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {steps[currentStep].items.map((item, idx) => {
                            const ratio = item.value / item.weight;
                            const isIncluded = item.fraction > 0;
                            let borderClass = "border-border";
                            let bgClass = "bg-card";
                            if (isIncluded) {
                              if (item.fraction === 1) {
                                borderClass = "border-green-500 dark:border-green-600";
                                bgClass = "bg-green-50 dark:bg-green-900/20";
                              } else {
                                borderClass = "border-yellow-500 dark:border-yellow-600";
                                bgClass = "bg-yellow-50 dark:bg-yellow-900/20";
                              }
                            }
                            return (
                              <Card 
                                key={item.id} 
                                className={`border-2 ${borderClass} ${bgClass} transition-all duration-300 ${
                                  isIncluded ? "animate-in zoom-in shadow-md" : "hover:scale-105"
                                }`}
                                style={{ animationDelay: isIncluded ? `${idx * 100}ms` : undefined }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg text-foreground">Item {item.id}</h3>
                                    {isIncluded && (
                                      <span className={`text-xs px-2 py-1 rounded animate-in fade-in ${
                                        item.fraction === 1 
                                          ? "bg-green-500 dark:bg-green-600 text-white" 
                                          : "bg-yellow-500 dark:bg-yellow-600 text-white"
                                      }`}>
                                        {item.fraction === 1 ? "Full" : "Partial"}
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">
                                      Weight: <span className="font-medium text-foreground">{item.weight}</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                      Value: <span className="font-medium text-foreground">{item.value}</span>
                                    </p>
                                    <p className="text-primary font-semibold">
                                      Ratio: <span className="font-bold">{ratio.toFixed(2)}</span>
                                    </p>
                                    {isIncluded && (
                                      <>
                                        <p className="text-foreground font-semibold">
                                          Fraction: <span className="font-bold">{(item.fraction * 100).toFixed(0)}%</span>
                                        </p>
                                        <p className="text-foreground font-bold text-lg">
                                          Value in Knapsack: {(item.value * item.fraction).toFixed(2)}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        {/* Summary Section */}
                        {steps[currentStep].items.some(item => item.fraction > 0) && (
                          <Card className="bg-secondary dark:bg-secondary border border-border animate-in slide-in-from-bottom duration-500">
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold text-foreground mb-3">Knapsack Summary</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Capacity Used</p>
                                  <p className="text-xl font-bold text-foreground">
                                    {steps[currentStep].knapsackWeight} / {knapsackCapacity}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Value</p>
                                  <p className="text-xl font-bold text-primary">
                                    {steps[currentStep].items.reduce((acc, item) => acc + item.value * item.fraction, 0).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                  Items included: {steps[currentStep].items.filter(item => item.fraction > 0).length} of {steps[currentStep].items.length}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>

                  {steps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Step</p>
                          <p className="text-xl font-bold text-foreground">{currentStep + 1} / {steps.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p className="text-xl font-bold text-foreground">
                            {steps[currentStep].items.reduce((acc, item) => acc + item.value * item.fraction, 0).toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About Fractional Knapsack</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Fractional Knapsack is a greedy algorithm problem where items can be broken into fractions to maximize value within a weight constraint.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Greedy algorithm</li>
                          <li>Items can be fractioned</li>
                          <li>Always gives optimal solution</li>
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
                    Fractional Knapsack – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Fractional Knapsack is a greedy algorithm problem where items can be broken into fractions to maximize the total value within a weight constraint.
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
                        <span className="flex-1">Calculate value-to-weight ratio for each item</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Sort items by ratio in descending order</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Take items with highest ratio first</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">If item doesn't fit completely, take a fraction</span>
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
                          <span className="flex-1 pt-1">Calculate value-to-weight ratio for each item</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Sort items in descending order of ratio</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Initialize total value and remaining capacity</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">For each item in sorted order:</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1">If item fits completely, add it and update capacity</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                          <span className="flex-1">If item doesn't fit, take a fraction to fill remaining capacity</span>
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
{`FractionalKnapsack(items, capacity):
    // Calculate ratio for each item
    for each item in items:
        item.ratio = item.value / item.weight
    
    // Sort by ratio descending
    sort items by ratio descending
    
    totalValue = 0
    remainingCapacity = capacity
    
    for each item in items:
        if remainingCapacity >= item.weight:
            // Take whole item
            totalValue += item.value
            remainingCapacity -= item.weight
        else:
            // Take fraction
            fraction = remainingCapacity / item.weight
            totalValue += item.value * fraction
            break
    
    return totalValue`}
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

export default FractionalKnapsackVisualizer;
