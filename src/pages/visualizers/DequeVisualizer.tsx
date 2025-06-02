
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

const DequeVisualizer = () => {
  const [deque, setDeque] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [dequeSize, setDequeSize] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationEnd, setOperationEnd] = useState<'front' | 'rear' | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationEnd(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const generateRandomDeque = () => {
    if (dequeSize.trim() === '' || isNaN(Number(dequeSize)) || Number(dequeSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for deque size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(dequeSize), 15); // Limit to 15 elements max
    const randomDeque = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setDeque(randomDeque);
    setLastOperation(null);
    setDequeSize('');
    
    const message = `Generated random deque with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random deque generated",
      description: message,
    });
  };

  const addFront = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([newValue, ...deque]);
    setLastOperation('add');
    setOperationEnd('front');
    setNewElement('');
    
    const message = `Added "${newValue}" to the front of the deque`;
    addToLog(message);
    
    toast({
      title: "Element added",
      description: message,
    });
  };

  const addRear = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([...deque, newValue]);
    setLastOperation('add');
    setOperationEnd('rear');
    setNewElement('');
    
    const message = `Added "${newValue}" to the rear of the deque`;
    addToLog(message);
    
    toast({
      title: "Element added",
      description: message,
    });
  };

  const removeFront = () => {
    if (deque.length === 0) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[0];
    setDeque(deque.slice(1));
    setLastOperation('remove');
    setOperationEnd('front');
    
    const message = `Removed "${removedValue}" from the front of the deque`;
    addToLog(message);
    
    toast({
      title: "Element removed",
      description: message,
    });
  };

  const removeRear = () => {
    if (deque.length === 0) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[deque.length - 1];
    setDeque(deque.slice(0, -1));
    setLastOperation('remove');
    setOperationEnd('rear');
    
    const message = `Removed "${removedValue}" from the rear of the deque`;
    addToLog(message);
    
    toast({
      title: "Element removed",
      description: message,
    });
  };

  const peekFront = () => {
    if (deque.length === 0) {
      toast({
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const frontValue = deque[0];
    setLastOperation('peek');
    setOperationEnd('front');
    
    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);
    
    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
    });
  };

  const peekRear = () => {
    if (deque.length === 0) {
      toast({
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const rearValue = deque[deque.length - 1];
    setLastOperation('peek');
    setOperationEnd('rear');
    
    const message = `Peeked at rear element: "${rearValue}"`;
    addToLog(message);
    
    toast({
      title: "Rear element",
      description: `Rear element is "${rearValue}"`,
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
  }, [lastOperation, operationEnd]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Deque Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a double-ended queue (Deque). Add or remove elements from both ends to see how deques work.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deque Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={dequeSize}
                onChange={(e) => setDequeSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomDeque} 
                variant="outline"
                className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Deque
              </Button>
            </div>
          </div>
          
          {/* Deque visualization */}
          <div className="mb-6 relative">
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full max-w-2xl mb-2">
                <div className="text-arena-gray text-sm">FRONT</div>
                <div className="text-arena-gray text-sm">REAR</div>
              </div>
              <div 
                className="flex items-center bg-arena-light rounded-lg p-4 w-full overflow-x-auto"
                style={{ minHeight: "100px" }}
              >
                {deque.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Deque is empty. Add elements using the controls below.</span>
                  </div>
                ) : (
                  deque.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={cn(
                          "min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300",
                          {
                            "border-arena-green bg-arena-green/10 shadow-md": 
                              (lastOperation === 'add' && operationEnd === 'front' && index === 0) ||
                              (lastOperation === 'add' && operationEnd === 'rear' && index === deque.length - 1) ||
                              (lastOperation === 'remove' && operationEnd === 'front' && index === 0) ||
                              (lastOperation === 'remove' && operationEnd === 'rear' && index === deque.length - 1) ||
                              (lastOperation === 'peek' && operationEnd === 'front' && index === 0) ||
                              (lastOperation === 'peek' && operationEnd === 'rear' && index === deque.length - 1),
                          }
                        )}
                      >
                        <div className="text-lg font-medium">{item.toString()}</div>
                        <div className="text-xs text-arena-gray">[{index}]</div>
                      </div>
                      {index < deque.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-arena-green mx-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front operations */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <ArrowLeft className="h-5 w-5 text-arena-green mr-2" />
                Front Operations
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    placeholder="Enter value"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <Button
                    onClick={addFront}
                    variant="default"
                    className="rounded-r-lg rounded-l-none"
                  >
                    Add Front
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={removeFront}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    Remove Front
                    <Trash className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={peekFront}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    Peek Front
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Rear operations */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 text-arena-green mr-2" />
                Rear Operations
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <input
                    type="text"
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    placeholder="Enter value"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <Button
                    onClick={addRear}
                    variant="default"
                    className="rounded-r-lg rounded-l-none"
                  >
                    Add Rear
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={removeRear}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    Remove Rear
                    <Trash className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={peekRear}
                    variant="default"
                    className="flex items-center justify-center"
                  >
                    Peek Rear
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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
          <h2 className="text-xl font-semibold mb-2">About Deques</h2>
          <p className="text-arena-gray mb-4">
            A deque (double-ended queue) is a linear data structure that allows insertion and removal of elements from both ends.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Insert at Front/Rear: O(1)</li>
                <li>Remove from Front/Rear: O(1)</li>
                <li>Access Front/Rear: O(1)</li>
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

export default DequeVisualizer;
