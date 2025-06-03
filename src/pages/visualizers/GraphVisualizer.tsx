
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { Plus, Trash, AlertCircle, Search, Share2, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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
  weight?: number;
  directed: boolean;
  highlighted: boolean;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [isDirected, setIsDirected] = useState(false);
  const [sourceNode, setSourceNode] = useState('');
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentDragNode, setCurrentDragNode] = useState<string | null>(null);
  const [visitOrder, setVisitOrder] = useState<string[]>([]);
  const [currentVisitIndex, setCurrentVisitIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  
  const graphRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const resetHighlights = () => {
    setNodes(nodes.map(node => ({ ...node, highlighted: false })));
    setEdges(edges.map(edge => ({ ...edge, highlighted: false })));
    setLastOperation(null);
    setVisitOrder([]);
    setCurrentVisitIndex(-1);
  };

  const addToLog = (message: string) => {
    setLogs(prev => [message, ...prev.slice(0, 9)]);
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
    
    const message = `Added node "${nodeName}"`;
    addToLog(message);
    
    toast({
      title: "Node added",
      description: message,
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

    const existingEdge = edges.find(edge => 
      (edge.from === fromNode && edge.to === toNode) ||
      (!isDirected && edge.from === toNode && edge.to === fromNode)
    );

    if (existingEdge) {
      toast({
        title: "Edge exists",
        description: `Edge already exists between "${fromNode}" and "${toNode}"`,
        variant: "destructive",
      });
      return;
    }

    const weight = edgeWeight.trim() !== '' && !isNaN(Number(edgeWeight)) ? Number(edgeWeight) : undefined;
    
    setEdges([...edges, { 
      from: fromNode, 
      to: toNode, 
      weight, 
      directed: isDirected, 
      highlighted: false 
    }]);
    
    setFromNode('');
    setToNode('');
    setEdgeWeight('');
    
    const message = `Added ${isDirected ? 'directed' : 'undirected'} edge from "${fromNode}" to "${toNode}"${weight !== undefined ? ` with weight ${weight}` : ''}`;
    addToLog(message);
    
    toast({
      title: "Edge added",
      description: message,
    });
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
    setEdges(edges.filter(edge => edge.from !== id && edge.to !== id));
    
    const message = `Deleted node "${id}" and all connected edges`;
    addToLog(message);
    
    toast({
      title: "Node deleted",
      description: message,
    });
  };

  const startNodeDrag = (id: string) => {
    setIsDragging(true);
    setCurrentDragNode(id);
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (isDragging && currentDragNode && graphRef.current) {
      const rect = graphRef.current.getBoundingClientRect();
      const x = Math.max(25, Math.min(e.clientX - rect.left, rect.width - 25));
      const y = Math.max(25, Math.min(e.clientY - rect.top, rect.height - 25));
      
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
    
    // Process the queue
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Find all adjacent vertices
      const adjacentEdges = edges.filter(edge => 
        edge.from === current || (!edge.directed && edge.to === current)
      );
      
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
    setCurrentVisitIndex(0);

    const message = `BFS from "${sourceNode}": [${visitedOrder.join(' → ')}]`;
    addToLog(message);
    
    toast({
      title: "BFS started",
      description: `Running BFS from node "${sourceNode}"`,
    });
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
      const adjacentEdges = edges.filter(edge => 
        edge.from === nodeId || (!edge.directed && edge.to === nodeId)
      );
      
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
    setCurrentVisitIndex(0);

    const message = `DFS from "${sourceNode}": [${visitedOrder.join(' → ')}]`;
    addToLog(message);
    
    toast({
      title: "DFS started",
      description: `Running DFS from node "${sourceNode}"`,
    });
  };

  // Handle traversal animation
  useEffect(() => {
    if (lastOperation && visitOrder.length > 0 && currentVisitIndex >= 0) {
      const timer = setTimeout(() => {
        if (currentVisitIndex < visitOrder.length) {
          setNodes(prevNodes => 
            prevNodes.map(node => ({
              ...node,
              highlighted: node.id === visitOrder[currentVisitIndex]
            }))
          );
          setCurrentVisitIndex(currentVisitIndex + 1);
        } else {
          // Traversal complete
          setTimeout(() => {
            resetHighlights();
          }, 1000);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, visitOrder, currentVisitIndex]);

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
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Graph Visualizer</h1>
          <p className="text-arena-gray">
            Visualize and perform operations on graphs. Add nodes and edges, run traversal algorithms like BFS and DFS.
          </p>
        </div>
        
        <div className="mb-8 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>

          {/* Algorithm buttons */}
          <div className="flex gap-2 mb-4">
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
            >
              <option value="">Select Source Node</option>
              {nodes.map(node => (
                <option key={`source-${node.id}`} value={node.id}>{node.id}</option>
              ))}
            </select>
            <Button 
              onClick={runBFS}
              variant="outline"
              className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
            >
              <Search className="h-4 w-4" />
              Run BFS
            </Button>
            <Button 
              onClick={runDFS}
              variant="outline"
              className="flex items-center gap-2 border-arena-green text-arena-green hover:bg-arena-green hover:text-white"
            >
              <Search className="h-4 w-4" />
              Run DFS
            </Button>
          </div>
          
          {/* Graph visualization */}
          <div 
            ref={graphRef}
            className="mb-6 relative bg-arena-light rounded-lg overflow-hidden"
            style={{ height: '400px', cursor: isDragging ? 'grabbing' : 'default' }}
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
                      const dx = toNode.x - fromNode.x;
                      const dy = toNode.y - fromNode.y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const unitX = dx / length;
                      const unitY = dy / length;
                      
                      // Start from edge of fromNode and end at edge of toNode
                      const startX = fromNode.x + unitX * 24;
                      const startY = fromNode.y + unitY * 24;
                      const endX = toNode.x - unitX * 24;
                      const endY = toNode.y - unitY * 24;
                      
                      const midX = (startX + endX) / 2;
                      const midY = (startY + endY) / 2;
                      
                      return (
                        <g key={`${edge.from}-${edge.to}-${index}`}>
                          <line
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke={edge.highlighted ? '#ea384c' : '#9ca3af'}
                            strokeWidth={edge.highlighted ? 3 : 2}
                          />
                          {edge.directed && (
                            <polygon
                              points={`${endX - 8 * unitX - 4 * unitY},${endY - 8 * unitY + 4 * unitX} ${endX - 8 * unitX + 4 * unitY},${endY - 8 * unitY - 4 * unitX} ${endX},${endY}`}
                              fill={edge.highlighted ? '#ea384c' : '#9ca3af'}
                            />
                          )}
                          {edge.weight !== undefined && (
                            <g>
                              <circle
                                cx={midX}
                                cy={midY}
                                r="12"
                                fill="white"
                                stroke="#d1d5db"
                                strokeWidth="1"
                              />
                              <text
                                x={midX}
                                y={midY + 4}
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-700"
                              >
                                {edge.weight}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
                
                {/* Render nodes */}
                {nodes.map(node => {
                  const isBouncing = visitOrder.includes(node.id) && 
                                   currentVisitIndex > 0 && 
                                   visitOrder[currentVisitIndex - 1] === node.id;
                  
                  return (
                    <div
                      key={node.id}
                      className={cn(
                        "absolute w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-md cursor-grab transition-all duration-300 bg-white",
                        {
                          "border-arena-red text-arena-red": node.highlighted && !isBouncing,
                          "border-gray-300": !node.highlighted && !isBouncing,
                          "animate-bounce border-arena-green text-arena-green": isBouncing,
                        }
                      )}
                      style={{
                        left: `${node.x - 24}px`,
                        top: `${node.y - 24}px`,
                        cursor: isDragging && currentDragNode === node.id ? 'grabbing' : 'grab',
                      }}
                      onMouseDown={() => startNodeDrag(node.id)}
                    >
                      <div className="absolute -top-6 text-xs whitespace-nowrap font-medium">{node.id}</div>
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
                  );
                })}
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
                  className="rounded-r-lg bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add Node
                </Button>
              </div>
            </div>
            
            {/* Add edge */}
            <div className="bg-arena-light rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Share2 className="h-5 w-5 text-arena-green mr-2" />
                Add Edge
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={fromNode}
                    onChange={(e) => setFromNode(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  >
                    <option value="">From Node</option>
                    {nodes.map(node => (
                      <option key={`from-${node.id}`} value={node.id}>{node.id}</option>
                    ))}
                  </select>
                  <select
                    value={toNode}
                    onChange={(e) => setToNode(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  >
                    <option value="">To Node</option>
                    {nodes.map(node => (
                      <option key={`to-${node.id}`} value={node.id}>{node.id}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Weight (optional)"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arena-green focus:border-transparent"
                  />
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={isDirected}
                      onChange={(e) => setIsDirected(e.target.checked)}
                      className="form-checkbox text-arena-green"
                    />
                    <span className="ml-2 text-sm">Directed</span>
                  </label>
                </div>
                <Button 
                  variant="default" 
                  onClick={addEdge}
                  className="w-full bg-arena-green text-white hover:bg-arena-green/90"
                >
                  Add Edge
                </Button>
              </div>
            </div>
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
          <h2 className="text-xl font-semibold mb-2">About Graphs</h2>
          <p className="text-arena-gray mb-4">
            A graph is a non-linear data structure consisting of nodes (vertices) and edges that connect them. Graphs can be used to represent many types of relationships and networks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Time Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>BFS/DFS: O(V + E)</li>
                <li>Add Vertex: O(1)</li>
                <li>Add Edge: O(1)</li>
                <li>Remove Vertex: O(V + E)</li>
              </ul>
            </div>
            <div className="bg-arena-light p-3 rounded-lg">
              <span className="font-medium">Space Complexity:</span>
              <ul className="list-disc pl-5 mt-1 text-arena-gray">
                <li>Adjacency List: O(V + E)</li>
                <li>Adjacency Matrix: O(V²)</li>
                <li>BFS/DFS: O(V) auxiliary space</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
