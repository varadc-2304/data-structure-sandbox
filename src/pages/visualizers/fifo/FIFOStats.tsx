import { Card, CardContent } from "@/components/ui/card";
import { ReferenceHistory } from "./useFIFOVisualizer";

interface FIFOStatsProps {
  pageFaults: number;
  pageHits: number;
  referenceHistory: ReferenceHistory[];
}

const FIFOStats = ({ pageFaults, pageHits, referenceHistory }: FIFOStatsProps) => {
  const faultRate = referenceHistory.length ? ((pageFaults / referenceHistory.length) * 100).toFixed(1) : "0";
  const hitRate = referenceHistory.length ? ((pageHits / referenceHistory.length) * 100).toFixed(1) : "0";

  if (referenceHistory.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="bg-arena-light">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-arena-gray">Page Faults</p>
          <p className="text-xl font-bold text-arena-dark">{pageFaults}</p>
        </CardContent>
      </Card>
      <Card className="bg-arena-light">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-arena-gray">Page Hits</p>
          <p className="text-xl font-bold text-arena-dark">{pageHits}</p>
        </CardContent>
      </Card>
      <Card className="bg-arena-light">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-arena-gray">Fault Rate</p>
          <p className="text-xl font-bold text-arena-dark">{faultRate}%</p>
        </CardContent>
      </Card>
      <Card className="bg-arena-light">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-arena-gray">Hit Rate</p>
          <p className="text-xl font-bold text-arena-dark">{hitRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FIFOStats;
