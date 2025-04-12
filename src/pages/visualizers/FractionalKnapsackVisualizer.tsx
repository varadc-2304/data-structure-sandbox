
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { ArrowRight, Briefcase, RotateCcw } from 'lucide-react';

interface Item {
  id: number;
  weight: number;
  value: number;
  ratio: number;
  fractionTaken?: number;
  color: string;
}

const FractionalKnapsackVisualizer = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [capacity, setCapacity] = useState<number>(20);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [visualizationStep, setVisualizationStep] = useState<number>(-1);
  const [isVisualizationComplete, setIsVisualizationComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  
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
        weight: Math.floor(Math.random() * 10) + 5, // 5-14
        value: Math.floor(Math.random() * 50) + 10, // 10-59
        ratio: 0, // Will be calculated
        color: colors[i % colors.length]
      });
    }
    
    // Calculate value-to-weight ratios
    newItems.forEach(item => {
      item.ratio = parseFloat((item.value / item.weight).toFixed(2));
    });
    
    setItems(newItems);
  };
  
  const resetVisualization = () => {
    setSelectedItems([]);
    setTotalValue(0);
    setTotalWeight(0);
    setVisualizationStep(-1);
    setIsVisualizationComplete(false);
    setCurrentStep("");
  };
  
  const startVisualization = () => {
    if (items.length === 0) return;
    
    resetVisualization();
    setVisualizationStep(0);
  };
  
  const nextStep = () => {
    if (visualizationStep === 0) {
      // Step 1: Sort items by value-to-weight ratio
      const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
      setItems(sortedItems);
      setVisualizationStep(1);
      setCurrentStep("Sorted items by value-to-weight ratio (descending)");
    }
    else if (visualizationStep === 1) {
      // Step 2: Start adding items
      setVisualizationStep(2);
      processFractionalKnapsack();
    }
  };
  
  const processFractionalKnapsack = () => {
    const result = fractionalKnapsack(items, capacity);
    setSelectedItems(result.selectedItems);
    setTotalValue(result.totalValue);
    setTotalWeight(result.totalWeight);
    setIsVisualizationComplete(true);
    setCurrentStep("Added items to knapsack by value-to-weight ratio until capacity is reached");
  };
  
  const fractionalKnapsack = (items: Item[], capacity: number) => {
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    let totalWeight = 0;
    let totalValue = 0;
    const selectedItems: Item[] = [];
    
    for (const item of sortedItems) {
      if (totalWeight + item.weight <= capacity) {
        // Take the whole item
        selectedItems.push({
          ...item,
          fractionTaken: 1
        });
        totalWeight += item.weight;
        totalValue += item.value;
      } else {
        // Take a fraction of the item
        const remainingCapacity = capacity - totalWeight;
        if (remainingCapacity > 0) {
          const fraction = remainingCapacity / item.weight;
          selectedItems.push({
            ...item,
            fractionTaken: fraction
          });
          totalWeight += remainingCapacity;
          totalValue += item.value * fraction;
        }
        break;
      }
    }
    
    return {
      selectedItems,
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalWeight: parseFloat(totalWeight.toFixed(2))
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Fractional Knapsack Visualization</h1>
          <p className="text-drona-gray mb-8">
            The Fractional Knapsack Problem involves selecting fractions of items to maximize value while staying within a weight constraint.
            Unlike the 0/1 knapsack, items can be broken into fractions.
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
                          <th className="border p-2 text-left">Value/Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className={visualizationStep >= 1 ? "transition-all duration-500" : ""}>
                            <td className="border p-2">
                              <div className={`w-4 h-4 rounded-full inline-block mr-2 ${item.color}`}></div>
                              Item {item.id}
                            </td>
                            <td className="border p-2">{item.weight}</td>
                            <td className="border p-2">{item.value}</td>
                            <td className="border p-2">{item.ratio}</td>
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
                                <span>Item {item.id}: </span>
                                {item.fractionTaken === 1 ? (
                                  <span className="ml-1">Whole item (W: {item.weight}, V: {item.value})</span>
                                ) : (
                                  <span className="ml-1">
                                    {(item.fractionTaken! * 100).toFixed(0)}% of item 
                                    (W: {(item.weight * item.fractionTaken!).toFixed(2)}, 
                                    V: {(item.value * item.fractionTaken!).toFixed(2)})
                                  </span>
                                )}
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
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">How Fractional Knapsack Works</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Calculate the value-to-weight ratio for each item.</li>
                <li>Sort items by value-to-weight ratio in descending order.</li>
                <li>Take items with the highest ratio first, until the knapsack is full.</li>
                <li>If an item can't fit completely, take the fraction that fits.</li>
              </ol>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Greedy Approach</h3>
                <p className="text-drona-gray">
                  Fractional Knapsack uses a greedy approach, always taking the item with the highest value-to-weight ratio first.
                  This approach guarantees an optimal solution for the fractional knapsack problem, unlike the 0/1 knapsack problem where items cannot be divided.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionalKnapsackVisualizer;
