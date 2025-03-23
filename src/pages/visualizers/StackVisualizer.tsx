
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const StackVisualizer = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
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
    setNewElement('');
    
    toast({
      title: "Element pushed",
      description: `Pushed "${newValue}" to the top of the stack`,
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
    
    toast({
      title: "Element popped",
      description: `Popped "${poppedValue}" from the top of the stack`,
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
    
    toast({
      title: "Top element",
      description: `Top element is "${topValue}"`,
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
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Stack Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a stack. Push, pop, or peek elements to see how stacks work with LIFO (Last-In-First-Out) principle.
          </p>
        </div>
        
        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-4 w-full justify-start bg-arena-light p-1">
            <TabsTrigger value="visualizer" className="data-[state=active]:bg-white data-[state=active]:text-arena-dark px-6">
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="algorithm" className="data-[state=active]:bg-white data-[state=active]:text-arena-dark px-6">
              Algorithm
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizer" className="mt-0">
            <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-xl font-semibold mb-4">Stack Visualization</h2>
              
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
                            "border-arena-red bg-arena-red/10 shadow-md": 
                              (lastOperation === 'push' && index === stack.length - 1) ||
                              (lastOperation === 'pop' && index === stack.length - 1) ||
                              (lastOperation === 'peek' && index === stack.length - 1),
                            "animate-scale-in": lastOperation === 'push' && index === stack.length - 1,
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
                  <div className="w-full max-w-xs h-2 bg-arena-red rounded-b-lg mt-1"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Push element */}
                <div className="bg-arena-light rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Plus className="h-5 w-5 text-arena-red mr-2" />
                    Push Element
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
                      onClick={pushElement}
                      className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                    >
                      Push
                      <ArrowUp className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Pop element */}
                <div className="bg-arena-light rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Trash className="h-5 w-5 text-arena-red mr-2" />
                    Pop Element
                  </h3>
                  <button
                    onClick={popElement}
                    className="w-full bg-arena-red text-white px-4 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center justify-center"
                  >
                    Pop
                    <ArrowDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
                
                {/* Peek element */}
                <div className="bg-arena-light rounded-xl p-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Eye className="h-5 w-5 text-arena-red mr-2" />
                    Peek Element
                  </h3>
                  <button
                    onClick={peekElement}
                    className="w-full bg-arena-red text-white px-4 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center justify-center"
                  >
                    Peek
                    <Eye className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in">
              <h2 className="text-xl font-semibold mb-4">Stack Algorithm</h2>
              
              <div className="prose max-w-none text-arena-gray">
                <h3 className="text-lg font-medium text-arena-dark">How Stack Works</h3>
                <p>
                  A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. 
                  This means that the last element added to the stack will be the first one to be removed.
                </p>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Stack Operations</h3>
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Push: O(1)</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function push(stack, element) {
  stack[stack.length] = element
  return stack
}`}</code></pre>
                  <p className="mt-2 text-sm">
                    Adds an element to the top of the stack. This operation has a time complexity of O(1).
                  </p>
                </div>
                
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Pop: O(1)</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function pop(stack) {
  if (stack.length === 0) {
    return "Error: Stack Underflow"
  }
  const element = stack[stack.length - 1]
  stack.length = stack.length - 1
  return element
}`}</code></pre>
                  <p className="mt-2 text-sm">
                    Removes and returns the element from the top of the stack. This operation has a time complexity of O(1).
                  </p>
                </div>
                
                <div className="bg-arena-light rounded-lg p-4 my-4">
                  <h4 className="font-medium mb-2">Peek: O(1)</h4>
                  <pre className="bg-black text-white p-3 rounded overflow-x-auto"><code>{`function peek(stack) {
  if (stack.length === 0) {
    return "Error: Empty Stack"
  }
  return stack[stack.length - 1]
}`}</code></pre>
                  <p className="mt-2 text-sm">
                    Returns the element from the top of the stack without removing it. This operation has a time complexity of O(1).
                  </p>
                </div>
                
                <h3 className="text-lg font-medium text-arena-dark mt-6">Applications of Stacks</h3>
                <ul className="list-disc pl-5 mt-2">
                  <li>Function call management (Call stack)</li>
                  <li>Expression evaluation and conversion (infix to postfix)</li>
                  <li>Undo operations in editors</li>
                  <li>Backtracking algorithms (maze solving, game states)</li>
                  <li>Balanced parentheses checking in compilers</li>
                  <li>Browser history (back button implementation)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StackVisualizer;
