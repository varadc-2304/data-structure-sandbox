
import React from 'react';
import { cn } from '@/lib/utils';
import { GanttChartItem } from '@/utils/cpuSchedulingUtils';

interface GanttChartProps {
  data: GanttChartItem[];
  currentTime: number;
  className?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ data, currentTime, className }) => {
  if (!data.length) {
    return (
      <div className={cn("p-4 border border-dashed border-gray-300 rounded-lg bg-white", className)}>
        <div className="text-center text-gray-500">No data to display</div>
      </div>
    );
  }

  const totalTime = data[data.length - 1].endTime;
  
  return (
    <div className={cn("rounded-lg overflow-hidden bg-white", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-full p-4">
          {/* Gantt Chart */}
          <div className="relative">
            {/* Timeline */}
            <div className="flex text-xs text-arena-gray mb-1">
              {Array.from({ length: totalTime + 1 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-10 text-center">{i}</div>
              ))}
            </div>
            
            {/* Chart Body */}
            <div className="flex h-12 mb-4 relative">
              {data.map((item, index) => {
                const width = (item.endTime - item.startTime) * 40; // 40px per time unit
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "h-full flex items-center justify-center text-white font-medium rounded-md relative overflow-hidden",
                      currentTime >= item.startTime && currentTime < item.endTime ? "ring-2 ring-white ring-offset-2" : ""
                    )}
                    style={{
                      width: `${width}px`,
                      backgroundColor: item.color,
                      marginLeft: index === 0 ? `${item.startTime * 40}px` : '0',
                      opacity: currentTime >= item.endTime ? 0.7 : 1,
                    }}
                  >
                    {item.process}
                  </div>
                );
              })}
              
              {/* Current Time Indicator */}
              {currentTime <= totalTime && (
                <div 
                  className="absolute top-0 h-full border-l-2 border-arena-red z-10 pointer-events-none"
                  style={{ 
                    left: `${currentTime * 40}px`,
                    height: '200%',
                    borderLeftWidth: '2px',
                  }}
                >
                  <div className="bg-arena-red text-white text-xs rounded px-1 absolute -top-6 -translate-x-1/2">
                    {currentTime}s
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
