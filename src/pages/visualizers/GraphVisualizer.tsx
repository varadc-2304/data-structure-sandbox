
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, AlertCircle, Search, Share2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';

interface Node {
  id: string;
  x: number;
  y: number;
  highlighted: boolean;
}

interface Edge {
  from: string;
  to: string;
  highlighted: boolean;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDragNode, setCurrentDragNode] = useState<string | null>(null);
  const [visitOrder, setVisitOrder] = useState<string[]>([]);
  
  const graphRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const resetHighlights = () => {
    setNodes(nodes.map(node => ({ ...node, highlighted: false })));
    setEdges(edges.map(edge => ({ ...edge, highlighted: false })));
    setLastOperation(null);
    setVisitOrder([]);
  };

  const addNode = () => {
    if (nodeName.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Please enter a node name",
        variant: "destructive",
      });
      return;
    }

    if (nodes.some(node => node.id === nodeName)) {
      toast({
        title: "Node exists",
        description: `Node "${nodeName}" already exists`,
        variant: "destructive",
      });
      return;
    }

    // Get random position within the graph container
    const containerWidth = graphRef.current?.clientWidth || 500;
    const containerHeight = graphRef.current?.clientHeight || 300;
    const x = Math.random() * (containerWidth - 100) + 50;
    const y = Math.random() * (containerHeight - 100) + 50;

    setNodes([...nodes, { id: nodeName, x, y, highlighted: false }]);
    setNodeName('');
    
    toast({
      title: "Node added",
      description: `Added node "${nodeName}" to the graph`,
    });
  };

  const addEdge = () => {
    if (fromNode.trim() === '' || toNode.trim() === '') {
      toast({
        title: "Invalid input",
        description: "Please select both source and target nodes",
        variant: "destructive",
      });
      return;
    }

    if (fromNode === toNode) {
      toast({
        title: "Invalid edge",
        description: "Cannot create an edge from a node to itself",
        variant: "destructive",
      });
      return;
    }

    if (!nodes.some(node => node.id === fromNode) || !nodes.some(node => node.id === toNode)) {
      toast({
        title: "Node not found",
        description: "One or both nodes do not exist",
        variant: "destructive",
      });
      return;
    }

    if (edges.some(edge => edge.from === fromNode && edge.to === toNode)) {
      toast({
        title: "Edge exists",
        description: `Edge from "${fromNode}" to "${toNode}" already exists`,
        variant: "destructive",
      });
      return;
    }

    setEdges([...edges, { from: fromNode, to: toNode, highlighted: false }]);
    setFromNode('');
    setToNode('');
    
    toast({
      title: "Edge added",
      description: `Added edge from "${fromNode}" to "${toNode}"`,
    });
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setEdges(edges.filter(edge => edge.from !== id && edge.to !== id));
    
    toast({
      title: "Node deleted",
      description: `Deleted node "${id}" and all connected edges`,
    });
  };

  const startNodeDrag = (id: string) => {
    setIsDragging(true);
    setCurrentDragNode(id);
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (isDragging && currentDragNode && graphRef.current) {
      const rect = graphRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNodes(nodes.map(node => 
        node.id === currentDragNode ? { ...node, x, y } : node
      ));
    }
  };

  const stopNodeDrag = () => {
    setIsDragging(false);
    setCurrentDragNode(null);
  };

  // BFS algorithm
  const runBFS = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty graph",
        description: "Cannot run BFS on an empty graph",
        variant: "destructive",
      });
      return;
    }

    if (sourceNode === '') {
      toast({
        title: "Source required",
        description: "Please select a source node for BFS",
        variant: "destructive",
      });
      return;
    }

    resetHighlights();
    setLastOperation('bfs');

    const visited: { [key: string]: boolean } = {};
    const queue: string[] = [];
    const visitedOrder: string[] = [];
    
    // Initialize all nodes as not visited
    nodes.forEach(node => {
      visited[node.id] = false;
    });
    
    // Start BFS from the source node
    visited[sourceNode] = true;
    queue.push(sourceNode);
    visitedOrder.push(sourceNode);
    
    // Simulate BFS animation
    const animateBFS = () => {
      const newNodes = [...nodes];
      const newEdges = [...edges];
      
      // Highlight the nodes in the order they were visited
      visitedOrder.forEach((nodeId, index) => {
        setTimeout(() => {
          const nodeIndex = newNodes.findIndex(node => node.id === nodeId);
          if (nodeIndex !== -1) {
            newNodes[nodeIndex].highlighted = true;
            setNodes([...newNodes]);
            
            // Highlight edges if the next node in the visit order is connected
            if (index < visitedOrder.length - 1) {
              const nextNodeId = visitedOrder[index + 1];
              const edgeIndex = newEdges.findIndex(
                edge => (edge.from === nodeId && edge.to === nextNodeId) ||
                       (edge.from === nextNodeId && edge.to === nodeId)
              );
              if (edgeIndex !== -1) {
                newEdges[edgeIndex].highlighted = true;
                setEdges([...newEdges]);
              }
            }
          }
        }, index * 500);
      });
    };
    
    // Process the queue
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Find all adjacent vertices
      const adjacentEdges = edges.filter(edge => edge.from === current || edge.to === current);
      
      for (const edge of adjacentEdges) {
        const neighbor = edge.from === current ? edge.to : edge.from;
        
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
          visitedOrder.push(neighbor);
        }
      }
    }
    
    setVisitOrder(visitedOrder);
    
    toast({
      title: "BFS started",
      description: `Running BFS from node "${sourceNode}"`,
    });
    
    animateBFS();
  };

  // DFS algorithm
  const runDFS = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty graph",
        description: "Cannot run DFS on an empty graph",
        variant: "destructive",
      });
      return;
    }

    if (sourceNode === '') {
      toast({
        title: "Source required",
        description: "Please select a source node for DFS",
        variant: "destructive",
      });
      return;
    }

    resetHighlights();
    setLastOperation('dfs');

    const visited: { [key: string]: boolean } = {};
    const visitedOrder: string[] = [];
    
    // Initialize all nodes as not visited
    nodes.forEach(node => {
      visited[node.id] = false;
    });
    
    // Function to perform DFS
    const dfs = (nodeId: string) => {
      visited[nodeId] = true;
      visitedOrder.push(nodeId);
      
      // Find all adjacent vertices
      const adjacentEdges = edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
      
      for (const edge of adjacentEdges) {
        const neighbor = edge.from === nodeId ? edge.to : edge.from;
        
        if (!visited[neighbor]) {
          dfs(neighbor);
        }
      }
    };
    
    // Start DFS from the source node
    dfs(sourceNode);
    
    setVisitOrder(visitedOrder);
    
    // Simulate DFS animation
    const animateDFS = () => {
      const newNodes = [...nodes];
      const newEdges = [...edges];
      
      // Highlight the nodes in the order they were visited
      visitedOrder.forEach((nodeId, index) => {
        setTimeout(() => {
          const nodeIndex = newNodes.findIndex(node => node.id === nodeId);
          if (nodeIndex !== -1) {
            newNodes[nodeIndex].highlighted = true;
            setNodes([...newNodes]);
            
            // Highlight edges if the next node in the visit order is connected
            if (index < visitedOrder.length - 1) {
              const nextNodeId = visitedOrder[index + 1];
              const edgeIndex = newEdges.findIndex(
                edge => (edge.from === nodeId && edge.to === nextNodeId) ||
                       (edge.from === nextNodeId && edge.to === nodeId)
              );
              if (edgeIndex !== -1) {
                newEdges[edgeIndex].highlighted = true;
                setEdges([...newEdges]);
              }
            }
          }
        }, index * 500);
      });
    };
    
    toast({
      title: "DFS started",
      description: `Running DFS from node "${sourceNode}"`,
    });
    
    animateDFS();
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation && visitOrder.length > 0) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, (visitOrder.length + 1) * 500);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, visitOrder]);

  useEffect(() => {
    // Add event listeners for mouse events outside the component
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleNodeDrag(e as unknown as React.MouseEvent);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        stopNodeDrag();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentDragNode]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10 animate-slide-in">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Graph Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on graphs. Add nodes and edges, run traversal algorithms like BFS and DFS.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
          
          {/* Graph visualization */}
          <div 
            ref={graphRef}
            className="mb-6 relative bg-arena-light rounded-lg"
            style={{ height: '400px', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'default' }}
          >
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center w-full h-full text-arena-gray">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Graph is empty. Add nodes and edges using the controls below.</span>
              </div>
            ) : (
              <>
                {/* Render edges */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {edges.map((edge, index) => {
                    const fromNode = nodes.find(node => node.id === edge.from);
                    const toNode = nodes.find(node => node.id === edge.to);
                    
                    if (fromNode && toNode) {
                      return (
                        <line
                          key={`${edge.from}-${edge.to}`}
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={edge.highlighted ? '#ea384c' : '#ccc'}
                          strokeWidth={edge.highlighted ? 3 : 2}
                        />
                      );
                    }
                    return null;
                  })}
                </svg>
                
                {/* Render nodes */}
                {nodes.map(node => (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md cursor-grab transition-all duration-300",
                      {
                        "bg-arena-red/10 border-arena-red text-arena-red": node.highlighted,
                        "bg-white border-gray-300": !node.highlighted,
                      }
                    )}
                    style={{
                      left: `${node.x - 24}px`,
                      top: `${node.y - 24}px`,
                      cursor: isDragging && currentDragNode === node.id ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={() => startNodeDrag(node.id)}
                  >
                    <div className="absolute -top-6 text-xs whitespace-nowrap">{node.id}</div>
                    <button
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Add Node
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="Enter node name"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button 
                  variant="default" 
                  onClick={addNode}
                  className="rounded-r-lg"
                >
                  Add Node
                  <Plus className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Add edge */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Share2 className="h-5 w-5 text-arena-green mr-2" />
                Add Edge
              </h3>
              <div className="grid grid-cols-5 gap-2">
                <select
                  value={fromNode}
                  onChange={(e) => setFromNode(e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                >
                  <option value="">From Node</option>
                  {nodes.map(node => (
                    <option key={`from-${node.id}`} value={node.id}>{node.id}</option>
                  ))}
                </select>
                <select
                  value={toNode}
                  onChange={(e) => setToNode(e.target.value)}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                >
                  <option value="">To Node</option>
                  {nodes.map(node => (
                    <option key={`to-${node.id}`} value={node.id}>{node.id}</option>
                  ))}
                </select>
                <Button 
                  variant="default" 
                  onClick={addEdge}
                  className="col-span-1"
                >
                  Add
                </Button>
              </div>
            </div>
            
            {/* Run BFS */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-arena-green mr-2" />
                Run BFS
              </h3>
              <div className="flex">
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                >
                  <option value="">Select Source Node</option>
                  {nodes.map(node => (
                    <option key={`bfs-${node.id}`} value={node.id}>{node.id}</option>
                  ))}
                </select>
                <Button 
                  variant="default" 
                  onClick={runBFS}
                  className="rounded-r-lg"
                >
                  Run BFS
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Run DFS */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-arena-green mr-2" />
                Run DFS
              </h3>
              <div className="flex">
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                >
                  <option value="">Select Source Node</option>
                  {nodes.map(node => (
                    <option key={`dfs-${node.id}`} value={node.id}>{node.id}</option>
                  ))}
                </select>
                <Button 
                  variant="default" 
                  onClick={runDFS}
                  className="rounded-r-lg"
                >
                  Run DFS
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold mb-2">About Graphs</h2>
          <p className="text-arena-gray mb-4">
            A graph is a non-linear data structure consisting of nodes (vertices) and edges that connect them. Graphs can be used to represent many types of relationships and networks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Graph Types:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Directed vs Undirected</li>
                <li>Weighted vs Unweighted</li>
                <li>Cyclic vs Acyclic</li>
                <li>Connected vs Disconnected</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Common Applications:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Social networks</li>
                <li>Web page links</li>
                <li>Road networks and maps</li>
                <li>Recommendation systems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
