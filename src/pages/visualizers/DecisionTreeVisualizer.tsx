
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(-1);
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
      const newStep = prev + 1;
      if (newStep >= maxSteps) {
        setIsPlaying(false);
        return maxSteps - 1;
      }
      return newStep;
    });
  }, [maxSteps]);

  useEffect(() => {
    const updatedTree = JSON.parse(JSON.stringify(buildTree()));
    const nodes = getAllNodes(updatedTree);
    
    nodes.forEach((node, index) => {
      node.active = index <= currentStep;
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

  const togglePlayPause = () => {
    if (currentStep >= maxSteps - 1) {
      resetVisualization();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const nextStep = () => {
    if (currentStep < maxSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
    setIsPlaying(false);
  };

  const prevStep = () => {
    if (currentStep > -1) {
      setCurrentStep(prev => prev - 1);
    }
    setIsPlaying(false);
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, maxSteps - 1)));
    setIsPlaying(false);
  };

  const skipToStart = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps - 1);
    setIsPlaying(false);
  };

  const resetVisualization = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to build decision tree';
    if (currentStep === 0) return 'Root: Split on Income ≤ $55,000';
    if (currentStep === 1) return 'Left branch: Split on Age ≤ 30';
    if (currentStep === 2) return 'Leaf: Age ≤ 30 → No';
    if (currentStep === 3) return 'Leaf: Age > 30 → Yes';
    if (currentStep === 4) return 'Leaf: Income > $55,000 → Yes';
    return 'Decision tree construction complete!';
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-2 border-drona-green/20">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-xl font-bold text-drona-dark">Playback Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-5 gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToStart}
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
                    className="bg-drona-green hover:bg-drona-green/90 font-semibold"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={nextStep} 
                    disabled={currentStep >= maxSteps - 1}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipToEnd}
                    className="border-2 hover:border-drona-green/50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={resetVisualization} 
                  variant="outline" 
                  disabled={isPlaying}
                  className="w-full border-2 hover:border-drona-green/50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Step: {currentStep + 2} of {maxSteps + 1}
                  </label>
                  <Slider
                    value={[currentStep + 1]}
                    onValueChange={([value]) => goToStep(value - 1)}
                    max={maxSteps}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-drona-dark">
                    Animation Speed: {(2000 / speed).toFixed(1)}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={([value]) => setSpeed(value)}
                    max={2000}
                    min={500}
                    step={250}
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
                <CardTitle className="text-xl font-bold text-drona-dark">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4">
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Nodes Created</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep + 1)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Nodes</p>
                    <p className="text-3xl font-bold text-drona-dark">{maxSteps}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Tree Depth</p>
                    <p className="text-xl font-bold text-drona-dark">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Decision Tree Construction</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <svg width="100%" height="400" viewBox="0 0 500 400" className="border rounded-lg bg-white">
                    {renderNode(tree, 250, 50)}
                  </svg>
                </div>

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Tree Building Process:</h3>
                  <p className="text-sm text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">Sample Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sampleData.map((sample, index) => (
                        <div key={index} className="p-2 bg-white/50 rounded">
                          <div className="text-sm">
                            <strong>Age:</strong> {sample.age} | <strong>Income:</strong> ${sample.income.toLocaleString()} | <strong>Buys:</strong> <span className={sample.buys === 'Yes' ? 'text-green-600' : 'text-red-600'}>{sample.buys}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionTreeVisualizer;
