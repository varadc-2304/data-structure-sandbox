
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { GanttChartItem } from '@/utils/cpuSchedulingUtils';

interface GanttChartProps {
  data: GanttChartItem[];
  currentTime: number;
  className?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ data, currentTime, className }) => {
  const [animatedCurrentTime, setAnimatedCurrentTime] = useState(0);
  
  // Smooth animation for the current time
  useEffect(() => {
    // Immediately set to 0 if current time is 0
    if (currentTime === 0) {
      setAnimatedCurrentTime(0);
      return;
    }
    
    // Gradually animate to the current time
    const interval = setInterval(() => {
      setAnimatedCurrentTime((prev) => {
        if (prev < currentTime) return prev + 0.1;
        if (prev > currentTime) return currentTime; // Jump immediately if we need to go backward
        return prev;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [currentTime]);

  if (!data.length) {
    return (
      <div className={cn("p-4 border border-dashed border-gray-300 rounded-lg bg-white", className)}>
        <div className="text-center text-gray-500">No data to display</div>
      </div>
    );
  }

  const totalTime = Math.max(...data.map(item => item.endTime));
  
  return (
    <div className={cn("rounded-lg overflow-hidden bg-white", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-full p-4">
          {/* Gantt Chart */}
          <div className="relative">
            {/* Timeline */}
            <div className="flex text-xs text-drona-gray mb-1">
              {Array.from({ length: totalTime + 1 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-10 text-center">{i} s</div>
              ))}
            </div>
            
            {/* Chart Body */}
            <div className="flex h-12 mb-4 relative">
              {data.map((item, index) => {
                const width = (item.endTime - item.startTime) * 40; // 40px per time unit
                const leftPosition = item.startTime * 40; // Calculate absolute position
                const visibleWidth = Math.min(
                  width,
                  Math.max(0, animatedCurrentTime - item.startTime) * 40
                );
                
                return (
                  <div
                    key={index}
                    className="absolute h-full"
                    style={{
                      left: `${leftPosition}px`,
                      width: `${width}px`,
                    }}
                  >
                    <div
                      className={cn(
                        "h-full flex items-center justify-center text-white font-medium rounded-md relative overflow-hidden",
                        animatedCurrentTime >= item.startTime && animatedCurrentTime < item.endTime ? "ring-2 ring-white ring-offset-2" : ""
                      )}
                      style={{
                        width: `${Math.max(0, visibleWidth)}px`,
                        backgroundColor: item.color,
                        opacity: animatedCurrentTime >= item.endTime ? 0.7 : 1,
                        transition: "width 0.3s ease-out"
                      }}
                    >
                      {item.process}
                    </div>
                  </div>
                );
              })}
              
              {/* Current Time Indicator */}
              {animatedCurrentTime <= totalTime && (
                <div 
                  className="absolute top-0 h-full border-l-2 border-drona-green z-10 pointer-events-none"
                  style={{ 
                    left: `${animatedCurrentTime * 40}px`,
                    height: '200%',
                    borderLeftWidth: '2px',
                    transition: "left 0.3s ease-out"
                  }}
                >
                  <div className="bg-drona-green text-white text-xs rounded px-1 absolute -top-6 -translate-x-1/2">
                    {Math.floor(animatedCurrentTime * 10) / 10}s
                  </div>
                </div>
              )}
            </div>
            
            {/* Timeline Markers */}
            <div className="flex border-t border-gray-200">
              {Array.from({ length: totalTime + 1 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-10 border-l border-gray-200 h-2" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
