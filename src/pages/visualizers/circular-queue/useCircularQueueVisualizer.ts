import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useCircularQueueVisualizer = () => {
  const [queue, setQueue] = useState<(number | string | null)[]>([]);
  const [maxSize, setMaxSize] = useState<number>(10);
  const [front, setFront] = useState<number>(-1);
  const [rear, setRear] = useState<number>(-1);
  const [newElement, setNewElement] = useState("");
  const [queueSize, setQueueSize] = useState("");
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (maxSize > 0) {
      setQueue(Array(maxSize).fill(null));
      setFront(-1);
      setRear(-1);
    }
  }, [maxSize]);

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const isEmpty = (): boolean => {
    return front === -1;
  };

  const isFull = (): boolean => {
    return (rear + 1) % maxSize === front;
  };

  const getSize = (): number => {
    if (isEmpty()) return 0;
    if (front <= rear) {
      return rear - front + 1;
    }
    return maxSize - front + rear + 1;
  };

  const enqueueElement = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to enqueue",
        variant: "destructive",
      });
      return;
    }

    if (isFull()) {
      toast({
        title: "Queue overflow",
        description: `Cannot enqueue. Queue is full (max size: ${maxSize})`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    const newQueue = [...queue];

    if (isEmpty()) {
      setFront(0);
      setRear(0);
      newQueue[0] = newValue;
    } else {
      setRear((rear + 1) % maxSize);
      newQueue[(rear + 1) % maxSize] = newValue;
    }

    setQueue(newQueue);
    setLastOperation("enqueue");
    setOperationTarget(rear === -1 ? 0 : (rear + 1) % maxSize);
    setNewElement("");

    const message = `Enqueued "${newValue}" at position ${rear === -1 ? 0 : (rear + 1) % maxSize}`;
    addToLog(message);

    toast({
      title: "Element enqueued",
      description: message,
    });
  };

  const dequeueElement = () => {
    if (isEmpty()) {
      toast({
        title: "Queue underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive",
      });
      return;
    }

    const dequeuedValue = queue[front];
    const newQueue = [...queue];
    newQueue[front] = null;

    if (front === rear) {
      setFront(-1);
      setRear(-1);
    } else {
      setFront((front + 1) % maxSize);
    }

    setQueue(newQueue);
    setLastOperation("dequeue");
    setOperationTarget(front);

    const message = `Dequeued "${dequeuedValue}" from position ${front}`;
    addToLog(message);

    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekFront = () => {
    if (isEmpty()) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const frontValue = queue[front];
    setLastOperation("peek");
    setOperationTarget(front);

    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);

    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
    });
  };

  const peekRear = () => {
    if (isEmpty()) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const rearValue = queue[rear];
    setLastOperation("peek-rear");
    setOperationTarget(rear);

    const message = `Peeked at rear element: "${rearValue}"`;
    addToLog(message);

    toast({
      title: "Rear element",
      description: `Rear element is "${rearValue}"`,
    });
  };

  const generateRandomQueue = () => {
    if (queueSize.trim() === "" || isNaN(Number(queueSize)) || Number(queueSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for queue size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(queueSize), maxSize);
    const randomQueue = Array(maxSize).fill(null);
    let newFront = 0;
    let newRear = size - 1;

    for (let i = 0; i < size; i++) {
      randomQueue[i] = Math.floor(Math.random() * 100);
    }

    setQueue(randomQueue);
    setFront(newFront);
    setRear(newRear);
    setLastOperation(null);
    setQueueSize("");

    const message = `Generated random circular queue with ${size} elements`;
    addToLog(message);

    toast({
      title: "Random queue generated",
      description: `Generated random circular queue with ${size} elements`,
    });
  };

  const clearQueue = () => {
    setQueue(Array(maxSize).fill(null));
    setFront(-1);
    setRear(-1);
    setLastOperation(null);
    setOperationTarget(null);
    setLogs([]);

    toast({
      title: "Queue cleared",
      description: "All elements have been removed from the queue",
    });
  };

  useEffect(() => {
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation]);

  return {
    state: {
      queue,
      maxSize,
      front,
      rear,
      newElement,
      queueSize,
      lastOperation,
      operationTarget,
      logs,
    },
    actions: {
      setMaxSize,
      setNewElement,
      setQueueSize,
      enqueueElement,
      dequeueElement,
      peekFront,
      peekRear,
      generateRandomQueue,
      clearQueue,
      isEmpty,
      isFull,
      getSize,
    },
  };
};
