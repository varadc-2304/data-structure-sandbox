import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SpeedControl from "@/components/SpeedControl";

interface NQueensControlsProps {
  boardSize: number;
  solutions: { steps: unknown[] }[];
  currentSolutionIndex: number;
  isRunning: boolean;
  speed: number;
  currentStep: number;
  currentStepsLength: number;
  solutionFound: boolean;
  isInitialized: boolean;
  onBoardSizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
  onChangeSolution: (direction: "prev" | "next") => void;
  onToggleRunning: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSkipToStart: () => void;
  onSkipToEnd: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
}

const NQueensControls = ({
  boardSize,
  solutions,
  currentSolutionIndex,
  isRunning,
  speed,
  currentStep,
  currentStepsLength,
  solutionFound,
  isInitialized,
  onBoardSizeChange,
  onSpeedChange,
  onChangeSolution,
  onToggleRunning,
  onNextStep,
  onPrevStep,
  onSkipToStart,
  onSkipToEnd,
  onReset,
  onGoToStep,
}: NQueensControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {/* Solutions Navigation - at the top */}
          {isInitialized && solutions.length > 0 && (
            <div className="flex justify-center items-center gap-3 p-4 bg-secondary rounded-lg mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onChangeSolution("prev")} 
                disabled={solutions.length <= 1 || isRunning}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center flex-1">
                <div className="font-semibold text-foreground">
                  Solution {currentSolutionIndex + 1} of {solutions.length}
                </div>
                <div className="text-xs text-muted-foreground">{currentStepsLength} steps</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onChangeSolution("next")} 
                disabled={solutions.length <= 1 || isRunning}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Board Size</Label>
            <Select
              value={boardSize.toString()}
              onValueChange={(value) => onBoardSizeChange(parseInt(value))}
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7, 8].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}x{n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SpeedControl
            speed={speed}
            onSpeedChange={onSpeedChange}
            min={0.5}
            max={3}
            step={0.5}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NQueensControls;
