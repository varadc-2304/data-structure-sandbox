import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

const DequeVisualizerContent = () => {
  const [deque, setDeque] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [dequeSize, setDequeSize] = useState('5');
  const [maxSize] = useState<number>(20);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationEnd, setOperationEnd] = useState<'front' | 'rear' | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationEnd(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const isFull = (): boolean => {
    return deque.length >= maxSize;
  };

  const isEmpty = (): boolean => {
    return deque.length === 0;
  };

  const getSize = (): number => {
    return deque.length;
  };

  const addFront = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    if (isFull()) {
      toast({
        title: "Deque overflow",
        description: `Cannot add. Deque is full (max size: ${maxSize})`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([newValue, ...deque]);
    setLastOperation('add');
    setOperationEnd('front');
    setNewElement('');
    
    const message = `Added "${newValue}" to the front of the deque`;
    addToLog(message);
    
    toast({
      title: "Element added",
      description: message,
    });
  };

  const addRear = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    if (isFull()) {
      toast({
        title: "Deque overflow",
        description: `Cannot add. Deque is full (max size: ${maxSize})`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([...deque, newValue]);
    setLastOperation('add');
    setOperationEnd('rear');
    setNewElement('');
    
    const message = `Added "${newValue}" to the rear of the deque`;
    addToLog(message);
    
    toast({
      title: "Element added",
      description: message,
    });
  };

  const removeFront = () => {
    if (isEmpty()) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[0];
    setDeque(deque.slice(1));
    setLastOperation('remove');
    setOperationEnd('front');
    
    const message = `Removed "${removedValue}" from the front of the deque`;
    addToLog(message);
    
    toast({
      title: "Element removed",
      description: message,
    });
  };

  const removeRear = () => {
    if (isEmpty()) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[deque.length - 1];
    setDeque(deque.slice(0, -1));
    setLastOperation('remove');
    setOperationEnd('rear');
    
    const message = `Removed "${removedValue}" from the rear of the deque`;
    addToLog(message);
    
    toast({
      title: "Element removed",
      description: message,
    });
  };

  const peekFront = () => {
    if (isEmpty()) {
      toast({
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const frontValue = deque[0];
    setLastOperation('peek');
    setOperationEnd('front');
    
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
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const rearValue = deque[deque.length - 1];
    setLastOperation('peek');
    setOperationEnd('rear');
    
    const message = `Peeked at rear element: "${rearValue}"`;
    addToLog(message);
    
    toast({
      title: "Rear element",
      description: `Rear element is "${rearValue}"`,
    });
  };

  const generateRandomDeque = () => {
    const size = Number(dequeSize);
    if (isNaN(size) || size < 5 || size > 20) {
      toast({
        title: "Invalid size",
        description: "Please enter a size between 5 and 20",
        variant: "destructive",
      });
      return;
    }

    const randomDeque = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setDeque(randomDeque);
    setLastOperation(null);
    setOperationEnd(null);
    resetHighlights();
    
    const message = `Generated random deque with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random deque generated",
      description: message,
    });
  };

  const clearDeque = () => {
    setDeque([]);
    setLastOperation(null);
    setOperationEnd(null);
    setLogs([]);
    resetHighlights();
    
    toast({
      title: "Deque cleared",
      description: "All elements have been removed from the deque",
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
      operation: 'Add Front/Rear',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
    {
      operation: 'Remove Front/Rear',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
    {
      operation: 'Peek Front/Rear',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Deque Visualization</h2>
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
                value={dequeSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 5 && Number(val) <= 20)) {
                    setDequeSize(val);
                  }
                }}
                min={5}
                max={20}
                placeholder="5"
                className="w-20 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button 
                onClick={generateRandomDeque} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Deque
              </Button>
            </div>
            <Button 
              onClick={clearDeque} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        
        {/* Deque visualization */}
        <div className="mb-6 relative overflow-hidden w-full">
          <div className="flex flex-col items-center w-full">
            {/* Horizontal Deque Container - Open from both sides */}
            <div className="flex items-center justify-center w-full">
              {/* Left opening (FRONT) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-gray-400 rounded-l-lg border-2 border-r-0 border-gray-600 relative" style={{ transform: "perspective(100px) rotateY(-5deg)" }}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-l-lg"></div>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">FRONT</div>
              </div>
              
              {/* Deque container */}
              <div className="flex-1 border-2 border-gray-600 border-x-0 bg-secondary rounded-none p-4 min-h-[120px] flex items-center overflow-x-auto">
                {deque.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Deque is empty. Add elements using the controls below.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    {deque.map((item, index) => (
                      <div key={index} className="flex items-center flex-shrink-0">
                        <div
                          className={cn(
                            "min-w-[70px] w-[70px] h-20 rounded-lg border-2 border-border bg-card flex flex-col justify-center items-center transition-all duration-300 shadow-sm",
                            {
                              "border-primary bg-primary/10 shadow-md": 
                                (lastOperation === 'add' && operationEnd === 'front' && index === 0) ||
                                (lastOperation === 'add' && operationEnd === 'rear' && index === deque.length - 1) ||
                                (lastOperation === 'remove' && operationEnd === 'front' && index === 0) ||
                                (lastOperation === 'remove' && operationEnd === 'rear' && index === deque.length - 1) ||
                                (lastOperation === 'peek' && operationEnd === 'front' && index === 0) ||
                                (lastOperation === 'peek' && operationEnd === 'rear' && index === deque.length - 1),
                              "border-border bg-card": 
                                !((lastOperation === 'add' && operationEnd === 'front' && index === 0) ||
                                  (lastOperation === 'add' && operationEnd === 'rear' && index === deque.length - 1) ||
                                  (lastOperation === 'remove' && operationEnd === 'front' && index === 0) ||
                                  (lastOperation === 'remove' && operationEnd === 'rear' && index === deque.length - 1) ||
                                  (lastOperation === 'peek' && operationEnd === 'front' && index === 0) ||
                                  (lastOperation === 'peek' && operationEnd === 'rear' && index === deque.length - 1)),
                            }
                          )}
                        >
                          <div className="text-lg font-semibold text-foreground">{item.toString()}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {index === 0 ? 'FRONT' : index === deque.length - 1 ? 'REAR' : `[${index}]`}
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
                ⚠️ Deque Overflow: Maximum size ({maxSize}) reached!
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Add Front */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Add Front</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isFull()}
              />
              <Button
                onClick={addFront}
                variant="default"
                size="sm"
                className="flex-shrink-0"
                disabled={isFull()}
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Add Rear */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Add Rear</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isFull()}
              />
              <Button
                onClick={addRear}
                variant="default"
                size="sm"
                className="flex-shrink-0"
                disabled={isFull()}
              >
                Add
              </Button>
            </div>
          </div>
          
          {/* Remove Front */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Remove Front</span>
            </h3>
            <Button
              onClick={removeFront}
              variant="default"
              size="sm"
              className="w-full"
            >
              Remove
            </Button>
          </div>
          
          {/* Remove Rear */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Remove Rear</span>
            </h3>
            <Button
              onClick={removeRear}
              variant="default"
              size="sm"
              className="w-full"
            >
              Remove
            </Button>
          </div>
          
          {/* Peek Front */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
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
              Peek
            </Button>
          </div>
          
          {/* Peek Rear */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
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
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Double-ended Queues</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A deque (double-ended queue) is a linear data structure that allows insertion and deletion at both ends. It combines the features of both stacks and queues.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Use Cases:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Palindrome checking</li>
              <li>Sliding window problems</li>
              <li>Undo/Redo operations</li>
              <li>Browser history</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Properties:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>O(1) operations at both ends</li>
              <li>Flexible insertion/deletion</li>
              <li>Can act as stack or queue</li>
              <li>Bidirectional access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DequeVisualizerContent;
