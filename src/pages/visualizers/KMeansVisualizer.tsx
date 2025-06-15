import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface DataPoint {
  id: number;
  x: number;
  y: number;
  cluster?: number;
}

interface Centroid {
  id: number;
  x: number;
  y: number;
}

interface KMeansStep {
  centroids: Centroid[];
  dataPoints: DataPoint[];
  assignments: { [key: number]: number };
  description: string;
}

const KMeansVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [k, setK] = useState(3);
  const [maxIterations, setMaxIterations] = useState(10);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: 1, x: 2, y: 3 },
    { id: 2, x: 8, y: 5 },
    { id: 3, x: 4, y: 7 },
    { id: 4, x: 1, y: 5 },
    { id: 5, x: 5, y: 2 },
    { id: 6, x: 7, y: 7 },
    { id: 7, x: 3, y: 9 },
    { id: 8, x: 6, y: 4 },
  ]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [kmeansSteps, setKMeansSteps] = useState<KMeansStep[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomData = () => {
    const newDataPoints: DataPoint[] = [];
    for (let i = 0; i < 10; i++) {
      newDataPoints.push({
        id: i + 1,
        x: Math.random() * 9 + 1,
        y: Math.random() * 9 + 1,
      });
    }
    setDataPoints(newDataPoints);
    resetVisualization();
  };

  const initializeCentroids = useCallback(() => {
    const initialCentroids: Centroid[] = [];
    const shuffledDataPoints = [...dataPoints].sort(() => Math.random() - 0.5);
    for (let i = 0; i < k; i++) {
      initialCentroids.push({
        id: i + 1,
        x: shuffledDataPoints[i].x,
        y: shuffledDataPoints[i].y,
      });
    }
    setCentroids(initialCentroids);
    return initialCentroids;
  }, [dataPoints, k]);

  const assignToClusters = (dataPoints: DataPoint[], centroids: Centroid[]): { [key: number]: number } => {
    const assignments: { [key: number]: number } = {};
    dataPoints.forEach(point => {
      let closestCentroidId = centroids[0].id;
      let minDistance = calculateDistance(point, centroids[0]);

      centroids.forEach(centroid => {
        const distance = calculateDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidId = centroid.id;
        }
      });
      assignments[point.id] = closestCentroidId;
    });
    return assignments;
  };

  const updateCentroids = (dataPoints: DataPoint[], assignments: { [key: number]: number }, centroids: Centroid[]): Centroid[] => {
    const newCentroids: Centroid[] = centroids.map(centroid => ({ ...centroid, x: 0, y: 0 }));
    const clusterCounts: { [key: number]: number } = {};

    dataPoints.forEach(point => {
      const centroidId = assignments[point.id];
      if (centroidId) {
        const centroid = newCentroids.find(c => c.id === centroidId);
        if (centroid) {
          centroid.x += point.x;
          centroid.y += point.y;
          clusterCounts[centroidId] = (clusterCounts[centroidId] || 0) + 1;
        }
      }
    });

    newCentroids.forEach(centroid => {
      const count = clusterCounts[centroid.id] || 1;
      centroid.x /= count;
      centroid.y /= count;
    });

    return newCentroids;
  };

  const calculateDistance = (point: DataPoint, centroid: Centroid): number => {
    return Math.sqrt((point.x - centroid.x) ** 2 + (point.y - centroid.y) ** 2);
  };

  const generateKMeansSteps = useCallback(() => {
    let currentDataPoints = dataPoints.map(dp => ({ ...dp }));
    let currentCentroids = initializeCentroids();
    const steps: KMeansStep[] = [];

    steps.push({
      centroids: currentCentroids.map(c => ({ ...c })),
      dataPoints: currentDataPoints.map(dp => ({ ...dp })),
      assignments: {},
      description: 'Initialized K-means with random centroids',
    });

    for (let i = 0; i < maxIterations; i++) {
      const assignments = assignToClusters(currentDataPoints, currentCentroids);
      currentDataPoints = currentDataPoints.map(dp => ({ ...dp, cluster: assignments[dp.id] }));
      const newCentroids = updateCentroids(currentDataPoints, assignments, currentCentroids);

      steps.push({
        centroids: newCentroids.map(c => ({ ...c })),
        dataPoints: currentDataPoints.map(dp => ({ ...dp })),
        assignments: assignments,
        description: `Iteration ${i + 1}: Assigned data points to clusters and updated centroids`,
      });

      currentCentroids = newCentroids;
    }

    setKMeansSteps(steps);
  }, [dataPoints, initializeCentroids, maxIterations]);

  useEffect(() => {
    generateKMeansSteps();
  }, [generateKMeansSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= kmeansSteps.length - 1) {
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
  }, [isPlaying, currentStep, kmeansSteps.length, speed]);

  const togglePlayPause = () => {
    if (currentStep >= kmeansSteps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < kmeansSteps.length - 1) {
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
    setCurrentStep(Math.max(-1, Math.min(step, kmeansSteps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(kmeansSteps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    generateKMeansSteps();
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to start K-means clustering';
    const step = kmeansSteps[currentStep];
    return step ? step.description : 'K-means clustering complete!';
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">K-Means Clustering</h1>
          <p className="text-lg text-drona-gray">
            Watch the K-means algorithm find clusters in data through iterative centroid updates
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
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2 border-drona-green/20">
                  <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                    <CardTitle className="text-xl font-bold text-drona-dark">K-Means Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-drona-dark">
                        Number of Clusters (K): {k}
                      </label>
                      <Slider
                        value={[k]}
                        onValueChange={([value]) => setK(value)}
                        max={5}
                        min={2}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-drona-dark">
                        Max Iterations: {maxIterations}
                      </label>
                      <Slider
                        value={[maxIterations]}
                        onValueChange={([value]) => setMaxIterations(value)}
                        max={20}
                        min={5}
                        step={1}
                        className="w-full"
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
                        disabled={currentStep >= kmeansSteps.length - 1}
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
                        Step: {currentStep + 2} of {kmeansSteps.length + 1}
                      </label>
                      <Slider
                        value={[currentStep + 1]}
                        onValueChange={([value]) => goToStep(value - 1)}
                        max={kmeansSteps.length}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-drona-dark">
                        Speed: {((3000 - speed) / 100).toFixed(1)}x
                      </label>
                      <Slider
                        value={[speed]}
                        onValueChange={([value]) => setSpeed(value)}
                        max={2500}
                        min={500}
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
              </div>

              {/* Visualization Panel */}
              <div className="lg:col-span-3">
                <Card className="shadow-lg border-2 border-drona-green/20 h-full">
                  <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                    <CardTitle className="text-2xl font-bold text-drona-dark">K-Means Clustering Visualization</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <svg width="600" height="400" viewBox="0 0 600 400" className="border rounded-lg bg-white mx-auto">
                        {/* Data points */}
                        {kmeansSteps[currentStep]?.dataPoints.map(point => (
                          <circle
                            key={point.id}
                            cx={point.x * 60}
                            cy={point.y * 40}
                            r="8"
                            fill={point.cluster ? getColor(point.cluster) : '#9ca3af'}
                            stroke="#4b5563"
                            strokeWidth="2"
                          />
                        ))}

                        {/* Centroids */}
                        {kmeansSteps[currentStep]?.centroids.map(centroid => (
                          <g key={centroid.id}>
                            <circle
                              cx={centroid.x * 60}
                              cy={centroid.y * 40}
                              r="12"
                              fill={getColor(centroid.id)}
                              stroke="#1f2937"
                              strokeWidth="3"
                            />
                            <text
                              x={centroid.x * 60}
                              y={centroid.y * 40 + 4}
                              textAnchor="middle"
                              className="text-xs font-bold fill-white"
                            >
                              {centroid.id}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                      <h3 className="font-bold text-drona-dark mb-2">Step Description:</h3>
                      <p className="text-sm text-drona-gray">
                        {getStepDescription()}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {[1, 2, 3, 4, 5].slice(0, k).map(clusterId => (
                        <Card key={clusterId} className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                          <CardContent className="text-center p-4">
                            <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: getColor(clusterId) }}></div>
                            <p className="text-sm font-bold text-drona-dark">Cluster {clusterId}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">K-Means Algorithm</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li>Initialize K centroids randomly</li>
                          <li>Assign each data point to the nearest centroid</li>
                          <li>Update centroids to the mean of their assigned points</li>
                          <li>Repeat until convergence or max iterations reached</li>
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
                <CardTitle className="text-2xl font-bold text-drona-dark">K-Means Clustering Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-drona-dark mb-4">How K-Means Works</h3>
                  
                  <div className="bg-drona-light/30 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-drona-dark mb-3">Algorithm Steps:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                      <li><strong>Initialize:</strong> Choose K (number of clusters) and randomly place K centroids</li>
                      <li><strong>Assign:</strong> Assign each data point to the nearest centroid</li>
                      <li><strong>Update:</strong> Move each centroid to the center of its assigned points</li>
                      <li><strong>Repeat:</strong> Continue steps 2-3 until centroids stop moving significantly</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-drona-gray">O(n × k × i × d)</p>
                        <ul className="text-sm text-drona-gray mt-2 space-y-1">
                          <li>n = number of data points</li>
                          <li>k = number of clusters</li>
                          <li>i = number of iterations</li>
                          <li>d = number of dimensions</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm text-drona-gray space-y-1">
                          <li>• Customer segmentation</li>
                          <li>• Image compression</li>
                          <li>• Market research</li>
                          <li>• Data preprocessing</li>
                          <li>• Pattern recognition</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-lg">
                    <h4 className="font-bold text-drona-dark mb-3">Important Notes:</h4>
                    <ul className="text-drona-gray space-y-2">
                      <li>• <strong>Choosing K:</strong> The number of clusters must be specified beforehand</li>
                      <li>• <strong>Initialization:</strong> Different starting positions can lead to different results</li>
                      <li>• <strong>Convergence:</strong> Algorithm stops when centroids stabilize or max iterations reached</li>
                      <li>• <strong>Distance Metric:</strong> Usually uses Euclidean distance to measure similarity</li>
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

// Helper function to generate consistent colors for clusters
const getColor = (clusterId: number): string => {
  const colors = ['#ef4444', '#3b82f6', '#16a34a', '#eab308', '#9333ea'];
  return colors[(clusterId - 1) % colors.length];
};

export default KMeansVisualizer;
