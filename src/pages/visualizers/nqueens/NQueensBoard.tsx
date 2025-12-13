import { Card, CardContent } from "@/components/ui/card";
import { BoardState } from "./useNQueensVisualizer";

interface NQueensBoardProps {
  boardSize: number;
  displayBoard: (0 | 1)[][];
  currentStepInfo: BoardState | null;
}

const NQueensBoard = ({ boardSize, displayBoard, currentStepInfo }: NQueensBoardProps) => {
  return (
    <div className="flex justify-center">
      <div
        className="grid border border-gray-800"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          width: Math.min(400, boardSize * 50),
          height: Math.min(400, boardSize * 50),
        }}
      >
        {displayBoard.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const isCurrentPosition = currentStepInfo && currentStepInfo.currentRow === rowIdx && currentStepInfo.currentColumn === colIdx;

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`
                  flex items-center justify-center
                  ${(rowIdx + colIdx) % 2 === 0 ? "bg-gray-100" : "bg-gray-400"}
                  ${isCurrentPosition && currentStepInfo.isConflict ? "bg-red-300" : ""}
                  ${isCurrentPosition && currentStepInfo.isBacktracking ? "bg-yellow-300" : ""}
                  ${isCurrentPosition && !currentStepInfo.isConflict && !currentStepInfo.isBacktracking ? "bg-blue-300" : ""}
                `}
                style={{
                  width: Math.min(50, 400 / boardSize),
                  height: Math.min(50, 400 / boardSize),
                }}
              >
                {cell === 1 && <span className="text-2xl">♛</span>}
                {isCurrentPosition && cell === 0 && (
                  <span className={`text-xl ${currentStepInfo.isConflict ? "text-red-600" : "text-blue-600"}`}>●</span>
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
