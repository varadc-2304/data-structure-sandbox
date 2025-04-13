
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const StackVisualizer = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  const resetHighlights = () => {
    setLastOperation(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

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
    
    const message = `Peeked at top element: "${topValue}"`;
    addToLog(message);
    
    toast({
      title: "Top element",
      description: `Top element is "${topValue}"`,
    });
  };

  const generateRandomStack = () => {
    const size = 3 + Math.floor(Math.random() * 4); // Random size between 3 and 6
    const randomStack = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setStack(randomStack);
    setLastOperation(null);
    
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
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Stack Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a stack. Push, pop, or peek elements to see how stacks work with LIFO (Last-In-First-Out) principle.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Stack Visualization</h2>
            <Button 
              onClick={generateRandomStack} 
              variant="outline"
              className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
            >
              Generate Random Stack
            </Button>
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
                        "border-drona-green bg-drona-green/10 shadow-md": 
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
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;
