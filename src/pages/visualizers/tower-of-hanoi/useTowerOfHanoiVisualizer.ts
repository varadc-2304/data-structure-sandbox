import { useEffect, useState } from "react";

export interface HanoiStep {
  towers: number[][];
  movingDisk: number | null;
  fromTower: number | null;
  toTower: number | null;
  isInTransit?: boolean; // true when disc is moving between towers
}

export const useTowerOfHanoiVisualizer = () => {
  const [numDisks, setNumDisks] = useState<number>(3);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [hanoiSteps, setHanoiSteps] = useState<HanoiStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [movingDisk, setMovingDisk] = useState<number | null>(null);
  const [fromTower, setFromTower] = useState<number | null>(null);
  const [toTower, setToTower] = useState<number | null>(null);
  const [isInTransit, setIsInTransit] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    generateTowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDisks]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= hanoiSteps.length - 1) {
      setIsRunning(false);
      // Ensure final state is correct - place any disc that might be in transit
      const finalStep = hanoiSteps[hanoiSteps.length - 1];
      if (finalStep?.isInTransit && finalStep.movingDisk !== null && finalStep.toTower !== null) {
        // Wait for animation to complete, then place disc
        setTimeout(() => {
          setTowers((prevTowers) => {
            const newTowers = prevTowers.map((t) => [...t]);
            if (!newTowers[finalStep.toTower].includes(finalStep.movingDisk)) {
              newTowers[finalStep.toTower].push(finalStep.movingDisk);
              newTowers[finalStep.toTower].sort((a, b) => b - a);
            }
            return newTowers;
          });
          setIsInTransit(false);
          setMovingDisk(null);
          setFromTower(null);
          setToTower(null);
        }, 1500 / speed);
      }
      return;
    }
    const currentStepData = hanoiSteps[currentStep];
    // If disc is in transit, wait for animation to complete, then place it and move to next step
    if (currentStepData?.isInTransit && currentStepData.movingDisk !== null && currentStepData.toTower !== null) {
      // Wait for animation duration, then place disc in destination and move to next step
      const stepTimer = setTimeout(() => {
        // Place disc in destination
        setTowers((prevTowers) => {
          const newTowers = prevTowers.map((t) => [...t]);
          // Check if disc is already there to avoid duplicates
          if (!newTowers[currentStepData.toTower].includes(currentStepData.movingDisk)) {
            newTowers[currentStepData.toTower].push(currentStepData.movingDisk);
            // Sort to ensure correct order (largest at bottom)
            newTowers[currentStepData.toTower].sort((a, b) => b - a);
          }
          return newTowers;
        });
        setIsInTransit(false);
        // Small delay before moving to next step to show disc placed
        setTimeout(() => {
          nextStep();
        }, 100);
      }, 1500 / speed); // Animation duration
      
      return () => {
        clearTimeout(stepTimer);
      };
    } else {
      // Normal step transition
      const timer = setTimeout(() => {
        nextStep();
      }, 1500 / speed);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, currentStep, hanoiSteps.length, speed]);

  const generateTowers = () => {
    const initialTowers: number[][] = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    setHanoiSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setMovingDisk(null);
    setFromTower(null);
    setToTower(null);
    setIsInTransit(false);
    setMoves(0);
  };

  const resetTowers = () => {
    const initialTowers: number[][] = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    setHanoiSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setMovingDisk(null);
    setFromTower(null);
    setToTower(null);
    setIsInTransit(false);
    setMoves(0);
  };

  const calculateHanoiSteps = (n: number, sourceTower: number, destTower: number, auxTower: number): HanoiStep[] => {
    const steps: HanoiStep[] = [];
    const towersCopy: number[][] = [[], [], []];
    for (let i = n; i > 0; i--) {
      towersCopy[sourceTower].push(i);
    }

    // Add initial step
    steps.push({
      towers: towersCopy.map((t) => [...t]),
      movingDisk: null,
      fromTower: null,
      toTower: null,
      isInTransit: false,
    });

    const hanoi = (n: number, source: number, dest: number, aux: number) => {
      if (n === 1) {
        const disk = towersCopy[source].pop()!;
        // Single step: disc removed from source, will be placed in destination after animation
        // The disc is NOT in destination array yet - it will be added after animation completes
        steps.push({
          towers: towersCopy.map((t) => [...t]), // Disc NOT in destination yet
          movingDisk: disk,
          fromTower: source,
          toTower: dest,
          isInTransit: true, // Animation in progress
        });
        // Now place it in destination for the final state
        towersCopy[dest].push(disk);
        return;
      }
      hanoi(n - 1, source, aux, dest);
      const disk = towersCopy[source].pop()!;
      // Single step: disc removed from source, will be placed in destination after animation
      steps.push({
        towers: towersCopy.map((t) => [...t]), // Disc NOT in destination yet
        movingDisk: disk,
        fromTower: source,
        toTower: dest,
        isInTransit: true, // Animation in progress
      });
      // Now place it in destination for the final state
      towersCopy[dest].push(disk);
      hanoi(n - 1, aux, dest, source);
    };

    hanoi(n, sourceTower, destTower, auxTower);
    return steps;
  };

  const startHanoi = () => {
    if (numDisks === 0 || isRunning) return;
    resetTowers();
    const steps = calculateHanoiSteps(numDisks, 0, 2, 1);
    setHanoiSteps(steps);
    setMoves(steps.length);
    if (steps.length > 0) {
      setCurrentStep(0);
      applyStep(0);
    }
    setIsRunning(true);
  };

  const applyStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= hanoiSteps.length) return;
    const step = hanoiSteps[stepIndex];
    // Always use the towers from the step (which should have disc NOT in destination during transit)
    const towersCopy = step.towers.map((t) => [...t]);
    // Ensure discs are sorted correctly (largest at bottom) in each tower
    towersCopy.forEach((tower) => {
      tower.sort((a, b) => b - a);
    });
    setTowers(towersCopy);
    setMovingDisk(step.movingDisk);
    setFromTower(step.fromTower);
    setToTower(step.toTower);
    setIsInTransit(step.isInTransit ?? false);
    setCurrentStep(stepIndex);
  };

  const nextStep = () => {
    if (currentStep >= hanoiSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    applyStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    applyStep(currentStep - 1);
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= hanoiSteps.length) return;
    setIsRunning(false);
    applyStep(stepIndex);
  };

  const togglePlayPause = () => {
    if (hanoiSteps.length === 0) {
      startHanoi();
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  return {
    state: {
      numDisks,
      towers,
      hanoiSteps,
      currentStep,
      isRunning,
      speed,
      movingDisk,
      fromTower,
      toTower,
      isInTransit,
      moves,
    },
    actions: {
      setNumDisks,
      setSpeed,
      generateTowers,
      resetTowers,
      startHanoi,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      setIsRunning,
    },
  };
};
