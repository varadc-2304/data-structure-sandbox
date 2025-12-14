import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpeedControl from "@/components/SpeedControl";

interface QuickSortControlsProps {
  arraySize: number;
  customArrayInput: string;
  speed: number;
  currentStep: number;
  stepsCount: number;
  isRunning: boolean;
  comparisons: number;
  onArraySizeChange: (value: number) => void;
  onCustomArrayChange: (value: string) => void;
  onSpeedChange: (value: number) => void;
  onGenerateRandom: () => void;
  onGenerateCustom: () => void;
  onStartOrToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

const QuickSortControls = ({
  arraySize,
  customArrayInput,
  speed,
  currentStep,
  stepsCount,
  isRunning,
  comparisons,
  onArraySizeChange,
  onCustomArrayChange,
  onSpeedChange,
  onGenerateRandom,
  onGenerateCustom,
  onStartOrToggle,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onGoToStep,
  onReset,
}: QuickSortControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Array Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Array Size</Label>
              <Input
                type="number"
                value={arraySize}
                min={5}
                max={30}
                onChange={(e) => onArraySizeChange(Math.max(5, Math.min(30, parseInt(e.target.value, 10) || 10)))}
              />
            </div>
            <Button
              onClick={onGenerateRandom}
              variant="outline"
              className="w-full font-semibold"
            >
              Generate Random Array
            </Button>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Custom Array (comma-separated)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 64, 34, 25, 12"
                  value={customArrayInput}
                  onChange={(e) => onCustomArrayChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onGenerateCustom()}
                  className="flex-1"
                />
                <Button onClick={onGenerateCustom}>
                  Set
                </Button>
              </div>
            </div>
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

export default QuickSortControls;
