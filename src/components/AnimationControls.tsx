import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StepForward, StepBack, RotateCcw, Square, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimationControlsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  speed: number; // 0.5, 1, 2, 5
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onStop: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  canStepForward,
  canStepBackward,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onStop,
  onSpeedChange,
  className,
}) => {
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
  ];

  return (
    <div className={cn('flex flex-wrap items-center gap-2 p-4 bg-secondary rounded-lg border border-border', className)}>
      {/* Play/Pause */}
      <Button
        variant="outline"
        size="sm"
        onClick={isPlaying ? onPause : onPlay}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Step Controls */}
      <Button
        variant="outline"
        size="sm"
        onClick={onStepBackward}
        disabled={!canStepBackward}
        title="Step Backward (←)"
      >
        <StepBack className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onStepForward}
        disabled={!canStepForward}
        title="Step Forward (→)"
      >
        <StepForward className="h-4 w-4" />
      </Button>

      {/* Speed Control */}
      <div className="flex items-center gap-2 ml-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <div className="flex gap-1">
          {speedOptions.map((option) => (
            <Button
              key={option.value}
              variant={speed === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(option.value)}
              className="min-w-[3rem]"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Reset & Stop */}
      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onStop}
          title="Stop"
        >
          <Square className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          title="Reset (Ctrl+R)"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnimationControls;
