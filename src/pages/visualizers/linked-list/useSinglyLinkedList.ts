import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface ListNode {
  id: number;
  value: number;
  next: number | null;
}

export type LinkedListOperation =
  | "insert-tail"
  | "insert-head"
  | "insert"
  | "delete-head"
  | "delete-tail"
  | "search"
  | "traverse"
  | "reverse";

export const useSinglyLinkedList = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [newElement, setNewElement] = useState("");
  const [listSize, setListSize] = useState("");
  const [position, setPosition] = useState("");
  const [lastOperation, setLastOperation] = useState<LinkedListOperation | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [headId, setHeadId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isTraversing, setIsTraversing] = useState(false);
  const [highlightedArrow, setHighlightedArrow] = useState<number | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (nodes.length > 0) {
      setHeadId(nodes[0].id);
    } else {
      setHeadId(null);
    }
  }, [nodes]);

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsTraversing(false);
    setHighlightedArrow(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const renumber = (list: ListNode[]) =>
    list.map((n, idx) => ({ ...n, id: idx, next: idx < list.length - 1 ? idx + 1 : null }));

  const getNodeById = (id: number): ListNode | undefined => nodes.find((n) => n.id === id);

  const orderedNodes: ListNode[] = useMemo(() => {
    const result: ListNode[] = [];
    if (headId === null) return result;

    let currentId: number | null = headId;
    const visited = new Set<number>();

    while (currentId !== null && !visited.has(currentId)) {
      const node = getNodeById(currentId);
      if (!node) break;
      result.push(node);
      visited.add(currentId);
      currentId = node.next;
    }
    return result;
  }, [headId, nodes]);

  const insertTail = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    const updated = renumber([...nodes, { id: nodes.length, value: newValue, next: null }]);
    setNodes(updated);

    setLastOperation("insert-tail");
    setOperationTarget(updated.length - 1);
    setNewElement("");

    const message = `Inserted "${newValue}" at the tail`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
  };

  const insertAtHead = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    const updated = renumber([{ id: 0, value: newValue, next: nodes.length ? 1 : null }, ...nodes]);
    setNodes(updated);

    setLastOperation("insert-head");
    setOperationTarget(0);
    setNewElement("");

    const message = `Inserted "${newValue}" at the head of the list`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
  };

  const insertAtPosition = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to insert",
        variant: "destructive",
      });
      return;
    }

    if (position.trim() === "" || isNaN(Number(position))) {
      toast({
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);

    if (pos < 0 || pos > nodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${nodes.length}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = Number(newElement);
    if (isNaN(newValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    if (pos === 0) {
      insertAtHead();
      return;
    }
    if (pos === nodes.length) {
      insertTail();
      return;
    }

    const updatedNodes = [...nodes];
    updatedNodes.splice(pos, 0, { id: nodes.length, value: newValue, next: null });
    const renumbered = renumber(updatedNodes);
    setNodes(renumbered);

    setLastOperation("insert");
    setOperationTarget(pos);
    setNewElement("");
    setPosition("");

    const message = `Inserted "${newValue}" at position ${pos}`;
    addToLog(message);
    toast({ title: "Element inserted", description: message });
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    const headValue = nodes[0].value;
    const newNodes = renumber(nodes.slice(1));
    setNodes(newNodes);

    setLastOperation("delete-head");
    setOperationTarget(headId);

    const message = `Deleted head element: "${headValue}"`;
    addToLog(message);
    toast({ title: "Head deleted", description: message });
  };

  const deleteTail = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot delete from an empty list",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 1) {
      deleteHead();
      return;
    }

    const tailValue = nodes[nodes.length - 1].value;
    const newNodes = renumber(nodes.slice(0, -1));
    setNodes(newNodes);

    setLastOperation("delete-tail");
    setOperationTarget(nodes[nodes.length - 1].id);

    const message = `Deleted tail element: "${tailValue}"`;
    addToLog(message);
    toast({ title: "Tail deleted", description: message });
  };

  const deleteAtPosition = () => {
    if (position.trim() === "" || isNaN(Number(position))) {
      toast({
        title: "Invalid position",
        description: "Please enter a valid numeric position",
        variant: "destructive",
      });
      return;
    }

    const pos = Number(position);

    if (pos < 0 || pos >= nodes.length) {
      toast({
        title: "Out of bounds",
        description: `Position must be between 0 and ${nodes.length - 1}`,
        variant: "destructive",
      });
      return;
    }

    if (pos === 0) {
      deleteHead();
      return;
    }
    if (pos === nodes.length - 1) {
      deleteTail();
      return;
    }

    const deletedValue = nodes[pos].value;
    const newNodes = renumber(nodes.filter((_, idx) => idx !== pos));
    setNodes(newNodes);

    setLastOperation("delete");
    setOperationTarget(pos);
    setPosition("");

    const message = `Deleted "${deletedValue}" from position ${pos}`;
    addToLog(message);
    toast({ title: "Element deleted", description: message });
  };

  const searchElement = async () => {
    if (searchValue.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to search",
        variant: "destructive",
      });
      return;
    }

    const target = Number(searchValue);
    if (isNaN(target)) {
      toast({
        title: "Invalid value",
        description: "Please enter a numeric value",
        variant: "destructive",
      });
      return;
    }

    setLastOperation("search");

    for (let i = 0; i < nodes.length; i++) {
      setOperationTarget(i);
      // delay for visualization
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (nodes[i].value === target) {
        const message = `Found "${target}" at position ${i}`;
        addToLog(message);
        toast({ title: "Element found", description: message });
        return;
      }
    }

    setOperationTarget(null);
    const message = `"${target}" not found in the list`;
    addToLog(message);
    toast({ title: "Element not found", description: message, variant: "destructive" });
  };

  const traverseList = async () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Nothing to traverse",
        variant: "destructive",
      });
      return;
    }
    setIsTraversing(true);
    setLastOperation("traverse");
    for (let i = 0; i < nodes.length; i++) {
      // Highlight node first
      setOperationTarget(i);
      setHighlightedArrow(null);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Then highlight arrow (if not last node)
      if (i < nodes.length - 1) {
        setHighlightedArrow(i);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }
    setOperationTarget(null);
    setHighlightedArrow(null);
    setIsTraversing(false);
    addToLog("Traversed the list forward");
  };

  const reverseList = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty list",
        description: "Cannot reverse an empty list",
        variant: "destructive",
      });
      return;
    }

    const reversed = renumber([...nodes].reverse());
    setNodes(reversed);
    setLastOperation("reverse");
    setOperationTarget(null);

    const message = "Reversed the linked list";
    addToLog(message);
    toast({ title: "List reversed", description: message });
  };

  const generateRandomList = () => {
    if (listSize.trim() === "" || isNaN(Number(listSize)) || Number(listSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for list size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(listSize), 10);
    const newNodes: ListNode[] = [];

    for (let i = 0; i < size; i++) {
      newNodes.push({
        id: i,
        value: Math.floor(Math.random() * 100),
        next: i < size - 1 ? i + 1 : null,
      });
    }

    setNodes(newNodes);
    resetHighlights();
    setListSize("");

    const message = `Generated random list with ${size} elements`;
    addToLog(message);
    toast({ title: "Random list generated", description: message });
  };

  const clearList = () => {
    setNodes([]);
    resetHighlights();
    setLogs([]);
    toast({
      title: "List cleared",
      description: "All elements have been removed from the list",
    });
  };

  return {
    state: {
      nodes,
      orderedNodes,
      headId,
      logs,
      newElement,
      listSize,
      position,
      searchValue,
      isTraversing,
      lastOperation,
      operationTarget,
      highlightedArrow,
    },
    actions: {
      setNewElement,
      setListSize,
      setPosition,
      setSearchValue,
      insertAtHead,
      insertTail,
      insertAtPosition,
      deleteHead,
      deleteTail,
      deleteAtPosition,
      searchElement,
      traverseList,
      reverseList,
      generateRandomList,
      clearList,
    },
  };
};

