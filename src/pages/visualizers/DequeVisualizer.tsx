import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Plus, Eye, AlertCircle, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDequeVisualizer } from "./deque/useDequeVisualizer";

const DequeVisualizer = () => {
  const {
    state: { deque, newElement, dequeSize, lastOperation, operationEnd, logs },
    actions: { setNewElement, setDequeSize, addFront, addRear, removeFront, removeRear, peekFront, peekRear, generateRandomDeque },
  } = useDequeVisualizer();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Deque Visualizer</h1>
          <p className="text-arena-gray">Visualize and perform operations on a double-ended queue (Deque). Add or remove elements from both ends to see how deques work.</p>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deque Visualization</h2>
            <div className="flex gap-2">
              <input type="number" value={dequeSize} onChange={(e) => setDequeSize(e.target.value)} placeholder="Size" className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" />
              <Button onClick={generateRandomDeque} variant="outline" className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
                <Shuffle className="h-4 w-4" />
                Generate Random Deque
              </Button>
              <Button onClick={peekFront} variant="outline" className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
                <Eye className="h-4 w-4" />
                Peek Front
              </Button>
              <Button onClick={peekRear} variant="outline" className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
                <Eye className="h-4 w-4" />
                Peek Rear
              </Button>
            </div>
          </div>

          <div className="mb-6 relative overflow-hidden">
            <div className="flex flex-col items-center">
              <div className="flex items-center bg-arena-light rounded-lg p-4 w-full overflow-x-auto relative" style={{ minHeight: "120px" }}>
                {deque.length === 0 ? (
                  <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Deque is empty. Add elements using the controls below.</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-2 left-8 text-arena-gray text-sm font-semibold">FRONT</div>
                    <div className="absolute top-2 right-8 text-arena-gray text-sm font-semibold">REAR</div>
                    {deque.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className={cn("min-w-[60px] h-16 m-1 rounded-lg border-2 border-gray-200 flex flex-col justify-center items-center transition-all duration-300", {
                            "border-arena-green bg-arena-green/10 shadow-md animate-bounce":
                              (lastOperation === "add" && operationEnd === "front" && index === 0) ||
                              (lastOperation === "add" && operationEnd === "rear" && index === deque.length - 1) ||
                              (lastOperation === "remove" && operationEnd === "front" && index === 0) ||
                              (lastOperation === "remove" && operationEnd === "rear" && index === deque.length - 1) ||
                              (lastOperation === "peek" && operationEnd === "front" && index === 0) ||
                              (lastOperation === "peek" && operationEnd === "rear" && index === deque.length - 1),
                          })}
                        >
                          <div className="text-lg font-medium">{item.toString()}</div>
                          <div className="text-xs text-arena-gray">[{index}]</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Front Operations
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <input type="text" value={newElement} onChange={(e) => setNewElement(e.target.value)} placeholder="Enter value" className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" />
                  <Button onClick={addFront} variant="default" className="rounded-r-lg rounded-l-none bg-arena-green text-white hover:bg-arena-green/90">
                    Add Front
                  </Button>
                </div>
                <Button onClick={removeFront} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90">
                  Remove Front
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Rear Operations
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <input type="text" value={newElement} onChange={(e) => setNewElement(e.target.value)} placeholder="Enter value" className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" />
                  <Button onClick={addRear} variant="default" className="rounded-r-lg rounded-l-none bg-arena-green text-white hover:bg-arena-green/90">
                    Add Rear
                  </Button>
                </div>
                <Button onClick={removeRear} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90">
                  Remove Rear
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-arena-gray">No operations performed yet</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-arena-green">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">About Deques</h2>
          <p className="text-arena-gray mb-4">A deque (double-ended queue) is a linear data structure that allows insertion and removal of elements from both ends.</p>
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
