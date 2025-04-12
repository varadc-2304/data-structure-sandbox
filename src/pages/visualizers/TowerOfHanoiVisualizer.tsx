
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Disk {
  size: number;
  color: string;
}

interface Move {
  disk: number;
  from: number;
  to: number;
}

const TowerOfHanoiVisualizer = () => {
  const [towers, setTowers] = useState<Disk[][]>([[], [], []]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [diskCount, setDiskCount] = useState<number>(3);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  const diskColors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 
    'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'
  ];
  
  useEffect(() => {
    if (!isInitialized) {
      initializeDisks();
      setIsInitialized(true);
    }
  }, [isInitialized]);
  
  const initializeDisks = () => {
    const initialTowers: Disk[][] = [[], [], []];
    
    // Initialize the first tower with disks
    for (let i = diskCount; i > 0; i--) {
      initialTowers[0].push({
        size: i,
        color: diskColors[i % diskColors.length]
      });
    }
    
    setTowers(initialTowers);
    setCurrentMoveIndex(-1);
    
    // Generate moves
    const movesList: Move[] = [];
    solveTowerOfHanoi(diskCount, 0, 2, 1, movesList);
    setMoves(movesList);
    
    setIsRunning(false);
  };
  
  const solveTowerOfHanoi = (n: number, source: number, destination: number, auxiliary: number, movesList: Move[]) => {
    if (n === 1) {
      movesList.push({ disk: n, from: source, to: destination });
      return;
    }
    
    solveTowerOfHanoi(n - 1, source, auxiliary, destination, movesList);
    movesList.push({ disk: n, from: source, to: destination });
    solveTowerOfHanoi(n - 1, auxiliary, destination, source, movesList);
  };
  
  const resetVisualization = () => {
    setIsRunning(false);
    setIsInitialized(false);
  };
  
  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && currentMoveIndex < moves.length - 1) {
      timer = setTimeout(() => {
        const nextMove = moves[currentMoveIndex + 1];
        const newTowers = JSON.parse(JSON.stringify(towers)) as Disk[][];
        
        const disk = newTowers[nextMove.from].pop();
        if (disk) {
          newTowers[nextMove.to].push(disk);
        }
        
        setTowers(newTowers);
        setCurrentMoveIndex(prev => prev + 1);
      }, speed);
    } else if (currentMoveIndex >= moves.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentMoveIndex, moves, towers, speed]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">Tower of Hanoi Visualization</h1>
          <p className="text-drona-gray mb-8">
            Tower of Hanoi is a classic problem that demonstrates recursion. The goal is to move all disks from the first tower to the last tower.
            Number of moves required: 2<sup>n</sup> - 1
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Number of disks:</label>
                    <select 
                      value={diskCount} 
                      onChange={(e) => {
                        setDiskCount(parseInt(e.target.value));
                        setIsInitialized(false);
                      }}
                      className="border border-gray-300 rounded px-2 py-1"
                      disabled={isRunning || currentMoveIndex > -1}
                    >
                      {[3, 4, 5, 6, 7].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Speed:</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                  
                  <Button 
                    onClick={toggleRunning} 
                    disabled={currentMoveIndex === moves.length - 1}
                  >
                    {isRunning ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> {currentMoveIndex === -1 ? 'Start' : 'Continue'}</>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline"
                    disabled={isRunning}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
                
                <div className="flex justify-center items-end mt-4">
                  <div className="relative flex justify-around w-full max-w-3xl">
                    {towers.map((tower, towerIndex) => (
                      <div key={towerIndex} className="flex flex-col items-center">
                        <div className="tower-disks flex flex-col-reverse items-center mb-2 h-64">
                          {tower.map((disk, diskIndex) => (
                            <div
                              key={diskIndex}
                              className={`${disk.color} h-8 rounded-md flex items-center justify-center text-white font-bold mb-1`}
                              style={{
                                width: `${(disk.size * 30) + 40}px`,
                              }}
                            >
                              {disk.size}
                            </div>
                          ))}
                        </div>
                        <div className="w-2 h-64 bg-gray-700 -mt-64 z-0"></div>
                        <div className="w-40 h-4 bg-gray-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <p>Total moves: {moves.length}</p>
                  <p>Current move: {currentMoveIndex + 1}</p>
                  {currentMoveIndex >= 0 && currentMoveIndex < moves.length && (
                    <p>
                      Moving disk {moves[currentMoveIndex].disk} from Tower {moves[currentMoveIndex].from + 1} to Tower {moves[currentMoveIndex].to + 1}
                    </p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">Rules of Tower of Hanoi</h2>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Only one disk can be moved at a time.</li>
                <li>Each move consists of taking the upper disk from one stack and placing it on top of another stack.</li>
                <li>No disk may be placed on top of a smaller disk.</li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Recursive Solution</h3>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Move n-1 disks from source to auxiliary tower.</li>
                <li>Move the nth disk from source to destination.</li>
                <li>Move n-1 disks from auxiliary to destination tower.</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerOfHanoiVisualizer;
