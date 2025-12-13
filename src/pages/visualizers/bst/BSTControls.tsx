import { Plus, Trash, Search, Play, RotateCcw, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BSTNode } from "./useBSTVisualizer";
import { useState } from "react";

interface BSTControlsProps {
  nodes: BSTNode[];
  newValue: string;
  parentNode: string;
  childNode: string;
  childPosition: "left" | "right";
  searchValue: string;
  isTraversing: boolean;
  traversalType: "inorder" | "preorder" | "postorder" | "search" | null;
  traversalOrder: string[];
  currentTraversal: number;
  onNewValueChange: (value: string) => void;
  onParentNodeChange: (value: string) => void;
  onChildNodeChange: (value: string) => void;
  onChildPositionChange: (position: "left" | "right") => void;
  onSearchValueChange: (value: string) => void;
  onAddNode: () => void;
  onAssignChild: () => void;
  onStartSearch: () => void;
  onClearTree: () => void;
  onGenerateTree: (n: number) => void;
  onStartInorder: () => void;
  onStartPreorder: () => void;
  onStartPostorder: () => void;
  onResetTraversal: () => void;
}

const BSTControls = ({
  nodes,
  newValue,
  parentNode,
  childNode,
  childPosition,
  searchValue,
  isTraversing,
  traversalType,
  traversalOrder,
  currentTraversal,
  onNewValueChange,
  onParentNodeChange,
  onChildNodeChange,
  onChildPositionChange,
  onSearchValueChange,
  onAddNode,
  onAssignChild,
  onStartSearch,
  onClearTree,
  onGenerateTree,
  onStartInorder,
  onStartPreorder,
  onStartPostorder,
  onResetTraversal,
}: BSTControlsProps) => {
  const [treeSize, setTreeSize] = useState("");

  const handleGenerateTree = () => {
    const n = Number(treeSize);
    if (isNaN(n) || n <= 0) {
      return;
    }
    onGenerateTree(n);
    setTreeSize("");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">BST Visualization</h2>
        <div className="flex gap-2">
          <Button onClick={onStartInorder} disabled={isTraversing} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            <Play className="h-4 w-4 mr-2" />
            Inorder
          </Button>
          <Button onClick={onStartPreorder} disabled={isTraversing} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            <Play className="h-4 w-4 mr-2" />
            Preorder
          </Button>
          <Button onClick={onStartPostorder} disabled={isTraversing} variant="outline" className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white">
            <Play className="h-4 w-4 mr-2" />
            Postorder
          </Button>
          {isTraversing && (
            <Button onClick={onResetTraversal} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3 flex items-center">
            <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
            Generate Tree
          </h3>
          <div className="space-y-2">
            <Input
              type="number"
              value={treeSize}
              onChange={(e) => setTreeSize(e.target.value)}
              placeholder="Enter n (1-15)"
              min="1"
              max="15"
              className="focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            <Button
              onClick={handleGenerateTree}
              variant="default"
              size="sm"
              className="w-full bg-purple-500 text-white hover:bg-purple-500/90"
            >
              Generate
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3 flex items-center">
            <Plus className="h-4 w-4 text-arena-green mr-2" />
            Add Node
          </h3>
          <div className="space-y-2">
            <Input type="number" value={newValue} onChange={(e) => onNewValueChange(e.target.value)} placeholder="Enter value" className="focus:ring-arena-green focus:border-arena-green text-sm" />
            <Button onClick={onAddNode} variant="default" size="sm" className="w-full bg-arena-green text-white hover:bg-arena-green/90">
              Add Node
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3 flex items-center">
            <Search className="h-4 w-4 text-blue-500 mr-2" />
            Search
          </h3>
          <div className="space-y-2">
            <Input type="number" value={searchValue} onChange={(e) => onSearchValueChange(e.target.value)} placeholder="Search value" className="focus:ring-blue-500 focus:border-blue-500 text-sm" />
            <Button onClick={onStartSearch} disabled={isTraversing} variant="default" size="sm" className="w-full bg-blue-500 text-white hover:bg-blue-500/90">
              Search
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3 flex items-center">
            <Trash className="h-4 w-4 text-arena-green mr-2" />
            Clear Tree
          </h3>
          <Button onClick={onClearTree} variant="default" size="sm" className="w-full bg-arena-green text-white hover:bg-arena-green/90">
            Clear All
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3">Assign Child</h3>
          <div className="space-y-2">
            <select value={parentNode} onChange={(e) => onParentNodeChange(e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white">
              <option value="">Select Parent</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node {node.value}
                </option>
              ))}
            </select>
            <select value={childNode} onChange={(e) => onChildNodeChange(e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm bg-white">
              <option value="">Select Child</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  Node {node.value}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button onClick={() => onChildPositionChange("left")} variant={childPosition === "left" ? "default" : "outline"} size="sm" className="flex-1 text-xs">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Left
              </Button>
              <Button onClick={() => onChildPositionChange("right")} variant={childPosition === "right" ? "default" : "outline"} size="sm" className="flex-1 text-xs">
                <ArrowRight className="h-3 w-3 mr-1" />
                Right
              </Button>
            </div>
            <Button onClick={onAssignChild} variant="default" size="sm" className="w-full bg-blue-500 text-white hover:bg-blue-500/90">
              Assign
            </Button>
          </div>
        </div>

        <div className="bg-arena-light rounded-xl p-4">
          <h3 className="text-base font-medium mb-3">Status</h3>
          <div className="text-sm text-arena-gray">
            {isTraversing ? (
              <div className="space-y-1">
                <span className="text-arena-green block">Running {traversalType}...</span>
                <span className="text-xs">Step: {currentTraversal + 1}/{traversalOrder.length}</span>
              </div>
            ) : (
              <span>Ready</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BSTControls;
