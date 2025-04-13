
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const BinaryTreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState('');
  const [parentValue, setParentValue] = useState('');
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const resetHighlights = () => {
    setHighlightedNode(null);
    setLastOperation(null);
  };

  // Helper function to add a node to the tree
  const addNode = (
    currentNode: TreeNode | null,
    parentVal: number,
    newVal: number,
    dir: 'left' | 'right'
  ): TreeNode | null => {
    if (currentNode === null) {
      return null;
    }

    if (currentNode.value === parentVal) {
      if (dir === 'left') {
        currentNode.left = { value: newVal, left: null, right: null };
      } else {
        currentNode.right = { value: newVal, left: null, right: null };
      }
      return currentNode;
    }

    currentNode.left = addNode(currentNode.left, parentVal, newVal, dir);
    currentNode.right = addNode(currentNode.right, parentVal, newVal, dir);
    
    return currentNode;
  };

  // Helper function to search for a node
  const findNode = (currentNode: TreeNode | null, val: number): boolean => {
    if (currentNode === null) {
      return false;
    }

    if (currentNode.value === val) {
      return true;
    }

    return findNode(currentNode.left, val) || findNode(currentNode.right, val);
  };

  const createRoot = () => {
    if (newValue.trim() === '' || isNaN(Number(newValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value",
        variant: "destructive",
      });
      return;
    }

    const val = Number(newValue);
    setRoot({ value: val, left: null, right: null });
    setNewValue('');
    
    addLog(`Created root node with value ${val}`);
    
    toast({
      title: "Root created",
      description: `Created root node with value ${val}`,
    });
  };

  const insertNode = () => {
    if (root === null) {
      toast({
        title: "Empty tree",
        description: "Please create a root node first",
        variant: "destructive",
      });
      return;
    }

    if (newValue.trim() === '' || isNaN(Number(newValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value for the new node",
        variant: "destructive",
      });
      return;
    }

    if (parentValue.trim() === '' || isNaN(Number(parentValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value for the parent node",
        variant: "destructive",
      });
      return;
    }

    const newVal = Number(newValue);
    const parentVal = Number(parentValue);

    if (!findNode(root, parentVal)) {
      toast({
        title: "Node not found",
        description: `Parent node with value ${parentVal} does not exist`,
        variant: "destructive",
      });
      return;
    }

    const newRoot = { ...root };
    addNode(newRoot, parentVal, newVal, direction);
    setRoot(newRoot);
    setNewValue('');
    setParentValue('');

    setLastOperation('insert');
    setHighlightedNode(newVal);
    
    addLog(`Added node with value ${newVal} as ${direction} child of node ${parentVal}`);
    
    toast({
      title: "Node inserted",
      description: `Added node with value ${newVal} as ${direction} child of ${parentVal}`,
    });
  };

  const searchNode = () => {
    if (root === null) {
      toast({
        title: "Empty tree",
        description: "The tree is empty",
        variant: "destructive",
      });
      return;
    }

    if (searchValue.trim() === '' || isNaN(Number(searchValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value to search",
        variant: "destructive",
      });
      return;
    }

    const val = Number(searchValue);
    const found = findNode(root, val);

    if (found) {
      setLastOperation('search');
      setHighlightedNode(val);
      
      addLog(`Found node with value ${val} in the tree`);
      
      toast({
        title: "Node found",
        description: `Node with value ${val} exists in the tree`,
      });
    } else {
      addLog(`Node with value ${val} does not exist in the tree`);
      
      toast({
        title: "Node not found",
        description: `Node with value ${val} does not exist in the tree`,
        variant: "destructive",
      });
    }

    setSearchValue('');
  };

  // Function to recursively calculate the positions of nodes
  const calculateNodePositions = (
    node: TreeNode | null,
    level: number = 0,
    position: number = 0,
    positions: Map<string, { x: number, y: number, node: TreeNode }> = new Map()
  ): Map<string, { x: number, y: number, node: TreeNode }> => {
    if (node === null) return positions;
    
    // Calculate the horizontal position
    const horizontalSpacing = 120 / (Math.pow(2, level) + 1);
    const x = position * horizontalSpacing;
    const y = level * 80;
    
    positions.set(`${node.value}`, { x, y, node });
    
    // Calculate for left child
    calculateNodePositions(node.left, level + 1, position * 2, positions);
    
    // Calculate for right child
    calculateNodePositions(node.right, level + 1, position * 2 + 1, positions);
    
    return positions;
  };

  // Function to render the binary tree with edges
  const renderTree = () => {
    if (root === null) {
      return (
        <div className="flex items-center justify-center w-full py-8 text-arena-gray">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Tree is empty. Create a root node using the controls below.</span>
        </div>
      );
    }
    
    // Calculate positions for all nodes
    const nodePositions = calculateNodePositions(root);
    
    return (
      <svg width="600" height="400" viewBox="0 0 600 400" className="mx-auto">
        {/* Draw edges first so they appear behind nodes */}
        {Array.from(nodePositions.entries()).map(([key, { x, y, node }]) => {
          return (
            <React.Fragment key={`edges-${key}`}>
              {node.left && (
                <line
                  x1={x + 300}
                  y1={y + 20}
                  x2={nodePositions.get(`${node.left.value}`)!.x + 300}
                  y2={nodePositions.get(`${node.left.value}`)!.y}
                  stroke="#888"
                  strokeWidth="2"
                />
              )}
              {node.right && (
                <line
                  x1={x + 300}
                  y1={y + 20}
                  x2={nodePositions.get(`${node.right.value}`)!.x + 300}
                  y2={nodePositions.get(`${node.right.value}`)!.y}
                  stroke="#888"
                  strokeWidth="2"
                />
              )}
            </React.Fragment>
          );
        })}
        
        {/* Then draw the nodes */}
        {Array.from(nodePositions.entries()).map(([key, { x, y, node }]) => {
          const isHighlighted = highlightedNode === node.value;
          return (
            <g key={`node-${key}`}>
              <circle
                cx={x + 300}
                cy={y + 20}
                r="20"
                fill={isHighlighted ? "rgba(249, 115, 22, 0.2)" : "white"}
                stroke={isHighlighted ? "#f97316" : "#888"}
                strokeWidth={isHighlighted ? "3" : "2"}
              />
              <text
                x={x + 300}
                y={y + 25}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isHighlighted ? "bold" : "normal"}
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, highlightedNode]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Binary Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a binary tree. Create, insert, and search nodes to understand tree structures.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4">Binary Tree Visualization</h2>
          
          {/* Binary Tree visualization */}
          <div className="mb-6 relative overflow-auto">
            <div className="p-4 bg-arena-light rounded-lg min-h-[300px]">
              {renderTree()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Create root node */}
            {!root && (
              <div className="bg-arena-light rounded-xl p-4 col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Plus className="h-5 w-5 text-arena-red mr-2" />
                  Create Root Node
                </h3>
                <div className="flex">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Enter value"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                  />
                  <Button
                    onClick={createRoot}
                    className="bg-arena-red text-white rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                  >
                    Create Root
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Insert node */}
            {root && (
              <div className="bg-arena-light rounded-xl p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Plus className="h-5 w-5 text-arena-red mr-2" />
                  Insert Node
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="New value"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                    />
                  </div>
                  <div className="flex">
                    <input
                      type="number"
                      value={parentValue}
                      onChange={(e) => setParentValue(e.target.value)}
                      placeholder="Parent value"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-arena-red"
                        name="direction"
                        checked={direction === 'left'}
                        onChange={() => setDirection('left')}
                      />
                      <span className="ml-2">Left Child</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-arena-red"
                        name="direction"
                        checked={direction === 'right'}
                        onChange={() => setDirection('right')}
                      />
                      <span className="ml-2">Right Child</span>
                    </label>
                  </div>
                  <Button
                    onClick={insertNode}
                    className="w-full bg-arena-red text-white rounded-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center justify-center"
                  >
                    Insert Node
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Search node */}
            {root && (
              <div className="bg-arena-light rounded-xl p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Search className="h-5 w-5 text-arena-red mr-2" />
                  Search Node
                </h3>
                <div className="flex">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search value"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                  />
                  <Button
                    onClick={searchNode}
                    className="bg-arena-red text-white rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                  >
                    Search
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Log box */}
          <div className="bg-arena-light rounded-lg p-4">
            <h3 className="text-sm font-medium text-arena-dark mb-2 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" /> Operation Log
            </h3>
            <ScrollArea className="h-32 w-full rounded border border-gray-200">
              {logs.length === 0 ? (
                <div className="p-2 text-center text-sm text-arena-gray">No operations performed yet.</div>
              ) : (
                <div className="p-2">
                  {logs.map((log, index) => (
                    <div key={index} className="text-sm py-1 border-b border-gray-100 last:border-0">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold mb-2">About Binary Trees</h2>
          <p className="text-arena-gray mb-4">
            A binary tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Types of Binary Trees:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Full Binary Tree</li>
                <li>Complete Binary Tree</li>
                <li>Perfect Binary Tree</li>
                <li>Balanced Binary Tree</li>
                <li>Binary Search Tree</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Common Applications:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Expression trees</li>
                <li>Huffman coding</li>
                <li>Binary heaps</li>
                <li>Searching and sorting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
