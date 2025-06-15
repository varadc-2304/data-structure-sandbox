import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface Position {
  x: number;
  y: number;
  value: number;
}

interface Step {
  position: Position;
  neighbors: Position[];
  bestNeighbor?: Position;
  description: string;
  isStuck?: boolean;
}

const HillClimbingVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1.0); // Default speed 1.0x
  const [steps, setSteps] = useState<Step[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [startPosition, setStartPosition] = useState<Position>({ x: 1, y: 1, value: 0 });
  const [currentMap, setCurrentMap] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Different landscape functions
  const landscapes = [
    // Multi-modal function with several peaks
    (x: number, y: number): number => {
      const peak1 = 100 * Math.exp(-((x - 3) ** 2 + (y - 3) ** 2) / 2);
      const peak2 = 80 * Math.exp(-((x - 7) ** 2 + (y - 7) ** 2) / 1.5);
      const peak3 = 60 * Math.exp(-((x - 2) ** 2 + (y - 8) ** 2) / 1.2);
      const peak4 = 90 * Math.exp(-((x - 8) ** 2 + (y - 2) ** 2) / 1.8);
      const noise = 5 * Math.sin(x) * Math.cos(y);
      return peak1 + peak2 + peak3 + peak4 + noise;
    },
    // Single central peak with plateau
    (x: number, y: number): number => {
      const centralPeak = 150 * Math.exp(-((x - 5) ** 2 + (y - 5) ** 2) / 3);
      const plateau = 40 * Math.exp(-((x - 2) ** 2 + (y - 2) ** 2) / 8);
      const ridge = 30 * Math.exp(-((x - 8) ** 2) / 2) * Math.exp(-((y - 8) ** 2) / 2);
      return centralPeak + plateau + ridge;
    },
    // Valley with multiple local maxima
    (x: number, y: number): number => {
      const peak1 = 120 * Math.exp(-((x - 1) ** 2 + (y - 9) ** 2) / 1.5);
      const peak2 = 100 * Math.exp(-((x - 9) ** 2 + (y - 1) ** 2) / 1.8);
      const peak3 = 80 * Math.exp(-((x - 5) ** 2 + (y - 8) ** 2) / 2);
      const peak4 = 70 * Math.exp(-((x - 2) ** 2 + (y - 2) ** 2) / 1.2);
      const valley = -20 * Math.exp(-((x - 5) ** 2 + (y - 5) ** 2) / 4);
      return peak1 + peak2 + peak3 + peak4 + valley + 20;
    }
  ];

  const mapNames = ["Multi-Peak Landscape", "Central Peak with Plateau", "Valley with Local Maxima"];

  const changeMap = () => {
    const newMapIndex = (currentMap + 1) % landscapes.length;
    setCurrentMap(newMapIndex);
    const newHeight = getHeight(startPosition.x, startPosition.y, newMapIndex);
    setStartPosition({ ...startPosition, value: newHeight });
    resetVisualization();
  };

  // Function to calculate height at any point using current landscape
  const getHeight = (x: number, y: number, mapIndex?: number): number => {
    const landscapeIndex = mapIndex !== undefined ? mapIndex : currentMap;
    return landscapes[landscapeIndex](x, y);
  };

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (isPlaying) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 50);
    const y = Math.floor((event.clientY - rect.top) / 40);
    
    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
      const newStart = { x, y, value: getHeight(x, y) };
      setStartPosition(newStart);
      resetVisualization();
    }
  };

  const getNeighbors = (pos: Position): Position[] => {
    const neighbors: Position[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
      const newX = pos.x + dx;
      const newY = pos.y + dy;
      
      if (newX >= 0 && newX <= 10 && newY <= 10) {
        neighbors.push({
          x: newX,
          y: newY,
          value: getHeight(newX, newY)
        });
      }
    });

    return neighbors;
  };

  const generateHillClimbingSteps = useCallback(() => {
    const newSteps: Step[] = [];
    const newPath: Position[] = [startPosition];
    let currentPos = startPosition;
    let stuck = false;

    newSteps.push({
      position: currentPos,
      neighbors: [],
      description: `Starting hill climbing at position (${currentPos.x}, ${currentPos.y}) with height ${currentPos.value.toFixed(2)}`
    });

    for (let i = 0; i < 15 && !stuck; i++) {
      const neighbors = getNeighbors(currentPos);
      const bestNeighbor = neighbors.reduce((best, neighbor) => 
        neighbor.value > best.value ? neighbor : best
      );

      if (bestNeighbor.value <= currentPos.value) {
        newSteps.push({
          position: currentPos,
          neighbors,
          bestNeighbor,
          description: `Local maximum reached! No neighbor has higher value than ${currentPos.value.toFixed(2)}`,
          isStuck: true
        });
        stuck = true;
      } else {
        newSteps.push({
          position: currentPos,
          neighbors,
          bestNeighbor,
          description: `Moving from (${currentPos.x}, ${currentPos.y}) to (${bestNeighbor.x}, ${bestNeighbor.y}). Height: ${currentPos.value.toFixed(2)} → ${bestNeighbor.value.toFixed(2)}`
        });
        
        currentPos = bestNeighbor;
        newPath.push(currentPos);
      }
    }

    setSteps(newSteps);
    setPath(newPath);
  }, [startPosition, currentMap]);

  useEffect(() => {
    const newHeight = getHeight(startPosition.x, startPosition.y);
    setStartPosition(prev => ({ ...prev, value: newHeight }));
  }, [currentMap]);

  useEffect(() => {
    generateHillClimbingSteps();
  }, [generateHillClimbingSteps]);

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
    if (currentStep === -1) return 'Ready to start hill climbing algorithm';
    const step = steps[currentStep];
    return step ? step.description : 'Hill climbing complete!';
  };

  const getCurrentPosition = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].position;
    }
    return null;
  };

  const getCurrentNeighbors = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].neighbors;
    }
    return [];
  };

  const getBestNeighbor = () => {
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].bestNeighbor;
    }
    return null;
  };

  const getColorForHeight = (height: number): string => {
    const maxHeight = 200;
    const intensity = Math.min(height / maxHeight, 1);
    const red = Math.floor(255 * (1 - intensity));
    const green = Math.floor(255 * intensity);
    return `rgb(${red}, ${green}, 0)`;
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Hill Climbing Algorithm</h1>
          <p className="text-lg text-drona-gray">
            Watch the hill climbing algorithm search for the highest peak in a landscape
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Map Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button 
                  onClick={changeMap}
                  variant="outline"
                  className="w-full font-semibold border-2 hover:border-drona-green/50"
                  disabled={isPlaying}
                >
                  <Map className="mr-2 h-4 w-4" />
                  Change Map
                </Button>
                <div className="text-sm text-drona-gray">
                  Current map: {mapNames[currentMap]}
                </div>
                <div className="text-xs text-drona-gray mt-2 p-3 bg-drona-light/30 rounded-lg">
                  Click on any square in the map to set the starting position
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Starting Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="text-sm text-drona-gray">
                  Current start: ({startPosition.x}, {startPosition.y}) → Height: {startPosition.value.toFixed(2)}
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
                <CardTitle className="text-xl font-bold text-drona-dark">Current State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {getCurrentPosition() && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Position</p>
                      <p className="text-lg font-bold text-drona-dark">
                        ({getCurrentPosition()!.x}, {getCurrentPosition()!.y})
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Height</p>
                      <p className="text-lg font-bold text-drona-dark">
                        {getCurrentPosition()!.value.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Neighbors</p>
                      <p className="text-lg font-bold text-drona-dark">
                        {getCurrentNeighbors().length}
                      </p>
                    </div>
                    {getBestNeighbor() && (
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-300">
                        <p className="text-sm font-semibold text-drona-gray">Best Neighbor</p>
                        <p className="text-sm font-bold text-drona-dark">
                          ({getBestNeighbor()!.x}, {getBestNeighbor()!.y}) → {getBestNeighbor()!.value.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Hill Climbing Search</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg 
                    width="550" 
                    height="450" 
                    viewBox="0 0 550 450" 
                    className="border rounded-lg bg-white mx-auto cursor-pointer"
                    onClick={handleMapClick}
                  >
                    {Array.from({ length: 11 }, (_, x) =>
                      Array.from({ length: 11 }, (_, y) => {
                        const height = getHeight(x, y);
                        return (
                          <rect
                            key={`${x}-${y}`}
                            x={x * 50}
                            y={y * 40}
                            width="50"
                            height="40"
                            fill={getColorForHeight(height)}
                            opacity="0.7"
                            stroke="#ddd"
                            strokeWidth="1"
                            className="hover:opacity-90 transition-opacity cursor-pointer"
                          />
                        );
                      })
                    )}
                    
                    <circle
                      cx={startPosition.x * 50 + 25}
                      cy={startPosition.y * 40 + 20}
                      r="8"
                      fill="#8b5cf6"
                      stroke="#7c3aed"
                      strokeWidth="2"
                      opacity="0.8"
                    />
                    
                    {path.length > 1 && currentStep >= 0 && (
                      <polyline
                        points={path.slice(0, Math.min(currentStep + 1, path.length)).map(p => `${p.x * 50 + 25},${p.y * 40 + 20}`).join(' ')}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    {getCurrentPosition() && (
                      <circle
                        cx={getCurrentPosition()!.x * 50 + 25}
                        cy={getCurrentPosition()!.y * 40 + 20}
                        r="12"
                        fill="#dc2626"
                        stroke="#991b1b"
                        strokeWidth="3"
                      />
                    )}
                    
                    {getCurrentNeighbors().map((neighbor, index) => (
                      <circle
                        key={index}
                        cx={neighbor.x * 50 + 25}
                        cy={neighbor.y * 40 + 20}
                        r="8"
                        fill="#60a5fa"
                        opacity="0.7"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    ))}
                    
                    {getBestNeighbor() && (
                      <circle
                        cx={getBestNeighbor()!.x * 50 + 25}
                        cy={getBestNeighbor()!.y * 40 + 20}
                        r="10"
                        fill="#22c55e"
                        stroke="#16a34a"
                        strokeWidth="3"
                      />
                    )}
                    
                    {Array.from({ length: 11 }, (_, i) => (
                      <g key={i}>
                        <text x={i * 50 + 25} y="435" textAnchor="middle" className="text-xs text-drona-gray">{i}</text>
                        <text x="10" y={i * 40 + 25} textAnchor="middle" className="text-xs text-drona-gray">{i}</text>
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

                {currentStep >= 0 && steps[currentStep]?.isStuck && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
                    <h3 className="text-xl font-bold text-drona-dark mb-2">🏔️ Local Maximum Found!</h3>
                    <p className="text-sm text-drona-gray">
                      The algorithm has reached a local maximum and cannot improve further.
                      This is a limitation of basic hill climbing - it can get stuck at local optima.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-4 mt-6">
                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-purple-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Start Position</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-red-600 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Current Position</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Neighbors</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
                    <CardContent className="text-center p-4">
                      <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-sm font-bold text-drona-dark">Best Neighbor</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">Algorithm Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                      <li>Start at an initial position (click on the map to set)</li>
                      <li>Evaluate all neighboring positions</li>
                      <li>Move to the neighbor with the highest value</li>
                      <li>Repeat until no neighbor is better (local maximum)</li>
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

export default HillClimbingVisualizer;
