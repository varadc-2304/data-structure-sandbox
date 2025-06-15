
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Node {
  x: number;
  y: number;
  g: number; // Distance from start
  h: number; // Heuristic (distance to goal)
  f: number; // g + h
  parent?: Node;
  isWall: boolean;
  isStart: boolean;
  isGoal: boolean;
  inOpenSet: boolean;
  inClosedSet: boolean;
  isPath: boolean;
}

interface Step {
  current: Node;
  openSet: Node[];
  closedSet: Node[];
  description: string;
  pathFound?: boolean;
  finalPath?: Node[];
}

const AStarVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [steps, setSteps] = useState<Step[]>([]);
  const [grid, setGrid] = useState<Node[][]>([]);
  const [start, setStart] = useState<Node | null>(null);
  const [goal, setGoal] = useState<Node | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 15;

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
          isStart: x === 2 && y === 2,
          isGoal: x === 12 && y === 12,
          inOpenSet: false,
          inClosedSet: false,
          isPath: false,
        });
      }
      newGrid.push(row);
    }

    // Add some walls
    const walls = [
      [5, 3], [5, 4], [5, 5], [5, 6], [5, 7],
      [8, 2], [8, 3], [8, 4], [8, 5],
      [3, 8], [4, 8], [5, 8], [6, 8], [7, 8],
      [10, 6], [10, 7], [10, 8], [10, 9], [10, 10]
    ];

    walls.forEach(([x, y]) => {
      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x].isWall = true;
      }
    });

    const startNode = newGrid[2][2];
    const goalNode = newGrid[12][12];
    
    setGrid(newGrid);
    setStart(startNode);
    setGoal(goalNode);
    
    return { grid: newGrid, start: startNode, goal: goalNode };
  }, []);

  // Heuristic function (Manhattan distance)
  const heuristic = (a: Node, b: Node): number => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  // Get neighbors of a node
  const getNeighbors = (node: Node, grid: Node[][]): Node[] => {
    const neighbors: Node[] = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1] // 4-directional movement
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

  // Reconstruct path from goal to start
  const reconstructPath = (goalNode: Node): Node[] => {
    const path: Node[] = [];
    let current: Node | undefined = goalNode;
    
    while (current) {
      path.unshift(current);
      current = current.parent;
    }
    
    return path;
  };

  // Generate A* algorithm steps
  const generateAStarSteps = useCallback(() => {
    const { grid: newGrid, start: startNode, goal: goalNode } = initializeGrid();
    if (!startNode || !goalNode) return;

    const newSteps: Step[] = [];
    const openSet: Node[] = [startNode];
    const closedSet: Node[] = [];

    // Initialize start node
    startNode.g = 0;
    startNode.h = heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;
    startNode.inOpenSet = true;

    newSteps.push({
      current: startNode,
      openSet: [...openSet],
      closedSet: [...closedSet],
      description: `Starting A* algorithm. Added start node (${startNode.x}, ${startNode.y}) to open set with f=${startNode.f.toFixed(1)}`
    });

    while (openSet.length > 0) {
      // Find node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      current.inOpenSet = false;
      current.inClosedSet = true;
      closedSet.push(current);

      // Check if we reached the goal
      if (current === goalNode) {
        const finalPath = reconstructPath(goalNode);
        finalPath.forEach(node => {
          if (!node.isStart && !node.isGoal) {
            node.isPath = true;
          }
        });

        newSteps.push({
          current,
          openSet: [...openSet],
          closedSet: [...closedSet],
          description: `Goal reached! Path found with total cost ${goalNode.g}`,
          pathFound: true,
          finalPath
        });
        break;
      }

      newSteps.push({
        current,
        openSet: [...openSet],
        closedSet: [...closedSet],
        description: `Exploring node (${current.x}, ${current.y}) with f=${current.f.toFixed(1)} (g=${current.g}, h=${current.h.toFixed(1)})`
      });

      // Check all neighbors
      const neighbors = getNeighbors(current, newGrid);
      
      neighbors.forEach(neighbor => {
        if (neighbor.inClosedSet) return;

        const tentativeG = current.g + 1; // Cost is 1 for adjacent cells

        if (!neighbor.inOpenSet) {
          neighbor.inOpenSet = true;
          openSet.push(neighbor);
        } else if (tentativeG >= neighbor.g) {
          return; // This path is not better
        }

        // This path is the best until now
        neighbor.parent = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goalNode);
        neighbor.f = neighbor.g + neighbor.h;
      });
    }

    if (openSet.length === 0 && !goalNode.inClosedSet) {
      newSteps.push({
        current: closedSet[closedSet.length - 1],
        openSet: [],
        closedSet: [...closedSet],
        description: "No path found! Open set is empty and goal was not reached.",
        pathFound: false
      });
    }

    setSteps(newSteps);
  }, [initializeGrid]);

  useEffect(() => {
    generateAStarSteps();
  }, [generateAStarSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  const togglePlayPause = () => {
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
    generateAStarSteps();
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to start A* pathfinding algorithm';
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
    if (node.isStart) return 'bg-green-500';
    if (node.isGoal) return 'bg-red-500';
    if (node.isWall) return 'bg-gray-800';
    if (node.isPath) return 'bg-yellow-400';
    if (node.inClosedSet) return 'bg-red-200';
    if (node.inOpenSet) return 'bg-blue-200';
    return 'bg-gray-100';
  };

  const getCellContent = (node: Node) => {
    const stepData = getCurrentStepData();
    if (!stepData) return '';
    
    if (stepData.current === node) return 'C';
    if (node.inOpenSet || node.inClosedSet) {
      return node.f.toFixed(1);
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
            Watch A* algorithm find the optimal path using heuristics and cost evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
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
                    Animation Speed: {(2000 / speed).toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={2000}
                    min={500}
                    step={250}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
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
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">A* Pathfinding Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="grid grid-cols-15 gap-1 max-w-4xl mx-auto">
                    {grid.map((row, y) =>
                      row.map((node, x) => (
                        <div
                          key={`${x}-${y}`}
                          className={`w-8 h-8 border border-gray-300 flex items-center justify-center text-xs font-bold ${getCellClass(node)} transition-colors duration-300`}
                        >
                          {getCellContent(node)}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Algorithm Status:</h3>
                  <p className="text-sm text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                {getCurrentStepData()?.pathFound && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                    <h3 className="text-xl font-bold text-drona-dark mb-2">🎯 Path Found!</h3>
                    <p className="text-sm text-drona-gray">
                      A* successfully found the optimal path from start to goal.
                      Total path cost: {goal?.g || 0} steps.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Start</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Goal</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-blue-200 rounded mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Open Set</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-red-200 rounded mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Closed Set</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">A* Algorithm Formula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-mono">f(n) = g(n) + h(n)</p>
                      <div className="text-sm text-drona-gray space-y-1">
                        <p>g(n) = Cost from start to node n</p>
                        <p>h(n) = Heuristic cost from node n to goal</p>
                        <p>f(n) = Total estimated cost of path through n</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AStarVisualizer;
