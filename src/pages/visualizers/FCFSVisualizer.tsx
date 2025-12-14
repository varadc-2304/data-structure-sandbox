import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProcessInput from "@/components/ProcessInput";
import GanttChart from "@/components/GanttChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useFCFSVisualizer } from "./fcfs/useFCFSVisualizer";

const FCFSVisualizer = () => {
  const {
    state: { processes, ganttChart, scheduledProcesses, currentTime, isSimulating, totalTime, avgWaitingTime, avgTurnaroundTime },
    actions: { setProcesses, runSimulation, pauseSimulation, resumeSimulation, resetSimulation, stepBackward, stepForward },
  } = useFCFSVisualizer();

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
          <h1 className="text-3xl font-bold text-foreground mb-2">First Come First Serve (FCFS)</h1>
          <p className="text-muted-foreground text-sm">Visualize the First Come First Serve scheduling algorithm. Processes are executed in the order they arrive.</p>
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
                        Time: {currentTime}s / {totalTime}s
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
                          <p className="text-xl font-bold text-foreground">{avgWaitingTime.toFixed(2)}s</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-secondary">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Average Turnaround Time</p>
                          <p className="text-xl font-bold text-foreground">{avgTurnaroundTime.toFixed(2)}s</p>
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
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Arrival (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Burst (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Start (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Finish (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Waiting (s)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Turnaround (s)</th>
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
                <div className="bg-card rounded-2xl shadow-md p-4 animate-scale-in text-sm border border-border" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">About First Come First Serve</h2>
                  <p className="text-muted-foreground mb-3 text-sm">First Come First Serve (FCFS) is the simplest CPU scheduling algorithm. In this scheme, the process that requests the CPU first is allocated the CPU first.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Characteristics</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Non-preemptive scheduling algorithm</li>
                          <li>Easy to understand and implement</li>
                          <li>Processes are executed in the order they arrive</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium text-foreground">Limitations</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                          <li>Not optimal for minimizing average waiting time</li>
                          <li>Suffers from "convoy effect": short processes wait for long processes</li>
                          <li>Not suitable for interactive systems</li>
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
                    FCFS (First-Come, First-Served) CPU Scheduling – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    FCFS is the simplest CPU scheduling algorithm, where the process that arrives first in the ready queue is executed first.
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
                        <span className="flex-1">CPU is allocated in the order of arrival</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Uses a FIFO (queue)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Non-preemptive: once a process starts, it runs until completion</span>
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
                          <span className="flex-1 pt-1">Initialize an empty ready queue</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Sort processes based on arrival time</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Insert processes into the ready queue in arrival order</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <div className="flex-1 pt-1">
                            <span className="block mb-2">For each process in the queue:</span>
                            <ul className="ml-6 space-y-2 text-muted-foreground list-disc">
                              <li>Assign CPU</li>
                              <li>Execute the process till completion</li>
                              <li>Calculate: Completion Time (CT), Turnaround Time (TAT), Waiting Time (WT)</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">Compute average waiting time and average turnaround time</span>
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
{`FCFS_Scheduling(processes):
    sort processes by ArrivalTime
    currentTime = 0

    for each process in processes:
        if currentTime < process.ArrivalTime:
            currentTime = process.ArrivalTime

        process.StartTime = currentTime
        process.CompletionTime = currentTime + process.BurstTime
        process.TurnaroundTime = CompletionTime - ArrivalTime
        process.WaitingTime = TurnaroundTime - BurstTime

        currentTime = process.CompletionTime`}
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
                        <p className="text-sm font-medium text-primary">CT = Start Time + Burst Time</p>
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
                            <span>Simple to implement</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                            <span>No starvation</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                            <span>Fair in arrival order</span>
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
                            <span>Convoy Effect (short jobs wait for long jobs)</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Poor average waiting time</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Not suitable for time-sharing systems</span>
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
                        <span>Batch processing systems</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Simple real-world queues (printing jobs, ticket counters)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Introductory OS concepts</span>
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

export default FCFSVisualizer;
