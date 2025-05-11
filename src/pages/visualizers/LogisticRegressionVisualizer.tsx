
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { LineChart } from 'lucide-react';

const LogisticRegressionVisualizer = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

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
                  onClick={() => setIsRunning(!isRunning)} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Training' : 'Start Training'}
                </Button>
                <Button variant="outline">Reset Data</Button>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6 shadow-md flex flex-col min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Visualization</h3>
            
            <div className="flex-grow bg-gray-50 rounded-md flex items-center justify-center">
              <div className="text-center p-8">
                <LineChart className="h-16 w-16 text-drona-green/20 mx-auto mb-4" />
                <p className="text-drona-gray">Logistic regression decision boundary will appear here.</p>
                <p className="text-sm text-drona-gray mt-2">Adjust the parameters and click "Start Training" to begin.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LogisticRegressionVisualizer;
