import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface DataPoint {
  x: number;
  y: number;
  label: 0 | 1;
  predicted?: number;
}

interface TrainingStep {
  epoch: number;
  weights: { w0: number; w1: number; w2: number };
  cost: number;
  accuracy: number;
  description: string;
}

const LogisticRegressionVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1.0); // Default speed 1.0x
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { x: 2, y: 3, label: 0 },
    { x: 3, y: 3, label: 0 },
    { x: 1, y: 2, label: 0 },
    { x: 2, y: 1, label: 0 },
    { x: 7, y: 8, label: 1 },
    { x: 8, y: 7, label: 1 },
    { x: 6, y: 6, label: 1 },
    { x: 9, y: 8, label: 1 },
    { x: 4, y: 5, label: 0 },
    { x: 5, y: 4, label: 0 },
    { x: 6, y: 7, label: 1 },
    { x: 7, y: 6, label: 1 },
  ]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomData = () => {
    const newDataPoints: DataPoint[] = [];
    
    // Generate class 0 points (bottom-left cluster)
    for (let i = 0; i < 8; i++) {
      newDataPoints.push({
        x: Math.random() * 4 + 1, // 1-5 range
        y: Math.random() * 4 + 1, // 1-5 range
        label: 0
      });
    }
    
    // Generate class 1 points (top-right cluster)
    for (let i = 0; i < 8; i++) {
      newDataPoints.push({
        x: Math.random() * 4 + 5, // 5-9 range
        y: Math.random() * 4 + 5, // 5-9 range
        label: 1
      });
    }
    
    // Add some overlapping points to make it more interesting
    for (let i = 0; i < 4; i++) {
      newDataPoints.push({
        x: Math.random() * 2 + 4, // 4-6 range (overlap area)
        y: Math.random() * 2 + 4, // 4-6 range (overlap area)
        label: Math.random() > 0.5 ? 1 : 0
      });
    }
    
    setDataPoints(newDataPoints);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const sigmoid = (z: number): number => {
    // Clamp z to prevent overflow
    const clampedZ = Math.max(-500, Math.min(500, z));
    return 1 / (1 + Math.exp(-clampedZ));
  };

  const calculateAccuracy = (weights: { w0: number; w1: number; w2: number }): number => {
    let correct = 0;
    dataPoints.forEach(point => {
      const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
      const prediction = sigmoid(z);
      const predictedClass = prediction >= 0.5 ? 1 : 0;
      if (predictedClass === point.label) correct++;
    });
    return (correct / dataPoints.length) * 100;
  };

  const generateTrainingSteps = useCallback(() => {
    const steps: TrainingStep[] = [];
    let weights = { w0: 0, w1: 0, w2: 0 }; // Start with zero weights
    const learningRate = 0.3;
    const epochs = 20;

    // Initial step
    steps.push({
      epoch: 0,
      weights: { ...weights },
      cost: 0,
      accuracy: calculateAccuracy(weights),
      description: `Initial state: All weights set to 0. Starting gradient descent optimization.`
    });

    for (let epoch = 0; epoch < epochs; epoch++) {
      // Calculate predictions and cost
      let totalCost = 0;
      const gradients = { w0: 0, w1: 0, w2: 0 };

      dataPoints.forEach(point => {
        const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
        const prediction = sigmoid(z);
        const error = prediction - point.label;
        
        // Cross-entropy loss
        const epsilon = 1e-15; // To prevent log(0)
        const clampedPrediction = Math.max(epsilon, Math.min(1 - epsilon, prediction));
        totalCost += -point.label * Math.log(clampedPrediction) - (1 - point.label) * Math.log(1 - clampedPrediction);
        
        // Gradients
        gradients.w0 += error;
        gradients.w1 += error * point.x;
        gradients.w2 += error * point.y;
      });

      totalCost /= dataPoints.length;

      // Update weights using gradient descent
      weights.w0 -= learningRate * gradients.w0 / dataPoints.length;
      weights.w1 -= learningRate * gradients.w1 / dataPoints.length;
      weights.w2 -= learningRate * gradients.w2 / dataPoints.length;

      const accuracy = calculateAccuracy(weights);

      steps.push({
        epoch: epoch + 1,
        weights: { ...weights },
        cost: totalCost,
        accuracy: accuracy,
        description: `Epoch ${epoch + 1}: Updated weights using gradient descent. Cost: ${totalCost.toFixed(4)}, Accuracy: ${accuracy.toFixed(1)}%`
      });
    }

    setTrainingSteps(steps);
  }, [dataPoints]);

  useEffect(() => {
    generateTrainingSteps();
  }, [generateTrainingSteps]);

  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= trainingSteps.length - 1) {
        setIsPlaying(false);
        return;
      }

      intervalRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / speed); // Convert speed multiplier to delay
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [isPlaying, currentStep, trainingSteps.length, speed]);

  const togglePlayPause = () => {
    if (currentStep >= trainingSteps.length - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < trainingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, trainingSteps.length - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(trainingSteps.length - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getCurrentWeights = () => {
    if (currentStep >= 0 && currentStep < trainingSteps.length) {
      return trainingSteps[currentStep].weights;
    }
    return { w0: 0, w1: 0, w2: 0 };
  };

  const getDecisionBoundary = () => {
    const weights = getCurrentWeights();
    // Decision boundary: w0 + w1*x + w2*y = 0
    // Solve for y: y = -(w0 + w1*x) / w2
    const points = [];
    
    if (Math.abs(weights.w2) > 1e-10) { // Avoid division by zero
      for (let x = 0; x <= 10; x += 0.5) {
        const y = -(weights.w0 + weights.w1 * x) / weights.w2;
        if (y >= 0 && y <= 10) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  const getPrediction = (point: DataPoint) => {
    const weights = getCurrentWeights();
    const z = weights.w0 + weights.w1 * point.x + weights.w2 * point.y;
    return sigmoid(z);
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to train logistic regression model. Click play to start!';
    const step = trainingSteps[currentStep];
    return step ? step.description : 'Training complete!';
  };

  const getPredictionConfidence = (point: DataPoint) => {
    const prediction = getPrediction(point);
    // Convert to confidence: how far from 0.5 (uncertainty)
    return Math.abs(prediction - 0.5) * 2;
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Logistic Regression</h1>
          <p className="text-lg text-drona-gray">
            Watch how logistic regression learns to classify data points using gradient descent
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Data Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Button 
                  onClick={generateRandomData}
                  variant="outline"
                  className="w-full font-semibold border-2 hover:border-drona-green/50"
                  disabled={isPlaying}
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Generate Random Data
                </Button>
                <div className="text-sm text-drona-gray">
                  Current dataset: {dataPoints.length} points ({dataPoints.filter(p => p.label === 0).length} class 0, {dataPoints.filter(p => p.label === 1).length} class 1)
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToStart}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= -1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= trainingSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToEnd}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetVisualization} 
                  variant="outline" 
                  disabled={isPlaying}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Epoch: {currentStep} of {trainingSteps.length - 1}
                  </label>
                  <Slider
                    value={[currentStep + 1]}
                    onValueChange={([value]) => goToStep(value - 1)}
                    max={trainingSteps.length}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Speed: {speed.toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={3.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-drona-gray">
                    <span>0.5x</span>
                    <span>3.0x</span>
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

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Logistic Regression Training</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="500" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white mx-auto">
                    {/* Grid */}
                    {Array.from({ length: 11 }, (_, i) => (
                      <g key={i}>
                        <line x1={i * 50} y1="0" x2={i * 50} y2="400" stroke="#f0f0f0" strokeWidth="1" />
                        <line x1="0" y1={i * 40} x2="500" y2={i * 40} stroke="#f0f0f0" strokeWidth="1" />
                      </g>
                    ))}
                    
                    {/* Decision boundary */}
                    {currentStep >= 0 && getDecisionBoundary().length > 1 && (
                      <polyline
                        points={getDecisionBoundary().map(p => `${p.x * 50},${(10 - p.y) * 40}`).join(' ')}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      />
                    )}
                    
                    {/* Data points */}
                    {dataPoints.map((point, index) => {
                      const confidence = currentStep >= 0 ? getPredictionConfidence(point) : 0.5;
                      const prediction = currentStep >= 0 ? getPrediction(point) : 0.5;
                      const isCorrect = currentStep >= 0 ? 
                        (prediction >= 0.5 ? 1 : 0) === point.label : true;
                      
                      return (
                        <g key={index}>
                          {/* Confidence ring */}
                          {currentStep >= 0 && (
                            <circle
                              cx={point.x * 50}
                              cy={(10 - point.y) * 40}
                              r={8 + confidence * 6}
                              fill="none"
                              stroke={isCorrect ? '#22c55e' : '#ef4444'}
                              strokeWidth="2"
                              opacity="0.3"
                            />
                          )}
                          
                          {/* Data point */}
                          <circle
                            cx={point.x * 50}
                            cy={(10 - point.y) * 40}
                            r="8"
                            fill={point.label === 1 ? '#3b82f6' : '#ef4444'}
                            stroke={point.label === 1 ? '#1d4ed8' : '#dc2626'}
                            strokeWidth="2"
                            opacity={currentStep >= 0 ? (isCorrect ? 1 : 0.6) : 1}
                          />
                          
                          {/* Prediction indicator */}
                          {currentStep >= 0 && (
                            <circle
                              cx={point.x * 50}
                              cy={(10 - point.y) * 40}
                              r="4"
                              fill={prediction >= 0.5 ? '#3b82f6' : '#ef4444'}
                              opacity="0.8"
                            />
                          )}
                        </g>
                      );
                    })}
                    
                    {/* Axes labels */}
                    <text x="250" y="390" textAnchor="middle" className="text-sm font-medium text-drona-gray">X</text>
                    <text x="10" y="200" textAnchor="middle" className="text-sm font-medium text-drona-gray" transform="rotate(-90 10 200)">Y</text>
                  </svg>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Training Progress:</h3>
                  <p className="text-sm text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Class 0 (Red)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">
                        {dataPoints.filter(p => p.label === 0).length} data points
                      </p>
                      {currentStep >= 0 && (
                        <p className="text-xs text-drona-gray mt-1">
                          Outer ring shows prediction confidence
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-drona-dark">Class 1 (Blue)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-drona-gray">
                        {dataPoints.filter(p => p.label === 1).length} data points
                      </p>
                      {currentStep >= 0 && (
                        <p className="text-xs text-drona-gray mt-1">
                          Inner dot shows model prediction
                        </p>
                      )}
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
                      <p className="text-xs text-drona-gray mt-2">
                        The green dashed line shows the decision boundary where p(y=1) = 0.5
                      </p>
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
