
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';

const DequeVisualizer = () => {
  const [deque, setDeque] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationEnd, setOperationEnd] = useState<'front' | 'rear' | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationEnd(null);
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
    
    toast({
      title: "Element added",
      description: `Added "${newValue}" to the front of the deque`,
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
    
    toast({
      title: "Element added",
      description: `Added "${newValue}" to the rear of the deque`,
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
    
    toast({
      title: "Element removed",
      description: `Removed "${removedValue}" from the front of the deque`,
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
    
    toast({
      title: "Element removed",
      description: `Removed "${removedValue}" from the rear of the deque`,
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
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Deque Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a double-ended queue (Deque). Add or remove elements from both ends to see how deques work.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4">Deque Visualization</h2>
          
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
                            "animate-scale-in": 
                              (lastOperation === 'add' && operationEnd === 'front' && index === 0) ||
                              (lastOperation === 'add' && operationEnd === 'rear' && index === deque.length - 1),
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
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
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
              <span className="font-medium">Common Applications:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Implementing both stack and queue</li>
                <li>Work-stealing algorithms</li>
                <li>Palindrome checking</li>
                <li>Sliding window problems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DequeVisualizer;
