import { useState, useEffect } from "react";

export interface BoardState {
  grid: (0 | 1)[][];
  queens: number[];
  isSolution?: boolean;
  solutionIndex?: number;
  currentColumn?: number;
  currentRow?: number;
  isBacktracking?: boolean;
  isConflict?: boolean;
  message?: string;
}

export interface Solution {
  queens: number[];
  grid: (0 | 1)[][];
  steps: BoardState[];
}

export const useNQueensVisualizer = () => {
  const [boardSize, setBoardSize] = useState<number>(4);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [solutionFound, setSolutionFound] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const isSafe = (board: (0 | 1)[][], row: number, col: number): boolean => {
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) {
        return false;
      }
    }

    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }

    for (let i = row, j = col; i < boardSize && j >= 0; i++, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }

    return true;
  };

  const generateDetailedStepsToSolution = (targetQueens: number[]): BoardState[] => {
    const steps: BoardState[] = [];

    const solveWithSteps = (board: (0 | 1)[][], col: number, queens: number[]): boolean => {
      if (col >= boardSize) {
        steps.push({
          grid: JSON.parse(JSON.stringify(board)),
          queens: [...queens],
          isSolution: true,
          message: `Solution found! All ${boardSize} queens placed successfully.`,
        });
        return true;
      }

      for (let row = 0; row < boardSize; row++) {
        steps.push({
          grid: JSON.parse(JSON.stringify(board)),
          queens: [...queens],
          currentColumn: col,
          currentRow: row,
          message: `Trying to place queen at position (${row + 1}, ${col + 1})`,
        });

        if (isSafe(board, row, col)) {
          board[row][col] = 1;
          queens[col] = row;

          steps.push({
            grid: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            currentColumn: col,
            currentRow: row,
            message: `Queen placed at (${row + 1}, ${col + 1}). Safe position!`,
          });

          if (solveWithSteps(board, col + 1, queens)) {
            return true;
          }

          steps.push({
            grid: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            currentColumn: col,
            currentRow: row,
            isBacktracking: true,
            message: `Backtracking from (${row + 1}, ${col + 1}). No solution found in this path.`,
          });

          board[row][col] = 0;
          queens[col] = -1;

          steps.push({
            grid: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            currentColumn: col,
            isBacktracking: true,
            message: `Queen removed from (${row + 1}, ${col + 1}). Trying next position.`,
          });
        } else {
          steps.push({
            grid: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            currentColumn: col,
            currentRow: row,
            isConflict: true,
            message: `Cannot place queen at (${row + 1}, ${col + 1}). Conflicts with existing queens.`,
          });
        }
      }

      return false;
    };

    const board = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));
    const queens = Array(boardSize).fill(-1);

    steps.push({
      grid: JSON.parse(JSON.stringify(board)),
      queens: [...queens],
      message: `Starting to solve ${boardSize}-Queens problem. Let's place queens column by column.`,
    });

    solveWithSteps(board, 0, queens);

    return steps;
  };

  const findAllSolutions = (board: (0 | 1)[][], col: number, queens: number[], allSolutions: Solution[]) => {
    if (col >= boardSize) {
      const steps = generateDetailedStepsToSolution([...queens]);
      allSolutions.push({
        queens: [...queens],
        grid: JSON.parse(JSON.stringify(board)),
        steps: steps,
      });
      return;
    }

    for (let row = 0; row < boardSize; row++) {
      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        queens[col] = row;

        findAllSolutions(board, col + 1, queens, allSolutions);

        board[row][col] = 0;
        queens[col] = -1;
      }
    }
  };

  const initializeBoard = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
    setCurrentSolutionIndex(0);
    setIsInitialized(false);

    const allSolutions: Solution[] = [];
    const initialBoard = Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));

    findAllSolutions(initialBoard, 0, Array(boardSize).fill(-1), allSolutions);

    setSolutions(allSolutions);
    setIsInitialized(true);
  };

  useEffect(() => {
    initializeBoard();
  }, [boardSize]);

  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
  };

  const toggleRunning = () => {
    if (!isInitialized || solutions.length === 0) return;

    if (currentStep >= getCurrentSteps().length - 1) {
      setCurrentStep(-1);
      setSolutionFound(false);
    }
    setIsRunning(!isRunning);
  };

  const nextStep = () => {
    const steps = getCurrentSteps();
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);

      if (steps[nextStepIndex]?.isSolution) {
        setSolutionFound(true);
        setIsRunning(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    setCurrentStep((prev) => prev - 1);
    setSolutionFound(false);
  };

  const skipToStart = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
  };

  const skipToEnd = () => {
    const steps = getCurrentSteps();
    setIsRunning(false);
    setCurrentStep(steps.length - 1);
    if (steps[steps.length - 1]?.isSolution) {
      setSolutionFound(true);
    }
  };

  const goToStep = (stepIndex: number) => {
    const steps = getCurrentSteps();
    setIsRunning(false);
    setCurrentStep(stepIndex);
    setSolutionFound(stepIndex >= 0 && steps[stepIndex]?.isSolution);
  };

  const changeSolution = (direction: "prev" | "next") => {
    if (solutions.length === 0) return;

    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);

    if (direction === "next") {
      setCurrentSolutionIndex((prev) => (prev + 1) % solutions.length);
    } else {
      setCurrentSolutionIndex((prev) => (prev - 1 + solutions.length) % solutions.length);
    }
  };

  const getCurrentSteps = (): BoardState[] => {
    if (!isInitialized || solutions.length === 0) return [];
    return solutions[currentSolutionIndex]?.steps || [];
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const steps = getCurrentSteps();

    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        const nextStepIndex = currentStep + 1;
        setCurrentStep(nextStepIndex);

        if (steps[nextStepIndex]?.isSolution) {
          setSolutionFound(true);
          setIsRunning(false);
        }
      }, 2000 / speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStep, speed, currentSolutionIndex, isInitialized]);

  const getCurrentBoard = () => {
    if (!isInitialized || solutions.length === 0) {
      return Array(boardSize)
        .fill(0)
        .map(() => Array(boardSize).fill(0));
    }

    const steps = getCurrentSteps();
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].grid;
    }

    return Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0));
  };

  const getCurrentStepInfo = () => {
    const steps = getCurrentSteps();
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep];
    }
    return null;
  };

  return {
    state: {
      boardSize,
      solutions,
      currentSolutionIndex,
      isRunning,
      speed,
      currentStep,
      solutionFound,
      isInitialized,
    },
    actions: {
      setBoardSize,
      setSpeed,
      resetVisualization,
      toggleRunning,
      nextStep,
      prevStep,
      skipToStart,
      skipToEnd,
      goToStep,
      changeSolution,
      getCurrentSteps,
      getCurrentBoard,
      getCurrentStepInfo,
      setIsRunning,
    },
  };
};
