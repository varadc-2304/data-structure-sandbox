import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FCFSDiskAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const FCFSDiskAlgorithmInfo = ({ type }: FCFSDiskAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              FCFS (First-Come, First-Served) Disk Scheduling – Algorithm
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
              FCFS is the simplest disk scheduling algorithm, where disk requests are serviced strictly in the order they arrive, regardless of the location on the disk.
            </p>
          </div>

          {/* Key Idea */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Key Idea
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Disk requests are serviced in arrival order</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Uses a FIFO (queue) data structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">No optimization for seek time or disk arm movement</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Algorithm Steps */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Algorithm (Step-by-Step)
            </h2>
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-5">
                <ol className="space-y-4 text-sm text-foreground">
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                    <span className="flex-1 pt-1">Initialize current head position to initial head position</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                    <span className="flex-1 pt-1">Initialize total seek time to 0</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                    <div className="flex-1 pt-1">
                      <span className="block mb-2">For each request in the queue (in arrival order):</span>
                      <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                        <li>Calculate seek distance: |currentHeadPosition - request.position|</li>
                        <li>Add seek distance to total seek time</li>
                        <li>Move head to request.position</li>
                        <li>Update currentHeadPosition</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                    <span className="flex-1 pt-1">Return total seek time</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Pseudocode */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Pseudocode
            </h2>
            <Card className="bg-muted/50 border-border shadow-sm">
              <CardContent className="p-5">
                <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`FCFS_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    
    for each request in requestQueue:
        seekDistance = abs(currentHeadPosition - request.position)
        totalSeekTime = totalSeekTime + seekDistance
        currentHeadPosition = request.position
    
    return totalSeekTime`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Seek Time Calculations */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Seek Time Calculations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground">Seek Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">Seek Distance = |Current Position - Target Position|</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground">Total Seek Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">Total Seek Time = Σ(Seek Distance for each request)</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Advantages and Disadvantages */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Advantages & Disadvantages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-foreground">
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Simple to understand and implement</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Fair to all requests - no starvation</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Low overhead - just need to maintain a queue</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="text-red-600 dark:text-red-400">✗</span>
                    Disadvantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-foreground">
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Does not optimize for seek time or disk arm movement</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Can lead to long average seek times</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Poor performance with random request patterns</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Where FCFS is Used */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Where FCFS is Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Simple disk systems with predictable access patterns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Educational purposes to understand basic disk scheduling</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Systems where fairness is more important than performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default FCFSDiskAlgorithmInfo;
