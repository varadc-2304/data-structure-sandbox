import { useEffect, useState } from "react";

export interface HanoiStep {
  towers: number[][];
  movingDisk: number | null;
  fromTower: number | null;
  toTower: number | null;
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
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    generateTowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDisks]);

  useEffect(() => {
    if (!isRunning) return;
    if (currentStep >= hanoiSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    const timer = setTimeout(() => {
      nextStep();
    }, 1500 / speed);
    return () => clearTimeout(timer);
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
    setMoves(0);
  };

  const calculateHanoiSteps = (n: number, sourceTower: number, destTower: number, auxTower: number): HanoiStep[] => {
    const steps: HanoiStep[] = [];
    const towersCopy: number[][] = [[], [], []];
    for (let i = n; i > 0; i--) {
      towersCopy[sourceTower].push(i);
    }

    const hanoi = (n: number, source: number, dest: number, aux: number) => {
      if (n === 1) {
        const disk = towersCopy[source].pop()!;
        towersCopy[dest].push(disk);
        steps.push({
          towers: towersCopy.map((t) => [...t]),
          movingDisk: disk,
          fromTower: source,
          toTower: dest,
        });
        return;
      }
      hanoi(n - 1, source, aux, dest);
      const disk = towersCopy[source].pop()!;
      towersCopy[dest].push(disk);
      steps.push({
        towers: towersCopy.map((t) => [...t]),
        movingDisk: disk,
        fromTower: source,
        toTower: dest,
      });
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
    setIsRunning(true);
  };

  const applyStep = (stepIndex: number) => {
    const step = hanoiSteps[stepIndex];
    setTowers(step.towers.map((t) => [...t]));
    setMovingDisk(step.movingDisk);
    setFromTower(step.fromTower);
    setToTower(step.toTower);
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
    if (currentStep <= 0) return;
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
    },
  };
};
