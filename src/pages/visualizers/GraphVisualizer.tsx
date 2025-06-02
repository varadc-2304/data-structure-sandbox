
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, Eye, AlertCircle, Search, ArrowRight, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

interface GraphNode {
  id: number;
  x: number;
  y: number;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [newNodeId, setNewNodeId] = useState('');
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [startNode, setStartNode] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDirected, setIsDirected] = useState(false);
  
  const { toast } = useToast();

  const resetHighlights = () => {
    setHighlightedNodes([]);
    setHighlightedEdges([]);
    setLastOperation(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addNode = () => {
    if (newNodeId.trim() === '' || isNaN(Number(newNodeId))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid numeric node ID",
        variant: "destructive",
      });
      return;
    }

    const nodeId = Number(newNodeId);
    
    if (nodes.find(node => node.id === nodeId)) {
      toast({
        title: "Node exists",
        description: `Node with ID ${nodeId} already exists`,
        variant: "destructive",
      });
      return;
    }

    // Generate random position for the node
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 200;
    
    setNodes([...nodes, { id: nodeId, x, y }]);
    setNewNodeId('');
    setLastOperation('addNode');
    setHighlightedNodes([nodeId]);
    
    const message = `Added node ${nodeId}`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
    });
  };

  const addEdge = () => {
    if (fromNode.trim() === '' || toNode.trim() === '' || 
        isNaN(Number(fromNode)) || isNaN(Number(toNode))) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numeric node IDs",
        variant: "destructive",
      });
      return;
    }

    const from = Number(fromNode);
    const to = Number(toNode);
    
    if (!nodes.find(node => node.id === from) || !nodes.find(node => node.id === to)) {
      toast({
        title: "Node not found",
        description: "One or both nodes do not exist",
        variant: "destructive",
      });
      return;
    }

    const edgeKey = `${from}-${to}`;
    const reverseEdgeKey = `${to}-${from}`;
    
    if (edges.find(edge => `${edge.from}-${edge.to}` === edgeKey) ||
        (!isDirected && edges.find(edge => `${edge.from}-${edge.to}` === reverseEdgeKey))) {
      toast({
        title: "Edge exists",
        description: "Edge already exists between these nodes",
        variant: "destructive",
      });
      return;
    }

    const weight = edgeWeight.trim() !== '' && !isNaN(Number(edgeWeight)) 
      ? Number(edgeWeight) 
      : undefined;
    
    setEdges([...edges, { from, to, weight }]);
    setFromNode('');
    setToNode('');
    setEdgeWeight('');
    setLastOperation('addEdge');
    setHighlightedNodes([from, to]);
    setHighlightedEdges([edgeKey]);
    
    const message = `Added edge from ${from} to ${to}${weight !== undefined ? ` with weight ${weight}` : ''}`;
    addToLog(message);
    
    toast({
      title: "Edge added",
      description: message,
    });
  };

  const removeNode = (nodeId: number) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setEdges(edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
    
    const message = `Removed node ${nodeId} and all connected edges`;
    addToLog(message);
    
    toast({
      title: "Node removed",
      description: message,
    });
  };

  const performBFS = () => {
    if (startNode.trim() === '' || isNaN(Number(startNode))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid start node ID",
        variant: "destructive",
      });
      return;
    }

    const start = Number(startNode);
    
    if (!nodes.find(node => node.id === start)) {
      toast({
        title: "Node not found",
        description: "Start node does not exist",
        variant: "destructive",
      });
      return;
    }

    const visited = new Set<number>();
    const queue = [start];
    const bfsOrder: number[] = [];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (!visited.has(current)) {
        visited.add(current);
        bfsOrder.push(current);
        
        // Find all neighbors
        const neighbors = edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to);
        
        if (!isDirected) {
          // Add reverse edges for undirected graphs
          const reverseNeighbors = edges
            .filter(edge => edge.to === current)
            .map(edge => edge.from);
          neighbors.push(...reverseNeighbors);
        }
        
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }

    setHighlightedNodes(bfsOrder);
    setLastOperation('bfs');
    
    const message = `BFS from node ${start}: [${bfsOrder.join(', ')}]`;
    addToLog(message);
    
    toast({
      title: "BFS Completed",
      description: message,
    });
  };

  const performDFS = () => {
    if (startNode.trim() === '' || isNaN(Number(startNode))) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid start node ID",
        variant: "destructive",
      });
      return;
    }

    const start = Number(startNode);
    
    if (!nodes.find(node => node.id === start)) {
      toast({
        title: "Node not found",
        description: "Start node does not exist",
        variant: "destructive",
      });
      return;
    }

    const visited = new Set<number>();
    const dfsOrder: number[] = [];
    
    const dfsHelper = (nodeId: number) => {
      visited.add(nodeId);
      dfsOrder.push(nodeId);
      
      // Find all neighbors
      const neighbors = edges
        .filter(edge => edge.from === nodeId)
        .map(edge => edge.to);
      
      if (!isDirected) {
        // Add reverse edges for undirected graphs
        const reverseNeighbors = edges
          .filter(edge => edge.to === nodeId)
          .map(edge => edge.from);
        neighbors.push(...reverseNeighbors);
      }
      
      neighbors.forEach(neighbor => {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      });
    };
    
    dfsHelper(start);

    setHighlightedNodes(dfsOrder);
    setLastOperation('dfs');
    
    const message = `DFS from node ${start}: [${dfsOrder.join(', ')}]`;
    addToLog(message);
    
    toast({
      title: "DFS Completed",
      description: message,
    });
  };

  // Clear highlights after a delay
  useEffect(() => {
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Graph Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on graphs. Add nodes, create edges, and run traversal algorithms like BFS and DFS.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Graph Visualization</h2>
            <div className="flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isDirected}
                  onChange={(e) => setIsDirected(e.target.checked)}
                  className="form-checkbox text-drona-green"
                />
                <span className="ml-2">Directed Graph</span>
              </label>
            </div>
          </div>
          
          {/* Graph visualization */}
          <div className="mb-6 relative">
            <div className="bg-arena-light rounded-lg p-4" style={{ minHeight: "400px", position: "relative" }}>
              {nodes.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full py-8 text-arena-gray">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  <span>Graph is empty. Add nodes using the controls below.</span>
                </div>
              ) : (
                <svg width="100%" height="400" className="absolute inset-0">
                  {/* Render edges */}
                  {edges.map((edge, index) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    const edgeKey = `${edge.from}-${edge.to}`;
                    const isHighlighted = highlightedEdges.includes(edgeKey);
                    
                    return (
                      <g key={index}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isHighlighted ? "#22c55e" : "#6b7280"}
                          strokeWidth={isHighlighted ? "3" : "2"}
                          markerEnd={isDirected ? "url(#arrowhead)" : ""}
                        />
                        {edge.weight !== undefined && (
                          <text
                            x={(fromNode.x + toNode.x) / 2}
                            y={(fromNode.y + toNode.y) / 2 - 5}
                            textAnchor="middle"
                            className="text-sm fill-gray-600"
                          >
                            {edge.weight}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Arrow marker for directed graphs */}
                  {isDirected && (
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
                          fill="#6b7280"
                        />
                      </marker>
                    </defs>
                  )}
                </svg>
              )}
              
              {/* Render nodes */}
              {nodes.map((node) => {
                const isHighlighted = highlightedNodes.includes(node.id);
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute w-12 h-12 rounded-full flex items-center justify-center border-2 font-medium cursor-pointer transition-all duration-300",
                      {
                        "border-drona-green bg-drona-green/10 shadow-md": isHighlighted,
                        "border-gray-400 bg-white hover:border-gray-600": !isHighlighted,
                      }
                    )}
                    style={{
                      left: node.x - 24,
                      top: node.y - 24,
                    }}
                    onClick={() => removeNode(node.id)}
                    title={`Click to remove node ${node.id}`}
                  >
                    {node.id}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add node */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Plus className="h-5 w-5 text-drona-green mr-2" />
                Add Node
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={newNodeId}
                  onChange={(e) => setNewNodeId(e.target.value)}
                  placeholder="Node ID"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
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
                <ArrowRight className="h-5 w-5 text-drona-green mr-2" />
                Add Edge
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={fromNode}
                    onChange={(e) => setFromNode(e.target.value)}
                    placeholder="From node"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={toNode}
                    onChange={(e) => setToNode(e.target.value)}
                    placeholder="To node"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                  />
                </div>
                <div className="flex">
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight (optional)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                  />
                  <Button
                    onClick={addEdge}
                    className="rounded-r-lg"
                  >
                    Add Edge
                  </Button>
                </div>
              </div>
            </div>
            
            {/* BFS */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Search className="h-5 w-5 text-drona-green mr-2" />
                Breadth-First Search
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  placeholder="Start node"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={performBFS}
                  className="rounded-r-lg"
                >
                  Run BFS
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* DFS */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Eye className="h-5 w-5 text-drona-green mr-2" />
                Depth-First Search
              </h3>
              <div className="flex">
                <input
                  type="number"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  placeholder="Start node"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-drona-green focus:border-transparent"
                />
                <Button
                  onClick={performDFS}
                  className="rounded-r-lg"
                >
                  Run DFS
                  <Play className="ml-2 h-4 w-4" />
                </Button>
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
          <h2 className="text-xl font-semibold mb-2">About Graphs</h2>
          <p className="text-arena-gray mb-4">
            A graph is a data structure consisting of vertices (nodes) connected by edges. Graphs can be directed or undirected, weighted or unweighted.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>BFS: O(V + E)</li>
                <li>DFS: O(V + E)</li>
                <li>Add Vertex: O(1)</li>
                <li>Add Edge: O(1)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Adjacency List: O(V + E)</li>
                <li>Adjacency Matrix: O(V²)</li>
                <li>BFS/DFS: O(V) auxiliary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
