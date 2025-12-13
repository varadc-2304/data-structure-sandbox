import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import { useTurboVisualizer } from "./turbo/useTurboVisualizer";

const TurboVisualizer = () => {
  const {
    state: { receivedBits, turboSteps, currentStep, isRunning, speed, customInput, maxIterations, currentStepData },
    actions: { setSpeed, setCustomInput, setMaxIterations, handleCustomInput, startVisualization, nextStep, prevStep, goToStep, togglePlayPause, resetVisualization },
  } = useTurboVisualizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ece-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ECE Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Turbo Decoding Visualization</h1>
          <p className="text-lg text-drona-gray">
            Turbo codes use parallel concatenated convolutional codes with iterative decoding.
            <span className="font-semibold text-drona-green"> Complexity: O(N × iterations)</span>
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
                  <Label className="text-sm font-semibold text-drona-dark">Received Values (LLR)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g., 0.7,-0.3,0.5" value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="flex-1 border-2 focus:border-drona-green" />
                    <Button onClick={handleCustomInput} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                      Set
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">Max Iterations: {maxIterations}</Label>
                  <input type="range" min={2} max={8} step={1} value={maxIterations} onChange={(e) => setMaxIterations(Number(e.target.value))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">Animation Speed: {speed}x</Label>
                  <input type="range" min={0.5} max={3} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button variant="outline" size="sm" onClick={() => goToStep(0)} disabled={turboSteps.length === 0} className="border-2 hover:border-drona-green/50">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep <= 0} className="border-2 hover:border-drona-green/50">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={togglePlayPause} disabled={receivedBits.length === 0} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= turboSteps.length - 1} className="border-2 hover:border-drona-green/50">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => goToStep(turboSteps.length - 1)} disabled={turboSteps.length === 0} className="border-2 hover:border-drona-green/50">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={resetVisualization} variant="outline" disabled={isRunning} className="w-full border-2 hover:border-drona-green/50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                {turboSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {turboSteps.length}
                    </Label>
                    <Slider value={[currentStep + 1]} onValueChange={([value]) => goToStep(value - 1)} max={turboSteps.length} min={1} step={1} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Turbo Decoding Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {turboSteps.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Radio className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Start to begin Turbo decoding</p>
                      <Button onClick={startVisualization} className="mt-4 bg-drona-green hover:bg-drona-green/90 font-semibold">
                        Start Visualization
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentStepData && (
                      <div className={`text-center p-4 rounded-xl border-2 ${currentStepData.converged ? "bg-gradient-to-r from-green-50 to-green-100" : "bg-gradient-to-r from-blue-50 to-blue-100"}`}>
                        <p className="text-lg font-semibold text-drona-dark">{currentStepData.description}</p>
                        {currentStepData.converged && <p className="text-green-700 font-bold mt-2">✓ Decoding Converged!</p>}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-drona-dark">Decoder 1 Output</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {receivedBits.map((_, idx) => (
                            <div key={idx} className="p-3 rounded-lg border-2 border-blue-300 bg-blue-50 text-center">
                              <p className="text-sm font-semibold">D1[{idx}]</p>
                              <p className="text-drona-dark font-mono">{currentStepData ? currentStepData.decoder1Output[idx].toFixed(3) : "0.000"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-drona-dark">Decoder 2 Output</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {receivedBits.map((_, idx) => (
                            <div key={idx} className="p-3 rounded-lg border-2 border-purple-300 bg-purple-50 text-center">
                              <p className="text-sm font-semibold">D2[{idx}]</p>
                              <p className="text-drona-dark font-mono">{currentStepData ? currentStepData.decoder2Output[idx].toFixed(3) : "0.000"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {currentStepData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-drona-dark">Extrinsic Info 1</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {currentStepData.extrinsicInfo1.map((val, idx) => (
                              <div key={idx} className="p-2 rounded border bg-gray-50 text-center">
                                <p className="text-xs">E1[{idx}]</p>
                                <p className="text-xs font-mono">{val.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-drona-dark">Extrinsic Info 2</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {currentStepData.extrinsicInfo2.map((val, idx) => (
                              <div key={idx} className="p-2 rounded border bg-gray-50 text-center">
                                <p className="text-xs">E2[{idx}]</p>
                                <p className="text-xs font-mono">{val.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
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

export default TurboVisualizer;
