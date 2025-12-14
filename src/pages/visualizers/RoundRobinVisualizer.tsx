import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProcessInput from "@/components/ProcessInput";
import GanttChart from "@/components/GanttChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRoundRobinVisualizer } from "./round-robin/useRoundRobinVisualizer";

const RoundRobinVisualizer = () => {
  const {
    state: { processes, ganttChart, scheduledProcesses, currentTime, isSimulating, totalTime, timeQuantum, avgWaitingTime, avgTurnaroundTime },
    actions: { setProcesses, handleTimeQuantumChange, runSimulation, pauseSimulation, resumeSimulation, resetSimulation, stepBackward, stepForward },
  } = useRoundRobinVisualizer();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <Link to="/dashboard/cpu-scheduling" className="flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to CPU Scheduling
          </Link>
          <div className="arena-chip mb-2">CPU Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Round Robin Scheduling</h1>
          <p className="text-muted-foreground text-sm">Visualize the Round Robin scheduling algorithm. Each process is assigned a fixed time slot in a cyclic way.</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-fit justify-start bg-secondary p-1 h-auto">
            <TabsTrigger 
              value="visualizer" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Visualizer
            </TabsTrigger>
            <TabsTrigger 
              value="algorithm" 
              className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-6 py-2.5 text-sm font-medium"
            >
              Algorithm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <ProcessInput processes={processes} setProcesses={setProcesses} />
                <Card className="mt-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-foreground">Time Quantum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input 
                      id="timeQuantum" 
                      type="number" 
                      min="1" 
                      value={timeQuantum} 
                      onChange={handleTimeQuantumChange} 
                      className="h-8 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">Time slice per process</p>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <div className="bg-card rounded-2xl shadow-md p-4 animate-scale-in border border-border" style={{ animationDelay: "0.2s" }}>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Button onClick={runSimulation} variant="default" size="sm" disabled={isSimulating}>
                      <Play className="mr-2 h-3 w-3" />
                      Run
                    </Button>
                    <Button onClick={pauseSimulation} variant="outline" disabled={!ganttChart.length || !isSimulating} size="sm">
                      <Pause className="mr-2 h-3 w-3" />
                      Pause
                    </Button>
                    <Button onClick={resumeSimulation} variant="outline" disabled={!ganttChart.length || isSimulating || currentTime >= totalTime} size="sm">
                      <Play className="mr-2 h-3 w-3" />
                      Resume
                    </Button>
                    <Button onClick={resetSimulation} variant="outline" disabled={!ganttChart.length} size="sm">
                      <SkipBack className="mr-2 h-3 w-3" />
                      Reset
                    </Button>
                    <Button onClick={stepBackward} variant="outline" disabled={!ganttChart.length || currentTime <= 0} size="sm">
                      <SkipBack className="h-3 w-3" />
                    </Button>
                    <Button onClick={stepForward} variant="outline" disabled={!ganttChart.length || currentTime >= totalTime} size="sm">
                      <SkipForward className="h-3 w-3" />
                    </Button>
                    <div className="ml-auto flex items-center bg-secondary px-2 py-1 rounded-md">
                      <Timer className="mr-2 h-3 w-3 text-primary" />
                      <span className="text-foreground font-medium text-sm">
                        Time: {currentTime} / {totalTime}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2 text-foreground">Gantt Chart</h3>
                    <GanttChart data={ganttChart} currentTime={currentTime} className="border border-border" />
                  </div>

                  {scheduledProcesses.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Average Waiting Time</p>
                          <p className="text-xl font-bold text-foreground">{avgWaitingTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
                          <p className="text-xl font-bold text-foreground">{avgTurnaroundTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {scheduledProcesses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-foreground">Scheduled Processes</h3>
                      <div className="overflow-x-auto max-h-[150px]">
                        <table className="min-w-full divide-y divide-border text-sm">
                          <thead className="bg-secondary">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Arrival</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Burst</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Start</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Finish</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Waiting</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Turnaround</th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-border">
                            {scheduledProcesses.map((process) => (
                              <tr key={process.id} className={currentTime >= process.startTime! ? "bg-success/20" : "bg-card"}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                                    {process.id}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.arrivalTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.burstTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.startTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.finishTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.waitingTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.turnaroundTime}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-card rounded-2xl shadow-md p-4 animate-scale-in border border-border text-sm" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">About Round Robin Scheduling</h2>
                  <p className="text-muted-foreground mb-3 text-sm">Round Robin (RR) is a CPU scheduling algorithm where each process is assigned a fixed time slot (time quantum) in a cyclic way. It is designed especially for time-sharing systems.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Preemptive scheduling algorithm</li>
                          <li>Time slice or quantum is assigned to each process</li>
                          <li>After time quantum expires, process is preempted and added to the end of the ready queue</li>
                          <li>Fair allocation of CPU to all processes</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Performance Factors</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Time quantum affects performance significantly</li>
                          <li>Large time quantum: approximates FCFS</li>
                          <li>Small time quantum: better response time but more context switching overhead</li>
                          <li>Optimal time quantum balances response time and overhead</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="algorithm" className="mt-0">
            <div className="bg-card rounded-lg border border-border shadow-lg p-6 md:p-8">
              <div className="space-y-8">
                {/* Header */}
                <div className="border-b border-border pb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Round Robin (RR) CPU Scheduling – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Round Robin is a preemptive CPU scheduling algorithm designed for time-sharing systems, where each process gets a fixed time quantum in a cyclic order.
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
                        <span className="flex-1">CPU is allocated for a fixed time slice (time quantum)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Processes are executed in a circular queue</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Preemptive: process is paused if quantum expires</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Ensures fairness among all processes</span>
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
                          <span className="flex-1 pt-1">Initialize a ready queue (FIFO)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Set time quantum (q)</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Insert all arrived processes into the ready queue</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <div className="flex-1 pt-1">
                            <span className="block mb-2">While the queue is not empty:</span>
                            <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                              <li>Dequeue the first process</li>
                              <li>If remaining burst time &gt; q:</li>
                              <ul className="ml-4 mt-1 space-y-1 list-disc">
                                <li>Execute for q units</li>
                                <li>Subtract q from remaining time</li>
                                <li>Enqueue process back</li>
                              </ul>
                              <li>Else:</li>
                              <ul className="ml-4 mt-1 space-y-1 list-disc">
                                <li>Execute till completion</li>
                                <li>Calculate CT, TAT, WT</li>
                              </ul>
                            </ul>
                          </div>
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
{`RoundRobin(processes, q):
    currentTime = 0
    readyQueue = empty queue

    while there are unfinished processes:
        add all processes with ArrivalTime ≤ currentTime
            and not in queue to readyQueue

        if readyQueue is empty:
            currentTime++
            continue

        process = dequeue(readyQueue)

        if process.RemainingTime > q:
            execute process for q units
            currentTime += q
            process.RemainingTime -= q
            enqueue process back into readyQueue
        else:
            execute process for RemainingTime units
            currentTime += process.RemainingTime
            process.RemainingTime = 0
            process.CompletionTime = currentTime`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                {/* Time Calculations */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Time Calculations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">Completion Time (CT)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-primary">CT = Time when process finishes execution</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">Turnaround Time (TAT)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-primary">TAT = CT − Arrival Time</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/50 border-border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">Waiting Time (WT)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium text-primary">WT = TAT − Burst Time</p>
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
                            <span>Fair CPU allocation</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                            <span>No starvation</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                            <span>Best for time-sharing systems</span>
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
                            <span>Context switching overhead</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Performance depends on time quantum</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Too small → too many switches</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Too large → behaves like FCFS</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Where Round Robin is Used */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      Where Round Robin is Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5 text-sm text-foreground">
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Operating systems</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Time-sharing environments</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Interactive systems (terminals, servers)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoundRobinVisualizer;
