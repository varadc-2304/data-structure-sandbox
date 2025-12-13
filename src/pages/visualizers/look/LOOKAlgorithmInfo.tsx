import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LOOKAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const LOOKAlgorithmInfo = ({ type }: LOOKAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              LOOK Disk Scheduling – Algorithm
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
              LOOK is similar to SCAN but instead of going to the end of the disk, the head only goes as far as the last request in each direction, then reverses direction. This prevents unnecessary head movement.
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
                  <span className="flex-1">Head moves only as far as the last request in each direction</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Reverses direction without going to disk boundaries</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">More efficient than SCAN by avoiding unnecessary movement</span>
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
                        <li>Stop at last request in direction (not disk boundary)</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                    <span className="flex-1 pt-1">Reverse direction at last request</span>
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
{`LOOK_DiskScheduling(requestQueue, initialHeadPosition, direction):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    sort requestQueue by position
    
    if direction == "right":
        // Service requests to the right
        for each request >= currentHeadPosition:
            seekTime = abs(currentHeadPosition - request.position)
            totalSeekTime += seekTime
            currentHeadPosition = request.position
        
        // Service remaining requests (to the left) in reverse order
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
                  <CardTitle className="text-base font-semibold text-foreground">Optimized Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">Head stops at last request, not disk boundary</p>
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
                      <span>More efficient than SCAN - no unnecessary movement</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Eliminates starvation like SCAN</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Better seek time performance than SCAN</span>
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
                      <span>Slightly more complex to implement than SCAN</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Still may have longer wait times for requests just missed</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Performance depends on request distribution</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Where LOOK is Used */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Where LOOK is Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Modern disk systems requiring efficient scheduling</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Applications where seek time optimization is important</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Systems with clustered request patterns</span>
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

export default LOOKAlgorithmInfo;
