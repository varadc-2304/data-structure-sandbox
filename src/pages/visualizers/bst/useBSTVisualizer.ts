import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface InsertState {
  rootId: string | null;
  insertIndex: number;
  valueArray: number[];
  baseTime: number;
}

export interface BSTNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  x: number;
  y: number;
}

export const useBSTVisualizer = () => {
  const [nodes, setNodes] = useState<BSTNode[]>([]);
  const [newValue, setNewValue] = useState("");
  const [parentNode, setParentNode] = useState("");
  const [childNode, setChildNode] = useState("");
  const [childPosition, setChildPosition] = useState<"left" | "right">("left");
  const [searchValue, setSearchValue] = useState("");
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [currentTraversal, setCurrentTraversal] = useState<number>(-1);
  const [traversalType, setTraversalType] = useState<"inorder" | "preorder" | "postorder" | "search" | null>(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const insertStateRef = useRef<InsertState | null>(null);

  const { toast } = useToast();

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const addNode = () => {
    if (newValue.trim() === "") {
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
    if (nodes.some((node) => node.value === value)) {
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
    setNewValue("");

    const message = `Added node with value ${value}`;
    addToLog(message);

    toast({
      title: "Node added",
      description: message,
    });
  };

  const validateBSTProperty = (parentValue: number, childValue: number, position: "left" | "right"): boolean => {
    if (position === "left" && childValue >= parentValue) {
      return false;
    }
    if (position === "right" && childValue <= parentValue) {
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

    const parent = nodes.find((n) => n.id === parentNode);
    const child = nodes.find((n) => n.id === childNode);

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
    const hasParent = nodes.some((n) => n.left === childNode || n.right === childNode);
    if (hasParent) {
      toast({
        title: "Invalid assignment",
        description: "Child node already has a parent",
        variant: "destructive",
      });
      return;
    }

    if (childPosition === "left" && parent.left) {
      toast({
        title: "Position occupied",
        description: "Left child position is already occupied",
        variant: "destructive",
      });
      return;
    }

    if (childPosition === "right" && parent.right) {
      toast({
        title: "Position occupied",
        description: "Right child position is already occupied",
        variant: "destructive",
      });
      return;
    }

    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === parentNode ? { ...node, [childPosition]: childNode } : node))
    );

    const message = `Assigned node ${child.value} as ${childPosition} child of node ${parent.value}`;
    addToLog(message);

    toast({
      title: "Child assigned",
      description: message,
    });

    setParentNode("");
    setChildNode("");
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
      const constrainedY = Math.max(25, Math.min(575, newY));

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

  const inorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    inorderTraversal(node.left, result);
    result.push(nodeId);
    inorderTraversal(node.right, result);
  };

  const preorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    result.push(nodeId);
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
  };

  const postorderTraversal = (nodeId: string | null, result: string[]): void => {
    if (!nodeId) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(nodeId);
  };

  const searchPath = (nodeId: string | null, value: number, path: string[]): boolean => {
    if (!nodeId) return false;
    const node = nodes.find((n) => n.id === nodeId);
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
    for (const node of nodes) {
      const isChild = nodes.some((n) => n.left === node.id || n.right === node.id);
      if (!isChild) {
        return node.id;
      }
    }
    return nodes.length > 0 ? nodes[0].id : null;
  };

  const startTraversal = (type: "inorder" | "preorder" | "postorder") => {
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
      case "inorder":
        inorderTraversal(rootId, result);
        break;
      case "preorder":
        preorderTraversal(rootId, result);
        break;
      case "postorder":
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

    if (searchValue.trim() === "") {
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
    setTraversalType("search");
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

  const deleteNode = (nodeId: string) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (!nodeToDelete) {
      toast({
        title: "Node not found",
        description: "The selected node does not exist",
        variant: "destructive",
      });
      return;
    }

    // Check if node has children
    if (nodeToDelete.left || nodeToDelete.right) {
      toast({
        title: "Cannot delete node",
        description: "Cannot delete a node that has children. Please delete leaf nodes only or remove children first.",
        variant: "destructive",
      });
      return;
    }

    // Remove references from parent nodes
    const updatedNodes = nodes
      .filter((n) => n.id !== nodeId)
      .map((node) => {
        if (node.left === nodeId) {
          return { ...node, left: null };
        }
        if (node.right === nodeId) {
          return { ...node, right: null };
        }
        return node;
      });

    setNodes(updatedNodes);
    resetTraversal();

    const message = `Deleted node with value ${nodeToDelete.value}`;
    addToLog(message);
    toast({
      title: "Node deleted",
      description: message,
    });
  };

  const clearTree = () => {
    setNodes([]);
    resetTraversal();
    const message = "Cleared the entire BST";
    addToLog(message);
    toast({
      title: "BST cleared",
      description: message,
    });
  };

  const calculateTreeLayout = (nodes: BSTNode[]): BSTNode[] => {
    if (nodes.length === 0) return [];

    // Find root
    const findRoot = (nodeList: BSTNode[]): BSTNode | null => {
      if (nodeList.length === 0) return null;
      for (const node of nodeList) {
        const isChild = nodeList.some((n) => n.left === node.id || n.right === node.id);
        if (!isChild) {
          return node;
        }
      }
      return nodeList[0];
    };

    const root = findRoot(nodes);
    if (!root) return nodes;

    const width = 800;
    const height = 600;
    
    // Calculate max depth
    const getDepth = (nodeId: string | null, nodeList: BSTNode[], depth: number = 0): number => {
      if (!nodeId) return depth - 1;
      const node = nodeList.find((n) => n.id === nodeId);
      if (!node) return depth - 1;
      const leftDepth = getDepth(node.left, nodeList, depth + 1);
      const rightDepth = getDepth(node.right, nodeList, depth + 1);
      return Math.max(leftDepth, rightDepth);
    };

    const maxDepth = Math.max(1, getDepth(root.id, nodes));
    const levelHeight = height / (maxDepth + 2);

    // Create updated nodes array with new positions
    const updatedNodes = nodes.map(node => ({ ...node }));

    // Create a map for efficient lookups
    const nodeMap = new Map<string, BSTNode>();
    updatedNodes.forEach(node => nodeMap.set(node.id, node));

    // Calculate positions using a better layout algorithm
    const layoutNode = (nodeId: string | null, level: number, xMin: number, xMax: number): void => {
      if (!nodeId) return;
      
      const node = nodeMap.get(nodeId);
      if (!node) return;

      // Calculate center position for this node
      const x = (xMin + xMax) / 2;
      const y = level * levelHeight + 50;

      // Update node position
      node.x = Math.max(50, Math.min(750, x));
      node.y = Math.max(50, Math.min(550, y));

      // Layout left subtree (if exists)
      if (node.left) {
        layoutNode(node.left, level + 1, xMin, x);
      }

      // Layout right subtree (if exists)
      if (node.right) {
        layoutNode(node.right, level + 1, x, xMax);
      }
    };

    // Layout the tree starting from root
    layoutNode(root.id, 0, 50, width - 50);

    return updatedNodes;
  };

  const generateTree = (n: number) => {
    if (n <= 0 || n > 15) {
      toast({
        title: "Invalid size",
        description: "Please enter a number between 1 and 15",
        variant: "destructive",
      });
      return;
    }

    // Clear existing tree
    setNodes([]);
    resetTraversal();

    // Generate n unique random values (not sorted - will be inserted in random order)
    const values = new Set<number>();
    while (values.size < n) {
      values.add(Math.floor(Math.random() * 100) + 1);
    }
    const valueArray = Array.from(values);

    // Store insertion state in ref
    insertStateRef.current = {
      rootId: null,
      insertIndex: 0,
      valueArray,
      baseTime: Date.now(),
    };

    const insertNext = () => {
      const state = insertStateRef.current;
      if (!state || state.insertIndex >= state.valueArray.length) {
        const message = `Generated BST with ${n} nodes`;
        addToLog(message);
        toast({
          title: "BST generated",
          description: message,
        });
        insertStateRef.current = null;
        return;
      }

      const key = state.valueArray[state.insertIndex];
      
      // Use functional update to ensure we have the latest nodes
      setNodes((prevNodes) => {
        // Helper function to find root node
        const findRoot = (nodes: BSTNode[]): BSTNode | null => {
          if (nodes.length === 0) return null;
          for (const node of nodes) {
            const isChild = nodes.some((n) => n.left === node.id || n.right === node.id);
            if (!isChild) {
              return node;
            }
          }
          return nodes[0];
        };

        // BST Insertion algorithm - INSERT(root, key)
        const insertNode = (rootId: string | null, key: number, nodes: BSTNode[]): { newRootId: string | null; updatedNodes: BSTNode[] } => {
          // IF root == NULL: create new node and return
          if (!rootId) {
            const nodeId = `node-${state.baseTime}-${state.insertIndex}-${key}`;
            const newNode: BSTNode = {
              id: nodeId,
              value: key,
              left: null,
              right: null,
              x: 400, // Temporary position, will be recalculated
              y: 50,
            };
            return { newRootId: nodeId, updatedNodes: [...nodes, newNode] };
          }

          const root = nodes.find((n) => n.id === rootId);
          if (!root) return { newRootId: rootId, updatedNodes: nodes };

          let updatedNodes = [...nodes];
          
          // IF key < root.key: insert in left subtree
          if (key < root.value) {
            const result = insertNode(root.left, key, updatedNodes);
            updatedNodes = result.updatedNodes;
            if (result.newRootId && !root.left) {
              const rootIndex = updatedNodes.findIndex((n) => n.id === rootId);
              updatedNodes[rootIndex] = { ...updatedNodes[rootIndex], left: result.newRootId };
            }
            return { newRootId: rootId, updatedNodes };
          } 
          // ELSE IF key > root.key: insert in right subtree
          else if (key > root.value) {
            const result = insertNode(root.right, key, updatedNodes);
            updatedNodes = result.updatedNodes;
            if (result.newRootId && !root.right) {
              const rootIndex = updatedNodes.findIndex((n) => n.id === rootId);
              updatedNodes[rootIndex] = { ...updatedNodes[rootIndex], right: result.newRootId };
            }
            return { newRootId: rootId, updatedNodes };
          }
          // if key == root.key, do nothing (no duplicates)
          return { newRootId: rootId, updatedNodes };
        };

        const currentRoot = findRoot(prevNodes);
        const currentRootId = currentRoot ? currentRoot.id : null;
        const result = insertNode(currentRootId, key, prevNodes);
        
        // Update root reference for first insertion
        if (state.insertIndex === 0 && result.newRootId) {
          state.rootId = result.newRootId;
        }
        
        // Recalculate all positions based on the tree structure
        const layoutedNodes = calculateTreeLayout(result.updatedNodes);
        
        // Log the insertion
        addToLog(`Inserting ${key} into BST...`);
        
        return layoutedNodes;
      });

      state.insertIndex++;

      // Continue inserting with a delay for animation
      if (state.insertIndex < state.valueArray.length) {
        setTimeout(insertNext, 600);
      } else {
        setTimeout(() => {
          const message = `Generated BST with ${n} nodes`;
          addToLog(message);
          toast({
            title: "BST generated",
            description: message,
          });
          insertStateRef.current = null;
        }, 100);
      }
    };

    // Start the insertion process
    insertNext();
  };

  useEffect(() => {
    if (isTraversing && currentTraversal < traversalOrder.length) {
      setHighlightedNode(traversalOrder[currentTraversal]);

      const timer = setTimeout(() => {
        if (currentTraversal < traversalOrder.length - 1) {
          setCurrentTraversal((prev) => prev + 1);
        } else {
          setIsTraversing(false);
          setHighlightedNode(null);
          if (traversalType === "search") {
            const found =
              searchValue.trim() !== "" &&
              traversalOrder.length > 0 &&
              nodes.find((n) => n.id === traversalOrder[traversalOrder.length - 1])?.value === Number(searchValue);
            const message = found ? `Found value ${searchValue} in the BST!` : `Value ${searchValue} not found in the BST`;
            addToLog(message);
            toast({
              title: found ? "Search successful" : "Search failed",
              description: message,
              variant: found ? "default" : "destructive",
            });
          } else {
            const values = traversalOrder
              .map((id) => {
                const node = nodes.find((n) => n.id === id);
                return node ? node.value : "";
              })
              .join(" -> ");
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

  return {
    state: {
      nodes,
      newValue,
      parentNode,
      childNode,
      childPosition,
      searchValue,
      traversalOrder,
      currentTraversal,
      traversalType,
      isTraversing,
      logs,
      highlightedNode,
      draggedNode,
      svgRef,
    },
    actions: {
      setNewValue,
      setParentNode,
      setChildNode,
      setChildPosition,
      setSearchValue,
      addNode,
      assignChild,
      deleteNode,
      handleMouseDown,
      startTraversal,
      startSearch,
      resetTraversal,
      clearTree,
      generateTree,
    },
  };
};
