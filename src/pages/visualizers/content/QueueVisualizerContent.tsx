import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, Search, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

const QueueVisualizerContent = () => {
  const [queue, setQueue] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [queueSize, setQueueSize] = useState('5');
  const [maxSize] = useState<number>(20);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const isFull = (): boolean => {
    return queue.length >= maxSize;
  };

  const isEmpty = (): boolean => {
    return queue.length === 0;
  };

  const getSize = (): number => {
    return queue.length;
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
    setQueue([...queue, newValue]);
    setLastOperation('enqueue');
    setOperationTarget(queue.length);
    setNewElement('');
    
    const message = `Enqueued "${newValue}" to the back of the queue`;
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

    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setLastOperation('dequeue');
    setOperationTarget(0);
    
    const message = `Dequeued "${dequeuedValue}" from the front of the queue`;
    addToLog(message);
    
    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekElement = () => {
    if (isEmpty()) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const frontValue = queue[0];
    setLastOperation('peek');
    setOperationTarget(0);
    
    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);
    
    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
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

    const randomQueue = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setQueue(randomQueue);
    setLastOperation(null);
    setOperationTarget(null);
    resetHighlights();
    
    const message = `Generated random queue with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random queue generated",
      description: message,
    });
  };

  const searchInQueue = async () => {
    if (searchValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    if (queue.length === 0) {
      toast({
        title: "Empty queue",
        description: "Cannot search in an empty queue",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchIndex(null);
    setFoundIndex(null);
    const searchVal = !isNaN(Number(searchValue)) ? Number(searchValue) : searchValue;
    let found = false;
    let foundIdx = -1;

    // Traverse queue from front to rear
    for (let i = 0; i < queue.length; i++) {
      setSearchIndex(i);
      setOperationTarget(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (queue[i] === searchVal) {
        found = true;
        foundIdx = i;
        setFoundIndex(i);
        break;
      }
    }

    if (found) {
      const message = `Found "${searchVal}" at position ${foundIdx} (${foundIdx === 0 ? 'FRONT' : foundIdx === queue.length - 1 ? 'REAR' : 'middle'})`;
      addToLog(message);
      toast({
        title: "Element found",
        description: message,
      });
      
      // Remove highlight after 5 seconds
      setTimeout(() => {
        setFoundIndex(null);
      }, 5000);
    } else {
      const message = `Element "${searchVal}" not found in queue`;
      addToLog(message);
      toast({
        title: "Element not found",
        description: message,
        variant: "destructive",
      });
    }

    setIsSearching(false);
    setSearchIndex(null);
  };

  const clearQueue = () => {
    setQueue([]);
    setLastOperation(null);
    setOperationTarget(null);
    setIsSearching(false);
    setSearchIndex(null);
    setFoundIndex(null);
    setSearchValue("");
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
    },
    {
      operation: 'Dequeue',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
    {
      operation: 'Peek',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
    {
      operation: 'Search',
      timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Queue Visualization</h2>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Size: {getSize()}/{maxSize}</span>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
                  isFull() ? "bg-destructive/20 text-destructive" : 
                  isEmpty() ? "bg-muted text-muted-foreground" : 
                  "bg-primary/20 text-primary"
                )}>
                  {isFull() ? 'FULL' : isEmpty() ? 'EMPTY' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
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
                disabled={isSearching}
              />
              <Button 
                onClick={generateRandomQueue} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isSearching}
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
              disabled={isSearching}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Queue visualization */}
        <div className="mb-6 relative overflow-hidden w-full">
          <div className="flex flex-col items-center w-full">
            {/* Horizontal Queue Container - Open from both sides */}
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
                    <span>Queue is empty. Enqueue elements using the controls below.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    {queue.map((item, index) => (
                      <div key={index} className="flex items-center flex-shrink-0">
                        <div
                          className={cn(
                            "min-w-[70px] w-[70px] h-20 rounded-lg border-2 border-border bg-card flex flex-col justify-center items-center transition-all duration-300 shadow-sm",
                            {
                              "border-primary bg-primary/10 shadow-md": 
                                (lastOperation === 'enqueue' && index === queue.length - 1) ||
                                (lastOperation === 'dequeue' && index === 0) ||
                                (lastOperation === 'peek' && index === 0),
                              "border-blue-500 bg-blue-100": searchIndex === index && isSearching,
                              "border-green-500 bg-green-200 shadow-lg": foundIndex === index,
                              "border-border bg-card": 
                                !((lastOperation === 'enqueue' && index === queue.length - 1) ||
                                  (lastOperation === 'dequeue' && index === 0) ||
                                  (lastOperation === 'peek' && index === 0) ||
                                  (searchIndex === index && isSearching) ||
                                  (foundIndex === index)),
                            }
                          )}
                        >
                          <div className="text-lg font-semibold text-foreground">{item.toString()}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {index === 0 ? 'FRONT' : index === queue.length - 1 ? 'REAR' : `[${index}]`}
                          </div>
                        </div>
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
            
            {isFull() && (
              <div className="mt-2 text-sm text-destructive font-medium">
                ⚠️ Queue Overflow: Maximum size ({maxSize}) reached!
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Enqueue element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Enqueue Element</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isSearching}
              />
              <Button
                onClick={enqueueElement}
                variant="default"
                size="sm"
                className="flex-shrink-0"
                disabled={isFull() || isSearching}
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
              disabled={isSearching}
            >
              Dequeue
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
              disabled={isSearching}
            >
              Peek
            </Button>
          </div>

          {/* Search element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Search Element</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isSearching}
              />
              <Button
                onClick={searchInQueue}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
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
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Queues</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A queue is a linear data structure that follows the FIFO (First In, First Out) principle. Elements are added at the rear and removed from the front. It is useful in scheduling, buffering, and handling requests in order. Queues provide efficient insertions and deletions but do not allow random access.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Use Cases:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Task scheduling</li>
              <li>Breadth-first search</li>
              <li>Print queue management</li>
              <li>Message queues</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Properties:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>FIFO principle</li>
              <li>O(1) enqueue/dequeue</li>
              <li>Front and rear pointers</li>
              <li>Overflow/Underflow conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizerContent;
