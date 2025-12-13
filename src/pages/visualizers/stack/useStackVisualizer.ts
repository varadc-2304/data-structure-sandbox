import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useStackVisualizer = () => {
  const [stack, setStack] = useState<(number | string)[]>([]);
  const [newElement, setNewElement] = useState("");
  const [stackSize, setStackSize] = useState("5");
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [operationTarget, setOperationTarget] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isViewing, setIsViewing] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [removedElements, setRemovedElements] = useState<(number | string)[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [foundValue, setFoundValue] = useState<number | string | null>(null);
  const { toast } = useToast();

  const resetHighlights = () => {
    setLastOperation(null);
    setOperationTarget(null);
    setIsViewing(false);
  };

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const pushElement = () => {
    if (newElement.trim() === "") {
      toast({
        title: "Input required",
        description: "Please enter a value to push",
        variant: "destructive",
      });
      return;
    }

    const maxSize = Number(stackSize) || 20;
    if (stack.length >= maxSize) {
      toast({
        title: "Stack overflow",
        description: `Stack is full. Maximum size is ${maxSize}`,
        variant: "destructive",
      });
      return;
    }

    const newValue = !isNaN(Number(newElement)) ? Number(newElement) : newElement;
    setStack([...stack, newValue]);
    setLastOperation("push");
    setOperationTarget(stack.length);
    setNewElement("");

    const message = `Pushed "${newValue}" to the top of the stack`;
    addToLog(message);

    toast({
      title: "Element pushed",
      description: message,
    });
  };

  const popElement = () => {
    if (stack.length === 0) {
      toast({
        title: "Stack underflow",
        description: "Cannot pop from an empty stack",
        variant: "destructive",
      });
      return;
    }

    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setLastOperation("pop");
    setOperationTarget(stack.length - 1);

    const message = `Popped "${poppedValue}" from the top of the stack`;
    addToLog(message);

    toast({
      title: "Element popped",
      description: message,
    });
  };

  const peekElement = () => {
    if (stack.length === 0) {
      toast({
        title: "Empty stack",
        description: "Cannot peek into an empty stack",
        variant: "destructive",
      });
      return;
    }

    const topValue = stack[stack.length - 1];
    setLastOperation("peek");
    setOperationTarget(stack.length - 1);

    const message = `Peeked at top element: "${topValue}"`;
    addToLog(message);

    toast({
      title: "Top element",
      description: `Top element is "${topValue}"`,
    });
  };

  const viewTopElement = () => {
    if (stack.length === 0) {
      toast({
        title: "Empty stack",
        description: "Cannot view element in an empty stack",
        variant: "destructive",
      });
      return;
    }

    setLastOperation("view");
    setOperationTarget(stack.length - 1);
    setIsViewing(true);

    const topValue = stack[stack.length - 1];
    const message = `Viewed top element: "${topValue}"`;
    addToLog(message);

    toast({
      title: "Top element viewed",
      description: `Top element is "${topValue}"`,
    });
  };

  const generateRandomStack = () => {
    const size = Number(stackSize);
    if (isNaN(size) || size < 5 || size > 20) {
      toast({
        title: "Invalid size",
        description: "Please enter a size between 5 and 20",
        variant: "destructive",
      });
      return;
    }

    const randomStack = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setStack(randomStack);
    setLastOperation(null);
    setOperationTarget(null);

    const message = `Generated random stack with ${size} elements`;
    addToLog(message);

    toast({
      title: "Random stack generated",
      description: message,
    });
  };

  const clearStack = () => {
    setStack([]);
    setLastOperation(null);
    setOperationTarget(null);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    setIsSearching(false);
    setSearchValue("");
    addToLog("Stack cleared");
    toast({
      title: "Stack cleared",
      description: "All elements have been removed from the stack",
    });
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

    if (stack.length === 0) {
      toast({
        title: "Empty stack",
        description: "Cannot search in an empty stack",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    const searchVal = !isNaN(Number(searchValue)) ? Number(searchValue) : searchValue;
    const originalStack = [...stack]; // Store original stack for restoration
    const removed: (number | string)[] = [];
    let found = false;
    let foundIdx = -1;

    // Remove elements one by one with animation
    for (let i = originalStack.length - 1; i >= 0; i--) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const element = originalStack[i];
      removed.unshift(element); // Add to front to maintain order
      setRemovedElements([...removed]);
      setStack(originalStack.slice(0, i));
      
      if (element === searchVal) {
        found = true;
        foundIdx = i;
        setFoundIndex(i);
        setFoundValue(element);
        break;
      }
    }

    if (found) {
      const positionFromTop = originalStack.length - foundIdx - 1;
      const message = `Found "${searchVal}" at position ${positionFromTop} from top`;
      addToLog(message);
      toast({
        title: "Element found",
        description: message,
      });
    } else {
      const message = `Element "${searchVal}" not found in stack`;
      addToLog(message);
      toast({
        title: "Element not found",
        description: message,
        variant: "destructive",
      });
    }

    setIsSearching(false);
  };

  const restoreStack = () => {
    if (removedElements.length === 0) return;
    
    // Restore by adding removed elements back to the stack
    // removedElements are stored with unshift, so they're in reverse order of removal
    // [first_removed, second_removed, ...] where first_removed was the top element
    // To restore correctly, we need to add them back in the original order (top to bottom)
    // Since we push to the end of array (which represents top of stack), we use removedElements as-is
    const restored = [...stack, ...removedElements];
    setStack(restored);
    setRemovedElements([]);
    setFoundIndex(null);
    setFoundValue(null);
    setSearchValue("");
    addToLog("Stack restored with all elements");
    toast({
      title: "Stack restored",
      description: "All elements have been restored to the stack",
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
      stack,
      newElement,
      stackSize,
      lastOperation,
      operationTarget,
      logs,
      isViewing,
      searchValue,
      isSearching,
      removedElements,
      foundIndex,
      foundValue,
    },
    actions: {
      setNewElement,
      setStackSize,
      pushElement,
      popElement,
      peekElement,
      viewTopElement,
      generateRandomStack,
      clearStack,
      setSearchValue,
      searchElement,
      restoreStack,
    },
  };
};
