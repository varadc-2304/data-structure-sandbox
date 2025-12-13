import React from "react";
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useLogisticRegressionVisualizer } from "./logistic-regression/useLogisticRegressionVisualizer";

const LogisticRegressionVisualizer = () => {
  const {
    state: { isPlaying, currentStep, speed, trainingSteps, dataPoints },
    actions: { setSpeed, generateRandomData, togglePlayPause, nextStep, prevStep, goToStep, skipToStart, skipToEnd, resetVisualization, getCurrentWeights, getDecisionBoundary, getPrediction, getStepDescription, getPredictionConfidence },
  } = useLogisticRegressionVisualizer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Logistic Regression</h1>
          <p className="text-lg text-drona-gray">Watch how logistic regression learns to classify data points using gradient descent</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Data Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button onClick={generateRandomData} variant="outline" className="w-full font-semibold border-2 hover:border-drona-green/50" disabled={isPlaying}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random Data
                </Button>
                <div className="text-sm text-drona-gray">
                  Current dataset: {dataPoints.length} points ({dataPoints.filter((p) => p.label === 0).length} class 0, {dataPoints.filter((p) => p.label === 1).length} class 1)
                </div>
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
                  <Button variant="outline" size="sm" onClick={nextStep} disabled={currentStep >= trainingSteps.length - 1} className="border-2 hover:border-drona-green/50">
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
                    Epoch: {currentStep} of {trainingSteps.length - 1}
                  </label>
                  <Slider value={[currentStep + 1]} onValueChange={([value]) => goToStep(value - 1)} max={trainingSteps.length} min={0} step={1} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">Animation Speed: {(2000 / speed).toFixed(1)}x</label>
                  <Slider value={[speed]} onValueChange={([value]) => setSpeed(value)} max={2000} min={500} step={250} className="w-full" />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>Slower</span>
                    <span>Faster</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {currentStep >= 0 && currentStep < trainingSteps.length && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Epoch</p>
                      <p className="text-2xl font-bold text-drona-dark">{trainingSteps[currentStep].epoch}</p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Accuracy</p>
                      <p className="text-lg font-bold text-drona-dark">{trainingSteps[currentStep].accuracy.toFixed(1)}%</p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Cost</p>
                      <p className="text-lg font-bold text-drona-dark">{trainingSteps[currentStep].cost.toFixed(4)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Weights</p>
                      <div className="text-sm space-y-1">
                        <p>w₀ (bias): {trainingSteps[currentStep].weights.w0.toFixed(3)}</p>
                        <p>w₁ (x): {trainingSteps[currentStep].weights.w1.toFixed(3)}</p>
                        <p>w₂ (y): {trainingSteps[currentStep].weights.w2.toFixed(3)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Logistic Regression Training</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="500" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white mx-auto">
                    {Array.from({ length: 11 }, (_, i) => (
                      <g key={i}>
                        <line x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="#f0f0f0" strokeWidth="1" />
                      </g>
                    ))}
                    {currentStep >= 0 && getDecisionBoundary().length > 1 && (
                      <polyline points={getDecisionBoundary().map((p) => `${p.x * 50},${(10 - p.y) * 40}`).join(" ")} fill="none" stroke="#628141" strokeWidth="3" strokeDasharray="5,5" />
                    )}
                    {dataPoints.map((point, index) => {
                      const confidence = currentStep >= 0 ? getPredictionConfidence(point) : 0.5;
                      const prediction = currentStep >= 0 ? getPrediction(point) : 0.5;
                      const isCorrect = currentStep >= 0 ? (prediction >= 0.5 ? 1 : 0) === point.label : true;
                      return (
                        <g key={index}>
                          {currentStep >= 0 && (
                            <circle cx={point.x * 50} cy={(10 - point.y) * 40} r={8 + confidence * 6} fill="none" stroke={isCorrect ? "#628141" : "#ef4444"} strokeWidth="2" opacity="0.3" />
                          )}
                          <circle cx={point.x * 50} cy={(10 - point.y) * 40} r="8" fill={point.label === 1 ? "#3b82f6" : "#ef4444"} stroke={point.label === 1 ? "#1d4ed8" : "#dc2626"} strokeWidth="2" opacity={currentStep >= 0 ? (isCorrect ? 1 : 0.6) : 1} />
                          {currentStep >= 0 && <circle cx={point.x * 50} cy={(10 - point.y) * 40} r="4" fill={prediction >= 0.5 ? "#3b82f6" : "#ef4444"} opacity="0.8" />}
                        </g>
                      );
                    })}
                    <text x="250" y="390" textAnchor="middle" className="text-sm font-medium text-drona-gray">
                      X
                    </text>
                    <text x="10" y="200" textAnchor="middle" className="text-sm font-medium text-drona-gray" transform="rotate(-90 10 200)">
                      Y
                    </text>
                  </svg>
                </div>
                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Training Progress:</h3>
                  <p className="text-sm text-drona-gray">{getStepDescription()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Class 0 (Red)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">{dataPoints.filter((p) => p.label === 0).length} data points</p>
                      {currentStep >= 0 && <p className="text-xs text-drona-gray mt-1">Outer ring shows prediction confidence</p>}
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Class 1 (Blue)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">{dataPoints.filter((p) => p.label === 1).length} data points</p>
                      {currentStep >= 0 && <p className="text-xs text-drona-gray mt-1">Inner dot shows model prediction</p>}
                    </CardContent>
                  </Card>
                </div>
                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">Logistic Regression Formula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-mono">p(y=1|x) = σ(w₀ + w₁x₁ + w₂x₂)</p>
                      <p className="text-sm text-drona-gray">where σ(z) = 1 / (1 + e^(-z))</p>
                      <p className="text-xs text-drona-gray mt-2">The green dashed line shows the decision boundary where p(y=1) = 0.5</p>
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

export default LogisticRegressionVisualizer;
