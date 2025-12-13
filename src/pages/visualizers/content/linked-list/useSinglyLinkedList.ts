import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ListNode {
  id: number;
  value: number;
  next: number | null;
}

type Operation =
  | 'insert-tail'
  | 'insert-head'
  | 'insert'
  | 'delete-head'
  | 'delete-tail'
  | 'search'
  | 'traverse'
  | 'reverse'
  | null;

const MAX_LOGS = 20;
const MAX_RANDOM_SIZE = 10;

export const useSinglyLinkedList = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [newElement, setNewElement] = useState('');
  const [listSize, setListSize] = useState('');
  const [position, setPosition] = useState('');
  const [lastOperation, setLastOperation] = useState<Operation>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [headId, setHeadId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [isTraversing, setIsTraversing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (nodes.length > 0) {
      setHeadId(nodes[0].id);
    } else {
      setHeadId(null);
    }
  }, [nodes]);

  const renumber = (list: ListNode[]) =>
    list.map((n, idx) => ({ ...n, id: idx, next: idx < list.length - 1 ? idx + 1 : null }));

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, MAX_LOGS));
  };

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsTraversing(false);
  };

  const showError = (title: string, description: string) =>
    toast({
      title,
      description,
      variant: 'destructive',
    });

  const showInfo = (title: string, description: string) =>
    toast({
      title,
      description,
    });

  const validateValue = (value: string) => {
    if (value.trim() === '') {
      showError('Input required', 'Please enter a value to insert');
      return null;
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      showError('Invalid value', 'Please enter a numeric value');
      return null;
    }
    return parsed;
  };

  const insertTail = () => {
    const parsed = validateValue(newElement);
    if (parsed === null) return;

    const updated = renumber([...nodes, { id: nodes.length, value: parsed, next: null }]);
    setNodes(updated);

    setLastOperation('insert-tail');
    setOperationTarget(updated.length - 1);
    setNewElement('');

    const message = `Inserted "${parsed}" at the tail`;
    addToLog(message);
    showInfo('Element inserted', message);
  };

  const insertAtHead = () => {
    const parsed = validateValue(newElement);
    if (parsed === null) return;

    const updated = renumber([{ id: 0, value: parsed, next: nodes.length ? 1 : null }, ...nodes]);
    setNodes(updated);

    setLastOperation('insert-head');
    setOperationTarget(0);
    setNewElement('');

    const message = `Inserted "${parsed}" at the head`;
    addToLog(message);
    showInfo('Element inserted', message);
  };

  const insertAtPosition = () => {
    const parsed = validateValue(newElement);
    if (parsed === null) return;

    if (position.trim() === '' || isNaN(Number(position))) {
      showError('Invalid position', 'Please enter a valid numeric position');
      return;
    }

    const pos = Number(position);
    if (pos < 0 || pos > nodes.length) {
      showError('Out of bounds', `Position must be between 0 and ${nodes.length}`);
      return;
    }

    if (pos === 0) return insertAtHead();
    if (pos === nodes.length) return insertTail();

    const updatedNodes = [...nodes];
    updatedNodes.splice(pos, 0, { id: nodes.length, value: parsed, next: null });
    const renumbered = renumber(updatedNodes);
    setNodes(renumbered);

    setLastOperation('insert');
    setOperationTarget(pos);
    setNewElement('');
    setPosition('');

    const message = `Inserted "${parsed}" at position ${pos}`;
    addToLog(message);
    showInfo('Element inserted', message);
  };

  const deleteHead = () => {
    if (nodes.length === 0) {
      showError('Empty list', 'Cannot delete from an empty list');
      return;
    }

    const headValue = nodes[0].value;
    const newNodes = renumber(nodes.slice(1));
    setNodes(newNodes);

    setLastOperation('delete-head');
    setOperationTarget(headId);

    const message = `Deleted head element: "${headValue}"`;
    addToLog(message);
    showInfo('Head deleted', message);
  };

  const deleteTail = () => {
    if (nodes.length === 0) {
      showError('Empty list', 'Cannot delete from an empty list');
      return;
    }
    if (nodes.length === 1) {
      deleteHead();
      return;
    }

    const tailValue = nodes[nodes.length - 1].value;
    const newNodes = renumber(nodes.slice(0, -1));
    setNodes(newNodes);

    setLastOperation('delete-tail');
    setOperationTarget(nodes[nodes.length - 1].id);

    const message = `Deleted tail element: "${tailValue}"`;
    addToLog(message);
    showInfo('Tail deleted', message);
  };

  const searchElement = async () => {
    if (searchValue.trim() === '') {
      showError('Input required', 'Please enter a value to search');
      return;
    }
    const target = Number(searchValue);
    if (isNaN(target)) {
      showError('Invalid value', 'Please enter a numeric value');
      return;
    }

    setLastOperation('search');
    for (let i = 0; i < nodes.length; i++) {
      setOperationTarget(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (nodes[i].value === target) {
        const message = `Found "${target}" at position ${i}`;
        addToLog(message);
        showInfo('Element found', message);
        return;
      }
    }

    setOperationTarget(null);
    const message = `"${target}" not found in the list`;
    addToLog(message);
    showError('Element not found', message);
  };

  const traverseList = async () => {
    if (nodes.length === 0) {
      showError('Empty list', 'Nothing to traverse');
      return;
    }
    setIsTraversing(true);
    setLastOperation('traverse');
    for (let i = 0; i < nodes.length; i++) {
      setOperationTarget(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setOperationTarget(null);
    setIsTraversing(false);
    addToLog('Traversed the list forward');
  };

  const reverseList = () => {
    if (nodes.length === 0) {
      showError('Empty list', 'Cannot reverse an empty list');
      return;
    }
    const reversed = renumber([...nodes].reverse());
    setNodes(reversed);
    setLastOperation('reverse');
    setOperationTarget(null);
    const message = 'Reversed the linked list';
    addToLog(message);
    showInfo('List reversed', message);
  };

  const generateRandomList = () => {
    if (listSize.trim() === '' || isNaN(Number(listSize)) || Number(listSize) <= 0) {
      showError('Invalid size', 'Please enter a valid positive number for list size');
      return;
    }
    const size = Math.min(Number(listSize), MAX_RANDOM_SIZE);
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
    setListSize('');
    const message = `Generated random list with ${size} elements`;
    addToLog(message);
    showInfo('Random list generated', message);
  };

  const clearList = () => {
    setNodes([]);
    resetHighlights();
    setLogs([]);
    showInfo('List cleared', 'All elements have been removed from the list');
  };

  const orderedNodes = useMemo(() => {
    const ordered: ListNode[] = [];
    if (headId !== null) {
      let currentId: number | null = headId;
      const visited = new Set<number>();
      while (currentId !== null && !visited.has(currentId)) {
        const node = nodes.find((n) => n.id === currentId);
        if (node) {
          ordered.push(node);
          visited.add(currentId);
          currentId = node.next;
        } else {
          break;
        }
      }
    }
    return ordered;
  }, [headId, nodes]);

  return {
    state: {
      orderedNodes,
      lastOperation,
      operationTarget,
      listSize,
      newElement,
      position,
      searchValue,
      logs,
      isTraversing,
    },
    actions: {
      setListSize,
      setSearchValue,
      setNewElement,
      setPosition,
      insertAtHead,
      insertTail,
      insertAtPosition,
      deleteHead,
      deleteTail,
      searchElement,
      traverseList,
      reverseList,
      generateRandomList,
      clearList,
    },
  };
};
