import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, MapPin, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Position {
  x: number;
  y: number;
}

interface GridCell {
  x: number;
  y: number;
  isStart: boolean;
  isGoal: boolean;
  isObstacle: boolean;
  isPath: boolean;
  isVisited: boolean;
  f: number;
  g: number;
  h: number;
  parent: Position | null;
}

interface SearchStep {
  x: number;
  y: number;
  message: string;
}

const AStarVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1.0); // Default speed 1.0x
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [start, setStart] = useState<Position>({ x: 1, y: 1 });
  const [goal, setGoal] = useState<Position>({ x: 8, y: 8 });
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [mode, setMode] = useState<'start' | 'goal' | 'obstacle'>('start');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const gridSize = 10;

  const initializeGrid = useCallback(() => {
    const newGrid: GridCell[][] = [];
    for (let x = 0; x < gridSize; x++) {
      newGrid[x] = [];
      for (let y = 0; y < gridSize; y++) {
        newGrid[x][y] = {
          x,
          y,
          isStart: x === start.x && y === start.y,
          isGoal: x === goal.x && y === goal.y,
          isObstacle: obstacles.some(obs => obs.x === x && obs.y === y),
          isPath: false,
          isVisited: false,
          f: 0,
          g: 0,
          h: 0,
          parent: null,
        };
      }
    }
    return newGrid;
  }, [start, goal, obstacles]);

  useEffect(() => {
    setGrid(initializeGrid());
  }, [initializeGrid]);

  const heuristic = (a: Position, b: Position) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  };

  const aStarSearch = useCallback(() => {
    const newSteps: SearchStep[] = [];
    const newGrid = initializeGrid();

    const startNode = newGrid[start.x][start.y];
    const goalNode = newGrid[goal.x][goal.y];

    const openSet: GridCell[] = [startNode];
    const closedSet: GridCell[] = [];

    newSteps.push({ x: startNode.x, y: startNode.y, message: "Starting A* search" });

    while (openSet.length > 0) {
      // Get the node with the lowest f score
      let currentNode = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < currentNode.f) {
          currentNode = openSet[i];
        }
      }

      if (currentNode === goalNode) {
        newSteps.push({ x: currentNode.x, y: currentNode.y, message: "Goal found!" });
        // Reconstruct path
        const path: Position[] = [];
        let temp: GridCell | null = currentNode;
        while (temp) {
          path.push({ x: temp.x, y: temp.y });
          temp = temp.parent ? newGrid[temp.parent.x][temp.parent.y] : null;
        }
        setPath(path.reverse());
        setSteps(newSteps);
        return;
      }

      // Move current node from open to closed set
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.push(currentNode);
      newGrid[currentNode.x][currentNode.y].isVisited = true;

      // Get neighbors
      const neighbors: GridCell[] = [];
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Only allow orthogonal movements
      for (const dir of directions) {
        const x = currentNode.x + dir[0];
        const y = currentNode.y + dir[1];

        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize &&
            !obstacles.some(obs => obs.x === x && obs.y === y)) {
          neighbors.push(newGrid[x][y]);
        }
      }

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor)) {
          continue;
        }

        const tentativeGScore = currentNode.g + 1; // Distance from current node to neighbor is 1

        if (!openSet.includes(neighbor) || tentativeGScore < neighbor.g) {
          // This path to neighbor is better than any previous one. Record it!
          neighbor.parent = { x: currentNode.x, y: currentNode.y };
          neighbor.g = tentativeGScore;
          neighbor.h = heuristic({ x: neighbor.x, y: neighbor.y }, goal);
          neighbor.f = neighbor.g + neighbor.h;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
            newSteps.push({ x: neighbor.x, y: neighbor.y, message: `Added (${neighbor.x}, ${neighbor.y}) to open set` });
          }
        }
      }
    }

    // Open set is empty but goal was never reached
    setSteps(newSteps);
    setPath([]);
  }, [start, goal, obstacles, initializeGrid, heuristic]);

  const handleGridClick = (x: number, y: number) => {
    if (isPlaying) return;

    const newPosition = { x, y };

    switch (mode) {
      case 'start':
        setStart(newPosition);
        break;
      case 'goal':
        setGoal(newPosition);
        break;
      case 'obstacle':
        if (obstacles.some(obs => obs.x === x && obs.y === y)) {
          // Remove obstacle
          setObstacles(obstacles.filter(obs => !(obs.x === x && obs.y === y)));
        } else {
          // Add obstacle
          setObstacles([...obstacles, newPosition]);
        }
        break;
    }

    resetVisualization();
  };

  useEffect(() => {
    if (grid.length > 0) {
      resetVisualization();
    }
  }, [start, goal, obstacles, grid]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / speed); // Convert speed multiplier to delay
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
    aStarSearch();
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to start A* pathfinding algorithm';
    if (currentStep >= steps.length) return 'A* pathfinding complete!';
    const step = steps[currentStep];
    return step ? step.message : 'A* pathfinding complete!';
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
            Watch the A* algorithm find the shortest path between two points on a grid
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Grid Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between">
                  <Button
                    variant={mode === 'start' ? 'default' : 'outline'}
                    onClick={() => setMode('start')}
                    className="w-1/3 font-semibold border-2 hover:border-drona-green/50"
                  >
                    <MapPin className="mr-2 h-4 w-4" /> Start
                  </Button>
                  <Button
                    variant={mode === 'goal' ? 'default' : 'outline'}
                    onClick={() => setMode('goal')}
                    className="w-1/3 font-semibold border-2 hover:border-drona-green/50"
                  >
                    <Target className="mr-2 h-4 w-4" /> Goal
                  </Button>
                  <Button
                    variant={mode === 'obstacle' ? 'default' : 'outline'}
                    onClick={() => setMode('obstacle')}
                    className="w-1/3 font-semibold border-2 hover:border-drona-green/50"
                  >
                    <div className="h-4 w-4 bg-gray-600 mr-2"></div> Obstacle
                  </Button>
                </div>
                <div className="text-sm text-drona-gray">
                  Click on the grid to set the start, goal, or add/remove obstacles.
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
                    Speed: {speed.toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={3.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>0.5x</span>
                    <span>3.0x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Start</p>
                    <p className="text-lg font-bold text-drona-dark">({start.x}, {start.y})</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Goal</p>
                    <p className="text-lg font-bold text-drona-dark">({goal.x}, {goal.y})</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Obstacles</p>
                    <p className="text-lg font-bold text-drona-dark">{obstacles.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">A* Pathfinding Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
                    {grid.map((row, x) =>
                      row.map((cell, y) => (
                        <div
                          key={`${x}-${y}`}
                          className={`w-10 h-8 flex items-center justify-center text-xs font-bold ${
                            cell.isStart ? 'bg-green-500 text-white' :
                            cell.isGoal ? 'bg-blue-500 text-white' :
                            cell.isObstacle ? 'bg-gray-600 text-white' :
                            cell.isPath ? 'bg-purple-300' :
                            cell.isVisited ? 'bg-yellow-100' :
                            'bg-white border border-gray-200'
                          } cursor-pointer select-none`}
                          onClick={() => handleGridClick(x, y)}
                        >
                          {/* {cell.f > 0 && !cell.isObstacle && !cell.isStart && !cell.isGoal ? cell.f.toFixed(1) : ''} */}
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

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">A* Algorithm Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                      <li>Start at the initial node.</li>
                      <li>Add the start node to the open set.</li>
                      <li>
                        While the open set is not empty:
                        <ol className="list-disc list-inside space-y-2 ml-4">
                          <li>Get the node with the lowest F score from the open set.</li>
                          <li>If this node is the goal, then return the path.</li>
                          <li>Remove the current node from the open set and add it to the closed set.</li>
                          <li>
                            For each neighbor of the current node:
                            <ol className="list-disc list-inside space-y-2 ml-4">
                              <li>If the neighbor is not traversable or is in the closed set, ignore it.</li>
                              <li>If the neighbor is not in the open set: discover a new node.</li>
                              <li>If the new path to neighbor is shorter or more promising than previous:
                                <ol className="list-disc list-inside space-y-2 ml-4">
                                  <li>Set F, G, and H values of the neighbor.</li>
                                  <li>Set the parent of the neighbor to the current node.</li>
                                  <li>If the neighbor is not in the open set, add it to the open set.</li>
                                </ol>
                              </li>
                            </ol>
                          </li>
                        </ol>
                      </li>
                      <li>If the open set is empty and the goal was not reached, return failure.</li>
                    </ol>
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
