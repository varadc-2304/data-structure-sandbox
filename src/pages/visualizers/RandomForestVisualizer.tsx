import React from "react";
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useRandomForestVisualizer, TreeNode } from "./random-forest/useRandomForestVisualizer";

const RandomForestVisualizer = () => {
  const {
    state: { isPlaying, currentStep, speed, forest, forestSteps, predictions, finalPrediction, sampleData },
    actions: { setSpeed, generateRandomData, togglePlayPause, nextStep, prevStep, goToStep, skipToStart, skipToEnd, resetVisualization, getStepDescription },
  } = useRandomForestVisualizer();

  const renderTree = (tree: TreeNode | undefined, x: number, y: number, scale: number = 1): React.ReactNode => {
    if (!tree) return null;

    const nodeRadius = 20 * scale;
    const fontSize = 8 * scale;
    const nodeColor = tree.isLeaf ? (tree.prediction === "Yes" ? "bg-green-700" : "bg-red-500") : "bg-blue-500";

    return (
      <g key={tree.id}>
        <circle cx={x} cy={y} r={nodeRadius} className={`${nodeColor} opacity-100 transition-all duration-500`} fill="currentColor" />
        <text x={x} y={y - 3} textAnchor="middle" className="text-xs font-bold fill-white" fontSize={fontSize}>
          {tree.isLeaf ? tree.prediction : tree.feature}
        </text>
        <text x={x} y={y + 6} textAnchor="middle" className="text-xs fill-white" fontSize={fontSize - 1}>
          {tree.isLeaf ? "" : `≤ ${tree.threshold}`}
        </text>
        {tree.left && (
          <>
            <line x1={x} y1={y + nodeRadius} x2={x - 60 * scale} y2={y + 80 * scale} className="stroke-2 stroke-drona-green transition-colors duration-500" />
            <text x={x - 30 * scale} y={y + 50 * scale} textAnchor="middle" className="text-xs font-medium text-drona-green" fontSize={fontSize - 1}>
              Yes
            </text>
            {renderTree(tree.left, x - 60 * scale, y + 90 * scale, scale)}
          </>
        )}
        {tree.right && (
          <>
            <line x1={x} y1={y + nodeRadius} x2={x + 60 * scale} y2={y + 80 * scale} className="stroke-2 stroke-drona-green transition-colors duration-500" />
            <text x={x + 30 * scale} y={y + 50 * scale} textAnchor="middle" className="text-xs font-medium text-drona-green" fontSize={fontSize - 1}>
              No
            </text>
            {renderTree(tree.right, x + 60 * scale, y + 90 * scale, scale)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Random Forest</h1>
          <p className="text-lg text-drona-gray">Watch how Random Forest builds multiple decision trees and combines their predictions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Data Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button onClick={generateRandomData} variant="outline" className="w-full font-semibold border-2 hover:border-drona-green/50">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random Data
                </Button>
                <div className="text-sm text-drona-gray">Current dataset: {sampleData.length} samples</div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button variant="outline" size="sm" onClick={skipToStart} className="border-2 hover:border-drona-green/50">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={prevStep} disabled={currentStep <= -1} className="border-2 hover:border-drona-green/50">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={togglePlayPause} className="bg-drona-green hover:bg-drona-green/90 font-semibold">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= forestSteps.length - 1} className="border-2 hover:border-drona-green/50">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={skipToEnd} className="border-2 hover:border-drona-green/50">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={resetVisualization} variant="outline" disabled={isPlaying} className="w-full border-2 hover:border-drona-green/50">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Step: {currentStep + 2} of {forestSteps.length + 1}
                  </label>
                  <Slider value={[currentStep + 1]} onValueChange={([value]) => goToStep(value - 1)} max={forestSteps.length} min={0} step={1} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">Speed: {((3000 - speed) / 100).toFixed(1)}x</label>
                  <Slider value={[speed]} onValueChange={([value]) => setSpeed(value)} max={2500} min={500} step={100} className="w-full" />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Forest Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Trees Generated</p>
                    <p className="text-3xl font-bold text-drona-dark">{forest.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Predictions Made</p>
                    <p className="text-3xl font-bold text-drona-dark">{predictions.length}</p>
                  </div>
                  {finalPrediction && (
                    <div className="bg-gradient-to-r from-green-light to-green-100 p-4 rounded-lg border-2 border-green-300">
                      <p className="text-sm font-semibold text-drona-gray">Final Prediction</p>
                      <p className="text-xl font-bold text-drona-dark">{finalPrediction}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Random Forest Construction</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[0, 1, 2].map((treeIndex) => (
                      <div key={treeIndex} className="text-center">
                        <h4 className="font-bold text-drona-dark mb-2">Tree {treeIndex + 1}</h4>
                        <svg width="200" height="200" viewBox="0 0 200 200" className="border rounded-lg bg-white mx-auto">
                          {forest[treeIndex] && renderTree(forest[treeIndex], 100, 30, 0.8)}
                        </svg>
                        {predictions[treeIndex] && (
                          <div className={`mt-2 p-2 rounded ${predictions[treeIndex] === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            Predicts: {predictions[treeIndex]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Random Forest Process:</h3>
                  <p className="text-sm text-drona-gray">{getStepDescription()}</p>
                </div>

                {finalPrediction && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                    <h3 className="text-xl font-bold text-drona-dark mb-2">Final Random Forest Prediction</h3>
                    <p className="text-lg">
                      <strong>Result:</strong> <span className={finalPrediction === "Yes" ? "text-green-700" : "text-red-600"}>{finalPrediction}</span>
                    </p>
                    <p className="text-sm text-drona-gray mt-2">Based on majority voting from {predictions.length} decision trees</p>
                  </div>
                )}

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">Sample Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sampleData.map((sample, index) => (
                        <div key={index} className="p-2 bg-white/50 rounded">
                          <div className="text-sm">
                            <strong>Age:</strong> {sample.age} | <strong>Income:</strong> ${sample.income.toLocaleString()} | <strong>Buys:</strong>{" "}
                            <span className={sample.buys === "Yes" ? "text-green-700" : "text-red-600"}>{sample.buys}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomForestVisualizer;
