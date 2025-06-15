import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Point {
  x: number;
  y: number;
  cluster: number;
  id: number;
}

interface Centroid {
  x: number;
  y: number;
  cluster: number;
  prevX?: number;
  prevY?: number;
}

interface Step {
  points: Point[];
  centroids: Centroid[];
  description: string;
  convergence?: number;
}

const KMeansVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000); // Default to 1.0x speed
  const [k, setK] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  
  const generateRandomPoints = (count: number = 50): Point[] => {
    const points: Point[] = [];
    
    // Generate clusters of points for better visualization
    const clusterCenters = [
      { x: 150, y: 150 },
      { x: 350, y: 150 },
      { x: 250, y: 300 },
      { x: 150, y: 300 },
      { x: 350, y: 300 }
    ];
    
    for (let i = 0; i < count; i++) {
      const centerIndex = i % clusterCenters.length;
      const center = clusterCenters[centerIndex];
      
      points.push({
        x: center.x + (Math.random() - 0.5) * 100,
        y: center.y + (Math.random() - 0.5) * 100,
        cluster: -1,
        id: i
      });
    }
    
    return points;
  };

  const initializeCentroids = (points: Point[], k: number): Centroid[] => {
    const centroids: Centroid[] = [];
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: Math.random() * 450 + 50,
        y: Math.random() * 350 + 50,
        cluster: i
      });
    }
    return centroids;
  };

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const assignPointsToClusters = (points: Point[], centroids: Centroid[]): Point[] => {
    return points.map(point => {
      let minDistance = Infinity;
      let closestCluster = 0;
      
      centroids.forEach((centroid, index) => {
        const distance = calculateDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = index;
        }
      });
      
      return { ...point, cluster: closestCluster };
    });
  };

  const updateCentroids = (points: Point[], centroids: Centroid[]): Centroid[] => {
    return centroids.map(centroid => {
      const clusterPoints = points.filter(p => p.cluster === centroid.cluster);
      
      if (clusterPoints.length === 0) {
        return centroid;
      }
      
      const newX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const newY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
      
      return {
        ...centroid,
        prevX: centroid.x,
        prevY: centroid.y,
        x: newX,
        y: newY
      };
    });
  };

  const calculateConvergence = (oldCentroids: Centroid[], newCentroids: Centroid[]): number => {
    let totalMovement = 0;
    for (let i = 0; i < oldCentroids.length; i++) {
      totalMovement += calculateDistance(oldCentroids[i], newCentroids[i]);
    }
    return totalMovement;
  };

  const runKMeans = useCallback((points: Point[], k: number): Step[] => {
    const steps: Step[] = [];
    let currentPoints = [...points];
    let centroids = initializeCentroids(points, k);
    
    // Initial step
    steps.push({
      points: currentPoints.map(p => ({ ...p, cluster: -1 })),
      centroids: [...centroids],
      description: `Initialize ${k} random centroids`
    });

    const maxIterations = 20;
    let converged = false;
    
    for (let iteration = 0; iteration < maxIterations && !converged; iteration++) {
      // Assign points to clusters
      currentPoints = assignPointsToClusters(currentPoints, centroids);
      steps.push({
        points: [...currentPoints],
        centroids: [...centroids],
        description: `Iteration ${iteration + 1}: Assign points to nearest centroids`
      });
      
      // Update centroids
      const oldCentroids = [...centroids];
      centroids = updateCentroids(currentPoints, centroids);
      const convergence = calculateConvergence(oldCentroids, centroids);
      
      steps.push({
        points: [...currentPoints],
        centroids: [...centroids],
        description: `Iteration ${iteration + 1}: Update centroids to cluster centers`,
        convergence
      });
      
      if (convergence < 1) {
        converged = true;
        steps.push({
          points: [...currentPoints],
          centroids: [...centroids],
          description: `Converged! Centroids have stabilized.`,
          convergence
        });
      }
    }
    
    return steps;
  }, []);

  const [points] = useState<Point[]>(() => generateRandomPoints(50));
  const [steps, setSteps] = useState<Step[]>(() => runKMeans(generateRandomPoints(50), 3));
  const maxSteps = steps.length;

  const regenerateData = () => {
    const newPoints = generateRandomPoints(50);
    const newSteps = runKMeans(newPoints, k);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const updateK = (newK: number[]) => {
    const kValue = newK[0];
    setK(kValue);
    const newSteps = runKMeans(points, kValue);
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const updateStep = useCallback(() => {
    setCurrentStep(prev => {
      const newStep = prev + 1;
      if (newStep >= maxSteps) {
        setIsPlaying(false);
        return maxSteps - 1;
      }
      return newStep;
    });
  }, [maxSteps]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateStep, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, updateStep]);

  const togglePlayPause = () => {
    if (currentStep >= maxSteps - 1) {
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, maxSteps - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">K-means Clustering</h1>
          <p className="text-lg text-drona-gray">
            Visualize how K-means algorithm groups data points into clusters through iterative optimization
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
                    disabled={currentStep <= 0}
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
                    disabled={currentStep >= maxSteps - 1}
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

                <Button 
                  onClick={regenerateData} 
                  variant="outline" 
                  disabled={isPlaying}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <Shuffle className="mr-2 h-4 w-4" /> New Data
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Step: {currentStep + 1} of {maxSteps}
                  </label>
                  <Slider
                    value={[currentStep]}
                    onValueChange={([value]) => goToStep(value)}
                    max={maxSteps - 1}
                    min={0}
                    step={1}
                    className="w-full"
                  />
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

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Number of Clusters (K): {k}
                  </label>
                  <Slider
                    value={[k]}
                    onValueChange={updateK}
                    max={6}
                    min={2}
                    step={1}
                    className="w-full"
                    disabled={isPlaying}
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>2</span>
                    <span>6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Iteration</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.ceil((currentStep + 1) / 2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-3xl font-bold text-drona-dark">{maxSteps}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Clusters (K)</p>
                    <p className="text-xl font-bold text-drona-dark">{k}</p>
                  </div>
                  {currentStepData.convergence !== undefined && (
                    <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Convergence</p>
                      <p className="text-xl font-bold text-drona-dark">{currentStepData.convergence.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">K-means Clustering Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="100%" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white">
                    {/* Draw lines from centroids to their points */}
                    {currentStepData.points
                      .filter(point => point.cluster >= 0)
                      .map(point => {
                        const centroid = currentStepData.centroids[point.cluster];
                        return (
                          <line
                            key={`line-${point.id}`}
                            x1={point.x}
                            y1={point.y}
                            x2={centroid.x}
                            y2={centroid.y}
                            stroke={colors[point.cluster] + '40'}
                            strokeWidth="1"
                            strokeDasharray="2,2"
                          />
                        );
                      })}
                    
                    {/* Draw points */}
                    {currentStepData.points.map(point => (
                      <circle
                        key={point.id}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={point.cluster >= 0 ? colors[point.cluster] : '#94a3b8'}
                        stroke="white"
                        strokeWidth="1"
                        className="transition-all duration-500"
                      />
                    ))}
                    
                    {/* Draw centroid movement lines */}
                    {currentStepData.centroids.map(centroid => (
                      centroid.prevX !== undefined && centroid.prevY !== undefined && (
                        <line
                          key={`movement-${centroid.cluster}`}
                          x1={centroid.prevX}
                          y1={centroid.prevY}
                          x2={centroid.x}
                          y2={centroid.y}
                          stroke={colors[centroid.cluster]}
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                          className="transition-all duration-500"
                        />
                      )
                    ))}
                    
                    {/* Draw centroids */}
                    {currentStepData.centroids.map(centroid => (
                      <g key={centroid.cluster}>
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="8"
                          fill={colors[centroid.cluster]}
                          stroke="white"
                          strokeWidth="3"
                          className="transition-all duration-500"
                        />
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="3"
                          fill="white"
                          className="transition-all duration-500"
                        />
                      </g>
                    ))}
                    
                    {/* Arrow marker definition */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#374151"
                        />
                      </marker>
                    </defs>
                  </svg>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Current Step:</h3>
                  <p className="text-sm text-drona-gray">
                    {currentStepData.description}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-drona-dark">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-400 border border-white"></div>
                        <span className="text-sm text-drona-gray">Unassigned Points</span>
                      </div>
                      {Array.from({ length: k }, (_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-white" 
                            style={{ backgroundColor: colors[i] }}
                          ></div>
                          <span className="text-sm text-drona-gray">Cluster {i + 1}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <span className="text-sm text-drona-gray">Centroids</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-drona-dark">Algorithm Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-drona-gray">
                      <p>1. Initialize K random centroids</p>
                      <p>2. Assign each point to nearest centroid</p>
                      <p>3. Update centroids to cluster centers</p>
                      <p>4. Repeat until convergence</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansVisualizer;
