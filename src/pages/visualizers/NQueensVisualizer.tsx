
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface BoardState {
  grid: (0 | 1)[][];
  queens: number[];
}

const NQueensVisualizer = () => {
  const [boardSize, setBoardSize] = useState<number>(4);
  const [solutions, setSolutions] = useState<BoardState[]>([]);
  const [currentSolution, setCurrentSolution] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [steps, setSteps] = useState<BoardState[]>([]);
  const [totalSolutions, setTotalSolutions] = useState<number>(0);
  
  useEffect(() => {
    // Initialize board
    initializeBoard();
  }, [boardSize]);
  
  const initializeBoard = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    
    const initialBoard = Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));
    const stepsRecord: BoardState[] = [];
    const solutionsFound: BoardState[] = [];
    
    // Keep track of queen positions (row index for each column)
    const queens = Array(boardSize).fill(-1);
    
    // Find all solutions
    solveNQueens(initialBoard, 0, queens, stepsRecord, solutionsFound);
    
    setSteps(stepsRecord);
    setSolutions(solutionsFound);
    setTotalSolutions(solutionsFound.length);
    setCurrentSolution(0);
  };
  
  const solveNQueens = (
    board: (0 | 1)[][],
    col: number,
    queens: number[],
    stepsRecord: BoardState[],
    solutionsFound: BoardState[]
  ): boolean => {
    // All queens are placed
    if (col >= boardSize) {
      solutionsFound.push({
        grid: JSON.parse(JSON.stringify(board)),
        queens: [...queens]
      });
      return true;
    }
    
    let solutionFound = false;
    
    // Try placing queen in each row of the current column
    for (let row = 0; row < boardSize; row++) {
      if (isSafe(board, row, col)) {
        // Place queen
        board[row][col] = 1;
        queens[col] = row;
        
        // Record step
        stepsRecord.push({
          grid: JSON.parse(JSON.stringify(board)),
          queens: [...queens]
        });
        
        // Recur to place rest of the queens
        const found = solveNQueens(board, col + 1, queens, stepsRecord, solutionsFound);
        if (found) {
          solutionFound = true;
        }
        
        // Backtrack and remove queen
        board[row][col] = 0;
        queens[col] = -1;
        
        // Record backtracking step
        stepsRecord.push({
          grid: JSON.parse(JSON.stringify(board)),
          queens: [...queens]
        });
      }
    }
    
    return solutionFound;
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
    initializeBoard();
  };
  
  const toggleRunning = () => {
    setIsRunning(!isRunning);
  };
  
  const nextSolution = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setCurrentSolution((prev) => (prev + 1) % solutions.length);
  };
  
  const prevSolution = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setCurrentSolution((prev) => (prev - 1 + solutions.length) % solutions.length);
  };
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, currentStep, steps.length, speed]);
  
  // Current board to display
  const displayBoard = currentStep >= 0 ? 
    steps[currentStep].grid : 
    solutions.length > 0 ? 
      solutions[currentSolution].grid :
      Array(boardSize).fill(0).map(() => Array(boardSize).fill(0));

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
                  
                  <Button onClick={toggleRunning} disabled={steps.length === 0 || currentStep === steps.length - 1}>
                    {isRunning ? (
                      <><Pause className="mr-2 h-4 w-4" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-4 w-4" /> {currentStep === -1 ? 'Visualize Solution' : 'Continue'}</>
                    )}
                  </Button>
                  
                  <Button onClick={resetVisualization} variant="outline" disabled={isRunning}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
                
                {/* Solution navigation */}
                {solutions.length > 0 && !isRunning && currentStep === -1 && (
                  <div className="flex justify-center items-center gap-4 mb-2">
                    <Button variant="outline" size="sm" onClick={prevSolution} disabled={solutions.length <= 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>Solution {currentSolution + 1} of {totalSolutions}</span>
                    <Button variant="outline" size="sm" onClick={nextSolution} disabled={solutions.length <= 1}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
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
                
                {/* Step info */}
                {currentStep >= 0 && (
                  <div className="text-center mt-4">
                    <p>Step {currentStep + 1} of {steps.length}</p>
                  </div>
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-3">N-Queens Problem Explanation</h2>
              <p className="text-drona-gray mb-4">
                The N-Queens problem involves placing N queens on an NxN chessboard so that no two queens threaten each other.
                The solution uses backtracking to find all possible arrangements.
              </p>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Backtracking Solution</h3>
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
