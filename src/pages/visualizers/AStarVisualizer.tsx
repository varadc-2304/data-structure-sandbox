import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Target, Navigation, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Node {
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

interface Step {
  current: Node;
  openSet: Node[];
  closedSet: Node[];
  currentPath: Node[];
  description: string;
  pathFound?: boolean;
  finalPath?: Node[];
}

type Mode = 'start' | 'goal' | 'wall' | 'none';

const AStarVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(500); // Changed from 1000 to 500 to match linear search
  const [steps, setSteps] = useState<Step[]>([]);
  const [grid, setGrid] = useState<Node[][]>([]);
  const [start, setStart] = useState<Node | null>(null);
  const [goal, setGoal] = useState<Node | null>(null);
  const [mode, setMode] = useState<Mode>('none');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 12;

  // Initialize grid
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

    // Add some walls for demonstration
    const walls = [
      [4, 2], [4, 3], [4, 4], [4, 5],
      [7, 1], [7, 2], [7, 3], [7, 4], [7, 5],
      [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
      [9, 6], [9, 7], [9, 8], [9, 9]
    ];

    walls.forEach(([x, y]) => {
      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x].isWall = true;
      }
    });

    // Set default start and goal
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

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      const clickedCell = newGrid[y][x];

      if (mode === 'start') {
        if (start) {
          newGrid[start.y][start.x].isStart = false;
        }
        if (!clickedCell.isWall && !clickedCell.isGoal) {
          clickedCell.isStart = true;
          setStart(clickedCell);
        }
      } else if (mode === 'goal') {
        if (goal) {
          newGrid[goal.y][goal.x].isGoal = false;
        }
        if (!clickedCell.isWall && !clickedCell.isStart) {
          clickedCell.isGoal = true;
          setGoal(clickedCell);
        }
      } else if (mode === 'wall') {
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
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => 
        row.map(cell => ({
          ...cell,
          isWall: false,
          inOpenSet: false,
          inClosedSet: false,
          isPath: false,
          isCurrentPath: false,
          g: 0,
          h: 0,
          f: 0,
          parent: undefined
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
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

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

    const workingGrid = grid.map(row => 
      row.map(cell => ({
        ...cell,
        g: 0,
        h: 0,
        f: 0,
        parent: undefined,
        inOpenSet: false,
        inClosedSet: false,
        isPath: false,
        isCurrentPath: false
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
      description: `Starting A* algorithm. Added start node (${startNode.x}, ${startNode.y}) to open set`
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      current.inOpenSet = false;
      current.inClosedSet = true;
      closedSet.push(current);

      // Build current path to show progress
      const currentPath = reconstructPath(current);
      currentPath.forEach(node => {
        if (!node.isStart && !node.isGoal) {
          node.isCurrentPath = true;
        }
      });

      if (current.x === goalNode.x && current.y === goalNode.y) {
        const finalPath = reconstructPath(current);
        finalPath.forEach(node => {
          if (!node.isStart && !node.isGoal) {
            node.isPath = true;
            node.isCurrentPath = false;
          }
        });

        newSteps.push({
          current,
          openSet: [...openSet],
          closedSet: [...closedSet],
          currentPath: finalPath,
          description: `🎯 Goal reached! Optimal path found with cost ${current.g}`,
          pathFound: true,
          finalPath
        });
        break;
      }

      newSteps.push({
        current,
        openSet: [...openSet],
        closedSet: [...closedSet],
        currentPath: [...currentPath],
        description: `Exploring (${current.x}, ${current.y}). f=${current.f.toFixed(1)} (g=${current.g}, h=${current.h.toFixed(1)})`
      });

      const neighbors = getNeighbors(current, workingGrid);
      
      neighbors.forEach(neighbor => {
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

      // Clear previous current path markers
      workingGrid.forEach(row => {
        row.forEach(cell => {
          cell.isCurrentPath = false;
        });
      });
    }

    if (openSet.length === 0 && !goalNode.inClosedSet) {
      newSteps.push({
        current: closedSet[closedSet.length - 1] || startNode,
        openSet: [],
        closedSet: [...closedSet],
        currentPath: [],
        description: "❌ No path found! Open set is empty.",
        pathFound: false
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
        setCurrentStep(prev => prev + 1);
      }, 2100 - speed); // Changed to match linear search pattern: 2100 - speed
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
      setCurrentStep(prev => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
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
    if (currentStep === -1) return 'Ready to start A* pathfinding. Set start and goal points, then press play!';
    const step = steps[currentStep];
    return step ? step.description : 'A* algorithm complete!';
  };

  const getCurrentStepData = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep];
    }
    return null;
  };

  const getCellClass = (node: Node) => {
    const stepData = getCurrentStepData();
    
    if (node.isStart) return 'bg-green-500 border-green-600 shadow-md';
    if (node.isGoal) return 'bg-red-500 border-red-600 shadow-md';
    if (node.isWall) return 'bg-gray-800 border-gray-900';
    
    if (stepData?.pathFound && node.isPath) return 'bg-yellow-400 border-yellow-500 shadow-md';
    
    if (stepData) {
      if (stepData.current === node) return 'bg-purple-500 border-purple-600 shadow-lg animate-pulse';
      if (node.isCurrentPath) return 'bg-yellow-200 border-yellow-300';
      if (node.inClosedSet) return 'bg-red-200 border-red-300';
      if (node.inOpenSet) return 'bg-blue-200 border-blue-300';
    }
    
    return 'bg-white border-gray-300 hover:bg-gray-50';
  };

  const getCellContent = (node: Node) => {
    if (node.isStart || node.isGoal) return '';
    
    const stepData = getCurrentStepData();
    if (!stepData) return '';
    
    if (stepData.current === node) return 'C';
    if (node.inOpenSet || node.inClosedSet) {
      return node.f > 0 ? node.f.toFixed(0) : '';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">A* Pathfinding Algorithm</h1>
          <p className="text-lg text-drona-gray">
            Interactive matrix visualization - click to set start/goal points and watch the optimal path unfold
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Grid Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={() => setMode(mode === 'start' ? 'none' : 'start')}
                    variant={mode === 'start' ? 'default' : 'outline'}
                    size="sm"
                    className="font-semibold"
                    disabled={isPlaying}
                  >
                    <Navigation className="mr-1 h-3 w-3" />
                    Start
                  </Button>
                  
                  <Button 
                    onClick={() => setMode(mode === 'goal' ? 'none' : 'goal')}
                    variant={mode === 'goal' ? 'default' : 'outline'}
                    size="sm"
                    className="font-semibold"
                    disabled={isPlaying}
                  >
                    <Target className="mr-1 h-3 w-3" />
                    Goal
                  </Button>
                  
                  <Button 
                    onClick={() => setMode(mode === 'wall' ? 'none' : 'wall')}
                    variant={mode === 'wall' ? 'default' : 'outline'}
                    size="sm"
                    className="font-semibold"
                    disabled={isPlaying}
                  >
                    <Square className="mr-1 h-3 w-3" />
                    Wall
                  </Button>
                </div>
                
                <Button 
                  onClick={clearGrid}
                  variant="outline"
                  className="w-full font-semibold border-2 hover:border-drona-green/50"
                  disabled={isPlaying}
                >
                  Clear Walls
                </Button>
                
                <div className="text-xs text-drona-gray p-3 bg-drona-light/30 rounded-lg">
                  {mode === 'start' && "Click on a cell to set the start point"}
                  {mode === 'goal' && "Click on a cell to set the goal point"}
                  {mode === 'wall' && "Click on cells to toggle walls"}
                  {mode === 'none' && "Select a mode above, then click on the grid"}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToStart}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= -1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= steps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToEnd}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetVisualization} 
                  variant="outline" 
                  disabled={isPlaying}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Step: {currentStep + 2} of {steps.length + 1}
                  </label>
                  <Slider
                    value={[currentStep + 1]}
                    onValueChange={([value]) => goToStep(value - 1)}
                    max={steps.length}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Speed: {((2100 - speed) / 100).toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={2000}
                    min={100}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Current State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {getCurrentStepData() && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Current Node</p>
                      <p className="text-lg font-bold text-drona-dark">
                        ({getCurrentStepData()!.current.x}, {getCurrentStepData()!.current.y})
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Open Set Size</p>
                      <p className="text-lg font-bold text-drona-dark">
                        {getCurrentStepData()!.openSet.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Closed Set Size</p>
                      <p className="text-lg font-bold text-drona-dark">
                        {getCurrentStepData()!.closedSet.length}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">F-Score</p>
                      <p className="text-sm text-drona-dark">
                        f = g + h = {getCurrentStepData()!.current.g} + {getCurrentStepData()!.current.h.toFixed(1)} = {getCurrentStepData()!.current.f.toFixed(1)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">A* Matrix Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Matrix Grid */}
                <div className="mb-6 flex justify-center">
                  <div className="inline-block p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="grid grid-cols-12 gap-1">
                      {grid.map((row, y) =>
                        row.map((node, x) => (
                          <div
                            key={`${x}-${y}`}
                            onClick={() => handleCellClick(x, y)}
                            className={`w-10 h-10 border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 rounded ${getCellClass(node)}`}
                            title={`(${x}, ${y}) ${node.f > 0 ? `f=${node.f.toFixed(1)}` : ''}`}
                          >
                            {node.isStart && <Navigation className="h-4 w-4 text-white" />}
                            {node.isGoal && <Target className="h-4 w-4 text-white" />}
                            {!node.isStart && !node.isGoal && getCellContent(node)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Algorithm Status */}
                <div className="mb-6 p-4 bg-drona-light/30 rounded-lg border border-drona-green/20">
                  <h3 className="font-bold text-drona-dark mb-2">Algorithm Status:</h3>
                  <p className="text-sm text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                {/* Success/Failure Messages */}
                {getCurrentStepData()?.pathFound && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                    <h3 className="text-lg font-bold text-green-800 mb-2">🎯 Optimal Path Found!</h3>
                    <p className="text-sm text-green-700">
                      A* successfully found the shortest path with total cost: {goal?.g || 0} steps.
                    </p>
                  </div>
                )}

                {getCurrentStepData()?.pathFound === false && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-300">
                    <h3 className="text-lg font-bold text-red-800 mb-2">❌ No Path Available!</h3>
                    <p className="text-sm text-red-700">
                      Remove some walls or change the goal position to find a path.
                    </p>
                  </div>
                )}

                {/* Legend */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border border-green-200">
                    <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                      <Navigation className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-green-800">Start</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-red-50 rounded border border-red-200">
                    <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                      <Target className="h-2 w-2 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-red-800">Goal</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <span className="text-sm font-semibold text-blue-800">Open Set</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span className="text-sm font-semibold text-gray-800">Closed Set</span>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span className="text-sm font-semibold text-yellow-800">Final Path</span>
                  </div>

                  <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded border border-purple-200">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-sm font-semibold text-purple-800">Current</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AStarVisualizer;
