
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

interface TreeVote {
  treeId: number;
  prediction: 'Yes' | 'No';
  confidence: number;
  active: boolean;
}

const RandomForestVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const trees: TreeVote[] = [
    { treeId: 1, prediction: 'Yes', confidence: 0.8, active: false },
    { treeId: 2, prediction: 'No', confidence: 0.6, active: false },
    { treeId: 3, prediction: 'Yes', confidence: 0.9, active: false },
    { treeId: 4, prediction: 'Yes', confidence: 0.7, active: false },
    { treeId: 5, prediction: 'No', confidence: 0.5, active: false },
  ];

  const maxSteps = trees.length + 1; // +1 for final voting step

  const updateForest = useCallback(() => {
    setCurrentStep(prev => {
      const newStep = (prev + 1) % (maxSteps + 1);
      return newStep;
    });
  }, [maxSteps]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(updateForest, speed);
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
  }, [isPlaying, speed, updateForest]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const skipToStart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    setCurrentStep(maxSteps);
    setIsPlaying(false);
  };

  const getActiveTrees = () => {
    return trees.map((tree, index) => ({
      ...tree,
      active: index < currentStep
    }));
  };

  const getFinalPrediction = () => {
    const activeTrees = getActiveTrees().filter(tree => tree.active);
    const yesVotes = activeTrees.filter(tree => tree.prediction === 'Yes').length;
    const noVotes = activeTrees.filter(tree => tree.prediction === 'No').length;
    
    if (yesVotes > noVotes) return 'Yes';
    if (noVotes > yesVotes) return 'No';
    return 'Tie';
  };

  const renderTree = (tree: TreeVote) => {
    const isActive = tree.active;
    const predictionColor = tree.prediction === 'Yes' ? 'text-green-600' : 'text-red-600';
    const bgColor = tree.prediction === 'Yes' ? 'bg-green-100' : 'bg-red-100';

    return (
      <div
        key={tree.treeId}
        className={`p-4 rounded-lg border-2 transition-all duration-500 ${
          isActive 
            ? `${bgColor} border-drona-green shadow-lg transform scale-105` 
            : 'bg-gray-100 border-gray-300 opacity-50'
        }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white border-2 border-drona-green flex items-center justify-center">
            <span className="text-sm font-bold text-drona-dark">T{tree.treeId}</span>
          </div>
          <h3 className="font-bold text-drona-dark mb-1">Tree {tree.treeId}</h3>
          <p className={`font-bold ${predictionColor} text-lg`}>
            {isActive ? tree.prediction : '?'}
          </p>
          <p className="text-xs text-gray-600">
            {isActive ? `Confidence: ${(tree.confidence * 100).toFixed(0)}%` : 'Processing...'}
          </p>
        </div>
      </div>
    );
  };

  const renderVotingResults = () => {
    const activeTrees = getActiveTrees().filter(tree => tree.active);
    const yesVotes = activeTrees.filter(tree => tree.prediction === 'Yes').length;
    const noVotes = activeTrees.filter(tree => tree.prediction === 'No').length;
    const finalPrediction = getFinalPrediction();

    return (
      <div className="mt-6 p-6 bg-drona-light/30 rounded-lg">
        <h3 className="font-bold text-drona-dark mb-4 text-center">Voting Results</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <h4 className="font-bold text-green-600">Yes Votes</h4>
            <p className="text-2xl font-bold text-green-800">{yesVotes}</p>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <h4 className="font-bold text-red-600">No Votes</h4>
            <p className="text-2xl font-bold text-red-800">{noVotes}</p>
          </div>
        </div>
        {currentStep >= maxSteps && (
          <div className="text-center p-4 bg-drona-green/20 rounded-lg">
            <h4 className="font-bold text-drona-dark">Final Prediction</h4>
            <p className={`text-3xl font-bold ${
              finalPrediction === 'Yes' ? 'text-green-600' : 
              finalPrediction === 'No' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {finalPrediction}
            </p>
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
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Random Forests</h1>
          <p className="text-lg text-drona-gray">
            Visualize how multiple decision trees vote together to make more accurate predictions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-drona-dark">Random Forest Ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {getActiveTrees().map(renderTree)}
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

              <div className="flex justify-center items-center gap-4 mb-6">
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

              {renderVotingResults()}

              <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                <h3 className="font-bold text-drona-dark mb-2">Process Step:</h3>
                <p className="text-drona-gray">
                  {currentStep === 0 && 'Ready to process sample through Random Forest'}
                  {currentStep > 0 && currentStep <= trees.length && 
                    `Tree ${currentStep} has made its prediction`}
                  {currentStep > trees.length && 'All trees have voted - calculating final prediction'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-drona-dark">How Random Forest Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-drona-gray">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-drona-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <p><strong>Bootstrap Sampling:</strong> Each tree is trained on a different random sample of the data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-drona-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <p><strong>Feature Randomization:</strong> Each tree uses a random subset of features at each split</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-drona-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <p><strong>Independent Predictions:</strong> Each tree makes its own prediction independently</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-drona-green text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                  <p><strong>Majority Voting:</strong> The final prediction is determined by majority vote</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RandomForestVisualizer;
