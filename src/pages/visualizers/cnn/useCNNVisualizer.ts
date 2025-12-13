import { useState, useCallback, useRef, useEffect } from "react";

export interface CNNLayer {
  type: "input" | "conv" | "pool" | "fc";
  name: string;
  size: { width: number; height: number; depth: number };
  description: string;
  operation: string;
}

export interface ProcessingStep {
  layerIndex: number;
  description: string;
  operation: string;
  inputSize: string;
  outputSize: string;
  parameters?: string;
  processingComplete: boolean;
}

export const layers: CNNLayer[] = [
  { type: "input", name: "Input Image", size: { width: 224, height: 224, depth: 3 }, description: "RGB image normalized to 224x224 pixels", operation: "Image preprocessing and normalization" },
  { type: "conv", name: "Conv Layer 1", size: { width: 222, height: 222, depth: 32 }, description: "First convolutional layer with 32 filters", operation: "Convolution with 3x3 kernels, ReLU activation" },
  { type: "pool", name: "MaxPool 1", size: { width: 111, height: 111, depth: 32 }, description: "Max pooling reduces spatial dimensions", operation: "2x2 max pooling with stride 2" },
  { type: "conv", name: "Conv Layer 2", size: { width: 109, height: 109, depth: 64 }, description: "Second convolutional layer with 64 filters", operation: "Convolution with 3x3 kernels, ReLU activation" },
  { type: "pool", name: "MaxPool 2", size: { width: 54, height: 54, depth: 64 }, description: "Second max pooling layer", operation: "2x2 max pooling with stride 2" },
  { type: "fc", name: "Fully Connected 1", size: { width: 128, height: 1, depth: 1 }, description: "First dense layer with 128 neurons", operation: "Flatten → Dense layer with ReLU activation" },
  { type: "fc", name: "Output Layer", size: { width: 10, height: 1, depth: 1 }, description: "Classification output with 10 classes", operation: "Dense layer with Softmax activation" },
];

export const useCNNVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1000);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [processedImages, setProcessedImages] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSampleImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(224, 224);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 224;
      const y = Math.floor((i / 4) / 224);
      const pattern = Math.sin(x / 20) * Math.cos(y / 20);
      const noise = Math.random() * 0.3;
      data[i] = Math.floor((pattern + noise + 1) * 127);
      data[i + 1] = Math.floor((Math.sin(x / 30) + noise + 1) * 127);
      data[i + 2] = Math.floor((Math.cos(y / 25) + noise + 1) * 127);
      data[i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
    setUploadedImage(canvas.toDataURL());
    resetProcessing();
  };

  const processImageThroughCNN = useCallback((imageSrc: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const images: string[] = [];

      layers.forEach((layer, index) => {
        canvas.width = 224;
        canvas.height = 224;

        if (index === 0) {
          ctx.drawImage(img, 0, 0, 224, 224);
        } else if (layer.type === "conv") {
          ctx.drawImage(img, 0, 0, 224, 224);
          const imageData = ctx.getImageData(0, 0, 224, 224);
          const data = imageData.data;

          for (let y = 1; y < 223; y++) {
            for (let x = 1; x < 223; x++) {
              const idx = (y * 224 + x) * 4;
              const pixel = data[idx];
              const left = data[idx - 4];
              const right = data[idx + 4];
              const top = data[(y - 1) * 224 * 4 + x * 4];
              const bottom = data[(y + 1) * 224 * 4 + x * 4];
              const edge = Math.abs(pixel - left) + Math.abs(pixel - right) + Math.abs(pixel - top) + Math.abs(pixel - bottom);
              const intensity = Math.min(255, edge * 2);
              data[idx] = intensity;
              data[idx + 1] = intensity * 0.7;
              data[idx + 2] = intensity * 0.5;
            }
          }
          ctx.putImageData(imageData, 0, 0);
        } else if (layer.type === "pool") {
          const scale = index === 2 ? 0.5 : 0.25;
          const newSize = Math.floor(224 * scale);
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, 224, 224);
          ctx.drawImage(img, 0, 0, newSize, newSize);
          ctx.strokeStyle = "#00ff00";
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
        } else if (layer.type === "fc") {
          ctx.fillStyle = "#1a1a1a";
          ctx.fillRect(0, 0, 224, 224);
          const neurons = layer.size.width;
          const cols = Math.ceil(Math.sqrt(neurons));
          const cellSize = 224 / cols;

          for (let i = 0; i < Math.min(neurons, cols * cols); i++) {
            const x = (i % cols) * cellSize;
            const y = Math.floor(i / cols) * cellSize;
            const activation = Math.random();
            const hue = (i * 137.508) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, ${30 + activation * 40}%)`;
            ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
            if (cellSize > 20) {
              ctx.fillStyle = "white";
              ctx.font = "10px Arial";
              ctx.textAlign = "center";
              ctx.fillText(activation.toFixed(2), x + cellSize / 2, y + cellSize / 2);
            }
          }
        }

        images.push(canvas.toDataURL());
      });

      setProcessedImages(images);
    };
    img.src = imageSrc;
  }, []);

  const generateProcessingSteps = useCallback(() => {
    const steps: ProcessingStep[] = [];

    layers.forEach((layer, index) => {
      const prevLayer = index > 0 ? layers[index - 1] : null;
      const inputSize = prevLayer ? `${prevLayer.size.width}×${prevLayer.size.height}×${prevLayer.size.depth}` : "Original Image";
      const outputSize = `${layer.size.width}×${layer.size.height}×${layer.size.depth}`;

      let parameters = "";
      if (layer.type === "conv") {
        parameters = `Filters: ${layer.size.depth}, Kernel: 3×3, Padding: 0, Stride: 1`;
      } else if (layer.type === "pool") {
        parameters = `Pool size: 2×2, Stride: 2`;
      } else if (layer.type === "fc") {
        parameters = `Neurons: ${layer.size.width}`;
      }

      steps.push({
        layerIndex: index,
        description: layer.description,
        operation: layer.operation,
        inputSize,
        outputSize,
        parameters,
        processingComplete: false,
      });
    });

    setProcessingSteps(steps);
  }, []);

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
    if (file && file.type.startsWith("image/")) {
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
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep <= -1) return;
    setCurrentStep((prev) => prev - 1);
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

  return {
    state: {
      isPlaying,
      currentStep,
      speed,
      uploadedImage,
      processingSteps,
      processedImages,
      fileInputRef,
    },
    actions: {
      setSpeed,
      generateSampleImage,
      handleImageUpload,
      resetProcessing,
      nextStep,
      prevStep,
      goToStep,
      togglePlayPause,
    },
  };
};
