import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaybackControlsProps {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFirst?: () => void;
  onLast?: () => void;
  disabled?: boolean;
  className?: string;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isRunning,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onResume,
  onReset,
  onPrev,
  onNext,
  onFirst,
  onLast,
  disabled = false,
  className = '',
}) => {
  const hasSteps = totalSteps > 0;
  const canGoPrev = hasSteps && currentStep > -1;
  const canGoNext = hasSteps && currentStep < totalSteps - 1;
  const canResume = hasSteps && !isRunning && currentStep < totalSteps - 1;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <Button
        onClick={onPlay}
        variant="default"
        size="sm"
        disabled={disabled || isRunning}
      >
        <Play className="mr-2 h-3 w-3" />
        Run
      </Button>
      
      <Button
        onClick={onPause}
        variant="outline"
        size="sm"
        disabled={!hasSteps || !isRunning}
      >
        <Pause className="mr-2 h-3 w-3" />
        Pause
      </Button>
      
      <Button
        onClick={onResume}
        variant="outline"
        size="sm"
        disabled={!canResume}
      >
        <Play className="mr-2 h-3 w-3" />
        Resume
      </Button>
      
      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        disabled={!hasSteps}
      >
        <SkipBack className="mr-2 h-3 w-3" />
        Reset
      </Button>
      
      <Button
        onClick={onPrev}
        variant="outline"
        size="sm"
        disabled={!canGoPrev}
      >
        <SkipBack className="h-3 w-3" />
      </Button>
      
      <Button
        onClick={onNext}
        variant="outline"
        size="sm"
        disabled={!canGoNext}
      >
        <SkipForward className="h-3 w-3" />
      </Button>
      
      {hasSteps && (
        <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
          <Timer className="mr-2 h-3 w-3 text-primary" />
          <span className="text-foreground font-medium text-sm">
            Step: {currentStep + 1} / {totalSteps}
          </span>
        </div>
      )}
    </div>
  );
};

export default PlaybackControls;
