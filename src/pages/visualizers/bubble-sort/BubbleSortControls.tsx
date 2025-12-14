import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpeedControl from "@/components/SpeedControl";

interface BubbleSortControlsProps {
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
  onStart: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

const BubbleSortControls = ({
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
  onStart,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onGoToStep,
  onReset,
}: BubbleSortControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Array Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-drona-dark">Array Size</Label>
              <Input
                type="number"
                value={arraySize}
                min={4}
                max={40}
                onChange={(e) => onArraySizeChange(Math.max(4, Math.min(40, parseInt(e.target.value, 10) || 10)))}
                className="border-2 focus:border-drona-green"
              />
            </div>
            <Button
              onClick={onGenerateRandom}
              variant="outline"
              className="w-full font-semibold border-2 hover:border-drona-green/50"
            >
              Generate Random Array
            </Button>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-drona-dark">Custom Array (comma-separated)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., 9, 4, 6, 2"
                  value={customArrayInput}
                  onChange={(e) => onCustomArrayChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onGenerateCustom()}
                  className="flex-1 border-2 focus:border-drona-green"
                />
                <Button onClick={onGenerateCustom} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
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

export default BubbleSortControls;
