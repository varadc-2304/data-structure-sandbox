import { Card, CardContent } from "@/components/ui/card";
import { ReferenceHistory } from "./useMRUVisualizer";

interface MRUStatsProps {
  pageFaults: number;
  pageHits: number;
  referenceHistory: ReferenceHistory[];
}

const MRUStats = ({ pageFaults, pageHits, referenceHistory }: MRUStatsProps) => {
  const faultRate = referenceHistory.length ? ((pageFaults / referenceHistory.length) * 100).toFixed(1) : "0";
  const hitRate = referenceHistory.length ? ((pageHits / referenceHistory.length) * 100).toFixed(1) : "0";

  if (referenceHistory.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="bg-secondary">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Page Faults</p>
          <p className="text-xl font-bold text-foreground">{pageFaults}</p>
        </CardContent>
      </Card>
      <Card className="bg-secondary">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Page Hits</p>
          <p className="text-xl font-bold text-foreground">{pageHits}</p>
        </CardContent>
      </Card>
      <Card className="bg-secondary">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Fault Rate</p>
          <p className="text-xl font-bold text-foreground">{faultRate}%</p>
        </CardContent>
      </Card>
      <Card className="bg-secondary">
        <CardContent className="p-3 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Hit Rate</p>
          <p className="text-xl font-bold text-foreground">{hitRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MRUStats;
