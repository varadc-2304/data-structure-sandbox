
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ListNode {
  value: number;
  next: ListNode | null;
}

const LinkedListVisualizer = () => {
  const [head, setHead] = useState<ListNode | null>(null);
  const [newElement, setNewElement] = useState('');
  const [listSize, setListSize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentTraverseIndex, setCurrentTraverseIndex] = useState(-1);
  const [targetReached, setTargetReached] = useState(false);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsTraversing(false);
    setCurrentTraverseIndex(-1);
    setTargetReached(false);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const listToArray = (): number[] => {
    const array: number[] = [];
    let current = head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  };

  const addElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const newNode: ListNode = {
      value: Number(newElement),
      next: head
    };
    
    setHead(newNode);
    setNewElement('');
    
    const message = `Added ${newElement} to the beginning of the list`;
    addToLog(message);
    
    toast({
      title: "Element added",
      description: message,
    });
  };

  const removeElement = () => {
    if (!head) {
      toast({
        title: "List is empty",
        description: "Cannot remove from an empty list",
        variant: "destructive",
      });
      return;
    }

    const removedValue = head.value;
    setHead(head.next);
    
    const message = `Removed ${removedValue} from the beginning of the list`;
    addToLog(message);
    
    toast({
      title: "Element removed",
      description: message,
    });
  };

  const clearList = () => {
    setHead(null);
    resetHighlights();
    
    const message = "Cleared the entire list";
    addToLog(message);
    
    toast({
      title: "List cleared",
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
    const array = listToArray();
    
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
    setIsTraversing(true);
    setCurrentTraverseIndex(0);
    setPosition('');
    
    const message = `Viewing element at position ${pos}: ${array[pos]}`;
    addToLog(message);
  };

  const generateRandomList = () => {
    if (listSize.trim() === '' || isNaN(Number(listSize)) || Number(listSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for list size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(listSize), 15);
    const randomValues = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    
    let newHead: ListNode | null = null;
    for (let i = randomValues.length - 1; i >= 0; i--) {
      const newNode: ListNode = {
        value: randomValues[i],
        next: newHead
      };
      newHead = newNode;
    }
    
    setHead(newHead);
    resetHighlights();
    setListSize('');
    
    const message = `Generated random list with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random list generated",
      description: message,
    });
  };

  // Handle traversal animation
  useEffect(() => {
    if (isTraversing && operationTarget !== null) {
      if (currentTraverseIndex <= operationTarget) {
        const timer = setTimeout(() => {
          if (currentTraverseIndex === operationTarget) {
            setTargetReached(true);
            setIsTraversing(false);
            const array = listToArray();
            toast({
              title: "Element found",
              description: `Element at position ${operationTarget} is ${array[operationTarget]}`,
            });
          } else {
            setCurrentTraverseIndex(currentTraverseIndex + 1);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isTraversing, currentTraverseIndex, operationTarget]);

  // Clear highlights after target is reached
  useEffect(() => {
    if (targetReached) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [targetReached]);

  const array = listToArray();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Linked List Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on linked lists. Add, remove, or traverse elements to see how linked lists work.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Linked List Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={listSize}
                onChange={(e) => setListSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomList} 
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random List
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
          
          {/* Linked list visualization */}
          <div className="mb-6 relative overflow-hidden">
            <div 
              className="flex items-center bg-arena-light rounded-lg p-4 overflow-x-auto"
              style={{ minHeight: "120px" }}
            >
              {array.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Linked list is empty. Add elements using the controls below.</span>
                </div>
              ) : (
                array.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={cn(
                        "min-w-[80px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300 relative",
                        {
                          "border-arena-green bg-arena-green/10 shadow-md": 
                            isTraversing && currentTraverseIndex === index,
                          "border-arena-green bg-arena-green/10 shadow-md animate-bounce": 
                            targetReached && operationTarget === index,
                        }
                      )}
                    >
                      <div className="text-lg font-medium">{item}</div>
                      <div className="text-xs text-arena-gray">[{index}]</div>
                      
                      {/* Pointer to next node */}
                      {index < array.length - 1 && (
                        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-0.5 bg-gray-400"></div>
                          <div className="absolute -right-1 -top-1 w-2 h-2 border-t-2 border-r-2 border-gray-400 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                    {index < array.length - 1 && <div className="w-4"></div>}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  onClick={addElement}
                  variant="default"
                  className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add
                </Button>
              </div>
            </div>
            
            {/* Remove element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Remove First Element
              </h3>
              <Button
                onClick={removeElement}
                variant="default"
                className="w-full bg-arena-green text-white hover:bg-arena-green/90"
              >
                Remove
              </Button>
            </div>
            
            {/* Clear list */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Clear List
              </h3>
              <Button
                onClick={clearList}
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
          <h2 className="text-xl font-semibold mb-2">About Linked Lists</h2>
          <p className="text-arena-gray mb-4">
            A linked list is a linear data structure where elements are stored in nodes, and each node contains data and a reference to the next node.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Access: O(n)</li>
                <li>Search: O(n)</li>
                <li>Insertion: O(1) at head</li>
                <li>Deletion: O(1) at head</li>
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

export default LinkedListVisualizer;
