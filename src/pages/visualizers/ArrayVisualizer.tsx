
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ArrayVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [newElement, setNewElement] = useState('');
  const [arraySize, setArraySize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isViewing, setIsViewing] = useState(false);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsViewing(false);
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
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 0 || pos >= array.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${array.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    const newArray = [...array];
    const oldValue = newArray[pos];
    newArray[pos] = newValue;
    setArray(newArray);
    setLastOperation('replace');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    const message = `Replaced element at position ${pos} from "${oldValue}" to "${newValue}"`;
    addToLog(message);
    
    toast({
      title: "Element replaced",
      description: message,
    });
  };

  const deleteAtPosition = () => {
    if (position.trim() === '' || isNaN(Number(position))) {
      toast({
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 0 || pos >= array.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${array.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    const deletedValue = array[pos];
    const newArray = [...array.slice(0, pos), ...array.slice(pos + 1)];
    setArray(newArray);
    setLastOperation('delete');
    setOperationTarget(pos);
    setPosition('');
    
    const message = `Removed "${deletedValue}" from position ${pos}`;
    addToLog(message);
    
    toast({
      title: "Element deleted",
      description: message,
    });
  };

  const viewAtPosition = () => {
    if (position.trim() === '' || isNaN(Number(position))) {
      toast({
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 0 || pos >= array.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${array.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    setLastOperation('view');
    setOperationTarget(pos);
    setIsViewing(true);
    setPosition('');
    
    const message = `Viewed element at position ${pos}: ${array[pos]}`;
    addToLog(message);
    
    toast({
      title: "Element viewed",
      description: `Element at position ${pos} is ${array[pos]}`,
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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Array Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on arrays. Add, replace, remove, or view elements to see how arrays work.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Array Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={arraySize}
                onChange={(e) => setArraySize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomArray} 
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Array
              </Button>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button
                onClick={viewAtPosition}
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Eye className="h-4 w-4" />
                View at Position
              </Button>
            </div>
          </div>
          
          {/* Array visualization */}
          <div className="mb-6 relative overflow-hidden">
            <div 
              className="flex items-center bg-arena-light rounded-lg p-4 overflow-x-auto"
              style={{ minHeight: "120px" }}
            >
              {array.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Array is empty. Add elements using the controls below.</span>
                </div>
              ) : (
                array.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={cn(
                        "min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300",
                        {
                          "border-arena-green bg-arena-green/10 shadow-md": operationTarget === index && !isViewing,
                          "border-arena-green bg-arena-green/10 shadow-md animate-bounce": isViewing && operationTarget === index,
                        }
                      )}
                    >
                      <div className="text-lg font-medium">{item}</div>
                      <div className="text-xs text-arena-gray">[{index}]</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Add element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Add Element
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={() => {
                    if (newElement.trim() === '') {
                      toast({
                        title: "Input required",
                        description: "Please enter a value to add",
                        variant: "destructive",
                      });
                      return;
                    }
                    setArray([...array, Number(newElement)]);
                    setNewElement('');
                    const message = `Added ${newElement} to the array`;
                    addToLog(message);
                    toast({
                      title: "Element added",
                      description: message,
                    });
                  }}
                  variant="default"
                  className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add
                </Button>
              </div>
            </div>
            
            {/* Replace element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Replace Element
              </h3>
              <div className="space-y-2">
                <input
                  type="number"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="New value"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={replaceAtPosition}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Replace
                </Button>
              </div>
            </div>
            
            {/* Remove element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Remove Element
              </h3>
              <div className="space-y-2">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={deleteAtPosition}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Remove
                </Button>
              </div>
            </div>
            
            {/* Clear array */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Clear Array
              </h3>
              <Button
                onClick={() => {
                  setArray([]);
                  setLastOperation(null);
                  setOperationTarget(null);
                  const message = "Cleared the entire array";
                  addToLog(message);
                  toast({
                    title: "Array cleared",
                    description: message,
                  });
                }}
                variant="default"
                className="w-full bg-arena-green text-white hover:bg-arena-green/90"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Operation Logs */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-arena-gray">
                  No operations performed yet
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1 pb-1 border-b border-gray-100 last:border-0">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">About Arrays</h2>
          <p className="text-arena-gray mb-4">
            An array is a linear data structure that stores elements in contiguous memory locations. Each element can be accessed using its index.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Access: O(1)</li>
                <li>Search: O(n)</li>
                <li>Insertion: O(n)</li>
                <li>Deletion: O(n)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Storage: O(n)</li>
                <li>Auxiliary: O(1)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
