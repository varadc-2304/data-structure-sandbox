import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

const CircularQueueVisualizerContent = () => {
  const [queue, setQueue] = useState<(number | string | null)[]>([]);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [front, setFront] = useState<number>(-1);
  const [rear, setRear] = useState<number>(-1);
  const [newElement, setNewElement] = useState('');
  const [queueSize, setQueueSize] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  // Initialize queue with null values
  useEffect(() => {
    if (maxSize > 0) {
      setQueue(Array(maxSize).fill(null));
      setFront(-1);
      setRear(-1);
    }
  }, [maxSize]);

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const isEmpty = (): boolean => {
    return front === -1;
  };

  const isFull = (): boolean => {
    return (rear + 1) % maxSize === front;
  };

  const getSize = (): number => {
    if (isEmpty()) return 0;
    if (front <= rear) {
      return rear - front + 1;
    }
    return maxSize - front + rear + 1;
  };

  const enqueueElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to enqueue",
        variant: "destructive",
      });
      return;
    }

    if (isFull()) {
      toast({
        title: "Queue overflow",
        description: `Cannot enqueue. Queue is full (max size: ${maxSize})`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newQueue = [...queue];
    
    if (isEmpty()) {
      setFront(0);
      setRear(0);
      newQueue[0] = newValue;
    } else {
      setRear((rear + 1) % maxSize);
      newQueue[(rear + 1) % maxSize] = newValue;
    }
    
    setQueue(newQueue);
    setLastOperation('enqueue');
    setOperationTarget(rear === -1 ? 0 : (rear + 1) % maxSize);
    setNewElement('');
    
    const message = `Enqueued "${newValue}" at position ${rear === -1 ? 0 : (rear + 1) % maxSize}`;
    addToLog(message);
    
    toast({
      title: "Element enqueued",
      description: message,
    });
  };

  const dequeueElement = () => {
    if (isEmpty()) {
      toast({
        title: "Queue underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive",
      });
      return;
    }

    const dequeuedValue = queue[front];
    const newQueue = [...queue];
    newQueue[front] = null;
    
    if (front === rear) {
      setFront(-1);
      setRear(-1);
    } else {
      setFront((front + 1) % maxSize);
    }
    
    setQueue(newQueue);
    setLastOperation('dequeue');
    setOperationTarget(front);
    
    const message = `Dequeued "${dequeuedValue}" from position ${front}`;
    addToLog(message);
    
    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekFront = () => {
    if (isEmpty()) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const frontValue = queue[front];
    setLastOperation('peek');
    setOperationTarget(front);
    
    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);
    
    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
    });
  };

  const peekRear = () => {
    if (isEmpty()) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const rearValue = queue[rear];
    setLastOperation('peek-rear');
    setOperationTarget(rear);
    
    const message = `Peeked at rear element: "${rearValue}"`;
    addToLog(message);
    
    toast({
      title: "Rear element",
      description: `Rear element is "${rearValue}"`,
    });
  };

  const generateRandomQueue = () => {
    if (queueSize.trim() === '' || isNaN(Number(queueSize)) || Number(queueSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for queue size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(queueSize), maxSize);
    const randomQueue = Array(maxSize).fill(null);
    let newFront = 0;
    let newRear = size - 1;
    
    for (let i = 0; i < size; i++) {
      randomQueue[i] = Math.floor(Math.random() * 100);
    }
    
    setQueue(randomQueue);
    setFront(newFront);
    setRear(newRear);
    setLastOperation(null);
    setQueueSize('');
    resetHighlights();
    
    const message = `Generated random circular queue with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random queue generated",
      description: `Generated random circular queue with ${size} elements`,
    });
  };

  const clearQueue = () => {
    setQueue(Array(maxSize).fill(null));
    setFront(-1);
    setRear(-1);
    setLastOperation(null);
    setOperationTarget(null);
    setLogs([]);
    resetHighlights();
    
    toast({
      title: "Queue cleared",
      description: "All elements have been removed from the queue",
    });
  };

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
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element to the rear of the queue',
    },
    {
      operation: 'Dequeue',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Removes an element from the front of the queue',
    },
    {
      operation: 'Peek',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Views the front or rear element without removing it',
    },
  ];

  return (
    <div>
      {/* Max Size Configuration */}
      <div className="bg-secondary rounded-lg p-4 border-2 border-border mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">Max Queue Size:</label>
          <input
            type="number"
            min="3"
            max="20"
            value={maxSize}
            onChange={(e) => {
              const newSize = Math.max(3, Math.min(20, parseInt(e.target.value) || 10));
              setMaxSize(newSize);
            }}
            className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Size: {getSize()}/{maxSize}</span>
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              isFull() ? "bg-destructive/20 text-destructive" : 
              isEmpty() ? "bg-muted text-muted-foreground" : 
              "bg-primary/20 text-primary"
            )}>
              {isFull() ? 'FULL' : isEmpty() ? 'EMPTY' : 'ACTIVE'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary rounded-lg p-6 border-2 border-border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Circular Queue Visualization</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={queueSize}
              onChange={(e) => setQueueSize(e.target.value)}
              placeholder="Size"
              className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              onClick={generateRandomQueue} 
              variant="outline"
              size="sm"
            >
              <Shuffle className="h-4 w-4 mr-2" />
              Generate Random
            </Button>
            <Button
              onClick={clearQueue}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Circular Queue visualization */}
        <div className="mb-6 relative">
          <div className="flex flex-col items-center">
              <div className="flex items-center justify-center flex-wrap gap-2 p-4 bg-background rounded-lg border-2 border-border min-h-[200px] w-full overflow-x-auto">
              {queue.map((item, index) => {
                const isFront = index === front && !isEmpty();
                const isRear = index === rear && !isEmpty();
                const isActive = item !== null;
                const isHighlighted = operationTarget === index && lastOperation;
                
                  return (
                    <div key={index} className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "min-w-[70px] w-[70px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 relative",
                        {
                          "border-primary bg-primary/20 shadow-lg scale-110": isHighlighted,
                          "border-primary bg-primary/10": isFront || isRear,
                          "border-border bg-secondary": isActive && !isFront && !isRear && !isHighlighted,
                          "border-dashed border-muted bg-muted/20": !isActive,
                        }
                      )}
                    >
                      {isActive ? (
                        <>
                          <div className="text-lg font-bold text-foreground">{item}</div>
                          <div className="text-xs text-muted-foreground">[{index}]</div>
                        </>
                      ) : (
                        <div className="text-xs text-muted-foreground">Empty</div>
                      )}
                      {isFront && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">
                          FRONT
                        </div>
                      )}
                      {isRear && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">
                          REAR
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Circular connection visualization */}
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Enqueue element */}
          <div className="bg-background rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Enqueue Element</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && enqueueElement()}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button
                onClick={enqueueElement}
                variant="default"
                size="sm"
                className="flex-shrink-0"
              >
                Enqueue
              </Button>
            </div>
          </div>
          
          {/* Dequeue element */}
          <div className="bg-background rounded-xl p-4 border border-border w-full min-w-0">
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
              Dequeue
            </Button>
          </div>

          {/* Peek Front */}
          <div className="bg-background rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Peek Front</span>
            </h3>
            <Button
              onClick={peekFront}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Peek Front
            </Button>
          </div>

          {/* Peek Rear */}
          <div className="bg-background rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Peek Rear</span>
            </h3>
            <Button
              onClick={peekRear}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Peek Rear
            </Button>
          </div>
        </div>

        {/* Operation Logs */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-foreground">Operation Logs</h3>
          <div className="bg-background border border-border rounded-lg p-4 h-32 overflow-y-auto text-sm">
            {logs.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No operations performed yet
              </div>
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

      {/* Complexity Display */}
      <ComplexityDisplay complexities={complexities} className="mb-6" />
      
      <div className="bg-secondary rounded-lg p-6 border-2 border-border">
        <h2 className="text-xl font-semibold mb-2 text-foreground">About Circular Queues</h2>
        <p className="text-muted-foreground mb-4">
          A circular queue (also known as a ring buffer) is a linear data structure that uses a fixed-size array and connects the last position back to the first position, forming a circle. This allows efficient use of space and prevents wasted memory.
        </p>
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
  );
};

export default CircularQueueVisualizerContent;
