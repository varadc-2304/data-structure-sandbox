
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, SkipBack, Play, Pause, SkipForward, RotateCcw, ChevronsLeft, ChevronsRight } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(-1);
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
      const newStep = prev + 1;
      if (newStep >= maxSteps) {
        setIsPlaying(false);
        return maxSteps - 1;
      }
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

  const getStepDescription = () => {
    if (currentStep === -1) return 'Ready to process sample through Random Forest';
    if (currentStep < trees.length) return `Tree ${currentStep + 1} has made its prediction`;
    return 'All trees have voted - calculating final prediction';
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
        {currentStep >= maxSteps - 1 && (
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
                    <p className="text-sm font-semibold text-drona-gray">Trees Voted</p>
                    <p className="text-3xl font-bold text-drona-dark">{Math.max(0, currentStep)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Total Trees</p>
                    <p className="text-3xl font-bold text-drona-dark">{trees.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-drona-light to-white p-4 rounded-lg border-2 border-drona-green/10">
                    <p className="text-sm font-semibold text-drona-gray">Consensus</p>
                    <p className="text-xl font-bold text-drona-dark">
                      {currentStep >= maxSteps - 1 ? getFinalPrediction() : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-2 border-drona-green/20 h-full">
              <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
                <CardTitle className="text-2xl font-bold text-drona-dark">Random Forest Ensemble</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {getActiveTrees().map(renderTree)}
                  </div>
                </div>

                {renderVotingResults()}

                <div className="mt-6 p-4 bg-drona-light/30 rounded-lg">
                  <h3 className="font-bold text-drona-dark mb-2">Process Step:</h3>
                  <p className="text-drona-gray">
                    {getStepDescription()}
                  </p>
                </div>

                <Card className="mt-6 bg-gradient-to-r from-drona-light to-white border-2 border-drona-green/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-drona-dark">How Random Forest Works</CardTitle>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomForestVisualizer;
