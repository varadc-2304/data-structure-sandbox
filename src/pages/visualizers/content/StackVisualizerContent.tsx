import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowDown, Shuffle, Search, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

const StackVisualizerContent = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [stackSize, setStackSize] = useState('5');
  const [maxSize] = useState<number>(20);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isViewing, setIsViewing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [removedElements, setRemovedElements] = useState<(number | string)[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [foundValue, setFoundValue] = useState<number | string | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsViewing(false);
    setIsSearching(false);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const isFull = (): boolean => {
    return stack.length >= maxSize;
  };

  const getSize = (): number => {
    return stack.length;
  };

  const pushElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to push",
        variant: "destructive",
      });
      return;
    }

    if (isFull()) {
      toast({
        title: "Stack overflow",
        description: `Cannot push. Stack is full (max size: ${maxSize})`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setStack([...stack, newValue]);
    setLastOperation('push');
    setOperationTarget(stack.length);
    setNewElement('');
    
    const message = `Pushed "${newValue}" to the top of the stack`;
    addToLog(message);
    
    toast({
      title: "Element pushed",
      description: message,
    });
  };

  const popElement = () => {
    if (stack.length === 0) {
      toast({
        title: "Stack underflow",
        description: "Cannot pop from an empty stack",
        variant: "destructive",
      });
      return;
    }

    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setLastOperation('pop');
    setOperationTarget(stack.length - 1);
    
    const message = `Popped "${poppedValue}" from the top of the stack`;
    addToLog(message);
    
    toast({
      title: "Element popped",
      description: message,
    });
  };

  const peekElement = () => {
    if (stack.length === 0) {
      toast({
        title: "Empty stack",
        description: "Cannot peek into an empty stack",
        variant: "destructive",
      });
      return;
    }

    const topValue = stack[stack.length - 1];
    setLastOperation('peek');
    setOperationTarget(stack.length - 1);
    
    const message = `Peeked at top element: "${topValue}"`;
    addToLog(message);
    
    toast({
      title: "Top element",
      description: `Top element is "${topValue}"`,
    });
  };

  const searchInStack = async () => {
    if (searchValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    if (stack.length === 0) {
      toast({
        title: "Empty stack",
        description: "Cannot search in an empty stack",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    const searchVal = !isNaN(Number(searchValue)) ? Number(searchValue) : searchValue;
    const originalStack = [...stack];
    const removed: (number | string)[] = [];
    let found = false;
    let foundIdx = -1;

    // Remove elements one by one with animation
    for (let i = originalStack.length - 1; i >= 0; i--) {
      // Highlight the element being removed
      setOperationTarget(i);
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const element = originalStack[i];
      removed.unshift(element);
      setRemovedElements([...removed]);
      setStack(originalStack.slice(0, i));
      
      // Small delay to show the element in the pile
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      if (element === searchVal) {
        found = true;
        foundIdx = i;
        setFoundIndex(i);
        setFoundValue(element);
        break;
      }
    }
    
    setOperationTarget(null);

    if (found) {
      const positionFromTop = originalStack.length - foundIdx - 1;
      const message = `Found "${searchVal}" at position ${positionFromTop} from top`;
      addToLog(message);
      toast({
        title: "Element found",
        description: message,
      });
    } else {
      const message = `Element "${searchVal}" not found in stack`;
      addToLog(message);
      toast({
        title: "Element not found",
        description: message,
        variant: "destructive",
      });
    }

    setIsSearching(false);
  };

  const restoreStack = () => {
    if (removedElements.length === 0) return;
    
    const restored = [...stack, ...removedElements];
    setStack(restored);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    setSearchValue("");
    addToLog("Stack restored with all elements");
    toast({
      title: "Stack restored",
      description: "All elements have been restored to the stack",
    });
  };

  const generateRandomStack = () => {
    const size = Number(stackSize);
    if (isNaN(size) || size < 5 || size > 20) {
      toast({
        title: "Invalid size",
        description: "Please enter a size between 5 and 20",
        variant: "destructive",
      });
      return;
    }

    const randomStack = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setStack(randomStack);
    setLastOperation(null);
    setOperationTarget(null);
    resetHighlights();
    
    const message = `Generated random stack with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random stack generated",
      description: message,
    });
  };

  const clearStack = () => {
    setStack([]);
    setLastOperation(null);
    setOperationTarget(null);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    setIsSearching(false);
    setSearchValue("");
    resetHighlights();
    
    toast({
      title: "Stack cleared",
      description: "All elements have been removed from the stack",
    });
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation && !isSearching) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, isSearching]);

  const complexities: ComplexityInfo[] = [
    {
      operation: 'Push',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
    },
    {
      operation: 'Pop',
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
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">Stack Visualization</h2>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Size: {getSize()}/{maxSize}</span>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
                  isFull() ? "bg-destructive/20 text-destructive" : 
                  stack.length === 0 ? "bg-muted text-muted-foreground" : 
                  "bg-primary/20 text-primary"
                )}>
                  {isFull() ? 'FULL' : stack.length === 0 ? 'EMPTY' : 'ACTIVE'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="number"
                value={stackSize}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 5 && Number(val) <= 20)) {
                    setStackSize(val);
                  }
                }}
                min={5}
                max={20}
                placeholder="5"
                className="w-20 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                disabled={isSearching}
              />
              <Button 
                onClick={generateRandomStack} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={isSearching}
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Stack
              </Button>
            </div>
            <Button 
              onClick={clearStack} 
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
        
        {/* Stack visualization */}
        <div className="mb-6 relative">
          <div className="flex items-start justify-center gap-8 flex-wrap">
            {/* Main Stack Container */}
            <div className="flex flex-col items-center" onClick={removedElements.length > 0 ? restoreStack : undefined} style={{ cursor: removedElements.length > 0 ? "pointer" : "default" }}>
              {/* Open lid */}
              <div className="w-64 h-3 bg-gray-400 rounded-t-lg border-2 border-gray-600 relative" style={{ transform: "perspective(100px) rotateX(5deg)" }}>
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-gray-500 to-gray-400 rounded-t-lg"></div>
              </div>
              
              {/* Stack container */}
              <div className="w-64 border-2 border-gray-600 border-t-0 bg-secondary rounded-b-lg p-3" style={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}>
                {stack.length === 0 ? (
                  <div className="flex items-center justify-center h-full py-8 text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Stack is empty. Push elements using the controls below.</span>
                  </div>
                ) : (
                  <div className="flex flex-col-reverse gap-1">
                    {stack.map((item, index) => {
                      const positionFromTop = stack.length - index - 1;
                      return (
                        <div
                          key={index}
                          className={cn("w-full p-3 rounded border-2 border-border bg-card flex justify-between items-center transition-all duration-300 shadow-sm", {
                            "border-primary bg-primary/10 shadow-md": operationTarget === index && !isViewing,
                            "border-primary bg-primary/10 shadow-md animate-bounce": isViewing && operationTarget === index,
                          })}
                        >
                          <div className="text-xs text-muted-foreground font-medium">
                            {positionFromTop === 0 ? "TOP" : `Pos ${positionFromTop}`}
                          </div>
                          <div className="text-lg font-semibold text-foreground">{item.toString()}</div>
                          {positionFromTop === stack.length - 1 && (
                            <div className="text-xs text-muted-foreground">BOTTOM</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Base */}
              <div className="w-64 h-2 bg-gray-600 rounded-b-lg"></div>
            </div>

            {/* Removed Elements Pile (to the right) */}
            {removedElements.length > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Removed Elements</div>
                <div className="relative" style={{ minHeight: "300px", width: "200px" }}>
                  <div className="flex flex-col-reverse items-center gap-0 relative" style={{ paddingTop: "250px" }}>
                    {removedElements.map((item, idx) => {
                      const isFound = foundValue !== null && item === foundValue;
                      const stackIndex = removedElements.length - idx - 1;
                      const offset = idx * 3; // Slight offset for pile effect
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "w-48 p-3 rounded-lg border-2 flex flex-col justify-center items-center shadow-lg transition-all duration-500",
                            {
                              "bg-green-200 border-green-400 font-semibold animate-pulse": isFound,
                              "bg-yellow-100 border-yellow-300": !isFound,
                            }
                          )}
                          style={{
                            position: "absolute",
                            bottom: `${idx * 60}px`,
                            zIndex: stackIndex,
                            transform: `translateX(${offset}px) rotate(${idx * 1.5}deg)`,
                            animation: `slideInFromRight 0.5s ease-out ${idx * 0.1}s both`,
                          }}
                        >
                          <div className="text-lg font-bold text-foreground">{item.toString()}</div>
                          {isFound && (
                            <div className="text-xs text-green-700 font-medium mt-1">✓ FOUND!</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-2 text-xs text-center text-muted-foreground max-w-[200px]">
                  {foundIndex !== null 
                    ? "Element found! Click stack to restore." 
                    : "Click on the stack to restore all elements."}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Push element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Push Element</span>
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
                onClick={pushElement}
                variant="default"
                size="sm"
                className="flex-shrink-0"
                disabled={isFull() || isSearching}
              >
                Push
              </Button>
            </div>
          </div>
          
          {/* Pop element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Pop Element</span>
            </h3>
            <Button
              onClick={popElement}
              variant="default"
              size="sm"
              className="w-full"
              disabled={isSearching}
            >
              Pop
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
              <span className="truncate">Search in Stack</span>
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
                onClick={searchInStack}
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
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Stacks</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A stack is a linear data structure that follows the LIFO (Last In, First Out) principle. Elements are added and removed from the top using push and pop operations. Stacks are used in function calls, expression evaluation, undo mechanisms, and backtracking. They offer efficient operations but limited random access.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Use Cases:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Function call stack</li>
              <li>Expression evaluation</li>
              <li>Undo/Redo operations</li>
              <li>Backtracking algorithms</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Properties:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>LIFO principle</li>
              <li>O(1) push/pop operations</li>
              <li>Fixed or dynamic size</li>
              <li>Overflow/Underflow conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizerContent;
