import { useState, useEffect } from "react";

export interface LDPCStep {
  step: number;
  iteration: number;
  variableNodes: number[];
  checkNodes: number[];
  messages: { from: number; to: number; value: number }[];
  currentStage: string;
  description: string;
  decoded: boolean;
}

export const useLDPCVisualizer = () => {
  const [receivedBits, setReceivedBits] = useState<number[]>([0.8, -0.5, 0.3, -0.7, 0.9, -0.2]);
  const [ldpcSteps, setLDPCSteps] = useState<LDPCStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customInput, setCustomInput] = useState("0.8,-0.5,0.3,-0.7,0.9,-0.2");
  const [maxIterations, setMaxIterations] = useState(5);

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= ldpcSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, ldpcSteps.length, speed]);

  const calculateLDPC = (received: number[]): LDPCStep[] => {
    const steps: LDPCStep[] = [];
    const N = received.length;
    const M = Math.ceil(N / 2);

    const H = [
      [1, 1, 0, 1, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1],
    ];

    let variableNodes = [...received];
    let decoded = false;

    steps.push({
      step: 0,
      iteration: 0,
      variableNodes: [...variableNodes],
      checkNodes: new Array(M).fill(0),
      messages: [],
      currentStage: "Initialization",
      description: `Starting LDPC decoding with ${N} variable nodes and ${M} check nodes`,
      decoded: false,
    });

    for (let iter = 1; iter <= maxIterations && !decoded; iter++) {
      const messages: { from: number; to: number; value: number }[] = [];

      for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
          if (H[j] && H[j][i] === 1) {
            const message = Math.tanh(variableNodes[i] / 2);
            messages.push({ from: i, to: j + N, value: message });
          }
        }
      }

      steps.push({
        step: steps.length,
        iteration: iter,
        variableNodes: [...variableNodes],
        checkNodes: new Array(M).fill(0),
        messages: [...messages],
        currentStage: `Iteration ${iter} - Variable to Check`,
        description: `Sending messages from variable nodes to check nodes`,
        decoded: false,
      });

      const checkMessages: { from: number; to: number; value: number }[] = [];

      for (let j = 0; j < M; j++) {
        for (let i = 0; i < N; i++) {
          if (H[j] && H[j][i] === 1) {
            let product = 1;
            for (let k = 0; k < N; k++) {
              if (k !== i && H[j][k] === 1) {
                product *= Math.tanh(variableNodes[k] / 2);
              }
            }
            const message = 2 * Math.atanh(Math.max(-0.99, Math.min(0.99, product)));
            checkMessages.push({ from: j + N, to: i, value: message });
          }
        }
      }

      steps.push({
        step: steps.length,
        iteration: iter,
        variableNodes: [...variableNodes],
        checkNodes: new Array(M).fill(0),
        messages: checkMessages,
        currentStage: `Iteration ${iter} - Check to Variable`,
        description: `Sending messages from check nodes to variable nodes`,
        decoded: false,
      });

      const newVariableNodes = [...received];
      for (let i = 0; i < N; i++) {
        let sum = received[i];
        for (const msg of checkMessages) {
          if (msg.to === i) {
            sum += msg.value;
          }
        }
        newVariableNodes[i] = sum;
      }

      variableNodes = newVariableNodes;

      const hardDecision = variableNodes.map((x) => (x > 0 ? 1 : 0));
      let syndrome = true;
      for (let j = 0; j < M && syndrome; j++) {
        if (H[j]) {
          let sum = 0;
          for (let i = 0; i < N; i++) {
            sum += H[j][i] * hardDecision[i];
          }
          if (sum % 2 !== 0) syndrome = false;
        }
      }

      decoded = syndrome;

      steps.push({
        step: steps.length,
        iteration: iter,
        variableNodes: [...variableNodes],
        checkNodes: new Array(M).fill(0),
        messages: [],
        currentStage: decoded ? "Converged" : "Update Variables",
        description: decoded ? "Decoding converged successfully!" : "Updated variable node values",
        decoded,
      });

      if (decoded) break;
    }

    return steps;
  };

  const startVisualization = () => {
    const steps = calculateLDPC(receivedBits);
    setLDPCSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= ldpcSteps.length - 1) {
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
    if (step < 0 || step >= ldpcSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= ldpcSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setLDPCSteps([]);
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

  const currentStepData = currentStep >= 0 && currentStep < ldpcSteps.length ? ldpcSteps[currentStep] : null;

  return {
    state: {
      receivedBits,
      ldpcSteps,
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
