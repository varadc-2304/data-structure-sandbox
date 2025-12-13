import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LRUAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const LRUAlgorithmInfo = ({ type }: LRUAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            LRU (Least Recently Used) Page Replacement – Algorithm
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
            LRU is an optimal page replacement algorithm that replaces the page that hasn't been accessed for the longest time, taking advantage of temporal locality.
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
                <span className="flex-1">Replaces the page that hasn't been used for the longest time</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                <span className="flex-1">Takes advantage of temporal locality of reference</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                <span className="flex-1">Not subject to Belady's Anomaly</span>
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
                  <span className="flex-1 pt-1">Initialize page frames and track last access time for each page</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                  <span className="flex-1 pt-1">For each page reference in the reference string:</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                  <div className="flex-1 pt-1">
                    <span className="block mb-2">Check if the page is already in memory:</span>
                    <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                      <li>If yes: Update last access time (page hit)</li>
                      <li>If no: Page fault occurs</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                  <div className="flex-1 pt-1">
                    <span className="block mb-2">On page fault:</span>
                    <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                      <li>If frames are not full: Load page into empty frame</li>
                      <li>If frames are full: Find page with minimum last access time and replace it</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                  <span className="flex-1 pt-1">Update the last access time for the referenced page</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">6</span>
                  <span className="flex-1 pt-1">Increment page fault counter if fault occurred</span>
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
{`LRU_PageReplacement(referenceString, frameCount):
    frames = array of size frameCount, initially empty
    lastUsed = map to track last access time for each page
    pageFaults = 0
    currentTime = 0
    
    for each page in referenceString:
        currentTime++
        
        if page in frames:
            // Page hit - update last used time
            lastUsed[page] = currentTime
        else:
            // Page fault
            if frames is not full:
                add page to frames
            else:
                // Find least recently used page
                lruPage = page in frames with minimum lastUsed value
                replace lruPage in frames with page
            endif
            
            lastUsed[page] = currentTime
            pageFaults++
        endif
    endfor
    
    return pageFaults`}
              </pre>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Time Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-primary">O(n) per page reference</p>
                <p className="text-xs text-muted-foreground mt-1">Where n is the number of frames</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Space Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-primary">O(n) where n = frame count</p>
                <p className="text-xs text-muted-foreground mt-1">Storage for frames and access times</p>
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
                    <span>Good performance - often close to optimal</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                    <span>Exploits temporal locality</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                    <span>Not subject to Belady's Anomaly</span>
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
                    <span>Requires hardware support for efficiency</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                    <span>More complex implementation than FIFO</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                    <span>Higher overhead in high-traffic systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Where LRU is Used */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Where LRU is Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-foreground">
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Modern operating systems with hardware support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Database buffer pools and caching systems</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Web browsers and application-level caches</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default LRUAlgorithmInfo;
