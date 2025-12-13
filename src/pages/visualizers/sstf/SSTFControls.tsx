import { Play, Pause, RotateCcw, SkipBack, SkipForward, Rewind, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface SSTFControlsProps {
  diskSize: number;
  initialHeadPosition: number;
  inputPosition: string;
  speed: number;
  currentStep: number;
  sstfOrderLength: number;
  isPlaying: boolean;
  onDiskSizeChange: (value: number) => void;
  onInitialHeadPositionChange: (value: number) => void;
  onInputPositionChange: (value: string) => void;
  onSpeedChange: (value: number) => void;
  onAddRequest: () => void;
  onPrevStep: () => void;
  onRewind: () => void;
  onTogglePlayPause: () => void;
  onFastForward: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
}

const SSTFControls = ({
  diskSize,
  initialHeadPosition,
  inputPosition,
  speed,
  currentStep,
  sstfOrderLength,
  isPlaying,
  onDiskSizeChange,
  onInitialHeadPositionChange,
  onInputPositionChange,
  onSpeedChange,
  onAddRequest,
  onPrevStep,
  onRewind,
  onTogglePlayPause,
  onFastForward,
  onNextStep,
  onReset,
  onGoToStep,
}: SSTFControlsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>Set up the disk scheduling simulation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="diskSize">Disk Size</Label>
            <Input id="diskSize" type="number" min={100} max={1000} value={diskSize} onChange={(e) => onDiskSizeChange(Number(e.target.value))} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="initialHeadPosition">Initial Head Position</Label>
            <Input
              id="initialHeadPosition"
              type="number"
              min={0}
              max={diskSize - 1}
              value={initialHeadPosition}
              onChange={(e) => onInitialHeadPositionChange(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="position">Request Position</Label>
            <div className="flex mt-1">
              <Input
                id="position"
                placeholder="e.g., 50, 95, 180"
                value={inputPosition}
                onChange={(e) => onInputPositionChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAddRequest()}
                className="rounded-r-none"
              />
              <Button onClick={onAddRequest} className="rounded-l-none">
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label>Simulation Speed</Label>
            <div className="flex items-center mt-1">
              <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} className="w-full accent-green-600" />
              <span className="ml-2 text-sm text-green-600 font-medium">{speed}x</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-1">
              <Button variant="outline" size="sm" onClick={onPrevStep} disabled={currentStep <= -1} className="flex items-center justify-center">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onRewind} className="flex items-center justify-center">
                <Rewind className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={onTogglePlayPause} disabled={sstfOrderLength === 0} className="bg-drona-green hover:bg-drona-green/90 flex items-center justify-center">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={onFastForward} className="flex items-center justify-center">
                <FastForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onNextStep} disabled={currentStep >= sstfOrderLength - 1} className="flex items-center justify-center">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" className="w-full" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {sstfOrderLength > 0 && (
            <div className="space-y-2">
              <Label>
                Step: {currentStep + 1} of {sstfOrderLength}
              </Label>
              <Slider value={[currentStep + 1]} onValueChange={([value]) => onGoToStep(value - 1)} max={sstfOrderLength} min={0} step={1} className="w-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SSTFControls;
