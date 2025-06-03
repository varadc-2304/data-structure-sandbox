
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowDown, ArrowUp, Shuffle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const StackVisualizer = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [position, setPosition] = useState('');
  const [stackSize, setStackSize] = useState('');
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

  const pushElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to push",
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
    
    if (pos < 0 || pos >= stack.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${stack.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    setLastOperation('view');
    setOperationTarget(pos);
    setIsViewing(true);
    setPosition('');
    
    const message = `Viewed element at position ${pos}: "${stack[pos]}"`;
    addToLog(message);
    
    toast({
      title: "Element viewed",
      description: `Element at position ${pos} is "${stack[pos]}"`,
    });
  };

  const generateRandomStack = () => {
    if (stackSize.trim() === '' || isNaN(Number(stackSize)) || Number(stackSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for stack size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(stackSize), 15); // Limit to 15 elements max
    const randomStack = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setStack(randomStack);
    setLastOperation(null);
    setOperationTarget(null);
    setStackSize('');
    
    const message = `Generated random stack with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random stack generated",
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
  }, [lastOperation]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Stack Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a stack. Push, pop, or peek elements to see how stacks work with LIFO (Last-In-First-Out) principle.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Stack Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={stackSize}
                onChange={(e) => setStackSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomStack} 
                variant="outline"
                className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Stack
              </Button>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Position"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
              />
              <Button
                onClick={viewAtPosition}
                variant="outline"
                className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
              >
                <Eye className="h-4 w-4" />
                View at Position
              </Button>
            </div>
          </div>
          
          {/* Stack visualization */}
          <div className="mb-6 relative">
            <div 
              className="flex flex-col-reverse items-center bg-arena-light rounded-lg p-4"
              style={{ minHeight: "240px" }}
            >
              {stack.length === 0 ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Stack is empty. Push elements using the controls below.</span>
                </div>
              ) : (
                stack.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-full max-w-xs p-4 m-1 rounded-lg border-2 border-gray-200 flex justify-between items-center transition-all duration-300",
                      {
                        "border-drona-green bg-drona-green/10 shadow-md": operationTarget === index,
                        "animate-bounce": isViewing && operationTarget === index,
                      }
                    )}
                  >
                    <div className="text-sm text-arena-gray">
                      {index === stack.length - 1 ? 'TOP' : `INDEX ${stack.length - 1 - index}`}
                    </div>
                    <div className="text-lg font-medium">{item.toString()}</div>
                  </div>
                ))
              )}
              {/* Base of the stack */}
              <div className="w-full max-w-xs h-2 bg-drona-green rounded-b-lg mt-1"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Push element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-drona-green mr-2" />
                Push Element
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
                  onClick={pushElement}
                  variant="default"
                  className="rounded-l-none bg-drona-green text-white hover:bg-drona-green/90 transition-colors duration-300 flex items-center"
                >
                  Push
                  <ArrowUp className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Pop element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-drona-green mr-2" />
                Pop Element
              </h3>
              <Button
                onClick={popElement}
                variant="default"
                className="w-full bg-drona-green text-white hover:bg-drona-green/90 transition-colors duration-300 flex items-center justify-center"
              >
                Pop
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Peek element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-drona-green mr-2" />
                Peek Element
              </h3>
              <Button
                onClick={peekElement}
                variant="default"
                className="w-full bg-drona-green text-white hover:bg-drona-green/90 transition-colors duration-300 flex items-center justify-center"
              >
                Peek
                <Eye className="ml-2 h-4 w-4" />
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
          <h2 className="text-xl font-semibold mb-2">About Stacks</h2>
          <p className="text-arena-gray mb-4">
            A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. The last element added is the first one to be removed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Push: O(1)</li>
                <li>Pop: O(1)</li>
                <li>Peek: O(1)</li>
                <li>Search: O(n)</li>
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

export default StackVisualizer;
