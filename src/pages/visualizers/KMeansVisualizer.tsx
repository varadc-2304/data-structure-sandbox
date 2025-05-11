
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Point {
  x: number;
  y: number;
  cluster: number;
}

interface Centroid {
  x: number;
  y: number;
}

const KMeansVisualizer = () => {
  const [k, setK] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [iterations, setIterations] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  // Initialize points and centroids
  const initializeData = () => {
    // Generate random points
    const newPoints: Point[] = [];
    for (let i = 0; i < 100; i++) {
      newPoints.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        cluster: -1,
      });
    }
    setPoints(newPoints);

    // Initialize centroids
    const newCentroids: Centroid[] = [];
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
      });
    }
    setCentroids(newCentroids);
    setIterations(0);
  };

  // Reset the visualization
  const handleReset = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    initializeData();
    toast({
      title: "Visualization Reset",
      description: "K-means clustering data has been reset."
    });
  };

  // Assign points to nearest centroid
  const assignPointsToClusters = () => {
    const updatedPoints = [...points];
    let changed = false;

    updatedPoints.forEach((point) => {
      const distances = centroids.map((centroid, index) => {
        return {
          index,
          distance: Math.sqrt(
            Math.pow(centroid.x - point.x, 2) + Math.pow(centroid.y - point.y, 2)
          ),
        };
      });

      distances.sort((a, b) => a.distance - b.distance);
      const nearestCluster = distances[0].index;
      
      if (point.cluster !== nearestCluster) {
        point.cluster = nearestCluster;
        changed = true;
      }
    });

    setPoints(updatedPoints);
    return changed;
  };

  // Update centroid positions
  const updateCentroids = () => {
    const newCentroids = [...centroids];

    for (let i = 0; i < k; i++) {
      const clusterPoints = points.filter((point) => point.cluster === i);
      
      if (clusterPoints.length > 0) {
        const sumX = clusterPoints.reduce((sum, point) => sum + point.x, 0);
        const sumY = clusterPoints.reduce((sum, point) => sum + point.y, 0);
        
        newCentroids[i] = {
          x: sumX / clusterPoints.length,
          y: sumY / clusterPoints.length,
        };
      }
    }

    setCentroids(newCentroids);
  };

  // Run one iteration of the k-means algorithm
  const runIteration = () => {
    const changed = assignPointsToClusters();
    updateCentroids();
    setIterations(prev => prev + 1);
    
    if (!changed || iterations > 20) {
      setIsRunning(false);
      toast({
        title: "Algorithm Converged",
        description: `K-means clustering completed in ${iterations + 1} iterations.`
      });
      return;
    }

    if (isRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
    }
  };

  // Toggle algorithm running state
  const toggleAlgorithm = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    
    if (newIsRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
      toast({
        title: "Algorithm Started",
        description: "K-means clustering visualization has started."
      });
    } else {
      cancelAnimationFrame(animationRef.current);
      toast({
        title: "Algorithm Paused",
        description: "K-means clustering visualization has been paused."
      });
    }
  };

  // Draw the visualization
  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      
      if (point.cluster === -1) {
        ctx.fillStyle = '#ccc';
      } else {
        // Cluster colors
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        ctx.fillStyle = colors[point.cluster % colors.length];
      }
      
      ctx.fill();
      ctx.closePath();
    });

    // Draw centroids
    centroids.forEach((centroid, index) => {
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, 8, 0, Math.PI * 2);
      
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    });

    // Draw iteration counter
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Iterations: ${iterations}`, 10, 20);
  };

  // Initialize data on component mount
  useEffect(() => {
    initializeData();
  }, []);

  // Update visualization when data changes
  useEffect(() => {
    drawVisualization();
  }, [points, centroids, iterations]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Re-initialize when k changes
  useEffect(() => {
    handleReset();
  }, [k]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">K-Means Clustering Algorithm</h1>
          <p className="text-drona-gray">
            Visualize how K-means clustering groups similar data points together based on feature similarity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Target className="mr-2 h-5 w-5 text-drona-green" />
              Controls
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Number of Clusters (K): {k}</label>
                <Slider 
                  value={[k]} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={values => setK(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={toggleAlgorithm} 
                  className="bg-drona-green hover:bg-drona-green/90"
                  disabled={points.length === 0}
                >
                  {isRunning ? 'Stop Algorithm' : 'Start Algorithm'}
                </Button>
                <Button onClick={handleReset} variant="outline">Reset</Button>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-drona-gray">
                  Iteration: {iterations}
                </p>
                <p className="text-sm text-drona-gray mt-2">
                  Each color represents a different cluster. Large circles are centroids.
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

export default KMeansVisualizer;
