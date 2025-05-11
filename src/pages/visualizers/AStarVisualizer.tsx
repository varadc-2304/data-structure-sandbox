
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AStarVisualizer = () => {
  const [gridSize, setGridSize] = useState(10);
  const [heuristic, setHeuristic] = useState('manhattan');
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">A* Search Algorithm</h1>
          <p className="text-drona-gray">
            Visualize how A* pathfinding algorithm efficiently finds the shortest path between two points.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Brain className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Grid Size: {gridSize}x{gridSize}</label>
                <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
                  <SelectTrigger className="w-full" disabled={isRunning}>
                    <SelectValue placeholder="Select grid size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5x5</SelectItem>
                    <SelectItem value="10">10x10</SelectItem>
                    <SelectItem value="15">15x15</SelectItem>
                    <SelectItem value="20">20x20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Heuristic Function</label>
                <Select value={heuristic} onValueChange={setHeuristic}>
                  <SelectTrigger className="w-full" disabled={isRunning}>
                    <SelectValue placeholder="Select heuristic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                    <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                    <SelectItem value="chebyshev">Chebyshev Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => setIsRunning(!isRunning)} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Algorithm' : 'Start Algorithm'}
                </Button>
                <Button variant="outline">Reset Grid</Button>
                <Button variant="outline">Add Obstacles</Button>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6 shadow-md flex flex-col min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Visualization</h3>
            
            <div className="flex-grow bg-gray-50 rounded-md flex items-center justify-center">
              <div className="text-center p-8">
                <Brain className="h-16 w-16 text-drona-green/20 mx-auto mb-4" />
                <p className="text-drona-gray">A* search path visualization will appear here.</p>
                <p className="text-sm text-drona-gray mt-2">Set start and end points, add obstacles, and click "Start Algorithm" to begin.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AStarVisualizer;
