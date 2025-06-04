import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Search, Play, Pause } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BSTNode {
  id: number;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x?: number;
  y?: number;
}

const BSTVisualizer = () => {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [newValue, setNewValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState<number>(-1);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | 'search' | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const insertNode = (root: BSTNode | null, value: number): BSTNode => {
    if (!root) {
      return { id: Date.now(), value, left: null, right: null };
    }

    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    
    return root;
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
    setRoot(prev => insertNode(prev, value));
    setNewValue('');
    
    const message = `Added node with value ${value}`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
    });
  };

  const calculatePositions = (node: BSTNode | null, x: number, y: number, spacing: number): void => {
    if (!node) return;
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 100, spacing / 1.8);
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 100, spacing / 1.8);
    }
  };

  const inorderTraversal = (node: BSTNode | null, result: number[]): void => {
    if (!node) return;
    inorderTraversal(node.left, result);
    result.push(node.id);
    inorderTraversal(node.right, result);
  };

  const preorderTraversal = (node: BSTNode | null, result: number[]): void => {
    if (!node) return;
    result.push(node.id);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
  };

  const postorderTraversal = (node: BSTNode | null, result: number[]): void => {
    if (!node) return;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.id);
  };

  const searchPath = (node: BSTNode | null, value: number, path: number[]): boolean => {
    if (!node) return false;
    
    path.push(node.id);
    
    if (node.value === value) return true;
    
    if (value < node.value) {
      return searchPath(node.left, value, path);
    } else {
      return searchPath(node.right, value, path);
    }
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

  const startSearch = () => {
    if (!root) {
      toast({
        title: "Empty tree",
        description: "Please add some nodes first",
        variant: "destructive",
      });
      return;
    }

    if (searchValue.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    const value = Number(searchValue);
    const path: number[] = [];
    const found = searchPath(root, value, path);
    
    setTraversalOrder(path);
    setTraversalType('search');
    setCurrentTraversal(0);
    setIsTraversing(true);
    
    const message = `Searching for value ${value}`;
    addToLog(message);
  };

  useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal(prev => prev + 1);
        } else {
          setIsTraversing(false);
          if (traversalType === 'search') {
            const found = searchValue.trim() !== '' && 
                         traversalOrder.length > 0 && 
                         findValue(root, traversalOrder[traversalOrder.length - 1]) === Number(searchValue);
            const message = found ? 
              `Found value ${searchValue} in the tree!` : 
              `Value ${searchValue} not found in the tree`;
            addToLog(message);
            toast({
              title: found ? "Search successful" : "Search failed",
              description: message,
              variant: found ? "default" : "destructive",
            });
          } else {
            const message = `Completed ${traversalType} traversal: ${getTraversalValues().join(' -> ')}`;
            addToLog(message);
            toast({
              title: "Traversal completed",
              description: message,
            });
          }
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isTraversing, currentTraversal, traversalOrder]);

  const findValue = (node: BSTNode | null, targetId: number): number | null => {
    if (!node) return null;
    if (node.id === targetId) return node.value;
    return findValue(node.left, targetId) || findValue(node.right, targetId);
  };

  const getTraversalValues = (): number[] => {
    const values: number[] = [];
    traversalOrder.forEach(id => {
      const value = findValue(root, id);
      if (value !== null) values.push(value);
    });
    return values;
  };

  const renderConnections = (node: BSTNode | null): JSX.Element[] => {
    if (!node) return [];
    
    const connections: JSX.Element[] = [];
    
    if (node.left && node.x && node.y && node.left.x && node.left.y) {
      connections.push(
        <line
          key={`line-${node.id}-left`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="#d1d5db"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
    }
    
    if (node.right && node.x && node.y && node.right.x && node.right.y) {
      connections.push(
        <line
          key={`line-${node.id}-right`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="#d1d5db"
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

  const renderTree = (node: BSTNode | null): JSX.Element | null => {
    if (!node) return null;

    const isHighlighted = isTraversing && currentTraversal >= 0 && 
                         traversalOrder[currentTraversal] === node.id;

    return (
      <g key={node.id}>
        <circle
          cx={node.x}
          cy={node.y}
          r="24"
          className={cn(
            "transition-all duration-300",
            {
              "fill-arena-green stroke-arena-green": isHighlighted,
              "fill-white stroke-gray-300": !isHighlighted,
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
            "text-sm font-medium transition-all duration-300",
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
      calculatePositions(root, 400, 60, 150);
    }
  }, [root]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Binary Search Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize BST operations including insertion, search, and various traversal methods.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">BST Visualization</h2>
            <div className="flex gap-2">
              <Button 
                onClick={() => startTraversal('inorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                {isTraversing && traversalType === 'inorder' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Inorder
              </Button>
              <Button 
                onClick={() => startTraversal('preorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                {isTraversing && traversalType === 'preorder' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Preorder
              </Button>
              <Button 
                onClick={() => startTraversal('postorder')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                {isTraversing && traversalType === 'postorder' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Postorder
              </Button>
            </div>
          </div>
          
          {/* Tree visualization */}
          <div className="mb-6 relative">
            <div 
              className="bg-arena-light rounded-lg p-4 overflow-auto relative flex justify-center"
              style={{ minHeight: "500px", maxHeight: "600px" }}
            >
              {root ? (
                <svg width="800" height="500" className="overflow-visible">
                  {renderConnections(root)}
                  {renderTree(root)}
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full text-arena-gray">
                  <span>BST is empty. Add nodes using the controls below.</span>
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
              <div className="flex">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={addElement}
                  variant="default"
                  className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-arena-green mr-2" />
                Search
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={startSearch}
                  disabled={isTraversing}
                  variant="default"
                  className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Search
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
                  setTraversalOrder([]);
                  setCurrentTraversal(-1);
                  setIsTraversing(false);
                  setTraversalType(null);
                  const message = "Cleared the entire BST";
                  addToLog(message);
                  toast({
                    title: "BST cleared",
                    description: message,
                  });
                }}
                variant="default"
                className="w-full bg-arena-green text-white hover:bg-arena-green/90"
              >
                Clear
              </Button>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Status</h3>
              <div className="text-sm text-arena-gray">
                {isTraversing ? (
                  <span className="text-arena-green">
                    Running {traversalType}... 
                    ({currentTraversal + 1}/{traversalOrder.length})
                  </span>
                ) : (
                  <span>Ready</span>
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
          <h2 className="text-xl font-semibold mb-2">About Binary Search Trees</h2>
          <p className="text-arena-gray mb-4">
            A BST is a binary tree where left child values are less than parent and right child values are greater than parent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">BST Properties:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Left subtree values &lt; root</li>
                <li>Right subtree values &gt; root</li>
                <li>Inorder gives sorted sequence</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(log n) avg, O(n) worst</li>
                <li>Insert: O(log n) avg, O(n) worst</li>
                <li>Delete: O(log n) avg, O(n) worst</li>
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

export default BSTVisualizer;
