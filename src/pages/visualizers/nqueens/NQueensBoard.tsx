import { Card, CardContent } from "@/components/ui/card";
import { BoardState } from "./useNQueensVisualizer";

interface NQueensBoardProps {
  boardSize: number;
  displayBoard: (0 | 1)[][];
  currentStepInfo: BoardState | null;
}

const NQueensBoard = ({ boardSize, displayBoard, currentStepInfo }: NQueensBoardProps) => {
  // Calculate cell size based on board size - scale dynamically
  // For smaller boards (4-5), use larger cells, for larger boards (6-8), use smaller cells
  const baseSize = 400;
  const cellSize = Math.max(30, Math.min(80, baseSize / boardSize));
  const boardSizePx = cellSize * boardSize;
  const queenSize = Math.max(16, Math.min(32, cellSize * 0.6));

  return (
    <div className="flex justify-center">
      <div
        className="grid border-2 border-foreground dark:border-foreground"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          width: `${boardSizePx}px`,
          height: `${boardSizePx}px`,
        }}
      >
        {displayBoard.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isCurrentPosition = currentStepInfo && currentStepInfo.currentRow === rowIdx && currentStepInfo.currentColumn === colIdx;

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`
                  flex items-center justify-center transition-all duration-300
                  ${(rowIdx + colIdx) % 2 === 0 
                    ? "bg-gray-100 dark:bg-gray-800" 
                    : "bg-gray-400 dark:bg-gray-600"}
                  ${isCurrentPosition && currentStepInfo.isConflict 
                    ? "bg-red-300 dark:bg-red-700" 
                    : ""}
                  ${isCurrentPosition && currentStepInfo.isBacktracking 
                    ? "bg-yellow-300 dark:bg-yellow-700" 
                    : ""}
                  ${isCurrentPosition && !currentStepInfo.isConflict && !currentStepInfo.isBacktracking 
                    ? "bg-blue-300 dark:bg-blue-700" 
                    : ""}
                `}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
              >
                {cell === 1 && (
                  <span 
                    className="text-foreground dark:text-foreground"
                    style={{ fontSize: `${queenSize}px` }}
                  >
                    ♛
                  </span>
                )}
                {isCurrentPosition && cell === 0 && (
                  <span 
                    className={`${currentStepInfo.isConflict ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`}
                    style={{ fontSize: `${queenSize * 0.7}px` }}
                  >
                    ●
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NQueensBoard;
