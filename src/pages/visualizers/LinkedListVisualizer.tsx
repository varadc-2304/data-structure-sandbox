
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ListNode {
  id: number;
  value: number;
  next: number | null;
}

const LinkedListVisualizer = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [newElement, setNewElement] = useState('');
  const [listSize, setListSize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isViewing, setIsViewing] = useState(false);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState<number>(-1);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsViewing(false);
    setTraversalPath([]);
    setCurrentTraversal(-1);
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
    const newId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    
    if (nodes.length === 0) {
      setNodes([{ id: newId, value: newValue, next: null }]);
    } else {
      const updatedNodes = [...nodes];
      updatedNodes[updatedNodes.length - 1].next = newId;
      updatedNodes.push({ id: newId, value: newValue, next: null });
      setNodes(updatedNodes);
    }
    
    setLastOperation('append');
    setOperationTarget(newId);
    setNewElement('');
    
    const message = `Appended "${newValue}" to the end of the list`;
    addToLog(message);
    
    toast({
      title: "Element appended",
      description: message,
    });
  };

  const removeAtPosition = () => {
    if (position.trim() === '' || isNaN(Number(position))) {
      toast({
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);
    
    if (pos < 1 || pos > nodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 1 and ${nodes.length}`,
        variant: "destructive",
      });
      return;
    }

    const actualIndex = pos - 1; // Convert 1-based to 0-based index
    const removedValue = nodes[actualIndex].value;
    const newNodes = [...nodes];
    
    if (actualIndex === 0) {
      // Remove head
      newNodes.shift();
      // Update IDs to maintain sequential order
      for (let i = 0; i < newNodes.length; i++) {
        newNodes[i].id = i;
        newNodes[i].next = i < newNodes.length - 1 ? i + 1 : null;
      }
    } else {
      // Remove from middle or end
      newNodes.splice(actualIndex, 1);
      // Update IDs and next pointers
      for (let i = 0; i < newNodes.length; i++) {
        newNodes[i].id = i;
        newNodes[i].next = i < newNodes.length - 1 ? i + 1 : null;
      }
    }
    
    setNodes(newNodes);
    setLastOperation('remove');
    setOperationTarget(actualIndex);
    setPosition('');
    
    const message = `Removed "${removedValue}" from position ${pos}`;
    addToLog(message);
    
    toast({
      title: "Element removed",
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
    
    if (pos < 1 || pos > nodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 1 and ${nodes.length}`,
        variant: "destructive",
      });
      return;
    }

    // Create traversal path (convert 1-based to 0-based)
    const actualIndex = pos - 1;
    const path = [];
    for (let i = 0; i <= actualIndex; i++) {
      path.push(nodes[i].id);
    }
    
    setTraversalPath(path);
    setCurrentTraversal(0);
    setLastOperation('view');
    setIsViewing(true);
    setPosition('');
    
    const message = `Viewing element at position ${pos}: ${nodes[actualIndex].value}`;
    addToLog(message);
  };

  // Handle traversal animation
  useEffect(() => {
    if (traversalPath.length > 0 && currentTraversal < traversalPath.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTraversal(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentTraversal === traversalPath.length - 1) {
      setOperationTarget(traversalPath[currentTraversal]);
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTraversal, traversalPath]);

  const generateRandomList = () => {
    if (listSize.trim() === '' || isNaN(Number(listSize)) || Number(listSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for list size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(listSize), 10);
    const newNodes = [];
    
    for (let i = 0; i < size; i++) {
      newNodes.push({
        id: i,
        value: Math.floor(Math.random() * 100),
        next: i < size - 1 ? i + 1 : null
      });
    }
    
    setNodes(newNodes);
    resetHighlights();
    setListSize('');
    
    const message = `Generated random list with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random list generated",
      description: message,
    });
  };

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
          
          {/* Linked List visualization */}
          <div className="mb-6 relative">
            <div 
              className="flex items-center bg-arena-light rounded-lg p-4 overflow-x-auto"
              style={{ minHeight: "120px" }}
            >
              {nodes.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Linked list is empty. Add elements using the controls below.</span>
                </div>
              ) : (
                <div className="flex items-center">
                  {nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        {/* HEAD indicator above first node */}
                        {index === 0 && (
                          <div className="text-sm font-medium text-arena-green mb-2">
                            Head
                          </div>
                        )}
                        
                        {/* TAIL indicator above last node */}
                        {index === nodes.length - 1 && (
                          <div className="text-sm font-medium text-arena-green mb-2">
                            Tail
                          </div>
                        )}
                        
                        <div
                          className={cn(
                            "min-w-[80px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300 relative overflow-hidden",
                            {
                              "border-arena-green bg-arena-green/10 shadow-md": 
                                (traversalPath.includes(node.id) && currentTraversal >= traversalPath.indexOf(node.id)) ||
                                (operationTarget === node.id && !isViewing),
                              "border-arena-green bg-arena-green/10 shadow-md transform": 
                                isViewing && operationTarget === node.id,
                            }
                          )}
                          style={{
                            animation: isViewing && operationTarget === node.id ? 'bounceInPlace 0.6s ease-in-out 3' : 'none',
                          }}
                        >
                          <div className="text-lg font-medium">{node.value}</div>
                          <div className="text-xs text-arena-gray">Node {index + 1}</div>
                        </div>
                      </div>
                      
                      {/* Arrow between nodes */}
                      {node.next !== null && (
                        <div className="flex items-center mx-2">
                          <div className="w-3 h-3 bg-arena-green rounded-full"></div>
                          <ArrowRight className="h-4 w-4 text-arena-green mx-1" />
                          <div className="w-3 h-3 bg-arena-green rounded-full"></div>
                        </div>
                      )}
                      
                      {/* NULL indicator for last node */}
                      {node.next === null && index === nodes.length - 1 && (
                        <div className="flex items-center mx-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <div className="text-sm text-gray-400 ml-2">NULL</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                  onClick={appendElement}
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
                  onClick={removeAtPosition}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Remove
                </Button>
              </div>
            </div>
            
            {/* Clear list */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Clear List
              </h3>
              <Button
                onClick={() => {
                  setNodes([]);
                  resetHighlights();
                  const message = "Cleared the entire list";
                  addToLog(message);
                  toast({
                    title: "List cleared",
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
      
      <style>
        {`
          @keyframes bounceInPlace {
            0%, 20%, 50%, 80%, 100% { 
              transform: translateY(0); 
            }
            40% { 
              transform: translateY(-10px); 
            }
            60% { 
              transform: translateY(-5px); 
            }
          }
        `}
      </style>
    </div>
  );
};

export default LinkedListVisualizer;
