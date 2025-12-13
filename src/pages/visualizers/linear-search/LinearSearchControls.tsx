import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface LinearSearchControlsProps {
  arraySize: number;
  customArrayInput: string;
  searchValue: number | null;
  speed: number;
  currentStep: number;
  stepsCount: number;
  isRunning: boolean;
  statusText: string;
  comparisons: number;
  onArraySizeChange: (value: number) => void;
  onCustomArrayChange: (value: string) => void;
  onSearchValueChange: (value: string) => void;
  onGenerateRandom: () => void;
  onGenerateCustom: () => void;
  onStartSearch: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
  onSpeedChange: (value: number) => void;
}

const LinearSearchControls = ({
  arraySize,
  customArrayInput,
  searchValue,
  speed,
  currentStep,
  stepsCount,
  isRunning,
  statusText,
  comparisons,
  onArraySizeChange,
  onCustomArrayChange,
  onSearchValueChange,
  onGenerateRandom,
  onGenerateCustom,
  onStartSearch,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onGoToStep,
  onReset,
  onSpeedChange,
}: LinearSearchControlsProps) => {
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
                min={4}
                max={30}
                onChange={(e) => onArraySizeChange(Math.max(4, Math.min(30, parseInt(e.target.value, 10) || 10)))}
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
                  placeholder="e.g., 5, 12, 8, 3"
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

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Search Value</Label>
            <Input
              type="number"
              value={searchValue ?? ""}
              onChange={(e) => onSearchValueChange(e.target.value)}
              placeholder="Enter value to find"
            />
            <Button onClick={onStartSearch} className="w-full">
              Start Linear Search
            </Button>
            <p className="text-sm text-muted-foreground">Status: {statusText}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Animation Speed: {speed}x</Label>
            <Slider
              value={[speed]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={([value]) => onSpeedChange(value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5x</span>
              <span>1x</span>
              <span>1.5x</span>
              <span>2.0x</span>
              <span>2.5x</span>
              <span>3x</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default LinearSearchControls;
