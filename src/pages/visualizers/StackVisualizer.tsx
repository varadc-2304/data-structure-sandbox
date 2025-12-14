import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { Plus, Trash, Eye, AlertCircle, ArrowDown, ArrowUp, Shuffle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStackVisualizer } from "./stack/useStackVisualizer";

const StackVisualizer = () => {
  const {
    state: { stack, newElement, stackSize, lastOperation, operationTarget, logs, isViewing, searchValue, isSearching, removedElements, foundIndex, foundValue },
    actions: { setNewElement, setStackSize, pushElement, popElement, peekElement, viewTopElement, generateRandomStack, clearStack, setSearchValue, searchElement, restoreStack },
  } = useStackVisualizer();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Stack Visualizer</h1>
          <p className="text-arena-gray">Visualize and perform operations on a stack. Push, pop, or peek elements to see how stacks work with LIFO (Last-In-First-Out) principle.</p>
        </div>

        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Stack Visualization</h2>
            <div className="flex gap-2 items-center">
              <input 
                type="number" 
                value={stackSize} 
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 5 && Number(val) <= 20)) {
                    setStackSize(val);
                  }
                }} 
                min={5}
                max={20}
                placeholder="5" 
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" 
              />
              <Button onClick={generateRandomStack} variant="outline" className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white" disabled={isSearching}>
                <Shuffle className="h-4 w-4" />
                Generate Random Stack
              </Button>
              <Button onClick={viewTopElement} variant="outline" className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white" disabled={isSearching}>
                <Eye className="h-4 w-4" />
                View Top Element
              </Button>
              <Button onClick={clearStack} variant="outline" className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white" disabled={isSearching}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          <div className="mb-6 relative overflow-hidden">
            <div className="flex flex-col items-center" onClick={removedElements.length > 0 ? restoreStack : undefined} style={{ cursor: removedElements.length > 0 ? "pointer" : "default" }}>
              {/* Open lid */}
              <div className="w-64 h-3 bg-gray-400 rounded-t-lg border-2 border-gray-600 relative" style={{ transform: "perspective(100px) rotateX(5deg)" }}>
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-gray-500 to-gray-400 rounded-t-lg"></div>
              </div>
              
              {/* Stack container */}
              <div className="w-64 border-2 border-gray-600 border-t-0 bg-arena-light rounded-b-lg p-3" style={{ minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}>
                {stack.length === 0 ? (
                  <div className="flex items-center justify-center h-full py-8 text-arena-gray">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>Stack is empty. Push elements using the controls below.</span>
                  </div>
                ) : (
                  <div className="flex flex-col-reverse gap-1">
                    {stack.map((item, index) => {
                      const positionFromTop = stack.length - index - 1;
                      return (
                        <div
                          key={index}
                          className={cn("w-full p-3 rounded border-2 border-gray-300 bg-white flex justify-between items-center transition-all duration-300 shadow-sm", {
                            "border-arena-green bg-arena-green/10 shadow-md": operationTarget === index && !isViewing,
                            "border-arena-green bg-arena-green/10 shadow-md animate-bounce": isViewing && operationTarget === index,
                          })}
                        >
                          <div className="text-xs text-arena-gray font-medium">
                            {positionFromTop === 0 ? "TOP" : `Pos ${positionFromTop}`}
                          </div>
                          <div className="text-lg font-semibold text-arena-dark">{item.toString()}</div>
                          {positionFromTop === stack.length - 1 && (
                            <div className="text-xs text-arena-gray">BOTTOM</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Base */}
              <div className="w-64 h-2 bg-gray-600 rounded-b-lg"></div>
            </div>
            
            {/* Removed elements display */}
            {removedElements.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  {foundIndex !== null ? `Element found! Click on the stack to restore all elements.` : `Elements removed during search. Click on the stack to restore.`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {removedElements.map((item, idx) => {
                    const isFound = foundValue !== null && item === foundValue;
                    return (
                      <div 
                        key={idx} 
                        className={cn("px-2 py-1 border rounded text-sm transition-all", {
                          "bg-green-200 border-green-400 font-semibold": isFound,
                          "bg-yellow-100 border-yellow-300": !isFound,
                        })}
                      >
                        {item.toString()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Push Element
              </h3>
              <div className="flex">
                <input 
                  type="text" 
                  value={newElement} 
                  onChange={(e) => setNewElement(e.target.value)} 
                  placeholder="Enter value" 
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" 
                  disabled={isSearching}
                />
                <Button onClick={pushElement} variant="default" className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90 transition-colors duration-300 flex items-center" disabled={isSearching}>
                  Push
                  <ArrowUp className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Pop Element
              </h3>
              <Button onClick={popElement} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90 transition-colors duration-300 flex items-center justify-center" disabled={isSearching}>
                Pop
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-arena-green mr-2" />
                Peek Element
              </h3>
              <Button onClick={peekElement} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90 transition-colors duration-300 flex items-center justify-center" disabled={isSearching}>
                Peek
                <Eye className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-arena-green mr-2" />
                Search Element
              </h3>
              <div className="flex">
                <input 
                  type="text" 
                  value={searchValue} 
                  onChange={(e) => setSearchValue(e.target.value)} 
                  placeholder="Enter value" 
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent" 
                  disabled={isSearching}
                />
                <Button onClick={searchElement} variant="default" className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90 transition-colors duration-300 flex items-center" disabled={isSearching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-arena-gray">No operations performed yet</div>
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
          <p className="text-arena-gray mb-4">A stack is a linear data structure that follows the LIFO (Last In, First Out) principle. Elements are added and removed from the top using push and pop operations. Stacks are used in function calls, expression evaluation, undo mechanisms, and backtracking. They offer efficient operations but limited random access.</p>
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
