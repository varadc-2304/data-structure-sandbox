import { useState, useEffect } from "react";

export const useOptimalVisualizer = () => {
  const [frames, setFrames] = useState(3);
  const [referenceString, setReferenceString] = useState<number[]>([1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [newPage, setNewPage] = useState("");
  const [memory, setMemory] = useState<(number | null)[]>([]);
  const [pageFaults, setPageFaults] = useState(0);
  const [pageHits, setPageHits] = useState(0);

  const initializeSimulation = () => {
    setMemory(new Array(frames).fill(null));
    setCurrentStep(0);
    setPageFaults(0);
    setPageHits(0);
    setIsRunning(false);
  };

  const addPage = () => {
    if (newPage && !isNaN(Number(newPage))) {
      setReferenceString([...referenceString, Number(newPage)]);
      setNewPage("");
    }
  };

  const removePage = (index: number) => {
    const newString = referenceString.filter((_, i) => i !== index);
    setReferenceString(newString);
    if (currentStep >= newString.length) {
      setCurrentStep(Math.max(0, newString.length - 1));
    }
  };

  const findOptimalPageToReplace = (currentIndex: number, currentMemory: (number | null)[]) => {
    let farthestIndex = -1;
    let pageToReplace = 0;

    for (let i = 0; i < currentMemory.length; i++) {
      const page = currentMemory[i];
      if (page === null) continue;

      let nextUse = referenceString.length;
      for (let j = currentIndex + 1; j < referenceString.length; j++) {
        if (referenceString[j] === page) {
          nextUse = j;
          break;
        }
      }

      if (nextUse > farthestIndex) {
        farthestIndex = nextUse;
        pageToReplace = i;
      }
    }

    return pageToReplace;
  };

  useEffect(() => {
    initializeSimulation();
  }, [frames, referenceString]);

  useEffect(() => {
    if (!isRunning || currentStep >= referenceString.length) return;

    const timer = setTimeout(() => {
      const page = referenceString[currentStep];
      const newMemory = [...memory];
      let newPageFaults = pageFaults;
      let newPageHits = pageHits;

      if (newMemory.includes(page)) {
        newPageHits++;
      } else {
        newPageFaults++;
        const emptyIndex = newMemory.findIndex((frame) => frame === null);

        if (emptyIndex !== -1) {
          newMemory[emptyIndex] = page;
        } else {
          const replaceIndex = findOptimalPageToReplace(currentStep, newMemory);
          newMemory[replaceIndex] = page;
        }
      }

      setMemory(newMemory);
      setPageFaults(newPageFaults);
      setPageHits(newPageHits);
      setCurrentStep(currentStep + 1);

      if (currentStep + 1 >= referenceString.length) {
        setIsRunning(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, memory, pageFaults, pageHits, referenceString]);

  const toggleSimulation = () => {
    if (currentStep >= referenceString.length) {
      initializeSimulation();
    }
    setIsRunning(!isRunning);
  };

  const hitRate = referenceString.length > 0 ? ((pageHits / Math.max(currentStep, 1)) * 100).toFixed(1) : "0.0";
  const faultRate = referenceString.length > 0 ? ((pageFaults / Math.max(currentStep, 1)) * 100).toFixed(1) : "0.0";

  return {
    state: {
      frames,
      referenceString,
      currentStep,
      isRunning,
      newPage,
      memory,
      pageFaults,
      pageHits,
      hitRate,
      faultRate,
    },
    actions: {
      setFrames,
      setNewPage,
      addPage,
      removePage,
      toggleSimulation,
      initializeSimulation,
    },
  };
};
