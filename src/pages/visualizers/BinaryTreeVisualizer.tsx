
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
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [currentTraversalType, setCurrentTraversalType] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setHighlightedNode(null);
    setLastOperation(null);
    setTraversalPath([]);
    setCurrentTraversalType(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
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

    const size = Math.min(Number(treeSize), 10); // Limit to 10 nodes max
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    
    const buildTree = (index: number): TreeNode | null => {
      if (index >= values.length) return null;
      
      return {
        value: values[index],
        left: buildTree(2 * index + 1),
        right: buildTree(2 * index + 2)
      };
    };

    setRoot(buildTree(0));
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
  const traverseInOrder = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      traverseInOrder(node.left, result);
      result.push(node.value);
      traverseInOrder(node.right, result);
    }
    return result;
  };

  const traversePreOrder = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      result.push(node.value);
      traversePreOrder(node.left, result);
      traversePreOrder(node.right, result);
    }
    return result;
  };

  const traversePostOrder = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node !== null) {
      traversePostOrder(node.left, result);
      traversePostOrder(node.right, result);
      result.push(node.value);
    }
    return result;
  };

  const handleTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (root === null) {
      toast({
        title: "Empty tree",
        description: "The tree is empty",
        variant: "destructive",
      });
      return;
    }

    let path: number[] = [];
    let description = '';

    switch (type) {
      case 'inorder':
        path = traverseInOrder(root);
        description = 'In-order traversal (Left-Root-Right)';
        addToLog(`Performed in-order traversal: [${path.join(', ')}]`);
        break;
      case 'preorder':
        path = traversePreOrder(root);
        description = 'Pre-order traversal (Root-Left-Right)';
        addToLog(`Performed pre-order traversal: [${path.join(', ')}]`);
        break;
      case 'postorder':
        path = traversePostOrder(root);
        description = 'Post-order traversal (Left-Right-Root)';
        addToLog(`Performed post-order traversal: [${path.join(', ')}]`);
        break;
    }

    setTraversalPath(path);
    setCurrentTraversalType(type);
    setLastOperation('traversal');
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Traversal`,
      description: `${description}: [${path.join(', ')}]`,
    });
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
    
    const message = `Added node with value ${newVal} as ${direction} child of ${parentVal}`;
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
      
      const message = `Searched and found node with value ${val}`;
      addToLog(message);
      
      toast({
        title: "Node found",
        description: `Node with value ${val} exists in the tree`,
      });
    } else {
      const message = `Searched for node with value ${val} - not found`;
      addToLog(message);
      toast({
        title: "Node not found",
        description: `Node with value ${val} does not exist in the tree`,
        variant: "destructive",
      });
    }

    setSearchValue('');
  };

  // Function to render the binary tree with connecting lines
  const renderTree = (node: TreeNode | null, level: number = 0, position: string = 'root'): JSX.Element => {
    if (node === null) {
      return <div className="invisible w-16 h-16"></div>;
    }

    const isHighlighted = highlightedNode === node.value;
    const isInPath = traversalPath.includes(node.value);

    return (
      <div className="flex flex-col items-center relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-300 mb-2 transition-all duration-300 relative z-10 bg-white",
            {
              "border-arena-green bg-arena-green/10 shadow-md": isHighlighted,
              "border-drona-green bg-drona-green/10": isInPath && !isHighlighted,
              "border-gray-300 bg-white": !isHighlighted && !isInPath,
            }
          )}
        >
          {node.value}
        </div>
        {(node.left !== null || node.right !== null) && (
          <div className="flex items-start space-x-4 relative">
            {/* Left connecting line */}
            {node.left && (
              <div className="absolute left-1/4 top-0 w-px h-8 bg-gray-400 transform -translate-x-1/2"></div>
            )}
            {/* Right connecting line */}
            {node.right && (
              <div className="absolute right-1/4 top-0 w-px h-8 bg-gray-400 transform translate-x-1/2"></div>
            )}
            {/* Horizontal connecting line */}
            {node.left && node.right && (
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gray-400"></div>
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
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, highlightedNode, traversalPath]);

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
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomTree} 
                variant="outline"
                className="flex items-center gap-2 border-drona-green text-drona-green hover:bg-drona-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random Tree
              </Button>
            </div>
          </div>
          
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
                    <Plus className="ml-2 h-4 w-4" />
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
                  <div className="flex">
                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="New value"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                    />
                  </div>
                  <div className="flex">
                    <input
                      type="number"
                      value={parentValue}
                      onChange={(e) => setParentValue(e.target.value)}
                      placeholder="Parent value"
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                    />
                  </div>
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
                  <Button
                    onClick={insertNode}
                    variant="default"
                    className="w-full flex items-center justify-center"
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
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Traversals */}
            {root && (
              <div className="bg-arena-light rounded-xl p-4 col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Eye className="h-5 w-5 text-arena-green mr-2" />
                  Tree Traversals
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => handleTraversal('inorder')}
                    className={cn(
                      { "ring-2 ring-offset-2 ring-drona-green": currentTraversalType === 'inorder' }
                    )}
                    size="sm"
                  >
                    In-Order
                  </Button>
                  <Button
                    onClick={() => handleTraversal('preorder')}
                    className={cn(
                      { "ring-2 ring-offset-2 ring-drona-green": currentTraversalType === 'preorder' }
                    )}
                    size="sm"
                  >
                    Pre-Order
                  </Button>
                  <Button
                    onClick={() => handleTraversal('postorder')}
                    className={cn(
                      { "ring-2 ring-offset-2 ring-drona-green": currentTraversalType === 'postorder' }
                    )}
                    size="sm"
                  >
                    Post-Order
                  </Button>
                </div>
              </div>
            )}
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
            A binary tree is a hierarchical data structure in which each node has at most two children, referred to as the left child and the right child.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(n)</li>
                <li>Insert: O(n)</li>
                <li>Delete: O(n)</li>
                <li>Traversal: O(n)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Storage: O(n)</li>
                <li>Auxiliary (recursive): O(h)</li>
                <li>where h is height of tree</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeVisualizer;
