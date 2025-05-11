
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Shield } from 'lucide-react';

const HillClimbingVisualizer = () => {
  const [stepSize, setStepSize] = useState(0.1);
  const [maxIterations, setMaxIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">Hill Climbing Algorithm</h1>
          <p className="text-drona-gray">
            Learn how hill climbing optimization algorithm searches for solutions in a multi-dimensional space.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <Shield className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Step Size: {stepSize}</label>
                <Slider 
                  value={[stepSize * 100]} 
                  min={1} 
                  max={50} 
                  step={1} 
                  onValueChange={values => setStepSize(values[0] / 100)}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Max Iterations: {maxIterations}</label>
                <Slider 
                  value={[maxIterations]} 
                  min={10} 
                  max={500} 
                  step={10} 
                  onValueChange={values => setMaxIterations(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => setIsRunning(!isRunning)} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Algorithm' : 'Start Algorithm'}
                </Button>
                <Button variant="outline">Reset Landscape</Button>
              </div>
            </div>
          </Card>
          
          <Card className="col-span-1 lg:col-span-2 p-6 shadow-md flex flex-col min-h-[500px]">
            <h3 className="text-lg font-semibold mb-4">Visualization</h3>
            
            <div className="flex-grow bg-gray-50 rounded-md flex items-center justify-center">
              <div className="text-center p-8">
                <Shield className="h-16 w-16 text-drona-green/20 mx-auto mb-4" />
                <p className="text-drona-gray">Hill climbing optimization path will appear here.</p>
                <p className="text-sm text-drona-gray mt-2">Adjust the parameters and click "Start Algorithm" to begin.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HillClimbingVisualizer;
