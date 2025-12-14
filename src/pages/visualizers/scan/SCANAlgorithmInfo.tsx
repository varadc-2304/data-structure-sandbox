import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SCANAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const SCANAlgorithmInfo = ({ type }: SCANAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              SCAN (Elevator Algorithm) Disk Scheduling – Algorithm
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
              SCAN works like an elevator. The disk arm starts at one end and moves toward the other end, servicing requests along the way until it reaches the other end of the disk, then reverses direction.
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
                  <span className="flex-1">Disk head moves in one direction serving all requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Reaches the end of disk before reversing direction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Eliminates starvation and provides uniform wait times</span>
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
                    <span className="flex-1 pt-1">Initialize current head position and direction</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                    <span className="flex-1 pt-1">Sort requests by their position</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                    <div className="flex-1 pt-1">
                      <span className="block mb-2">Service requests in current direction:</span>
                      <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                        <li>Move head in current direction</li>
                        <li>Service all requests encountered</li>
                        <li>Continue until end of disk</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                    <span className="flex-1 pt-1">Reverse direction at disk boundary</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                    <span className="flex-1 pt-1">Service remaining requests in reverse direction</span>
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
{`SCAN_DiskScheduling(requestQueue, initialHeadPosition, direction):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    sort requestQueue by position
    
    if direction == "right":
        // Service requests to the right
        for each request >= currentHeadPosition:
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
        
        // Go to end of disk
        seekTime = abs(currentHeadPosition - (diskSize - 1))
        totalSeekTime += seekTime
        currentHeadPosition = diskSize - 1
        
        // Service remaining requests (to the left)
        for each request < initialHeadPosition (in reverse order):
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
    else:
        // Similar logic for left direction
    
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
                  <p className="text-sm font-medium text-primary">Distance = |Current Position - Target Position|</p>
                </CardContent>
              </Card>
              <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground">Boundary Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">Head moves to disk boundary before reversing</p>
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
                    <span className="text-primary dark:text-green-400">✓</span>
                    Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5 text-sm text-foreground">
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Eliminates starvation - all requests are eventually served</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Provides better response time than FCFS and SSTF</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-primary dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Uniform wait times</span>
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
                      <span>Longer seek times for requests just missed by the head</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Unnecessary movement to disk boundaries</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>More seek time compared to optimized algorithms like LOOK</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Where SCAN is Used */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Where SCAN is Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Systems requiring uniform wait times</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Applications where fairness is important</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Real-time systems with predictable access patterns</span>
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

export default SCANAlgorithmInfo;
