import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpeedControl from "@/components/SpeedControl";

interface TowerOfHanoiControlsProps {
  numDisks: number;
  speed: number;
  currentStep: number;
  stepsCount: number;
  isRunning: boolean;
  moves: number;
  onNumDisksChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onStartOrToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
  onGoToStep: (step: number) => void;
  onReset: () => void;
}

const TowerOfHanoiControls = ({
  numDisks,
  speed,
  currentStep,
  stepsCount,
  isRunning,
  moves,
  onNumDisksChange,
  onSpeedChange,
  onStartOrToggle,
  onPrev,
  onNext,
  onFirst,
  onLast,
  onGoToStep,
  onReset,
}: TowerOfHanoiControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Number of Disks</Label>
            <Input
              type="number"
              value={numDisks}
              min={1}
              max={7}
              onChange={(e) => onNumDisksChange(Math.max(1, Math.min(7, parseInt(e.target.value, 10) || 3)))}
            />
            <p className="text-xs text-muted-foreground">Minimum moves: {Math.pow(2, numDisks) - 1}</p>
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

export default TowerOfHanoiControls;
