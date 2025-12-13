import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BinarySearchVisualizationProps {
  array: number[];
  left: number | null;
  right: number | null;
  mid: number | null;
  searchValue: number | null;
}

const BinarySearchVisualization = ({ array, left, right, mid, searchValue }: BinarySearchVisualizationProps) => {
  return (
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">Binary Search Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {array.length === 0 ? (
          <div className="text-center text-drona-gray py-10">
            Generate or set a sorted array to begin.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2">
              {array.map((value, index) => {
                const isMid = mid === index;
                const isInRange = left !== null && right !== null && index >= left && index <= right;
                const isFound = isMid && searchValue !== null && value === searchValue;

                return (
                  <div
                    key={index}
                    className={`w-12 h-16 flex flex-col items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all
                      ${isFound ? "bg-green-200 border-green-500 scale-110" : ""}
                      ${isMid && !isFound ? "bg-yellow-100 border-yellow-400 scale-105" : ""}
                      ${!isMid && isInRange ? "bg-blue-50 border-blue-300" : ""}
                      ${!isInRange ? "bg-gray-50 border-gray-200 text-gray-500" : ""}
                    `}
                  >
                    <span>{value}</span>
                    <span className="text-[10px] text-gray-500">idx {index}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-drona-dark">
              <div className="p-3 rounded-lg border-2 border-drona-green/10 bg-drona-light/40">
                <p className="font-semibold">Left</p>
                <p>{left !== null ? left : "—"}</p>
              </div>
              <div className="p-3 rounded-lg border-2 border-drona-green/10 bg-drona-light/40">
                <p className="font-semibold">Mid</p>
                <p>{mid !== null ? mid : "—"}</p>
              </div>
              <div className="p-3 rounded-lg border-2 border-drona-green/10 bg-drona-light/40">
                <p className="font-semibold">Right</p>
                <p>{right !== null ? right : "—"}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BinarySearchVisualization;
