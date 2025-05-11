
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataPoint {
  x: number;
  y: number;
  label: number;
}

const LogisticRegressionVisualizer = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [weights, setWeights] = useState({ w1: 0, w2: 0, bias: 0 });
  const [currentIteration, setCurrentIteration] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  // Generate random data points
  const generateData = () => {
    const newData: DataPoint[] = [];
    
    // Generate class 0 points (lower left cluster)
    for (let i = 0; i < 50; i++) {
      newData.push({
        x: Math.random() * 150,
        y: Math.random() * 150,
        label: 0
      });
    }
    
    // Generate class 1 points (upper right cluster)
    for (let i = 0; i < 50; i++) {
      newData.push({
        x: 200 + Math.random() * 150,
        y: 200 + Math.random() * 150,
        label: 1
      });
    }
    
    // Add some noise
    for (let i = 0; i < 20; i++) {
      newData.push({
        x: 150 + Math.random() * 100,
        y: 150 + Math.random() * 100,
        label: Math.random() > 0.5 ? 1 : 0
      });
    }
    
    setData(newData);
    setWeights({ w1: Math.random() - 0.5, w2: Math.random() - 0.5, bias: Math.random() - 0.5 });
    setCurrentIteration(0);
    setAccuracy(0);
  };

  // Sigmoid function
  const sigmoid = (z: number): number => {
    return 1 / (1 + Math.exp(-z));
  };

  // Predict class for a given point
  const predict = (x: number, y: number): number => {
    const z = weights.w1 * x + weights.w2 * y + weights.bias;
    return sigmoid(z);
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    let correct = 0;
    data.forEach(point => {
      const prediction = predict(point.x, point.y) >= 0.5 ? 1 : 0;
      if (prediction === point.label) {
        correct++;
      }
    });
    return (correct / data.length) * 100;
  };

  // Run one iteration of gradient descent
  const runIteration = () => {
    if (currentIteration >= iterations) {
      setIsRunning(false);
      toast({
        title: "Training Complete",
        description: `Logistic regression completed with ${accuracy.toFixed(2)}% accuracy.`
      });
      return;
    }

    // Calculate gradients
    let dw1 = 0, dw2 = 0, db = 0;
    data.forEach(point => {
      const pred = predict(point.x, point.y);
      const error = pred - point.label;
      dw1 += error * point.x;
      dw2 += error * point.y;
      db += error;
    });

    // Update weights
    const newWeights = {
      w1: weights.w1 - learningRate * dw1 / data.length,
      w2: weights.w2 - learningRate * dw2 / data.length,
      bias: weights.bias - learningRate * db / data.length
    };
    setWeights(newWeights);
    
    // Update iteration counter
    setCurrentIteration(prev => prev + 1);
    
    // Calculate and update accuracy
    const newAccuracy = calculateAccuracy();
    setAccuracy(newAccuracy);
    
    if (isRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
    }
  };

  // Toggle training state
  const toggleTraining = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    
    if (newIsRunning) {
      animationRef.current = requestAnimationFrame(runIteration);
      toast({
        title: "Training Started",
        description: "Logistic regression training has started."
      });
    } else {
      cancelAnimationFrame(animationRef.current);
      toast({
        title: "Training Paused",
        description: "Logistic regression training has been paused."
      });
    }
  };

  // Reset data
  const resetData = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    generateData();
    toast({
      title: "Data Reset",
      description: "New data has been generated for logistic regression."
    });
  };

  // Draw visualization
  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw data points
    data.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = point.label === 1 ? '#FF6384' : '#36A2EB';
      ctx.fill();
      ctx.closePath();
    });

    // Draw decision boundary line
    // For logistic regression, the boundary is where w1*x + w2*y + bias = 0
    // Rewriting for y: y = -(w1*x + bias) / w2
    if (weights.w2 !== 0) {
      const x1 = 0;
      const y1 = -(weights.w1 * x1 + weights.bias) / weights.w2;
      
      const x2 = canvas.width;
      const y2 = -(weights.w1 * x2 + weights.bias) / weights.w2;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#4BC0C0';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }

    // Display iteration and accuracy
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Iteration: ${currentIteration}/${iterations}`, 10, 20);
    ctx.fillText(`Accuracy: ${accuracy.toFixed(2)}%`, 10, 45);
  };

  // Initialize data on component mount
  useEffect(() => {
    generateData();
  }, []);

  // Update visualization when data changes
  useEffect(() => {
    drawVisualization();
  }, [data, weights, currentIteration, accuracy]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">Logistic Regression Visualizer</h1>
          <p className="text-drona-gray">
            Explore the visualization of logistic regression for binary classification problems.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <LineChart className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Learning Rate: {learningRate}</label>
                <Slider 
                  value={[learningRate * 100]} 
                  min={1} 
                  max={100} 
                  step={1} 
                  onValueChange={values => setLearningRate(values[0] / 100)}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Iterations: {iterations}</label>
                <Slider 
                  value={[iterations]} 
                  min={10} 
                  max={500} 
                  step={10} 
                  onValueChange={values => setIterations(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={toggleTraining} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Training' : 'Start Training'}
                </Button>
                <Button onClick={resetData} variant="outline">Reset Data</Button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-drona-gray">
                  Current Iteration: {currentIteration}/{iterations}
                </p>
                <p className="text-sm text-drona-gray">
                  Accuracy: {accuracy.toFixed(2)}%
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6 shadow-md flex flex-col min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Visualization</h3>
            
            <div className="flex-grow bg-gray-50 rounded-md flex items-center justify-center">
              <canvas 
                ref={canvasRef} 
                width={400} 
                height={400}
                className="border border-gray-200 rounded-md bg-white"
              ></canvas>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LogisticRegressionVisualizer;
