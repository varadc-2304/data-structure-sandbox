import React from "react";
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useKMeansVisualizer, colors } from "./kmeans/useKMeansVisualizer";

const KMeansVisualizer = () => {
  const {
    state: { isPlaying, currentStep, speed, k, steps, maxSteps },
    actions: { setSpeed, regenerateData, updateK, togglePlayPause, nextStep, prevStep, goToStep, skipToStart, skipToEnd, resetVisualization },
  } = useKMeansVisualizer();

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">K-means Clustering</h1>
          <p className="text-lg text-drona-gray">Visualize how K-means algorithm groups data points into clusters through iterative optimization</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button variant="outline" size="sm" onClick={skipToStart} className="border-2 hover:border-drona-green/50">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep <= 0} className="border-2 hover:border-drona-green/50">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={togglePlayPause} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= maxSteps - 1} className="border-2 hover:border-drona-green/50">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={skipToEnd} className="border-2 hover:border-drona-green/50">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={resetVisualization} variant="outline" disabled={isPlaying} className="w-full border-2 hover:border-drona-green/50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button onClick={regenerateData} variant="outline" disabled={isPlaying} className="w-full border-2 hover:border-drona-green/50">
                  <Shuffle className="mr-2 h-4 w-4" /> New Data
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Step: {currentStep + 1} of {maxSteps}
                  </label>
                  <Slider value={[currentStep]} onValueChange={([value]) => goToStep(value)} max={maxSteps - 1} min={0} step={1} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">Animation Speed: {(2000 / speed).toFixed(1)}x</label>
                  <Slider value={[speed]} onValueChange={([value]) => setSpeed(value)} max={2000} min={500} step={250} className="w-full" />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">Number of Clusters (K): {k}</label>
                  <Slider value={[k]} onValueChange={updateK} max={6} min={2} step={1} className="w-full" disabled={isPlaying} />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>2</span>
                    <span>6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Current Iteration</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.ceil((currentStep + 1) / 2)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Steps</p>
                    <p className="text-3xl font-bold text-drona-dark">{maxSteps}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Clusters (K)</p>
                    <p className="text-xl font-bold text-drona-dark">{k}</p>
                  </div>
                  {currentStepData.convergence !== undefined && (
                    <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Convergence</p>
                      <p className="text-xl font-bold text-drona-dark">{currentStepData.convergence.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">K-means Clustering Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="100%" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white">
                    {currentStepData.points
                      .filter((point) => point.cluster >= 0)
                      .map((point) => {
                        const centroid = currentStepData.centroids[point.cluster];
                        return <line key={`line-${point.id}`} x1={point.x} y1={point.y} x2={centroid.x} y2={centroid.y} stroke={colors[point.cluster] + "40"} strokeWidth="1" strokeDasharray="2,2" />;
                      })}
                    {currentStepData.points.map((point) => (
                      <circle key={point.id} cx={point.x} cy={point.y} r="4" fill={point.cluster >= 0 ? colors[point.cluster] : "#94a3b8"} stroke="white" strokeWidth="1" className="transition-all duration-500" />
                    ))}
                    {currentStepData.centroids.map(
                      (centroid) =>
                        centroid.prevX !== undefined &&
                        centroid.prevY !== undefined && (
                          <line key={`movement-${centroid.cluster}`} x1={centroid.prevX} y1={centroid.prevY} x2={centroid.x} y2={centroid.y} stroke={colors[centroid.cluster]} strokeWidth="2" markerEnd="url(#arrowhead)" className="transition-all duration-500" />
                        )
                    )}
                    {currentStepData.centroids.map((centroid) => (
                      <g key={centroid.cluster}>
                        <circle cx={centroid.x} cy={centroid.y} r="8" fill={colors[centroid.cluster]} stroke="white" strokeWidth="3" className="transition-all duration-500" />
                        <circle cx={centroid.x} cy={centroid.y} r="3" fill="white" className="transition-all duration-500" />
                      </g>
                    ))}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Current Step:</h3>
                  <p className="text-sm text-drona-gray">{currentStepData.description}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-drona-dark">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-400 border border-white"></div>
                        <span className="text-sm text-drona-gray">Unassigned Points</span>
                      </div>
                      {Array.from({ length: k }, (_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: colors[i] }}></div>
                          <span className="text-sm text-drona-gray">Cluster {i + 1}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <span className="text-sm text-drona-gray">Centroids</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-drona-dark">Algorithm Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-drona-gray">
                      <p>1. Initialize K random centroids</p>
                      <p>2. Assign each point to nearest centroid</p>
                      <p>3. Update centroids to cluster centers</p>
                      <p>4. Repeat until convergence</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansVisualizer;
