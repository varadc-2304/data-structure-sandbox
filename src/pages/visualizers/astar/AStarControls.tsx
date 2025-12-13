import { Navigation, Target, Square, Play, Pause, RotateCcw, SkipBack, SkipForward, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Mode } from "./useAStarVisualizer";

interface AStarControlsProps {
  mode: Mode;
  isPlaying: boolean;
  currentStep: number;
  stepsLength: number;
  speed: number;
  onModeChange: (mode: Mode) => void;
  onClearGrid: () => void;
  onTogglePlayPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSkipToStart: () => void;
  onSkipToEnd: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

const AStarControls = ({
  mode,
  isPlaying,
  currentStep,
  stepsLength,
  speed,
  onModeChange,
  onClearGrid,
  onTogglePlayPause,
  onNextStep,
  onPrevStep,
  onSkipToStart,
  onSkipToEnd,
  onReset,
  onGoToStep,
  onSpeedChange,
}: AStarControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Grid Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => onModeChange(mode === "start" ? "none" : "start")} variant={mode === "start" ? "default" : "outline"} size="sm" className="font-semibold" disabled={isPlaying}>
              <Navigation className="mr-1 h-3 w-3" />
              Start
            </Button>

            <Button onClick={() => onModeChange(mode === "goal" ? "none" : "goal")} variant={mode === "goal" ? "default" : "outline"} size="sm" className="font-semibold" disabled={isPlaying}>
              <Target className="mr-1 h-3 w-3" />
              Goal
            </Button>

            <Button onClick={() => onModeChange(mode === "wall" ? "none" : "wall")} variant={mode === "wall" ? "default" : "outline"} size="sm" className="font-semibold" disabled={isPlaying}>
              <Square className="mr-1 h-3 w-3" />
              Wall
            </Button>
          </div>

          <Button onClick={onClearGrid} variant="outline" className="w-full font-semibold border-2 hover:border-drona-green/50" disabled={isPlaying}>
            Clear Walls
          </Button>

          <div className="text-xs text-drona-gray p-3 bg-drona-light/30 rounded-lg">
            {mode === "start" && "Click on a cell to set the start point"}
            {mode === "goal" && "Click on a cell to set the goal point"}
            {mode === "wall" && "Click on cells to toggle walls"}
            {mode === "none" && "Select a mode above, then click on the grid"}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-5 gap-1">
            <Button variant="outline" size="sm" onClick={onSkipToStart} className="border-2 hover:border-drona-green/50">
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={onPrevStep} disabled={currentStep <= -1} className="border-2 hover:border-drona-green/50">
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button size="sm" onClick={onTogglePlayPause} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={onNextStep} disabled={currentStep >= stepsLength - 1} className="border-2 hover:border-drona-green/50">
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={onSkipToEnd} className="border-2 hover:border-drona-green/50">
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={onReset} variant="outline" disabled={isPlaying} className="w-full border-2 hover:border-drona-green/50">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-drona-dark">
              Step: {currentStep + 2} of {stepsLength + 1}
            </label>
            <Slider value={[currentStep + 1]} onValueChange={([value]) => onGoToStep(value - 1)} max={stepsLength} min={0} step={1} className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-drona-dark">Speed: {((3000 - speed) / 100).toFixed(1)}x</label>
            <Slider value={[speed]} onValueChange={([value]) => onSpeedChange(value)} max={2500} min={500} step={100} className="w-full" />
            <div className="flex justify-between text-xs text-drona-gray">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AStarControls;
