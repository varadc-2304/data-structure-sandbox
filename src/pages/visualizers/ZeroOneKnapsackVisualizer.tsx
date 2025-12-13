import React from "react";
import { Package, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useKnapsackVisualizer } from "./knapsack/useKnapsackVisualizer";

const ZeroOneKnapsackVisualizer = () => {
  const {
    state: { items, capacity, customItemsInput, dpTable, currentItem, currentWeight, selectedItems, isRunning, speed, knapsackSteps, currentStep },
    actions: { setCapacity, setCustomItemsInput, setSpeed, generateRandomItems, generateCustomItems, resetKnapsack, startKnapsack, nextStep, prevStep, togglePlayPause, goToStep },
  } = useKnapsackVisualizer();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 pb-12">
        <div className="mb-6">
          <Link to="/dashboard/algorithms" className="inline-flex items-center text-primary hover:underline mb-4 font-medium transition-colors text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">0/1 Knapsack</h1>
          <p className="text-muted-foreground text-sm">The 0/1 Knapsack problem uses dynamic programming to find the optimal selection of items.</p>
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
                    <CardTitle className="text-xl font-semibold text-foreground">Items Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Capacity</Label>
                        <Input type="number" value={capacity} onChange={(e) => setCapacity(Math.max(5, Math.min(20, parseInt(e.target.value) || 10)))} min={5} max={20} />
                  </div>
                      <Button onClick={generateRandomItems} variant="outline" className="w-full font-semibold">
                    Generate Random Items
                  </Button>
                  <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Custom Items (name, weight, value; separated by semicolons)</Label>
                    <div className="flex gap-2">
                          <Input placeholder="e.g., Item1,5,6; Item2,3,4" value={customItemsInput} onChange={(e) => setCustomItemsInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateCustomItems()} className="flex-1" />
                          <Button onClick={generateCustomItems}>
                        Set
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Animation Speed: {speed}x</Label>
                  <div className="flex items-center mt-1">
                    <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
                  </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0.5x</span>
                        <span>1x</span>
                        <span>1.5x</span>
                        <span>2.0x</span>
                        <span>2.5x</span>
                        <span>3x</span>
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
                        <p className="text-3xl font-bold text-foreground">{Math.max(0, currentStep)}</p>
                  </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Number of Items</p>
                        <p className="text-3xl font-bold text-foreground">{items.length}</p>
                  </div>
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <p className="text-sm font-semibold text-muted-foreground">Total Steps</p>
                        <p className="text-xl font-bold text-foreground">{knapsackSteps.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={togglePlayPause} variant="default" size="sm" disabled={isRunning || items.length === 0}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={togglePlayPause} variant="outline" disabled={!knapsackSteps.length || !isRunning} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={togglePlayPause} variant="outline" disabled={!knapsackSteps.length || isRunning || currentStep >= knapsackSteps.length - 1} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={() => { resetKnapsack(); }} variant="outline" disabled={!knapsackSteps.length} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={prevStep} variant="outline" disabled={!knapsackSteps.length || currentStep <= 0} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextStep} variant="outline" disabled={!knapsackSteps.length || currentStep >= knapsackSteps.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    {knapsackSteps.length > 0 && (
                      <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                        <Timer className="mr-2 h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium text-sm">
                          Step: {currentStep + 1} / {knapsackSteps.length}
                        </span>
                      </div>
                    )}
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
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-foreground">Items:</h3>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                                <li key={item.id} className={`p-3 rounded-lg border ${index === currentItem ? "border-primary shadow-md" : "border-border"}`}>
                              <span className="font-semibold">{item.name}</span> - Weight: {item.weight}, Value: {item.value}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                            <h3 className="text-xl font-semibold text-foreground">DP Table:</h3>
                        <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse border border-border">
                            <thead>
                              <tr>
                                    <th className="border border-border p-2">Item</th>
                                {[...Array(capacity + 1)].map((_, i) => (
                                      <th key={i} className="border border-border p-2">
                                    Weight: {i}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dpTable.map((row, i) => (
                                <tr key={i}>
                                      <td className="border border-border p-2">{i === 0 ? "Empty" : items[i - 1]?.name}</td>
                                  {row.map((value, j) => (
                                        <td key={j} className={`border border-border p-2 text-center ${currentItem === i - 1 && currentWeight === j ? "bg-primary/10 font-semibold" : ""}`}>
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-foreground">Selected Items:</h3>
                      {selectedItems.length === 0 ? (
                            <p className="text-muted-foreground">No items selected.</p>
                      ) : (
                        <ul className="space-y-2">
                          {selectedItems.map((index) => (
                                <li key={items[index].id} className="p-3 rounded-lg border border-border">
                              <span className="font-semibold">{items[index].name}</span> - Weight: {items[index].weight}, Value: {items[index].value}
                            </li>
                          ))}
                        </ul>
                      )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                    </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About 0/1 Knapsack</h2>
                  <p className="text-muted-foreground mb-3 text-sm">The 0/1 Knapsack problem uses dynamic programming to find the optimal selection of items that cannot be broken into fractions.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Dynamic programming approach</li>
                          <li>Items cannot be fractioned</li>
                          <li>Optimal substructure property</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Best Case: O(n×W)</li>
                          <li>Average Case: O(n×W)</li>
                          <li>Worst Case: O(n×W)</li>
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
                    0/1 Knapsack – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    The 0/1 Knapsack problem uses dynamic programming to find the optimal selection of items that cannot be broken into fractions.
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
                        <span className="flex-1">Create DP table: dp[i][w] = max value with first i items and weight w</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">For each item, decide: include or exclude</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Take maximum value between including and excluding</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Backtrack to find selected items</span>
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
                          <span className="flex-1 pt-1">Create a 2D DP table of size (n+1) × (W+1)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Initialize first row and column with 0</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">For each item i and weight w:</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                            <span className="flex-1">If item weight &gt; w, cannot include: dp[i][w] = dp[i-1][w]</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1">Otherwise: dp[i][w] = max(include, exclude)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                          <span className="flex-1">Backtrack from dp[n][W] to find selected items</span>
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
{`Knapsack01(items, capacity):
    n = items.length
    dp = array[n+1][capacity+1]
    
    // Initialize
    for i = 0 to n:
        dp[i][0] = 0
    for w = 0 to capacity:
        dp[0][w] = 0
    
    // Fill DP table
    for i = 1 to n:
        for w = 1 to capacity:
            if items[i-1].weight > w:
                dp[i][w] = dp[i-1][w]
            else:
                include = items[i-1].value + dp[i-1][w - items[i-1].weight]
                exclude = dp[i-1][w]
                dp[i][w] = max(include, exclude)
    
    return dp[n][capacity]`}
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

export default ZeroOneKnapsackVisualizer;
