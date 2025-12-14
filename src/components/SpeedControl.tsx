import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  speed,
  onSpeedChange,
  min = 0.5,
  max = 3,
  step = 0.25,
  className = '',
}) => {
  const speedOptions = [0.5, 1, 1.25, 1.5, 1.75, 2, 3];

  // Find the closest valid speed option
  const getClosestSpeed = (value: number) => {
    return speedOptions.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    const closestSpeed = getClosestSpeed(newValue);
    onSpeedChange(closestSpeed);
  };

  return (
    <div className={className}>
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">
          Animation Speed: {speed}x
        </Label>
        <Slider
          value={[speed]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.5x</span>
          <span>1x</span>
          <span>1.25x</span>
          <span>1.5x</span>
          <span>1.75x</span>
          <span>2x</span>
          <span>3x</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedControl;
