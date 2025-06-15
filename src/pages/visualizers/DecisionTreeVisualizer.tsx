
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface TreeNode {
  id: number;
  feature: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: string;
  samples: number;
  isLeaf: boolean;
  level: number;
  active: boolean;
}

const DecisionTreeVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sampleData = [
    { age: 25, income: 50000, buys: 'No' },
    { age: 35, income: 80000, buys: 'Yes' },
    { age: 45, income: 60000, buys: 'Yes' },
    { age: 20, income: 30000, buys: 'No' },
    { age: 35, income: 120000, buys: 'Yes' },
  ];

  const buildTree = (): TreeNode => {
    return {
      id: 1,
      feature: 'Income',
      threshold: 55000,
      samples: 100,
      isLeaf: false,
      level: 0,
      active: false,
      left: {
        id: 2,
        feature: 'Age',
        threshold: 30,
        samples: 40,
        isLeaf: false,
        level: 1,
        active: false,
        left: {
          id: 4,
          feature: '',
          prediction: 'No',
          samples: 25,
          isLeaf: true,
          level: 2,
          active: false,
        },
        right: {
          id: 5,
          feature: '',
          prediction: 'Yes',
          samples: 15,
          isLeaf: true,
          level: 2,
          active: false,
        },
      },
      right: {
        id: 3,
        feature: '',
        prediction: 'Yes',
        samples: 60,
        isLeaf: true,
        level: 1,
        active: false,
      },
    };
  };

  const [tree, setTree] = useState<TreeNode>(buildTree());

  const getAllNodes = (node: TreeNode): TreeNode[] => {
    const nodes: TreeNode[] = [node];
    if (node.left) nodes.push(...getAllNodes(node.left));
    if (node.right) nodes.push(...getAllNodes(node.right));
    return nodes;
  };

  const allNodes = getAllNodes(tree);
  const maxSteps = allNodes.length;

  const updateTree = useCallback(() => {
    setCurrentStep(prev => {
      const newStep = (prev + 1) % (maxSteps + 1);
      return newStep;
    });
  }, [maxSteps]);

  useEffect(() => {
    const updatedTree = JSON.parse(JSON.stringify(buildTree()));
    const nodes = getAllNodes(updatedTree);
    
    nodes.forEach((node, index) => {
      node.active = index < currentStep;
    });
    
    setTree(updatedTree);
  }, [currentStep]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateTree, speed);
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
  }, [isPlaying, speed, updateTree]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const skipToStart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps);
    setIsPlaying(false);
  };

  const renderNode = (node: TreeNode | undefined, x: number, y: number): React.ReactNode => {
    if (!node) return null;

    const nodeColor = node.isLeaf 
      ? (node.prediction === 'Yes' ? 'bg-green-500' : 'bg-red-500')
      : 'bg-blue-500';

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r="30"
          className={`${nodeColor} ${node.active ? 'opacity-100' : 'opacity-30'} transition-all duration-500`}
          fill="currentColor"
        />
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          className={`text-xs font-bold fill-white ${node.active ? 'opacity-100' : 'opacity-30'}`}
        >
          {node.isLeaf ? node.prediction : node.feature}
        </text>
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          className={`text-xs fill-white ${node.active ? 'opacity-100' : 'opacity-30'}`}
        >
          {node.isLeaf ? '' : `≤ ${node.threshold}`}
        </text>
        <text
          x={x}
          y={y + 50}
          textAnchor="middle"
          className={`text-xs font-medium ${node.active ? 'text-drona-dark' : 'text-gray-400'}`}
        >
          {node.samples} samples
        </text>

        {/* Left child */}
        {node.left && (
          <>
            <line
              x1={x}
              y1={y + 30}
              x2={x - 100}
              y2={y + 100}
              className={`stroke-2 ${node.active && node.left.active ? 'stroke-drona-green' : 'stroke-gray-300'} transition-colors duration-500`}
            />
            <text
              x={x - 50}
              y={y + 70}
              textAnchor="middle"
              className={`text-xs font-medium ${node.active ? 'text-drona-green' : 'text-gray-400'}`}
            >
              Yes
            </text>
            {renderNode(node.left, x - 100, y + 120)}
          </>
        )}

        {/* Right child */}
        {node.right && (
          <>
            <line
              x1={x}
              y1={y + 30}
              x2={x + 100}
              y2={y + 100}
              className={`stroke-2 ${node.active && node.right.active ? 'stroke-drona-green' : 'stroke-gray-300'} transition-colors duration-500`}
            />
            <text
              x={x + 50}  
              y={y + 70}
              textAnchor="middle"
              className={`text-xs font-medium ${node.active ? 'text-drona-green' : 'text-gray-400'}`}
            >
              No
            </text>
            {renderNode(node.right, x + 100, y + 120)}
          </>
        )}
      </g>
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Decision Trees</h1>
          <p className="text-lg text-drona-gray">
            Visualize how decision trees make predictions through a series of if-else conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-drona-dark">Decision Tree Construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white">
                  {renderNode(tree, 250, 50)}
                </svg>
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
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-drona-dark">Sample Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleData.map((sample, index) => (
                  <div key={index} className="p-2 bg-drona-light/30 rounded">
                    <div className="text-sm">
                      <strong>Age:</strong> {sample.age}<br />
                      <strong>Income:</strong> ${sample.income.toLocaleString()}<br />
                      <strong>Buys:</strong> <span className={sample.buys === 'Yes' ? 'text-green-600' : 'text-red-600'}>{sample.buys}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                <h3 className="font-bold text-drona-dark mb-2">Tree Building Process:</h3>
                <p className="text-sm text-drona-gray">
                  Step {currentStep} of {maxSteps}
                  <br />
                  {currentStep === 0 && 'Ready to build decision tree'}
                  {currentStep === 1 && 'Root: Split on Income ≤ $55,000'}
                  {currentStep === 2 && 'Left branch: Split on Age ≤ 30'}
                  {currentStep === 3 && 'Leaf: Age ≤ 30 → No'}
                  {currentStep === 4 && 'Leaf: Age > 30 → Yes'}
                  {currentStep === 5 && 'Leaf: Income > $55,000 → Yes'}
                  {currentStep > 5 && 'Decision tree construction complete!'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeVisualizer;
