
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { ArrowRight, Briefcase, RotateCcw } from 'lucide-react';

interface Item {
  id: number;
  weight: number;
  value: number;
  color: string;
  isSelected?: boolean;
}

const ZeroOneKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(15);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [dpTable, setDpTable] = useState<number[][]>([]);
  const [visualizationStep, setVisualizationStep] = useState<number>(-1);
  const [isVisualizationComplete, setIsVisualizationComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [highlightedCell, setHighlightedCell] = useState<{i: number, w: number} | null>(null);
  
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
  ];
  
  const generateRandomItems = () => {
    resetVisualization();
    
    const count = Math.floor(Math.random() * 3) + 5; // 5-7 items
    const newItems: Item[] = [];
    
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: i + 1,
        weight: Math.floor(Math.random() * 6) + 1, // 1-6
        value: Math.floor(Math.random() * 50) + 10, // 10-59
        color: colors[i % colors.length],
        isSelected: false
      });
    }
    
    setItems(newItems);
  };
  
  const resetVisualization = () => {
    setSelectedItems([]);
    setTotalValue(0);
    setTotalWeight(0);
    setDpTable([]);
    setVisualizationStep(-1);
    setIsVisualizationComplete(false);
    setCurrentStep("");
    setHighlightedCell(null);
  };
  
  const startVisualization = () => {
    if (items.length === 0) return;
    
    resetVisualization();
    
    // Initialize the DP table
    const n = items.length;
    const w = capacity;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(w + 1).fill(0));
    
    setDpTable(dp);
    setVisualizationStep(0);
    setCurrentStep("Initialized DP table with zeros");
  };
  
  const nextStep = async () => {
    const n = items.length;
    const w = capacity;
    
    if (visualizationStep < n * w) {
      const i = Math.floor(visualizationStep / w) + 1;
      const j = (visualizationStep % w) + 1;
      
      // Update the current cell in the DP table
      const newDpTable = [...dpTable];
      const currentItem = items[i - 1];
      
      setHighlightedCell({ i, w: j });
      
      if (currentItem.weight > j) {
        // If item weight is more than current capacity, take the value from row above
        newDpTable[i][j] = newDpTable[i - 1][j];
        setCurrentStep(`Item ${i} (weight ${currentItem.weight}) is too heavy for capacity ${j}, so use value from above: ${newDpTable[i - 1][j]}`);
      } else {
        // Choose maximum of (1) excluding the item or (2) including the item
        const valueWithoutItem = newDpTable[i - 1][j];
        const valueWithItem = currentItem.value + newDpTable[i - 1][j - currentItem.weight];
        
        newDpTable[i][j] = Math.max(valueWithoutItem, valueWithItem);
        
        setCurrentStep(`For item ${i} and capacity ${j}: max(exclude=${valueWithoutItem}, include=${valueWithItem}) = ${newDpTable[i][j]}`);
      }
      
      setDpTable(newDpTable);
      setVisualizationStep(visualizationStep + 1);
    } else if (visualizationStep === n * w) {
      // Reconstruction step to find selected items
      await reconstructSolution();
      setVisualizationStep(visualizationStep + 1);
    }
  };
  
  const reconstructSolution = async () => {
    const n = items.length;
    const w = capacity;
    const selected: Item[] = [];
    let remainingCapacity = w;
    let totalValue = 0;
    let totalWeight = 0;
    
    // Create a copy of items to update selection status
    const updatedItems = [...items];
    
    for (let i = n; i > 0; i--) {
      // If the value came from including this item
      if (dpTable[i][remainingCapacity] !== dpTable[i - 1][remainingCapacity]) {
        const item = items[i - 1];
        selected.push(item);
        
        // Update the item's selection status
        updatedItems[i - 1] = { ...item, isSelected: true };
        
        totalValue += item.value;
        totalWeight += item.weight;
        remainingCapacity -= item.weight;
      }
    }
    
    setItems(updatedItems);
    setSelectedItems(selected);
    setTotalValue(totalValue);
    setTotalWeight(totalWeight);
    setIsVisualizationComplete(true);
    setCurrentStep("Reconstructed the solution by tracing back through the DP table");
    setHighlightedCell(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">0/1 Knapsack Visualization</h1>
          <p className="text-drona-gray mb-8">
            The 0/1 Knapsack Problem involves selecting whole items (cannot be divided) to maximize value while staying within a weight constraint.
            It is solved using dynamic programming.
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Knapsack Capacity:</label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                      className="border border-gray-300 rounded px-3 py-1 w-20"
                      min="1"
                      max="20"
                      disabled={visualizationStep > -1}
                    />
                  </div>
                  
                  <Button onClick={generateRandomItems}>
                    Generate Random Items
                  </Button>
                  
                  <Button 
                    onClick={startVisualization} 
                    disabled={items.length === 0 || visualizationStep > -1}
                  >
                    <Briefcase className="mr-2 h-4 w-4" /> Start
                  </Button>
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={visualizationStep === -1 || isVisualizationComplete}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" /> Next Step
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline" 
                    disabled={visualizationStep === -1}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
                
                {currentStep && (
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p className="font-medium">Current step: {currentStep}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Available items */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Available Items</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2 text-left">Item</th>
                          <th className="border p-2 text-left">Weight</th>
                          <th className="border p-2 text-left">Value</th>
                          <th className="border p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr 
                            key={item.id} 
                            className={`transition-all duration-500 ${item.isSelected ? 'bg-green-50' : ''}`}
                          >
                            <td className="border p-2">
                              <div className={`w-4 h-4 rounded-full inline-block mr-2 ${item.color}`}></div>
                              Item {item.id}
                            </td>
                            <td className="border p-2">{item.weight}</td>
                            <td className="border p-2">{item.value}</td>
                            <td className="border p-2">
                              {isVisualizationComplete ? 
                                (item.isSelected ? 
                                  <span className="text-green-600 font-medium">Selected</span> : 
                                  <span className="text-red-600">Not selected</span>
                                ) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Knapsack */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Knapsack</h3>
                    <div className="border p-4 rounded-md bg-gray-50 h-full">
                      <div className="flex justify-between mb-4">
                        <div>Capacity: {capacity}</div>
                        <div>Used: {totalWeight}/{capacity}</div>
                      </div>
                      
                      <div className="relative w-full h-6 bg-gray-200 rounded-full mb-4">
                        <div 
                          className="absolute top-0 left-0 h-6 bg-drona-green rounded-full transition-all duration-500"
                          style={{ width: `${(totalWeight / capacity) * 100}%` }}
                        ></div>
                      </div>
                      
                      {selectedItems.length > 0 ? (
                        <div>
                          <div className="mb-2 font-medium">Selected Items:</div>
                          <div className="space-y-2">
                            {selectedItems.map((item, index) => (
                              <div key={index} className="flex items-center">
                                <div className={`w-4 h-4 rounded-full ${item.color} mr-2`}></div>
                                <span>Item {item.id} (W: {item.weight}, V: {item.value})</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 font-medium">
                            Total Value: {totalValue}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          Empty knapsack
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* DP Table Visualization */}
                {dpTable.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3">Dynamic Programming Table</h3>
                    <div className="overflow-x-auto">
                      <table className="border-collapse min-w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-2 text-center">Item/Weight</th>
                            {Array.from({ length: capacity + 1 }, (_, i) => (
                              <th key={i} className="border p-1 text-center w-10">{i}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dpTable.map((row, i) => (
                            <tr key={i}>
                              <td className="border p-2 text-center bg-gray-100">
                                {i === 0 ? '0 (Base)' : `Item ${i}`}
                              </td>
                              {row.map((cell, j) => (
                                <td 
                                  key={j} 
                                  className={`border p-1 text-center w-10 ${
                                    highlightedCell && highlightedCell.i === i && highlightedCell.w === j 
                                      ? 'bg-yellow-200' 
                                      : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How 0/1 Knapsack Works</h2>
              <p className="text-drona-gray mb-3">
                The 0/1 Knapsack Problem is solved using dynamic programming. For each item, we have two choices:
                include it or exclude it. We build a table to store optimal values for subproblems.
              </p>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">DP Approach</h3>
                <ul className="list-disc list-inside space-y-2 text-drona-gray">
                  <li>Create a 2D array dp[n+1][W+1] where n is the number of items and W is the capacity.</li>
                  <li>Base case: dp[0][j] = 0 for all j (no items means no value).</li>
                  <li>For each item i and each capacity j, decide whether to include or exclude the item:</li>
                  <li className="ml-6">If item i's weight > j, we can't include it: dp[i][j] = dp[i-1][j]</li>
                  <li className="ml-6">Otherwise, choose the maximum of:
                    <ul className="ml-6">
                      <li>Excluding the item: dp[i-1][j]</li>
                      <li>Including the item: value[i-1] + dp[i-1][j-weight[i-1]]</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div className="text-drona-gray">
                <h3 className="font-medium mb-2">Difference from Fractional Knapsack</h3>
                <p>
                  Unlike the Fractional Knapsack problem where items can be broken into fractions,
                  the 0/1 Knapsack problem requires taking either the whole item (1) or nothing (0).
                  This makes it more complex and requires dynamic programming rather than a simple greedy approach.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroOneKnapsackVisualizer;
