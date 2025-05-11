
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Point {
  x: number;
  y: number;
  z: number;
}

const HillClimbingVisualizer = () => {
  const [stepSize, setStepSize] = useState(0.1);
  const [maxIterations, setMaxIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [landscape, setLandscape] = useState<number[][]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point>({ x: 0, y: 0, z: 0 });
  const [path, setPath] = useState<Point[]>([]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  const landscapeSize = 50; // 50x50 grid
  const canvasWidth = 400;
  const canvasHeight = 400;
  const gridStep = canvasWidth / landscapeSize;

  // Create a function landscape
  const generateLandscape = () => {
    const peaks: { x: number, y: number, height: number, width: number }[] = [
      { x: landscapeSize / 2, y: landscapeSize / 2, height: 1, width: 10 },
      { x: landscapeSize / 4, y: landscapeSize / 4, height: 0.7, width: 5 },
      { x: 3 * landscapeSize / 4, y: 3 * landscapeSize / 4, height: 0.85, width: 7 }
    ];
    
    const newLandscape: number[][] = [];
    
    for (let i = 0; i < landscapeSize; i++) {
      newLandscape[i] = [];
      for (let j = 0; j < landscapeSize; j++) {
        // Base elevation with some noise
        let elevation = 0.1 + Math.random() * 0.05;
        
        // Add peaks
        peaks.forEach(peak => {
          const distance = Math.sqrt(
            Math.pow(i - peak.x, 2) + Math.pow(j - peak.y, 2)
          );
          
          // Gaussian function for the peak
          const peakValue = peak.height * Math.exp(
            -distance * distance / (2 * peak.width * peak.width)
          );
          
          elevation += peakValue;
        });
        
        newLandscape[i][j] = elevation;
      }
    }
    
    return newLandscape;
  };

  // Initialize the visualization
  const initializeVisualization = () => {
    const newLandscape = generateLandscape();
    setLandscape(newLandscape);
    
    // Start from a random position
    const startX = Math.floor(Math.random() * landscapeSize);
    const startY = Math.floor(Math.random() * landscapeSize);
    const startZ = newLandscape[startX][startY];
    
    const startPoint = { x: startX, y: startY, z: startZ };
    setCurrentPoint(startPoint);
    setPath([startPoint]);
    setCurrentIteration(0);
  };

  // Get the value at a specific position, with bounds checking
  const getValue = (x: number, y: number): number => {
    x = Math.max(0, Math.min(landscapeSize - 1, Math.round(x)));
    y = Math.max(0, Math.min(landscapeSize - 1, Math.round(y)));
    return landscape[x][y];
  };

  // Find the highest neighbor
  const findBestNeighbor = (x: number, y: number): Point => {
    const neighbors: Point[] = [];
    
    // Check all 8 directions
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // Skip center
        
        const newX = x + dx * stepSize;
        const newY = y + dy * stepSize;
        
        // Skip if out of bounds
        if (
          newX < 0 || newX >= landscapeSize ||
          newY < 0 || newY >= landscapeSize
        ) {
          continue;
        }
        
        const newZ = getValue(newX, newY);
        neighbors.push({ x: newX, y: newY, z: newZ });
      }
    }
    
    // Find neighbor with highest z value
    return neighbors.reduce((best, current) => {
      return current.z > best.z ? current : best;
    }, neighbors[0] || currentPoint);
  };

  // Run one iteration of hill climbing
  const runIteration = () => {
    if (currentIteration >= maxIterations) {
      setIsRunning(false);
      toast({
        title: "Algorithm Complete",
        description: "Reached maximum iterations."
      });
      return;
    }
    
    const bestNeighbor = findBestNeighbor(currentPoint.x, currentPoint.y);
    
    // If we found a better neighbor
    if (bestNeighbor && bestNeighbor.z > currentPoint.z) {
      setCurrentPoint(bestNeighbor);
      setPath(prev => [...prev, bestNeighbor]);
    } else {
      // Local maximum reached
      setIsRunning(false);
      toast({
        title: "Local Maximum Found",
        description: `Found a peak at height ${currentPoint.z.toFixed(3)}.`
      });
      return;
    }
    
    setCurrentIteration(prev => prev + 1);
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
    }
  };

  // Toggle algorithm state
  const toggleAlgorithm = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    
    if (newIsRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
      toast({
        title: "Algorithm Started",
        description: "Hill climbing optimization has started."
      });
    } else {
      cancelAnimationFrame(animationRef.current);
      toast({
        title: "Algorithm Paused",
        description: "Hill climbing optimization has been paused."
      });
    }
  };

  // Reset the landscape
  const resetLandscape = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    initializeVisualization();
    toast({
      title: "Landscape Reset",
      description: "New landscape has been generated."
    });
  };

  // Draw the visualization
  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw landscape as a heatmap
    for (let i = 0; i < landscapeSize; i++) {
      for (let j = 0; j < landscapeSize; j++) {
        const elevation = landscape[i][j];
        
        // Map elevation to color
        // Higher elevations are warmer colors (reds)
        // Lower elevations are cooler colors (blues)
        const r = Math.floor(elevation * 255);
        const g = Math.floor(128 - elevation * 128);
        const b = Math.floor(255 - elevation * 255);
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(i * gridStep, j * gridStep, gridStep, gridStep);
      }
    }

    // Draw path
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0].x * gridStep, path[0].y * gridStep);
      
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x * gridStep, path[i].y * gridStep);
      }
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw current point
    ctx.beginPath();
    ctx.arc(
      currentPoint.x * gridStep, 
      currentPoint.y * gridStep, 
      5, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    // Display info
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    
    const text = `Iteration: ${currentIteration}/${maxIterations}`;
    ctx.fillText(text, 10, 20);
    ctx.strokeText(text, 10, 20);
    
    const heightText = `Height: ${currentPoint.z.toFixed(3)}`;
    ctx.fillText(heightText, 10, 45);
    ctx.strokeText(heightText, 10, 45);
  };

  // Initialize data on component mount
  useEffect(() => {
    initializeVisualization();
  }, []);

  // Update visualization when data changes
  useEffect(() => {
    if (landscape.length > 0) {
      drawVisualization();
    }
  }, [landscape, currentPoint, path, currentIteration]);

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
          <h1 className="text-3xl font-bold text-drona-dark mb-2">Hill Climbing Algorithm</h1>
          <p className="text-drona-gray">
            Learn how hill climbing optimization algorithm searches for solutions in a multi-dimensional space.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Shield className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Step Size: {stepSize}</label>
                <Slider 
                  value={[stepSize * 100]} 
                  min={1} 
                  max={50} 
                  step={1} 
                  onValueChange={values => setStepSize(values[0] / 100)}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Max Iterations: {maxIterations}</label>
                <Slider 
                  value={[maxIterations]} 
                  min={10} 
                  max={500} 
                  step={10} 
                  onValueChange={values => setMaxIterations(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={toggleAlgorithm} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Algorithm' : 'Start Algorithm'}
                </Button>
                <Button onClick={resetLandscape} variant="outline">Reset Landscape</Button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-drona-gray">
                  Iteration: {currentIteration}/{maxIterations}
                </p>
                <p className="text-sm text-drona-gray">
                  Current Height: {currentPoint.z ? currentPoint.z.toFixed(3) : "0"}
                </p>
                <p className="text-sm text-drona-gray mt-2">
                  Warmer colors (red) represent higher elevations, cooler colors (blue) represent lower elevations.
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
                className="border border-gray-200 rounded-md bg-white"
              ></canvas>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HillClimbingVisualizer;
