import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, ArrowUp, ArrowDown, X, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

interface PriorityQueueItem {
  value: number;
  priority: number;
  id: number;
}

const PriorityQueueVisualizerContent = () => {
  const [queue, setQueue] = useState<PriorityQueueItem[]>([]);
  const [newElement, setNewElement] = useState('');
  const [queueSize, setQueueSize] = useState('5');
  const [queueType, setQueueType] = useState<'min' | 'max'>('min');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  // Maintain heap property (min or max heap) - Heapify Up
  const heapifyUp = (items: PriorityQueueItem[], index: number): PriorityQueueItem[] => {
    const newItems = [...items];
    let current = index;
    
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      const shouldSwap = queueType === 'min' 
        ? newItems[current].priority < newItems[parent].priority
        : newItems[current].priority > newItems[parent].priority;
      
      if (shouldSwap) {
        [newItems[current], newItems[parent]] = [newItems[parent], newItems[current]];
        current = parent;
      } else {
        break;
      }
    }
    
    return newItems;
  };

  // MIN_HEAPIFY or MAX_HEAPIFY - Heapify Down
  // Algorithm adapted for 0-based indexing (left = 2*i+1, right = 2*i+2)
  const heapifyDown = (items: PriorityQueueItem[], index: number): PriorityQueueItem[] => {
    const newItems = [...items];
    const heapSize = newItems.length;
    
    if (queueType === 'min') {
      // MIN_HEAPIFY(A, i) - adapted for 0-based indexing
      const left = 2 * index + 1;   // 0-based: left = 2*i + 1 (was 2*i in 1-based)
      const right = 2 * index + 2;  // 0-based: right = 2*i + 2 (was 2*i+1 in 1-based)
      let smallest = index;
      
      // if left ≤ heap_size and A[left] < A[smallest]
      if (left < heapSize && newItems[left].priority < newItems[smallest].priority) {
        smallest = left;
      }
      
      // if right ≤ heap_size and A[right] < A[smallest]
      if (right < heapSize && newItems[right].priority < newItems[smallest].priority) {
        smallest = right;
      }
      
      // if smallest ≠ i
      if (smallest !== index) {
        // swap A[i] with A[smallest]
        [newItems[index], newItems[smallest]] = [newItems[smallest], newItems[index]];
        // MIN_HEAPIFY(A, smallest) - recursive call
        return heapifyDown(newItems, smallest);
      }
    } else {
      // MAX_HEAPIFY(A, i) - adapted for 0-based indexing
      const left = 2 * index + 1;   // 0-based: left = 2*i + 1
      const right = 2 * index + 2;  // 0-based: right = 2*i + 2
      let largest = index;
      
      // if left ≤ heap_size and A[left] > A[largest]
      if (left < heapSize && newItems[left].priority > newItems[largest].priority) {
        largest = left;
      }
      
      // if right ≤ heap_size and A[right] > A[largest]
      if (right < heapSize && newItems[right].priority > newItems[largest].priority) {
        largest = right;
      }
      
      // if largest ≠ i
      if (largest !== index) {
        // swap A[i] with A[largest]
        [newItems[index], newItems[largest]] = [newItems[largest], newItems[index]];
        // MAX_HEAPIFY(A, largest) - recursive call
        return heapifyDown(newItems, largest);
      }
    }
    
    return newItems;
  };

  const enqueueElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value",
        variant: "destructive",
      });
      return;
    }

    const value = Number(newElement);
    
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    // Priority is automatically set equal to the value
    const priorityValue = value;
    const newId = queue.length > 0 ? Math.max(...queue.map(q => q.id)) + 1 : 0;
    const newItem: PriorityQueueItem = { value, priority: priorityValue, id: newId };
    
    const updatedQueue = [...queue, newItem];
    const heapified = heapifyUp(updatedQueue, updatedQueue.length - 1);
    setQueue(heapified);
    
    setLastOperation('enqueue');
    setOperationTarget(newId);
    setNewElement('');
    
    const message = `Enqueued "${value}" with priority ${priorityValue}`;
    addToLog(message);
    
    toast({
      title: "Element enqueued",
      description: message,
    });
  };

  const dequeueElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Queue underflow",
        description: "Cannot dequeue from an empty priority queue",
        variant: "destructive",
      });
      return;
    }

    const topItem = queue[0];
    
    if (queue.length === 1) {
      setQueue([]);
    } else {
      // Move last element to root
      const updatedQueue = [...queue];
      updatedQueue[0] = updatedQueue[updatedQueue.length - 1];
      updatedQueue.pop();
      
      // Heapify down from root
      const heapified = heapifyDown(updatedQueue, 0);
      setQueue(heapified);
    }
    
    setLastOperation('dequeue');
    setOperationTarget(topItem.id);
    
    const message = `Dequeued "${topItem.value}" with priority ${topItem.priority}`;
    addToLog(message);
    
    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty priority queue",
        variant: "destructive",
      });
      return;
    }

    const topItem = queue[0];
    setLastOperation('peek');
    setOperationTarget(topItem.id);
    
    const message = `Peeked at top element: "${topItem.value}" (priority: ${topItem.priority})`;
    addToLog(message);
    
    toast({
      title: "Top element",
      description: `Value: ${topItem.value}, Priority: ${topItem.priority}`,
    });
  };

  const generateRandomQueue = () => {
    const size = Number(queueSize);
    if (isNaN(size) || size < 5 || size > 20) {
      toast({
        title: "Invalid size",
        description: "Please enter a size between 5 and 20",
        variant: "destructive",
      });
      return;
    }

    const randomQueue: PriorityQueueItem[] = [];
    
    for (let i = 0; i < size; i++) {
      const value = Math.floor(Math.random() * 100);
      // Priority is automatically set equal to the value
      randomQueue.push({
        id: i,
        value: value,
        priority: value,
      });
    }
    
    // Build heap from array - start from last non-leaf node
    // This ensures root will have min (for min heap) or max (for max heap)
    let heapified = [...randomQueue];
    const n = heapified.length;
    const lastNonLeaf = Math.floor((n - 1) / 2); // Last non-leaf node index
    
    // Build heap from bottom up - heapify down from each non-leaf node
    // This ensures root will have the minimum priority (min heap) or maximum priority (max heap)
    for (let i = lastNonLeaf; i >= 0; i--) {
      heapified = heapifyDown(heapified, i);
    }
    
    setQueue(heapified);
    setLastOperation(null);
    setOperationTarget(null);
    
    const message = `Generated random priority queue with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random queue generated",
      description: message,
    });
  };

  const clearQueue = () => {
    setQueue([]);
    setLastOperation(null);
    setOperationTarget(null);
    setLogs([]);
    setNewElement('');
    
    toast({
      title: "Queue cleared",
      description: "All elements have been removed from the priority queue",
    });
  };

  // Rebuild heap when queue type changes
  useEffect(() => {
    if (queue.length > 0) {
      // Rebuild entire heap with new type
      // Start from the last non-leaf node and heapify down
      // This ensures root will have min (min heap) or max (max heap)
      let heapified = [...queue];
      const n = heapified.length;
      const lastNonLeaf = Math.floor((n - 1) / 2); // Last non-leaf node index
      
      // Build heap from bottom up - heapify down from each non-leaf node
      for (let i = lastNonLeaf; i >= 0; i--) {
        heapified = heapifyDown(heapified, i);
      }
      
      setQueue(heapified);
      resetHighlights();
    }
  }, [queueType]);

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation]);

  const complexities: ComplexityInfo[] = [
    {
      operation: 'Enqueue',
      timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element with priority and maintains heap property',
    },
    {
      operation: 'Dequeue',
      timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      description: 'Removes the element with highest/lowest priority',
    },
    {
      operation: 'Peek',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Views the top priority element without removing it',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Priority Queue Visualization</h2>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Type:</span>
              <Button
                variant={queueType === 'min' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQueueType('min')}
                className="flex-shrink-0"
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Min-Heap
              </Button>
              <Button
                variant={queueType === 'max' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setQueueType('max')}
                className="flex-shrink-0"
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Max-Heap
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={queueSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 5 && Number(val) <= 20)) {
                    setQueueSize(val);
                  }
                }}
                min={5}
                max={20}
                placeholder="5"
                className="w-20 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button 
                onClick={generateRandomQueue} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Queue
              </Button>
            </div>
            <Button 
              onClick={clearQueue} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Priority Queue visualization - Queue on left, Tree on right */}
        <div className="mb-6 relative overflow-x-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side: Queue-like structure */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">Queue Representation</h3>
              <div className="flex flex-col items-center w-full">
                {/* Horizontal Queue Container */}
                <div className="flex items-center justify-center w-full">
                  {/* Left opening (FRONT) */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-3 bg-gray-400 rounded-l-lg border-2 border-r-0 border-gray-600 relative" style={{ transform: "perspective(100px) rotateY(-5deg)" }}>
                      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-l-lg"></div>
                    </div>
                    <div className="text-xs font-semibold text-primary mt-1">FRONT</div>
                  </div>
                  
                  {/* Queue container */}
                  <div className="flex-1 border-2 border-gray-600 border-x-0 bg-secondary rounded-none p-4 min-h-[120px] flex items-center overflow-x-auto">
                    {queue.length === 0 ? (
                      <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        <span>Priority queue is empty.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {queue.map((item, index) => (
                          <div key={item.id} className="flex items-center flex-shrink-0">
                            <div
                              className={cn(
                                "min-w-[80px] w-[80px] h-20 rounded-lg border-2 border-border bg-card flex flex-col justify-center items-center transition-all duration-300 shadow-sm",
                                {
                                  "border-primary bg-primary/10 shadow-md": operationTarget === item.id,
                                  "border-border bg-card": operationTarget !== item.id,
                                }
                              )}
                            >
                              <div className="text-lg font-semibold text-foreground">{item.value}</div>
                              <div className="text-xs text-muted-foreground mt-1">P: {item.priority}</div>
                              <div className="text-xs text-muted-foreground">
                                {index === 0 ? 'TOP' : `[${index}]`}
                              </div>
                            </div>
                            {index < queue.length - 1 && (
                              <ArrowRight className="h-4 w-4 text-gray-400 mx-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Right opening (REAR) */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-3 bg-gray-400 rounded-r-lg border-2 border-l-0 border-gray-600 relative" style={{ transform: "perspective(100px) rotateY(5deg)" }}>
                      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-l from-gray-500 to-gray-400 rounded-r-lg"></div>
                    </div>
                    <div className="text-xs font-semibold text-primary mt-1">REAR</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tree structure (Heap) */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">Heap Tree Structure ({queueType === 'min' ? 'Min-Heap' : 'Max-Heap'})</h3>
              <div className="bg-secondary rounded-lg p-4 border border-border min-h-[200px]">
                {queue.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Heap is empty.</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Tree visualization */}
                    <div className="space-y-4">
                      {/* Level 0 (Root) */}
                      {queue.length > 0 && (
                        <div className="flex justify-center">
                          <div
                            className={cn(
                              "min-w-[100px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                              {
                                "border-primary bg-primary/10 shadow-md scale-110": operationTarget === queue[0].id,
                                "border-amber-500 bg-amber-100": operationTarget !== queue[0].id,
                              }
                            )}
                          >
                            <div className="text-lg font-bold text-foreground">{queue[0].value}</div>
                            <div className="text-xs text-muted-foreground">P: {queue[0].priority}</div>
                            <div className="text-xs text-muted-foreground">Root</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Level 1 */}
                      {queue.length > 1 && (
                        <div className="flex justify-center gap-8">
                          {[1, 2].map((idx) => {
                            if (idx >= queue.length) return null;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                {/* Connection line from parent */}
                                <div className="h-4 w-0.5 bg-gray-400 mb-1"></div>
                                <div
                                  className={cn(
                                    "min-w-[80px] h-16 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                                    {
                                      "border-primary bg-primary/10 shadow-md scale-110": operationTarget === queue[idx].id,
                                      "border-border bg-card": operationTarget !== queue[idx].id,
                                    }
                                  )}
                                >
                                  <div className="text-base font-bold text-foreground">{queue[idx].value}</div>
                                  <div className="text-xs text-muted-foreground">P: {queue[idx].priority}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Level 2 */}
                      {queue.length > 3 && (
                        <div className="flex justify-center gap-4">
                          {[3, 4, 5, 6].map((idx) => {
                            if (idx >= queue.length) return null;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                {/* Connection line from parent */}
                                <div className="h-4 w-0.5 bg-gray-400 mb-1"></div>
                                <div
                                  className={cn(
                                    "min-w-[70px] h-14 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 text-xs",
                                    {
                                      "border-primary bg-primary/10 shadow-md scale-110": operationTarget === queue[idx].id,
                                      "border-border bg-card": operationTarget !== queue[idx].id,
                                    }
                                  )}
                                >
                                  <div className="text-sm font-bold text-foreground">{queue[idx].value}</div>
                                  <div className="text-xs text-muted-foreground">P: {queue[idx].priority}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Level 3 */}
                      {queue.length > 7 && (
                        <div className="flex justify-center gap-2">
                          {[7, 8, 9, 10, 11, 12, 13, 14].map((idx) => {
                            if (idx >= queue.length) return null;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className="h-4 w-0.5 bg-gray-400 mb-1"></div>
                                <div
                                  className={cn(
                                    "min-w-[60px] h-12 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 text-xs",
                                    {
                                      "border-primary bg-primary/10 shadow-md scale-110": operationTarget === queue[idx].id,
                                      "border-border bg-card": operationTarget !== queue[idx].id,
                                    }
                                  )}
                                >
                                  <div className="text-xs font-bold text-foreground">{queue[idx].value}</div>
                                  <div className="text-[10px] text-muted-foreground">P:{queue[idx].priority}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Enqueue element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Enqueue Element</span>
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Value (Priority = Value)"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <div className="text-xs text-muted-foreground">
                Priority will be automatically set equal to the value
              </div>
              <Button
                onClick={enqueueElement}
                variant="default"
                size="sm"
                className="w-full"
              >
                Enqueue
              </Button>
            </div>
          </div>
          
          {/* Dequeue element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Dequeue Element</span>
            </h3>
            <Button
              onClick={dequeueElement}
              variant="default"
              size="sm"
              className="w-full"
            >
              Dequeue {queueType === 'min' ? 'Min' : 'Max'}
            </Button>
          </div>
          
          {/* Peek element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Peek Element</span>
            </h3>
            <Button
              onClick={peekElement}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Peek
            </Button>
          </div>
        </div>

        {/* Operation Logs */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-foreground">Operation Logs</h3>
          <div className="bg-secondary border border-border rounded-lg p-2 h-32 overflow-y-auto text-sm">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No operations performed yet
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1 pb-1 border-b border-border last:border-0 text-foreground">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ComplexityDisplay complexities={complexities} className="mb-6" />
      
      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Priority Queues</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A priority queue is a data structure where each element has a priority. Elements are served based on priority rather than insertion order. It's typically implemented using a heap data structure.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Types:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Min-Heap: Lower priority = higher priority</li>
              <li>Max-Heap: Higher priority = higher priority</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Use Cases:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Task scheduling</li>
              <li>Dijkstra's algorithm</li>
              <li>Event simulation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityQueueVisualizerContent;
