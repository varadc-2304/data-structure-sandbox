import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

interface BoardState {
  grid: (0 | 1)[][];
  queens: number[];
  isSolution?: boolean;
  solutionIndex?: number;
}

interface Solution {
  queens: number[];
  grid: (0 | 1)[][];
  steps: BoardState[];
}

const NQueensVisualizer = () => {
  const [boardSize, setBoardSize] = useState<number>(4);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [solutionFound, setSolutionFound] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  useEffect(() => {
    initializeBoard();
  }, [boardSize]);
  
  const initializeBoard = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
    setCurrentSolutionIndex(0);
    setIsInitialized(false);
    
    const allSolutions: Solution[] = [];
    const initialBoard = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
    
    // Find all solutions
    findAllSolutions(initialBoard, 0, Array(boardSize).fill(-1), allSolutions);
    
    setSolutions(allSolutions);
    setIsInitialized(true);
  };
  
  const findAllSolutions = (
    board: (0 | 1)[][],
    col: number,
    queens: number[],
    allSolutions: Solution[]
  ) => {
    if (col >= boardSize) {
      // Found a solution - generate steps to reach it
      const steps = generateStepsToSolution([...queens]);
      allSolutions.push({
        queens: [...queens],
        grid: JSON.parse(JSON.stringify(board)),
        steps: steps
      });
      return;
    }
    
    for (let row = 0; row < boardSize; row++) {
      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        queens[col] = row;
        
        findAllSolutions(board, col + 1, queens, allSolutions);
        
        board[row][col] = 0;
        queens[col] = -1;
      }
    }
  };
  
  const generateStepsToSolution = (targetQueens: number[]): BoardState[] => {
    const steps: BoardState[] = [];
    const board = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
    const queens = Array(boardSize).fill(-1);
    
    // Generate steps by placing queens one by one
    for (let col = 0; col < boardSize; col++) {
      const row = targetQueens[col];
      
      // Try different positions to show the search process
      for (let tryRow = 0; tryRow <= row; tryRow++) {
        if (tryRow === row || isSafe(board, tryRow, col)) {
          // Place queen temporarily
          board[tryRow][col] = 1;
          queens[col] = tryRow;
          
          steps.push({
            grid: JSON.parse(JSON.stringify(board)),
            queens: [...queens],
            isSolution: col === boardSize - 1 && tryRow === row
          });
          
          if (tryRow === row) {
            // This is the correct position, keep it
            break;
          } else {
            // Remove queen and try next position
            board[tryRow][col] = 0;
            queens[col] = -1;
          }
        }
      }
    }
    
    return steps;
  };
  
  const isSafe = (board: (0 | 1)[][], row: number, col: number): boolean => {
    // Check this row on left side
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 1) {
        return false;
      }
    }
    
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }
    
    // Check lower diagonal on left side
    for (let i = row, j = col; i < boardSize && j >= 0; i++, j--) {
      if (board[i][j] === 1) {
        return false;
      }
    }
    
    return true;
  };
  
  const resetVisualization = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
  };
  
  const toggleRunning = () => {
    if (!isInitialized || solutions.length === 0) return;
    
    if (currentStep >= getCurrentSteps().length - 1) {
      setCurrentStep(-1);
      setSolutionFound(false);
    }
    setIsRunning(!isRunning);
  };

  const nextStep = () => {
    const steps = getCurrentSteps();
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      
      if (steps[nextStepIndex]?.isSolution) {
        setSolutionFound(true);
        setIsRunning(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
      setSolutionFound(false);
    }
  };

  const skipToStart = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
  };

  const skipToEnd = () => {
    const steps = getCurrentSteps();
    setIsRunning(false);
    setCurrentStep(steps.length - 1);
    if (steps[steps.length - 1]?.isSolution) {
      setSolutionFound(true);
    }
  };

  const goToStep = (stepIndex: number) => {
    const steps = getCurrentSteps();
    setIsRunning(false);
    setCurrentStep(stepIndex);
    setSolutionFound(stepIndex >= 0 && steps[stepIndex]?.isSolution);
  };
  
  const changeSolution = (direction: 'prev' | 'next') => {
    if (solutions.length === 0) return;
    
    setIsRunning(false);
    setCurrentStep(-1);
    setSolutionFound(false);
    
    if (direction === 'next') {
      setCurrentSolutionIndex((prev) => (prev + 1) % solutions.length);
    } else {
      setCurrentSolutionIndex((prev) => (prev - 1 + solutions.length) % solutions.length);
    }
  };
  
  const getCurrentSteps = (): BoardState[] => {
    if (!isInitialized || solutions.length === 0) return [];
    return solutions[currentSolutionIndex]?.steps || [];
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const steps = getCurrentSteps();
    
    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        const nextStepIndex = currentStep + 1;
        setCurrentStep(nextStepIndex);
        
        if (steps[nextStepIndex]?.isSolution) {
          setSolutionFound(true);
          setIsRunning(false);
        }
      }, 2000 / speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStep, speed, currentSolutionIndex, isInitialized]);
  
  // Current board to display
  const getCurrentBoard = () => {
    if (!isInitialized || solutions.length === 0) {
      return Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
    }
    
    const steps = getCurrentSteps();
    if (currentStep >= 0 && currentStep < steps.length) {
      return steps[currentStep].grid;
    }
    
    return solutions[currentSolutionIndex]?.grid || Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
  };

  const displayBoard = getCurrentBoard();
  const currentSteps = getCurrentSteps();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-title mb-2">N-Queens Problem Visualization</h1>
          <p className="text-drona-gray mb-8">
            The N-Queens problem is to place N queens on an N×N chessboard so that no two queens threaten each other.
            Thus, no two queens can share the same row, column, or diagonal.
          </p>
          
          <div className="flex flex-col space-y-6">
            <Card className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Board Size:</label>
                    <select 
                      value={boardSize} 
                      onChange={(e) => {
                        setBoardSize(parseInt(e.target.value));
                      }}
                      className="border border-gray-300 rounded px-2 py-1"
                      disabled={isRunning}
                    >
                      {[4, 5, 6, 7, 8].map(n => (
                        <option key={n} value={n}>{n}x{n}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Speed: {speed}x</label>
                    <Slider
                      value={[speed]}
                      onValueChange={([value]) => setSpeed(value)}
                      min={0.5}
                      max={3}
                      step={0.5}
                      className="w-32"
                      disabled={isRunning}
                    />
                  </div>
                </div>

                {/* Solution Selection */}
                {isInitialized && solutions.length > 0 && (
                  <div className="flex justify-center items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => changeSolution('prev')} 
                      disabled={solutions.length <= 1 || isRunning}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Prev Solution
                    </Button>
                    <div className="text-center">
                      <span className="font-semibold">Solution {currentSolutionIndex + 1} of {solutions.length}</span>
                      <div className="text-sm text-gray-600">
                        {currentSteps.length} steps to solve
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => changeSolution('next')} 
                      disabled={solutions.length <= 1 || isRunning}
                    >
                      Next Solution <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}

                {/* Playback Controls */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={skipToStart} 
                    disabled={currentSteps.length === 0 || currentStep === -1}
                    size="sm"
                  >
                    <SkipBack className="h-4 w-4 mr-1" /> Start
                  </Button>
                  
                  <Button 
                    onClick={prevStep} 
                    disabled={currentSteps.length === 0 || currentStep <= -1}
                    size="sm"
                  >
                    ← Prev
                  </Button>
                  
                  <Button 
                    onClick={toggleRunning} 
                    disabled={currentSteps.length === 0 || solutionFound}
                    size="sm"
                  >
                    {isRunning ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> {currentStep === -1 ? 'Start' : 'Continue'}</>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={nextStep} 
                    disabled={currentSteps.length === 0 || currentStep >= currentSteps.length - 1 || solutionFound}
                    size="sm"
                  >
                    Next →
                  </Button>
                  
                  <Button 
                    onClick={skipToEnd} 
                    disabled={currentSteps.length === 0 || currentStep === currentSteps.length - 1}
                    size="sm"
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> End
                  </Button>
                  
                  <Button 
                    onClick={resetVisualization} 
                    variant="outline" 
                    disabled={isRunning}
                    size="sm"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>

                {/* Step Slider */}
                {currentSteps.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Step:</span>
                      <Slider
                        value={[currentStep + 1]}
                        onValueChange={([value]) => goToStep(value - 1)}
                        min={0}
                        max={currentSteps.length}
                        step={1}
                        className="flex-1"
                        disabled={isRunning}
                      />
                      <span className="text-sm text-gray-500 w-16">
                        {currentStep + 1}/{currentSteps.length}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Chessboard */}
                <div className="flex justify-center">
                  <div 
                    className="grid border border-gray-800"
                    style={{
                      gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                      width: Math.min(400, boardSize * 50),
                      height: Math.min(400, boardSize * 50)
                    }}
                  >
                    {displayBoard.map((row, rowIdx) => (
                      row.map((cell, colIdx) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`
                            flex items-center justify-center
                            ${(rowIdx + colIdx) % 2 === 0 ? 'bg-gray-100' : 'bg-gray-400'}
                          `}
                          style={{
                            width: Math.min(50, 400 / boardSize),
                            height: Math.min(50, 400 / boardSize)
                          }}
                        >
                          {cell === 1 && (
                            <span className="text-2xl">♛</span>
                          )}
                        </div>
                      ))
                    ))}
                  </div>
                </div>
                
                {/* Status Display */}
                <div className="text-center mt-4">
                  {isInitialized && solutions.length > 0 && (
                    <>
                      <p>Current step: {currentStep + 1} of {currentSteps.length}</p>
                      {solutionFound && (
                        <p className="font-bold text-green-600 text-lg">
                          🎉 Solution {currentSolutionIndex + 1} Found! All {boardSize} queens are safely placed!
                        </p>
                      )}
                      {currentStep >= currentSteps.length - 1 && currentSteps.length > 0 && !solutionFound && (
                        <p className="font-bold text-blue-600">✅ Simulation completed!</p>
                      )}
                    </>
                  )}
                  {!isInitialized && (
                    <p className="text-gray-500">Calculating solutions...</p>
                  )}
                  {isInitialized && solutions.length === 0 && (
                    <p className="text-red-500">No solutions exist for {boardSize}x{boardSize} board</p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">N-Queens Problem Explanation</h2>
              <p className="text-drona-gray mb-4">
                The N-Queens problem involves placing N queens on an NxN chessboard so that no two queens threaten each other.
                The solution uses backtracking to find all possible arrangements.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Multiple Solutions</h3>
              <p className="text-drona-gray mb-4">
                Most N-Queens problems have multiple solutions. You can use the solution navigation controls to explore different ways to solve the same puzzle.
                Each solution shows the step-by-step process of placing queens to reach that particular arrangement.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Backtracking Algorithm</h3>
              <ol className="list-decimal list-inside space-y-2 text-drona-gray">
                <li>Start placing queens one by one, column by column.</li>
                <li>Before placing a queen, check if it's safe (not under attack by any previously placed queen).</li>
                <li>If safe, place the queen and move to the next column.</li>
                <li>If all queens can't be placed, backtrack (remove the last queen and try a different position).</li>
                <li>Continue until all N queens are placed or all possibilities are exhausted.</li>
              </ol>
              
              <div className="mt-4 text-drona-gray">
                <p className="font-medium">Key properties:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>For an N×N board, there are N<sup>N</sup> possible arrangements of queens.</li>
                  <li>For N = 8 (standard chess board), there are 92 distinct solutions.</li>
                  <li>No solution exists for N = 2 or N = 3.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NQueensVisualizer;
