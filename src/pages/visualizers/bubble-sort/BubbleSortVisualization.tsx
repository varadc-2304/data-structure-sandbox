import { SortAsc } from "lucide-react";

interface BubbleSortVisualizationProps {
  array: number[];
  currentSwapIndices: number[];
  sortedIndices: number[];
  comparisonText?: string;
}

const BubbleSortVisualization = ({
  array,
  currentSwapIndices,
  sortedIndices,
  comparisonText,
}: BubbleSortVisualizationProps) => {
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
          <div className="flex items-end justify-center gap-2 min-h-[200px]">
            {array.map((value, index) => {
              const isSwapping = currentSwapIndices.includes(index);
              const isSorted = sortedIndices.includes(index);
              
              let bgClass = "bg-card dark:bg-card border-border dark:border-border";
              if (isSorted) {
                bgClass = "bg-green-200 dark:bg-green-800 border-green-400 dark:border-green-600";
              } else if (isSwapping) {
                bgClass = "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600 scale-105";
              } else {
                bgClass = "bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600";
              }
              
              return (
                <div
                  key={index}
                  className={`w-10 sm:w-12 flex flex-col items-center justify-end transition-all duration-200 rounded-md border-2 ${bgClass}`}
                  style={{ height: `${value + 40}px` }}
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
              <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-600 mr-2 rounded-sm"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 dark:border-yellow-600 mr-2 rounded-sm"></div>
              <span>Currently comparing/swapping</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 dark:bg-green-800 border-2 border-green-400 dark:border-green-600 mr-2 rounded-sm"></div>
              <span>Sorted portion</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BubbleSortVisualization;
