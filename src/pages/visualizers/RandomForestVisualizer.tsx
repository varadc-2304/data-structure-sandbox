
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { CircuitBoard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataPoint {
  x: number;
  y: number;
  label: number;
}

interface TreeNode {
  feature: number | null;
  threshold: number | null;
  left: TreeNode | null;
  right: TreeNode | null;
  prediction: number | null;
}

interface Tree {
  root: TreeNode;
}

const RandomForestVisualizer = () => {
  const [trees, setTrees] = useState(5);
  const [maxDepth, setMaxDepth] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState<DataPoint[]>([]);
  const [forest, setForest] = useState<Tree[]>([]);
  const [currentTree, setCurrentTree] = useState(0);
  const [gridData, setGridData] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { toast } = useToast();

  // Generate random data points
  const generateData = () => {
    const newData: DataPoint[] = [];
    
    // Generate circle class (0)
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 20;
      newData.push({
        x: 200 + Math.cos(angle) * radius,
        y: 200 + Math.sin(angle) * radius,
        label: 0
      });
    }
    
    // Generate rectangle class (1)
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      
      // If point is outside the circle area with some margin
      if (Math.pow(x - 200, 2) + Math.pow(y - 200, 2) > 110 * 110) {
        newData.push({
          x,
          y,
          label: 1
        });
      }
    }
    
    setData(newData);
    setForest([]);
    setCurrentTree(0);
    initializeGridData();
  };

  // Initialize grid data for visualization
  const initializeGridData = () => {
    const grid: number[][] = [];
    const size = 40; // 40x40 grid for visualization
    
    for (let i = 0; i < size; i++) {
      grid[i] = [];
      for (let j = 0; j < size; j++) {
        grid[i][j] = -1; // -1 means not classified yet
      }
    }
    
    setGridData(grid);
  };

  // Build a decision tree
  const buildDecisionTree = (
    data: DataPoint[],
    depth: number = 0
  ): TreeNode => {
    // If max depth reached or all labels are the same, create a leaf node
    if (
      depth >= maxDepth ||
      data.length === 0 ||
      data.every(point => point.label === data[0].label)
    ) {
      const labels = data.map(point => point.label);
      const labelCounts = labels.reduce((acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);
      
      let maxCount = 0;
      let prediction = 0;
      
      Object.entries(labelCounts).forEach(([label, count]) => {
        if (count > maxCount) {
          maxCount = count;
          prediction = parseInt(label);
        }
      });
      
      return {
        feature: null,
        threshold: null,
        left: null,
        right: null,
        prediction
      };
    }
    
    // Randomly select a feature (0: x, 1: y)
    const feature = Math.floor(Math.random() * 2);
    
    // Random threshold based on feature values
    const values = data.map(point => feature === 0 ? point.x : point.y);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const threshold = min + Math.random() * (max - min);
    
    // Split data
    const leftData = data.filter(point => {
      const value = feature === 0 ? point.x : point.y;
      return value <= threshold;
    });
    
    const rightData = data.filter(point => {
      const value = feature === 0 ? point.x : point.y;
      return value > threshold;
    });
    
    // Create node
    const node: TreeNode = {
      feature,
      threshold,
      left: null,
      right: null,
      prediction: null
    };
    
    // Recursively build left and right branches
    node.left = buildDecisionTree(leftData, depth + 1);
    node.right = buildDecisionTree(rightData, depth + 1);
    
    return node;
  };

  // Predict class using a single tree
  const predictTree = (tree: TreeNode, x: number, y: number): number => {
    if (tree.prediction !== null) {
      return tree.prediction;
    }
    
    const value = tree.feature === 0 ? x : y;
    
    if (value <= tree.threshold!) {
      return predictTree(tree.left!, x, y);
    } else {
      return predictTree(tree.right!, x, y);
    }
  };

  // Predict class using the entire forest
  const predictForest = (forest: Tree[], x: number, y: number): number => {
    // Get predictions from all trees
    const predictions = forest.map(tree => predictTree(tree.root, x, y));
    
    // Count votes for each class
    const votes: Record<number, number> = {};
    predictions.forEach(pred => {
      votes[pred] = (votes[pred] || 0) + 1;
    });
    
    // Find majority class
    let maxVotes = 0;
    let prediction = 0;
    
    Object.entries(votes).forEach(([label, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        prediction = parseInt(label);
      }
    });
    
    return prediction;
  };

  // Update grid data with forest predictions
  const updateGridData = () => {
    if (forest.length === 0) return;
    
    const newGrid = gridData.map((row, i) => {
      return row.map((_, j) => {
        // Convert grid position to canvas coordinates
        const x = j * (400 / gridData.length);
        const y = i * (400 / gridData.length);
        
        // Predict class for this position
        return predictForest(forest, x, y);
      });
    });
    
    setGridData(newGrid);
  };

  // Build a single tree for the forest
  const buildNextTree = () => {
    if (currentTree >= trees) {
      setIsRunning(false);
      updateGridData();
      toast({
        title: "Random Forest Complete",
        description: `Built ${trees} decision trees.`
      });
      return;
    }
    
    // Create a bootstrapped dataset (sampling with replacement)
    const bootstrapData: DataPoint[] = [];
    for (let i = 0; i < data.length; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      bootstrapData.push(data[randomIndex]);
    }
    
    // Build a tree with the bootstrapped data
    const tree: Tree = {
      root: buildDecisionTree(bootstrapData)
    };
    
    // Add tree to forest
    const newForest = [...forest, tree];
    setForest(newForest);
    
    // Update the current tree counter
    setCurrentTree(prev => prev + 1);
    
    // Update grid data with the new forest
    if (newForest.length > 0) {
      const newGrid = gridData.map((row, i) => {
        return row.map((_, j) => {
          const x = j * (400 / gridData.length);
          const y = i * (400 / gridData.length);
          return predictForest(newForest, x, y);
        });
      });
      setGridData(newGrid);
    }
    
    if (isRunning && currentTree < trees - 1) {
      animationRef.current = requestAnimationFrame(buildNextTree);
    } else if (currentTree >= trees - 1) {
      setIsRunning(false);
      toast({
        title: "Random Forest Complete",
        description: `Built ${trees} decision trees.`
      });
    }
  };

  // Toggle visualization state
  const toggleVisualization = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    
    if (newIsRunning) {
      if (forest.length >= trees) {
        // If we already built all trees, reset first
        setForest([]);
        setCurrentTree(0);
      }
      animationRef.current = requestAnimationFrame(buildNextTree);
      toast({
        title: "Building Forest",
        description: "Random forest visualization has started."
      });
    } else {
      cancelAnimationFrame(animationRef.current);
      toast({
        title: "Building Paused",
        description: "Random forest visualization has been paused."
      });
    }
  };

  // Reset visualization
  const handleReset = () => {
    setIsRunning(false);
    cancelAnimationFrame(animationRef.current);
    generateData();
    toast({
      title: "Data Reset",
      description: "New data has been generated for random forest."
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

    // Draw grid data (decision regions)
    if (gridData.length > 0) {
      const cellSize = canvas.width / gridData.length;
      
      for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[i].length; j++) {
          if (gridData[i][j] !== -1) {
            ctx.fillStyle = gridData[i][j] === 0 ? 'rgba(54, 162, 235, 0.2)' : 'rgba(255, 99, 132, 0.2)';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    // Draw data points
    data.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = point.label === 0 ? '#36A2EB' : '#FF6384';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.closePath();
    });

    // Display info
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`Trees built: ${forest.length}/${trees}`, 10, 20);
    ctx.fillText(`Max depth: ${maxDepth}`, 10, 45);
  };

  // Initialize data on component mount
  useEffect(() => {
    generateData();
  }, []);

  // Update visualization when data changes
  useEffect(() => {
    drawVisualization();
  }, [data, forest, gridData]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Reset when parameters change
  useEffect(() => {
    if (!isRunning) {
      setForest([]);
      setCurrentTree(0);
      initializeGridData();
    }
  }, [trees, maxDepth]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-drona-dark mb-2">Random Forest Classifier</h1>
          <p className="text-drona-gray">
            Understand how random forest classifiers work with visual representations of decision trees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 p-6 shadow-md">
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <CircuitBoard className="mr-2 h-5 w-5 text-drona-green" />
              Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Number of Trees: {trees}</label>
                <Slider 
                  value={[trees]} 
                  min={1} 
                  max={20} 
                  step={1} 
                  onValueChange={values => setTrees(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Max Tree Depth: {maxDepth}</label>
                <Slider 
                  value={[maxDepth]} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={values => setMaxDepth(values[0])}
                  className="my-4"
                  disabled={isRunning}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={toggleVisualization} 
                  className="bg-drona-green hover:bg-drona-green/90"
                >
                  {isRunning ? 'Stop Visualization' : 'Start Visualization'}
                </Button>
                <Button onClick={handleReset} variant="outline">Generate New Data</Button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-drona-gray">
                  Trees built: {forest.length}/{trees}
                </p>
                <p className="text-sm text-drona-gray mt-2">
                  Blue points represent class 0 (circle), red points represent class 1 (other regions).
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

export default RandomForestVisualizer;
