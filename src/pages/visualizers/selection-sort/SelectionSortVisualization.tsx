import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortAsc } from "lucide-react";

interface SelectionSortVisualizationProps {
  array: number[];
  currentIndex: number;
  scanIndex: number;
  minIndex: number;
  sortedIndices: number[];
  comparisonText?: string;
}

const SelectionSortVisualization = ({
  array,
  currentIndex,
  scanIndex,
  minIndex,
  sortedIndices,
  comparisonText,
}: SelectionSortVisualizationProps) => {
  return (
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">Selection Sort Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        {array.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-drona-gray">
            <div className="text-center">
              <SortAsc className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-xl font-semibold">Generate an array to start visualization</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-center gap-2 min-h-[200px]">
              {array.map((value, index) => {
                const isSorted = sortedIndices.includes(index);
                const isCurrent = currentIndex === index;
                const isMin = minIndex === index;
                const isScan = scanIndex === index;
                const bgClass = isSorted
                  ? "bg-green-100 border-green-400"
                  : isMin
                  ? "bg-purple-100 border-purple-400"
                  : isCurrent
                  ? "bg-blue-100 border-blue-400"
                  : isScan
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-gray-100 border-gray-300";
                return (
                  <div
                    key={index}
                    className={`w-10 sm:w-12 flex flex-col items-center justify-end transition-all duration-200 rounded-md border-2 ${bgClass}`}
                    style={{ height: `${value + 40}px` }}
                  >
                    <span className="text-xs font-semibold text-drona-dark mb-1">{value}</span>
                    <span className="text-[10px] text-drona-gray mb-1">idx {index}</span>
                  </div>
                );
              })}
            </div>

            {comparisonText && (
              <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                <p className="text-lg font-semibold text-drona-dark">{comparisonText}</p>
              </div>
            )}

            <div className="flex justify-center gap-6 flex-wrap text-sm text-drona-dark">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 border-2 border-green-400 mr-2 rounded-sm"></div>
                <span>Sorted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-200 border-2 border-purple-400 mr-2 rounded-sm"></div>
                <span>Current min</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-200 border-2 border-blue-400 mr-2 rounded-sm"></div>
                <span>Current position</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-200 border-2 border-yellow-400 mr-2 rounded-sm"></div>
                <span>Scanning</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectionSortVisualization;
