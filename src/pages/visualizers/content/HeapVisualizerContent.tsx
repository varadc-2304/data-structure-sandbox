import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, ArrowUp, ArrowDown, RotateCcw, Layers } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

interface HeapNode {
  value: number;
  id: number;
}

const HeapVisualizerContent = () => {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [newElement, setNewElement] = useState('');
  const [heapSize, setHeapSize] = useState('');
  const [heapType, setHeapType] = useState<'min' | 'max'>('min');
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

  // Heapify up (bubble up)
  const heapifyUp = (items: HeapNode[], index: number): HeapNode[] => {
    const newItems = [...items];
    let current = index;
    
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      const shouldSwap = heapType === 'min' 
        ? newItems[current].value < newItems[parent].value
        : newItems[current].value > newItems[parent].value;
      
      if (shouldSwap) {
        [newItems[current], newItems[parent]] = [newItems[parent], newItems[current]];
        current = parent;
      } else {
        break;
      }
    }
    
    return newItems;
  };

  // Heapify down (bubble down)
  const heapifyDown = (items: HeapNode[], index: number): HeapNode[] => {
    const newItems = [...items];
    let current = index;
    
    while (true) {
      let target = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;
      
      if (heapType === 'min') {
        if (left < newItems.length && newItems[left].value < newItems[target].value) {
          target = left;
        }
        if (right < newItems.length && newItems[right].value < newItems[target].value) {
          target = right;
        }
      } else {
        if (left < newItems.length && newItems[left].value > newItems[target].value) {
          target = left;
        }
        if (right < newItems.length && newItems[right].value > newItems[target].value) {
          target = right;
        }
      }
      
      if (target !== current) {
        [newItems[current], newItems[target]] = [newItems[target], newItems[current]];
        current = target;
      } else {
        break;
      }
    }
    
    return newItems;
  };

  // Build heap from array
  const buildHeap = (items: HeapNode[]): HeapNode[] => {
    let heapified = [...items];
    // Start from the last non-leaf node
    for (let i = Math.floor(heapified.length / 2) - 1; i >= 0; i--) {
      heapified = heapifyDown(heapified, i);
    }
    return heapified;
  };

  const insertElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
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

    const newId = heap.length > 0 ? Math.max(...heap.map(h => h.id)) + 1 : 0;
    const newNode: HeapNode = { value, id: newId };
    
    const updatedHeap = [...heap, newNode];
    const heapified = heapifyUp(updatedHeap, updatedHeap.length - 1);
    setHeap(heapified);
    
    setLastOperation('insert');
    setOperationTarget(newId);
    setNewElement('');
    
    const message = `Inserted "${value}" into the ${heapType}-heap`;
    addToLog(message);
    
    toast({
      title: "Element inserted",
      description: message,
    });
  };

  const extractRoot = () => {
    if (heap.length === 0) {
      toast({
        title: "Empty heap",
        description: "Cannot extract from an empty heap",
        variant: "destructive",
      });
      return;
    }

    const root = heap[0];
    const updatedHeap = heap.slice(1);
    
    if (updatedHeap.length > 0) {
      // Move last element to root and heapify down
      const lastItem = updatedHeap[updatedHeap.length - 1];
      updatedHeap[updatedHeap.length - 1] = updatedHeap[0];
      updatedHeap[0] = lastItem;
      const heapified = heapifyDown(updatedHeap.slice(0, -1), 0);
      setHeap([...heapified, updatedHeap[updatedHeap.length - 1]]);
    } else {
      setHeap([]);
    }
    
    setLastOperation('extract');
    setOperationTarget(root.id);
    
    const message = `Extracted ${heapType === 'min' ? 'minimum' : 'maximum'} value: "${root.value}"`;
    addToLog(message);
    
    toast({
      title: "Root extracted",
      description: message,
    });
  };

  const peekRoot = () => {
    if (heap.length === 0) {
      toast({
        title: "Empty heap",
        description: "Cannot peek into an empty heap",
        variant: "destructive",
      });
      return;
    }

    const root = heap[0];
    setLastOperation('peek');
    setOperationTarget(root.id);
    
    const message = `Peeked at root: "${root.value}"`;
    addToLog(message);
    
    toast({
      title: "Root element",
      description: `${heapType === 'min' ? 'Minimum' : 'Maximum'} value: ${root.value}`,
    });
  };

  const generateRandomHeap = () => {
    if (heapSize.trim() === '' || isNaN(Number(heapSize)) || Number(heapSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for heap size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(heapSize), 15);
    const randomHeap: HeapNode[] = [];
    
    for (let i = 0; i < size; i++) {
      randomHeap.push({
        id: i,
        value: Math.floor(Math.random() * 100),
      });
    }
    
    const heapified = buildHeap(randomHeap);
    setHeap(heapified);
    setLastOperation(null);
    setOperationTarget(null);
    setHeapSize('');
    
    const message = `Generated random ${heapType}-heap with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random heap generated",
      description: message,
    });
  };

  const clearHeap = () => {
    setHeap([]);
    setLastOperation(null);
    setOperationTarget(null);
    setLogs([]);
    
    toast({
      title: "Heap cleared",
      description: "All elements have been removed from the heap",
    });
  };

  // Rebuild heap when heap type changes
  useEffect(() => {
    if (heap.length > 0) {
      const heapified = buildHeap(heap);
      setHeap(heapified);
    }
  }, [heapType]);

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
      operation: 'Insert',
      timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      description: 'Inserts an element and maintains heap property',
    },
    {
      operation: 'Extract Root',
      timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
      spaceComplexity: 'O(1)',
      description: 'Removes and returns the root element',
    },
    {
      operation: 'Peek',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Views the root element without removing it',
    },
    {
      operation: 'Build Heap',
      timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
      description: 'Builds a heap from an unsorted array',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Heap Visualization</h2>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Type:</span>
              <Button
                variant={heapType === 'min' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHeapType('min')}
                className="flex-shrink-0"
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Min-Heap
              </Button>
              <Button
                variant={heapType === 'max' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHeapType('max')}
                className="flex-shrink-0"
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Max-Heap
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={heapSize}
              onChange={(e) => setHeapSize(e.target.value)}
              placeholder="Size"
              className="w-20 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <Button 
              onClick={generateRandomHeap} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Generate Random
            </Button>
            <Button 
              onClick={clearHeap} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Heap visualization - Tree representation */}
        <div className="mb-6 relative overflow-x-auto">
          <div className="bg-secondary rounded-lg p-4 border border-border min-h-[250px]">
            {heap.length === 0 ? (
              <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Heap is empty. Add elements using the controls below.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Tree visualization */}
                <div className="space-y-4 mb-6">
                  {/* Level 0 (Root) */}
                  {heap.length > 0 && (
                    <div className="flex justify-center">
                      <div
                        className={cn(
                          "min-w-[100px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                          {
                            "border-primary bg-primary/10 shadow-md scale-110": operationTarget === heap[0].id,
                            "border-border bg-card": operationTarget !== heap[0].id,
                          }
                        )}
                      >
                        <div className="text-lg font-bold text-foreground">{heap[0].value}</div>
                        <div className="text-xs text-muted-foreground">Root</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Level 1 */}
                  {heap.length > 1 && (
                    <div className="flex justify-center gap-12">
                      {[1, 2].map((idx) => {
                        if (idx >= heap.length) return null;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={cn(
                                "min-w-[80px] h-16 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                                {
                                  "border-primary bg-primary/10 shadow-md scale-110": operationTarget === heap[idx].id,
                                  "border-border bg-card": operationTarget !== heap[idx].id,
                                }
                              )}
                            >
                              <div className="text-base font-bold text-foreground">{heap[idx].value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Level 2 */}
                  {heap.length > 3 && (
                    <div className="flex justify-center gap-6">
                      {[3, 4, 5, 6].map((idx) => {
                        if (idx >= heap.length) return null;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={cn(
                                "min-w-[70px] h-14 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 text-xs",
                                {
                                  "border-primary bg-primary/10 shadow-md scale-110": operationTarget === heap[idx].id,
                                  "border-border bg-card": operationTarget !== heap[idx].id,
                                }
                              )}
                            >
                              <div className="text-sm font-bold text-foreground">{heap[idx].value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Level 3 */}
                  {heap.length > 7 && (
                    <div className="flex justify-center gap-3">
                      {[7, 8, 9, 10, 11, 12, 13, 14].map((idx) => {
                        if (idx >= heap.length) return null;
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={cn(
                                "min-w-[60px] h-12 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 text-xs",
                                {
                                  "border-primary bg-primary/10 shadow-md scale-110": operationTarget === heap[idx].id,
                                  "border-border bg-card": operationTarget !== heap[idx].id,
                                }
                              )}
                            >
                              <div className="text-xs font-bold text-foreground">{heap[idx].value}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Array representation */}
                <div className="mt-6 w-full">
                  <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Array Representation:
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {heap.map((item, index) => (
                      <div
                        key={item.id}
                        className={cn(
                          "min-w-[70px] h-16 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                          {
                            "border-primary bg-primary/10 shadow-md": operationTarget === item.id,
                            "border-border bg-card": operationTarget !== item.id,
                          }
                        )}
                      >
                        <div className="text-sm font-bold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground">[{index}]</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Insert element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Insert Element</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={insertElement}
                variant="default"
                size="sm"
                className="flex-shrink-0"
              >
                Insert
              </Button>
            </div>
          </div>
          
          {/* Extract root */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Extract Root</span>
            </h3>
            <Button
              onClick={extractRoot}
              variant="default"
              size="sm"
              className="w-full"
            >
              Extract {heapType === 'min' ? 'Min' : 'Max'}
            </Button>
          </div>
          
          {/* Peek root */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Peek Root</span>
            </h3>
            <Button
              onClick={peekRoot}
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
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Heaps</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A heap is a complete binary tree that satisfies the heap property. In a min-heap, the parent is always smaller than its children. In a max-heap, the parent is always larger.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Properties:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Complete binary tree</li>
              <li>Heap property maintained</li>
              <li>Array-based implementation</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Use Cases:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Priority queues</li>
              <li>Heap sort algorithm</li>
              <li>Graph algorithms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualizerContent;
