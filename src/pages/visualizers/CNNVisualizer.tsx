
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface CNNLayer {
  type: 'input' | 'conv' | 'pool' | 'fc';
  name: string;
  size: { width: number; height: number; depth: number };
  active: boolean;
}

const CNNVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const layers: CNNLayer[] = [
    { type: 'input', name: 'Input Image', size: { width: 32, height: 32, depth: 3 }, active: false },
    { type: 'conv', name: 'Conv Layer 1', size: { width: 28, height: 28, depth: 6 }, active: false },
    { type: 'pool', name: 'MaxPool 1', size: { width: 14, height: 14, depth: 6 }, active: false },
    { type: 'conv', name: 'Conv Layer 2', size: { width: 10, height: 10, depth: 16 }, active: false },
    { type: 'pool', name: 'MaxPool 2', size: { width: 5, height: 5, depth: 16 }, active: false },
    { type: 'fc', name: 'Fully Connected', size: { width: 120, height: 1, depth: 1 }, active: false },
    { type: 'fc', name: 'Output', size: { width: 10, height: 1, depth: 1 }, active: false },
  ];

  const updateLayers = useCallback(() => {
    setCurrentStep(prev => {
      const newStep = (prev + 1) % layers.length;
      return newStep;
    });
  }, [layers.length]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateLayers, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, updateLayers]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const skipToStart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(layers.length - 1);
    setIsPlaying(false);
  };

  const renderLayer = (layer: CNNLayer, index: number) => {
    const isActive = index <= currentStep;
    const { width, height, depth } = layer.size;

    const getLayerColor = (type: string) => {
      switch (type) {
        case 'input': return 'bg-blue-500';
        case 'conv': return 'bg-green-500';
        case 'pool': return 'bg-red-500';
        case 'fc': return 'bg-purple-500';
        default: return 'bg-gray-400';
      }
    };

    const renderFeatureMap = () => {
      if (layer.type === 'fc') {
        return (
          <div className="flex flex-col items-center">
            {Array.from({ length: Math.min(width, 10) }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-2 m-0.5 rounded ${getLayerColor(layer.type)} ${
                  isActive ? 'opacity-100' : 'opacity-30'
                } transition-all duration-500`}
              />
            ))}
          </div>
        );
      }

      const displaySize = Math.min(width, 8);
      return (
        <div className="relative">
          {Array.from({ length: Math.min(depth, 3) }).map((_, d) => (
            <div
              key={d}
              className="grid gap-0.5 mb-1"
              style={{
                gridTemplateColumns: `repeat(${displaySize}, 1fr)`,
                transform: `translateX(${d * 2}px) translateY(${d * -2}px)`,
                zIndex: depth - d,
              }}
            >
              {Array.from({ length: displaySize * displaySize }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 ${getLayerColor(layer.type)} ${
                    isActive ? 'opacity-100' : 'opacity-30'
                  } transition-all duration-500`}
                  style={{
                    animationDelay: isActive ? `${i * 50}ms` : '0ms',
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div key={index} className="flex flex-col items-center mx-4">
        <div className="mb-2">
          {renderFeatureMap()}
        </div>
        <div className="text-center">
          <p className={`font-bold text-sm ${isActive ? 'text-drona-green' : 'text-gray-400'}`}>
            {layer.name}
          </p>
          <p className="text-xs text-gray-500">
            {layer.type === 'fc' ? `${width} neurons` : `${width}×${height}×${depth}`}
          </p>
        </div>
        {index < layers.length - 1 && (
          <div className="flex items-center mt-4">
            <div className={`w-8 h-0.5 ${isActive ? 'bg-drona-green' : 'bg-gray-300'} transition-colors duration-500`} />
            <div className={`w-2 h-2 ${isActive ? 'bg-drona-green' : 'bg-gray-300'} transform rotate-45 -ml-1 transition-colors duration-500`} />
          </div>
        )}
      </div>
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Convolutional Neural Networks</h1>
          <p className="text-lg text-drona-gray">
            Visualize how CNNs process images through convolution, pooling, and fully connected layers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-drona-dark">CNN Architecture Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex flex-wrap justify-center items-center py-8 overflow-x-auto">
                  {layers.map(renderLayer)}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 mb-4">
                <Button
                  onClick={skipToStart}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={togglePlayPause}
                  variant="default"
                  size="sm"
                  className="px-6"
                >
                  {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
                <Button
                  onClick={skipToEnd}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-center items-center gap-4">
                <label className="text-sm font-medium">Speed:</label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="px-3 py-1 border rounded-md"
                >
                  <option value={2000}>0.5x</option>
                  <option value={1000}>1x</option>
                  <option value={500}>2x</option>
                </select>
              </div>

              <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                <h3 className="font-bold text-drona-dark mb-2">Current Layer:</h3>
                <p className="text-drona-gray">
                  {currentStep < layers.length ? (
                    <>
                      <strong>{layers[currentStep].name}</strong> - 
                      {layers[currentStep].type === 'input' && ' Original image data'}
                      {layers[currentStep].type === 'conv' && ' Applies filters to detect features'}
                      {layers[currentStep].type === 'pool' && ' Reduces spatial dimensions'}
                      {layers[currentStep].type === 'fc' && ' Fully connected layer for classification'}
                    </>
                  ) : (
                    'CNN processing complete!'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CNNVisualizer;
