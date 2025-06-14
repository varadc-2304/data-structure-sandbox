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
    const initialTowers = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    resetTowers();
  };

  const resetTowers = () => {
    const initialTowers = [[], [], []];
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

  const calculateHanoiSteps = (n: number, source: number[], destination: number[], auxiliary: number[]) => {
    const steps: HanoiStep[] = [];

    const moveDisk = (disk: number, from: number[], to: number[]) => {
      steps.push({
        towers: [
          [...source],
          [...destination],
          [...auxiliary]
        ],
        movingDisk: disk,
        fromTower: from === source ? 0 : (from === destination ? 1 : 2),
        toTower: to === source ? 0 : (to === destination ? 1 : 2)
      });
      to.push(disk);
      from.pop();
    };

    const hanoi = (n: number, source: number[], destination: number[], auxiliary: number[]) => {
      if (n > 0) {
        hanoi(n - 1, source, auxiliary, destination);
        moveDisk(source[source.length - 1], source, destination);
        hanoi(n - 1, auxiliary, destination, source);
      }
    };

    hanoi(n, source, destination, auxiliary);
    return steps;
  };

  const startHanoi = () => {
    resetTowers();
    const initialTowers = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
      initialTowers[0].push(i);
    }
    setTowers(initialTowers);
    
    const source = [...initialTowers[0]];
    const destination: number[] = [];
    const auxiliary: number[] = [];
    const steps = calculateHanoiSteps(numDisks, source, destination, auxiliary);
    
    setHanoiSteps(steps);
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
    setMoves(nextStepIndex);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    
    const prevStepIndex = currentStep - 1;
    setCurrentStep(prevStepIndex);
    
    const step = hanoiSteps[prevStepIndex];
    setTowers(step.towers);
    setMovingDisk(step.movingDisk);
    setFromTower(step.fromTower);
    setToTower(step.toTower);
    setMoves(prevStepIndex);
  };

  const togglePlayPause = () => {
    if (currentStep >= hanoiSteps.length - 1) {
      startHanoi();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const getDiskWidth = (diskSize: number) => {
    return `${(diskSize / numDisks) * 80 + 20}%`;
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
    setMoves(step);
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
                    disabled={currentStep <= 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    disabled={towers[0].length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= hanoiSteps.length - 1}
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
                  onClick={() => {
                    resetTowers();
                    setIsRunning(false);
                  }} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {hanoiSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {hanoiSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
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
                    <p className="text-sm font-semibold text-drona-gray">Current Step</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep)}</p>
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
                {towers[0].length === numDisks ? (
                  <div className="flex justify-around h-64">
                    {towers.map((tower, index) => (
                      <div key={index} className="flex flex-col-reverse items-center justify-end w-1/3">
                        <div className="bg-gray-400 h-2 w-24 mb-2"></div>
                        {tower.map((diskSize, diskIndex) => (
                          <div
                            key={diskIndex}
                            className={`h-6 rounded-md bg-drona-green transition-all duration-300`}
                            style={{
                              width: getDiskWidth(diskSize),
                              marginBottom: '4px',
                              opacity: (movingDisk === diskSize && (fromTower === index || toTower === index)) ? 0.5 : 1,
                            }}
                          >
                            <div className="flex items-center justify-center h-full text-white font-bold">
                              {diskSize}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Mountain className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Configure the number of disks to start visualization</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold text-drona-dark">
                    Moves: {moves}
                  </p>
                </div>
                
                <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20 mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">How Tower of Hanoi Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                      <li>Move (n-1) disks from the source to the auxiliary tower.</li>
                      <li>Move the largest disk from the source to the destination tower.</li>
                      <li>Move the (n-1) disks from the auxiliary to the destination tower.</li>
                      <li>Repeat until all disks are in the destination tower.</li>
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

export default TowerOfHanoiVisualizer;
