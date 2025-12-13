import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Step } from "./useAStarVisualizer";

interface AStarStatsProps {
  currentStepData: Step | null;
  goal: { g: number } | null;
}

const AStarStats = ({ currentStepData, goal }: AStarStatsProps) => {
  if (!currentStepData) {
    return (
      <Card className="shadow-lg border-2 border-drona-green/20">
        <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
          <CardTitle className="text-xl font-bold text-drona-dark">Current State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm text-drona-gray">Ready to start</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-2 border-drona-green/20">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-xl font-bold text-drona-dark">Current State</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Current Node</p>
            <p className="text-lg font-bold text-drona-dark">
              ({currentStepData.current.x}, {currentStepData.current.y})
            </p>
          </div>
          <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Open Set Size</p>
            <p className="text-lg font-bold text-drona-dark">{currentStepData.openSet.length}</p>
          </div>
          <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Closed Set Size</p>
            <p className="text-lg font-bold text-drona-dark">{currentStepData.closedSet.length}</p>
          </div>
          <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">F-Score</p>
            <p className="text-sm text-drona-dark">
              f = g + h = {currentStepData.current.g} + {currentStepData.current.h.toFixed(1)} = {currentStepData.current.f.toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AStarStats;
