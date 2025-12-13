import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ComplexityDisplay from '@/components/ComplexityDisplay';

const ArrayVisualizerContent = () => {
  const [array, setArray] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [arraySize, setArraySize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isViewing, setIsViewing] = useState(false);
  const [newSize, setNewSize] = useState('');
  const [viewError, setViewError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsViewing(false);
    setViewError(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const appendElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to append",
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value to append",
        variant: "destructive",
      });
      return;
    }
    setArray([...array, newValue]);
    setLastOperation('append');
    setOperationTarget(array.length);
    setNewElement('');
    
    const message = `Appended "${newValue}" to the end of the array`;
    addToLog(message);
    
    toast({
      title: "Element appended",
      description: message,
    });
  };

  const replaceAtPosition = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to replace",
        variant: "destructive",
      });
      return;
    }

    if (position.trim() === '' || isNaN(Number(position))) {
      toast({
        title: "Invalid index",
        description: "Please enter a valid numeric index",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 0 || pos >= array.length) {
      toast({
        title: "Out of bounds",
        description: `Index must be between 0 and ${array.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value to replace",
        variant: "destructive",
      });
      return;
    }
    const newArray = [...array];
    const oldValue = newArray[pos];
    newArray[pos] = newValue;
    setArray(newArray);
    setLastOperation('replace');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    const message = `Replaced element at index ${pos} from "${oldValue}" to "${newValue}"`;
    addToLog(message);
    
    toast({
      title: "Element replaced",
      description: message,
    });
  };

  const deleteAtPosition = () => {
    if (position.trim() === '' || isNaN(Number(position))) {
      toast({
        title: "Invalid index",
        description: "Please enter a valid numeric index",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 0 || pos >= array.length) {
      toast({
        title: "Out of bounds",
        description: `Index must be between 0 and ${array.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    const deletedValue = array[pos];
    const newArray = [...array];
    newArray[pos] = '-';
    setArray(newArray);
    setLastOperation('delete');
    setOperationTarget(pos);
    setPosition('');
    
    const message = `Marked index ${pos} as empty (was "${deletedValue}")`;
    addToLog(message);
    
    toast({
      title: "Position marked empty",
      description: message,
    });
  };

  const viewAtPosition = () => {
    if (position.trim() === '' || isNaN(Number(position))) {
      setViewError("Please enter a valid numeric index");
      return;
    }

    const pos = Number(position);
    
    if (array.length === 0) {
      setViewError("Array is empty. Generate or append elements first.");
      return;
    }

    if (pos < 0 || pos >= array.length) {
      setViewError(`Index must be between 0 and ${array.length - 1}`);
      return;
    }

    setViewError(null);
    setLastOperation('view');
    setOperationTarget(pos);
    setIsViewing(true);
    setPosition('');
    
    const message = `Viewed element at index ${pos}: ${array[pos]}`;
    addToLog(message);
  };

  const reverseArray = () => {
    if (array.length === 0) {
      toast({
        title: "Empty array",
        description: "Cannot reverse an empty array",
        variant: "destructive",
      });
      return;
    }

    const reversed = [...array].reverse();
    setArray(reversed);
    setLastOperation('reverse');
    setOperationTarget(null);
    resetHighlights();

    const message = "Reversed the array";
    addToLog(message);
    toast({ title: "Array reversed", description: message });
  };

  const resizeArray = () => {
    if (newSize.trim() === '' || isNaN(Number(newSize)) || Number(newSize) < 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid non-negative number",
        variant: "destructive",
      });
      return;
    }

    const size = Number(newSize);
    const currentLength = array.length;
    
    if (size === currentLength) {
      toast({
        title: "Same size",
        description: "Array is already that size",
        variant: "destructive",
      });
      return;
    }

    let resized: (number | string)[];
    if (size > currentLength) {
      // Expand: keep existing elements, fill with 0s
      resized = [...array, ...Array(size - currentLength).fill(0)];
    } else {
      // Shrink: keep first 'size' elements
      resized = array.slice(0, size);
    }
    
    setArray(resized);
    setLastOperation('resize');
    setOperationTarget(null);
    setNewSize('');
    
    const message = `Resized array from ${currentLength} to ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Array resized",
      description: message,
    });
  };

  const clearArray = () => {
    setArray([]);
    setLastOperation(null);
    setOperationTarget(null);
    resetHighlights();
    const message = "Cleared the entire array";
    addToLog(message);
    toast({
      title: "Array cleared",
      description: message,
    });
  };

  const generateRandomArray = () => {
    if (arraySize.trim() === '' || isNaN(Number(arraySize)) || Number(arraySize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for array size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(arraySize), 15);
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(randomArray);
    setLastOperation(null);
    setOperationTarget(null);
    setArraySize('');
    resetHighlights();
    
    const message = `Generated random array with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random array generated",
      description: message,
    });
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation && isViewing) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, isViewing]);

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-visible">
        <div className="mb-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Array Visualization</h2>
          <div className="flex flex-wrap items-center gap-3 overflow-x-auto justify-between p-1">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                value={arraySize}
                onChange={(e) => setArraySize(e.target.value)}
                placeholder="Size"
                min={1}
                inputMode="numeric"
                className="w-24 sm:w-28 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm flex-shrink-0"
              />
              <Button 
                onClick={generateRandomArray} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Shuffle className="h-4 w-4" />
                <span className="hidden sm:inline">Generate Random Array</span>
                <span className="sm:hidden">Generate</span>
              </Button>
              <input
                type="number"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  if (viewError) setViewError(null);
                }}
                placeholder="Index"
                min={0}
                inputMode="numeric"
                className="w-24 sm:w-28 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm flex-shrink-0"
              />
              <Button
                onClick={viewAtPosition}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">View at Index</span>
                <span className="sm:hidden">View</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={reverseArray}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <RotateCcw className="h-4 w-4" />
                Reverse
              </Button>
              <Button
                onClick={clearArray}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Trash className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
          {viewError && (
            <p className="text-xs sm:text-sm text-destructive">{viewError}</p>
          )}
        </div>
        
        {/* Array visualization */}
        <div className="mb-6 relative overflow-hidden w-full">
          <h3 className="text-base font-medium text-foreground mb-2">Array Elements</h3>
          <div 
            className="flex items-center bg-secondary rounded-lg p-4 overflow-x-auto border border-border w-full"
            style={{ minHeight: "120px" }}
          >
            {array.length === 0 ? (
              <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Array is empty. Add elements using the controls below.</span>
              </div>
            ) : (
              array.map((item, index) => (
                  <div key={index} className="flex items-center flex-shrink-0">
                    <div
                      className={cn(
                        "min-w-[60px] w-[60px] h-16 m-1 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300",
                        {
                          "border-primary bg-primary/10 shadow-md": operationTarget === index && !isViewing,
                          "border-primary bg-primary/10 shadow-md animate-bounce": isViewing && operationTarget === index,
                          "border-border bg-card": operationTarget !== index,
                        }
                    )}
                  >
                    <div className="text-lg font-medium text-foreground">{item}</div>
                    <div className="text-xs text-muted-foreground">[{index}]</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Add element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Append Element</span>
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
                onClick={appendElement}
                variant="default"
                size="sm"
                className="flex-shrink-0"
              >
                Append
              </Button>
            </div>
          </div>
          
          {/* Replace element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Replace Element</span>
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="New value"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Index"
                min={0}
                inputMode="numeric"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={replaceAtPosition}
                variant="default"
                size="sm"
                className="w-full"
              >
                Replace
              </Button>
            </div>
          </div>
          
          {/* Remove element */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Remove Element</span>
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Index"
                min={0}
                inputMode="numeric"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={deleteAtPosition}
                variant="default"
                size="sm"
                className="w-full"
              >
                Remove
              </Button>
            </div>
          </div>
          
          {/* Resize Array */}
          <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
            <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
              <span className="truncate">Resize Array</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="New size"
                min={0}
                inputMode="numeric"
                className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={resizeArray}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                Resize
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

      <ComplexityDisplay 
        complexities={[
          {
            operation: 'Access',
            timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            spaceComplexity: 'O(1)',
            description: 'Read or view an element by its index.',
          },
          {
            operation: 'Append',
            timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
            spaceComplexity: 'O(1)',
            description: 'Add an element to the end of the array.',
          },
          {
            operation: 'Replace',
            timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
            spaceComplexity: 'O(1)',
            description: 'Overwrite a value at a specific index.',
          },
        ]} 
        className="mb-6" 
      />
      
      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Arrays</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          An array is a linear data structure that stores elements of the same type in contiguous memory locations. It allows fast access using indices, making retrieval efficient. Arrays are useful for storing fixed-size collections, supporting operations like traversal, searching, and sorting, but resizing them can be costly.
        </p>
        <p className="text-sm text-muted-foreground sm:text-base">
          Arrays excel at quick index-based lookups but perform poorly when frequent insertions or deletions in the middle are required. Because their size is fixed once allocated, expanding or shrinking often involves creating a new array and copying elements. Understanding these trade-offs helps pick the right data structure for a task.
        </p>
      </div>
    </div>
  );
};

export default ArrayVisualizerContent;
