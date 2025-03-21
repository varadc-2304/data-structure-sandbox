
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { ArrowRight, Plus, Trash, Eye, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ArrayVisualizer = () => {
  const [array, setArray] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  
  const arrayRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
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
    
    toast({
      title: "Element appended",
      description: `Added "${newValue}" to the end of the array`,
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
    
    if (pos < 0 || pos > array.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${array.length}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newArray = [...array.slice(0, pos), newValue, ...array.slice(pos)];
    setArray(newArray);
    setLastOperation('insert');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    toast({
      title: "Element inserted",
      description: `Inserted "${newValue}" at position ${pos}`,
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
    
    toast({
      title: "Element deleted",
      description: `Removed "${deletedValue}" from position ${pos}`,
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
    
    toast({
      title: "Element viewed",
      description: `Element at position ${pos} is "${array[pos]}"`,
    });
  };

  // Scroll the array to show newly added elements
  useEffect(() => {
    if (arrayRef.current && lastOperation) {
      arrayRef.current.scrollLeft = arrayRef.current.scrollWidth;
    }
  }, [array, lastOperation]);

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
      
      <div className="page-container pt-32">
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Array Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on arrays. Add, insert, view, or delete elements to see how arrays work.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
          
          {/* Array visualization */}
          <div className="mb-6 relative">
            <div 
              ref={arrayRef}
              className="flex overflow-x-auto pb-4 pt-2 px-2 bg-arena-light rounded-lg"
              style={{ minHeight: "80px" }}
            >
              {array.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
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
                        "border-arena-red bg-arena-red/10 shadow-md": operationTarget === index,
                        "animate-scale-in": lastOperation === 'append' && operationTarget === index,
                        "array-element-highlight": lastOperation === 'view' && operationTarget === index,
                      }
                    )}
                  >
                    <div className="text-lg font-medium">{item.toString()}</div>
                    <div className="text-xs text-arena-gray">[{index}]</div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Append element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-red mr-2" />
                Append Element
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={appendElement}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  Append
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Insert at position */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-red mr-2" />
                Insert at Position
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Value"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={insertAtPosition}
                  className="bg-arena-red text-white px-2 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300"
                >
                  Insert
                </button>
              </div>
            </div>
            
            {/* Delete at position */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-red mr-2" />
                Delete at Position
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={deleteAtPosition}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  Delete
                  <Trash className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* View at position */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-arena-red mr-2" />
                View at Position
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={viewAtPosition}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  View
                  <Eye className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold mb-2">About Arrays</h2>
          <p className="text-arena-gray mb-4">
            An array is a collection of elements stored at contiguous memory locations. It is the simplest data structure where each element can be accessed using an index.
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
              <span className="font-medium">Common Operations:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Accessing elements by index</li>
                <li>Inserting elements</li>
                <li>Deleting elements</li>
                <li>Traversing the array</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
