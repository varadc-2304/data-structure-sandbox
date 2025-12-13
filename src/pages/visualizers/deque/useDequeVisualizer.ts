import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useDequeVisualizer = () => {
  const [deque, setDeque] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState("");
  const [dequeSize, setDequeSize] = useState("");
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationEnd, setOperationEnd] = useState<"front" | "rear" | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationEnd(null);
  };

  const addToLog = (message: string) => {
    setLogs((prev) => [message, ...prev.slice(0, 9)]);
  };

  const addFront = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([newValue, ...deque]);
    setLastOperation("add");
    setOperationEnd("front");
    setNewElement("");

    const message = `Added "${newValue}" to the front of the deque`;
    addToLog(message);

    toast({
      title: "Element added",
      description: message,
    });
  };

  const addRear = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to add",
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setDeque([...deque, newValue]);
    setLastOperation("add");
    setOperationEnd("rear");
    setNewElement("");

    const message = `Added "${newValue}" to the rear of the deque`;
    addToLog(message);

    toast({
      title: "Element added",
      description: message,
    });
  };

  const removeFront = () => {
    if (deque.length === 0) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[0];
    setDeque(deque.slice(1));
    setLastOperation("remove");
    setOperationEnd("front");

    const message = `Removed "${removedValue}" from the front of the deque`;
    addToLog(message);

    toast({
      title: "Element removed",
      description: message,
    });
  };

  const removeRear = () => {
    if (deque.length === 0) {
      toast({
        title: "Deque underflow",
        description: "Cannot remove from an empty deque",
        variant: "destructive",
      });
      return;
    }

    const removedValue = deque[deque.length - 1];
    setDeque(deque.slice(0, -1));
    setLastOperation("remove");
    setOperationEnd("rear");

    const message = `Removed "${removedValue}" from the rear of the deque`;
    addToLog(message);

    toast({
      title: "Element removed",
      description: message,
    });
  };

  const peekFront = () => {
    if (deque.length === 0) {
      toast({
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const frontValue = deque[0];
    setLastOperation("peek");
    setOperationEnd("front");

    const message = `Peeked at front element: "${frontValue}"`;
    addToLog(message);

    toast({
      title: "Front element",
      description: `Front element is "${frontValue}"`,
    });
  };

  const peekRear = () => {
    if (deque.length === 0) {
      toast({
        title: "Empty deque",
        description: "Cannot peek into an empty deque",
        variant: "destructive",
      });
      return;
    }

    const rearValue = deque[deque.length - 1];
    setLastOperation("peek");
    setOperationEnd("rear");

    const message = `Peeked at rear element: "${rearValue}"`;
    addToLog(message);

    toast({
      title: "Rear element",
      description: `Rear element is "${rearValue}"`,
    });
  };

  const generateRandomDeque = () => {
    if (dequeSize.trim() === "" || isNaN(Number(dequeSize)) || Number(dequeSize) <= 0) {
      toast({
        title: "Invalid size",
        description: "Please enter a valid positive number for deque size",
        variant: "destructive",
      });
      return;
    }

    const size = Math.min(Number(dequeSize), 15);
    const randomDeque = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setDeque(randomDeque);
    setLastOperation(null);
    setDequeSize("");

    const message = `Generated random deque with ${size} elements: [${randomDeque.join(", ")}]`;
    addToLog(message);

    toast({
      title: "Random deque generated",
      description: `Generated random deque with ${size} elements`,
    });
  };

  useEffect(() => {
    if (lastOperation) {
      const timer = setTimeout(() => {
        resetHighlights();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastOperation, operationEnd]);

  return {
    state: {
      deque,
      newElement,
      dequeSize,
      lastOperation,
      operationEnd,
      logs,
    },
    actions: {
      setNewElement,
      setDequeSize,
      addFront,
      addRear,
      removeFront,
      removeRear,
      peekFront,
      peekRear,
      generateRandomDeque,
    },
  };
};
