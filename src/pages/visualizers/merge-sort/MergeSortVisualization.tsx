import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">Array Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        {array.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-drona-gray">
            <div className="text-center">
              <SortAsc className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <p className="text-xl font-semibold">Generate an array to start visualization</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-end justify-center gap-1 h-40">
              {array.map((value, index) => (
                <div
                  key={index}
                  className={`w-8 transition-all flex items-center justify-center font-bold text-white rounded-t-lg text-sm ${
                    activeIndices.includes(index) ? "bg-yellow-500 scale-110 shadow-lg" : "bg-blue-500"
                  }`}
                  style={{
                    height: `${getBarHeight(value)}px`,
                  }}
                >
                  {value}
                </div>
              ))}
            </div>

            {(leftArray.length > 0 || rightArray.length > 0 || mergedArray.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leftArray.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-drona-dark">Left Array</h3>
                    <div className="flex gap-1 justify-center">
                      {leftArray.map((value, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm ${
                            index === leftPointer ? "bg-red-500 scale-110" : "bg-blue-400"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rightArray.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-drona-dark">Right Array</h3>
                    <div className="flex gap-1 justify-center">
                      {rightArray.map((value, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm ${
                            index === rightPointer ? "bg-red-500 scale-110" : "bg-green-700"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mergedArray.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-drona-dark">Merged Array</h3>
                    <div className="flex gap-1 justify-center">
                      {mergedArray.map((value, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center font-bold text-white rounded text-sm ${
                            index === mergedPointer ? "bg-purple-500 scale-110" : "bg-gray-500"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {comparisonText && (
              <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                <p className="text-lg font-semibold text-drona-dark">{comparisonText}</p>
              </div>
            )}

            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
                <span className="font-medium">Original Array</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 mr-2 rounded"></div>
                <span className="font-medium">Active Section</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-400 mr-2 rounded"></div>
                <span className="font-medium">Left Array</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-700 mr-2 rounded"></div>
                <span className="font-medium">Right Array</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                <span className="font-medium">Current Pointer</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MergeSortVisualization;
