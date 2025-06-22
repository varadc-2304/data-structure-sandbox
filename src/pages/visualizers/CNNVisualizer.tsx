
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, Upload, ChevronsLeft, ChevronsRight, Shuffle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface CNNLayer {
  type: 'input' | 'conv' | 'pool' | 'fc';
  name: string;
  size: { width: number; height: number; depth: number };
  description: string;
  operation: string;
}

interface ProcessingStep {
  layerIndex: number;
  description: string;
  operation: string;
  inputSize: string;
  outputSize: string;
  parameters?: string;
  processingComplete: boolean;
}

const CNNVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const layers: CNNLayer[] = [
    { 
      type: 'input', 
      name: 'Input Image', 
      size: { width: 224, height: 224, depth: 3 }, 
      description: 'RGB image normalized to 224x224 pixels',
      operation: 'Image preprocessing and normalization'
    },
    { 
      type: 'conv', 
      name: 'Conv Layer 1', 
      size: { width: 222, height: 222, depth: 32 }, 
      description: 'First convolutional layer with 32 filters',
      operation: 'Convolution with 3x3 kernels, ReLU activation'
    },
    { 
      type: 'pool', 
      name: 'MaxPool 1', 
      size: { width: 111, height: 111, depth: 32 }, 
      description: 'Max pooling reduces spatial dimensions',
      operation: '2x2 max pooling with stride 2'
    },
    { 
      type: 'conv', 
      name: 'Conv Layer 2', 
      size: { width: 109, height: 109, depth: 64 }, 
      description: 'Second convolutional layer with 64 filters',
      operation: 'Convolution with 3x3 kernels, ReLU activation'
    },
    { 
      type: 'pool', 
      name: 'MaxPool 2', 
      size: { width: 54, height: 54, depth: 64 }, 
      description: 'Second max pooling layer',
      operation: '2x2 max pooling with stride 2'
    },
    { 
      type: 'fc', 
      name: 'Fully Connected 1', 
      size: { width: 128, height: 1, depth: 1 }, 
      description: 'First dense layer with 128 neurons',
      operation: 'Flatten → Dense layer with ReLU activation'
    },
    { 
      type: 'fc', 
      name: 'Output Layer', 
      size: { width: 10, height: 1, depth: 1 }, 
      description: 'Classification output with 10 classes',
      operation: 'Dense layer with Softmax activation'
    },
  ];

  const generateSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate a colorful pattern
    const imageData = ctx.createImageData(224, 224);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 224;
      const y = Math.floor((i / 4) / 224);
      
      // Create a pattern
      const pattern = Math.sin(x / 20) * Math.cos(y / 20);
      const noise = Math.random() * 0.3;
      
      data[i] = Math.floor((pattern + noise + 1) * 127);     // Red
      data[i + 1] = Math.floor((Math.sin(x / 30) + noise + 1) * 127); // Green
      data[i + 2] = Math.floor((Math.cos(y / 25) + noise + 1) * 127); // Blue
      data[i + 3] = 255; // Alpha
    }

    ctx.putImageData(imageData, 0, 0);
    setUploadedImage(canvas.toDataURL());
    resetProcessing();
  };

  const processImageThroughCNN = useCallback((imageSrc: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const images: string[] = [];
      
      layers.forEach((layer, index) => {
        canvas.width = 224;
        canvas.height = 224;
        
        if (index === 0) {
          // Input layer - show original resized image
          ctx.drawImage(img, 0, 0, 224, 224);
        } else if (layer.type === 'conv') {
          // Convolution layers - apply edge detection and feature maps
          ctx.drawImage(img, 0, 0, 224, 224);
          const imageData = ctx.getImageData(0, 0, 224, 224);
          const data = imageData.data;
          
          // Apply convolution-like effect
          for (let y = 1; y < 223; y++) {
            for (let x = 1; x < 223; x++) {
              const idx = (y * 224 + x) * 4;
              
              // Simple edge detection kernel
              const pixel = data[idx];
              const left = data[idx - 4];
              const right = data[idx + 4];
              const top = data[(y - 1) * 224 * 4 + x * 4];
              const bottom = data[(y + 1) * 224 * 4 + x * 4];
              
              const edge = Math.abs(pixel - left) + Math.abs(pixel - right) + 
                          Math.abs(pixel - top) + Math.abs(pixel - bottom);
              
              const intensity = Math.min(255, edge * 2);
              data[idx] = intensity;
              data[idx + 1] = intensity * 0.7;
              data[idx + 2] = intensity * 0.5;
            }
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (layer.type === 'pool') {
          // Pooling layers - show reduced resolution with pooling effect
          const scale = index === 2 ? 0.5 : 0.25;
          const newSize = Math.floor(224 * scale);
          
          // Clear canvas
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, 224, 224);
          
          // Draw pooled version
          ctx.drawImage(img, 0, 0, newSize, newSize);
          
          // Add grid overlay to show pooling regions
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 1;
          const poolSize = Math.floor(224 / newSize);
          for (let i = 0; i <= newSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * poolSize, 0);
            ctx.lineTo(i * poolSize, 224);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * poolSize);
            ctx.lineTo(224, i * poolSize);
            ctx.stroke();
          }
        } else if (layer.type === 'fc') {
          // Fully connected layers - show neural network representation
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(0, 0, 224, 224);
          
          // Draw feature visualization
          const neurons = layer.size.width;
          const cols = Math.ceil(Math.sqrt(neurons));
          const cellSize = 224 / cols;
          
          for (let i = 0; i < Math.min(neurons, cols * cols); i++) {
            const x = (i % cols) * cellSize;
            const y = Math.floor(i / cols) * cellSize;
            
            const activation = Math.random();
            const hue = (i * 137.508) % 360; // Golden angle for color distribution
            
            ctx.fillStyle = `hsl(${hue}, 70%, ${30 + activation * 40}%)`;
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
            
            // Add activation value text
            if (cellSize > 20) {
              ctx.fillStyle = 'white';
              ctx.font = '10px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(activation.toFixed(2), x + cellSize/2, y + cellSize/2);
            }
          }
        }
        
        images.push(canvas.toDataURL());
      });
      
      setProcessedImages(images);
    };
    img.src = imageSrc;
  }, [layers]);

  const generateProcessingSteps = useCallback(() => {
    const steps: ProcessingStep[] = [];
    
    layers.forEach((layer, index) => {
      const prevLayer = index > 0 ? layers[index - 1] : null;
      const inputSize = prevLayer ? `${prevLayer.size.width}×${prevLayer.size.height}×${prevLayer.size.depth}` : 'Original Image';
      const outputSize = `${layer.size.width}×${layer.size.height}×${layer.size.depth}`;
      
      let parameters = '';
      if (layer.type === 'conv') {
        parameters = `Filters: ${layer.size.depth}, Kernel: 3×3, Padding: 0, Stride: 1`;
      } else if (layer.type === 'pool') {
        parameters = `Pool size: 2×2, Stride: 2`;
      } else if (layer.type === 'fc') {
        parameters = `Neurons: ${layer.size.width}`;
      }
      
      steps.push({
        layerIndex: index,
        description: layer.description,
        operation: layer.operation,
        inputSize,
        outputSize,
        parameters,
        processingComplete: false
      });
    });
    
    setProcessingSteps(steps);
  }, [layers]);

  useEffect(() => {
    generateProcessingSteps();
  }, [generateProcessingSteps]);

  useEffect(() => {
    if (uploadedImage && processedImages.length === 0) {
      processImageThroughCNN(uploadedImage);
    }
  }, [uploadedImage, processImageThroughCNN, processedImages.length]);

  useEffect(() => {
    if (!isPlaying || !uploadedImage) return;
    
    if (currentStep >= processingSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, processingSteps.length, speed, uploadedImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setUploadedImage(imageSrc);
        resetProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetProcessing = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setProcessedImages([]);
  };

  const nextStep = () => {
    if (currentStep >= processingSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    setCurrentStep(prev => prev - 1);
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= processingSteps.length) return;
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (!uploadedImage) return;
    
    if (currentStep >= processingSteps.length - 1) {
      resetProcessing();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const renderLayer = (layer: CNNLayer, index: number) => {
    const isActive = index <= currentStep;

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
        const neurons = Math.min(layer.size.width, 10);
        return (
          <div className="flex flex-col items-center">
            {Array.from({ length: neurons }).map((_, i) => {
              const opacity = isActive ? Math.random() * 0.7 + 0.3 : 0.3;
              return (
                <div
                  key={i}
                  className={`w-3 h-2 m-0.5 rounded ${getLayerColor(layer.type)} transition-all duration-500`}
                  style={{ opacity }}
                />
              );
            })}
          </div>
        );
      }

      const displaySize = Math.min(layer.size.width, 6);
      return (
        <div className="relative">
          {Array.from({ length: Math.min(layer.size.depth, 3) }).map((_, d) => (
            <div
              key={d}
              className="grid gap-0.5 mb-1"
              style={{
                gridTemplateColumns: `repeat(${displaySize}, 1fr)`,
                transform: `translateX(${d * 2}px) translateY(${d * -2}px)`,
                zIndex: layer.size.depth - d,
              }}
            >
              {Array.from({ length: displaySize * displaySize }).map((_, i) => {
                const baseIntensity = isActive ? 0.8 : 0.3;
                const randomVariation = isActive ? Math.random() * 0.4 + 0.6 : 1;
                return (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 ${getLayerColor(layer.type)} transition-all duration-500`}
                    style={{
                      opacity: baseIntensity * randomVariation,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div key={index} className="flex flex-col items-center mx-2">
        <div className="mb-2">
          {renderFeatureMap()}
        </div>
        <div className="text-center">
          <p className={`font-bold text-xs ${isActive ? 'text-drona-green' : 'text-gray-400'}`}>
            {layer.name}
          </p>
          <p className="text-xs text-gray-500">
            {layer.type === 'fc' ? `${layer.size.width} neurons` : `${layer.size.width}×${layer.size.height}×${layer.size.depth}`}
          </p>
        </div>
        {index < layers.length - 1 && (
          <div className="flex items-center mt-2">
            <div className={`w-6 h-0.5 ${isActive ? 'bg-drona-green' : 'bg-gray-300'} transition-colors duration-500`} />
            <div className={`w-1.5 h-1.5 ${isActive ? 'bg-drona-green' : 'bg-gray-300'} transform rotate-45 -ml-0.5 transition-colors duration-500`} />
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">CNN Architecture Visualization</h1>
          <p className="text-lg text-drona-gray">
            Explore how Convolutional Neural Networks process images through different layers
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Image Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-drona-dark">Upload Your Image</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border-2 focus:border-drona-green"
                  />
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full font-semibold border-2 hover:border-drona-green/50"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Your Image
                    </Button>
                    
                    <Button 
                      onClick={generateSampleImage}
                      variant="outline"
                      className="w-full font-semibold border-2 hover:border-drona-green/50"
                    >
                      <Shuffle className="mr-2 h-4 w-4" />
                      Generate Sample
                    </Button>
                  </div>
                  
                  {uploadedImage && (
                    <div className="border-2 border-drona-green/20 rounded-lg overflow-hidden">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded image" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 bg-drona-green/5 text-xs text-drona-dark font-medium">
                        Ready for CNN processing
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Processing Speed: {(2000 / speed).toFixed(1)}x
                  </Label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={2000}
                    min={300}
                    step={100}
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
                    onClick={() => goToStep(-1)}
                    disabled={!uploadedImage}
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
                    disabled={!uploadedImage}
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= processingSteps.length - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToStep(processingSteps.length - 1)}
                    disabled={!uploadedImage}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetProcessing} 
                  variant="outline" 
                  disabled={isPlaying}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                {processingSteps.length > 0 && uploadedImage && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-drona-dark">
                      Step: {currentStep + 1} of {processingSteps.length}
                    </Label>
                    <Slider
                      value={[currentStep + 1]}
                      onValueChange={([value]) => goToStep(value - 1)}
                      max={processingSteps.length}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Current Layer Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {currentStep >= 0 && currentStep < processingSteps.length ? (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Layer</p>
                      <p className="text-lg font-bold text-drona-dark">{layers[processingSteps[currentStep].layerIndex].name}</p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Operation</p>
                      <p className="text-sm text-drona-dark">{processingSteps[currentStep].operation}</p>
                    </div>
                    <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                      <p className="text-sm font-semibold text-drona-gray">Input → Output</p>
                      <p className="text-sm text-drona-dark">{processingSteps[currentStep].inputSize} → {processingSteps[currentStep].outputSize}</p>
                    </div>
                    {processingSteps[currentStep].parameters && (
                      <div className="bg-gradient-to-r from-drona-light to-white p-3 rounded-lg border-2 border-drona-green/10">
                        <p className="text-sm font-semibold text-drona-gray">Parameters</p>
                        <p className="text-sm text-drona-dark">{processingSteps[currentStep].parameters}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-drona-gray">
                    <p>Upload an image and start processing to see layer details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">CNN Architecture Flow</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {!uploadedImage ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Upload className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Upload an image to visualize CNN processing</p>
                      <p className="text-sm mt-2">See how your image flows through each layer of the network</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Image Processing Display */}
                    {processedImages.length > 0 && (
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-drona-dark mb-4">Layer Processing Results</h3>
                        <div className="flex justify-center space-x-8">
                          <div>
                            <p className="text-sm font-semibold text-drona-gray mb-2">Original Image</p>
                            <img 
                              src={uploadedImage} 
                              alt="Original" 
                              className="w-48 h-48 object-cover border-2 border-drona-green/20 rounded-lg"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-drona-gray mb-2">
                              {currentStep >= 0 && currentStep < layers.length 
                                ? `${layers[currentStep].name} Output` 
                                : 'Select a layer to see output'}
                            </p>
                            <img 
                              src={currentStep >= 0 && processedImages[currentStep] 
                                ? processedImages[currentStep] 
                                : uploadedImage} 
                              alt="Processed" 
                              className="w-48 h-48 object-cover border-2 border-drona-green/20 rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center items-center py-6 overflow-x-auto">
                      {layers.map(renderLayer)}
                    </div>

                    {currentStep >= 0 && currentStep < processingSteps.length && (
                      <div className="text-center p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-blue-100">
                        <p className="text-lg font-semibold text-drona-dark mb-2">
                          {processingSteps[currentStep].description}
                        </p>
                        <p className="text-sm text-drona-gray">
                          {processingSteps[currentStep].operation}
                        </p>
                      </div>
                    )}
                    
                    {currentStep >= processingSteps.length - 1 && (
                      <div className="text-center p-6 rounded-xl border-2 bg-gradient-to-r from-green-50 to-green-100">
                        <div className="text-green-600 text-xl font-bold">
                          ✅ CNN Processing Complete!
                          <div className="text-sm font-medium text-drona-gray mt-2">
                            Image successfully processed through all {processingSteps.length} layers
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">CNN Layer Operations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li><strong>Input Layer:</strong> Normalizes input image to standard dimensions</li>
                          <li><strong>Convolutional Layers:</strong> Apply filters to detect features like edges and patterns</li>
                          <li><strong>Pooling Layers:</strong> Reduce spatial dimensions while preserving important features</li>
                          <li><strong>Fully Connected:</strong> Transform features into dense representations</li>
                          <li><strong>Output Layer:</strong> Final classification probabilities</li>
                        </ol>
                      </CardContent>
                    </Card>
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

export default CNNVisualizer;
