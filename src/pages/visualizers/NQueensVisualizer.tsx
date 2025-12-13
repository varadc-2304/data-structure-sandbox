import React from "react";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import NQueensControls from "./nqueens/NQueensControls";
import NQueensBoard from "./nqueens/NQueensBoard";
import { useNQueensVisualizer } from "./nqueens/useNQueensVisualizer";

const NQueensVisualizer = () => {
  const {
    state: { boardSize, solutions, currentSolutionIndex, isRunning, speed, currentStep, solutionFound, isInitialized },
    actions: { setBoardSize, setSpeed, resetVisualization, toggleRunning, nextStep, prevStep, skipToStart, skipToEnd, goToStep, changeSolution, getCurrentSteps, getCurrentBoard, getCurrentStepInfo },
  } = useNQueensVisualizer();

  const displayBoard = getCurrentBoard();
  const currentSteps = getCurrentSteps();
  const currentStepInfo = getCurrentStepInfo();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 pb-12">
        <div className="mb-6">
          <Link to="/dashboard/algorithms" className="inline-flex items-center text-primary hover:underline mb-4 font-medium transition-colors text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">N-Queens Problem</h1>
          <p className="text-muted-foreground text-sm">The N-Queens problem is to place N queens on an N×N chessboard so that no two queens threaten each other.</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-full justify-start bg-secondary p-1 h-auto">
            <TabsTrigger 
              value="visualizer" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger 
              value="algorithm" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Algorithm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <NQueensControls
                  boardSize={boardSize}
                  solutions={solutions}
                  currentSolutionIndex={currentSolutionIndex}
                  isRunning={isRunning}
                  speed={speed}
                  currentStep={currentStep}
                  currentStepsLength={currentSteps.length}
                  solutionFound={solutionFound}
                  isInitialized={isInitialized}
                  onBoardSizeChange={setBoardSize}
                  onSpeedChange={setSpeed}
                  onChangeSolution={changeSolution}
                  onToggleRunning={toggleRunning}
                  onNextStep={nextStep}
                  onPrevStep={prevStep}
                  onSkipToStart={skipToStart}
                  onSkipToEnd={skipToEnd}
                  onReset={resetVisualization}
                  onGoToStep={goToStep}
                />
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={toggleRunning} variant="default" size="sm" disabled={isRunning || !isInitialized}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={toggleRunning} variant="outline" disabled={!currentSteps.length || !isRunning} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={toggleRunning} variant="outline" disabled={!currentSteps.length || isRunning || currentStep >= currentSteps.length - 1} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={resetVisualization} variant="outline" disabled={!currentSteps.length} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={prevStep} variant="outline" disabled={!currentSteps.length || currentStep <= 0} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextStep} variant="outline" disabled={!currentSteps.length || currentStep >= currentSteps.length - 1} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    {currentSteps.length > 0 && (
                      <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                        <Timer className="mr-2 h-3 w-3 text-primary" />
                        <span className="text-foreground font-medium text-sm">
                          Step: {currentStep + 1} / {currentSteps.length}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    {currentStepInfo && currentStepInfo.message && (
                      <div
                        className={`p-3 rounded-lg text-center font-medium mb-4 ${
                          currentStepInfo.isSolution
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : currentStepInfo.isConflict
                            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                            : currentStepInfo.isBacktracking
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        }`}
                      >
                        {currentStepInfo.message}
                      </div>
                    )}
                    <NQueensBoard boardSize={boardSize} displayBoard={displayBoard} currentStepInfo={currentStepInfo} />
                  </div>

                  {solutions.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Solutions Found</p>
                          <p className="text-xl font-bold text-foreground">{solutions.length}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Current Solution</p>
                          <p className="text-xl font-bold text-foreground">{currentSolutionIndex + 1}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-lg border border-border p-4 text-sm">
                  <h2 className="text-lg font-semibold mb-2">About N-Queens Problem</h2>
                  <p className="text-muted-foreground mb-3 text-sm">The N-Queens problem is a classic constraint satisfaction problem that uses backtracking to find all valid queen placements.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Backtracking algorithm</li>
                          <li>Constraint satisfaction</li>
                          <li>Exponential time complexity</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Time Complexity</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Best Case: O(n!)</li>
                          <li>Average Case: O(n!)</li>
                          <li>Worst Case: O(n!)</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-card rounded-lg border border-border p-6 md:p-8">
              <div className="space-y-8">
                <div className="border-b border-border pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    N-Queens Problem – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    The N-Queens problem is a classic constraint satisfaction problem that uses backtracking to place N queens on an N×N chessboard.
                  </p>
                </div>

                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-primary rounded-full"></span>
                      Key Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm text-foreground">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Place queens one column at a time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Check for conflicts with existing queens</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">If conflict, backtrack and try next position</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Continue until all queens are placed</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Algorithm (Step-by-Step)
                  </h2>
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-5">
                      <ol className="space-y-4 text-sm text-foreground">
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                          <span className="flex-1 pt-1">Start with column 0</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Try placing queen in each row of current column</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Check if position is safe (no conflicts with existing queens)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">If safe, place queen and move to next column</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">If no safe position, backtrack to previous column</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                          <span className="flex-1 pt-1">Remove queen and try next row</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">7</span>
                          <span className="flex-1 pt-1">Repeat until all queens are placed or all possibilities exhausted</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Pseudocode
                  </h2>
                  <Card className="bg-muted/50 border-border">
                    <CardContent className="p-5">
                      <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`NQueens(board, col):
    if col >= N:
        return true  // All queens placed
    
    for row = 0 to N - 1:
        if isSafe(board, row, col):
            board[row][col] = QUEEN
            
            if NQueens(board, col + 1):
                return true
            
            board[row][col] = EMPTY  // Backtrack
    
    return false

isSafe(board, row, col):
    // Check row
    for i = 0 to col - 1:
        if board[row][i] == QUEEN:
            return false
    
    // Check upper diagonal
    for i = row - 1, j = col - 1; i >= 0 and j >= 0; i--, j--:
        if board[i][j] == QUEEN:
            return false
    
    // Check lower diagonal
    for i = row + 1, j = col - 1; i < N and j >= 0; i++, j--:
        if board[i][j] == QUEEN:
            return false
    
    return true`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NQueensVisualizer;
