import { Plus, Trash, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GraphControlsProps {
  newNodeLabel: string;
  edgeFrom: string;
  edgeTo: string;
  edgeWeight: string;
  isDirected: boolean;
  isTraversing: boolean;
  traversalType: "bfs" | "dfs" | null;
  traversalOrder: string[];
  currentTraversal: number;
  onNewNodeLabelChange: (value: string) => void;
  onEdgeFromChange: (value: string) => void;
  onEdgeToChange: (value: string) => void;
  onEdgeWeightChange: (value: string) => void;
  onIsDirectedChange: (value: boolean) => void;
  onAddNode: () => void;
  onAddEdge: () => void;
  onClearGraph: () => void;
  onStartBFS: () => void;
  onStartDFS: () => void;
  onResetTraversal: () => void;
}

const GraphControls = ({
  newNodeLabel,
  edgeFrom,
  edgeTo,
  edgeWeight,
  isDirected,
  isTraversing,
  traversalType,
  traversalOrder,
  currentTraversal,
  onNewNodeLabelChange,
  onEdgeFromChange,
  onEdgeToChange,
  onEdgeWeightChange,
  onIsDirectedChange,
  onAddNode,
  onAddEdge,
  onClearGraph,
  onStartBFS,
  onStartDFS,
  onResetTraversal,
}: GraphControlsProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Graph Visualization</h2>
        <div className="flex gap-2">
          <Button onClick={onStartBFS} disabled={isTraversing} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            {isTraversing && traversalType === "bfs" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            BFS
          </Button>
          <Button onClick={onStartDFS} disabled={isTraversing} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            {isTraversing && traversalType === "dfs" ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            DFS
          </Button>
          <Button onClick={onResetTraversal} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Plus className="h-5 w-5 text-arena-green mr-2" />
            Add Node
          </h3>
          <div className="flex">
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => onNewNodeLabelChange(e.target.value)}
              placeholder="Node label"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
            />
            <Button onClick={onAddNode} variant="default" className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90">
              Add
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-lg font-medium mb-3">Add Edge</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <input
                type="text"
                value={edgeFrom}
                onChange={(e) => onEdgeFromChange(e.target.value)}
                placeholder="From"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <input
                type="text"
                value={edgeTo}
                onChange={(e) => onEdgeToChange(e.target.value)}
                placeholder="To"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
            </div>
            <div className="flex gap-1">
              <input
                type="number"
                value={edgeWeight}
                onChange={(e) => onEdgeWeightChange(e.target.value)}
                placeholder="Weight"
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <label className="flex items-center text-sm">
                <input type="checkbox" checked={isDirected} onChange={(e) => onIsDirectedChange(e.target.checked)} className="mr-1" />
                Directed
              </label>
            </div>
            <Button onClick={onAddEdge} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90 text-sm">
              Add Edge
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Trash className="h-5 w-5 text-arena-green mr-2" />
            Clear Graph
          </h3>
          <Button onClick={onClearGraph} variant="default" className="w-full bg-arena-green text-white hover:bg-arena-green/90">
            Clear
          </Button>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-lg font-medium mb-3">Traversal Status</h3>
          <div className="text-sm text-arena-gray">
            {isTraversing ? (
              <span className="text-arena-green">
                Running {traversalType?.toUpperCase()}... ({currentTraversal + 1}/{traversalOrder.length})
              </span>
            ) : (
              <span>Ready to traverse</span>
            )}
          </div>
          {traversalOrder.length > 0 && (
            <div className="mt-2 text-xs text-arena-gray">Order: {traversalOrder.slice(0, currentTraversal + 1).join(" → ")}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphControls;
