import { useState, useEffect } from "react";

export interface TurboStep {
  step: number;
  iteration: number;
  decoder1Output: number[];
  decoder2Output: number[];
  interleavedData: number[];
  extrinsicInfo1: number[];
  extrinsicInfo2: number[];
  currentStage: string;
  description: string;
  converged: boolean;
}

export const useTurboVisualizer = () => {
  const [receivedBits, setReceivedBits] = useState<number[]>([0.7, -0.3, 0.5, -0.8, 0.2, -0.6]);
  const [turboSteps, setTurboSteps] = useState<TurboStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customInput, setCustomInput] = useState("0.7,-0.3,0.5,-0.8,0.2,-0.6");
  const [maxIterations, setMaxIterations] = useState(4);

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= turboSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, turboSteps.length, speed]);

  const calculateTurbo = (received: number[]): TurboStep[] => {
    const steps: TurboStep[] = [];
    const N = received.length;

    const interleaver = Array.from({ length: N }, (_, i) => (i * 3) % N);
    const deinterleaver = Array.from({ length: N }, (_, i) => interleaver.indexOf(i));

    let decoder1Output = new Array(N).fill(0);
    let decoder2Output = new Array(N).fill(0);
    let extrinsicInfo1 = new Array(N).fill(0);
    let extrinsicInfo2 = new Array(N).fill(0);
    let converged = false;

    steps.push({
      step: 0,
      iteration: 0,
      decoder1Output: [...decoder1Output],
      decoder2Output: [...decoder2Output],
      interleavedData: interleaver.map((i) => received[i]),
      extrinsicInfo1: [...extrinsicInfo1],
      extrinsicInfo2: [...extrinsicInfo2],
      currentStage: "Initialization",
      description: `Starting Turbo decoding with ${N} bits and interleaver pattern`,
      converged: false,
    });

    for (let iter = 1; iter <= maxIterations && !converged; iter++) {
      for (let i = 0; i < N; i++) {
        const channel = received[i];
        const apriori = extrinsicInfo2[i];
        const aposteriori = channel + apriori;
        decoder1Output[i] = Math.tanh(aposteriori / 2);
        extrinsicInfo1[i] = aposteriori - channel - apriori;
      }

      steps.push({
        step: steps.length,
        iteration: iter,
        decoder1Output: [...decoder1Output],
        decoder2Output: [...decoder2Output],
        interleavedData: interleaver.map((i) => received[i]),
        extrinsicInfo1: [...extrinsicInfo1],
        extrinsicInfo2: [...extrinsicInfo2],
        currentStage: `Iteration ${iter} - Decoder 1`,
        description: `Decoder 1 processing with extrinsic information from Decoder 2`,
        converged: false,
      });

      const interleavedExtrinsic1 = interleaver.map((i) => extrinsicInfo1[i]);

      for (let i = 0; i < N; i++) {
        const channel = received[interleaver[i]];
        const apriori = interleavedExtrinsic1[i];
        const aposteriori = channel + apriori;
        const originalIndex = deinterleaver[i];
        decoder2Output[originalIndex] = Math.tanh(aposteriori / 2);
        extrinsicInfo2[originalIndex] = aposteriori - channel - apriori;
      }

      steps.push({
        step: steps.length,
        iteration: iter,
        decoder1Output: [...decoder1Output],
        decoder2Output: [...decoder2Output],
        interleavedData: interleaver.map((i) => received[i]),
        extrinsicInfo1: [...extrinsicInfo1],
        extrinsicInfo2: [...extrinsicInfo2],
        currentStage: `Iteration ${iter} - Decoder 2`,
        description: `Decoder 2 processing with interleaved extrinsic information from Decoder 1`,
        converged: false,
      });

      let changeSum = 0;
      for (let i = 0; i < N; i++) {
        changeSum += Math.abs(decoder1Output[i] - decoder2Output[i]);
      }

      converged = changeSum < 0.1;

      steps.push({
        step: steps.length,
        iteration: iter,
        decoder1Output: [...decoder1Output],
        decoder2Output: [...decoder2Output],
        interleavedData: interleaver.map((i) => received[i]),
        extrinsicInfo1: [...extrinsicInfo1],
        extrinsicInfo2: [...extrinsicInfo2],
        currentStage: converged ? "Converged" : "Exchange Information",
        description: converged ? "Turbo decoding converged successfully!" : "Exchanging extrinsic information between decoders",
        converged,
      });

      if (converged) break;
    }

    return steps;
  };

  const startVisualization = () => {
    const steps = calculateTurbo(receivedBits);
    setTurboSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= turboSteps.length - 1) {
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
    if (step < 0 || step >= turboSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= turboSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setTurboSteps([]);
  };

  const handleCustomInput = () => {
    try {
      const newInput = customInput.split(",").map((x) => parseFloat(x.trim()));
      if (newInput.every((x) => !isNaN(x))) {
        setReceivedBits(newInput);
        resetVisualization();
      }
    } catch (error) {
      console.error("Invalid input");
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < turboSteps.length ? turboSteps[currentStep] : null;

  return {
    state: {
      receivedBits,
      turboSteps,
      currentStep,
      isRunning,
      speed,
      customInput,
      maxIterations,
      currentStepData,
    },
    actions: {
      setSpeed,
      setCustomInput,
      setMaxIterations,
      handleCustomInput,
      startVisualization,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
      resetVisualization,
    },
  };
};
