import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SSTFAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const SSTFAlgorithmInfo = ({ type }: SSTFAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              SSTF (Shortest Seek Time First) Disk Scheduling – Algorithm
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
              SSTF selects the request that requires the least movement of the disk head from its current position. This greedy approach minimizes seek time for each individual request.
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
                  <span className="flex-1">At each step, select the request with minimum seek distance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Greedy algorithm that minimizes immediate seek time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                  <span className="flex-1">Better performance than FCFS but may cause starvation</span>
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
                    <span className="flex-1 pt-1">Create a list of unprocessed requests</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                    <div className="flex-1 pt-1">
                      <span className="block mb-2">While unprocessed requests exist:</span>
                      <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                        <li>Find the request with minimum distance from current head position</li>
                        <li>Calculate seek distance: |currentHeadPosition - closestRequest.position|</li>
                        <li>Add seek distance to total seek time</li>
                        <li>Move head to closestRequest.position</li>
                        <li>Remove closestRequest from unprocessed requests</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
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
{`SSTF_DiskScheduling(requestQueue, initialHeadPosition):
    currentHeadPosition = initialHeadPosition
    totalSeekTime = 0
    unprocessedRequests = copy(requestQueue)
    
    while unprocessedRequests is not empty:
        minDistance = infinity
        closestRequest = null
        
        for each request in unprocessedRequests:
            distance = abs(currentHeadPosition - request.position)
            if distance < minDistance:
                minDistance = distance
                closestRequest = request
        
        totalSeekTime = totalSeekTime + minDistance
        currentHeadPosition = closestRequest.position
        remove closestRequest from unprocessedRequests
    
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
                  <CardTitle className="text-base font-semibold text-foreground">Average Seek Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">Avg Seek Time = Total Seek Time / Number of Requests</p>
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
                      <span>Better performance than FCFS in most cases</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Minimizes average seek time</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                      <span>Simple to understand and implement</span>
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
                      <span>Can cause starvation for requests far from the head</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>Not optimal - greedy approach doesn't guarantee global minimum</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                      <span>May result in high variance in wait times</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Where SSTF is Used */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                Where SSTF is Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm text-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Systems with localized request patterns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Applications where average seek time is critical</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                  <span>Systems that can tolerate occasional starvation</span>
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

export default SSTFAlgorithmInfo;
