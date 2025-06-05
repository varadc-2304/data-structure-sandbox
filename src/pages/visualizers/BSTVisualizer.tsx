
import React, { useState, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Search, Play, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BSTNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  x: number;
  y: number;
}

const BSTVisualizer = () => {
  const [nodes, setNodes] = useState<BSTNode[]>([]);
  const [newValue, setNewValue] = useState('');
  const [parentNode, setParentNode] = useState('');
  const [childNode, setChildNode] = useState('');
  const [childPosition, setChildPosition] = useState<'left' | 'right'>('left');
  const [searchValue, setSearchValue] = useState('');
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState<number>(-1);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder' | 'search' | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addNode = () => {
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

    // Check for duplicate values in BST
    if (nodes.some(node => node.value === value)) {
      toast({
        title: "Duplicate value",
        description: "BST cannot contain duplicate values",
        variant: "destructive",
      });
      return;
    }

    const nodeId = Date.now().toString();
    const newNode: BSTNode = {
      id: nodeId,
      value,
      left: null,
      right: null,
      x: Math.random() * 400 + 200,
      y: Math.random() * 300 + 100,
    };

    setNodes([...nodes, newNode]);
    setNewValue('');
    
    const message = `Added node with value ${value}`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
    });
  };

  const validateBSTProperty = (parentValue: number, childValue: number, position: 'left' | 'right'): boolean => {
    if (position === 'left' && childValue >= parentValue) {
      return false;
    }
    if (position === 'right' && childValue <= parentValue) {
      return false;
    }
    return true;
  };

  const assignChild = () => {
    if (!parentNode || !childNode) {
      toast({
        title: "Input required",
        description: "Please select both parent and child nodes",
        variant: "destructive",
      });
      return;
    }

    const parent = nodes.find(n => n.id === parentNode);
    const child = nodes.find(n => n.id === childNode);

    if (!parent || !child) {
      toast({
        title: "Invalid selection",
        description: "Selected nodes don't exist",
        variant: "destructive",
      });
      return;
    }

    // Validate BST property
    if (!validateBSTProperty(parent.value, child.value, childPosition)) {
      toast({
        title: "BST Property Violation",
        description: `Cannot assign node ${child.value} as ${childPosition} child of ${parent.value}. In BST: left child < parent < right child`,
        variant: "destructive",
      });
      return;
    }

    // Check if child already has a parent
    const hasParent = nodes.some(n => n.left === childNode || n.right === childNode);
    if (hasParent) {
      toast({
        title: "Invalid assignment",
        description: "Child node already has a parent",
        variant: "destructive",
      });
      return;
    }

    if (childPosition === 'left' && parent.left) {
      toast({
        title: "Position occupied",
        description: "Left child position is already occupied",
        variant: "destructive",
      });
      return;
    }

    if (childPosition === 'right' && parent.right) {
      toast({
        title: "Position occupied",
        description: "Right child position is already occupied",
        variant: "destructive",
      });
      return;
    }

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === parentNode
          ? { ...node, [childPosition]: childNode }
          : node
      )
    );

    const message = `Assigned node ${child.value} as ${childPosition} child of node ${parent.value}`;
    addToLog(message);
    
    toast({
      title: "Child assigned",
      description: message,
    });

    setParentNode('');
    setChildNode('');
  };

  const handleMouseDown = (nodeId: string, event: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - node.x;
    const offsetY = event.clientY - rect.top - node.y;

    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!draggedNode || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const newX = event.clientX - rect.left - dragOffset.x;
    const newY = event.clientY - rect.top - dragOffset.y;

    const constrainedX = Math.max(25, Math.min(775, newX));
    const constrainedY = Math.max(25, Math.min(575, newY));

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggedNode
          ? { ...node, x: constrainedX, y: constrainedY }
          : node
      )
    );
  }, [draggedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  React.useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const inorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    inorderTraversal(node.left, result);
    result.push(nodeId);
    inorderTraversal(node.right, result);
  };

  const preorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    result.push(nodeId);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
  };

  const postorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(nodeId);
  };

  const searchPath = (nodeId: string | null, value: number, path: string[]): boolean => {
    if (!nodeId) return false;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return false;
    
    path.push(nodeId);
    
    if (node.value === value) return true;
    
    if (value < node.value) {
      return searchPath(node.left, value, path);
    } else {
      return searchPath(node.right, value, path);
    }
  };

  const findRoot = (): string | null => {
    // Find node that is not a child of any other node
    for (const node of nodes) {
      const isChild = nodes.some(n => n.left === node.id || n.right === node.id);
      if (!isChild) {
        return node.id;
      }
    }
    return nodes.length > 0 ? nodes[0].id : null;
  };

  const startTraversal = (type: 'inorder' | 'preorder' | 'postorder') => {
    if (nodes.length === 0) {
      toast({
        title: "Empty tree",
        description: "Please add some nodes first",
        variant: "destructive",
      });
      return;
    }

    const rootId = findRoot();
    if (!rootId) return;

    const result: string[] = [];
    
    switch (type) {
      case 'inorder':
        inorderTraversal(rootId, result);
        break;
      case 'preorder':
        preorderTraversal(rootId, result);
        break;
      case 'postorder':
        postorderTraversal(rootId, result);
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
    if (nodes.length === 0) {
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
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    const rootId = findRoot();
    if (!rootId) return;

    const path: string[] = [];
    const found = searchPath(rootId, value, path);
    
    setTraversalOrder(path);
    setTraversalType('search');
    setCurrentTraversal(0);
    setIsTraversing(true);
    
    const message = `Searching for value ${value}`;
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

  React.useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      setHighlightedNode(traversalOrder[currentTraversal]);
      
      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal(prev => prev + 1);
        } else {
          setIsTraversing(false);
          setHighlightedNode(null);
          if (traversalType === 'search') {
            const found = searchValue.trim() !== '' && 
                         traversalOrder.length > 0 && 
                         nodes.find(n => n.id === traversalOrder[traversalOrder.length - 1])?.value === Number(searchValue);
            const message = found ? 
              `Found value ${searchValue} in the BST!` : 
              `Value ${searchValue} not found in the BST`;
            addToLog(message);
            toast({
              title: found ? "Search successful" : "Search failed",
              description: message,
              variant: found ? "default" : "destructive",
            });
          } else {
            const values = traversalOrder.map(id => {
              const node = nodes.find(n => n.id === id);
              return node ? node.value : '';
            }).join(' -> ');
            const message = `Completed ${traversalType} traversal: ${values}`;
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
  }, [isTraversing, currentTraversal, traversalOrder, searchValue, traversalType, nodes]);

  const renderEdge = (from: BSTNode, to: BSTNode) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nodeRadius = 25;
    
    const offsetX = (dx / distance) * nodeRadius;
    const offsetY = (dy / distance) * nodeRadius;
    
    const startX = from.x + offsetX;
    const startY = from.y + offsetY;
    const endX = to.x - offsetX;
    const endY = to.y - offsetY;

    return (
      <line
        key={`${from.id}-${to.id}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#6B7280"
        strokeWidth="2"
        className="transition-all duration-300"
      />
    );
  };

  const renderNode = (node: BSTNode) => {
    const isHighlighted = highlightedNode === node.id;

    return (
      <g 
        key={node.id}
        style={{ cursor: 'grab' }}
        onMouseDown={(e) => handleMouseDown(node.id, e)}
      >
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={isHighlighted ? "#10B981" : "#F9FAFB"}
          stroke={isHighlighted ? "#10B981" : "#6B7280"}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={node.x}
          y={node.y + 4}
          textAnchor="middle"
          fontSize="12"
          fill={isHighlighted ? "white" : "#374151"}
          className="font-medium pointer-events-none"
        >
          {node.value}
        </text>
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-6">
          <div className="arena-chip mb-2">Data Structure Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Binary Search Tree Visualizer</h1>
          <p className="text-arena-gray">
            Create BSTs by adding nodes and manually assigning parent-child relationships. BST property validation ensures left child &lt; parent &lt; right child.
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
              className="bg-arena-light rounded-lg p-4 overflow-hidden relative"
              style={{ minHeight: "600px" }}
            >
              <svg 
                ref={svgRef}
                width="100%" 
                height="600" 
                className="border border-gray-200 rounded"
                style={{ userSelect: 'none' }}
              >
                {/* Render edges first */}
                {nodes.map(node => {
                  const edges = [];
                  if (node.left) {
                    const leftChild = nodes.find(n => n.id === node.left);
                    if (leftChild) edges.push(renderEdge(node, leftChild));
                  }
                  if (node.right) {
                    const rightChild = nodes.find(n => n.id === node.right);
                    if (rightChild) edges.push(renderEdge(node, rightChild));
                  }
                  return edges;
                })}
                
                {/* Render nodes on top */}
                {nodes.map(node => renderNode(node))}
              </svg>
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-arena-gray">
                  <span>BST is empty. Add nodes and assign relationships using the controls below.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                  onClick={addNode}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add Node
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Assign Child</h3>
              <div className="space-y-2">
                <select
                  value={parentNode}
                  onChange={(e) => setParentNode(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select Parent</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      Node {node.value}
                    </option>
                  ))}
                </select>
                <select
                  value={childNode}
                  onChange={(e) => setChildNode(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="">Select Child</option>
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>
                      Node {node.value}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setChildPosition('left')}
                    variant={childPosition === 'left' ? 'default' : 'outline'}
                    className="flex-1 text-xs"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Left
                  </Button>
                  <Button
                    onClick={() => setChildPosition('right')}
                    variant={childPosition === 'right' ? 'default' : 'outline'}
                    className="flex-1 text-xs"
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Right
                  </Button>
                </div>
                <Button
                  onClick={assignChild}
                  variant="default"
                  className="w-full bg-blue-500 text-white hover:bg-blue-500/90 text-sm"
                >
                  Assign
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-blue-500 mr-2" />
                Search
              </h3>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search value"
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  onClick={startSearch}
                  disabled={isTraversing}
                  variant="default"
                  className="w-full bg-blue-500 text-white hover:bg-blue-500/90"
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
                  setNodes([]);
                  resetTraversal();
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
                Clear All
              </Button>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Status</h3>
              <div className="text-sm text-arena-gray">
                {isTraversing ? (
                  <div className="space-y-1">
                    <span className="text-arena-green block">
                      Running {traversalType}...
                    </span>
                    <span className="text-xs">
                      Step: {currentTraversal + 1}/{traversalOrder.length}
                    </span>
                  </div>
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
            A BST is a binary tree where for each node: all values in the left subtree are smaller, and all values in the right subtree are larger than the node's value.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">BST Properties:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Left subtree values &lt; root</li>
                <li>Right subtree values &gt; root</li>
                <li>Inorder gives sorted sequence</li>
                <li>No duplicate values allowed</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Manual Construction:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Add nodes with unique values</li>
                <li>Manually assign parent-child relationships</li>
                <li>BST property validation enforced</li>
                <li>Drag nodes to organize layout</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Operations:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Search: O(log n) average case</li>
                <li>Traversals: Inorder, Preorder, Postorder</li>
                <li>Interactive node positioning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
