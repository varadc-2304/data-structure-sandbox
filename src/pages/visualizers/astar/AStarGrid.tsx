import { Navigation, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Node, Step } from "./useAStarVisualizer";

interface AStarGridProps {
  grid: Node[][];
  GRID_SIZE: number;
  currentStepData: Step | null;
  onCellClick: (x: number, y: number) => void;
  getCellClass: (node: Node) => string;
  getCellContent: (node: Node) => string;
}

const AStarGrid = ({ grid, GRID_SIZE, currentStepData, onCellClick, getCellClass, getCellContent }: AStarGridProps) => {
  return (
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">A* Matrix Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 flex justify-center">
          <div className="inline-block p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="grid grid-cols-12 gap-1">
              {grid.map((row, y) =>
                row.map((node, x) => (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => onCellClick(x, y)}
                    className={`w-10 h-10 border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 rounded ${getCellClass(node)}`}
                    title={`(${x}, ${y}) ${node.f > 0 ? `f=${node.f.toFixed(1)}` : ""}`}
                  >
                    {node.isStart && <Navigation className="h-4 w-4 text-white" />}
                    {node.isGoal && <Target className="h-4 w-4 text-white" />}
                    {!node.isStart && !node.isGoal && getCellContent(node)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-drona-light/30 rounded-lg border border-drona-green/20">
          <h3 className="font-bold text-drona-dark mb-2">Algorithm Status:</h3>
          <p className="text-sm text-drona-gray">{currentStepData?.description || "Ready to start"}</p>
        </div>

        {currentStepData?.pathFound && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
            <h3 className="text-lg font-bold text-green-800 mb-2">🎯 Optimal Path Found!</h3>
            <p className="text-sm text-green-700">A* successfully found the shortest path.</p>
          </div>
        )}

        {currentStepData?.pathFound === false && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-300">
            <h3 className="text-lg font-bold text-red-800 mb-2">❌ No Path Available!</h3>
            <p className="text-sm text-red-700">Remove some walls or change the goal position to find a path.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
            <div className="w-4 h-4 bg-green-700 rounded flex items-center justify-center">
              <Navigation className="h-2 w-2 text-white" />
            </div>
            <span className="text-sm font-semibold text-green-800">Start</span>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-red-50 rounded border border-red-200">
            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
              <Target className="h-2 w-2 text-white" />
            </div>
            <span className="text-sm font-semibold text-red-800">Goal</span>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
            <div className="w-4 h-4 bg-blue-200 rounded"></div>
            <span className="text-sm font-semibold text-blue-800">Open Set</span>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span className="text-sm font-semibold text-gray-800">Closed Set</span>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm font-semibold text-yellow-800">Final Path</span>
          </div>

          <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded border border-purple-200">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm font-semibold text-purple-800">Current</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AStarGrid;
