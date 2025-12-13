import { useState, useEffect } from "react";

export interface ViterbiStep {
  timeStep: number;
  viterbiMatrix: number[][];
  pathMatrix: number[][];
  currentObservation: number;
  bestPath: number[];
  probability: number;
  description: string;
}

export const useViterbiVisualizer = () => {
  const [observations, setObservations] = useState<number[]>([0, 1, 0]);
  const [transitionMatrix, setTransitionMatrix] = useState<number[][]>([
    [0.7, 0.3],
    [0.4, 0.6],
  ]);
  const [emissionMatrix, setEmissionMatrix] = useState<number[][]>([
    [0.9, 0.1],
    [0.2, 0.8],
  ]);
  const [initialProbs, setInitialProbs] = useState<number[]>([0.6, 0.4]);
  const [viterbiSteps, setViterbiSteps] = useState<ViterbiStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customObservations, setCustomObservations] = useState("0,1,0");

  const states = ["Sunny", "Rainy"];
  const observationLabels = ["No Umbrella", "Umbrella"];

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= viterbiSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, viterbiSteps.length, speed]);

  const calculateViterbi = () => {
    const T = observations.length;
    const N = states.length;
    const steps: ViterbiStep[] = [];

    const viterbi: number[][] = Array(N)
      .fill(0)
      .map(() => Array(T).fill(0));
    const path: number[][] = Array(N)
      .fill(0)
      .map(() => Array(T).fill(0));

    for (let i = 0; i < N; i++) {
      viterbi[i][0] = initialProbs[i] * emissionMatrix[i][observations[0]];
      path[i][0] = 0;
    }

    steps.push({
      timeStep: 0,
      viterbiMatrix: viterbi.map((row) => [...row]),
      pathMatrix: path.map((row) => [...row]),
      currentObservation: observations[0],
      bestPath: [],
      probability: Math.max(...viterbi.map((row) => row[0])),
      description: `Initialize: Calculating initial probabilities for observation ${observationLabels[observations[0]]}`,
    });

    for (let t = 1; t < T; t++) {
      for (let j = 0; j < N; j++) {
        let maxProb = 0;
        let maxState = 0;

        for (let i = 0; i < N; i++) {
          const prob = viterbi[i][t - 1] * transitionMatrix[i][j] * emissionMatrix[j][observations[t]];
          if (prob > maxProb) {
            maxProb = prob;
            maxState = i;
          }
        }

        viterbi[j][t] = maxProb;
        path[j][t] = maxState;
      }

      steps.push({
        timeStep: t,
        viterbiMatrix: viterbi.map((row) => [...row]),
        pathMatrix: path.map((row) => [...row]),
        currentObservation: observations[t],
        bestPath: [],
        probability: Math.max(...viterbi.map((row) => row[t])),
        description: `Time ${t}: Computing probabilities for observation ${observationLabels[observations[t]]}`,
      });
    }

    const bestPath: number[] = Array(T).fill(0);
    let maxFinalProb = 0;
    let maxFinalState = 0;

    for (let i = 0; i < N; i++) {
      if (viterbi[i][T - 1] > maxFinalProb) {
        maxFinalProb = viterbi[i][T - 1];
        maxFinalState = i;
      }
    }

    bestPath[T - 1] = maxFinalState;

    for (let t = T - 2; t >= 0; t--) {
      bestPath[t] = path[bestPath[t + 1]][t + 1];
    }

    steps.push({
      timeStep: T,
      viterbiMatrix: viterbi.map((row) => [...row]),
      pathMatrix: path.map((row) => [...row]),
      currentObservation: -1,
      bestPath: [...bestPath],
      probability: maxFinalProb,
      description: `Backtracking: Found optimal path with probability ${maxFinalProb.toFixed(4)}`,
    });

    return steps;
  };

  const startVisualization = () => {
    const steps = calculateViterbi();
    setViterbiSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= viterbiSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    setCurrentStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= viterbiSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= viterbiSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setViterbiSteps([]);
  };

  const handleCustomObservations = () => {
    try {
      const newObs = customObservations.split(",").map((x) => parseInt(x.trim()));
      if (newObs.every((x) => x === 0 || x === 1)) {
        setObservations(newObs);
        resetVisualization();
      }
    } catch (error) {
      console.error("Invalid observation sequence");
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < viterbiSteps.length ? viterbiSteps[currentStep] : null;

  return {
    state: {
      observations,
      transitionMatrix,
      emissionMatrix,
      initialProbs,
      viterbiSteps,
      currentStep,
      isRunning,
      speed,
      customObservations,
      currentStepData,
      states,
      observationLabels,
    },
    actions: {
      setSpeed,
      setCustomObservations,
      handleCustomObservations,
      startVisualization,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      resetVisualization,
    },
  };
};
