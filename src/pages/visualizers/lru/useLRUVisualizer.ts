import { useState, useEffect } from "react";

export interface PageFrame {
  id: number;
  page: number | null;
  lastUsed: number;
  loaded: boolean;
  highlight: boolean;
}

export interface ReferenceHistory {
  page: number;
  fault: boolean;
}

export interface SimulationState {
  frames: PageFrame[];
  faults: number;
  hits: number;
  history: ReferenceHistory[];
}

export const useLRUVisualizer = () => {
  const [pageReferences, setPageReferences] = useState<number[]>([]);
  const [inputReference, setInputReference] = useState<string>("");
  const [framesCount, setFramesCount] = useState<number>(3);
  const [frames, setFrames] = useState<PageFrame[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [pageFaults, setPageFaults] = useState<number>(0);
  const [pageHits, setPageHits] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [referenceHistory, setReferenceHistory] = useState<ReferenceHistory[]>([]);
  const [simulationHistory, setSimulationHistory] = useState<SimulationState[]>([]);

  const initializeFrames = (count: number): PageFrame[] => {
    return Array(count)
      .fill(null)
      .map((_, index) => ({
        id: index,
        page: null,
        lastUsed: 0,
        loaded: false,
        highlight: false,
      }));
  };

  useEffect(() => {
    const newFrames = initializeFrames(framesCount);
    setFrames(newFrames);
    resetSimulation();
  }, [framesCount]);

  useEffect(() => {
    if (!isPlaying || currentStep >= pageReferences.length - 1) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, pageReferences.length, speed]);

  const handleAddReference = () => {
    if (!inputReference.trim()) return;

    try {
      const newReferences = inputReference
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((ref) => {
          const parsedRef = parseInt(ref.trim());
          if (isNaN(parsedRef) || parsedRef < 0) {
            throw new Error("Invalid reference");
          }
          return parsedRef;
        });

      setPageReferences([...pageReferences, ...newReferences]);
      setInputReference("");
    } catch (error) {
      console.error("Invalid reference format");
    }
  };

  const handleRemoveReference = (index: number) => {
    const newReferences = pageReferences.filter((_, idx) => idx !== index);
    setPageReferences(newReferences);
    if (newReferences.length === 0) {
      resetSimulation();
    }
  };

  const resetSimulation = () => {
    setCurrentStep(-1);
    setPageFaults(0);
    setPageHits(0);
    setIsPlaying(false);
    setReferenceHistory([]);
    setSimulationHistory([]);
    const resetFrames = initializeFrames(framesCount);
    setFrames(resetFrames);
  };

  const simulateStep = (
    stepIndex: number,
    currentFrames: PageFrame[],
    currentFaults: number,
    currentHits: number,
    currentHistory: ReferenceHistory[]
  ): SimulationState | null => {
    if (stepIndex >= pageReferences.length) return null;

    const pageRef = pageReferences[stepIndex];
    const pageInFrames = currentFrames.findIndex((frame) => frame.page === pageRef);

    let newFrames = currentFrames.map((frame) => ({ ...frame, highlight: false }));
    let newFaults = currentFaults;
    let newHits = currentHits;

    if (pageInFrames !== -1) {
      newFrames[pageInFrames] = {
        ...newFrames[pageInFrames],
        lastUsed: stepIndex,
        highlight: true,
      };
      newHits++;
    } else {
      const emptyFrameIndex = newFrames.findIndex((frame) => !frame.loaded);

      if (emptyFrameIndex !== -1) {
        newFrames[emptyFrameIndex] = {
          ...newFrames[emptyFrameIndex],
          page: pageRef,
          lastUsed: stepIndex,
          loaded: true,
          highlight: true,
        };
      } else {
        let lruIndex = 0;
        for (let i = 1; i < newFrames.length; i++) {
          if (newFrames[i].lastUsed < newFrames[lruIndex].lastUsed) {
            lruIndex = i;
          }
        }

        newFrames[lruIndex] = {
          ...newFrames[lruIndex],
          page: pageRef,
          lastUsed: stepIndex,
          highlight: true,
        };
      }
      newFaults++;
    }

    const newHistory = [...currentHistory, { page: pageRef, fault: pageInFrames === -1 }];

    return {
      frames: newFrames,
      faults: newFaults,
      hits: newHits,
      history: newHistory,
    };
  };

  const nextStep = () => {
    if (currentStep >= pageReferences.length - 1) {
      setIsPlaying(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    const result = simulateStep(nextStepIndex, frames, pageFaults, pageHits, referenceHistory);

    if (result) {
      setFrames(result.frames);
      setPageFaults(result.faults);
      setPageHits(result.hits);
      setReferenceHistory(result.history);
      setCurrentStep(nextStepIndex);

      const newHistory = [...simulationHistory];
      newHistory[nextStepIndex] = result;
      setSimulationHistory(newHistory);
    }
  };

  const previousStep = () => {
    if (currentStep <= -1) return;

    const prevStepIndex = currentStep - 1;

    if (prevStepIndex === -1) {
      resetSimulation();
      return;
    }

    const prevState = simulationHistory[prevStepIndex];
    if (prevState) {
      setFrames(prevState.frames);
      setPageFaults(prevState.faults);
      setPageHits(prevState.hits);
      setReferenceHistory(prevState.history);
      setCurrentStep(prevStepIndex);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < -1 || stepIndex >= pageReferences.length) return;

    if (stepIndex === -1) {
      resetSimulation();
      return;
    }

    let currentFrames = initializeFrames(framesCount);
    let currentFaults = 0;
    let currentHits = 0;
    let currentHistory: ReferenceHistory[] = [];

    for (let i = 0; i <= stepIndex; i++) {
      const result = simulateStep(i, currentFrames, currentFaults, currentHits, currentHistory);
      if (result) {
        currentFrames = result.frames;
        currentFaults = result.faults;
        currentHits = result.hits;
        currentHistory = result.history;
      }
    }

    setFrames(currentFrames);
    setPageFaults(currentFaults);
    setPageHits(currentHits);
    setReferenceHistory(currentHistory);
    setCurrentStep(stepIndex);
  };

  const togglePlayPause = () => {
    if (currentStep >= pageReferences.length - 1) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const fastForward = () => {
    goToStep(pageReferences.length - 1);
  };

  const rewind = () => {
    resetSimulation();
  };

  return {
    state: {
      pageReferences,
      inputReference,
      framesCount,
      frames,
      currentStep,
      pageFaults,
      pageHits,
      isPlaying,
      speed,
      referenceHistory,
    },
    actions: {
      setInputReference,
      setFramesCount,
      setSpeed,
      handleAddReference,
      handleRemoveReference,
      resetSimulation,
      nextStep,
      previousStep,
      goToStep,
      togglePlayPause,
      fastForward,
      rewind,
    },
  };
};
