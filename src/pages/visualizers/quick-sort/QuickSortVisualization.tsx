import { SortAsc } from "lucide-react";

interface QuickSortVisualizationProps {
  array: number[];
  pivotIndex: number;
  low: number;
  high: number;
  i: number;
  j: number;
  partitionedIndices: number[];
  comparisonText?: string;
  getBarHeight: (value: number) => number;
}

const QuickSortVisualization = ({
  array,
  pivotIndex,
  low,
  high,
  i,
  j,
  partitionedIndices,
  comparisonText,
  getBarHeight,
}: QuickSortVisualizationProps) => {
  return (
    <div className="space-y-6">
      {array.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <SortAsc className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p className="text-xl font-semibold">Generate an array to start visualization</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end justify-center gap-2 min-h-[250px]">
            {array.map((value, index) => {
              const isPivot = pivotIndex === index;
              const isInRange = low !== -1 && high !== -1 && index >= low && index <= high;
              const isI = i === index;
              const isJ = j === index;
              const isPartitioned = partitionedIndices.includes(index);

              let bgClass = "bg-card dark:bg-card border-border dark:border-border";
              if (isPartitioned) {
                bgClass = "bg-green-200 dark:bg-green-800 border-green-400 dark:border-green-600";
              } else if (isPivot) {
                bgClass = "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-600 scale-110";
              } else if (isI) {
                bgClass = "bg-blue-200 dark:bg-blue-800 border-blue-400 dark:border-blue-600";
              } else if (isJ) {
                bgClass = "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600";
              } else if (isInRange) {
                bgClass = "bg-purple-200 dark:bg-purple-800 border-purple-400 dark:border-purple-600";
              } else {
                bgClass = "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600";
              }

              return (
                <div
                  key={index}
                  className={`w-10 sm:w-12 flex flex-col items-center justify-end transition-all duration-200 rounded-md border-2 ${bgClass}`}
                  style={{ height: `${getBarHeight(value) + 40}px` }}
                >
                  <span className="text-xs font-semibold text-foreground dark:text-foreground mb-1">{value}</span>
                  <span className="text-[10px] text-muted-foreground dark:text-muted-foreground mb-1">idx {index}</span>
                </div>
              );
            })}
          </div>

          {comparisonText && (
            <div className="text-center p-4 rounded-xl border border-border bg-card dark:bg-card">
              <p className="text-lg font-semibold text-foreground dark:text-foreground">{comparisonText}</p>
            </div>
          )}

          <div className="flex justify-center gap-6 flex-wrap text-sm text-foreground dark:text-foreground">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800 border-2 border-red-500 dark:border-red-600 mr-2 rounded-sm"></div>
              <span>Pivot</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 border-2 border-blue-400 dark:border-blue-600 mr-2 rounded-sm"></div>
              <span>Partition index (i)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 dark:border-yellow-600 mr-2 rounded-sm"></div>
              <span>Scan index (j)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-200 dark:bg-purple-800 border-2 border-purple-400 dark:border-purple-600 mr-2 rounded-sm"></div>
              <span>Current subarray</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 dark:bg-green-800 border-2 border-green-400 dark:border-green-600 mr-2 rounded-sm"></div>
              <span>Partitioned</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickSortVisualization;
