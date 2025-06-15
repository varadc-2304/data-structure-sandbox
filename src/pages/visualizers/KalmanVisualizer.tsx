
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface KalmanStep {
  step: number;
  prediction: number;
  measurement: number;
  kalmanGain: number;
  estimate: number;
  errorCovariance: number;
  description: string;
}

const KalmanVisualizer = () => {
  const [measurements, setMeasurements] = useState<number[]>([1.2, 1.8, 2.1, 2.9, 3.5, 4.2, 4.8]);
  const [kalmanSteps, setKalmanSteps] = useState<KalmanStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customMeasurements, setCustomMeasurements] = useState('1.2,1.8,2.1,2.9,3.5,4.2,4.8');
  const [processNoise, setProcessNoise] = useState(0.1);
  const [measurementNoise, setMeasurementNoise] = useState(0.5);

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= kalmanSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, kalmanSteps.length, speed]);

  const calculateKalman = (): KalmanStep[] => {
    const steps: KalmanStep[] = [];
    let estimate = measurements[0];
    let errorCovariance = 1.0;
    
    steps.push({
      step: 0,
      prediction: estimate,
      measurement: measurements[0],
      kalmanGain: 0,
      estimate,
      errorCovariance,
      description: `Initialize: Initial estimate = ${estimate.toFixed(2)}`
    });

    for (let i = 1; i < measurements.length; i++) {
      // Prediction step
      const prediction = estimate; // Assuming constant model
      const predictionCovariance = errorCovariance + processNoise;
      
      // Update step
      const kalmanGain = predictionCovariance / (predictionCovariance + measurementNoise);
      const newEstimate = prediction + kalmanGain * (measurements[i] - prediction);
      const newErrorCovariance = (1 - kalmanGain) * predictionCovariance;
      
      steps.push({
        step: i,
        prediction,
        measurement: measurements[i],
        kalmanGain,
        estimate: newEstimate,
        errorCovariance: newErrorCovariance,
        description: `Step ${i}: Measurement = ${measurements[i].toFixed(2)}, Estimate = ${newEstimate.toFixed(2)}`
      });
      
      estimate = newEstimate;
      errorCovariance = newErrorCovariance;
    }
    
    return steps;
  };

  const startVisualization = () => {
    const steps = calculateKalman();
    setKalmanSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= kalmanSteps.length - 1) {
      setIsRunning(false);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) return;
    setCurrentStep(currentStep - 1);
  };

  const goToStep = (step: number) => {
    if (step < 0 || step >= kalmanSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= kalmanSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setKalmanSteps([]);
  };

  const handleCustomMeasurements = () => {
    try {
      const newMeasurements = customMeasurements.split(',').map(x => parseFloat(x.trim()));
      if (newMeasurements.every(x => !isNaN(x))) {
        setMeasurements(newMeasurements);
        resetVisualization();
      }
    } catch (error) {
      console.error('Invalid measurements');
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < kalmanSteps.length ? kalmanSteps[currentStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ece-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ECE Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Kalman Filter Visualization</h1>
          <p className="text-lg text-drona-gray">
            The Kalman Filter provides optimal state estimation in noisy systems.
            <span className="font-semibold text-drona-green"> Optimal Linear Filter</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Measurements (comma-separated)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 1.2,1.8,2.1"
                      value={customMeasurements}
                      onChange={(e) => setCustomMeasurements(e.target.value)}
                      className="flex-1 border-2 focus:border-drona-green"
                    />
                    <Button 
                      onClick={handleCustomMeasurements}
                      className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                    >
                      Set
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Process Noise: {processNoise}
                  </Label>
                  <input 
                    type="range" 
                    min={0.01} 
                    max={1} 
                    step={0.01} 
                    value={processNoise} 
                    onChange={(e) => setProcessNoise(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Measurement Noise: {measurementNoise}
                  </Label>
                  <input 
                    type="range" 
                    min={0.1} 
                    max={2} 
                    step={0.1} 
                    value={measurementNoise} 
                    onChange={(e) => setMeasurementNoise(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {speed}x
                  </Label>
                  <input 
                    type="range" 
                    min={0.5} 
                    max={3} 
                    step={0.5} 
                    value={speed} 
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full"
                  />
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
                    onClick={() => goToStep(0)}
                    disabled={kalmanSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevStep}
                    disabled={currentStep <= 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={togglePlayPause}
                    disabled={measurements.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= kalmanSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(kalmanSteps.length - 1)}
                    disabled={kalmanSteps.length === 0}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetVisualization} 
                  variant="outline" 
                  disabled={isRunning}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {kalmanSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {kalmanSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={kalmanSteps.length}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Kalman Filter Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {kalmanSteps.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Target className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Start to begin Kalman Filter visualization</p>
                      <Button 
                        onClick={startVisualization}
                        className="mt-4 bg-drona-green hover:bg-drona-green/90 font-semibold"
                      >
                        Start Visualization
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Current Step Description */}
                    {currentStepData && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark">
                          {currentStepData.description}
                        </p>
                      </div>
                    )}

                    {/* Current Step Details */}
                    {currentStepData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50">
                          <h4 className="font-semibold text-drona-dark">Prediction</h4>
                          <p className="text-2xl font-bold text-blue-600">{currentStepData.prediction.toFixed(3)}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg border-2 border-red-300 bg-red-50">
                          <h4 className="font-semibold text-drona-dark">Measurement</h4>
                          <p className="text-2xl font-bold text-red-600">{currentStepData.measurement.toFixed(3)}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg border-2 border-drona-green/30 bg-drona-green/10">
                          <h4 className="font-semibold text-drona-dark">Estimate</h4>
                          <p className="text-2xl font-bold text-drona-green">{currentStepData.estimate.toFixed(3)}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg border-2 border-purple-300 bg-purple-50">
                          <h4 className="font-semibold text-drona-dark">Kalman Gain</h4>
                          <p className="text-2xl font-bold text-purple-600">{currentStepData.kalmanGain.toFixed(3)}</p>
                        </div>
                        
                        <div className="p-4 rounded-lg border-2 border-orange-300 bg-orange-50">
                          <h4 className="font-semibold text-drona-dark">Error Covariance</h4>
                          <p className="text-2xl font-bold text-orange-600">{currentStepData.errorCovariance.toFixed(3)}</p>
                        </div>
                      </div>
                    )}

                    {/* All Measurements vs Estimates */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-drona-dark">Progress Tracking</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="border-2 border-drona-green/30 p-2 bg-drona-green/10">Step</th>
                              <th className="border-2 border-drona-green/30 p-2 bg-drona-green/10">Measurement</th>
                              <th className="border-2 border-drona-green/30 p-2 bg-drona-green/10">Estimate</th>
                              <th className="border-2 border-drona-green/30 p-2 bg-drona-green/10">Error</th>
                            </tr>
                          </thead>
                          <tbody>
                            {kalmanSteps.slice(0, currentStep + 1).map((step, idx) => (
                              <tr key={idx} className={idx === currentStep ? 'bg-drona-green/20' : ''}>
                                <td className="border-2 border-drona-green/30 p-2 text-center">{step.step}</td>
                                <td className="border-2 border-drona-green/30 p-2 text-center">{step.measurement.toFixed(3)}</td>
                                <td className="border-2 border-drona-green/30 p-2 text-center">{step.estimate.toFixed(3)}</td>
                                <td className="border-2 border-drona-green/30 p-2 text-center">{Math.abs(step.measurement - step.estimate).toFixed(3)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default KalmanVisualizer;
