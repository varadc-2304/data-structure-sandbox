import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FIFOAlgorithmInfoProps {
  type: "algorithm" | "performance";
}

const FIFOAlgorithmInfo = ({ type }: FIFOAlgorithmInfoProps) => {
  if (type === "algorithm") {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            FIFO (First-In-First-Out) Page Replacement – Algorithm
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
            FIFO is the simplest page replacement algorithm, where the oldest page in memory is replaced when a new page is needed.
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
                <span className="flex-1">Pages are replaced in the order they were loaded into memory</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                <span className="flex-1">Uses a simple queue data structure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                <span className="flex-1">No need to track page access history or frequency</span>
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
                  <span className="flex-1 pt-1">Initialize an empty queue and page frames</span>
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
                      <li>If yes: Page hit (no action needed)</li>
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
                      <li>If frames are full: Remove oldest page (front of queue) and add new page</li>
                    </ul>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                  <span className="flex-1 pt-1">Add the new page to the back of the queue</span>
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
{`FIFO_PageReplacement(referenceString, frameCount):
    frames = array of size frameCount, initially empty
    queue = empty queue
    pageFaults = 0
    
    for each page in referenceString:
        if page not in frames:
            if frames is full:
                victimPage = queue.dequeue()
                remove victimPage from frames
            endif
            
            add page to frames
            queue.enqueue(page)
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
                <p className="text-sm font-medium text-primary">O(1) per page reference</p>
                <p className="text-xs text-muted-foreground mt-1">Queue operations are constant time</p>
              </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-foreground">Space Complexity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-primary">O(n) where n = frame count</p>
                <p className="text-xs text-muted-foreground mt-1">Storage for frames and queue</p>
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
                    <span>Low overhead - just maintain a queue</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                    <span>No need to track access history</span>
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
                    <span>Suffers from Belady's Anomaly</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                    <span>May remove frequently used pages</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                    <span>Does not consider page usage patterns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Where FIFO is Used */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Where FIFO is Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5 text-sm text-foreground">
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Simple embedded systems with limited resources</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Educational purposes to understand page replacement</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                <span>Systems where simplicity is more important than performance</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analysis</CardTitle>
        <CardDescription>Understanding FIFO performance characteristics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-medium text-drona-dark mb-2">Time Complexity</h3>
          <p className="text-drona-gray mb-4">
            <span className="font-mono bg-drona-light px-2 py-1 rounded">O(1)</span> for each page reference lookup and replacement operation.
          </p>
          <p className="text-drona-gray">
            The FIFO algorithm maintains a simple queue data structure. Both lookups to check if a page is in memory and replacement operations when
            a page fault occurs take constant time.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium text-drona-dark mb-2">Space Complexity</h3>
          <p className="text-drona-gray mb-4">
            <span className="font-mono bg-drona-light px-2 py-1 rounded">O(n)</span> where n is the number of page frames.
          </p>
          <p className="text-drona-gray">
            The space required is proportional to the number of page frames in memory. We need to maintain both the frames and the queue tracking
            the order of page loading.
          </p>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-medium text-drona-dark mb-2">Belady's Anomaly</h3>
          <p className="text-drona-gray mb-4">
            FIFO is subject to Belady's Anomaly, which is the phenomenon where increasing the number of page frames can sometimes increase the
            number of page faults.
          </p>
          <p className="text-drona-gray mb-4">
            This counterintuitive behavior occurs because with more frames, pages that would be reused soon could be kept longer in memory with fewer
            frames due to the specific access pattern.
          </p>

          <div className="bg-drona-light p-4 rounded-lg mt-4">
            <h4 className="text-sm font-medium text-drona-dark mb-2">Example of Belady's Anomaly</h4>
            <p className="text-sm text-drona-gray mb-2">Consider the reference string: 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5</p>
            <p className="text-sm text-drona-gray">
              With 3 frames: 9 page faults<br />
              With 4 frames: 10 page faults
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FIFOAlgorithmInfo;
