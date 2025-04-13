
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Plus, Trash } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Node {
  id: string;
  value: string;
  x: number;
  y: number;
}

interface Edge {
  source: string;
  target: string;
  weight?: number;
}

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeValue, setNodeValue] = useState<string>('');
  const [sourceNode, setSourceNode] = useState<string>('');
  const [targetNode, setTargetNode] = useState<string>('');
  const [edgeWeight, setEdgeWeight] = useState<string>('');
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const addNode = () => {
    if (!nodeValue) {
      return;
    }

    // Check if node already exists with this value
    if (nodes.some(node => node.value === nodeValue)) {
      addLog(`Node with value ${nodeValue} already exists`);
      return;
    }

    const newNode: Node = {
      id: `node-${Date.now()}`,
      value: nodeValue,
      x: 50 + Math.random() * 500,
      y: 50 + Math.random() * 300
    };

    setNodes([...nodes, newNode]);
    setNodeValue('');
    addLog(`Added node with value ${newNode.value}`);
  };

  const addEdge = () => {
    if (!sourceNode || !targetNode) {
      return;
    }

    // Prevent self-loops
    if (sourceNode === targetNode) {
      addLog("Cannot create an edge from a node to itself");
      return;
    }

    // Check if edge already exists
    if (edges.some(edge => edge.source === sourceNode && edge.target === targetNode)) {
      addLog(`Edge already exists between ${sourceNode} and ${targetNode}`);
      return;
    }

    const weight = edgeWeight ? parseInt(edgeWeight) : undefined;

    const newEdge: Edge = {
      source: sourceNode,
      target: targetNode,
      weight
    };

    setEdges([...edges, newEdge]);
    setSourceNode('');
    setTargetNode('');
    setEdgeWeight('');
    
    const sourceNodeValue = nodes.find(node => node.id === sourceNode)?.value;
    const targetNodeValue = nodes.find(node => node.id === targetNode)?.value;
    addLog(`Added edge from ${sourceNodeValue} to ${targetNodeValue}${weight ? ` with weight ${weight}` : ''}`);
  };

  const handleNodeMouseDown = (nodeId: string) => (e: React.MouseEvent) => {
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && svgRef.current) {
      const svg = svgRef.current;
      const point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM()!.inverse());

      setNodes(nodes.map(node => 
        node.id === draggedNodeId 
          ? { ...node, x: svgPoint.x, y: svgPoint.y }
          : node
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedNodeId) {
      setDraggedNodeId(null);
    }
  };

  const removeNode = (nodeId: string) => {
    // Remove the node
    const nodeToRemove = nodes.find(node => node.id === nodeId);
    setNodes(nodes.filter(node => node.id !== nodeId));
    
    // Remove any edges connected to this node
    setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    
    if (nodeToRemove) {
      addLog(`Removed node with value ${nodeToRemove.value} and its connected edges`);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedNodeId]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-10">
          <div className="arena-chip mb-4">Data Structure Visualization</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-2">Graph Visualizer</h1>
          <p className="text-gray-600 mb-6">
            Visualize and interact with graph data structures. Add nodes, create edges, and rearrange the graph.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Graph Visualization</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <svg 
                  ref={svgRef}
                  width="100%" 
                  height="100%" 
                  onMouseMove={handleMouseMove}
                  className="bg-gray-50"
                >
                  {/* Draw edges first so they appear behind nodes */}
                  {edges.map((edge, idx) => {
                    const sourceNode = nodes.find(node => node.id === edge.source);
                    const targetNode = nodes.find(node => node.id === edge.target);
                    
                    if (!sourceNode || !targetNode) return null;
                    
                    return (
                      <g key={`edge-${idx}`}>
                        <line 
                          x1={sourceNode.x} 
                          y1={sourceNode.y} 
                          x2={targetNode.x} 
                          y2={targetNode.y}
                          stroke="#888"
                          strokeWidth="2"
                        />
                        {edge.weight !== undefined && (
                          <text
                            x={(sourceNode.x + targetNode.x) / 2}
                            y={(sourceNode.y + targetNode.y) / 2 - 10}
                            textAnchor="middle"
                            fill="#555"
                            fontSize="12"
                          >
                            {edge.weight}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  
                  {/* Draw nodes */}
                  {nodes.map(node => (
                    <g
                      key={node.id}
                      onMouseDown={handleNodeMouseDown(node.id)}
                      style={{ cursor: 'move' }}
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        fill="white"
                        stroke="#ff6b6b"
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill="#333"
                        fontSize="14"
                      >
                        {node.value}
                      </text>
                      <circle
                        cx={node.x + 20}
                        cy={node.y - 20}
                        r="8"
                        fill="#ff6b6b"
                        stroke="white"
                        strokeWidth="1"
                        onClick={() => removeNode(node.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <text
                        x={node.x + 20}
                        y={node.y - 16}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        onClick={() => removeNode(node.id)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        ✕
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Operation logs */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-drona-gray mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Operation Log
                </h3>
                <ScrollArea className="h-32 w-full border border-gray-200 rounded-lg">
                  {logs.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">No operations yet</div>
                  ) : (
                    <div className="p-2">
                      {logs.map((log, idx) => (
                        <div key={idx} className="py-1 px-2 text-sm border-b border-gray-100 last:border-b-0">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add Node</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="node-value">Node Value</Label>
                  <div className="flex mt-2">
                    <Input
                      id="node-value"
                      value={nodeValue}
                      onChange={(e) => setNodeValue(e.target.value)}
                      placeholder="Enter node value"
                      className="rounded-r-none"
                    />
                    <Button 
                      onClick={addNode}
                      className="rounded-l-none bg-arena-red hover:bg-arena-red/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Add Edge</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="source-node">Source Node</Label>
                  <select
                    id="source-node"
                    value={sourceNode}
                    onChange={(e) => setSourceNode(e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select source node</option>
                    {nodes.map(node => (
                      <option key={`source-${node.id}`} value={node.id}>
                        {node.value}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="target-node">Target Node</Label>
                  <select
                    id="target-node"
                    value={targetNode}
                    onChange={(e) => setTargetNode(e.target.value)}
                    className="w-full mt-2 border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select target node</option>
                    {nodes.map(node => (
                      <option key={`target-${node.id}`} value={node.id}>
                        {node.value}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="edge-weight">Edge Weight (Optional)</Label>
                  <Input
                    id="edge-weight"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    placeholder="Enter edge weight"
                    type="number"
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={addEdge}
                  className="w-full bg-arena-red hover:bg-arena-red/90 text-white"
                  disabled={!sourceNode || !targetNode}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Edge
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">Instructions</h2>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Add nodes by entering values in the "Add Node" section</li>
                <li>Create edges between nodes using the "Add Edge" section</li>
                <li>Drag nodes to reposition them</li>
                <li>Remove a node by clicking the ✕ button on it</li>
                <li>Edge weights are optional</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
