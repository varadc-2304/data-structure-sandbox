
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Shuffle, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  x?: number;
  y?: number;
  id?: string;
}

const BSTVisualizer = () => {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [treeSize, setTreeSize] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  const [currentTraversal, setCurrentTraversal] = useState<string | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const generateNodeId = (value: number): string => {
    return `node-${value}`;
  };

  const insertBST = (node: BSTNode | null, value: number): BSTNode => {
    if (!node) {
      return {
        value,
        left: null,
        right: null,
        id: generateNodeId(value)
      };
    }

    if (value < node.value) {
      node.left = insertBST(node.left, value);
    } else if (value > node.value) {
      node.right = insertBST(node.right, value);
    }

    return node;
  };

  const calculateNodePositions = (node: BSTNode | null, x: number, y: number, level: number): void => {
    if (!node) return;
    
    const horizontalSpacing = Math.max(80, 300 / Math.pow(2, level));
    
    node.x = x;
    node.y = y;
    
    if (node.left) {
      calculateNodePositions(node.left, x - horizontalSpacing, y + 80, level + 1);
    }
    if (node.right) {
      calculateNodePositions(node.right, x + horizontalSpacing, y + 80, level + 1);
    }
  };

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
    const values = new Set<number>();
    
    while (values.size < size) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }

    let newRoot: BSTNode | null = null;
    Array.from(values).forEach(value => {
      newRoot = insertBST(newRoot, value);
    });

    if (newRoot) {
      calculateNodePositions(newRoot, 400, 50, 0);
    }
    
    setRoot(newRoot);
    setTreeSize('');
    setHighlightedNodes(new Set());
    setCurrentTraversal(null);
    
    const message = `Generated random BST with ${size} nodes`;
    addToLog(message);
    
    toast({
      title: "Random BST generated",
      description: message,
    });
  };

  const inorderTraversal = (node: BSTNode | null, result: string[] = []): string[] => {
    if (!node) return result;
    
    inorderTraversal(node.left, result);
    result.push(node.id!);
    inorderTraversal(node.right, result);
    
    return result;
  };

  const preorderTraversal = (node: BSTNode | null, result: string[] = []): string[] => {
    if (!node) return result;
    
    result.push(node.id!);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
    
    return result;
  };

  const postorderTraversal = (node: BSTNode | null, result: string[] = []): string[] => {
    if (!node) return result;
    
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(node.id!);
    
    return result;
  };

  const runTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (!root) {
      toast({
        title: "Empty BST",
        description: "Cannot perform traversal on an empty BST",
        variant: "destructive",
      });
      return;
    }

    let order: string[] = [];
    switch (type) {
      case 'inorder':
        order = inorderTraversal(root);
        break;
      case 'preorder':
        order = preorderTraversal(root);
        break;
      case 'postorder':
        order = postorderTraversal(root);
        break;
    }

    setCurrentTraversal(type);
    setTraversalOrder(order);
    setCurrentIndex(0);
    setHighlightedNodes(new Set());

    const message = `Started ${type} traversal: ${order.map(id => {
      const value = id.split('-')[1];
      return value;
    }).join(' → ')}`;
    addToLog(message);

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} traversal started`,
      description: `Traversing ${order.length} nodes`,
    });
  };

  useEffect(() => {
    if (currentTraversal && traversalOrder.length > 0 && currentIndex >= 0) {
      const timer = setTimeout(() => {
        if (currentIndex < traversalOrder.length) {
          setHighlightedNodes(new Set([traversalOrder[currentIndex]]));
          setCurrentIndex(currentIndex + 1);
        } else {
          // Traversal complete
          setCurrentTraversal(null);
          setHighlightedNodes(new Set());
          setCurrentIndex(-1);
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentTraversal, currentIndex, traversalOrder]);

  const renderBST = (node: BSTNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isHighlighted = highlightedNodes.has(node.id!);

    return (
      <div key={node.id}>
        <div
          className={cn(
            "absolute w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300",
            {
              "bg-white border-gray-300": !isHighlighted,
              "bg-arena-green/20 border-arena-green animate-bounce": isHighlighted,
            }
          )}
          style={{
            left: `${node.x - 24}px`,
            top: `${node.y}px`,
          }}
        >
          {node.value}
        </div>
        {node.left && renderBST(node.left)}
        {node.right && renderBST(node.right)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Binary Search Tree Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on binary search trees. Generate random BSTs and run traversal algorithms.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
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
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => runTraversal('inorder')}
              variant="outline"
              disabled={!root || currentTraversal !== null}
              className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
            >
              <Search className="h-4 w-4" />
              Inorder Traversal
            </Button>
            <Button
              onClick={() => runTraversal('preorder')}
              variant="outline"
              disabled={!root || currentTraversal !== null}
              className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
            >
              <Search className="h-4 w-4" />
              Preorder Traversal
            </Button>
            <Button
              onClick={() => runTraversal('postorder')}
              variant="outline"
              disabled={!root || currentTraversal !== null}
              className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
            >
              <Search className="h-4 w-4" />
              Postorder Traversal
            </Button>
          </div>
          
          {/* BST visualization */}
          <div className="mb-6 relative bg-arena-light rounded-lg overflow-hidden" style={{ height: '400px' }}>
            {!root ? (
              <div className="flex items-center justify-center w-full h-full text-arena-gray">
                <span>No BST generated. Use the controls above to generate a random BST.</span>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {renderBST(root)}
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
          <h2 className="text-xl font-semibold mb-2">About Binary Search Trees</h2>
          <p className="text-arena-gray mb-4">
            A Binary Search Tree (BST) is a binary tree where for each node, all values in the left subtree are smaller and all values in the right subtree are larger.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity (Average):</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(log n)</li>
                <li>Insertion: O(log n)</li>
                <li>Deletion: O(log n)</li>
                <li>Traversal: O(n)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Storage: O(n)</li>
                <li>Auxiliary (Recursion): O(h) where h is height</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
