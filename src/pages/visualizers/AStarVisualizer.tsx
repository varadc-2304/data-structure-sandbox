import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Node {
  x: number;
  y: number;
  cost: number;
  heuristic: number;
  f: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  visited: boolean;
  previous: Node | null;
}

const AStarVisualizer = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [start, setStart] = useState({ x: 1, y: 1 });
  const [end, setEnd] = useState({ x: 18, y: 13 });
  const [path, setPath] = useState<Node[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isBuildingWalls, setIsBuildingWalls] = useState(false);
  const [isErasingWalls, setIsErasingWalls] = useState(false);
  const [speed, setSpeed] = useState(1000); // Default to 1.0x speed
  const gridSize = 20;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGrid = useCallback(() => {
    const newGrid: Node[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: Node[] = [];
      for (let x = 0; x < gridSize; x++) {
        row.push({
          x,
          y,
          cost: 1,
          heuristic: 0,
          f: 0,
          isWall: false,
          isStart: x === start.x && y === start.y,
          isEnd: x === end.x && y === end.y,
          visited: false,
          previous: null,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setPath([]);
  }, [start, end, gridSize]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const calculateHeuristic = (node: Node): number => {
    const dx = Math.abs(node.x - end.x);
    const dy = Math.abs(node.y - end.y);
    return dx + dy;
  };

  const aStar = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);

    const startNode = grid[start.y][start.x];
    const endNode = grid[end.y][end.x];

    const openSet: Node[] = [startNode];
    const closedSet: Node[] = [];

    startNode.heuristic = calculateHeuristic(startNode);
    startNode.f = startNode.cost + startNode.heuristic;

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current === endNode) {
        // Path found
        reconstructPath(current);
        setIsRunning(false);
        return;
      }

      closedSet.push(current);

      const neighbors = getNeighbors(current);

      for (const neighbor of neighbors) {
        if (closedSet.includes(neighbor) || neighbor.isWall) {
          continue;
        }

        const tentativeCost = current.cost + 1;

        if (!openSet.includes(neighbor) || tentativeCost < neighbor.cost) {
          neighbor.cost = tentativeCost;
          neighbor.heuristic = calculateHeuristic(neighbor);
          neighbor.f = neighbor.cost + neighbor.heuristic;
          neighbor.previous = current;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }

      // Update grid with visited nodes for visualization
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row =>
          row.map(node =>
            node.x === current.x && node.y === current.y ? { ...node, visited: true } : node
          )
        );
        return newGrid;
      });

      await delay(speed);
    }

    // No path found
    setIsRunning(false);
  }, [grid, start, end, isRunning, calculateHeuristic]);

  const reconstructPath = (endNode: Node) => {
    const newPath: Node[] = [];
    let current: Node | null = endNode;

    while (current) {
      newPath.push(current);
      current = current.previous;
    }

    setPath(newPath.reverse());
  };

  const getNeighbors = (node: Node): Node[] => {
    const neighbors: Node[] = [];
    const { x, y } = node;

    const possibleNeighbors = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
    ];

    for (const move of possibleNeighbors) {
      const newX = x + move.dx;
      const newY = y + move.dy;

      if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
        neighbors.push(grid[newY][newX]);
      }
    }

    return neighbors;
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, 2000 - ms));

  const handleGridClick = (x: number, y: number) => {
    if (isRunning) return;

    if (isBuildingWalls) {
      // Build wall
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row =>
          row.map(node =>
            node.x === x && node.y === y && !node.isStart && !node.isEnd ? { ...node, isWall: true } : node
          )
        );
        return newGrid;
      });
    } else if (isErasingWalls) {
      // Erase wall
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row =>
          row.map(node =>
            node.x === x && node.y === y && !node.isStart && !node.isEnd ? { ...node, isWall: false } : node
          )
        );
        return newGrid;
      });
    }
  };

  const resetGrid = () => {
    setIsRunning(false);
    initializeGrid();
  };

  const togglePlayPause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      aStar();
    }
  };

  const nextStep = () => {
    if (!isRunning) {
      aStar();
    }
  };

  const prevStep = () => {
    // Implementation for previous step (if needed)
  };

  const goToStep = (step: number) => {
    // Implementation for going to a specific step (if needed)
  };

  const skipToStart = () => {
    resetGrid();
  };

  const skipToEnd = () => {
    aStar();
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">A* Pathfinding Visualizer</h1>
          <p className="text-lg text-drona-gray">
            Visualize how the A* algorithm finds the shortest path in a grid
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    className="w-1/2 mr-2 border-2 hover:border-drona-green/50"
                    onClick={() => {
                      setIsBuildingWalls(true);
                      setIsErasingWalls(false);
                    }}
                    disabled={isRunning}
                  >
                    Build Walls
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2 ml-2 border-2 hover:border-drona-green/50"
                    onClick={() => {
                      setIsErasingWalls(true);
                      setIsBuildingWalls(false);
                    }}
                    disabled={isRunning}
                  >
                    Erase Walls
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-2 hover:border-drona-green/50"
                  onClick={resetGrid}
                  disabled={isRunning}
                >
                  Reset Grid
                </Button>
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
                    disabled={isRunning}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={togglePlayPause}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextStep}
                    disabled={isRunning}
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

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {(1000 / speed).toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={2000}
                    min={333}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>0.5x</span>
                    <span>3.0x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">A* Pathfinding</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-1">
                  {grid.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((node, x) => (
                        <div
                          key={`${x}-${y}`}
                          className={`w-6 h-6 border border-gray-300 flex items-center justify-center ${node.isWall ? 'bg-gray-800' : node.isStart ? 'bg-green-500' : node.isEnd ? 'bg-red-500' : node.visited ? 'bg-blue-200' : 'bg-white'} transition-colors duration-200`}
                          onClick={() => handleGridClick(x, y)}
                        >
                          {path.includes(node) && <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>}
                        </div>
                      ))}
                    </div>
                  ))}
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
