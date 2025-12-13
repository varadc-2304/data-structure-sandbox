import { useState, useEffect } from "react";

export interface Job {
  id: number;
  profit: number;
  deadline: number;
  isSelected?: boolean;
}

export interface SequencingStep {
  jobs: Job[];
  currentJobIndex: number;
  selectedJobs: Job[];
  timeSlots: (number | null)[];
  totalProfit: number;
  comparison?: string;
}

export const useJobSequencingVisualizer = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [numJobs, setNumJobs] = useState<number>(5);
  const [customJobsInput, setCustomJobsInput] = useState<string>("");
  const [currentJobIndex, setCurrentJobIndex] = useState<number>(-1);
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([]);
  const [timeSlots, setTimeSlots] = useState<(number | null)[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [sequencingSteps, setSequencingSteps] = useState<SequencingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [comparisons, setComparisons] = useState(0);

  const generateRandomJobs = () => {
    const newJobs = Array.from({ length: numJobs }, (_, index) => ({
      id: index + 1,
      profit: Math.floor(Math.random() * 100) + 10,
      deadline: Math.floor(Math.random() * numJobs) + 1,
    }));
    setJobs(newJobs);
    resetSequencing();
  };

  const generateCustomJobs = () => {
    if (!customJobsInput.trim()) return;

    try {
      const newJobs = customJobsInput
        .split(";")
        .filter(Boolean)
        .map((jobStr, index) => {
          const [profitStr, deadlineStr] = jobStr.split(",").map((s) => s.trim());
          const profit = parseInt(profitStr);
          const deadline = parseInt(deadlineStr);

          if (isNaN(profit) || isNaN(deadline)) {
            throw new Error("Invalid job format");
          }

          return {
            id: index + 1,
            profit,
            deadline,
          };
        });

      if (newJobs.length === 0) throw new Error("Empty job list");

      setJobs(newJobs);
      setCustomJobsInput("");
      resetSequencing();
    } catch (error) {
      console.error("Invalid job format");
    }
  };

  const resetSequencing = () => {
    setCurrentJobIndex(-1);
    setSelectedJobs([]);
    setTimeSlots([]);
    setTotalProfit(0);
    setIsRunning(false);
    setSequencingSteps([]);
    setCurrentStep(-1);
    setComparisons(0);
  };

  const calculateSequencingSteps = (initialJobs: Job[]) => {
    const steps: SequencingStep[] = [];
    const jobsCopy = [...initialJobs].sort((a, b) => b.profit - a.profit);
    const maxDeadline = jobsCopy.reduce((max, job) => Math.max(max, job.deadline), 0);
    let currentTimeSlots: (number | null)[] = Array(maxDeadline).fill(null);
    let currentSelectedJobs: Job[] = [];
    let currentTotalProfit = 0;

    steps.push({
      jobs: structuredClone(jobsCopy),
      currentJobIndex: -1,
      selectedJobs: structuredClone(currentSelectedJobs),
      timeSlots: [...currentTimeSlots],
      totalProfit: currentTotalProfit,
      comparison: "Starting Job Sequencing - Sorting jobs by profit",
    });

    for (let i = 0; i < jobsCopy.length; i++) {
      const job = jobsCopy[i];

      steps.push({
        jobs: structuredClone(jobsCopy.map((j, idx) => (idx === i ? { ...j, isSelected: true } : j))),
        currentJobIndex: i,
        selectedJobs: structuredClone(currentSelectedJobs),
        timeSlots: [...currentTimeSlots],
        totalProfit: currentTotalProfit,
        comparison: `Selecting job ${job.id} with profit ${job.profit} and deadline ${job.deadline}`,
      });

      let slotFound = false;
      for (let j = Math.min(maxDeadline - 1, job.deadline - 1); j >= 0; j--) {
        if (currentTimeSlots[j] === null) {
          currentTimeSlots[j] = job.id;
          currentTotalProfit += job.profit;
          currentSelectedJobs.push(job);
          slotFound = true;

          steps.push({
            jobs: structuredClone(jobsCopy.map((j) => ({ ...j, isSelected: false }))),
            currentJobIndex: i,
            selectedJobs: structuredClone(currentSelectedJobs),
            timeSlots: [...currentTimeSlots],
            totalProfit: currentTotalProfit,
            comparison: `Assigned job ${job.id} to time slot ${j + 1}`,
          });

          break;
        }
      }

      if (!slotFound) {
        steps.push({
          jobs: structuredClone(jobsCopy.map((j) => ({ ...j, isSelected: false }))),
          currentJobIndex: i,
          selectedJobs: structuredClone(currentSelectedJobs),
          timeSlots: [...currentTimeSlots],
          totalProfit: currentTotalProfit,
          comparison: `Job ${job.id} could not be scheduled`,
        });
      }
    }

    steps.push({
      jobs: structuredClone(jobsCopy.map((j) => ({ ...j, isSelected: false }))),
      currentJobIndex: -1,
      selectedJobs: structuredClone(currentSelectedJobs),
      timeSlots: [...currentTimeSlots],
      totalProfit: currentTotalProfit,
      comparison: `Job sequencing complete. Total profit: ${currentTotalProfit}`,
    });

    return { steps };
  };

  const startSequencing = () => {
    if (jobs.length === 0 || isRunning) return;

    resetSequencing();
    const { steps } = calculateSequencingSteps(jobs);
    setSequencingSteps(steps);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= sequencingSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);

    const step = sequencingSteps[nextStepIndex];
    setJobs(step.jobs);
    setCurrentJobIndex(step.currentJobIndex);
    setSelectedJobs(step.selectedJobs);
    setTimeSlots(step.timeSlots);
    setTotalProfit(step.totalProfit);
    setComparisons(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;

    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);

    const step = sequencingSteps[prevStepIndex];
    setJobs(step.jobs);
    setCurrentJobIndex(step.currentJobIndex);
    setSelectedJobs(step.selectedJobs);
    setTimeSlots(step.timeSlots);
    setTotalProfit(step.totalProfit);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= sequencingSteps.length) return;

    setCurrentStep(step);
    setIsRunning(false);

    const sequencingStep = sequencingSteps[step];
    setJobs(sequencingStep.jobs);
    setCurrentJobIndex(sequencingStep.currentJobIndex);
    setSelectedJobs(sequencingStep.selectedJobs);
    setTimeSlots(sequencingStep.timeSlots);
    setTotalProfit(sequencingStep.totalProfit);
  };

  const togglePlayPause = () => {
    if (currentStep >= sequencingSteps.length - 1) {
      startSequencing();
    } else {
      setIsRunning(!isRunning);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= sequencingSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, sequencingSteps.length, speed]);

  return {
    state: {
      jobs,
      numJobs,
      customJobsInput,
      currentJobIndex,
      selectedJobs,
      timeSlots,
      totalProfit,
      isRunning,
      speed,
      sequencingSteps,
      currentStep,
      comparisons,
    },
    actions: {
      setNumJobs,
      setCustomJobsInput,
      setSpeed,
      generateRandomJobs,
      generateCustomJobs,
      resetSequencing,
      startSequencing,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
    },
  };
};
