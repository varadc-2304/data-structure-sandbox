import { useState, useEffect } from "react";

export interface FFTStep {
  step: number;
  input: number[];
  output: { real: number; imag: number }[];
  currentStage: string;
  description: string;
}

export const useFFTVisualizer = () => {
  const [inputSignal, setInputSignal] = useState<number[]>([1, 0, 1, 0, 1, 0, 1, 0]);
  const [fftSteps, setFFTSteps] = useState<FFTStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customInput, setCustomInput] = useState("1,0,1,0,1,0,1,0");

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= fftSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, fftSteps.length, speed]);

  const calculateFFT = (input: number[]): FFTStep[] => {
    const steps: FFTStep[] = [];
    const N = input.length;

    if (N <= 1) {
      const output = input.map((x) => ({ real: x, imag: 0 }));
      steps.push({
        step: 0,
        input: [...input],
        output,
        currentStage: "Base case",
        description: "Base case: N ≤ 1, return input as complex numbers",
      });
      return steps;
    }

    steps.push({
      step: 0,
      input: [...input],
      output: input.map((x) => ({ real: x, imag: 0 })),
      currentStage: "Initialization",
      description: `Starting FFT with ${N} samples`,
    });

    const output: { real: number; imag: number }[] = [];

    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;

      for (let n = 0; n < N; n++) {
        const angle = (-2 * Math.PI * k * n) / N;
        real += input[n] * Math.cos(angle);
        imag += input[n] * Math.sin(angle);
      }

      output.push({ real, imag });

      steps.push({
        step: k + 1,
        input: [...input],
        output: [...output],
        currentStage: `Computing frequency bin ${k}`,
        description: `Calculating X[${k}] = ${real.toFixed(2)} + ${imag.toFixed(2)}i`,
      });
    }

    return steps;
  };

  const startVisualization = () => {
    const steps = calculateFFT(inputSignal);
    setFFTSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= fftSteps.length - 1) {
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
    if (step < 0 || step >= fftSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= fftSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setFFTSteps([]);
  };

  const handleCustomInput = () => {
    try {
      const newInput = customInput.split(",").map((x) => parseFloat(x.trim()));
      if (newInput.every((x) => !isNaN(x))) {
        setInputSignal(newInput);
        resetVisualization();
      }
    } catch (error) {
      console.error("Invalid input signal");
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < fftSteps.length ? fftSteps[currentStep] : null;

  return {
    state: {
      inputSignal,
      fftSteps,
      currentStep,
      isRunning,
      speed,
      customInput,
      currentStepData,
    },
    actions: {
      setSpeed,
      setCustomInput,
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
