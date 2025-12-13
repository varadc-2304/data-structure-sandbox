import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFractionalKnapsackVisualizer } from "./fractional-knapsack/useFractionalKnapsackVisualizer";

const FractionalKnapsackVisualizer = () => {
  const {
    state: { items, knapsackCapacity, steps, currentStep, isRunning, speed, newItemWeight, newItemValue },
    actions: { setKnapsackCapacity, setSpeed, setNewItemWeight, setNewItemValue, handleAddItem, handlePlayPause, handleReset, goToStep, setCurrentStep },
  } = useFractionalKnapsackVisualizer();

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
              <div className="md:col-span-1 space-y-6">
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Knapsack Capacity</Label>
                        <Input type="number" value={knapsackCapacity} onChange={(e) => setKnapsackCapacity(Number(e.target.value))} />
                  </div>
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
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Animation Speed: {speed}x</Label>
                    <Slider value={[speed]} onValueChange={([value]) => setSpeed(value)} max={3} min={0.5} step={0.5} className="w-full" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0.5x</span>
                          <span>1x</span>
                          <span>1.5x</span>
                          <span>2.0x</span>
                          <span>2.5x</span>
                          <span>3x</span>
                        </div>
                  </div>
                </div>
              </CardContent>
            </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Current Step</p>
                        <p className="text-3xl font-bold text-foreground">{currentStep}</p>
                  </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Total Value</p>
                        <p className="text-3xl font-bold text-foreground">
                      {steps.length > 0 ? steps[currentStep].items.reduce((acc, item) => acc + item.value * item.fraction, 0).toFixed(2) : "0"}
                    </p>
                  </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Knapsack Weight</p>
                        <p className="text-xl font-bold text-foreground">
                      {steps.length > 0 ? steps[currentStep].knapsackWeight : "0"} / {knapsackCapacity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={handlePlayPause} variant="default" size="sm" disabled={isRunning || items.length === 0}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={handlePlayPause} variant="outline" disabled={!steps.length || !isRunning} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={handlePlayPause} variant="outline" disabled={!steps.length || isRunning || currentStep >= steps.length - 1} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={handleReset} variant="outline" disabled={!steps.length} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={() => setCurrentStep(currentStep - 1)} variant="outline" disabled={!steps.length || currentStep <= 0} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={() => setCurrentStep(currentStep + 1)} variant="outline" disabled={!steps.length || currentStep >= steps.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    {steps.length > 0 && (
                      <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                        <Timer className="mr-2 h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium text-sm">
                          Step: {currentStep + 1} / {steps.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                {steps.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <Package className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Play to start the visualization</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {steps[currentStep].items.map((item) => (
                            <div key={item.id} className="bg-card rounded-lg shadow-md p-4 border border-border">
                              <h3 className="font-bold text-lg text-foreground">Item {item.id}</h3>
                              <p className="text-muted-foreground font-medium">Weight: {item.weight}</p>
                              <p className="text-muted-foreground font-medium">Value: {item.value}</p>
                              <p className="text-primary font-semibold">Fraction: {(item.fraction * 100).toFixed(0)}%</p>
                              <p className="text-foreground font-bold">Value in Knapsack: {(item.value * item.fraction).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                        <div className="text-center p-4 rounded-lg border border-border bg-card">
                          <p className="text-lg font-semibold text-foreground">{steps[currentStep].message}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {steps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p className="text-xl font-bold text-foreground">
                            {steps[currentStep].items.reduce((acc, item) => acc + item.value * item.fraction, 0).toFixed(2)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Capacity Used</p>
                          <p className="text-xl font-bold text-foreground">
                            {steps[currentStep].knapsackWeight} / {knapsackCapacity}
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
