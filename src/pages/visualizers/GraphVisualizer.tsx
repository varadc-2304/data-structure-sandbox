import React, { useState, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [isDirected, setIsDirected] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState(-1);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalType, setTraversalType] = useState<'bfs' | 'dfs' | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addNode = () => {
    if (newNodeLabel.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter a node label",
        variant: "destructive",
      });
      return;
    }

    if (nodes.find(node => node.id === newNodeLabel)) {
      toast({
        title: "Node exists",
        description: "A node with this label already exists",
        variant: "destructive",
      });
      return;
    }

    const newNode: GraphNode = {
      id: newNodeLabel,
      label: newNodeLabel,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
    };

    setNodes([...nodes, newNode]);
    setNewNodeLabel('');
    
    const message = `Added node "${newNodeLabel}"`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
    });
  };

  const addEdge = () => {
    if (edgeFrom.trim() === '' || edgeTo.trim() === '') {
      toast({
        title: "Input required",
        description: "Please enter both from and to nodes",
        variant: "destructive",
      });
      return;
    }

    if (!nodes.find(node => node.id === edgeFrom) || !nodes.find(node => node.id === edgeTo)) {
      toast({
        title: "Invalid nodes",
        description: "One or both nodes don't exist",
        variant: "destructive",
      });
      return;
    }

    const newEdge: GraphEdge = {
      from: edgeFrom,
      to: edgeTo,
      weight: edgeWeight ? Number(edgeWeight) : undefined,
      directed: isDirected,
    };

    setEdges([...edges, newEdge]);
    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('');
    
    const message = `Added ${isDirected ? 'directed' : 'undirected'} edge from "${edgeFrom}" to "${edgeTo}"${newEdge.weight ? ` with weight ${newEdge.weight}` : ''}`;
    addToLog(message);
    
    toast({
      title: "Edge added",
      description: message,
    });
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

    // Constrain to SVG bounds
    const constrainedX = Math.max(25, Math.min(775, newX));
    const constrainedY = Math.max(25, Math.min(375, newY));

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

  const getNeighbors = (nodeId: string): string[] => {
    const neighbors: string[] = [];
    edges.forEach(edge => {
      if (edge.from === nodeId) {
        neighbors.push(edge.to);
      }
      if (!edge.directed && edge.to === nodeId) {
        neighbors.push(edge.from);
      }
    });
    return neighbors;
  };

  const bfsTraversal = (startNodeId: string): string[] => {
    if (!nodes.find(node => node.id === startNodeId)) return [];
    
    const visited = new Set<string>();
    const queue = [startNodeId];
    const result: string[] = [];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);
        
        const neighbors = getNeighbors(current);
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }
    
    return result;
  };

  const dfsTraversal = (startNodeId: string): string[] => {
    if (!nodes.find(node => node.id === startNodeId)) return [];
    
    const visited = new Set<string>();
    const result: string[] = [];
    
    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      result.push(nodeId);
      
      const neighbors = getNeighbors(nodeId);
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      });
    };
    
    dfs(startNodeId);
    return result;
  };

  const startTraversal = (type: 'bfs' | 'dfs') => {
    if (nodes.length === 0) {
      toast({
        title: "Empty graph",
        description: "Please add some nodes first",
        variant: "destructive",
      });
      return;
    }

    const startNode = nodes[0].id;
    let result: string[] = [];
    
    if (type === 'bfs') {
      result = bfsTraversal(startNode);
    } else {
      result = dfsTraversal(startNode);
    }
    
    setTraversalOrder(result);
    setTraversalType(type);
    setCurrentTraversal(0);
    setIsTraversing(true);
    
    const message = `Started ${type.toUpperCase()} traversal from node "${startNode}"`;
    addToLog(message);
  };

  React.useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal(prev => prev + 1);
        } else {
          setIsTraversing(false);
          const message = `Completed ${traversalType?.toUpperCase()} traversal: ${traversalOrder.join(' -> ')}`;
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

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const renderEdge = (edge: GraphEdge, index: number) => {
    const fromPos = getNodePosition(edge.from);
    const toPos = getNodePosition(edge.to);
    
    // Calculate edge positions from node boundaries
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const nodeRadius = 25;
    
    const offsetX = (dx / distance) * nodeRadius;
    const offsetY = (dy / distance) * nodeRadius;
    
    const startX = fromPos.x + offsetX;
    const startY = fromPos.y + offsetY;
    const endX = toPos.x - offsetX;
    const endY = toPos.y - offsetY;
    
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    return (
      <g key={index}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#6B7280"
          strokeWidth="2"
          markerEnd={edge.directed ? "url(#arrowhead)" : undefined}
        />
        {edge.weight && (
          <circle cx={midX} cy={midY} r="12" fill="white" stroke="#6B7280" strokeWidth="1" />
        )}
        {edge.weight && (
          <text x={midX} y={midY + 4} textAnchor="middle" fontSize="10" fill="#374151">
            {edge.weight}
          </text>
        )}
      </g>
    );
  };

  const renderNode = (node: GraphNode) => {
    const isHighlighted = isTraversing && currentTraversal >= 0 && 
                         traversalOrder[currentTraversal] === node.id;

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
          className="font-medium"
          style={{ pointerEvents: 'none' }}
        >
          {node.label}
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
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Graph Visualizer</h1>
          <p className="text-arena-gray">
            Create and visualize graphs with nodes and edges. Explore BFS and DFS traversal algorithms.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Graph Visualization</h2>
            <div className="flex gap-2">
              <Button 
                onClick={() => startTraversal('bfs')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                {isTraversing && traversalType === 'bfs' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                BFS
              </Button>
              <Button 
                onClick={() => startTraversal('dfs')}
                disabled={isTraversing}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                {isTraversing && traversalType === 'dfs' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                DFS
              </Button>
              <Button
                onClick={() => {
                  setIsTraversing(false);
                  setCurrentTraversal(-1);
                  setTraversalOrder([]);
                  setTraversalType(null);
                }}
                variant="outline"
                className="border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          
          {/* Graph visualization */}
          <div className="mb-6 relative">
            <div 
              className="bg-arena-light rounded-lg p-4 overflow-hidden relative"
              style={{ minHeight: "400px" }}
            >
              <svg 
                ref={svgRef}
                width="100%" 
                height="400" 
                className="border border-gray-200 rounded"
                style={{ userSelect: 'none' }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6B7280"
                    />
                  </marker>
                </defs>
                
                {/* Render edges first */}
                {edges.map((edge, index) => renderEdge(edge, index))}
                
                {/* Render nodes on top */}
                {nodes.map(node => renderNode(node))}
              </svg>
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-arena-gray">
                  <span>Graph is empty. Add nodes and edges using the controls below.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-arena-green mr-2" />
                Add Node
              </h3>
              <div className="flex">
                <input
                  type="text"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="Node label"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                />
                <Button
                  onClick={addNode}
                  variant="default"
                  className="rounded-l-none bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Add Edge</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="text"
                    value={edgeFrom}
                    onChange={(e) => setEdgeFrom(e.target.value)}
                    placeholder="From"
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={edgeTo}
                    onChange={(e) => setEdgeTo(e.target.value)}
                    placeholder="To"
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                </div>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={isDirected}
                      onChange={(e) => setIsDirected(e.target.checked)}
                      className="mr-1"
                    />
                    Directed
                  </label>
                </div>
                <Button
                  onClick={addEdge}
                  variant="default"
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90 text-sm"
                >
                  Add Edge
                </Button>
              </div>
            </div>
            
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Trash className="h-5 w-5 text-arena-green mr-2" />
                Clear Graph
              </h3>
              <Button
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setTraversalOrder([]);
                  setCurrentTraversal(-1);
                  setIsTraversing(false);
                  setTraversalType(null);
                  const message = "Cleared the entire graph";
                  addToLog(message);
                  toast({
                    title: "Graph cleared",
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
              <h3 className="text-lg font-medium mb-3">Traversal Status</h3>
              <div className="text-sm text-arena-gray">
                {isTraversing ? (
                  <span className="text-arena-green">
                    Running {traversalType?.toUpperCase()}... 
                    ({currentTraversal + 1}/{traversalOrder.length})
                  </span>
                ) : (
                  <span>Ready to traverse</span>
                )}
              </div>
              {traversalOrder.length > 0 && (
                <div className="mt-2 text-xs text-arena-gray">
                  Order: {traversalOrder.slice(0, currentTraversal + 1).join(' → ')}
                </div>
              )}
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
          <h2 className="text-xl font-semibold mb-2">About Graphs</h2>
          <p className="text-arena-gray mb-4">
            A graph is a data structure consisting of vertices (nodes) connected by edges. Graphs can be directed or undirected, weighted or unweighted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Traversal Algorithms:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>BFS: Breadth-First Search</li>
                <li>DFS: Depth-First Search</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Applications:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Social networks</li>
                <li>Road networks</li>
                <li>Web page links</li>
                <li>Computer networks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
