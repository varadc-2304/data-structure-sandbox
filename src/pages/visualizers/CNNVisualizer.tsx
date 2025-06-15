import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, Upload, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  imageToArray, 
  applyConvolution, 
  applyMaxPooling, 
  flattenToFC, 
  applyDenseLayer, 
  applySoftmax,
  featureMapToCanvas,
  createOriginalImageCanvas,
  analyzeImageFeatures,
  classifyBasedOnFeatures,
  EDGE_DETECTION_KERNELS,
  FEATURE_KERNELS,
  type FeatureMap 
} from '@/utils/cnnProcessor';

interface CNNLayer {
  type: 'input' | 'conv' | 'pool' | 'fc';
  name: string;
  size: { width: number; height: number; depth: number };
  description: string;
  operation: string;
  featureMap?: FeatureMap;
  fcData?: number[];
  canvas?: HTMLCanvasElement;
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
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [processedLayers, setProcessedLayers] = useState<CNNLayer[]>([]);
  const [currentFeatureMap, setCurrentFeatureMap] = useState<HTMLCanvasElement | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [classificationResult, setClassificationResult] = useState<{ class: string; confidence: number }[]>([]);
  const [originalImageCanvas, setOriginalImageCanvas] = useState<HTMLCanvasElement | null>(null);
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
      size: { width: 222, height: 222, depth: 4 }, 
      description: 'First convolutional layer with edge detection filters',
      operation: 'Convolution with 3x3 kernels, ReLU activation'
    },
    { 
      type: 'pool', 
      name: 'MaxPool 1', 
      size: { width: 111, height: 111, depth: 4 }, 
      description: 'Max pooling reduces spatial dimensions',
      operation: '2x2 max pooling with stride 2'
    },
    { 
      type: 'conv', 
      name: 'Conv Layer 2', 
      size: { width: 109, height: 109, depth: 4 }, 
      description: 'Second convolutional layer with feature detection',
      operation: 'Convolution with 3x3 kernels, ReLU activation'
    },
    { 
      type: 'pool', 
      name: 'MaxPool 2', 
      size: { width: 54, height: 54, depth: 4 }, 
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

  const CLASS_NAMES = [
    'Airplane', 'Automobile', 'Bird', 'Cat', 'Deer',
    'Dog', 'Frog', 'Horse', 'Ship', 'Truck'
  ];

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
  }, []);

  const processImageThroughCNN = useCallback(async (imgElement: HTMLImageElement) => {
    if (!imgElement) return;

    console.log('Starting CNN processing on uploaded image...');
    const newProcessedLayers: CNNLayer[] = [...layers];
    
    // Create original image canvas
    const originalCanvas = createOriginalImageCanvas(imgElement);
    setOriginalImageCanvas(originalCanvas);
    
    try {
      // Convert image to array
      setProcessingProgress('Converting uploaded image to array...');
      const inputArray = imageToArray(imgElement, 224);
      console.log('Image converted to array:', inputArray.length, 'x', inputArray[0].length, 'x', inputArray[0][0].length);

      let currentData: any = inputArray;
      let edgeFeatures: FeatureMap | null = null;
      let detailedFeatures: FeatureMap | null = null;
      
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        console.log(`Processing layer ${i}: ${layer.name} on actual image`);
        setProcessingProgress(`Applying ${layer.name} to your image...`);
        
        if (layer.type === 'input') {
          // Input layer - store original image data
          newProcessedLayers[i] = {
            ...layer,
            featureMap: {
              data: currentData,
              width: 224,
              height: 224,
              depth: 3
            },
            canvas: originalCanvas
          };
        } else if (layer.type === 'conv') {
          // Convolutional layer - apply real convolution on the image
          const kernels = i === 1 ? EDGE_DETECTION_KERNELS : FEATURE_KERNELS;
          const featureMap = applyConvolution(currentData, kernels, 1, 0);
          console.log('Conv output size:', featureMap.width, 'x', featureMap.height, 'x', featureMap.depth);
          
          // Store feature maps for analysis
          if (i === 1) {
            edgeFeatures = featureMap;
          } else if (i === 3) {
            detailedFeatures = featureMap;
          }
          
          newProcessedLayers[i] = {
            ...layer,
            featureMap,
            canvas: featureMapToCanvas(featureMap, 0)
          };
          currentData = featureMap;
        } else if (layer.type === 'pool') {
          // Pooling layer - apply max pooling
          const pooledMap = applyMaxPooling(currentData, 2, 2);
          console.log('Pool output size:', pooledMap.width, 'x', pooledMap.height, 'x', pooledMap.depth);
          
          newProcessedLayers[i] = {
            ...layer,
            featureMap: pooledMap,
            canvas: featureMapToCanvas(pooledMap, 0)
          };
          currentData = pooledMap;
        } else if (layer.type === 'fc') {
          // Fully connected layer
          if (i === 5) { // First FC layer
            const flattened = flattenToFC(currentData);
            console.log('Flattened size:', flattened.length);
            const fcOutput = applyDenseLayer(flattened, 128);
            console.log('FC1 output size:', fcOutput.length);
            
            newProcessedLayers[i] = {
              ...layer,
              fcData: fcOutput
            };
            currentData = fcOutput;
          } else { // Output layer - use feature-based classification
            console.log('Analyzing image features for classification...');
            
            if (edgeFeatures && detailedFeatures) {
              // Analyze extracted features
              const imageFeatures = analyzeImageFeatures(inputArray, edgeFeatures, detailedFeatures);
              console.log('Extracted image features:', imageFeatures);
              
              // Classify based on actual features
              const classificationScores = classifyBasedOnFeatures(imageFeatures);
              const softmaxOutput = applySoftmax(classificationScores);
              console.log('Feature-based classification output for your image:', softmaxOutput);
              
              newProcessedLayers[i] = {
                ...layer,
                fcData: softmaxOutput
              };
              
              // Generate classification results
              const results = softmaxOutput.map((confidence, index) => ({
                class: CLASS_NAMES[index],
                confidence: confidence * 100
              })).sort((a, b) => b.confidence - a.confidence).slice(0, 3);
              
              console.log('Top 3 predictions based on image analysis:', results);
              setClassificationResult(results);
            } else {
              // Fallback to simple dense layer if features not available
              const fcOutput = applyDenseLayer(currentData, 10);
              const softmaxOutput = applySoftmax(fcOutput);
              
              newProcessedLayers[i] = {
                ...layer,
                fcData: softmaxOutput
              };
              
              const results = softmaxOutput.map((confidence, index) => ({
                class: CLASS_NAMES[index],
                confidence: confidence * 100
              })).sort((a, b) => b.confidence - a.confidence).slice(0, 3);
              
              setClassificationResult(results);
            }
          }
        }
        
        // Small delay to show processing
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setProcessedLayers(newProcessedLayers);
      setProcessingProgress('CNN processing complete with feature-based classification!');
      console.log('CNN processing completed on uploaded image with intelligent classification');
      
    } catch (error) {
      console.error('Error processing uploaded image:', error);
      setProcessingProgress('Error during image processing');
    }
  }, []);

  useEffect(() => {
    generateProcessingSteps();
  }, [generateProcessingSteps]);

  useEffect(() => {
    if (!isPlaying || !uploadedImage || !imageElement) return;
    
    if (currentStep >= processingSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      nextStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, processingSteps.length, speed, uploadedImage, imageElement]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setUploadedImage(imageSrc);
        
        // Create image element for processing
        const img = new Image();
        img.onload = () => {
          setImageElement(img);
          processImageThroughCNN(img);
        };
        img.src = imageSrc;
        
        resetProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const resetProcessing = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setCurrentFeatureMap(null);
    setClassificationResult([]);
  };

  const nextStep = () => {
    if (currentStep >= processingSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const newStep = currentStep + 1;
    setCurrentStep(newStep);
    
    // Update current feature map display
    if (newStep < processedLayers.length && processedLayers[newStep]) {
      const layer = processedLayers[newStep];
      if (layer.canvas) {
        setCurrentFeatureMap(layer.canvas);
      }
    }
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    // Update current feature map display
    if (newStep >= 0 && newStep < processedLayers.length && processedLayers[newStep]) {
      const layer = processedLayers[newStep];
      if (layer.canvas) {
        setCurrentFeatureMap(layer.canvas);
      }
    } else {
      setCurrentFeatureMap(null);
    }
  };

  const goToStep = (step: number) => {
    if (step < -1 || step >= processingSteps.length) return;
    setCurrentStep(step);
    setIsPlaying(false);
    
    // Update current feature map display
    if (step >= 0 && step < processedLayers.length && processedLayers[step]) {
      const layer = processedLayers[step];
      if (layer.canvas) {
        setCurrentFeatureMap(layer.canvas);
      }
    } else {
      setCurrentFeatureMap(null);
    }
  };

  const togglePlayPause = () => {
    if (!uploadedImage || !imageElement) return;
    
    if (currentStep >= processingSteps.length - 1) {
      resetProcessing();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const renderLayer = (layer: CNNLayer, index: number) => {
    const isActive = index <= currentStep;
    const processedLayer = processedLayers[index];

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
        const neurons = processedLayer?.fcData ? Math.min(processedLayer.fcData.length, 10) : Math.min(layer.size.width, 10);
        return (
          <div className="flex flex-col items-center">
            {Array.from({ length: neurons }).map((_, i) => {
              const activation = processedLayer?.fcData?.[i] || 0;
              const opacity = isActive ? Math.max(0.3, Math.min(1, activation * 2)) : 0.3;
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
                      animationDelay: isActive ? `${i * 50}ms` : '0ms',
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Real-Time CNN Image Processing</h1>
          <p className="text-lg text-drona-gray">
            Upload any image and watch real CNN operations with intelligent feature-based classification
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
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full font-semibold border-2 hover:border-drona-green/50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Your Image
                  </Button>
                  
                  {uploadedImage && (
                    <div className="border-2 border-drona-green/20 rounded-lg overflow-hidden">
                      <img 
                        src={uploadedImage} 
                        alt="Your uploaded image" 
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2 bg-drona-green/5 text-xs text-drona-dark font-medium">
                        CNN will analyze this image intelligently
                      </div>
                    </div>
                  )}

                  {processingProgress && (
                    <div className="text-sm text-drona-green font-medium bg-green-50 p-2 rounded">
                      {processingProgress}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-drona-dark">
                    Processing Speed: {(10 - (speed / 200)).toFixed(1)}x
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

            {classificationResult.length > 0 && (
              <Card className="shadow-lg border-2 border-drona-green/20">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="text-xl font-bold text-drona-dark">Intelligent Classification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div className="text-sm text-drona-gray font-medium mb-2">
                    CNN prediction based on extracted image features:
                  </div>
                  {classificationResult.map((result, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="font-medium text-drona-dark">{result.class}</span>
                      <span className="text-drona-green font-bold">{result.confidence.toFixed(1)}%</span>
                    </div>
                  ))}
                  <div className="text-xs text-drona-gray mt-2 p-2 bg-blue-50 rounded">
                    ✨ This prediction analyzes actual image features: colors, edges, textures, and patterns
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Visualization Panel */}
          <div className="xl:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">CNN Processing Your Image</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {!uploadedImage ? (
                  <div className="flex items-center justify-center h-64 text-drona-gray">
                    <div className="text-center">
                      <Upload className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p className="text-xl font-semibold">Upload your image to see intelligent CNN processing</p>
                      <p className="text-sm mt-2">Watch how CNN algorithms analyze your actual image features</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-wrap justify-center items-center py-6 overflow-x-auto">
                      {layers.map(renderLayer)}
                    </div>

                    {currentFeatureMap && (
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-drona-dark mb-4">
                          {currentStep >= 0 ? `${layers[currentStep].name} Output` : 'Feature Map'}
                        </h3>
                        <div className="inline-block border-2 border-drona-green/20 rounded-lg overflow-hidden bg-white">
                          <canvas 
                            ref={(canvas) => {
                              if (canvas && currentFeatureMap) {
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                  const scale = Math.min(300 / currentFeatureMap.width, 300 / currentFeatureMap.height);
                                  canvas.width = currentFeatureMap.width * scale;
                                  canvas.height = currentFeatureMap.height * scale;
                                  ctx.imageSmoothingEnabled = false;
                                  ctx.drawImage(currentFeatureMap, 0, 0, canvas.width, canvas.height);
                                }
                              }
                            }}
                            className="max-w-xs max-h-64"
                          />
                          <div className="p-2 bg-drona-green/5 text-xs font-medium">
                            {currentStep >= 0 ? `Processing result from ${layers[currentStep].name}` : 'CNN Feature Map'}
                          </div>
                        </div>
                      </div>
                    )}

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
                            Image successfully processed through all {processingSteps.length} layers with real convolution operations
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Card className="bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-drona-dark">Intelligent CNN Operations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-drona-gray font-medium">
                          <li><strong>Input Processing:</strong> Your uploaded image converted to 224×224×3 array</li>
                          <li><strong>Edge Detection:</strong> Real convolution kernels extract edges and boundaries</li>
                          <li><strong>Feature Extraction:</strong> Advanced kernels detect textures and patterns</li>
                          <li><strong>Pooling:</strong> Max pooling reduces dimensions while preserving features</li>
                          <li><strong>Feature Analysis:</strong> Intelligent analysis of colors, brightness, and complexity</li>
                          <li><strong>Smart Classification:</strong> Prediction based on actual extracted features</li>
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
