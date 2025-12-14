import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface LinearSearchVisualizationProps {
  array: number[];
  currentIndex: number | null;
  searchValue: number | null;
  found: boolean | null;
  foundIndex: number | null;
}

const LinearSearchVisualization = ({
  array,
  currentIndex,
  searchValue,
  found,
  foundIndex,
}: LinearSearchVisualizationProps) => {
  return (
    <div className="space-y-6">
      {array.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Search className="mx-auto h-16 w-16 mb-4 opacity-50" />
            <p className="text-xl font-semibold">Generate an array to start visualization</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3">
            {array.map((value, index) => {
              const isCurrent = currentIndex === index;
              const isFound = found === true && foundIndex === index;
              let bgClass = "bg-card dark:bg-card border-border dark:border-border";
              if (isFound) {
                bgClass = "bg-green-200 dark:bg-green-800 border-green-500 dark:border-green-600 scale-110 animate-pulse";
              } else if (isCurrent) {
                bgClass = "bg-yellow-200 dark:bg-yellow-800 border-yellow-400 dark:border-yellow-600 scale-105";
              } else if (currentIndex !== null && index < currentIndex) {
                bgClass = "bg-secondary dark:bg-secondary/50 border-border dark:border-border/50 opacity-50 dark:opacity-40";
              }
              return (
                <div
                  key={index}
                  className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl border transition-all duration-300 font-bold text-lg ${bgClass}`}
                >
                  <span className="text-foreground dark:text-foreground">{value}</span>
                  <span className="text-[10px] text-muted-foreground dark:text-muted-foreground">idx {index}</span>
                </div>
              );
            })}
          </div>

          {found !== null && (
            <div className="text-center p-6 rounded-lg border border-border bg-card">
              {found ? (
                <div className="text-green-700 dark:text-green-400 text-xl font-bold">
                  ✅ Found {searchValue} at index {foundIndex}!
                </div>
              ) : (
                <div className="text-red-600 dark:text-red-400 text-xl font-bold">❌ {searchValue} not found in the array.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinearSearchVisualization;
