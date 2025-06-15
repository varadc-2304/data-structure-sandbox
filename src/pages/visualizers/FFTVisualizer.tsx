
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface FFTStep {
  step: number;
  input: number[];
  output: { real: number; imag: number }[];
  currentStage: string;
  description: string;
}

const FFTVisualizer = () => {
  const [inputSignal, setInputSignal] = useState<number[]>([1, 0, 1, 0, 1, 0, 1, 0]);
  const [fftSteps, setFFTSteps] = useState<FFTStep[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [customInput, setCustomInput] = useState('1,0,1,0,1,0,1,0');

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep >= fftSteps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, 2000 / speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, fftSteps.length, speed]);

  const calculateFFT = (input: number[]): FFTStep[] => {
    const steps: FFTStep[] = [];
    const N = input.length;
    
    if (N <= 1) {
      const output = input.map(x => ({ real: x, imag: 0 }));
      steps.push({
        step: 0,
        input: [...input],
        output,
        currentStage: 'Base case',
        description: 'Base case: N ≤ 1, return input as complex numbers'
      });
      return steps;
    }

    // Initial step
    steps.push({
      step: 0,
      input: [...input],
      output: input.map(x => ({ real: x, imag: 0 })),
      currentStage: 'Initialization',
      description: `Starting FFT with ${N} samples`
    });

    // Simple DFT implementation for visualization
    const output: { real: number; imag: number }[] = [];
    
    for (let k = 0; k < N; k++) {
      let real = 0;
      let imag = 0;
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N;
        real += input[n] * Math.cos(angle);
        imag += input[n] * Math.sin(angle);
      }
      
      output.push({ real, imag });
      
      steps.push({
        step: k + 1,
        input: [...input],
        output: [...output],
        currentStage: `Computing frequency bin ${k}`,
        description: `Calculating X[${k}] = ${real.toFixed(2)} + ${imag.toFixed(2)}i`
      });
    }

    return steps;
  };

  const startVisualization = () => {
    const steps = calculateFFT(inputSignal);
    setFFTSteps(steps);
    setCurrentStep(-1);
    setIsRunning(true);
  };

  const nextStep = () => {
    if (currentStep >= fftSteps.length - 1) {
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
    if (step < 0 || step >= fftSteps.length) return;
    setCurrentStep(step);
    setIsRunning(false);
  };

  const togglePlayPause = () => {
    if (currentStep >= fftSteps.length - 1) {
      startVisualization();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsRunning(false);
    setFFTSteps([]);
  };

  const handleCustomInput = () => {
    try {
      const newInput = customInput.split(',').map(x => parseFloat(x.trim()));
      if (newInput.every(x => !isNaN(x))) {
        setInputSignal(newInput);
        resetVisualization();
      }
    } catch (error) {
      console.error('Invalid input signal');
    }
  };

  const currentStepData = currentStep >= 0 && currentStep < fftSteps.length ? fftSteps[currentStep] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ece-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ECE Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Fast Fourier Transform Visualization</h1>
          <p className="text-lg text-drona-gray">
            The FFT algorithm efficiently computes the Discrete Fourier Transform.
            <span className="font-semibold text-drona-green"> Time Complexity: O(N log N)</span>
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
                    Input Signal (comma-separated)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., 1,0,1,0"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="flex-1 border-2 focus:border-drona-green"
                    />
                    <Button 
                      onClick={handleCustomInput}
                      className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                    >
                      Set
                    </Button>
                  </div>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(0)}
                    disabled={fftSteps.length === 0}
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
                    disabled={inputSignal.length === 0}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep}
                    disabled={currentStep >= fftSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(fftSteps.length - 1)}
                    disabled={fftSteps.length === 0}
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

                {fftSteps.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {fftSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={fftSteps.length}
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
                <CardTitle className="text-2xl font-bold text-drona-dark">FFT Visualization</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {fftSteps.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Waves className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Click Start to begin FFT visualization</p>
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

                    {/* Input Signal */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-drona-dark">Input Signal</h3>
                      <div className="flex gap-2 flex-wrap">
                        {inputSignal.map((val, idx) => (
                          <div key={idx} className="p-3 rounded-lg border-2 border-drona-green bg-drona-green/10">
                            <p className="text-sm font-semibold">x[{idx}]</p>
                            <p className="text-drona-dark">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FFT Output */}
                    {currentStepData && currentStepData.output.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-drona-dark">Frequency Domain (FFT Output)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentStepData.output.map((complex, idx) => (
                            <div key={idx} className="p-4 rounded-lg border-2 border-drona-green/30 bg-white">
                              <p className="text-sm font-semibold text-drona-dark">X[{idx}]</p>
                              <p className="text-drona-dark">
                                {complex.real.toFixed(3)} + {complex.imag.toFixed(3)}i
                              </p>
                              <p className="text-xs text-drona-gray">
                                Magnitude: {Math.sqrt(complex.real ** 2 + complex.imag ** 2).toFixed(3)}
                              </p>
                            </div>
                          ))}
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

export default FFTVisualizer;
