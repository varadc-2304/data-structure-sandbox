import { SortAsc } from "lucide-react";

interface MergeSortVisualizationProps {
  array: number[];
  leftArray: number[];
  rightArray: number[];
  mergedArray: number[];
  activeIndices: number[];
  leftPointer: number;
  rightPointer: number;
  mergedPointer: number;
  comparisonText?: string;
  getBarHeight: (value: number) => number;
}

const MergeSortVisualization = ({
  array,
  leftArray,
  rightArray,
  mergedArray,
  activeIndices,
  leftPointer,
  rightPointer,
  mergedPointer,
  comparisonText,
  getBarHeight,
}: MergeSortVisualizationProps) => {
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
              const isActive = activeIndices.includes(index);
              let bgClass = "bg-card dark:bg-card border-border dark:border-border";
              if (isActive) {
                bgClass = "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600 scale-105";
              } else {
                bgClass = "bg-blue-50 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600";
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

          {(leftArray.length > 0 || rightArray.length > 0 || mergedArray.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leftArray.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground dark:text-foreground">Left Array</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {leftArray.map((value, index) => {
                      const isPointer = index === leftPointer;
                      let bgClass = "bg-blue-50 dark:bg-blue-900/40 border-blue-400 dark:border-blue-600";
                      if (isPointer) {
                        bgClass = "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-600 scale-110";
                      }
                      return (
                        <div
                          key={index}
                          className={`w-12 h-12 flex items-center justify-center font-bold rounded-md border-2 text-sm transition-all ${bgClass}`}
                        >
                          <span className="text-foreground dark:text-foreground">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {rightArray.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground dark:text-foreground">Right Array</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {rightArray.map((value, index) => {
                      const isPointer = index === rightPointer;
                      let bgClass = "bg-green-200 dark:bg-green-800 border-green-600 dark:border-green-600";
                      if (isPointer) {
                        bgClass = "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-600 scale-110";
                      }
                      return (
                        <div
                          key={index}
                          className={`w-12 h-12 flex items-center justify-center font-bold rounded-md border-2 text-sm transition-all ${bgClass}`}
                        >
                          <span className="text-foreground dark:text-foreground">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {mergedArray.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground dark:text-foreground">Merged Array</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mergedArray.map((value, index) => {
                      const isPointer = index === mergedPointer;
                      let bgClass = "bg-gray-200 dark:bg-gray-800 border-gray-400 dark:border-gray-600";
                      if (isPointer) {
                        bgClass = "bg-purple-200 dark:bg-purple-800 border-purple-500 dark:border-purple-600 scale-110";
                      }
                      return (
                        <div
                          key={index}
                          className={`w-12 h-12 flex items-center justify-center font-bold rounded-md border-2 text-sm transition-all ${bgClass}`}
                        >
                          <span className="text-foreground dark:text-foreground">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {comparisonText && (
            <div className="text-center p-4 rounded-xl border border-border bg-card dark:bg-card">
              <p className="text-lg font-semibold text-foreground dark:text-foreground">{comparisonText}</p>
            </div>
          )}

          <div className="flex justify-center gap-6 flex-wrap text-sm text-foreground dark:text-foreground">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-400 dark:border-blue-600 mr-2 rounded-sm"></div>
              <span>Original Array</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-200 dark:bg-yellow-800 border-2 border-yellow-400 dark:border-yellow-600 mr-2 rounded-sm"></div>
              <span>Active Section</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-400 dark:border-blue-600 mr-2 rounded-sm"></div>
              <span>Left Array</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-200 dark:bg-green-800 border-2 border-green-600 dark:border-green-600 mr-2 rounded-sm"></div>
              <span>Right Array</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-200 dark:bg-red-800 border-2 border-red-500 dark:border-red-600 mr-2 rounded-sm"></div>
              <span>Current Pointer</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MergeSortVisualization;
