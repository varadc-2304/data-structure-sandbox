
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Search, RefreshCw, Shuffle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const BSTVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [newValue, setNewValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [treeSize, setTreeSize] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [currentTraversalType, setCurrentTraversalType] = useState<string | null>(null);
  const [currentTraversalIndex, setCurrentTraversalIndex] = useState(-1);
  const [operationLogs, setOperationLogs] = useState<string[]>([]);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setHighlightedNode(null);
    setLastOperation(null);
    setTraversalPath([]);
    setCurrentTraversalType(null);
    setCurrentTraversalIndex(-1);
  };

  const addOperationLog = (message: string) => {
    setOperationLogs(prev => [message, ...prev.slice(0, 9)]);
  };

  // Helper function to insert a node in BST
  const insertNodeBST = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return { value, left: null, right: null };
    }

    if (value < node.value) {
      node.left = insertNodeBST(node.left, value);
    } else if (value > node.value) {
      node.right = insertNodeBST(node.right, value);
    }

    return node;
  };

  // Helper function to search for a node in BST
  const searchNodeBST = (
    node: TreeNode | null, 
    value: number, 
    path: number[] = []
  ): { found: boolean; path: number[] } => {
    if (node === null) {
      return { found: false, path };
    }

    const currentPath = [...path, node.value];

    if (value === node.value) {
      return { found: true, path: currentPath };
    }

    if (value < node.value) {
      return searchNodeBST(node.left, value, currentPath);
    } else {
      return searchNodeBST(node.right, value, currentPath);
    }
  };

  // Helper function to find the minimum value node
  const findMinNode = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  // Helper function to delete a node in BST
  const deleteNodeBST = (node: TreeNode | null, value: number): TreeNode | null => {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = deleteNodeBST(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNodeBST(node.right, value);
    } else {
      // Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Node with two children
      const minNode = findMinNode(node.right);
      node.value = minNode.value;
      node.right = deleteNodeBST(node.right, minNode.value);
    }

    return node;
  };

  // Generate random BST
  const generateRandomBST = () => {
    if (treeSize.trim() === '' || isNaN(Number(treeSize)) || Number(treeSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for BST size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(treeSize), 15);
    let newRoot: TreeNode | null = null;
    const usedValues = new Set<number>();
    
    for (let i = 0; i < size; i++) {
      let randomValue: number;
      do {
        randomValue = Math.floor(Math.random() * 100) + 1;
      } while (usedValues.has(randomValue));
      
      usedValues.add(randomValue);
      newRoot = insertNodeBST(newRoot, randomValue);
    }
    
    setRoot(newRoot);
    setTreeSize('');
    resetHighlights();
    
    const message = `Generated random BST with ${size} nodes`;
    addOperationLog(message);
    
    toast({
      title: "BST Generated",
      description: message,
    });
  };

  // Traverse the BST in different orders
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
        description: "The BST is empty",
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
        break;
      case 'preorder':
        path = traversePreOrder(root);
        description = 'Pre-order traversal (Root-Left-Right)';
        break;
      case 'postorder':
        path = traversePostOrder(root);
        description = 'Post-order traversal (Left-Right-Root)';
        break;
    }

    setTraversalPath(path);
    setCurrentTraversalType(type);
    setCurrentTraversalIndex(0);
    setLastOperation('traversal');
    
    const message = `${type.charAt(0).toUpperCase() + type.slice(1)} traversal: [${path.join(', ')}]`;
    addOperationLog(message);
    
    // Animate traversal
    path.forEach((value, index) => {
      setTimeout(() => {
        setHighlightedNode(value);
        setCurrentTraversalIndex(index);
      }, index * 800);
    });
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Traversal`,
      description: `${description}: [${path.join(', ')}]`,
    });
  };

  const handleInsert = () => {
    if (newValue.trim() === '' || isNaN(Number(newValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value",
        variant: "destructive",
      });
      return;
    }

    const val = Number(newValue);
    
    // Check if node already exists
    if (root !== null) {
      const { found } = searchNodeBST(root, val);
      if (found) {
        toast({
          title: "Node exists",
          description: `Node with value ${val} already exists in the BST`,
          variant: "destructive",
        });
        return;
      }
    }

    const newRoot = root === null 
      ? { value: val, left: null, right: null } 
      : insertNodeBST({ ...root }, val);
    
    setRoot(newRoot);
    setNewValue('');
    setLastOperation('insert');
    setHighlightedNode(val);
    
    const message = `Inserted node with value ${val}`;
    addOperationLog(message);
    
    toast({
      title: "Node inserted",
      description: message,
    });
  };

  const handleSearch = () => {
    if (root === null) {
      toast({
        title: "Empty tree",
        description: "The BST is empty",
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
    const { found, path } = searchNodeBST(root, val);

    if (found) {
      setLastOperation('search');
      setHighlightedNode(val);
      setTraversalPath(path);
      
      const message = `Found node with value ${val} at path: [${path.join(' → ')}]`;
      addOperationLog(message);
      
      toast({
        title: "Node found",
        description: `Node with value ${val} exists in the BST`,
      });
    } else {
      const message = `Node with value ${val} not found`;
      addOperationLog(message);
      
      toast({
        title: "Node not found",
        description: `Node with value ${val} does not exist in the BST`,
        variant: "destructive",
      });
    }

    setSearchValue('');
  };

  const handleDelete = () => {
    if (root === null) {
      toast({
        title: "Empty tree",
        description: "The BST is empty",
        variant: "destructive",
      });
      return;
    }

    if (deleteValue.trim() === '' || isNaN(Number(deleteValue))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric value to delete",
        variant: "destructive",
      });
      return;
    }

    const val = Number(deleteValue);
    const { found } = searchNodeBST(root, val);

    if (!found) {
      toast({
        title: "Node not found",
        description: `Node with value ${val} does not exist in the BST`,
        variant: "destructive",
      });
      return;
    }

    setHighlightedNode(val);
    setLastOperation('delete');
    
    const message = `Deleted node with value ${val}`;
    addOperationLog(message);
    
    // Wait a short time to show the node before deleting
    setTimeout(() => {
      const newRoot = deleteNodeBST({ ...root }, val);
      setRoot(newRoot);
      
      toast({
        title: "Node deleted",
        description: message,
      });
    }, 1000);

    setDeleteValue('');
  };

  // Function to render the binary tree recursively with connections
  const renderTree = (node: TreeNode | null, level: number = 0): JSX.Element => {
    if (node === null) {
      return <div className="invisible w-16 h-16"></div>;
    }

    const isHighlighted = highlightedNode === node.value;
    const isInPath = traversalPath.includes(node.value);
    const isBouncing = traversalPath.includes(node.value) && 
                     currentTraversalIndex >= 0 && 
                     traversalPath[currentTraversalIndex] === node.value;

    return (
      <div className="flex flex-col items-center relative">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300 bg-white",
            {
              "border-arena-red bg-arena-red/10 shadow-md": isHighlighted && !isBouncing,
              "border-arena-green bg-arena-green/10": isInPath && !isHighlighted,
              "border-gray-300": !isHighlighted && !isInPath,
              "animate-bounce border-arena-green bg-arena-green/20": isBouncing,
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
            
            {renderTree(node.left, level + 1)}
            {renderTree(node.right, level + 1)}
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
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Binary Search Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a Binary Search Tree (BST). Insert, search, delete nodes, and see different traversal orders.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">BST Visualization</h2>
            <div className="flex gap-2">
              <input
                type="number"
                value={treeSize}
                onChange={(e) => setTreeSize(e.target.value)}
                placeholder="Size"
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
              />
              <Button 
                onClick={generateRandomBST} 
                variant="outline"
                className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Generate Random BST
              </Button>
            </div>
          </div>

          {/* Traversal buttons */}
          {root && (
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={() => handleTraversal('inorder')} 
                variant="outline" 
                size="sm"
                className={cn({ "ring-2 ring-offset-2 ring-arena-green": currentTraversalType === 'inorder' })}
              >
                In-Order
              </Button>
              <Button 
                onClick={() => handleTraversal('preorder')} 
                variant="outline" 
                size="sm"
                className={cn({ "ring-2 ring-offset-2 ring-arena-green": currentTraversalType === 'preorder' })}
              >
                Pre-Order
              </Button>
              <Button 
                onClick={() => handleTraversal('postorder')} 
                variant="outline" 
                size="sm"
                className={cn({ "ring-2 ring-offset-2 ring-arena-green": currentTraversalType === 'postorder' })}
              >
                Post-Order
              </Button>
            </div>
          )}
          
          {/* BST visualization */}
          <div className="mb-6 relative overflow-auto">
            <div className="flex justify-center p-4 bg-arena-light rounded-lg min-h-[300px]">
              {root === null ? (
                <div className="flex items-center justify-center w-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>BST is empty. Insert nodes using the controls below.</span>
                </div>
              ) : (
                <div className="transform scale-90 origin-top">
                  {renderTree(root)}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Insert node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Insert Node
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
                  onClick={handleInsert}
                  className="rounded-r-lg"
                >
                  Insert
                </Button>
              </div>
            </div>
            
            {/* Search node */}
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
                  onClick={handleSearch}
                  className="rounded-r-lg"
                >
                  Search
                </Button>
              </div>
            </div>
            
            {/* Delete node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Delete Node
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  placeholder="Delete value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={handleDelete}
                  className="rounded-r-lg"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          
          {/* Operation Logs */}
          <div className="mt-6 p-4 bg-arena-light rounded-xl">
            <h3 className="text-lg font-medium mb-2">Operation Logs</h3>
            {operationLogs.length === 0 ? (
              <p className="text-arena-gray text-sm italic">No operations performed yet</p>
            ) : (
              <div className="max-h-32 overflow-y-auto">
                {operationLogs.map((log, index) => (
                  <div key={index} className="mb-2 p-2 bg-white rounded border-l-4 border-arena-green text-sm">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">About Binary Search Trees</h2>
          <p className="text-arena-gray mb-4">
            A Binary Search Tree (BST) is a binary tree where each node has a comparable key and satisfies the restriction that the key in any node is larger than the keys in all nodes in that node's left subtree and smaller than the keys in all nodes in that node's right subtree.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(log n) average, O(n) worst</li>
                <li>Insert: O(log n) average, O(n) worst</li>
                <li>Delete: O(log n) average, O(n) worst</li>
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

export default BSTVisualizer;
