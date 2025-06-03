
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { ArrowRight, Plus, Trash, Eye, AlertCircle, ArrowRightCircle, Shuffle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Node {
  value: number | string;
  next: Node | null;
}

const LinkedListVisualizer = () => {
  const [head, setHead] = useState<Node | null>(null);
  const [newElement, setNewElement] = useState('');
  const [position, setPosition] = useState('');
  const [listSize, setListSize] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [traversingIndices, setTraversingIndices] = useState<number[]>([]);
  const [isViewing, setIsViewing] = useState(false);

  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setTraversingIndices([]);
    setIsViewing(false);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const getLinkedListArray = (): Node[] => {
    const result: Node[] = [];
    let current = head;
    
    while (current !== null) {
      result.push(current);
      current = current.next;
    }
    
    return result;
  };

  const appendNode = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to append",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newNode: Node = { value: newValue, next: null };
    
    if (head === null) {
      setHead(newNode);
    } else {
      // Find the last node
      let current = head;
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
    
    setLastOperation('append');
    setOperationTarget(getLinkedListArray().length - 1);
    setNewElement('');
    
    const message = `Appended "${newValue}" to the end of the linked list`;
    addToLog(message);
    
    toast({
      title: "Node appended",
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
    const listArray = getLinkedListArray();
    
    if (pos < 0 || pos > listArray.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${listArray.length}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newNode: Node = { value: newValue, next: null };
    
    if (pos === 0) {
      // Insert at the beginning
      newNode.next = head;
      setHead(newNode);
    } else {
      // Insert at a specific position
      let current = head;
      let index = 0;
      
      while (current !== null && index < pos - 1) {
        current = current.next;
        index++;
      }
      
      if (current !== null) {
        newNode.next = current.next;
        current.next = newNode;
      }
    }
    
    setLastOperation('insert');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    const message = `Inserted "${newValue}" at position ${pos}`;
    addToLog(message);
    
    toast({
      title: "Node inserted",
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
    const listArray = getLinkedListArray();
    
    if (pos < 0 || pos >= listArray.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${listArray.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    let deletedValue;
    
    if (pos === 0) {
      // Delete from the beginning
      deletedValue = head?.value;
      setHead(head?.next || null);
    } else {
      // Delete from a specific position
      let current = head;
      let index = 0;
      
      while (current !== null && index < pos - 1) {
        current = current.next;
        index++;
      }
      
      if (current !== null && current.next !== null) {
        deletedValue = current.next.value;
        current.next = current.next.next;
      }
    }
    
    setLastOperation('delete');
    setOperationTarget(pos);
    setPosition('');
    
    const message = `Removed "${deletedValue}" from position ${pos}`;
    addToLog(message);
    
    toast({
      title: "Node deleted",
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
    const listArray = getLinkedListArray();
    
    if (pos < 0 || pos >= listArray.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${listArray.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    // Animate traversal to the target position
    const traverseToPosition = async () => {
      setIsViewing(true);
      const traversalPath: number[] = [];
      
      for (let i = 0; i <= pos; i++) {
        traversalPath.push(i);
        setTraversingIndices([...traversalPath]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Highlight the final target
      setLastOperation('view');
      setOperationTarget(pos);
      setTraversingIndices([]);
      setPosition('');
      
      let current = head;
      let index = 0;
      
      while (current !== null && index < pos) {
        current = current.next;
        index++;
      }
      
      const message = `Viewed element at position ${pos}: "${current?.value}"`;
      addToLog(message);
      
      toast({
        title: "Node viewed",
        description: message,
      });
    };

    traverseToPosition();
  };

  const generateRandomLinkedList = () => {
    if (listSize.trim() === '' || isNaN(Number(listSize)) || Number(listSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for list size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(listSize), 15); // Limit to 15 nodes max
    setHead(null);
    
    let newHead: Node | null = null;
    let current: Node | null = null;

    for (let i = 0; i < size; i++) {
      const value = Math.floor(Math.random() * 100);
      const newNode: Node = { value, next: null };
      
      if (newHead === null) {
        newHead = newNode;
        current = newNode;
      } else if (current !== null) {
        current.next = newNode;
        current = newNode;
      }
    }

    setHead(newHead);
    setLastOperation(null);
    setOperationTarget(null);
    setListSize('');
    
    const message = `Generated random linked list with ${size} nodes`;
    addToLog(message);
    
    toast({
      title: "Random linked list generated",
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
      
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Linked List Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a singly linked list. Add, insert, view, or delete nodes to see how linked lists work.
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
                onClick={generateRandomLinkedList} 
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
          
          {/* Linked List visualization */}
          <div className="mb-6 relative">
            <div 
              className="flex overflow-x-auto pb-4 pt-2 px-2 bg-arena-light rounded-lg items-center"
              style={{ minHeight: "80px" }}
            >
              {!head ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Linked List is empty. Add nodes using the controls below.</span>
                </div>
              ) : (
                getLinkedListArray().map((node, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={cn(
                        "flex flex-col min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex-shrink-0 justify-center items-center transition-all duration-300",
                        {
                          "border-arena-green bg-arena-green/10 shadow-md": 
                            operationTarget === index || traversingIndices.includes(index),
                          "animate-bounce": 
                            (isViewing && operationTarget === index) || traversingIndices.includes(index),
                        }
                      )}
                    >
                      <div className="text-lg font-medium">{node.value.toString()}</div>
                      <div className="text-xs text-arena-gray">[{index}]</div>
                    </div>
                    {index < getLinkedListArray().length - 1 && (
                      <ArrowRightCircle className="h-5 w-5 text-arena-green mx-1" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Append node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Append Node
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={appendNode}
                  variant="default"
                  className="bg-arena-green text-white px-4 py-2 rounded-r-lg hover:bg-arena-green/90 transition-colors duration-300 flex items-center"
                >
                  Append
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Insert at position */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Insert at Position
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <input
                  type="text"
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Value"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Position"
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={insertAtPosition}
                  variant="default"
                  className="bg-arena-green text-white px-2 py-2 rounded-lg hover:bg-arena-green/90 transition-colors duration-300"
                >
                  Insert
                </Button>
              </div>
            </div>
            
            {/* Delete at position */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Delete at Position
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={deleteAtPosition}
                  variant="default"
                  className="bg-arena-green text-white px-4 py-2 rounded-r-lg hover:bg-arena-green/90 transition-colors duration-300 flex items-center"
                >
                  Delete
                  <Trash className="ml-2 h-4 w-4" />
                </Button>
              </div>
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
            A linked list is a linear data structure where elements are stored in nodes. Each node points to the next node in the sequence, forming a chain.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Access: O(n)</li>
                <li>Search: O(n)</li>
                <li>Insertion: O(1) (with pointer)</li>
                <li>Deletion: O(1) (with pointer)</li>
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
