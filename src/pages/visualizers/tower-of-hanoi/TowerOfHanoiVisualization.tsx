import { Mountain } from "lucide-react";

interface TowerOfHanoiVisualizationProps {
  towers: number[][];
  movingDisk: number | null;
  fromTower: number | null;
  toTower: number | null;
  isInTransit: boolean;
  numDisks: number;
  speed?: number;
}

const diskColors = [
  { bg: "bg-red-500 dark:bg-red-600", border: "border-red-600 dark:border-red-700", text: "text-white" },
  { bg: "bg-blue-500 dark:bg-blue-600", border: "border-blue-600 dark:border-blue-700", text: "text-white" },
  { bg: "bg-green-500 dark:bg-green-600", border: "border-green-600 dark:border-green-700", text: "text-white" },
  { bg: "bg-yellow-500 dark:bg-yellow-600", border: "border-yellow-600 dark:border-yellow-700", text: "text-white" },
  { bg: "bg-purple-500 dark:bg-purple-600", border: "border-purple-600 dark:border-purple-700", text: "text-white" },
  { bg: "bg-pink-500 dark:bg-pink-600", border: "border-pink-600 dark:border-pink-700", text: "text-white" },
  { bg: "bg-indigo-500 dark:bg-indigo-600", border: "border-indigo-600 dark:border-indigo-700", text: "text-white" },
];

const TowerOfHanoiVisualization = ({ towers, movingDisk, fromTower, toTower, isInTransit, numDisks, speed = 1 }: TowerOfHanoiVisualizationProps) => {
  const towerNames = ["Source", "Auxiliary", "Destination"];

  // Calculate rod height dynamically based on number of discs
  // Each disc is 35px tall + 2px margin = 37px per disc
  // Base height: 40px, plus space for all discs
  const diskHeight = 35;
  const diskMargin = 2;
  const baseHeight = 20;
  const rodHeight = numDisks * (diskHeight + diskMargin) + 20; // 20px extra space at top
  const containerHeight = rodHeight + baseHeight + 20; // 20px padding

  if (numDisks === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Mountain className="mx-auto h-16 w-16 mb-4 opacity-50" />
          <p className="text-xl font-semibold">Set number of disks to start visualization</p>
        </div>
      </div>
    );
  }

  // Calculate positions for moving disc animation
  // Using viewport-based calculations for smoother animation
  const getTowerCenterX = (towerIndex: number) => {
    // For a 3-column grid, each column center is at: 16.67%, 50%, 83.33%
    const columnWidth = 100 / 3;
    return (towerIndex * columnWidth) + (columnWidth / 2);
  };

  // Animation duration matches step timing for smooth transitions
  const animationDuration = 1500 / speed; // Match the step timing

  return (
    <div className="space-y-6">
      {/* Three Towers with Rods */}
      <div className="relative grid grid-cols-3 gap-6" style={{ minHeight: `${containerHeight}px` }}>
        {towers.map((tower, towerIndex) => {
          const isFromTower = fromTower === towerIndex;
          const isToTower = toTower === towerIndex;
          // Don't show the moving disc in the tower if it's in transit
          const shouldShowMovingDisk = movingDisk !== null && 
            ((isInTransit && fromTower === towerIndex) || (!isInTransit && toTower === towerIndex && movingDisk === tower[tower.length - 1]));
          
          return (
            <div key={towerIndex} className="flex flex-col items-center">
              <h3 className={`text-lg font-semibold mb-4 transition-all ${
                isFromTower ? "text-primary dark:text-primary" : isToTower ? "text-green-600 dark:text-green-400" : "text-foreground"
              }`}>
                {towerNames[towerIndex]}
              </h3>
              
              {/* Rod Container */}
              <div className="relative w-full flex flex-col items-center justify-end" style={{ height: `${containerHeight}px` }}>
                {/* Base Platform */}
                <div className="absolute bottom-0 w-full h-4 bg-foreground dark:bg-foreground rounded-t-lg z-0"></div>
                
                {/* Rod */}
                <div 
                  className={`absolute w-2 rounded-full transition-all z-0 ${
                    isFromTower || isToTower 
                      ? "bg-primary dark:bg-primary shadow-lg" 
                      : "bg-muted-foreground dark:bg-muted-foreground"
                  }`} 
                  style={{ 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    bottom: `${baseHeight}px`,
                    height: `${rodHeight}px`
                  }}
                ></div>
                
                {/* Disks Stack - positioned at bottom */}
                <div className="absolute bottom-0 w-full flex flex-col-reverse items-center" style={{ bottom: `${baseHeight}px`, paddingBottom: '0' }}>
                  {tower.length === 0 ? (
                    <div className="text-muted-foreground text-sm mb-2 relative z-10">Empty</div>
                  ) : (
                    tower.map((disk, diskIndex) => {
                      // Skip rendering the moving disk in source tower during animation
                      if (movingDisk === disk && fromTower === towerIndex) {
                        return null; // Hide in source during animation
                      }
                      // Don't show disc in destination if animation is still in progress
                      // The disc will appear after animation completes (when isInTransit becomes false)
                      if (isInTransit && toTower === towerIndex && movingDisk === disk) {
                        return null; // Hide in destination during animation
                      }
                      
                      const colorIndex = (disk - 1) % diskColors.length;
                      const colors = diskColors[colorIndex];
                      const widthPercentage = Math.max(20, (disk / numDisks) * 60 + 20);
                      const diskWidth = `${widthPercentage}%`;
                      
                      return (
                        <div
                          key={diskIndex}
                          className={`${colors.bg} ${colors.border} ${colors.text} border-2 rounded-lg flex items-center justify-center font-bold transition-all duration-500 relative z-10 shadow-md`}
                          style={{
                            width: diskWidth,
                            height: `${diskHeight}px`,
                            minWidth: "80px",
                            maxWidth: "90%",
                            marginBottom: diskIndex === 0 ? "0" : `${diskMargin}px`,
                          }}
                        >
                          <span className="text-sm">{disk}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Moving Disc Animation - shown when a disc is being moved */}
        {movingDisk !== null && fromTower !== null && toTower !== null && (() => {
          const fromX = getTowerCenterX(fromTower);
          const toX = getTowerCenterX(toTower);
          const startY = containerHeight - baseHeight - 20;
          const liftY = containerHeight - baseHeight - rodHeight - 40;
          const animationId = `moveDisc${fromTower}to${toTower}`;
          
          return (
            <>
              <style>{`
                @keyframes ${animationId} {
                  0% {
                    left: ${fromX}%;
                    top: ${startY}px;
                    transform: translate(-50%, -50%);
                  }
                  20% {
                    left: ${fromX}%;
                    top: ${liftY}px;
                    transform: translate(-50%, -50%);
                  }
                  80% {
                    left: ${toX}%;
                    top: ${liftY}px;
                    transform: translate(-50%, -50%);
                  }
                  100% {
                    left: ${toX}%;
                    top: ${startY}px;
                    transform: translate(-50%, -50%);
                  }
                }
              `}</style>
              <div
                className="absolute z-50 pointer-events-none"
                style={{
                  willChange: 'left, top, transform',
                  animation: `${animationId} ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                }}
              >
                {(() => {
                  const colorIndex = (movingDisk - 1) % diskColors.length;
                  const colors = diskColors[colorIndex];
                  const widthPercentage = Math.max(20, (movingDisk / numDisks) * 60 + 20);
                  const diskWidth = `${widthPercentage}%`;
                  
                  return (
                    <div
                      className={`${colors.bg} ${colors.border} ${colors.text} border-2 rounded-lg flex items-center justify-center font-bold shadow-2xl`}
                      style={{
                        width: diskWidth,
                        height: `${diskHeight}px`,
                        minWidth: "80px",
                        maxWidth: "90%",
                      }}
                    >
                      <span className="text-sm">{movingDisk}</span>
                    </div>
                  );
                })()}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default TowerOfHanoiVisualization;
