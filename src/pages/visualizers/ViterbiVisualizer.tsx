import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { useViterbiVisualizer } from "./viterbi/useViterbiVisualizer";

const ViterbiVisualizer = () => {
  const {
    state: { observations, viterbiSteps, currentStep, isRunning, speed, customObservations, currentStepData, states, observationLabels },
    actions: { setSpeed, setCustomObservations, handleCustomObservations, startVisualization, nextStep, prevStep, goToStep, togglePlayPause, resetVisualization },
  } = useViterbiVisualizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ece-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ECE Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Viterbi Algorithm Visualization</h1>
          <p className="text-lg text-drona-gray">
            The Viterbi algorithm finds the most likely sequence of hidden states in a Hidden Markov Model.
            <span className="font-semibold text-drona-green"> Time Complexity: O(T×N²)</span>
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">Observations (0=No Umbrella, 1=Umbrella)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., 0,1,0" value={customObservations} onChange={(e) => setCustomObservations(e.target.value)} className="flex-1 border-2 focus:border-drona-green" />
                    <Button onClick={handleCustomObservations} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                      Set
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">Animation Speed: {speed}x</Label>
                  <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button variant="outline" size="sm" onClick={() => goToStep(0)} disabled={viterbiSteps.length === 0} className="border-2 hover:border-drona-green/50">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep <= 0} className="border-2 hover:border-drona-green/50">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={togglePlayPause} disabled={observations.length === 0} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= viterbiSteps.length - 1} className="border-2 hover:border-drona-green/50">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => goToStep(viterbiSteps.length - 1)} disabled={viterbiSteps.length === 0} className="border-2 hover:border-drona-green/50">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={resetVisualization} variant="outline" disabled={isRunning} className="w-full border-2 hover:border-drona-green/50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                {viterbiSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {viterbiSteps.length}
                    </Label>
                    <Slider value={[currentStep + 1]} onValueChange={([value]) => goToStep(value - 1)} max={viterbiSteps.length} min={1} step={1} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Viterbi Algorithm Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {viterbiSteps.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Zap className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Start to begin Viterbi visualization</p>
                      <Button onClick={startVisualization} className="mt-4 bg-drona-green hover:bg-drona-green/90 font-semibold">
                        Start Visualization
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentStepData && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">{currentStepData.description}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-drona-dark">Observations</h3>
                      <div className="flex gap-2 flex-wrap">
                        {observations.map((obs, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border-2 ${currentStepData && idx <= currentStepData.timeStep ? "border-drona-green bg-drona-green/10" : "border-gray-300 bg-gray-50"}`}>
                            <p className="text-sm font-semibold">Time {idx}</p>
                            <p className="text-drona-dark">{observationLabels[obs]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {currentStepData && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-drona-dark">Viterbi Probability Matrix</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr>
                                <th className="border-2 border-drona-green/30 p-2 bg-drona-green/10">State</th>
                                {observations.map((_, idx) => (
                                  <th key={idx} className={`border-2 border-drona-green/30 p-2 ${idx <= currentStepData.timeStep ? "bg-drona-green/20" : "bg-gray-100"}`}>
                                    Time {idx}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {states.map((state, stateIdx) => (
                                <tr key={stateIdx}>
                                  <td className="border-2 border-drona-green/30 p-2 bg-drona-green/10 font-semibold">{state}</td>
                                  {observations.map((_, timeIdx) => (
                                    <td key={timeIdx} className={`border-2 border-drona-green/30 p-2 text-center ${timeIdx <= currentStepData.timeStep ? "bg-white" : "bg-gray-50"}`}>
                                      {timeIdx <= currentStepData.timeStep ? currentStepData.viterbiMatrix[stateIdx][timeIdx].toFixed(4) : "-"}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    {currentStepData && currentStepData.bestPath.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-drona-dark">Optimal State Sequence</h3>
                        <div className="flex gap-2 flex-wrap">
                          {currentStepData.bestPath.map((stateIdx, timeIdx) => (
                            <div key={timeIdx} className="p-3 rounded-lg border-2 border-drona-green bg-drona-green/10">
                              <p className="text-sm font-semibold">Time {timeIdx}</p>
                              <p className="text-drona-dark">{states[stateIdx]}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-lg font-semibold text-drona-dark">Total Probability: {currentStepData.probability.toFixed(4)}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViterbiVisualizer;
