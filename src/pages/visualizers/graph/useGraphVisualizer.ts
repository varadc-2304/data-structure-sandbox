import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export const useGraphVisualizer = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");
  const [isDirected, setIsDirected] = useState(false);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState(-1);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalType, setTraversalType] = useState<"bfs" | "dfs" | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const addNode = () => {
    if (newNodeLabel.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a node label",
        variant: "destructive",
      });
      return;
    }

    if (nodes.find((node) => node.id === newNodeLabel)) {
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
    setNewNodeLabel("");

    const message = `Added node "${newNodeLabel}"`;
    addToLog(message);

    toast({
      title: "Node added",
      description: message,
    });
  };

  const addEdge = () => {
    if (edgeFrom.trim() === "" || edgeTo.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter both from and to nodes",
        variant: "destructive",
      });
      return;
    }

    if (!nodes.find((node) => node.id === edgeFrom) || !nodes.find((node) => node.id === edgeTo)) {
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
    setEdgeFrom("");
    setEdgeTo("");
    setEdgeWeight("");

    const message = `Added ${isDirected ? "directed" : "undirected"} edge from "${edgeFrom}" to "${edgeTo}"${newEdge.weight ? ` with weight ${newEdge.weight}` : ""}`;
    addToLog(message);

    toast({
      title: "Edge added",
      description: message,
    });
  };

  const handleMouseDown = (nodeId: string, event: React.MouseEvent) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - node.x;
    const offsetY = event.clientY - rect.top - node.y;

    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!draggedNode || !svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const newX = event.clientX - rect.left - dragOffset.x;
      const newY = event.clientY - rect.top - dragOffset.y;

      const constrainedX = Math.max(25, Math.min(775, newX));
      const constrainedY = Math.max(25, Math.min(375, newY));

      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === draggedNode ? { ...node, x: constrainedX, y: constrainedY } : node))
      );
    },
    [draggedNode, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  const getNeighbors = (nodeId: string): string[] => {
    const neighbors: string[] = [];
    edges.forEach((edge) => {
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
    if (!nodes.find((node) => node.id === startNodeId)) return [];

    const visited = new Set<string>();
    const queue = [startNodeId];
    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (!visited.has(current)) {
        visited.add(current);
        result.push(current);

        const neighbors = getNeighbors(current);
        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }

    return result;
  };

  const dfsTraversal = (startNodeId: string): string[] => {
    if (!nodes.find((node) => node.id === startNodeId)) return [];

    const visited = new Set<string>();
    const result: string[] = [];

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      result.push(nodeId);

      const neighbors = getNeighbors(nodeId);
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      });
    };

    dfs(startNodeId);
    return result;
  };

  const startTraversal = (type: "bfs" | "dfs") => {
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

    if (type === "bfs") {
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

  useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal((prev) => prev + 1);
        } else {
          setIsTraversing(false);
          const message = `Completed ${traversalType?.toUpperCase()} traversal: ${traversalOrder.join(" -> ")}`;
          addToLog(message);
          toast({
            title: "Traversal completed",
            description: message,
          });
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isTraversing, currentTraversal, traversalOrder, traversalType, toast]);

  const clearGraph = () => {
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
  };

  const resetTraversal = () => {
    setIsTraversing(false);
    setCurrentTraversal(-1);
    setTraversalOrder([]);
    setTraversalType(null);
  };

  return {
    state: {
      nodes,
      edges,
      newNodeLabel,
      edgeFrom,
      edgeTo,
      edgeWeight,
      isDirected,
      traversalOrder,
      currentTraversal,
      isTraversing,
      traversalType,
      logs,
      draggedNode,
      svgRef,
    },
    actions: {
      setNewNodeLabel,
      setEdgeFrom,
      setEdgeTo,
      setEdgeWeight,
      setIsDirected,
      addNode,
      addEdge,
      clearGraph,
      startTraversal,
      resetTraversal,
      handleMouseDown,
    },
  };
};
