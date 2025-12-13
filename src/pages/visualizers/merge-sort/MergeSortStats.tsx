import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MergeSortStatsProps {
  currentStep: number;
  arrayLength: number;
  sortStepsCount: number;
}

const MergeSortStats = ({ currentStep, arrayLength, sortStepsCount }: MergeSortStatsProps) => {
  return (
    <Card className="shadow-lg border-2 border-drona-green/20">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-4">
          <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Current Step</p>
            <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep)}</p>
          </div>
          <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Array Size</p>
            <p className="text-3xl font-bold text-drona-dark">{arrayLength}</p>
          </div>
          <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
            <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
            <p className="text-xl font-bold text-drona-dark">{sortStepsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MergeSortStats;
