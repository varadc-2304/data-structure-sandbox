import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Position, Step } from "./useHillClimbingVisualizer";

interface HillClimbingMapProps {
  startPosition: Position;
  path: Position[];
  currentStep: number;
  currentPosition: Position | null;
  neighbors: Position[];
  bestNeighbor: Position | null;
  getHeight: (x: number, y: number) => number;
  getColorForHeight: (height: number) => string;
  onMapClick: (event: React.MouseEvent<SVGSVGElement>) => void;
  currentStepData: Step | null;
}

const HillClimbingMap = ({
  startPosition,
  path,
  currentStep,
  currentPosition,
  neighbors,
  bestNeighbor,
  getHeight,
  getColorForHeight,
  onMapClick,
  currentStepData,
}: HillClimbingMapProps) => {
  return (
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">Hill Climbing Search</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6">
          <svg width="550" height="450" viewBox="0 0 550 450" className="border rounded-lg bg-white mx-auto cursor-pointer" onClick={onMapClick}>
            {Array.from({ length: 11 }, (_, x) =>
              Array.from({ length: 11 }, (_, y) => {
                const height = getHeight(x, y);
                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x * 50}
                    y={y * 40}
                    width="50"
                    height="40"
                    fill={getColorForHeight(height)}
                    opacity="0.7"
                    stroke="#ddd"
                    strokeWidth="1"
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                  />
                );
              })
            )}

            <circle cx={startPosition.x * 50 + 25} cy={startPosition.y * 40 + 20} r="8" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" opacity="0.8" />

            {path.length > 1 && currentStep >= 0 && (
              <polyline
                points={path
                  .slice(0, Math.min(currentStep + 1, path.length))
                  .map((p) => `${p.x * 50 + 25},${p.y * 40 + 20}`)
                  .join(" ")}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
            )}

            {currentPosition && (
              <circle cx={currentPosition.x * 50 + 25} cy={currentPosition.y * 40 + 20} r="12" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
            )}

            {neighbors.map((neighbor, index) => (
              <circle key={index} cx={neighbor.x * 50 + 25} cy={neighbor.y * 40 + 20} r="8" fill="#60a5fa" opacity="0.7" stroke="#2563eb" strokeWidth="2" />
            ))}

            {bestNeighbor && (
              <circle cx={bestNeighbor.x * 50 + 25} cy={bestNeighbor.y * 40 + 20} r="10" fill="#628141" stroke="#4a6b2f" strokeWidth="3" />
            )}

            {Array.from({ length: 11 }, (_, i) => (
              <g key={i}>
                <text x={i * 50 + 25} y="435" textAnchor="middle" className="text-xs text-drona-gray">
                  {i}
                </text>
                <text x="10" y={i * 40 + 25} textAnchor="middle" className="text-xs text-drona-gray">
                  {i}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
          <h3 className="font-bold text-drona-dark mb-2">Algorithm Status:</h3>
          <p className="text-sm text-drona-gray">{currentStepData?.description || "Ready to start"}</p>
        </div>

        {currentStepData?.isStuck && (
          <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-drona-dark mb-2">🏔️ Local Maximum Found!</h3>
            <p className="text-sm text-drona-gray">The algorithm has reached a local maximum and cannot improve further. This is a limitation of basic hill climbing - it can get stuck at local optima.</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200">
            <CardContent className="text-center p-4">
              <div className="w-4 h-4 bg-purple-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-bold text-drona-dark">Start Position</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
            <CardContent className="text-center p-4">
              <div className="w-4 h-4 bg-red-600 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-bold text-drona-dark">Current Position</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
            <CardContent className="text-center p-4">
              <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-bold text-drona-dark">Neighbors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
            <CardContent className="text-center p-4">
              <div className="w-4 h-4 bg-green-700 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-bold text-drona-dark">Best Neighbor</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-drona-dark">Algorithm Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
              <li>Start at an initial position (click on the map to set)</li>
              <li>Evaluate all neighboring positions</li>
              <li>Move to the neighbor with the highest value</li>
              <li>Repeat until no neighbor is better (local maximum)</li>
            </ol>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default HillClimbingMap;
