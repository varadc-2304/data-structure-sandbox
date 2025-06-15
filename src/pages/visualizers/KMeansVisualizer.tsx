import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface DataPoint {
  x: number;
  y: number;
  cluster: number;
  id: number;
}

interface Centroid {
  x: number;
  y: number;
  cluster: number;
}

interface Step {
  type: 'initialization' | 'assignment' | 'update';
  dataPoints: DataPoint[];
  centroids: Centroid[];
  description: string;
}

const KMeansVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1.0); // Default speed 1.0x
  const [steps, setSteps] = useState<Step[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [k, setK] = useState(3);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomData = () => {
    const newDataPoints: DataPoint[] = [];
    const clusters = [
      { x: 100, y: 100, radius: 50 },
      { x: 300, y: 100, radius: 60 },
      { x: 200, y: 300, radius: 70 },
    ];
    
    let id = 0;
    clusters.forEach((cluster, clusterIndex) => {
      const pointsInCluster = 20 + Math.floor(Math.random() * 10);
      for (let i = 0; i < pointsInCluster; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * cluster.radius;
        const x = cluster.x + distance * Math.cos(angle);
        const y = cluster.y + distance * Math.sin(angle);
        
        newDataPoints.push({
          x,
          y,
          cluster: -1, // Initially unassigned
          id: id++
        });
      }
    });
    
    // Shuffle the data points
    for (let i = newDataPoints.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDataPoints[i], newDataPoints[j]] = [newDataPoints[j], newDataPoints[i]];
    }
    
    setDataPoints(newDataPoints);
    resetVisualization();
  };

  const initializeCentroids = useCallback(() => {
    if (dataPoints.length === 0) return [];
    
    // Randomly select k data points as initial centroids
    const shuffled = [...dataPoints].sort(() => 0.5 - Math.random());
    const initialCentroids: Centroid[] = shuffled.slice(0, k).map((point, index) => ({
      x: point.x,
      y: point.y,
      cluster: index
    }));
    
    return initialCentroids;
  }, [dataPoints, k]);

  const distance = (p1: { x: number, y: number }, p2: { x: number, y: number }): number => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const assignClusters = useCallback((points: DataPoint[], centers: Centroid[]): DataPoint[] => {
    return points.map(point => {
      let minDist = Infinity;
      let closestCluster = -1;
      
      centers.forEach(centroid => {
        const dist = distance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = centroid.cluster;
        }
      });
      
      return { ...point, cluster: closestCluster };
    });
  }, []);

  const updateCentroids = useCallback((points: DataPoint[], centers: Centroid[]): Centroid[] => {
    const newCentroids: Centroid[] = [];
    
    centers.forEach(centroid => {
      const clusterPoints = points.filter(p => p.cluster === centroid.cluster);
      
      if (clusterPoints.length === 0) {
        newCentroids.push(centroid); // Keep the old centroid if no points
        return;
      }
      
      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
      
      newCentroids.push({
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length,
        cluster: centroid.cluster
      });
    });
    
    return newCentroids;
  }, []);

  const generateKMeansSteps = useCallback(() => {
    const newSteps: Step[] = [];
    let currentPoints = dataPoints.map(p => ({ ...p, cluster: -1 }));
    let currentCentroids = initializeCentroids();
    
    // Initial step
    newSteps.push({
      type: 'initialization',
      dataPoints: [...currentPoints],
      centroids: [...currentCentroids],
      description: `Initialized ${k} random centroids from the data points.`
    });
    
    // Run K-means for a fixed number of iterations
    for (let iter = 0; iter < 10; iter++) {
      // Assignment step
      currentPoints = assignClusters(currentPoints, currentCentroids);
      newSteps.push({
        type: 'assignment',
        dataPoints: [...currentPoints],
        centroids: [...currentCentroids],
        description: `Iteration ${iter + 1}: Assigned each data point to the closest centroid.`
      });
      
      // Update step
      const newCentroids = updateCentroids(currentPoints, currentCentroids);
      
      // Check if centroids have converged
      let converged = true;
      for (let i = 0; i < currentCentroids.length; i++) {
        if (distance(currentCentroids[i], newCentroids[i]) > 0.1) {
          converged = false;
          break;
        }
      }
      
      currentCentroids = newCentroids;
      newSteps.push({
        type: 'update',
        dataPoints: [...currentPoints],
        centroids: [...currentCentroids],
        description: `Iteration ${iter + 1}: Updated centroids to the mean position of all points in each cluster.`
      });
      
      if (converged) {
        newSteps.push({
          type: 'update',
          dataPoints: [...currentPoints],
          centroids: [...currentCentroids],
          description: `K-means has converged after ${iter + 1} iterations! Centroids are stable.`
        });
        break;
      }
    }
    
    setSteps(newSteps);
    setCentroids(currentCentroids);
  }, [dataPoints, k, initializeCentroids, assignClusters, updateCentroids]);

  useEffect(() => {
    if (dataPoints.length > 0) {
      generateKMeansSteps();
    }
  }, [dataPoints, generateKMeansSteps]);

  useEffect(() => {
    if (dataPoints.length === 0) {
      generateRandomData();
    }
  }, []);

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
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to start K-means clustering';
    const step = steps[currentStep];
    return step ? step.description : 'K-means complete!';
  };

  const getCurrentDataPoints = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].dataPoints;
    }
    return dataPoints.map(p => ({ ...p, cluster: -1 }));
  };

  const getCurrentCentroids = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].centroids;
    }
    return [];
  };

  const getClusterColors = () => {
    return [
      '#ef4444', // red
      '#3b82f6', // blue
      '#22c55e', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
    ];
  };

  const getClusterStats = () => {
    const currentPoints = getCurrentDataPoints();
    const stats = [];
    
    for (let i = 0; i < k; i++) {
      const clusterPoints = currentPoints.filter(p => p.cluster === i);
      stats.push({
        cluster: i,
        count: clusterPoints.length,
        color: getClusterColors()[i % getClusterColors().length]
      });
    }
    
    return stats;
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">K-means Clustering</h1>
          <p className="text-lg text-drona-gray">
            Watch how K-means algorithm finds clusters in data through iterative centroid updates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Data Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button 
                  onClick={generateRandomData}
                  variant="outline"
                  className="w-full font-semibold border-2 hover:border-drona-green/50"
                  disabled={isPlaying}
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random Data
                </Button>
                <div className="text-sm text-drona-gray">
                  Current dataset: {dataPoints.length} points
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Number of Clusters (K): {k}
                  </label>
                  <Slider
                    value={[k]}
                    onValueChange={([value]) => {
                      setK(value);
                      if (dataPoints.length > 0) {
                        setTimeout(() => generateKMeansSteps(), 0);
                      }
                    }}
                    max={7}
                    min={2}
                    step={1}
                    className="w-full"
                    disabled={isPlaying}
                  />
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
                <CardTitle className="text-xl font-bold text-drona-dark">Cluster Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-2">
                  {getClusterStats().map(stat => (
                    <div 
                      key={stat.cluster} 
                      className="p-3 rounded-lg border-2"
                      style={{ 
                        backgroundColor: `${stat.color}20`,
                        borderColor: `${stat.color}40`
                      }}
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: stat.color }}
                        ></div>
                        <p className="text-sm font-semibold text-drona-dark">
                          Cluster {stat.cluster + 1}: {stat.count} points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">K-means Clustering Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="500" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white mx-auto">
                    {/* Grid */}
                    {Array.from({ length: 11 }, (_, i) => (
                      <g key={i}>
                        <line x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="#f0f0f0" strokeWidth="1" />
                      </g>
                    ))}
                    
                    {/* Data points */}
                    {getCurrentDataPoints().map((point) => {
                      const color = point.cluster === -1 
                        ? '#9ca3af' // gray for unassigned
                        : getClusterColors()[point.cluster % getClusterColors().length];
                      
                      return (
                        <circle
                          key={point.id}
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          fill={color}
                          stroke={point.cluster === -1 ? '#6b7280' : color}
                          strokeWidth="1"
                          opacity={point.cluster === -1 ? 0.5 : 0.8}
                          className="transition-all duration-500"
                        />
                      );
                    })}
                    
                    {/* Centroids */}
                    {getCurrentCentroids().map((centroid, index) => (
                      <g key={index}>
                        <circle
                          cx={centroid.x}
                          cy={centroid.y}
                          r="8"
                          fill={getClusterColors()[centroid.cluster % getClusterColors().length]}
                          stroke="#000"
                          strokeWidth="2"
                          className="transition-all duration-500"
                        />
                        <text
                          x={centroid.x}
                          y={centroid.y + 4}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {centroid.cluster + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Algorithm Status:</h3>
                  <p className="text-sm text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">K-means Algorithm Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                      <li>Initialize K centroids randomly from the data points</li>
                      <li>Assign each data point to the nearest centroid</li>
                      <li>Update each centroid to the mean position of all points in its cluster</li>
                      <li>Repeat steps 2-3 until centroids no longer move significantly</li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Assignment Step</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">
                        Each data point is assigned to the closest centroid based on Euclidean distance
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Update Step</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">
                        Each centroid is moved to the average position of all points in its cluster
                      </p>
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
