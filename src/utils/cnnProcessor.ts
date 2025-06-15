
// Simple CNN processing utilities for real-time image processing
export interface FeatureMap {
  data: number[][][];
  width: number;
  height: number;
  depth: number;
}

export interface ConvolutionKernel {
  weights: number[][];
  bias: number;
}

// Simple kernels for edge detection and feature extraction
export const EDGE_DETECTION_KERNELS: ConvolutionKernel[] = [
  { weights: [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]], bias: 0 }, // Edge detection
  { weights: [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]], bias: 0 }, // Vertical edge
  { weights: [[-1, -2, -1], [0, 0, 0], [1, 2, 1]], bias: 0 }, // Horizontal edge
  { weights: [[0, -1, 0], [-1, 5, -1], [0, -1, 0]], bias: 0 }, // Sharpen
];

export const FEATURE_KERNELS: ConvolutionKernel[] = [
  { weights: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], bias: 0 }, // Blur
  { weights: [[0, 1, 0], [1, -4, 1], [0, 1, 0]], bias: 0 }, // Laplacian
  { weights: [[1, -1, 1], [-1, 5, -1], [1, -1, 1]], bias: 0 }, // Enhanced edge
  { weights: [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]], bias: 0 }, // Emboss
];

export function imageToArray(imageElement: HTMLImageElement, targetSize: number = 224): number[][][] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = targetSize;
  canvas.height = targetSize;
  ctx.drawImage(imageElement, 0, 0, targetSize, targetSize);

  const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
  const data = imageData.data;

  // Convert to RGB array [height][width][channels]
  const result: number[][][] = Array(targetSize).fill(0).map(() => 
    Array(targetSize).fill(0).map(() => Array(3).fill(0))
  );

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const idx = (y * targetSize + x) * 4;
      result[y][x][0] = data[idx] / 255.0;     // R
      result[y][x][1] = data[idx + 1] / 255.0; // G
      result[y][x][2] = data[idx + 2] / 255.0; // B
    }
  }

  return result;
}

export function applyConvolution(
  input: number[][][], 
  kernels: ConvolutionKernel[], 
  stride: number = 1,
  padding: number = 0
): FeatureMap {
  const inputHeight = input.length;
  const inputWidth = input[0].length;
  const inputChannels = input[0][0].length;
  const kernelSize = kernels[0].weights.length;
  
  const outputHeight = Math.floor((inputHeight + 2 * padding - kernelSize) / stride) + 1;
  const outputWidth = Math.floor((inputWidth + 2 * padding - kernelSize) / stride) + 1;
  const outputDepth = kernels.length;

  const output: number[][][] = Array(outputHeight).fill(0).map(() =>
    Array(outputWidth).fill(0).map(() => Array(outputDepth).fill(0))
  );

  for (let d = 0; d < outputDepth; d++) {
    const kernel = kernels[d];
    for (let y = 0; y < outputHeight; y++) {
      for (let x = 0; x < outputWidth; x++) {
        let sum = 0;
        
        // Apply convolution
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const inputY = y * stride - padding + ky;
            const inputX = x * stride - padding + kx;
            
            if (inputY >= 0 && inputY < inputHeight && inputX >= 0 && inputX < inputWidth) {
              // Average across input channels for simplicity
              const pixelValue = (input[inputY][inputX][0] + input[inputY][inputX][1] + input[inputY][inputX][2]) / 3;
              sum += pixelValue * kernel.weights[ky][kx];
            }
          }
        }
        
        // Apply ReLU activation and bias
        output[y][x][d] = Math.max(0, sum + kernel.bias);
      }
    }
  }

  return {
    data: output,
    width: outputWidth,
    height: outputHeight,
    depth: outputDepth
  };
}

export function applyMaxPooling(input: FeatureMap, poolSize: number = 2, stride: number = 2): FeatureMap {
  const outputHeight = Math.floor((input.height - poolSize) / stride) + 1;
  const outputWidth = Math.floor((input.width - poolSize) / stride) + 1;

  const output: number[][][] = Array(outputHeight).fill(0).map(() =>
    Array(outputWidth).fill(0).map(() => Array(input.depth).fill(0))
  );

  for (let d = 0; d < input.depth; d++) {
    for (let y = 0; y < outputHeight; y++) {
      for (let x = 0; x < outputWidth; x++) {
        let maxVal = -Infinity;
        
        for (let py = 0; py < poolSize; py++) {
          for (let px = 0; px < poolSize; px++) {
            const inputY = y * stride + py;
            const inputX = x * stride + px;
            
            if (inputY < input.height && inputX < input.width) {
              maxVal = Math.max(maxVal, input.data[inputY][inputX][d]);
            }
          }
        }
        
        output[y][x][d] = maxVal;
      }
    }
  }

  return {
    data: output,
    width: outputWidth,
    height: outputHeight,
    depth: input.depth
  };
}

export function flattenToFC(input: FeatureMap): number[] {
  const flattened: number[] = [];
  
  for (let d = 0; d < input.depth; d++) {
    for (let y = 0; y < input.height; y++) {
      for (let x = 0; x < input.width; x++) {
        flattened.push(input.data[y][x][d]);
      }
    }
  }
  
  return flattened;
}

export function applyDenseLayer(input: number[], outputSize: number): number[] {
  // Simple random weights for demonstration
  const weights = Array(outputSize).fill(0).map(() => 
    Array(input.length).fill(0).map(() => (Math.random() - 0.5) * 0.1)
  );
  
  const output = Array(outputSize).fill(0);
  
  for (let i = 0; i < outputSize; i++) {
    let sum = 0;
    for (let j = 0; j < input.length; j++) {
      sum += input[j] * weights[i][j];
    }
    output[i] = Math.max(0, sum); // ReLU
  }
  
  return output;
}

export function applySoftmax(input: number[]): number[] {
  const max = Math.max(...input);
  const exp = input.map(x => Math.exp(x - max));
  const sum = exp.reduce((a, b) => a + b, 0);
  return exp.map(x => x / sum);
}

export function featureMapToCanvas(featureMap: FeatureMap, channelIndex: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = featureMap.width;
  canvas.height = featureMap.height;

  const imageData = ctx.createImageData(featureMap.width, featureMap.height);
  const data = imageData.data;

  // Normalize values to 0-255 range
  let minVal = Infinity;
  let maxVal = -Infinity;
  
  for (let y = 0; y < featureMap.height; y++) {
    for (let x = 0; x < featureMap.width; x++) {
      const val = featureMap.data[y][x][channelIndex];
      minVal = Math.min(minVal, val);
      maxVal = Math.max(maxVal, val);
    }
  }

  const range = maxVal - minVal || 1;

  for (let y = 0; y < featureMap.height; y++) {
    for (let x = 0; x < featureMap.width; x++) {
      const idx = (y * featureMap.width + x) * 4;
      const normalizedVal = Math.floor(((featureMap.data[y][x][channelIndex] - minVal) / range) * 255);
      
      data[idx] = normalizedVal;     // R
      data[idx + 1] = normalizedVal; // G
      data[idx + 2] = normalizedVal; // B
      data[idx + 3] = 255;           // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
