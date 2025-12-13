import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useQueueVisualizer = () => {
  const [queue, setQueue] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState("");
  const [queueSize, setQueueSize] = useState("");
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
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

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setQueue([...queue, newValue]);
    setLastOperation("enqueue");
    setNewElement("");

    const message = `Enqueued "${newValue}" to the back of the queue`;
    addToLog(message);

    toast({
      title: "Element enqueued",
      description: message,
    });
  };

  const dequeueElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Queue underflow",
        description: "Cannot dequeue from an empty queue",
        variant: "destructive",
      });
      return;
    }

    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setLastOperation("dequeue");

    const message = `Dequeued "${dequeuedValue}" from the front of the queue`;
    addToLog(message);

    toast({
      title: "Element dequeued",
      description: message,
    });
  };

  const peekElement = () => {
    if (queue.length === 0) {
      toast({
        title: "Empty queue",
        description: "Cannot peek into an empty queue",
        variant: "destructive",
      });
      return;
    }

    const frontValue = queue[0];
    setLastOperation("peek");

    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);

    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
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

    const size = Math.min(Number(queueSize), 15);
    const randomQueue = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setQueue(randomQueue);
    setLastOperation(null);
    setQueueSize("");

    const message = `Generated random queue with ${size} elements: [${randomQueue.join(", ")}]`;
    addToLog(message);

    toast({
      title: "Random queue generated",
      description: `Generated random queue with ${size} elements`,
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
      newElement,
      queueSize,
      lastOperation,
      logs,
    },
    actions: {
      setNewElement,
      setQueueSize,
      enqueueElement,
      dequeueElement,
      peekElement,
      generateRandomQueue,
    },
  };
};
