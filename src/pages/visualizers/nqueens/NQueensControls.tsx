import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

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
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Board Size:</label>
            <select
              value={boardSize}
              onChange={(e) => {
                onBoardSizeChange(parseInt(e.target.value));
              }}
              className="border border-gray-300 rounded px-2 py-1"
              disabled={isRunning}
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}x{n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Speed: {speed}x</label>
            <Slider value={[speed]} onValueChange={([value]) => onSpeedChange(value)} min={0.5} max={3} step={0.5} className="w-full" disabled={isRunning} />
            <div className="flex justify-between text-xs text-gray-600">
              <span>0.5x</span>
              <span>1x</span>
              <span>1.5x</span>
              <span>2.0x</span>
              <span>2.5x</span>
              <span>3x</span>
            </div>
          </div>
        </div>

        {isInitialized && solutions.length > 0 && (
          <div className="flex justify-center items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Button variant="outline" size="sm" onClick={() => onChangeSolution("prev")} disabled={solutions.length <= 1 || isRunning}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev Solution
            </Button>
            <div className="text-center">
              <span className="font-semibold">
                Solution {currentSolutionIndex + 1} of {solutions.length}
              </span>
              <div className="text-sm text-gray-600">{currentStepsLength} detailed steps</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onChangeSolution("next")} disabled={solutions.length <= 1 || isRunning}>
              Next Solution <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

      </div>
    </Card>
  );
};

export default NQueensControls;
