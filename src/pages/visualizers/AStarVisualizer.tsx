
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Cell {
  x: number;
  y: number;
  f: number; // Total cost (g + h)
  g: number; // Cost from start
  h: number; // Heuristic (estimated cost to goal)
  isObstacle: boolean;
  isPath: boolean;
  isVisited: boolean;
  isStart: boolean;
  isGoal: boolean;
  parent: Cell | null;
}

type HeuristicType = 'manhattan' | 'euclidean' | 'chebyshev';

const AStarVisualizer = () => {
  const [gridSize, setGridSize] = useState(10);
  const [heuristic, setHeuristic] = useState<HeuristicType>('manhattan');
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [startPos, setStartPos] = useState({ x: 1, y: 1 });
  const [goalPos, setGoalPos] = useState({ x: 8, y: 8 });
  const [placingObstacles, setPlacingObstacles] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  // Initialize grid
  const initializeGrid = () => {
    const newGrid: Cell[][] = [];
    
    for (let i = 0; i < gridSize; i++) {
      newGrid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        newGrid[i][j] = {
          x: i,
          y: j,
          f: 0,
          g: 0,
          h: 0,
          isObstacle: false,
          isPath: false,
          isVisited: false,
          isStart: i === startPos.x && j === startPos.y,
          isGoal: i === goalPos.x && j === goalPos.y,
          parent: null
        };
      }
    }
    
    setGrid(newGrid);
  };

  // Calculate heuristic
  const calculateHeuristic = (pos: { x: number, y: number }, goal: { x: number, y: number }): number => {
    switch (heuristic) {
      case 'manhattan':
        return Math.abs(pos.x - goal.x) + Math.abs(pos.y - goal.y);
      case 'euclidean':
        return Math.sqrt(Math.pow(pos.x - goal.x, 2) + Math.pow(pos.y - goal.y, 2));
      case 'chebyshev':
        return Math.max(Math.abs(pos.x - goal.x), Math.abs(pos.y - goal.y));
      default:
        return 0;
    }
  };

  // Get neighbors
  const getNeighbors = (cell: Cell): Cell[] => {
    const { x, y } = cell;
    const neighbors: Cell[] = [];
    
    // Check all 4 directions
    const directions = [
      { dx: -1, dy: 0 }, // up
      { dx: 1, dy: 0 },  // down
      { dx: 0, dy: -1 }, // left
      { dx: 0, dy: 1 }   // right
    ];
    
    directions.forEach(dir => {
      const newX = x + dir.dx;
      const newY = y + dir.dy;
      
      // Check if within bounds and not an obstacle
      if (
        newX >= 0 && newX < gridSize &&
        newY >= 0 && newY < gridSize &&
        !grid[newX][newY].isObstacle
      ) {
        neighbors.push(grid[newX][newY]);
      }
    });
    
    return neighbors;
  };

  // Run A* search algorithm
  const runAStar = () => {
    // Reset path and visited status
    const newGrid = grid.map(row => {
      return row.map(cell => {
        return {
          ...cell,
          f: 0,
          g: 0,
          h: 0,
          isPath: false,
          isVisited: false,
          parent: null
        };
      });
    });
    
    setGrid(newGrid);
    
    // Open and closed sets
    const openSet: Cell[] = [];
    const closedSet: Set<string> = new Set();
    
    // Add start node to open set
    const startCell = newGrid[startPos.x][startPos.y];
    startCell.g = 0;
    startCell.h = calculateHeuristic(startPos, goalPos);
    startCell.f = startCell.g + startCell.h;
    
    openSet.push(startCell);
    
    // Step function for animation
    const step = () => {
      if (openSet.length === 0) {
        setIsRunning(false);
        toast({
          title: "No Path Found",
          description: "There is no path from start to goal."
        });
        return;
      }
      
      // Get the node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      
      // If we reached the goal
      if (current.isGoal) {
        // Reconstruct path
        let pathCell: Cell | null = current;
        while (pathCell && !pathCell.isStart) {
          if (!pathCell.isGoal) {
            pathCell.isPath = true;
          }
          pathCell = pathCell.parent;
        }
        
        setGrid([...newGrid]);
        setIsRunning(false);
        toast({
          title: "Path Found",
          description: "A* algorithm found the shortest path!"
        });
        return;
      }
      
      // Add current to closed set
      closedSet.add(`${current.x},${current.y}`);
      current.isVisited = true;
      
      // Check each neighbor
      const neighbors = getNeighbors(current);
      
      for (const neighbor of neighbors) {
        // If already evaluated, skip
        if (closedSet.has(`${neighbor.x},${neighbor.y}`)) {
          continue;
        }
        
        // Calculate g score
        const tentativeG = current.g + 1;
        
        // If not in open set or better g score found
        if (
          !openSet.includes(neighbor) ||
          tentativeG < neighbor.g
        ) {
          // Update neighbor
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = calculateHeuristic({ x: neighbor.x, y: neighbor.y }, goalPos);
          neighbor.f = neighbor.g + neighbor.h;
          
          // Add to open set if not there
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
      
      // Update grid
      setGrid([...newGrid]);
      
      // Continue if still running
      if (isRunning && openSet.length > 0) {
        animationRef.current = requestAnimationFrame(step);
      }
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(step);
  };

  // Toggle algorithm state
  const toggleAlgorithm = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    
    if (newIsRunning) {
      runAStar();
      toast({
        title: "Algorithm Started",
        description: "A* search algorithm has started."
      });
    } else {
      cancelAnimationFrame(animationRef.current);
      toast({
        title: "Algorithm Stopped",
        description: "A* search algorithm has been stopped."
      });
    }
  };

  // Reset grid
  const resetGrid = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    initializeGrid();
    toast({
      title: "Grid Reset",
      description: "Grid has been reset."
    });
  };

  // Toggle obstacle placing mode
  const toggleObstaclePlacing = () => {
    setPlacingObstacles(!placingObstacles);
    toast({
      title: placingObstacles ? "Obstacle Placing Disabled" : "Obstacle Placing Enabled",
      description: placingObstacles ? "Click to set start/goal positions." : "Click on the grid to place obstacles."
    });
  };

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellSize = canvas.width / gridSize;
    const gridX = Math.floor(y / cellSize);
    const gridY = Math.floor(x / cellSize);
    
    if (gridX < 0 || gridX >= gridSize || gridY < 0 || gridY >= gridSize) {
      return;
    }
    
    const newGrid = [...grid];
    
    if (placingObstacles) {
      // Don't place obstacles on start or goal
      if (
        (gridX === startPos.x && gridY === startPos.y) ||
        (gridX === goalPos.x && gridY === goalPos.y)
      ) {
        return;
      }
      
      newGrid[gridX][gridY].isObstacle = !newGrid[gridX][gridY].isObstacle;
    } else {
      // Set start or goal position
      if (e.shiftKey) {
        // Remove old goal
        newGrid[goalPos.x][goalPos.y].isGoal = false;
        
        // Set new goal
        goalPos.x = gridX;
        goalPos.y = gridY;
        newGrid[gridX][gridY].isGoal = true;
        newGrid[gridX][gridY].isObstacle = false;
      } else {
        // Remove old start
        newGrid[startPos.x][startPos.y].isStart = false;
        
        // Set new start
        startPos.x = gridX;
        startPos.y = gridY;
        newGrid[gridX][gridY].isStart = true;
        newGrid[gridX][gridY].isObstacle = false;
      }
    }
    
    setGrid(newGrid);
  };

  // Draw grid on canvas
  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / gridSize;
    
    // Draw cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = grid[i][j];
        
        if (cell.isStart) {
          ctx.fillStyle = '#4CAF50'; // Green for start
        } else if (cell.isGoal) {
          ctx.fillStyle = '#FF5722'; // Orange for goal
        } else if (cell.isObstacle) {
          ctx.fillStyle = '#263238'; // Dark blue for obstacles
        } else if (cell.isPath) {
          ctx.fillStyle = '#FFC107'; // Yellow for path
        } else if (cell.isVisited) {
          ctx.fillStyle = '#B3E5FC'; // Light blue for visited
        } else {
          ctx.fillStyle = '#FFFFFF'; // White for unvisited
        }
        
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
        
        // Draw cell border
        ctx.strokeStyle = '#ECEFF1';
        ctx.lineWidth = 1;
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  };

  // Initialize grid on mount or when grid size changes
  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  // Draw grid when it changes
  useEffect(() => {
    if (grid.length > 0) {
      drawGrid();
    }
  }, [grid]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">A* Search Algorithm</h1>
          <p className="text-drona-gray">
            Visualize how A* pathfinding algorithm efficiently finds the shortest path between two points.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Brain className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Grid Size: {gridSize}x{gridSize}</label>
                <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
                  <SelectTrigger className="w-full" disabled={isRunning}>
                    <SelectValue placeholder="Select grid size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5x5</SelectItem>
                    <SelectItem value="10">10x10</SelectItem>
                    <SelectItem value="15">15x15</SelectItem>
                    <SelectItem value="20">20x20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Heuristic Function</label>
                <Select value={heuristic} onValueChange={(value) => setHeuristic(value as HeuristicType)}>
                  <SelectTrigger className="w-full" disabled={isRunning}>
                    <SelectValue placeholder="Select heuristic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                    <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                    <SelectItem value="chebyshev">Chebyshev Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={toggleAlgorithm} 
                  className="bg-drona-green hover:bg-drona-green/90"
                  disabled={startPos.x === goalPos.x && startPos.y === goalPos.y}
                >
                  {isRunning ? 'Stop Algorithm' : 'Start Algorithm'}
                </Button>
                <Button onClick={resetGrid} variant="outline">Reset Grid</Button>
                <Button onClick={toggleObstaclePlacing} variant="outline" className={placingObstacles ? "bg-gray-200" : ""}>
                  {placingObstacles ? 'Stop Adding Obstacles' : 'Add Obstacles'}
                </Button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-drona-gray">
                  Start Position: ({startPos.x}, {startPos.y})
                </p>
                <p className="text-sm text-drona-gray">
                  Goal Position: ({goalPos.x}, {goalPos.y})
                </p>
                <p className="text-sm text-drona-gray mt-2">
                  Click to set start position. Shift+Click to set goal position.
                </p>
                <p className="text-sm text-drona-gray">
                  Click "Add Obstacles" then click on the grid to add/remove obstacles.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6 shadow-md flex flex-col min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Visualization</h3>
            
            <div className="flex-grow bg-gray-50 rounded-md flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={400}
                className="border border-gray-200 rounded-md bg-white cursor-pointer"
                onClick={handleCanvasClick}
              ></canvas>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4CAF50] mr-2"></div>
                <span className="text-sm">Start</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FF5722] mr-2"></div>
                <span className="text-sm">Goal</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#263238] mr-2"></div>
                <span className="text-sm">Obstacle</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#FFC107] mr-2"></div>
                <span className="text-sm">Path</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#B3E5FC] mr-2"></div>
                <span className="text-sm">Visited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border border-gray-200 mr-2"></div>
                <span className="text-sm">Unexplored</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AStarVisualizer;
