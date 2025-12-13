import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Plus, Trash, Eye, Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from "@/components/ComplexityDisplay";
import { useCircularQueueVisualizer } from "./circular-queue/useCircularQueueVisualizer";

const CircularQueueVisualizer = () => {
  const {
    state: { queue, maxSize, front, rear, newElement, queueSize, lastOperation, operationTarget, logs },
    actions: { setMaxSize, setNewElement, setQueueSize, enqueueElement, dequeueElement, peekFront, peekRear, generateRandomQueue, clearQueue, isEmpty, isFull, getSize },
  } = useCircularQueueVisualizer();

  const complexities: ComplexityInfo[] = [
    { operation: "Enqueue", timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" }, spaceComplexity: "O(1)", description: "Adds an element to the rear of the queue" },
    { operation: "Dequeue", timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" }, spaceComplexity: "O(1)", description: "Removes an element from the front of the queue" },
    { operation: "Peek", timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" }, spaceComplexity: "O(1)", description: "Views the front or rear element without removing it" },
    { operation: "Search", timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" }, spaceComplexity: "O(1)", description: "Searches for an element in the queue" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3">Circular Queue Visualizer</h1>
          <p className="text-base text-muted-foreground sm:text-lg max-w-4xl">Visualize and perform operations on a circular queue. A circular queue uses a fixed-size array and wraps around when it reaches the end, making efficient use of space.</p>
        </div>

        <div className="bg-secondary rounded-lg p-4 border-2 border-border mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Max Queue Size:</label>
            <input type="number" min="3" max="20" value={maxSize} onChange={(e) => setMaxSize(Math.max(3, Math.min(20, parseInt(e.target.value) || 10)))} className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Size: {getSize()}/{maxSize}</span>
              <span className={cn("px-2 py-1 rounded text-xs font-medium", isFull() ? "bg-destructive/20 text-destructive" : isEmpty() ? "bg-muted text-muted-foreground" : "bg-primary/20 text-primary")}>
                {isFull() ? "FULL" : isEmpty() ? "EMPTY" : "ACTIVE"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-6 border-2 border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Circular Queue Visualization</h2>
            <div className="flex gap-2">
              <input type="number" value={queueSize} onChange={(e) => setQueueSize(e.target.value)} placeholder="Size" className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button onClick={generateRandomQueue} variant="outline" size="sm">
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Random
              </Button>
              <Button onClick={clearQueue} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="mb-6 relative">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center flex-wrap gap-2 p-4 bg-background rounded-lg border-2 border-border min-h-[200px]">
                {queue.map((item, index) => {
                  const isFront = index === front && !isEmpty();
                  const isRear = index === rear && !isEmpty();
                  const isActive = item !== null;
                  const isHighlighted = operationTarget === index && lastOperation;

                  return (
                    <div key={index} className="relative">
                      <div
                        className={cn("min-w-[70px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 relative", {
                          "border-primary bg-primary/20 shadow-lg scale-110": isHighlighted,
                          "border-primary bg-primary/10": isFront || isRear,
                          "border-border bg-secondary": isActive && !isFront && !isRear && !isHighlighted,
                          "border-dashed border-muted bg-muted/20": !isActive,
                        })}
                      >
                        {isActive ? (
                          <>
                            <div className="text-lg font-bold text-foreground">{item}</div>
                            <div className="text-xs text-muted-foreground">[{index}]</div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground">Empty</div>
                        )}
                        {isFront && <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">FRONT</div>}
                        {isRear && <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">REAR</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!isEmpty() && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Circular connection: Rear wraps to Front when queue is full</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
                <Plus className="h-5 w-5 text-primary mr-2" />
                Enqueue Element
              </h3>
              <div className="flex">
                <input type="text" value={newElement} onChange={(e) => setNewElement(e.target.value)} onKeyPress={(e) => e.key === "Enter" && enqueueElement()} placeholder="Enter value" className="flex-grow px-3 py-2 border border-border rounded-l-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <Button onClick={enqueueElement} variant="default" className="rounded-l-none">
                  Enqueue
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
                <Trash className="h-5 w-5 text-primary mr-2" />
                Dequeue Element
              </h3>
              <Button onClick={dequeueElement} variant="default" className="w-full">
                Dequeue
              </Button>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
                <Eye className="h-5 w-5 text-primary mr-2" />
                Peek Front
              </h3>
              <Button onClick={peekFront} variant="outline" className="w-full">
                Peek Front
              </Button>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
                <Eye className="h-5 w-5 text-primary mr-2" />
                Peek Rear
              </h3>
              <Button onClick={peekRear} variant="outline" className="w-full">
                Peek Rear
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-foreground">Operation Logs</h3>
            <div className="bg-background border border-border rounded-lg p-4 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">No operations performed yet</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-2 p-2 bg-secondary rounded border-l-4 border-primary">
                    <span className="text-foreground">{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <ComplexityDisplay complexities={complexities} className="mb-6" />

        <div className="bg-secondary rounded-lg p-6 border-2 border-border">
          <h2 className="text-xl font-semibold mb-2 text-foreground">About Circular Queues</h2>
          <p className="text-muted-foreground mb-4">A circular queue (also known as a ring buffer) is a linear data structure that uses a fixed-size array and connects the last position back to the first position, forming a circle. This allows efficient use of space and prevents wasted memory.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-background p-3 rounded-lg border border-border">
              <span className="font-medium text-foreground">Advantages:</span>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                <li>Efficient space utilization</li>
                <li>O(1) enqueue and dequeue operations</li>
                <li>Fixed memory footprint</li>
                <li>Useful for buffering and scheduling</li>
              </ul>
            </div>
            <div className="bg-background p-3 rounded-lg border border-border">
              <span className="font-medium text-foreground">Use Cases:</span>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                <li>CPU scheduling algorithms</li>
                <li>Buffer management in OS</li>
                <li>Stream processing</li>
                <li>Event handling systems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularQueueVisualizer;
