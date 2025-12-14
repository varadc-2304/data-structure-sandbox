import React from "react";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useKnapsackVisualizer } from "./knapsack/useKnapsackVisualizer";
import PlaybackControls from "@/components/PlaybackControls";
import SpeedControl from "@/components/SpeedControl";

const ZeroOneKnapsackVisualizer = () => {
  const {
    state: { items, capacity, customItemsInput, dpTable, currentItem, currentWeight, selectedItems, isRunning, speed, knapsackSteps, currentStep, comparisons },
    actions: { setCapacity, setCustomItemsInput, setSpeed, generateRandomItems, generateCustomItems, resetKnapsack, startKnapsack, nextStep, prevStep, togglePlayPause, goToStep, setIsRunning },
  } = useKnapsackVisualizer();

  const handleStart = () => {
    if (knapsackSteps.length === 0 && items.length > 0) {
      startKnapsack();
    } else if (knapsackSteps.length > 0) {
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
    if (knapsackSteps.length > 0 && currentStep < knapsackSteps.length - 1) {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">0/1 Knapsack</h1>
          <p className="text-muted-foreground text-sm">The 0/1 Knapsack problem uses dynamic programming to find the optimal selection of items.</p>
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
                <SpeedControl
                  speed={speed}
                  onSpeedChange={setSpeed}
                  min={0.5}
                  max={3}
                  step={0.5}
                />
              </CardContent>
            </Card>

          </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="mb-4">
                    <PlaybackControls
                      isRunning={isRunning}
                      currentStep={currentStep}
                      totalSteps={knapsackSteps.length}
                      onPlay={handleStart}
                      onPause={handlePause}
                      onResume={handleResume}
                      onReset={() => { resetKnapsack(); setIsRunning(false); }}
                      onPrev={prevStep}
                      onNext={nextStep}
                      onFirst={() => goToStep(0)}
                      onLast={() => goToStep(knapsackSteps.length - 1)}
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
                    ) : (
                      <div className="space-y-6">
                        {/* Step-by-step explanation */}
                        {currentStep >= 0 && currentStep < knapsackSteps.length && (
                          <Card className="bg-card border border-border animate-in fade-in duration-300">
                            <CardContent className="p-4 space-y-2">
                              <p className="text-sm font-semibold text-foreground">Step {currentStep + 1} Explanation:</p>
                              {currentStep === knapsackSteps.length - 1 ? (
                                <div className="space-y-1">
                                  <p className="text-sm text-foreground font-semibold text-primary">
                                    🎉 Visualization Complete! Backtracking from DP table to find optimal solution.
                                  </p>
                                  <p className="text-sm text-foreground">
                                    Starting from dp[{items.length}][{capacity}] = {dpTable[items.length]?.[capacity] || 0}, we trace back to identify which items were included in the optimal solution.
                                  </p>
                                  <p className="text-sm text-foreground">
                                    Selected items: {selectedItems.map(idx => items[idx]?.name).join(", ")} with total value of <span className="font-bold text-primary">{dpTable[items.length]?.[capacity] || 0}</span>.
                                  </p>
                                </div>
                              ) : currentItem >= 0 ? (
                                <div className="space-y-1">
                                  <p className="text-sm text-foreground">
                                    Processing <span className="font-bold text-primary">{items[currentItem]?.name}</span> (Weight: {items[currentItem]?.weight}, Value: {items[currentItem]?.value}) at capacity <span className="font-bold">{currentWeight}</span>.
                                  </p>
                                  {items[currentItem]?.weight <= currentWeight ? (
                                    <div className="text-sm">
                                      <p className="text-green-600 dark:text-green-400 font-medium">✓ Item can fit in knapsack</p>
                                      <p className="text-foreground mt-1">
                                        Comparing: <span className="font-semibold">Include</span> (value: {items[currentItem]?.value} + dp[{currentItem}][{currentWeight - items[currentItem]?.weight}]) vs <span className="font-semibold">Exclude</span> (value: dp[{currentItem}][{currentWeight}])
                                      </p>
                                      <p className="text-foreground mt-1">
                                        Taking maximum value: <span className="font-bold text-primary">{dpTable[currentItem + 1]?.[currentWeight] || 0}</span>
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-red-600 dark:text-red-400 font-medium">✗ Item weight ({items[currentItem]?.weight}) exceeds capacity ({currentWeight}). Cannot include. Using value from previous row.</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-foreground">Initializing DP table: First row and column set to 0 (base case - no items or no capacity = 0 value).</p>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        <div className="space-y-4">
                          {/* Items in horizontal row */}
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">Items:</h3>
                            <div className="flex flex-wrap gap-3">
                              {items.map((item, index) => {
                                const isCurrent = index === currentItem;
                                const isSelected = selectedItems.includes(index);
                                let borderClass = "border-border";
                                let bgClass = "bg-card";
                                if (isCurrent) {
                                  borderClass = "border-primary dark:border-primary shadow-lg";
                                  bgClass = "bg-primary/5 dark:bg-primary/10";
                                } else if (isSelected) {
                                  borderClass = "border-green-500 dark:border-green-600";
                                  bgClass = "bg-green-50 dark:bg-green-900/20";
                                }
                                return (
                                  <Card 
                                    key={item.id} 
                                    className={`border-2 ${borderClass} ${bgClass} transition-all duration-300 flex-shrink-0 ${
                                      isCurrent ? "scale-105 animate-pulse" : isSelected ? "animate-in zoom-in" : "hover:scale-105"
                                    }`}
                                  >
                                    <CardContent className="p-3 min-w-[120px]">
                                      <div className="flex flex-col items-center text-center space-y-1">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-foreground">{item.name}</span>
                                          {isSelected && (
                                            <span className="text-xs bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded animate-in fade-in">
                                              ✓
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          W: <span className="font-medium text-foreground">{item.weight}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          V: <span className="font-medium text-foreground">{item.value}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>

                          {/* DP Table spanning full width */}
                          <div className="w-full">
                            <h3 className="text-lg font-semibold text-foreground mb-2">DP Table:</h3>
                            <div className="overflow-x-auto w-full">
                              <table className="w-full border-collapse border border-border">
                                <thead>
                                  <tr>
                                    <th className="border border-border dark:border-border p-2 bg-secondary dark:bg-secondary text-foreground">Item</th>
                                    {[...Array(capacity + 1)].map((_, i) => (
                                      <th key={i} className={`border border-border dark:border-border p-2 bg-secondary dark:bg-secondary text-foreground transition-all ${
                                        currentWeight === i ? "bg-primary/20 dark:bg-primary/20 animate-pulse" : ""
                                      }`}>
                                        W:{i}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {dpTable.map((row, i) => (
                                    <tr key={i}>
                                      <td className={`border border-border dark:border-border p-2 font-semibold text-foreground transition-all ${
                                        currentItem === i - 1 
                                          ? "bg-primary/10 dark:bg-primary/20 animate-pulse" 
                                          : "bg-card dark:bg-card"
                                      }`}>
                                        {i === 0 ? "Empty" : items[i - 1]?.name}
                                      </td>
                                      {row.map((value, j) => {
                                        const isActive = currentItem === i - 1 && currentWeight === j;
                                        return (
                                          <td key={j} className={`border border-border dark:border-border p-2 text-center transition-all duration-300 ${
                                            isActive 
                                              ? "bg-primary/20 dark:bg-primary/30 font-bold text-primary dark:text-primary scale-110 animate-pulse shadow-md" 
                                              : "bg-card dark:bg-card text-foreground"
                                          }`}>
                                            {value}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Show final result only at the last step */}
                        {currentStep === knapsackSteps.length - 1 && selectedItems.length > 0 && (
                          <div className="space-y-2 animate-in slide-in-from-bottom duration-500">
                            <Card className="bg-primary/5 dark:bg-primary/10 border-primary dark:border-primary border-2">
                              <CardContent className="p-4">
                                <h3 className="text-lg font-semibold text-foreground mb-1">🎉 Final Result - Optimal Solution</h3>
                                <p className="text-sm text-muted-foreground">The following items maximize the total value within the capacity constraint:</p>
                              </CardContent>
                            </Card>
                            <h3 className="text-lg font-semibold text-foreground">Selected Items:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedItems.map((index, idx) => (
                                <Card 
                                  key={items[index].id} 
                                  className="bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600 animate-in zoom-in"
                                  style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-foreground">{items[index].name}</span>
                                      <span className="text-xs bg-green-500 dark:bg-green-600 text-white px-2 py-1 rounded animate-in fade-in">
                                        Included
                                      </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      Weight: <span className="font-medium text-foreground">{items[index].weight}</span>, Value: <span className="font-medium text-foreground">{items[index].value}</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <Card className="mt-2 bg-secondary dark:bg-secondary border border-border animate-in fade-in">
                              <CardContent className="p-3">
                                <p className="text-sm text-muted-foreground">Total Weight: <span className="font-bold text-foreground">{selectedItems.reduce((sum, idx) => sum + items[idx].weight, 0)}</span></p>
                                <p className="text-sm text-muted-foreground">Total Value: <span className="font-bold text-foreground text-lg">{dpTable[items.length]?.[capacity] || 0}</span></p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {knapsackSteps.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Step</p>
                          <p className="text-xl font-bold text-foreground">{currentStep + 1} / {knapsackSteps.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p className="text-xl font-bold text-foreground">{items.length}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
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
