
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { ArrowRight, Plus, Trash, Eye, AlertCircle, Shuffle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const ArrayVisualizer = () => {
  const [array, setArray] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [position, setPosition] = useState('');
  const [arraySize, setArraySize] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const arrayRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
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

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
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

  const insertAtPosition = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
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

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newArray = [...array];
    newArray[pos] = newValue; // Replace element at position instead of inserting
    setArray(newArray);
    setLastOperation('insert');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    const message = `Replaced element at position ${pos} with "${newValue}"`;
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
    
    const message = `Viewed element at position ${pos}: "${array[pos]}"`;
    addToLog(message);
    
    toast({
      title: "Element viewed",
      description: `Element at position ${pos} is "${array[pos]}"`,
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

    const size = Math.min(Number(arraySize), 20); // Limit to 20 elements max
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
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, operationTarget]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-28">
        <div className="mb-8">
          <div className="drona-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Array Visualizer</h1>
          <p className="text-drona-gray">
            Visualize and perform operations on arrays. Add, insert, view, or delete elements to see how arrays work.
          </p>
        </div>
        
        <div className="mb-6 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Array Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={arraySize}
                onChange={(e) => setArraySize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomArray} 
                variant="outline"
                className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Array
              </Button>
            </div>
          </div>
          
          {/* Array visualization */}
          <div className="mb-6 relative">
            <div 
              ref={arrayRef}
              className="flex overflow-x-auto pb-4 pt-2 px-2 bg-drona-light rounded-lg"
              style={{ minHeight: "80px" }}
            >
              {array.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-drona-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Array is empty. Add elements using the controls below.</span>
                </div>
              ) : (
                array.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex flex-col min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex-shrink-0 justify-center items-center transition-all duration-300",
                      {
                        "border-drona-green bg-drona-green/10 shadow-md": operationTarget === index,
                        "array-element-highlight": lastOperation === 'view' && operationTarget === index,
                      }
                    )}
                  >
                    <div className="text-lg font-medium">{item.toString()}</div>
                    <div className="text-xs text-drona-gray">[{index}]</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Append element */}
            <div className="bg-drona-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-drona-green mr-2" />
                Append Element
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={appendElement}
                  className="rounded-l-none bg-drona-green hover:bg-drona-green/90 text-white"
                >
                  Append
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Replace at position */}
            <div className="bg-drona-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-drona-green mr-2" />
                Replace at Position
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Value"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={insertAtPosition}
                  className="bg-drona-green hover:bg-drona-green/90 text-white"
                >
                  Replace
                </Button>
              </div>
            </div>
            
            {/* Delete at position */}
            <div className="bg-drona-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-drona-green mr-2" />
                Delete at Position
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={deleteAtPosition}
                  className="rounded-l-none bg-drona-green hover:bg-drona-green/90 text-white"
                >
                  Delete
                  <Trash className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* View at position */}
            <div className="bg-drona-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-drona-green mr-2" />
                View at Position
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={viewAtPosition}
                  className="rounded-l-none bg-drona-green hover:bg-drona-green/90 text-white"
                >
                  View
                  <Eye className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Operation Logs */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-drona-gray">
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
          <p className="text-drona-gray mb-4">
            An array is a collection of elements stored at contiguous memory locations. It is the simplest data structure where each element can be accessed using an index.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-drona-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-drona-gray">
                <li>Access: O(1)</li>
                <li>Search: O(n)</li>
                <li>Insertion: O(n)</li>
                <li>Deletion: O(n)</li>
              </ul>
            </div>
            <div className="bg-drona-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-drona-gray">
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
