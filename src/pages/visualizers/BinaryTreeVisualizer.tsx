
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Search, Shuffle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

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
  const [treeSize, setTreeSize] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [traversalResult, setTraversalResult] = useState<number[]>([]);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setHighlightedNode(null);
    setLastOperation(null);
    setTraversalResult([]);
    setCurrentTraversalIndex(-1);
  };

  const addToLog = (message: string) => {
    setLogs(prev => [message, ...prev.slice(0, 9)]);
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

  // Generate random binary tree
  const generateRandomTree = () => {
    if (treeSize.trim() === '' || isNaN(Number(treeSize)) || Number(treeSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for tree size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(treeSize), 15);
    const values = Array.from({ length: size }, (_, i) => i + 1);
    
    // Shuffle values
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // Create root
    const newRoot: TreeNode = { value: values[0], left: null, right: null };
    
    // Add remaining nodes randomly
    for (let i = 1; i < values.length; i++) {
      const availableNodes: TreeNode[] = [];
      
      // Find all nodes that can have children
      const findAvailableNodes = (node: TreeNode) => {
        if (!node.left || !node.right) {
          availableNodes.push(node);
        }
        if (node.left) findAvailableNodes(node.left);
        if (node.right) findAvailableNodes(node.right);
      };
      
      findAvailableNodes(newRoot);
      
      if (availableNodes.length > 0) {
        const randomParent = availableNodes[Math.floor(Math.random() * availableNodes.length)];
        const newNode: TreeNode = { value: values[i], left: null, right: null };
        
        if (!randomParent.left && Math.random() < 0.5) {
          randomParent.left = newNode;
        } else if (!randomParent.right) {
          randomParent.right = newNode;
        } else if (!randomParent.left) {
          randomParent.left = newNode;
        }
      }
    }

    setRoot(newRoot);
    setTreeSize('');
    resetHighlights();
    
    const message = `Generated random binary tree with ${size} nodes`;
    addToLog(message);
    
    toast({
      title: "Random tree generated",
      description: message,
    });
  };

  // Traversal functions
  const inorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      inorderTraversal(node.left, result);
      result.push(node.value);
      inorderTraversal(node.right, result);
    }
    return result;
  };

  const preorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      result.push(node.value);
      preorderTraversal(node.left, result);
      preorderTraversal(node.right, result);
    }
    return result;
  };

  const postorderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      postorderTraversal(node.left, result);
      postorderTraversal(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!root) {
      toast({
        title: "Empty tree",
        description: "Cannot traverse an empty tree",
        variant: "destructive",
      });
      return;
    }

    let result: number[] = [];
    let traversalName = '';

    switch (type) {
      case 'inorder':
        result = inorderTraversal(root);
        traversalName = 'In-order';
        break;
      case 'preorder':
        result = preorderTraversal(root);
        traversalName = 'Pre-order';
        break;
      case 'postorder':
        result = postorderTraversal(root);
        traversalName = 'Post-order';
        break;
    }

    setTraversalResult(result);
    setCurrentTraversalIndex(0);
    setLastOperation('traversal');

    const message = `${traversalName} traversal: [${result.join(', ')}]`;
    addToLog(message);

    // Animate traversal
    result.forEach((value, index) => {
      setTimeout(() => {
        setHighlightedNode(value);
        setCurrentTraversalIndex(index);
      }, index * 800);
    });

    toast({
      title: `${traversalName} Traversal`,
      description: `Result: [${result.join(', ')}]`,
    });
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
    
    const message = `Created root node with value ${val}`;
    addToLog(message);
    
    toast({
      title: "Root created",
      description: message,
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
    
    const message = `Inserted node ${newVal} as ${direction} child of ${parentVal}`;
    addToLog(message);
    
    toast({
      title: "Node inserted",
      description: message,
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
      
      const message = `Found node with value ${val}`;
      addToLog(message);
      
      toast({
        title: "Node found",
        description: message,
      });
    } else {
      const message = `Node with value ${val} not found`;
      addToLog(message);
      
      toast({
        title: "Node not found",
        description: message,
        variant: "destructive",
      });
    }

    setSearchValue('');
  };

  // Function to render connecting lines
  const renderConnections = (node: TreeNode | null, x: number, y: number, level: number): JSX.Element[] => {
    if (!node) return [];
    
    const connections: JSX.Element[] = [];
    const horizontalSpacing = 120 / (level + 1);
    const verticalSpacing = 80;
    
    if (node.left) {
      const leftX = x - horizontalSpacing;
      const leftY = y + verticalSpacing;
      connections.push(
        <line
          key={`${node.value}-left`}
          x1={x}
          y1={y}
          x2={leftX}
          y2={leftY}
          stroke="#ccc"
          strokeWidth={2}
        />
      );
      connections.push(...renderConnections(node.left, leftX, leftY, level + 1));
    }
    
    if (node.right) {
      const rightX = x + horizontalSpacing;
      const rightY = y + verticalSpacing;
      connections.push(
        <line
          key={`${node.value}-right`}
          x1={x}
          y1={y}
          x2={rightX}
          y2={rightY}
          stroke="#ccc"
          strokeWidth={2}
        />
      );
      connections.push(...renderConnections(node.right, rightX, rightY, level + 1));
    }
    
    return connections;
  };

  // Function to render the binary tree recursively
  const renderTree = (node: TreeNode | null, level: number = 0, position: string = 'root'): JSX.Element => {
    if (node === null) {
      return <div className="invisible w-16 h-16"></div>;
    }

    const isHighlighted = highlightedNode === node.value;
    const isBouncing = traversalResult.includes(node.value) && 
                     currentTraversalIndex >= 0 && 
                     traversalResult[currentTraversalIndex] === node.value;

    return (
      <div className="flex flex-col items-center relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 mb-2 transition-all duration-300 relative bg-white",
            {
              "border-arena-green bg-arena-green/10 shadow-md": isHighlighted,
              "animate-bounce": isBouncing,
            }
          )}
        >
          {node.value}
        </div>
        {(node.left !== null || node.right !== null) && (
          <div className="flex items-start space-x-8 relative">
            {/* Connection lines */}
            {node.left && (
              <div className="absolute top-0 left-1/4 w-px h-8 bg-gray-300 transform -translate-x-1/2"></div>
            )}
            {node.right && (
              <div className="absolute top-0 right-1/4 w-px h-8 bg-gray-300 transform translate-x-1/2"></div>
            )}
            {node.left && node.right && (
              <div className="absolute top-8 left-1/4 right-1/4 h-px bg-gray-300"></div>
            )}
            
            {renderTree(node.left, level + 1, 'left')}
            {renderTree(node.right, level + 1, 'right')}
          </div>
        )}
      </div>
    );
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation && lastOperation !== 'traversal') {
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
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Binary Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a binary tree. Create, insert, and search nodes to understand tree structures.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Binary Tree Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={treeSize}
                onChange={(e) => setTreeSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomTree} 
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Tree
              </Button>
            </div>
          </div>

          {/* Traversal buttons */}
          {root && (
            <div className="flex gap-2 mb-4">
              <Button onClick={() => runTraversal('inorder')} variant="outline" size="sm">
                In-order
              </Button>
              <Button onClick={() => runTraversal('preorder')} variant="outline" size="sm">
                Pre-order
              </Button>
              <Button onClick={() => runTraversal('postorder')} variant="outline" size="sm">
                Post-order
              </Button>
            </div>
          )}
          
          {/* Binary Tree visualization */}
          <div className="mb-6 relative overflow-auto">
            <div className="flex justify-center p-4 bg-arena-light rounded-lg min-h-[300px]">
              {root === null ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Tree is empty. Create a root node using the controls below.</span>
                </div>
              ) : (
                <div className="transform scale-90 origin-top">
                  {renderTree(root)}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create root node */}
            {!root && (
              <div className="bg-arena-light rounded-xl p-4 col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Plus className="h-5 w-5 text-arena-green mr-2" />
                  Create Root Node
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
                    onClick={createRoot}
                    variant="default"
                    className="rounded-r-lg rounded-l-none"
                  >
                    Create Root
                  </Button>
                </div>
              </div>
            )}
            
            {/* Insert node */}
            {root && (
              <div className="bg-arena-light rounded-xl p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Plus className="h-5 w-5 text-arena-green mr-2" />
                  Insert Node
                </h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="New value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={parentValue}
                    onChange={(e) => setParentValue(e.target.value)}
                    placeholder="Parent value"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-arena-green"
                        name="direction"
                        checked={direction === 'left'}
                        onChange={() => setDirection('left')}
                      />
                      <span className="ml-2">Left Child</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-arena-green"
                        name="direction"
                        checked={direction === 'right'}
                        onChange={() => setDirection('right')}
                      />
                      <span className="ml-2">Right Child</span>
                    </label>
                  </div>
                  <Button onClick={insertNode} variant="default" className="w-full">
                    Insert Node
                  </Button>
                </div>
              </div>
            )}
            
            {/* Search node */}
            {root && (
              <div className="bg-arena-light rounded-xl p-4">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Search className="h-5 w-5 text-arena-green mr-2" />
                  Search Node
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
                    onClick={searchNode}
                    variant="default"
                    className="rounded-r-lg rounded-l-none"
                  >
                    Search
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Operation Logs */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-32 overflow-y-auto text-sm">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-arena-gray">
                  No operations performed yet
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-arena-green">
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
            A binary tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(n) worst case</li>
                <li>Insert: O(n) worst case</li>
                <li>Delete: O(n) worst case</li>
                <li>Traversal: O(n)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Storage: O(n)</li>
                <li>Recursion: O(h) where h is height</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
