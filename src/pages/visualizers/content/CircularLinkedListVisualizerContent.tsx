import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import LinkedListToolbar from "../../visualizers/linked-list/LinkedListToolbar";
import LinkedListActions from "../../visualizers/linked-list/LinkedListActions";
import LinkedListLogs from "../../visualizers/linked-list/LinkedListLogs";
import ComplexityDisplay, { ComplexityInfo } from '@/components/ComplexityDisplay';

interface CircularListNode {
  id: number;
  value: number;
  next: number | null;
}

const CircularLinkedListVisualizerContent = () => {
  const [nodes, setNodes] = useState<CircularListNode[]>([]);
  const [newElement, setNewElement] = useState('');
  const [listSize, setListSize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [headId, setHeadId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isTraversing, setIsTraversing] = useState(false);
  const [highlightedArrow, setHighlightedArrow] = useState<number | null>(null);
  const [highlightedCircularConnection, setHighlightedCircularConnection] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if (nodes.length > 0) {
      setHeadId(nodes[0].id);
    } else {
      setHeadId(null);
    }
  }, [nodes]);

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsTraversing(false);
    setHighlightedArrow(null);
    setHighlightedCircularConnection(false);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const renumber = (list: CircularListNode[]) => {
    if (list.length === 0) return [];
    return list.map((n, idx) => ({ 
      ...n, 
      id: idx, 
      next: idx < list.length - 1 ? idx + 1 : 0 // Last node points to head (0)
    }));
  };

  const getNodeById = (id: number): CircularListNode | undefined => nodes.find(n => n.id === id);

  const orderedNodes: CircularListNode[] = useMemo(() => {
    const result: CircularListNode[] = [];
    if (headId === null || nodes.length === 0) return result;

    let currentId: number | null = headId;
    const visited = new Set<number>();

    while (currentId !== null && !visited.has(currentId)) {
      const node = getNodeById(currentId);
      if (!node) break;
      result.push(node);
      visited.add(currentId);
      currentId = node.next;
      // Stop if we've visited all nodes or hit the head again
      if (visited.size >= nodes.length || (currentId === headId && visited.size > 1)) {
        break;
      }
    }
    return result;
  }, [headId, nodes]);

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

    if (nodes.length === 0) {
      const newNode: CircularListNode = { id: 0, value: newValue, next: 0 };
      setNodes([newNode]);
      setHeadId(0);
    } else {
      const updated = renumber([...nodes, { id: nodes.length, value: newValue, next: null }]);
      setNodes(updated);
    }

    setLastOperation("insert-tail");
    setOperationTarget(orderedNodes.length);
    setNewElement('');

    const message = `Inserted "${newValue}" at the tail`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
  };

  const insertAtHead = () => {
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

    if (nodes.length === 0) {
      const newNode: CircularListNode = { id: 0, value: newValue, next: 0 };
      setNodes([newNode]);
      setHeadId(0);
    } else {
      const updated = renumber([{ id: 0, value: newValue, next: nodes.length ? 1 : 0 }, ...nodes]);
      setNodes(updated);
      setHeadId(0);
    }

    setLastOperation("insert-head");
    setOperationTarget(0);
    setNewElement('');

    const message = `Inserted "${newValue}" at the head of the list`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
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
      insertAtHead();
      return;
    }
    if (pos === orderedNodes.length) {
      insertTail();
      return;
    }

    const updatedNodes = [...orderedNodes];
    updatedNodes.splice(pos, 0, { id: nodes.length, value: newValue, next: null });
    const renumbered = renumber(updatedNodes);
    setNodes(renumbered);

    setLastOperation("insert");
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');

    const message = `Inserted "${newValue}" at position ${pos}`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    const headValue = orderedNodes[0]?.value;
    if (nodes.length === 1) {
      setNodes([]);
      setHeadId(null);
    } else {
      const newNodes = renumber(orderedNodes.slice(1));
      setNodes(newNodes);
      setHeadId(0);
    }

    setLastOperation("delete-head");
    setOperationTarget(headId);

    const message = `Deleted head element: "${headValue}"`;
    addToLog(message);
    toast({ title: "Head deleted", description: message });
  };

  const deleteTail = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 1) {
      deleteHead();
      return;
    }

    const tailValue = orderedNodes[orderedNodes.length - 1]?.value;
    const newNodes = renumber(orderedNodes.slice(0, -1));
    setNodes(newNodes);

    setLastOperation("delete-tail");
    setOperationTarget(orderedNodes.length - 1);

    const message = `Deleted tail element: "${tailValue}"`;
    addToLog(message);
    toast({ title: "Tail deleted", description: message });
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
    const newNodes = renumber(orderedNodes.filter((_, idx) => idx !== pos));
    setNodes(newNodes);

    setLastOperation("delete");
    setOperationTarget(pos);
    setPosition('');

    const message = `Deleted "${deletedValue}" from position ${pos}`;
    addToLog(message);
    toast({ title: "Element deleted", description: message });
  };

  const searchElement = async () => {
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

    setLastOperation("search");

    for (let i = 0; i < orderedNodes.length; i++) {
      setOperationTarget(i);
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (orderedNodes[i].value === target) {
        const message = `Found "${target}" at position ${i}`;
        addToLog(message);
        toast({ title: "Element found", description: message });
        
        // Remove highlight after 5 seconds
        setTimeout(() => {
          setOperationTarget(null);
        }, 5000);
        return;
      }
    }

    setOperationTarget(null);
    const message = `"${target}" not found in the list`;
    addToLog(message);
    toast({ title: "Element not found", description: message, variant: "destructive" });
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

    const reversed = renumber([...orderedNodes].reverse());
    setNodes(reversed);
    setHeadId(0);
    setLastOperation("reverse");
    setOperationTarget(null);

    const message = "Reversed the circular linked list";
    addToLog(message);
    toast({ title: "List reversed", description: message });
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
    const newNodes: CircularListNode[] = [];

    for (let i = 0; i < size; i++) {
      newNodes.push({
        id: i,
        value: Math.floor(Math.random() * 100),
        next: i < size - 1 ? i + 1 : 0, // Last node points to head (0)
      });
    }

    setNodes(newNodes);
    setHeadId(0);
    resetHighlights();
    setListSize('');

    const message = `Generated random list with ${size} elements`;
    addToLog(message);
    toast({ title: "Random list generated", description: message });
  };

  const clearList = () => {
    setNodes([]);
    setHeadId(null);
    resetHighlights();
    setLogs([]);
    toast({
      title: "List cleared",
      description: "All elements have been removed from the list",
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
      operation: 'Append',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element to the end of the circular list',
    },
    {
      operation: 'Prepend',
      timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      spaceComplexity: 'O(1)',
      description: 'Adds an element to the beginning of the circular list',
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
      description: 'Searches for an element in the circular list',
    },
  ];

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <LinkedListToolbar
          listSize={listSize}
          searchValue={searchValue}
          onListSizeChange={setListSize}
          onSearchChange={setSearchValue}
          onGenerate={generateRandomList}
          onSearch={searchElement}
          onReverse={reverseList}
          onClear={clearList}
          title="Circular Linked List Visualization"
        />

        {/* List visualization with circular connection */}
        <div className="mb-6 relative overflow-x-auto w-full">
          <div className="flex flex-col items-center w-full">
            {/* Horizontal Circular Linked List Container - Open from both sides */}
            <div className="flex items-center justify-center w-full">
              {/* Left opening (HEAD) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-gray-400 rounded-l-lg border-2 border-r-0 border-gray-600 relative" style={{ transform: "perspective(100px) rotateY(-5deg)" }}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-l-lg"></div>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">HEAD</div>
              </div>
              
              {/* Circular Linked List container */}
              <div className="flex-1 border-2 border-gray-600 border-x-0 bg-secondary rounded-none p-4 min-h-[150px] flex items-center overflow-x-auto relative">
                {orderedNodes.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Linked list is empty. Add elements using the controls below.</span>
                  </div>
                ) : (
                  <>
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
                                    operationTarget === index && lastOperation === "search",
                                  "border-primary bg-primary/10 shadow-md scale-110":
                                    operationTarget === index && lastOperation !== "search",
                                  "border-green-500 bg-green-200 shadow-lg":
                                    operationTarget === index && lastOperation === "search",
                                  "border-border bg-card": operationTarget !== index,
                                }
                              )}
                            >
                              <div className="text-lg font-bold text-foreground">{node.value}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {index === 0 ? 'HEAD' : index === orderedNodes.length - 1 ? 'TAIL' : `[${index}]`}
                              </div>
                            </div>
                          </div>

                          {/* Forward arrow (next pointer) */}
                          {index < orderedNodes.length - 1 ? (
                            <div className="flex items-center flex-shrink-0">
                              <div className="relative flex items-center">
                                {/* Arrow line */}
                                <div className={cn(
                                  "h-0.5 w-12 transition-all duration-300",
                                  highlightedArrow === index 
                                    ? "bg-primary" 
                                    : "bg-gray-400"
                                )}></div>
                                {/* Arrow head pointing right */}
                                <ArrowRight 
                                  className={cn(
                                    "h-5 w-5 transition-all duration-300 absolute right-0",
                                    highlightedArrow === index 
                                      ? "text-primary scale-125" 
                                      : "text-gray-400"
                                  )} 
                                />
                              </div>
                            </div>
                          ) : (
                            // Circular connection arrow from tail to head
                            <div className="flex items-center flex-shrink-0">
                              <div className="relative flex items-center">
                                {/* Arrow line */}
                                <div className={cn(
                                  "h-0.5 w-12 transition-all duration-300",
                                  highlightedCircularConnection || highlightedArrow === index
                                    ? "bg-primary" 
                                    : "bg-gray-400"
                                )}></div>
                                {/* Arrow head pointing right (will connect to head) */}
                                <ArrowRight 
                                  className={cn(
                                    "h-5 w-5 transition-all duration-300 absolute right-0",
                                    highlightedCircularConnection || highlightedArrow === index
                                      ? "text-primary scale-125" 
                                      : "text-gray-400"
                                  )} 
                                />
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {/* Circular connection indicator - visual cue that tail connects to head */}
                    {orderedNodes.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-3 py-1 bg-secondary/80 rounded-full border border-border">
                        <div className={cn(
                          "text-xs font-medium transition-all duration-300",
                          highlightedCircularConnection ? "text-primary" : "text-muted-foreground"
                        )}>
                          ↻ Circular Connection
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Right opening (TAIL) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-3 bg-gray-400 rounded-r-lg border-2 border-l-0 border-gray-600 relative" style={{ transform: "perspective(100px) rotateY(5deg)" }}>
                  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-l from-gray-500 to-gray-400 rounded-r-lg"></div>
                </div>
                <div className="text-xs font-semibold text-primary mt-1">TAIL</div>
              </div>
            </div>
          </div>
        </div>

        <LinkedListActions
          value={newElement}
          position={position}
          onValueChange={setNewElement}
          onPositionChange={setPosition}
          onInsertHead={insertAtHead}
          onInsertTail={insertTail}
          onInsertAtPosition={insertAtPosition}
          onDeleteHead={deleteHead}
          onDeleteTail={deleteTail}
          onDeleteAtPosition={deleteAtPosition}
        />

        <LinkedListLogs logs={logs} />
      </div>

      <ComplexityDisplay complexities={complexities} className="mb-6" />
      
      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Circular Linked Lists</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          A circular linked list is a linked list where the last node points back to the first node, forming a loop. It allows continuous traversal without a null end, making it useful for applications like round-robin scheduling. Insertions and deletions are efficient, but careful pointer handling is required to avoid infinite loops.
        </p>
      </div>
    </div>
  );
};

export default CircularLinkedListVisualizerContent;
