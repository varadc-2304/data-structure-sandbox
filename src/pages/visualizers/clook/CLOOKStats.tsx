import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SeekOperation } from "./useCLOOKVisualizer";

interface CLOOKStatsProps {
  totalSeekTime: number;
  seekHistory: SeekOperation[];
  currentHeadPosition: number;
}

const CLOOKStats = ({ totalSeekTime, seekHistory, currentHeadPosition }: CLOOKStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-foreground">Total Seek Time</p>
            <p className="text-2xl font-bold text-foreground">{totalSeekTime} cylinders</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-foreground">Average Seek Time</p>
            <p className="text-2xl font-bold text-foreground">{seekHistory.length ? (totalSeekTime / seekHistory.length).toFixed(2) : "0"} cylinders</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <p className="text-sm text-foreground">Current Head Position</p>
            <p className="text-2xl font-bold text-foreground">{currentHeadPosition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CLOOKStats;
