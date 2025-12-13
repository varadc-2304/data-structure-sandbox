import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface TowerOfHanoiControlsProps {
  numDisks: number;
  speed: number;
  currentStep: number;
  stepsCount: number;
  isRunning: boolean;
  moves: number;
  onNumDisksChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onGenerate: () => void;
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
  onGenerate,
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
      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-drona-dark">Number of Disks</Label>
            <Input
              type="number"
              value={numDisks}
              min={1}
              max={7}
              onChange={(e) => onNumDisksChange(Math.max(1, Math.min(7, parseInt(e.target.value, 10) || 3)))}
              className="border-2 focus:border-drona-green"
            />
            <p className="text-xs text-drona-gray">Minimum moves: {Math.pow(2, numDisks) - 1}</p>
          </div>
          <Button onClick={onGenerate} variant="outline" className="w-full font-semibold border-2 hover:border-drona-green/50">
            Generate Towers
          </Button>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-drona-dark">Animation Speed: {speed}x</Label>
            <Slider value={[speed]} min={0.5} max={3} step={0.5} onValueChange={([value]) => onSpeedChange(value)} />
            <div className="flex justify-between text-xs text-drona-gray">
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

export default TowerOfHanoiControls;
