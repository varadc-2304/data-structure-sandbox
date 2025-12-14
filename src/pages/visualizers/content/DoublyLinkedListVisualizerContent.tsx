import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Shuffle, ArrowLeft, ArrowRight, ArrowLeftRight, Search, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface DoublyListNode {
  id: number;
  value: number;
  next: number | null;
  prev: number | null;
}

const DoublyLinkedListVisualizerContent = () => {
  const [nodes, setNodes] = useState<DoublyListNode[]>([]);
  const [newElement, setNewElement] = useState('');
  const [listSize, setListSize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [headId, setHeadId] = useState<number | null>(null);
  const [tailId, setTailId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isTraversing, setIsTraversing] = useState(false);
  const [highlightedArrow, setHighlightedArrow] = useState<number | null>(null);
  const [traverseDirection, setTraverseDirection] = useState<'forward' | 'backward' | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setHighlightedArrow(null);
    setTraverseDirection(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const getNodeById = (id: number): DoublyListNode | undefined => {
    return nodes.find(n => n.id === id);
  };

  const renumber = (list: DoublyListNode[]) =>
    list.map((n, idx) => ({
      ...n,
      id: idx,
      prev: idx > 0 ? idx - 1 : null,
      next: idx < list.length - 1 ? idx + 1 : null,
    }));

  const insertTail = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    const updated = renumber([...nodes, { id: nodes.length, value: newValue, next: null, prev: nodes.length ? nodes.length - 1 : null }]);
    setNodes(updated);
    setHeadId(updated.length ? 0 : null);
    setTailId(updated.length ? updated.length - 1 : null);
    
    setLastOperation('insert-tail');
    setOperationTarget(updated.length - 1);
    setNewElement('');
    
    const message = `Inserted "${newValue}" at the tail`;
    addToLog(message);
    
    toast({
      title: "Element inserted",
      description: message,
    });
  };

  const insertHead = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    const updated = renumber([{ id: 0, value: newValue, next: nodes.length ? 1 : null, prev: null }, ...nodes]);
    setNodes(updated);
    setHeadId(updated.length ? 0 : null);
    setTailId(updated.length ? updated.length - 1 : null);
    
    setLastOperation('insert-head');
    setOperationTarget(0);
    setNewElement('');
    
    const message = `Inserted "${newValue}" at the head`;
    addToLog(message);
    
    toast({
      title: "Element prepended",
      description: message,
    });
  };

  const deleteHead = () => {
    if (nodes.length === 0 || headId === null) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    const head = getNodeById(headId!);
    if (!head) return;

    if (nodes.length === 1) {
      setNodes([]);
      setHeadId(null);
      setTailId(null);
    } else {
      const updatedNodes = renumber(nodes.filter(n => n.id !== headId));
      setNodes(updatedNodes);
      setHeadId(0);
      setTailId(updatedNodes.length - 1);
    }
    
    setLastOperation('delete-head');
    setOperationTarget(headId);
    
    const message = `Deleted head element: "${head.value}"`;
    addToLog(message);
    
    toast({
      title: "Head deleted",
      description: message,
    });
  };

  const deleteTail = () => {
    if (nodes.length === 0 || tailId === null) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    const tail = getNodeById(tailId!);
    if (!tail) return;

    if (nodes.length === 1) {
      setNodes([]);
      setHeadId(null);
      setTailId(null);
    } else {
      const updatedNodes = renumber(nodes.filter(n => n.id !== tailId));
      setNodes(updatedNodes);
      setHeadId(0);
      setTailId(updatedNodes.length - 1);
    }
    
    setLastOperation('delete-tail');
    setOperationTarget(tailId);
    
    const message = `Deleted tail element: "${tail.value}"`;
    addToLog(message);
    
    toast({
      title: "Tail deleted",
      description: message,
    });
  };

  const searchElement = () => {
    if (searchValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    const target = Number(searchValue);
    if (isNaN(target)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }
    
    const foundIndex = orderedNodes.findIndex(n => n.value === target);
    
    if (foundIndex === -1) {
      toast({
        title: "Not found",
        description: `Value "${target}" not found in the list`,
        variant: "destructive",
      });
      setOperationTarget(null);
      return;
    }

    setLastOperation('search');
    setOperationTarget(foundIndex);
    
    const message = `Found "${target}" at position ${foundIndex}`;
    addToLog(message);
    
    toast({
      title: "Element found",
      description: message,
    });

    // Remove highlight after 5 seconds
    setTimeout(() => {
      setOperationTarget(null);
    }, 5000);
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

    const size = Math.min(Number(listSize), 10);
    const newNodes: DoublyListNode[] = [];
    let prevId: number | null = null;
    
    for (let i = 0; i < size; i++) {
      const id = i;
      const value = Math.floor(Math.random() * 100);
      newNodes.push({
        id,
        value,
        next: i < size - 1 ? i + 1 : null,
        prev: prevId,
      });
      prevId = id;
    }
    
    setNodes(newNodes);
    setHeadId(newNodes.length > 0 ? 0 : null);
    setTailId(newNodes.length > 0 ? size - 1 : null);
    setLastOperation(null);
    setOperationTarget(null);
    setListSize('');
    
    const message = `Generated random doubly linked list with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random list generated",
      description: message,
    });
  };

  const clearList = () => {
    setNodes([]);
    setHeadId(null);
    setTailId(null);
    setLastOperation(null);
    setOperationTarget(null);
    setLogs([]);
    
    toast({
      title: "List cleared",
      description: "All elements have been removed from the list",
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
    if (pos < 0 || pos > orderedNodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${orderedNodes.length}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    if (pos === 0) {
      insertHead();
      return;
    }
    if (pos === orderedNodes.length) {
      insertTail();
      return;
    }

    const updatedNodes = [...orderedNodes];
    updatedNodes.splice(pos, 0, { id: nodes.length, value: newValue, next: null, prev: null });
    const renumbered = renumber(updatedNodes);
    setNodes(renumbered);
    setHeadId(renumbered.length ? 0 : null);
    setTailId(renumbered.length ? renumbered.length - 1 : null);
    
    setLastOperation('insert');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');
    
    const message = `Inserted "${newValue}" at position ${pos}`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
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
    if (pos < 0 || pos >= orderedNodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${orderedNodes.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    if (pos === 0) {
      deleteHead();
      return;
    }
    if (pos === orderedNodes.length - 1) {
      deleteTail();
      return;
    }

    const deletedValue = orderedNodes[pos].value;
    const updatedNodes = orderedNodes.filter((_, idx) => idx !== pos);
    const renumbered = renumber(updatedNodes);
    setNodes(renumbered);
    setHeadId(renumbered.length ? 0 : null);
    setTailId(renumbered.length ? renumbered.length - 1 : null);
    
    setLastOperation('delete');
    setOperationTarget(pos);
    setPosition('');
    
    const message = `Deleted "${deletedValue}" from position ${pos}`;
    addToLog(message);
    toast({ title: "Element deleted", description: message });
  };

  const reverseList = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot reverse an empty list",
        variant: "destructive",
      });
      return;
    }

    const reversed = renumber([...nodes].reverse());
    setNodes(reversed);
    setHeadId(reversed.length ? 0 : null);
    setTailId(reversed.length ? reversed.length - 1 : null);
    setLastOperation('reverse');
    setOperationTarget(null);
    resetHighlights();

    const message = "Reversed the list";
    addToLog(message);
    toast({ title: "List reversed", description: message });
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

  // Build ordered list for display
  const orderedNodes: DoublyListNode[] = [];
  if (headId !== null) {
    let currentId: number | null = headId;
    while (currentId !== null) {
      const node = getNodeById(currentId);
      if (node) {
        orderedNodes.push(node);
        currentId = node.next;
      } else {
        break;
      }
    }
  }

  const complexities: ComplexityInfo[] = [
    {
      operation: 'Append',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element to the end of the list',
    },
    {
      operation: 'Prepend',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element to the beginning of the list',
    },
    {
      operation: 'Delete Head',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Removes the first element',
    },
    {
      operation: 'Delete Tail',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Removes the last element',
    },
    {
      operation: 'Search',
      timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      spaceComplexity: 'O(1)',
      description: 'Searches for an element in the list',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <div className="mb-4 space-y-4">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">Doubly Linked List Visualization</h2>
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min={1}
                value={listSize}
                onChange={(e) => setListSize(e.target.value)}
                placeholder="Size"
                className="w-24 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button 
                onClick={generateRandomList} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Generate
              </Button>
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search value"
                className="w-28 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button 
                onClick={searchElement} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={reverseList} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Reverse
              </Button>
              <Button 
                onClick={clearList} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        {/* List visualization */}
        <div className="mb-6 relative overflow-x-auto w-full">
          <div className="flex flex-col items-center w-full">
            {/* Horizontal Doubly Linked List Container - Open from both sides */}
            <div className="flex items-center justify-center w-full">
              {/* Left opening (HEAD) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-muted rounded-l-lg border-2 border-r-0 border-border relative" style={{ transform: "perspective(100px) rotateY(-5deg)" }}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-muted to-muted/80 rounded-l-lg"></div>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">HEAD</div>
              </div>
              
              {/* Doubly Linked List container */}
              <div className="flex-1 border-2 border-border border-x-0 bg-secondary rounded-none p-4 min-h-[180px] flex items-center overflow-x-auto">
                {orderedNodes.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>List is empty. Add elements using the controls below.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    {orderedNodes.map((node, index) => (
                      <React.Fragment key={node.id}>
                        {/* Node */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className={cn(
                              "min-w-[80px] w-[80px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 shadow-sm bg-card",
                              {
                                "border-primary bg-primary/10 shadow-md scale-110 animate-bounce": 
                                  operationTarget === index && lastOperation === 'search',
                                "border-primary bg-primary/10 shadow-md scale-110": 
                                  operationTarget === index && lastOperation !== 'search' && lastOperation !== 'traverse',
                                "border-primary bg-primary/10 shadow-md scale-110": 
                                  operationTarget === index && lastOperation === 'traverse',
                                "border-success bg-success/20 shadow-lg": 
                                  operationTarget === index && lastOperation === 'search',
                                "border-border bg-card": operationTarget !== index,
                              }
                            )}
                          >
                            <div className="text-lg font-bold text-foreground">{node.value}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              [{index}]
                            </div>
                          </div>
                        </div>

                        {/* Bidirectional arrows in same column (stacked vertically) */}
                        {index < orderedNodes.length - 1 ? (
                          <div className="flex flex-col items-center justify-center flex-shrink-0 gap-4">
                            {/* Forward arrow (next pointer) - Top */}
                            <div className="relative flex items-center">
                              {/* Arrow line */}
                              <div className={cn(
                                "h-0.5 w-12 transition-all duration-300",
                                lastOperation === 'traverse' && traverseDirection === 'forward' && highlightedArrow === index
                                  ? "bg-primary" 
                                  : "bg-muted-foreground"
                              )}></div>
                              {/* Arrow head pointing right */}
                              <ArrowRight 
                                className={cn(
                                  "h-4 w-4 transition-all duration-300 absolute right-0",
                                  lastOperation === 'traverse' && traverseDirection === 'forward' && highlightedArrow === index
                                    ? "text-primary scale-125" 
                                    : "text-muted-foreground"
                                )} 
                              />
                            </div>
                            
                            {/* Backward arrow (prev pointer) - Bottom */}
                            <div className="relative flex items-center">
                              {/* Arrow line */}
                              <div className={cn(
                                "h-0.5 w-12 transition-all duration-300",
                                lastOperation === 'traverse' && traverseDirection === 'backward' && highlightedArrow === index
                                  ? "bg-primary" 
                                  : "bg-muted-foreground"
                              )}></div>
                              {/* Arrow head pointing left */}
                              <ArrowLeft 
                                className={cn(
                                  "h-4 w-4 transition-all duration-300 absolute left-0",
                                  lastOperation === 'traverse' && traverseDirection === 'backward' && highlightedArrow === index
                                    ? "text-primary scale-125" 
                                    : "text-muted-foreground"
                                )} 
                              />
                            </div>
                          </div>
                        ) : (
                          /* NULL indicator for tail */
                          <div className="flex flex-col items-center justify-center flex-shrink-0 ml-2 gap-1">
                            <div className="px-2 py-1 text-xs text-muted-foreground bg-muted rounded border border-border">
                              NULL
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Right opening (TAIL) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-muted rounded-r-lg border-2 border-l-0 border-border relative" style={{ transform: "perspective(100px) rotateY(5deg)" }}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-l from-muted to-muted/80 rounded-r-lg"></div>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">TAIL</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {/* Insert at Tail */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-5 w-5 text-primary mr-2" />
              Insert at Tail
            </h3>
            <div className="flex">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-grow px-3 py-2 border border-input rounded-l-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={insertTail}
                variant="default"
                className="rounded-l-none"
              >
                Insert
              </Button>
            </div>
          </div>
          
          {/* Insert at Head */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-5 w-5 text-primary mr-2" />
              Insert at Head
            </h3>
            <div className="flex">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Enter value"
                className="flex-grow px-3 py-2 border border-input rounded-l-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={insertHead}
                variant="default"
                className="rounded-l-none"
              >
                Insert
              </Button>
            </div>
          </div>

          {/* Insert at Position */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Plus className="h-5 w-5 text-primary mr-2" />
              Insert at Position
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Value"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={insertAtPosition}
                variant="default"
                className="w-full"
              >
                Insert
              </Button>
            </div>
          </div>
         
          {/* Delete Head */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-5 w-5 text-primary mr-2" />
              Delete Head
            </h3>
            <Button
              onClick={deleteHead}
              variant="default"
              className="w-full"
            >
              Delete Head
            </Button>
          </div>
          
          {/* Delete Tail */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-5 w-5 text-primary mr-2" />
              Delete Tail
            </h3>
            <Button
              onClick={deleteTail}
              variant="default"
              className="w-full"
            >
              Delete Tail
            </Button>
          </div>

          {/* Delete at Position */}
          <div className="bg-secondary rounded-xl p-4 border border-border">
            <h3 className="text-lg font-medium mb-3 flex items-center text-foreground">
              <Trash className="h-5 w-5 text-primary mr-2" />
              Delete at Position
            </h3>
            <div className="space-y-2">
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <Button
                onClick={deleteAtPosition}
                variant="default"
                className="w-full"
              >
                Delete
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

      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Doubly Linked Lists</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          A doubly linked list is a linear data structure where each node stores data and two pointers—one to the next node and one to the previous node. This enables traversal in both directions and allows efficient insertions and deletions when a node reference is known.
        </p>
      </div>
    </div>
  );
};

export default DoublyLinkedListVisualizerContent;
