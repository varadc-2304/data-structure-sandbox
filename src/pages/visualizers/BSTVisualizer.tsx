
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const [currentTraversalType, setCurrentTraversalType] = useState<string | null>(null);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setHighlightedNode(null);
    setLastOperation(null);
    setTraversalPath([]);
    setCurrentTraversalType(null);
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
      // Get the inorder successor (smallest in the right subtree)
      const minNode = findMinNode(node.right);
      node.value = minNode.value;

      // Delete the inorder successor
      node.right = deleteNodeBST(node.right, minNode.value);
    }

    return node;
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
    
    toast({
      title: "Node inserted",
      description: `Inserted node with value ${val} into the BST`,
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
      
      toast({
        title: "Node found",
        description: `Node with value ${val} exists in the BST`,
      });
    } else {
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
    
    // Wait a short time to show the node before deleting
    setTimeout(() => {
      const newRoot = deleteNodeBST({ ...root }, val);
      setRoot(newRoot);
      
      toast({
        title: "Node deleted",
        description: `Deleted node with value ${val} from the BST`,
      });
    }, 1000);

    setDeleteValue('');
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
    setLastOperation('traversal');
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Traversal`,
      description: `${description}: [${path.join(', ')}]`,
    });
  };

  // Function to render the binary tree recursively
  const renderTree = (node: TreeNode | null, level: number = 0, position: string = 'root'): JSX.Element => {
    if (node === null) {
      return <div className="invisible w-16 h-16"></div>;
    }

    const isHighlighted = highlightedNode === node.value;
    const isInPath = traversalPath.includes(node.value);

    return (
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-300",
            {
              "border-arena-red bg-arena-red/10 shadow-md": isHighlighted,
              "border-green-500 bg-green-100": isInPath && !isHighlighted,
              "border-gray-300 bg-white": !isHighlighted && !isInPath,
            }
          )}
        >
          {node.value}
        </div>
        {(node.left !== null || node.right !== null) && (
          <div className="flex items-start space-x-4 relative">
            {/* Left branch */}
            {node.left && (
              <div className="absolute top-0 left-1/3 w-[50px] h-[20px] border-l-2 border-b-2 border-arena-red/70 -translate-x-1/2"></div>
            )}
            
            {/* Right branch */}
            {node.right && (
              <div className="absolute top-0 right-1/3 w-[50px] h-[20px] border-r-2 border-b-2 border-arena-red/70 translate-x-1/2"></div>
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
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Binary Search Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on a Binary Search Tree (BST). Insert, search, delete nodes, and see different traversal orders.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4">BST Visualization</h2>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Insert node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-red mr-2" />
                Insert Node
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={handleInsert}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  Insert
                  <Plus className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Search node */}
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
                <button
                  onClick={handleSearch}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  Search
                  <Search className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Delete node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-red mr-2" />
                Delete Node
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={deleteValue}
                  onChange={(e) => setDeleteValue(e.target.value)}
                  placeholder="Delete value"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-red focus:border-transparent"
                />
                <button
                  onClick={handleDelete}
                  className="bg-arena-red text-white px-4 py-2 rounded-r-lg hover:bg-arena-red/90 transition-colors duration-300 flex items-center"
                >
                  Delete
                  <Trash className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Traversals */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-arena-red mr-2" />
                Tree Traversals
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleTraversal('inorder')}
                  className={cn(
                    "bg-arena-red text-white px-2 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300",
                    { "ring-2 ring-offset-2 ring-arena-red": currentTraversalType === 'inorder' }
                  )}
                >
                  In-Order
                </button>
                <button
                  onClick={() => handleTraversal('preorder')}
                  className={cn(
                    "bg-arena-red text-white px-2 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300",
                    { "ring-2 ring-offset-2 ring-arena-red": currentTraversalType === 'preorder' }
                  )}
                >
                  Pre-Order
                </button>
                <button
                  onClick={() => handleTraversal('postorder')}
                  className={cn(
                    "bg-arena-red text-white px-2 py-2 rounded-lg hover:bg-arena-red/90 transition-colors duration-300",
                    { "ring-2 ring-offset-2 ring-arena-red": currentTraversalType === 'postorder' }
                  )}
                >
                  Post-Order
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
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
              <span className="font-medium">Common Applications:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Implementing maps and sets</li>
                <li>Database indexing</li>
                <li>Priority queues</li>
                <li>Syntax trees in compilers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
