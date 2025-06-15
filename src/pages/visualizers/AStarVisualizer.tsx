
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Target, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Node {
  x: number;
  y: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  visited: boolean;
  distance: number;
  heuristic: number;
  cost: number;
  previous: Node | null;
}

type Grid = Node[][];

const AStarVisualizer = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [start, setStart] = useState({ x: 1, y: 1 });
  const [end, setEnd] = useState({ x: 8, y: 5 });
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(15);
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState<Node[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<Node[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [allowDiagonal, setAllowDiagonal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGrid = useCallback(() => {
    const newGrid: Grid = [];
    for (let y = 0; y < rows; y++) {
      const row: Node[] = [];
      for (let x = 0; x < cols; x++) {
        row.push({
          x,
          y,
          isStart: x === start.x && y === start.y,
          isEnd: x === end.x && y === end.y,
          isWall: Math.random() < 0.2,
          visited: false,
          distance: Infinity,
          heuristic: 0,
          cost: Infinity,
          previous: null,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setPath([]);
    setVisitedNodes([]);
    setCurrentStep(-1);
  }, [start, end, rows, cols]);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const resetWalls = () => {
    const newGrid: Grid = grid.map(row =>
      row.map(node => ({ ...node, isWall: Math.random() < 0.2 }))
    );
    setGrid(newGrid);
    setPath([]);
    setVisitedNodes([]);
    setCurrentStep(-1);
  };

  const toggleWall = (x: number, y: number) => {
    if (grid[y][x].isStart || grid[y][x].isEnd) return;
    const newGrid = grid.map(row =>
      row.map(node =>
        node.x === x && node.y === y ? { ...node, isWall: !node.isWall } : node
      )
    );
    setGrid(newGrid);
    setPath([]);
    setVisitedNodes([]);
    setCurrentStep(-1);
  };

  const calculateHeuristic = (x1: number, y1: number, x2: number, y2: number): number => {
    // Manhattan distance
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  };

  const aStar = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(0);

    const startNode = grid[start.y][start.x];
    const endNode = grid[end.y][end.x];

    startNode.distance = 0;
    startNode.heuristic = calculateHeuristic(start.x, start.y, end.x, end.y);
    startNode.cost = startNode.heuristic;

    const openSet: Node[] = [startNode];
    const closedSet: Node[] = [];
    const newVisitedNodes: Node[] = [];

    intervalRef.current = setInterval(() => {
      if (openSet.length === 0) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setCurrentStep(-1);
        alert("No path found!");
        return;
      }

      openSet.sort((a, b) => a.cost - b.cost);
      const current = openSet.shift()!;

      if (current === endNode) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setCurrentStep(-1);

        // Build path
        const shortestPath: Node[] = [];
        let node: Node | null = current;
        while (node) {
          shortestPath.unshift(node);
          node = node.previous;
        }
        setPath(shortestPath);
        setVisitedNodes(newVisitedNodes);
        return;
      }

      closedSet.push(current);
      newVisitedNodes.push(current);

      const neighbors = getNeighbors(current.x, current.y);

      neighbors.forEach(neighbor => {
        if (closedSet.includes(neighbor) || neighbor.isWall) {
          return;
        }

        const tentativeDistance = current.distance + 1;
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.heuristic = calculateHeuristic(neighbor.x, neighbor.y, end.x, end.y);
          neighbor.cost = neighbor.distance + neighbor.heuristic;
          neighbor.previous = current;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      });

      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row =>
          row.map(node => {
            const updatedNode = openSet.find(n => n.x === node.x && n.y === node.y) ||
                                closedSet.find(n => n.x === node.x && n.y === node.y);
            return updatedNode ? { ...node, ...updatedNode } : node;
          })
        );
        return newGrid;
      });

      setCurrentStep(prevStep => prevStep + 1);
    }, speed);

    return () => clearInterval(intervalRef.current!);
  }, [grid, start, end, isRunning, speed, allowDiagonal]);

  useEffect(() => {
    if (isRunning) {
      aStar();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, aStar]);

  const getNeighbors = (x: number, y: number): Node[] => {
    const neighbors: Node[] = [];
    const possibleNeighbors = [
      { dx: 0, dy: -1 },  // Up
      { dx: 0, dy: 1 },   // Down
      { dx: -1, dy: 0 },  // Left
      { dx: 1, dy: 0 },   // Right
    ];

    if (allowDiagonal) {
      possibleNeighbors.push(
        { dx: -1, dy: -1 }, // Up-Left
        { dx: -1, dy: 1 },  // Down-Left
        { dx: 1, dy: -1 },  // Up-Right
        { dx: 1, dy: 1 }   // Down-Right
      );
    }

    possibleNeighbors.forEach(({ dx, dy }) => {
      const newX = x + dx;
      const newY = y + dy;

      if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        neighbors.push(grid[newY][newX]);
      }
    });

    return neighbors;
  };

  const handleGridClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isRunning) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 30);
    const y = Math.floor((event.clientY - rect.top) / 30);

    toggleWall(x, y);
  };

  const handleStartChange = () => {
    if (isRunning) return;
    const newX = Math.floor(Math.random() * cols);
    const newY = Math.floor(Math.random() * rows);
    setStart({ x: newX, y: newY });
  };

  const handleEndChange = () => {
    if (isRunning) return;
    const newX = Math.floor(Math.random() * cols);
    const newY = Math.floor(Math.random() * rows);
    setEnd({ x: newX, y: newY });
  };

  const resetVisualization = () => {
    setIsRunning(false);
    initializeGrid();
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
            Watch A* find the optimal path using heuristics and cost evaluation
          </p>
        </div>

        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Controls Panel */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-lg border-2 border-drona-green/20">
                  <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                    <CardTitle className="text-xl font-bold text-drona-dark">Grid Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-sm text-drona-gray">
                      Grid size: {rows}x{cols}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowDiagonal"
                        className="h-4 w-4 accent-drona-green focus:ring-drona-green"
                        checked={allowDiagonal}
                        onChange={(e) => setAllowDiagonal(e.target.checked)}
                      />
                      <label htmlFor="allowDiagonal" className="text-sm font-medium text-drona-dark">
                        Allow Diagonal Movement
                      </label>
                    </div>
                    <Button
                      onClick={resetWalls}
                      variant="outline"
                      className="w-full font-semibold border-2 hover:border-drona-green/50"
                      disabled={isRunning}
                    >
                      <Shuffle className="mr-2 h-4 w-4" />
                      Generate Random Walls
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-drona-green/20">
                  <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                    <CardTitle className="text-xl font-bold text-drona-dark">Start & End Points</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-sm text-drona-gray">
                      Start: ({start.x}, {start.y}) | End: ({end.x}, {end.y})
                    </div>
                    <Button
                      onClick={handleStartChange}
                      variant="outline"
                      className="w-full font-semibold border-2 hover:border-drona-green/50"
                      disabled={isRunning}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Change Start
                    </Button>
                    <Button
                      onClick={handleEndChange}
                      variant="outline"
                      className="w-full font-semibold border-2 hover:border-drona-green/50"
                      disabled={isRunning}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Change End
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-drona-green/20">
                  <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                    <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <Button
                      onClick={() => setIsRunning(!isRunning)}
                      className="w-full bg-drona-green hover:bg-drona-green/90 text-white font-semibold"
                      disabled={path.length > 0}
                    >
                      {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isRunning ? 'Stop' : 'Start A*'}
                    </Button>
                    <Button
                      onClick={resetVisualization}
                      variant="outline"
                      className="w-full border-2 hover:border-drona-green/50"
                      disabled={isRunning}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-drona-dark">
                        Speed: {(3000 / speed).toFixed(1)}x
                      </label>
                      <Slider
                        value={[speed]}
                        onValueChange={([value]) => setSpeed(value)}
                        max={6000}
                        min={1000}
                        step={500}
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
                    <CardTitle className="text-2xl font-bold text-drona-dark">A* Pathfinding Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <svg
                        width="450"
                        height="300"
                        viewBox={`0 0 ${cols * 30} ${rows * 30}`}
                        className="border rounded-lg bg-white mx-auto cursor-pointer"
                        onClick={handleGridClick}
                      >
                        {grid.map(row =>
                          row.map(node => (
                            <rect
                              key={`${node.x}-${node.y}`}
                              x={node.x * 30}
                              y={node.y * 30}
                              width="30"
                              height="30"
                              fill={
                                node.isStart
                                  ? '#a78bfa'
                                  : node.isEnd
                                    ? '#22c55e'
                                    : node.isWall
                                      ? '#27272a'
                                      : node.visited
                                        ? '#bae6fd'
                                        : 'white'
                              }
                              stroke="#ddd"
                              strokeWidth="1"
                            />
                          ))
                        )}
                        {path.map(node => (
                          <rect
                            key={`path-${node.x}-${node.y}`}
                            x={node.x * 30}
                            y={node.y * 30}
                            width="30"
                            height="30"
                            fill="#facc15"
                          />
                        ))}
                      </svg>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-drona-gray">Start Node</p>
                        <div className="w-4 h-4 bg-purple-600 rounded-full mx-auto mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-drona-gray">End Node</p>
                        <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-drona-gray">Wall Node</p>
                        <div className="w-4 h-4 bg-gray-800 rounded-full mx-auto mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-drona-gray">Visited Node</p>
                        <div className="w-4 h-4 bg-blue-300 rounded-full mx-auto mt-2"></div>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-drona-gray">Path Node</p>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mt-2"></div>
                      </div>
                    </div>

                    <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Algorithm Steps</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Start at the initial node.</li>
                          <li>Add the start node to the open set.</li>
                          <li>
                            While the open set is not empty:
                            <ol className="list-[lower-alpha] list-inside space-y-2 ml-4">
                              <li>Get the node with the lowest f(n) value from the open set.</li>
                              <li>If this node is the goal, then return the path.</li>
                              <li>Remove the current node from the open set and add it to the closed set.</li>
                              <li>
                                For each neighbor of the current node:
                                <ol className="list-[lower-roman] list-inside space-y-2 ml-4">
                                  <li>If the neighbor is in the closed set or is unwalkable, ignore it.</li>
                                  <li>
                                    If the new path to the neighbor is shorter OR the neighbor is not in the open set:
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                      <li>Set the neighbor's parent to the current node.</li>
                                      <li>Set the neighbor's g(n) value (cost from start to neighbor).</li>
                                      <li>Set the neighbor's h(n) value (heuristic estimate from neighbor to goal).</li>
                                      <li>Set the neighbor's f(n) value (g(n) + h(n)).</li>
                                      <li>If the neighbor is not in the open set, add it.</li>
                                    </ul>
                                  </li>
                                </ol>
                              </li>
                            </ol>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">A* Pathfinding Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-drona-dark mb-4">How A* Works</h3>
                  
                  <div className="bg-drona-light/30 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-drona-dark mb-3">Algorithm Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                      <li><strong>Initialize:</strong> Start with the initial node in the open set</li>
                      <li><strong>Select:</strong> Choose the node with lowest f(n) = g(n) + h(n) from open set</li>
                      <li><strong>Expand:</strong> Move current node to closed set, examine its neighbors</li>
                      <li><strong>Update:</strong> Calculate costs for neighbors and add to open set if better</li>
                      <li><strong>Repeat:</strong> Continue until goal is reached or open set is empty</li>
                    </ol>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-drona-dark mb-3">Cost Functions:</h4>
                    <div className="space-y-3 text-drona-gray">
                      <p><strong>g(n):</strong> Actual cost from start to current node</p>
                      <p><strong>h(n):</strong> Heuristic estimate from current node to goal (Manhattan distance)</p>
                      <p><strong>f(n) = g(n) + h(n):</strong> Total estimated cost of path through node n</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-drona-gray">O(b^d)</p>
                        <ul className="text-sm text-drona-gray mt-2 space-y-1">
                          <li>b = branching factor</li>
                          <li>d = depth of optimal solution</li>
                          <li>Can be much faster with good heuristic</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-drona-gray space-y-1">
                          <li>• GPS navigation systems</li>
                          <li>• Video game pathfinding</li>
                          <li>• Robotics path planning</li>
                          <li>• Network routing protocols</li>
                          <li>• Puzzle solving</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 p-6 rounded-lg">
                    <h4 className="font-bold text-drona-dark mb-3">Key Properties:</h4>
                    <ul className="text-drona-gray space-y-2">
                      <li>• <strong>Complete:</strong> Will find a solution if one exists</li>
                      <li>• <strong>Optimal:</strong> Finds the shortest path when heuristic is admissible</li>
                      <li>• <strong>Admissible Heuristic:</strong> Never overestimates the actual cost to goal</li>
                      <li>• <strong>Consistent:</strong> For best performance, heuristic should be consistent</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg">
                    <h4 className="font-bold text-drona-dark mb-3">Heuristic Functions:</h4>
                    <ul className="text-drona-gray space-y-2">
                      <li>• <strong>Manhattan Distance:</strong> |x1-x2| + |y1-y2| (used in this visualization)</li>
                      <li>• <strong>Euclidean Distance:</strong> √[(x1-x2)² + (y1-y2)²]</li>
                      <li>• <strong>Diagonal Distance:</strong> For 8-directional movement</li>
                      <li>• <strong>Custom:</strong> Domain-specific heuristics for better performance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AStarVisualizer;
