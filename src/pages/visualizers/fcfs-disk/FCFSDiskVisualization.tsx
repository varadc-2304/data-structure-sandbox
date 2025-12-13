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
          <h3 className="text-sm font-medium text-drona-gray mb-4">Disk Track Visualization</h3>
          <div className="relative bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 p-6 overflow-hidden" style={{ minHeight: "180px" }}>
            <div className="absolute top-1/2 left-12 right-12 h-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform -translate-y-1/2 shadow-inner"></div>

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
                    <div className="w-1 h-8 bg-gray-400 rounded-full mb-3"></div>
                    <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm border">{pos}</span>
                  </div>
                );
              })}

              {/* Head */}
              <div
                className="absolute top-1/2 w-6 h-16 bg-gradient-to-b from-green-500 to-green-600 rounded-full z-20 shadow-lg border-2 border-white transition-all duration-1000 ease-in-out"
                style={{
                  left: `${calculatePosition(currentHeadPosition)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-600 bg-white px-3 py-1 rounded-full shadow-md border whitespace-nowrap">
                  Head: {currentHeadPosition}
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Initial Head Position */}
              {initialHeadPosition !== currentHeadPosition && (
                <div
                  className="absolute top-1/2 w-2 h-12 bg-gray-400 rounded z-10 opacity-60"
                  style={{
                    left: `${calculatePosition(initialHeadPosition)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap bg-white px-2 py-1 rounded shadow">
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
                    req.processed ? "bg-blue-500 border-white shadow-lg scale-110" : "bg-white border-blue-400 shadow-md",
                    req.current && "ring-4 ring-blue-300/50 scale-125 animate-pulse"
                  )}
                  style={{
                    left: `${calculatePosition(req.position)}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded shadow">
                    {req.position}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-drona-gray mb-2">Request Queue (FCFS Order)</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {requestQueue.map((request, idx) => (
              <Badge
                key={idx}
                variant={request.current ? "default" : request.processed ? "secondary" : "outline"}
                className={cn("text-sm px-3 py-1", request.current && "bg-blue-500 text-white")}
              >
                {request.position}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-drona-gray mb-2">Seek Operations</h3>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
            {seekHistory.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No operations yet</div>
            ) : (
              <table className="w-full">
                <thead className="bg-drona-light sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Step</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">From</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">To</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-drona-dark">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {seekHistory.map((seek, idx) => (
                    <tr key={idx} className={cn("transition-colors", idx % 2 === 0 ? "bg-white" : "bg-gray-50", idx === currentStep && "bg-blue-50")}>
                      <td className="px-4 py-2 text-sm font-medium">{idx + 1}</td>
                      <td className="px-4 py-2 text-sm">{seek.from}</td>
                      <td className="px-4 py-2 text-sm">{seek.to}</td>
                      <td className="px-4 py-2 text-sm font-medium">{seek.distance} cylinders</td>
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
