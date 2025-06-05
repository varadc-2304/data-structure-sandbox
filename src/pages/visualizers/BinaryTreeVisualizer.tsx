import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, Play, Pause, RotateCcw, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TreeNode {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

const BinaryTreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState<number>(-1);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  
  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const insertNode = (root: TreeNode | null, value: number, id: number): TreeNode => {
    if (!root) {
      return { id, value, left: null, right: null };
    }

    // For demonstration, insert left if value is less, right if greater
    if (value < root.value) {
      root.left = insertNode(root.left, value, id);
    } else {
      root.right = insertNode(root.right, value, id);
    }
    
    return root;
  };

  const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (!root) return null;

    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node to be deleted found
      if (!root.left && !root.right) {
        return null;
      }
      if (!root.left) {
        return root.right;
      }
      if (!root.right) {
        return root.left;
      }

      // Node with two children
      const minValueNode = findMinNode(root.right);
      root.value = minValueNode.value;
      root.id = minValueNode.id;
      root.right = deleteNode(root.right, minValueNode.value);
    }
    return root;
  };

  const findMinNode = (node: TreeNode): TreeNode => {
    while (node.left) {
      node = node.left;
    }
    return node;
  };

  const searchNode = (root: TreeNode | null, value: number): boolean => {
    if (!root) return false;
    if (root.value === value) return true;
    return searchNode(root.left, value) || searchNode(root.right, value);
  };

  // Calculate tree dimensions for proper positioning
  const getTreeWidth = (node: TreeNode | null): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    
    const leftWidth = getTreeWidth(node.left);
    const rightWidth = getTreeWidth(node.right);
    return leftWidth + rightWidth + 1;
  };

  const getTreeHeight = (node: TreeNode | null): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, level: number, totalWidth: number): void => {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    const levelSpacing = 80;
    const baseSpacing = Math.max(60, totalWidth * 20 / Math.pow(2, level + 1));
    
    if (node.left) {
      const leftX = x - baseSpacing;
      calculatePositions(node.left, leftX, y + levelSpacing, level + 1, totalWidth);
    }
    
    if (node.right) {
      const rightX = x + baseSpacing;
      calculatePositions(node.right, rightX, y + levelSpacing, level + 1, totalWidth);
    }
  };

  const inorderTraversal = (node: TreeNode | null, result: number[]): void => {
    if (!node) return;
    inorderTraversal(node.left, result);
    result.push(node.id);
    inorderTraversal(node.right, result);
  };

  const preorderTraversal = (node: TreeNode | null, result: number[]): void => {
    if (!node) return;
    result.push(node.id);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
  };

  const postorderTraversal = (node: TreeNode | null, result: number[]): void => {
    if (!node) return;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.id);
  };

  const addElement = () => {
    if (newValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const value = Number(newValue);
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    const id = Date.now();
    
    if (root === null) {
      setRoot({ id, value, left: null, right: null });
    } else {
      setRoot(insertNode(root, value, id));
    }
    
    setNewValue('');
    const message = `Added node with value ${value}`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
    });
  };

  const removeElement = () => {
    if (deleteValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to delete",
        variant: "destructive",
      });
      return;
    }

    const value = Number(deleteValue);
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    if (!root) {
      toast({
        title: "Empty tree",
        description: "Tree is empty, nothing to delete",
        variant: "destructive",
      });
      return;
    }

    if (!searchNode(root, value)) {
      toast({
        title: "Node not found",
        description: `Node with value ${value} not found in tree`,
        variant: "destructive",
      });
      return;
    }

    setRoot(deleteNode(root, value));
    setDeleteValue('');
    const message = `Deleted node with value ${value}`;
    addToLog(message);
    
    toast({
      title: "Node deleted",
      description: message,
    });
  };

  const startTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!root) {
      toast({
        title: "Empty tree",
        description: "Please add some nodes first",
        variant: "destructive",
      });
      return;
    }

    const result: number[] = [];
    
    switch (type) {
      case 'inorder':
        inorderTraversal(root, result);
        break;
      case 'preorder':
        preorderTraversal(root, result);
        break;
      case 'postorder':
        postorderTraversal(root, result);
        break;
    }
    
    setTraversalOrder(result);
    setTraversalType(type);
    setCurrentTraversal(0);
    setIsTraversing(true);
    
    const message = `Started ${type} traversal`;
    addToLog(message);
  };

  const resetTraversal = () => {
    setIsTraversing(false);
    setCurrentTraversal(-1);
    setTraversalOrder([]);
    setTraversalType(null);
    setHighlightedNode(null);
    addToLog("Reset traversal");
  };

  useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      setHighlightedNode(traversalOrder[currentTraversal]);
      
      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal(prev => prev + 1);
        } else {
          setIsTraversing(false);
          setHighlightedNode(null);
          const message = `Completed ${traversalType} traversal: ${getTraversalValues().join(' -> ')}`;
          addToLog(message);
          toast({
            title: "Traversal completed",
            description: message,
          });
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isTraversing, currentTraversal, traversalOrder]);

  const getTraversalValues = (): number[] => {
    const values: number[] = [];
    const findValue = (node: TreeNode | null, targetId: number): number | null => {
      if (!node) return null;
      if (node.id === targetId) return node.value;
      return findValue(node.left, targetId) || findValue(node.right, targetId);
    };

    traversalOrder.forEach(id => {
      const value = findValue(root, id);
      if (value !== null) values.push(value);
    });
    
    return values;
  };

  const renderConnections = (node: TreeNode | null): JSX.Element[] => {
    if (!node) return [];
    
    const connections: JSX.Element[] = [];
    
    if (node.left && node.x !== undefined && node.y !== undefined && node.left.x !== undefined && node.left.y !== undefined) {
      connections.push(
        <line
          key={`line-${node.id}-left`}
          x1={node.x}
          y1={node.y + 25}
          x2={node.left.x}
          y2={node.left.y - 25}
          stroke="#4a5568"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
    }
    
    if (node.right && node.x !== undefined && node.y !== undefined && node.right.x !== undefined && node.right.y !== undefined) {
      connections.push(
        <line
          key={`line-${node.id}-right`}
          x1={node.x}
          y1={node.y + 25}
          x2={node.right.x}
          y2={node.right.y - 25}
          stroke="#4a5568"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
    }
    
    if (node.left) {
      connections.push(...renderConnections(node.left));
    }
    if (node.right) {
      connections.push(...renderConnections(node.right));
    }
    
    return connections;
  };

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node) return null;

    const isHighlighted = highlightedNode === node.id;

    return (
      <g key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          className={cn(
            "transition-all duration-500",
            {
              "fill-arena-green stroke-arena-green": isHighlighted,
              "fill-white stroke-gray-600": !isHighlighted,
            }
          )}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="central"
          className={cn(
            "text-sm font-semibold transition-all duration-500 pointer-events-none select-none",
            {
              "fill-white": isHighlighted,
              "fill-gray-700": !isHighlighted,
            }
          )}
        >
          {node.value}
        </text>
        
        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </g>
    );
  };

  useEffect(() => {
    if (root) {
      const treeWidth = getTreeWidth(root);
      const centerX = 400;
      const startY = 60;
      calculatePositions(root, centerX, startY, 0, treeWidth);
    }
  }, [root]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Binary Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize binary tree operations and traversals. Add nodes, delete nodes, and explore different traversal methods.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Binary Tree Visualization</h2>
            <div className="flex gap-2">
              <Button 
                onClick={() => startTraversal('inorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Inorder
              </Button>
              <Button 
                onClick={() => startTraversal('preorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Preorder
              </Button>
              <Button 
                onClick={() => startTraversal('postorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Play className="h-4 w-4 mr-2" />
                Postorder
              </Button>
              {isTraversing && (
                <Button 
                  onClick={resetTraversal}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          {/* Tree visualization */}
          <div className="mb-6 relative">
            <div 
              className="bg-arena-light rounded-lg p-6 overflow-auto border-2 border-gray-200"
              style={{ minHeight: "500px", maxHeight: "600px", overflowX: "auto", overflowY: "auto" }}
            >
              {root ? (
                <div className="w-full h-full flex justify-center">
                  <svg 
                    width="800" 
                    height={Math.max(500, getTreeHeight(root) * 80 + 100)} 
                    viewBox={`0 0 800 ${Math.max(500, getTreeHeight(root) * 80 + 100)}`} 
                    className="overflow-visible"
                    style={{ minWidth: "800px" }}
                  >
                    {renderConnections(root)}
                    {renderTree(root)}
                  </svg>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-arena-gray">
                  <span className="text-lg">Tree is empty. Add nodes using the controls below.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Add Node
              </h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value"
                  className="focus:ring-arena-green focus:border-arena-green"
                />
                <Button
                  onClick={addElement}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Minus className="h-5 w-5 text-red-500 mr-2" />
                Delete Node
              </h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  placeholder="Enter value"
                  className="focus:ring-red-500 focus:border-red-500"
                />
                <Button
                  onClick={removeElement}
                  variant="default"
                  className="w-full bg-red-500 text-white hover:bg-red-500/90"
                >
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Clear Tree
              </h3>
              <Button
                onClick={() => {
                  setRoot(null);
                  resetTraversal();
                  const message = "Cleared the entire tree";
                  addToLog(message);
                  toast({
                    title: "Tree cleared",
                    description: message,
                  });
                }}
                variant="default"
                className="w-full bg-arena-green text-white hover:bg-arena-green/90"
              >
                Clear All
              </Button>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Traversal Status</h3>
              <div className="text-sm text-arena-gray">
                {isTraversing ? (
                  <div className="space-y-1">
                    <span className="text-arena-green block">
                      Running {traversalType} traversal...
                    </span>
                    <span className="text-xs">
                      Step: {currentTraversal + 1}/{traversalOrder.length}
                    </span>
                  </div>
                ) : (
                  <span>Ready to traverse</span>
                )}
              </div>
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
          <h2 className="text-xl font-semibold mb-2">About Binary Trees</h2>
          <p className="text-arena-gray mb-4">
            A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Traversal Types:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Inorder: Left → Root → Right</li>
                <li>Preorder: Root → Left → Right</li>
                <li>Postorder: Left → Right → Root</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(n)</li>
                <li>Insertion: O(n)</li>
                <li>Deletion: O(n)</li>
                <li>Traversal: O(n)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Storage: O(n)</li>
                <li>Auxiliary: O(h) where h is height</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
