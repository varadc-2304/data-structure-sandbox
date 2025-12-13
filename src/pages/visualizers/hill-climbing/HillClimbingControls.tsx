import { Map, Play, Pause, RotateCcw, SkipBack, SkipForward, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { mapNames } from "./useHillClimbingVisualizer";

interface HillClimbingControlsProps {
  currentMap: number;
  startPosition: { x: number; y: number; value: number };
  isPlaying: boolean;
  currentStep: number;
  stepsLength: number;
  speed: number;
  currentPosition: { x: number; y: number; value: number } | null;
  neighbors: { x: number; y: number; value: number }[];
  bestNeighbor: { x: number; y: number; value: number } | null;
  onChangeMap: () => void;
  onTogglePlayPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSkipToStart: () => void;
  onSkipToEnd: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

const HillClimbingControls = ({
  currentMap,
  startPosition,
  isPlaying,
  currentStep,
  stepsLength,
  speed,
  currentPosition,
  neighbors,
  bestNeighbor,
  onChangeMap,
  onTogglePlayPause,
  onNextStep,
  onPrevStep,
  onSkipToStart,
  onSkipToEnd,
  onReset,
  onGoToStep,
  onSpeedChange,
}: HillClimbingControlsProps) => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Map Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button onClick={onChangeMap} variant="outline" className="w-full font-semibold border-2 hover:border-drona-green/50" disabled={isPlaying}>
            <Map className="mr-2 h-4 w-4" />
            Change Map
          </Button>
          <div className="text-sm text-drona-gray">Current map: {mapNames[currentMap]}</div>
          <div className="text-xs text-drona-gray mt-2 p-3 bg-drona-light/30 rounded-lg">Click on any square in the map to set the starting position</div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Starting Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="text-sm text-drona-gray">
            Current start: ({startPosition.x}, {startPosition.y}) → Height: {startPosition.value.toFixed(2)}
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

      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Current State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {currentPosition && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                <p className="text-sm font-semibold text-drona-gray">Position</p>
                <p className="text-lg font-bold text-drona-dark">
                  ({currentPosition.x}, {currentPosition.y})
                </p>
              </div>
              <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                <p className="text-sm font-semibold text-drona-gray">Height</p>
                <p className="text-lg font-bold text-drona-dark">{currentPosition.value.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                <p className="text-sm font-semibold text-drona-gray">Neighbors</p>
                <p className="text-lg font-bold text-drona-dark">{neighbors.length}</p>
              </div>
              {bestNeighbor && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-300">
                  <p className="text-sm font-semibold text-drona-gray">Best Neighbor</p>
                  <p className="text-sm font-bold text-drona-dark">
                    ({bestNeighbor.x}, {bestNeighbor.y}) → {bestNeighbor.value.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HillClimbingControls;
