import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PageFrame, ReferenceHistory } from "./useFIFOVisualizer";

interface FIFOVisualizationProps {
  pageReferences: number[];
  currentStep: number;
  frames: PageFrame[];
  referenceHistory: ReferenceHistory[];
}

const FIFOVisualization = ({ pageReferences, currentStep, frames, referenceHistory }: FIFOVisualizationProps) => {
  return (
    <div>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-foreground">Reference String</h3>
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-secondary rounded-lg border border-border">
            {pageReferences.length === 0 ? (
              <p className="text-sm text-muted-foreground">No references added yet</p>
            ) : (
              pageReferences.map((page, idx) => (
                <Badge
                  key={idx}
                  variant={idx === currentStep ? "default" : "outline"}
                  className={cn(
                    "transition-all duration-200 text-sm",
                    idx === currentStep ? "bg-primary scale-110" : "",
                    idx < currentStep ? "opacity-60" : ""
                  )}
                >
                  {page}
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 text-foreground">Memory Frames</h3>
          <div className="grid grid-cols-1 gap-3 p-3 bg-secondary rounded-lg border border-border">
            {frames.map((frame, idx) => (
              <div
                key={frame.id}
                className={cn(
                  "border-2 rounded-lg p-4 flex items-center justify-center transition-all duration-300 min-h-[70px]",
                  frame.highlight ? "bg-primary/10 border-primary shadow-md transform scale-105" : "bg-card border-border"
                )}
              >
                <div className="text-center">
                  <div className="font-medium text-xs text-muted-foreground mb-1">Frame {idx + 1}</div>
                  {frame.page !== null ? (
                    <div className={cn("text-2xl font-bold", frame.highlight ? "text-primary" : "text-foreground")}>{frame.page}</div>
                  ) : (
                    <div className="text-muted-foreground text-lg">Empty</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {referenceHistory.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-foreground">Access History</h3>
            <div className="overflow-x-auto max-h-[150px]">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Step</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Page</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {referenceHistory.map((item, idx) => (
                    <tr key={idx} className={idx === currentStep ? "bg-success/20" : "bg-card"}>
                      <td className="px-3 py-2 whitespace-nowrap text-foreground">{idx + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-foreground">{item.page}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Badge variant={item.fault ? "destructive" : "outline"} className={!item.fault ? "border-success text-success" : ""}>
                          {item.fault ? "Fault" : "Hit"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default FIFOVisualization;
