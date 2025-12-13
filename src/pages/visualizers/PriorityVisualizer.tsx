import React from "react";
import Navbar from "@/components/Navbar";
import ProcessInput from "@/components/ProcessInput";
import GanttChart from "@/components/GanttChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Timer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePriorityVisualizer } from "./priority/usePriorityVisualizer";

const PriorityVisualizer = () => {
  const {
    state: { processes, ganttChart, scheduledProcesses, currentTime, isSimulating, totalTime, isPreemptive, avgWaitingTime, avgTurnaroundTime },
    actions: { setProcesses, setIsPreemptive, runSimulation, pauseSimulation, resumeSimulation, resetSimulation, stepBackward, stepForward },
  } = usePriorityVisualizer();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="page-container pt-20">
        <div className="mb-6 animate-slide-in">
          <div className="arena-chip mb-2">CPU Scheduling Visualization</div>
          <h1 className="text-3xl font-bold text-arena-dark mb-2">Priority Scheduling</h1>
          <p className="text-arena-gray text-sm">Visualize the Priority scheduling algorithm. Processes are executed based on priority values (lower number = higher priority).</p>
        </div>

        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="mb-6 w-full justify-start bg-secondary p-1 h-auto">
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
                <ProcessInput processes={processes} setProcesses={setProcesses} includePriority={true} />
              </div>

              <div className="md:col-span-2">
                <div className="bg-white rounded-2xl shadow-md p-4 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                  <div className="mb-3 flex items-center space-x-2">
                    <Switch id="isPreemptive" checked={isPreemptive} onCheckedChange={setIsPreemptive} />
                    <Label htmlFor="isPreemptive" className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Enable Preemption (Higher priority processes can interrupt lower priority ones)
                    </Label>
                  </div>

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
                    <div className="ml-auto flex items-center bg-arena-light px-2 py-1 rounded-md">
                      <Timer className="mr-2 h-3 w-3 text-arena-green" />
                      <span className="text-arena-dark font-medium text-sm">
                        Time: {currentTime} / {totalTime}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Gantt Chart</h3>
                    <GanttChart data={ganttChart} currentTime={currentTime} className="border border-gray-200" />
                  </div>

                  {scheduledProcesses.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Card className="bg-arena-light">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-arena-gray">Average Waiting Time</p>
                          <p className="text-xl font-bold text-arena-dark">{avgWaitingTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-arena-light">
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <p className="text-sm text-arena-gray">Average Turnaround Time</p>
                          <p className="text-xl font-bold text-arena-dark">{avgTurnaroundTime.toFixed(2)}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {scheduledProcesses.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Scheduled Processes</h3>
                      <div className="overflow-x-auto max-h-[150px]">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-arena-light">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finish</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {scheduledProcesses.map((process) => (
                              <tr key={process.id} className={currentTime >= process.startTime! ? "bg-green-50" : "bg-white"}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: process.color }}></div>
                                    {process.id}
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.arrivalTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.burstTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{process.priority}</td>
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
                <div className="bg-white rounded-2xl shadow-md p-4 animate-scale-in text-sm" style={{ animationDelay: "0.4s" }}>
                  <h2 className="text-lg font-semibold mb-2">About Priority Scheduling</h2>
                  <p className="text-arena-gray mb-3 text-sm">Priority Scheduling is a scheduling algorithm that selects the process with the highest priority for execution. Lower priority number indicates higher priority.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Non-preemptive Priority</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Once a process starts executing, it continues until completion</li>
                          <li>Higher priority processes that arrive later must wait</li>
                          <li>Simple to implement but less responsive</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-arena-light">
                      <CardHeader className="py-2 px-3">
                        <CardTitle className="text-xs font-medium">Preemptive Priority</CardTitle>
                      </CardHeader>
                      <CardContent className="py-2 px-3">
                        <ul className="list-disc pl-4 text-arena-gray space-y-1">
                          <li>Running process is preempted when a higher priority process arrives</li>
                          <li>More responsive for high priority processes</li>
                          <li>Requires more context switching, leading to more overhead</li>
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
                    Priority Scheduling CPU Scheduling – Algorithm
                  </h1>
                  <p className="text-base text-muted-foreground leading-relaxed max-w-4xl">
                    Priority Scheduling is a CPU scheduling algorithm where the process with the highest priority is executed first.
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
                        <span className="flex-1">CPU is allocated based on priority</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">Can be Preemptive or Non-Preemptive</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary font-semibold flex items-center justify-center text-xs mt-0.5">•</span>
                        <span className="flex-1">If priorities are equal → use FCFS</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Types of Priority Scheduling */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Types of Priority Scheduling
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-secondary/30 border-border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">Non-Preemptive Priority Scheduling</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Once a process starts, it runs till completion</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/30 border-border shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-foreground">Preemptive Priority Scheduling</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">CPU is preempted if a higher-priority process arrives</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Algorithm Non-Preemptive */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Algorithm (Non-Preemptive Priority Scheduling)
                  </h2>
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-5">
                      <ol className="space-y-4 text-sm text-foreground">
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                          <span className="flex-1 pt-1">Initialize current time = 0</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Add all arrived processes to the ready queue</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Select the process with highest priority</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">Execute it completely</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">Update time and repeat until all processes are completed</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                {/* Pseudocode Non-Preemptive */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Pseudocode (Non-Preemptive)
                  </h2>
                  <Card className="bg-muted/50 border-border shadow-sm">
                    <CardContent className="p-5">
                      <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`Priority_NonPreemptive(processes):
    currentTime = 0
    completed = 0
    n = number of processes

    while completed < n:
        readyQueue = all processes with ArrivalTime ≤ currentTime
                      and not completed

        if readyQueue is empty:
            currentTime++
            continue

        highest = process with minimum Priority value

        highest.StartTime = currentTime
        highest.CompletionTime = currentTime + highest.BurstTime
        highest.TurnaroundTime = CompletionTime - ArrivalTime
        highest.WaitingTime = TurnaroundTime - BurstTime

        currentTime = highest.CompletionTime
        mark highest as completed
        completed++`}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                {/* Algorithm Preemptive */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Algorithm (Preemptive Priority Scheduling)
                  </h2>
                  <Card className="bg-secondary/30 border-border">
                    <CardContent className="p-5">
                      <ol className="space-y-4 text-sm text-foreground">
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">1</span>
                          <span className="flex-1 pt-1">At each time unit, check for newly arrived processes</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">2</span>
                          <span className="flex-1 pt-1">Select process with highest priority</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">3</span>
                          <span className="flex-1 pt-1">Preempt current process if necessary</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">4</span>
                          <span className="flex-1 pt-1">Execute for 1 unit</span>
                        </li>
                        <li className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">5</span>
                          <span className="flex-1 pt-1">Repeat until completion</span>
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </div>

                {/* Pseudocode Preemptive */}
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Pseudocode (Preemptive)
                  </h2>
                  <Card className="bg-muted/50 border-border shadow-sm">
                    <CardContent className="p-5">
                      <pre className="text-sm text-foreground font-mono overflow-x-auto leading-relaxed">
{`Priority_Preemptive(processes):
    currentTime = 0
    completed = 0

    while completed < n:
        readyQueue = all processes with ArrivalTime ≤ currentTime
                      and RemainingTime > 0

        if readyQueue is empty:
            currentTime++
            continue

        highest = process with minimum Priority value

        execute highest for 1 unit
        highest.RemainingTime--

        if highest.RemainingTime == 0:
            highest.CompletionTime = currentTime + 1
            completed++

        currentTime++`}
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
                            <span>Important tasks get CPU first</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-green-600 dark:text-green-400 font-bold mt-0.5 text-base">•</span>
                            <span>Flexible scheduling</span>
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
                            <span>Starvation of low-priority processes</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Priority inversion problem</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-red-600 dark:text-red-400 font-bold mt-0.5 text-base">•</span>
                            <span>Needs aging mechanism</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Starvation Solution */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                      Starvation Solution – Aging
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5 text-sm text-foreground">
                      <li className="flex items-start gap-2.5">
                        <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5 text-base">•</span>
                        <span>Gradually increase priority of waiting processes</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-purple-600 dark:text-purple-400 font-bold mt-0.5 text-base">•</span>
                        <span>Prevents indefinite waiting</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Where Priority Scheduling is Used */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                      Where Priority Scheduling is Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5 text-sm text-foreground">
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Real-time systems</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>Embedded systems</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5 text-base">•</span>
                        <span>OS kernels</span>
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

export default PriorityVisualizer;
