import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SeekOperation } from "./useCSCANVisualizer";

interface CSCANStatsProps {
  totalSeekTime: number;
  seekHistory: SeekOperation[];
  currentHeadPosition: number;
}

const CSCANStats = ({ totalSeekTime, seekHistory, currentHeadPosition }: CSCANStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-drona-light p-4 rounded-lg">
            <p className="text-sm text-drona-gray">Total Seek Time</p>
            <p className="text-2xl font-bold text-drona-dark">{totalSeekTime} cylinders</p>
          </div>
          <div className="bg-drona-light p-4 rounded-lg">
            <p className="text-sm text-drona-gray">Average Seek Time</p>
            <p className="text-2xl font-bold text-drona-dark">{seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : "0"} cylinders</p>
          </div>
          <div className="bg-drona-light p-4 rounded-lg">
            <p className="text-sm text-drona-gray">Current Head Position</p>
            <p className="text-2xl font-bold text-drona-dark">{currentHeadPosition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSCANStats;
