
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, ArrowRight, ArrowLeft, Shuffle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';

const QueueVisualizer = () => {
  const [queue, setQueue] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState('');
  const [queueSize, setQueueSize] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const enqueueElement = () => {
    if (newElement.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to enqueue",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setQueue([...queue, newValue]);
    setLastOperation('enqueue');
    setNewElement('');
    
    const message = `Enqueued "${newValue}" to the back of the queue`;
    addToLog(message);
    
    toast({
      title: "Element enqueued",
      description: message,
    });
  };

  const dequeueElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Queue underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive",
      });
      return;
    }

    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setLastOperation('dequeue');
    
    const message = `Dequeued "${dequeuedValue}" from the front of the queue`;
    addToLog(message);
    
    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const frontValue = queue[0];
    setLastOperation('peek');
    
    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);
    
    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
    });
  };

  const generateRandomQueue = () => {
    if (queueSize.trim() === '' || isNaN(Number(queueSize)) || Number(queueSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for queue size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(queueSize), 15); // Limit to 15 elements max
    const randomQueue = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setQueue(randomQueue);
    setLastOperation(null);
    setQueueSize('');
    
    const message = `Generated random queue with ${size} elements`;
    addToLog(message);
    
    toast({
      title: "Random queue generated",
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
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Queue Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a queue. Enqueue, dequeue, or peek elements to see how queues work with FIFO (First-In-First-Out) principle.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Queue Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={queueSize}
                onChange={(e) => setQueueSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomQueue} 
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Queue
              </Button>
            </div>
          </div>
          
          {/* Queue visualization */}
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
                {queue.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Queue is empty. Enqueue elements using the controls below.</span>
                  </div>
                ) : (
                  queue.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={cn(
                          "min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300",
                          {
                            "border-arena-green bg-arena-green/10 shadow-md": 
                              (lastOperation === 'enqueue' && index === queue.length - 1) ||
                              (lastOperation === 'dequeue' && index === 0) ||
                              (lastOperation === 'peek' && index === 0),
                          }
                        )}
                      >
                        <div className="text-lg font-medium">{item.toString()}</div>
                        <div className="text-xs text-arena-gray">[{index}]</div>
                      </div>
                      {index < queue.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-arena-green mx-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enqueue element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Enqueue Element
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
                  onClick={enqueueElement}
                  variant="default"
                  className="rounded-l-none rounded-r-lg"
                >
                  Enqueue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Dequeue element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Dequeue Element
              </h3>
              <Button
                onClick={dequeueElement}
                variant="default"
                className="w-full"
              >
                Dequeue
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Peek element */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-arena-green mr-2" />
                Peek Element
              </h3>
              <Button
                onClick={peekElement}
                variant="default"
                className="w-full"
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
          <h2 className="text-xl font-semibold mb-2">About Queues</h2>
          <p className="text-arena-gray mb-4">
            A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. The first element added is the first one to be removed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Enqueue: O(1)</li>
                <li>Dequeue: O(1)</li>
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

export default QueueVisualizer;
