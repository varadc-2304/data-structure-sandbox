import { useState, useCallback, useRef, useEffect } from "react";

export interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: Node;
  isWall: boolean;
  isStart: boolean;
  isGoal: boolean;
  inOpenSet: boolean;
  inClosedSet: boolean;
  isPath: boolean;
  isCurrentPath: boolean;
}

export interface Step {
  current: Node;
  openSet: Node[];
  closedSet: Node[];
  currentPath: Node[];
  description: string;
  pathFound?: boolean;
  finalPath?: Node[];
}

export type Mode = "start" | "goal" | "wall" | "none";

const GRID_SIZE = 12;

export const useAStarVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1500);
  const [steps, setSteps] = useState<Step[]>([]);
  const [grid, setGrid] = useState<Node[][]>([]);
  const [start, setStart] = useState<Node | null>(null);
  const [goal, setGoal] = useState<Node | null>(null);
  const [mode, setMode] = useState<Mode>("none");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row: Node[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        row.push({
          x,
          y,
          g: 0,
          h: 0,
          f: 0,
          isWall: false,
          isStart: false,
          isGoal: false,
          inOpenSet: false,
          inClosedSet: false,
          isPath: false,
          isCurrentPath: false,
        });
      }
      newGrid.push(row);
    }

    const walls = [
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [7, 1],
      [7, 2],
      [7, 3],
      [7, 4],
      [7, 5],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [6, 7],
      [9, 6],
      [9, 7],
      [9, 8],
      [9, 9],
    ];

    walls.forEach(([x, y]) => {
      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x].isWall = true;
      }
    });

    const startNode = newGrid[1][1];
    const goalNode = newGrid[10][10];
    startNode.isStart = true;
    goalNode.isGoal = true;

    setGrid(newGrid);
    setStart(startNode);
    setGoal(goalNode);

    return { grid: newGrid, start: startNode, goal: goalNode };
  }, []);

  const handleCellClick = (x: number, y: number) => {
    if (isPlaying) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => row.map((cell) => ({ ...cell })));
      const clickedCell = newGrid[y][x];

      if (mode === "start") {
        if (start) {
          newGrid[start.y][start.x].isStart = false;
        }
        if (!clickedCell.isWall && !clickedCell.isGoal) {
          clickedCell.isStart = true;
          setStart(clickedCell);
        }
      } else if (mode === "goal") {
        if (goal) {
          newGrid[goal.y][goal.x].isGoal = false;
        }
        if (!clickedCell.isWall && !clickedCell.isStart) {
          clickedCell.isGoal = true;
          setGoal(clickedCell);
        }
      } else if (mode === "wall") {
        if (!clickedCell.isStart && !clickedCell.isGoal) {
          clickedCell.isWall = !clickedCell.isWall;
        }
      }

      return newGrid;
    });

    setCurrentStep(-1);
    setSteps([]);
  };

  const clearGrid = () => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isWall: false,
          inOpenSet: false,
          inClosedSet: false,
          isPath: false,
          isCurrentPath: false,
          g: 0,
          h: 0,
          f: 0,
          parent: undefined,
        }))
      );
      return newGrid;
    });
    setCurrentStep(-1);
    setSteps([]);
  };

  const heuristic = (a: Node, b: Node): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
    const neighbors: Node[] = [];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const x = node.x + dx;
      const y = node.y + dy;

      if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        const neighbor = grid[y][x];
        if (!neighbor.isWall) {
          neighbors.push(neighbor);
        }
      }
    });

    return neighbors;
  };

  const reconstructPath = (goalNode: Node): Node[] => {
    const path: Node[] = [];
    let current: Node | undefined = goalNode;

    while (current) {
      path.unshift(current);
      current = current.parent;
    }

    return path;
  };

  const generateAStarSteps = useCallback(() => {
    if (!start || !goal) return;

    const workingGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        g: 0,
        h: 0,
        f: 0,
        parent: undefined,
        inOpenSet: false,
        inClosedSet: false,
        isPath: false,
        isCurrentPath: false,
      }))
    );

    const newSteps: Step[] = [];
    const openSet: Node[] = [workingGrid[start.y][start.x]];
    const closedSet: Node[] = [];

    const startNode = workingGrid[start.y][start.x];
    const goalNode = workingGrid[goal.y][goal.x];

    startNode.g = 0;
    startNode.h = heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;
    startNode.inOpenSet = true;

    newSteps.push({
      current: startNode,
      openSet: [...openSet],
      closedSet: [...closedSet],
      currentPath: [],
      description: `Starting A* algorithm. Added start node (${startNode.x}, ${startNode.y}) to open set`,
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      current.inOpenSet = false;
      current.inClosedSet = true;
      closedSet.push(current);

      const currentPath = reconstructPath(current);

      if (current.x === goalNode.x && current.y === goalNode.y) {
        const finalPath = reconstructPath(current);

        newSteps.push({
          current,
          openSet: [...openSet],
          closedSet: [...closedSet],
          currentPath: finalPath,
          description: `🎯 Goal reached! Optimal path found with cost ${current.g}`,
          pathFound: true,
          finalPath,
        });
        break;
      }

      newSteps.push({
        current,
        openSet: [...openSet],
        closedSet: [...closedSet],
        currentPath: [...currentPath],
        description: `Exploring (${current.x}, ${current.y}). f=${current.f.toFixed(1)} (g=${current.g}, h=${current.h.toFixed(1)})`,
      });

      const neighbors = getNeighbors(current, workingGrid);

      neighbors.forEach((neighbor) => {
        if (neighbor.inClosedSet) return;

        const tentativeG = current.g + 1;

        if (!neighbor.inOpenSet) {
          neighbor.inOpenSet = true;
          openSet.push(neighbor);
        } else if (tentativeG >= neighbor.g) {
          return;
        }

        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goalNode);
        neighbor.f = neighbor.g + neighbor.h;
      });
    }

    if (openSet.length === 0 && !goalNode.inClosedSet) {
      newSteps.push({
        current: closedSet[closedSet.length - 1] || startNode,
        openSet: [],
        closedSet: [...closedSet],
        currentPath: [],
        description: "❌ No path found! Open set is empty.",
        pathFound: false,
      });
    }

    setSteps(newSteps);
  }, [grid, start, goal]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    if (start && goal) {
      generateAStarSteps();
    }
  }, [generateAStarSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const togglePlayPause = () => {
    if (!start || !goal) {
      alert("Please set both start and goal points first!");
      return;
    }

    if (currentStep >= steps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep((prev) => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, steps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(steps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    if (start && goal) {
      generateAStarSteps();
    }
  };

  const getStepDescription = () => {
    if (currentStep === -1) return "Ready to start A* pathfinding. Set start and goal points, then press play!";
    const step = steps[currentStep];
    return step ? step.description : "A* algorithm complete!";
  };

  const getCurrentStepData = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep];
    }
    return null;
  };

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      steps,
      grid,
      start,
      goal,
      mode,
      GRID_SIZE,
    },
    actions: {
      setSpeed,
      setMode,
      handleCellClick,
      clearGrid,
      togglePlayPause,
      nextStep,
      prevStep,
      goToStep,
      skipToStart,
      skipToEnd,
      resetVisualization,
      getStepDescription,
      getCurrentStepData,
    },
  };
};
