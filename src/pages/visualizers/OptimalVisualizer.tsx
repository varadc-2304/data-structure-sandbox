import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOptimalVisualizer } from "./optimal/useOptimalVisualizer";

const OptimalVisualizer = () => {
  const {
    state: { frames, referenceString, currentStep, isRunning, newPage, memory, pageFaults, pageHits, hitRate, faultRate },
    actions: { setFrames, setNewPage, addPage, removePage, toggleSimulation, initializeSimulation },
  } = useOptimalVisualizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard/page-replacement" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Page Replacement
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Optimal Page Replacement</h1>
          <p className="text-muted-foreground">Visualize the Optimal page replacement algorithm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Frames:</label>
                  <Input type="number" min="1" max="10" value={frames} onChange={(e) => setFrames(Number(e.target.value))} className="w-32" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reference String:</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {referenceString.map((page, index) => (
                      <div key={index} className="flex items-center">
                        <Badge variant={index === currentStep ? "default" : index < currentStep ? "secondary" : "outline"} className="text-sm px-3 py-1">
                          {page}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => removePage(index)} className="ml-1 h-6 w-6 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Add page" value={newPage} onChange={(e) => setNewPage(e.target.value)} className="w-32" />
                    <Button onClick={addPage} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={toggleSimulation} className="flex items-center gap-2" disabled={isRunning}>
                    {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                  <Button onClick={initializeSimulation} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Frames</CardTitle>
                <CardDescription>Current state of memory frames</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: frames }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-16">Frame {index + 1}:</span>
                      <div className="w-16 h-16 border-2 border-primary rounded-lg flex items-center justify-center bg-card">
                        {memory[index] !== null ? <span className="text-lg font-bold text-primary">{memory[index]}</span> : <span className="text-muted-foreground">Empty</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{pageFaults}</div>
                  <div className="text-sm text-muted-foreground">Page Faults</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{pageHits}</div>
                  <div className="text-sm text-muted-foreground">Page Hits</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{hitRate}%</div>
                  <div className="text-sm text-muted-foreground">Hit Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{faultRate}%</div>
                  <div className="text-sm text-muted-foreground">Fault Rate</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Optimal Algorithm:</strong>
                  </p>
                  <p>Replaces the page that will not be used for the longest period of time in the future.</p>
                  <p>
                    <strong>Time Complexity:</strong> O(n²)
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(1)
                  </p>
                  <p>
                    <strong>Note:</strong> This is a theoretical algorithm that provides the minimum number of page faults but is not practical in real systems as it requires future knowledge.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimalVisualizer;
