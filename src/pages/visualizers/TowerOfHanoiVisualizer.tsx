import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface HanoiStep {
  towers: number[][];
  movingDisk: number | null;
  fromTower: number | null;
  toTower: number | null;
}

const TowerOfHanoiVisualizer = () => {
  const [numDisks, setNumDisks] = useState<number>(3);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [hanoiSteps, setHanoiSteps] = useState<HanoiStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [movingDisk, setMovingDisk] = useState<number | null>(null);
  const [fromTower, setFromTower] = useState<number | null>(null);
  const [toTower, setToTower] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);

  // Color palette for disks - vibrant and distinct colors
  const diskColors = [
    'bg-red-500',      // Disk 1 - Red
    'bg-blue-500',     // Disk 2 - Blue
    'bg-green-500',    // Disk 3 - Green
    'bg-yellow-500',   // Disk 4 - Yellow
    'bg-purple-500',   // Disk 5 - Purple
    'bg-pink-500',     // Disk 6 - Pink
    'bg-indigo-500',   // Disk 7 - Indigo
  ];

  const diskBorderColors = [
    'border-red-600',
    'border-blue-600', 
    'border-green-600',
    'border-yellow-600',
    'border-purple-600',
    'border-pink-600',
    'border-indigo-600',
  ];

  useEffect(() => {
    generateTowers();
  }, [numDisks]);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= hanoiSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 1500 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, hanoiSteps.length, speed]);

  const generateTowers = () => {
    const initialTowers: number[][] = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    setHanoiSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setMovingDisk(null);
    setFromTower(null);
    setToTower(null);
    setMoves(0);
  };

  const resetTowers = () => {
    const initialTowers: number[][] = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    setHanoiSteps([]);
    setCurrentStep(-1);
    setIsRunning(false);
    setMovingDisk(null);
    setFromTower(null);
    setToTower(null);
    setMoves(0);
  };

  const calculateHanoiSteps = (n: number, sourceTower: number, destTower: number, auxTower: number): HanoiStep[] => {
    const steps: HanoiStep[] = [];
    const towers: number[][] = [[], [], []];
    
    // Initialize towers
    for (let i = numDisks; i > 0; i--) {
      towers[0].push(i);
    }

    const addStep = (from: number, to: number, disk: number) => {
      steps.push({
        towers: [
          [...towers[0]],
          [...towers[1]],
          [...towers[2]]
        ],
        movingDisk: disk,
        fromTower: from,
        toTower: to
      });
      
      // Move the disk
      towers[to].push(towers[from].pop()!);
    };

    const hanoi = (n: number, source: number, dest: number, aux: number) => {
      if (n === 1) {
        const disk = towers[source][towers[source].length - 1];
        addStep(source, dest, disk);
      } else {
        hanoi(n - 1, source, aux, dest);
        const disk = towers[source][towers[source].length - 1]; 
        addStep(source, dest, disk);
        hanoi(n - 1, aux, dest, source);
      }
    };

    hanoi(n, sourceTower, destTower, auxTower);
    
    // Add the final state to show all disks properly placed
    steps.push({
      towers: [
        [...towers[0]],
        [...towers[1]],
        [...towers[2]]
      ],
      movingDisk: null,
      fromTower: null,
      toTower: null
    });
    
    return steps;
  };

  const startHanoi = () => {
    const steps = calculateHanoiSteps(numDisks, 0, 2, 1);
    setHanoiSteps(steps);
    setCurrentStep(-1);
    setMoves(0);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= hanoiSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    
    const step = hanoiSteps[nextStepIndex];
    setTowers(step.towers);
    setMovingDisk(step.movingDisk);
    setFromTower(step.fromTower);
    setToTower(step.toTower);
    setMoves(nextStepIndex + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) {
      resetTowers();
      return;
    }
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    if (prevStepIndex === -1) {
      resetTowers();
    } else {
      const step = hanoiSteps[prevStepIndex];
      setTowers(step.towers);
      setMovingDisk(step.movingDisk);
      setFromTower(step.fromTower);
      setToTower(step.toTower);
      setMoves(prevStepIndex + 1);
    }
  };

  const togglePlayPause = () => {
    if (hanoiSteps.length === 0) {
      startHanoi();
    } else if (currentStep >= hanoiSteps.length - 1) {
      resetTowers();
      startHanoi();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const getDiskWidth = (diskSize: number) => {
    const baseWidth = 30;
    const increment = 25;
    return baseWidth + (diskSize * increment);
  };

  const getDiskColor = (diskSize: number) => {
    return diskColors[diskSize - 1] || 'bg-gray-500';
  };

  const getDiskBorderColor = (diskSize: number) => {
    return diskBorderColors[diskSize - 1] || 'border-gray-600';
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= hanoiSteps.length) return;
    
    setCurrentStep(step);
    setIsRunning(false);
    
    const hanoiStep = hanoiSteps[step];
    setTowers(hanoiStep.towers);
    setMovingDisk(hanoiStep.movingDisk);
    setFromTower(hanoiStep.fromTower);
    setToTower(hanoiStep.toTower);
    setMoves(step + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Tower of Hanoi Visualization</h1>
          <p className="text-lg text-drona-gray">
            The Tower of Hanoi is a classic recursive puzzle that demonstrates divide-and-conquer strategy.
            <span className="font-semibold text-drona-green"> Time Complexity: O(2^n)</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Tower Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">Number of Disks</Label>
                    <Input
                      type="number"
                      value={numDisks}
                      onChange={(e) => setNumDisks(Math.max(3, Math.min(7, parseInt(e.target.value) || 3)))}
                      min={3}
                      max={7}
                      className="border-2 focus:border-drona-green"
                    />
                  </div>
                  
                  <Button 
                    onClick={generateTowers} 
                    variant="outline"
                    className="w-full font-semibold border-2 hover:border-drona-green/50"
                  >
                    Generate Towers
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {speed}x
                  </Label>
                  <div className="flex items-center mt-1">
                    <input 
                      type="range" 
                      min={0.5} 
                      max={3} 
                      step={0.5} 
                      value={speed} 
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
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
                    onClick={() => goToStep(0)}
                    disabled={hanoiSteps.length === 0}
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
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= hanoiSteps.length - 1 || hanoiSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(hanoiSteps.length - 1)}
                    disabled={hanoiSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetTowers} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {hanoiSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {Math.max(0, currentStep + 1)} of {hanoiSteps.length}
                    </Label>
                    <Slider
                      value={[Math.max(1, currentStep + 2)]}
                      onValueChange={([value]) => goToStep(value - 2)}
                      max={hanoiSteps.length}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Move</p>
                    <p className="text-3xl font-bold text-drona-dark">{moves}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Number of Disks</p>
                    <p className="text-3xl font-bold text-drona-dark">{numDisks}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Moves</p>
                    <p className="text-xl font-bold text-drona-dark">{hanoiSteps.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Tower Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex justify-around items-end" style={{ height: '450px' }}>
                  {towers.map((tower, towerIndex) => (
                    <div key={towerIndex} className="flex flex-col items-center justify-end relative" style={{ width: '300px', height: '100%' }}>
                      {/* Tower base */}
                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 h-6 w-48 rounded-lg shadow-md border-2 border-gray-800 mb-4 z-10"></div>
                      
                      {/* Tower pole */}
                      <div 
                        className="absolute bg-gradient-to-r from-gray-500 to-gray-600 w-3 rounded-full shadow-lg border border-gray-700 z-0"
                        style={{ 
                          height: '380px',
                          bottom: '24px',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      ></div>
                      
                      {/* Tower label */}
                      <div className="absolute -bottom-8 text-lg font-bold text-drona-dark">
                        Tower {String.fromCharCode(65 + towerIndex)}
                      </div>
                      
                      {/* Disks */}
                      <div className="absolute bottom-6 flex flex-col-reverse items-center z-20">
                        {tower.map((diskSize, diskIndex) => (
                          <div
                            key={`${diskSize}-${diskIndex}`}
                            className={`h-12 rounded-lg border-2 shadow-lg transition-all duration-500 transform hover:scale-105 flex items-center justify-center ${getDiskColor(diskSize)} ${getDiskBorderColor(diskSize)}`}
                            style={{
                              width: `${getDiskWidth(diskSize)}px`,
                              marginBottom: '2px',
                              opacity: (movingDisk === diskSize && (fromTower === towerIndex || toTower === towerIndex)) ? 0.7 : 1,
                              transform: (movingDisk === diskSize && (fromTower === towerIndex || toTower === towerIndex)) 
                                ? 'translateY(-20px) scale(1.1)' 
                                : 'translateY(0) scale(1)',
                            }}
                          >
                            <span className="text-white font-bold text-lg drop-shadow-md">
                              {diskSize}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold text-drona-dark">
                    Moves: <span className="text-drona-green">{moves}</span>
                  </p>
                </div>
                
                {/* Color Legend */}
                <div className="mt-6 p-4 bg-gradient-to-r from-drona-light to-white rounded-lg border-2 border-drona-green/20">
                  <h4 className="text-lg font-bold text-drona-dark mb-3 text-center">Disk Colors</h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {Array.from({ length: numDisks }, (_, i) => i + 1).map((diskNum) => (
                      <div key={diskNum} className="flex items-center space-x-2">
                        <div 
                          className={`w-8 h-8 rounded border-2 ${getDiskColor(diskNum)} ${getDiskBorderColor(diskNum)} flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-sm">{diskNum}</span>
                        </div>
                        <span className="text-sm font-medium text-drona-gray">Disk {diskNum}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">How Tower of Hanoi Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                      <li>Move (n-1) disks from the source to the auxiliary tower.</li>
                      <li>Move the largest disk from the source to the destination tower.</li>
                      <li>Repeat recursively until all disks are moved to the destination.</li>
                      <li>The minimum number of moves required is 2^n - 1.</li>
                    </ol>
                  </CardContent>
                </Card>
                
                {/* Copyright */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-drona-gray">© 2024 Ikshvaku Innovations. All rights reserved.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerOfHanoiVisualizer;
