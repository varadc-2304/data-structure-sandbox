import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DiskRequest, SeekOperation } from "./useFCFSDiskVisualizer";

interface FCFSDiskVisualizationProps {
  diskSize: number;
  initialHeadPosition: number;
  currentHeadPosition: number;
  requestQueue: DiskRequest[];
  currentStep: number;
  seekHistory: SeekOperation[];
  calculatePosition: (position: number) => number;
}

const FCFSDiskVisualization = ({
  diskSize,
  initialHeadPosition,
  currentHeadPosition,
  requestQueue,
  currentStep,
  seekHistory,
  calculatePosition,
}: FCFSDiskVisualizationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FCFS Disk Scheduling Visualization</CardTitle>
        <CardDescription>
          Step: {currentStep + 1} of {requestQueue.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Disk Track Visualization</h3>
          <div className="relative bg-gradient-to-r from-secondary to-card rounded-xl border-2 border-border p-6 overflow-hidden" style={{ minHeight: "180px" }}>
            <div className="absolute top-1/2 left-12 right-12 h-2 bg-gradient-to-r from-muted to-muted/80 rounded-full transform -translate-y-1/2 shadow-inner"></div>

            <div className="absolute top-1/2 transform -translate-y-1/2" style={{ left: '3rem', right: '3rem' }}>
              {/* Scale Markers */}
              {[0, Math.floor(diskSize / 4), Math.floor(diskSize / 2), Math.floor(3 * diskSize / 4), diskSize - 1].map((pos) => {
                const positionPercent = calculatePosition(pos);
                return (
                  <div 
                    key={pos} 
                    className="absolute flex flex-col items-center transform -translate-x-1/2"
                    style={{
                      left: `${positionPercent}%`,
                    }}
                  >
                    <div className="w-1 h-8 bg-muted-foreground/50 rounded-full mb-3"></div>
                    <span className="text-xs font-bold text-black dark:text-white bg-card px-2 py-1 rounded-full shadow-sm border border-border">{pos}</span>
                  </div>
                );
              })}

              {/* Head */}
              <div
                className="absolute top-1/2 w-6 h-16 bg-gradient-to-b from-primary to-primary/90 rounded-full z-20 shadow-lg border-2 border-card transition-all duration-1000 ease-in-out"
                style={{
                  left: `${calculatePosition(currentHeadPosition)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm font-bold text-primary bg-card px-3 py-1 rounded-full shadow-md border border-border whitespace-nowrap">
                  Head: {currentHeadPosition}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-card rounded-full"></div>
              </div>

              {/* Initial Head Position */}
              {initialHeadPosition !== currentHeadPosition && (
                <div
                  className="absolute top-1/2 w-2 h-12 bg-muted-foreground/50 rounded z-10 opacity-60"
                  style={{
                    left: `${calculatePosition(initialHeadPosition)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-card px-2 py-1 rounded shadow border border-border">
                    Start: {initialHeadPosition}
                  </div>
                </div>
              )}

              {/* Request Markers */}
              {requestQueue.map((req, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "absolute top-1/2 w-5 h-5 rounded-full border-3 transition-all duration-500 z-15",
                    req.processed ? "bg-primary border-card shadow-lg scale-110" : "bg-black dark:bg-white border-black dark:border-white shadow-md",
                    req.current && "ring-4 ring-primary/50 scale-125 animate-pulse"
                  )}
                  style={{
                    left: `${calculatePosition(req.position)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap bg-foreground text-background px-2 py-1 rounded shadow">
                    {req.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-2">Request Queue (FCFS Order)</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {requestQueue.map((request, idx) => (
              <Badge
                key={idx}
                variant={request.current ? "default" : request.processed ? "secondary" : "outline"}
                className={cn("text-sm px-3 py-1", request.current && "bg-primary text-primary-foreground")}
              >
                {request.position}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Seek Operations</h3>
          <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
            {seekHistory.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No operations yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-secondary sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Step</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-foreground">From</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-foreground">To</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-foreground">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {seekHistory.map((seek, idx) => (
                    <tr key={idx} className={cn("transition-colors", idx % 2 === 0 ? "bg-card" : "bg-secondary/50", idx === currentStep && "bg-primary/10")}>
                      <td className="px-4 py-2 text-sm font-medium text-foreground">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm text-foreground">{seek.from}</td>
                      <td className="px-4 py-2 text-sm text-foreground">{seek.to}</td>
                      <td className="px-4 py-2 text-sm font-medium text-foreground">{seek.distance} cylinders</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FCFSDiskVisualization;
