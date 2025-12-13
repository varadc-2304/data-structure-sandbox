import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HillClimbingControls from "./hill-climbing/HillClimbingControls";
import HillClimbingMap from "./hill-climbing/HillClimbingMap";
import { useHillClimbingVisualizer } from "./hill-climbing/useHillClimbingVisualizer";

const HillClimbingVisualizer = () => {
  const {
    state: { isPlaying, currentStep, speed, steps, path, startPosition, currentMap },
    actions: { setSpeed, changeMap, handleMapClick, togglePlayPause, nextStep, prevStep, goToStep, skipToStart, skipToEnd, resetVisualization, getStepDescription, getCurrentPosition, getCurrentNeighbors, getBestNeighbor, getHeight, getColorForHeight },
  } = useHillClimbingVisualizer();

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;
  const currentPosition = getCurrentPosition();
  const neighbors = getCurrentNeighbors();
  const bestNeighbor = getBestNeighbor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />

      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Hill Climbing Algorithm</h1>
          <p className="text-lg text-drona-gray">Watch the hill climbing algorithm search for the highest peak in a landscape</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <HillClimbingControls
              currentMap={currentMap}
              startPosition={startPosition}
              isPlaying={isPlaying}
              currentStep={currentStep}
              stepsLength={steps.length}
              speed={speed}
              currentPosition={currentPosition}
              neighbors={neighbors}
              bestNeighbor={bestNeighbor}
              onChangeMap={changeMap}
              onTogglePlayPause={togglePlayPause}
              onNextStep={nextStep}
              onPrevStep={prevStep}
              onSkipToStart={skipToStart}
              onSkipToEnd={skipToEnd}
              onReset={resetVisualization}
              onGoToStep={goToStep}
              onSpeedChange={setSpeed}
            />
          </div>

          <div className="lg:col-span-3">
            <HillClimbingMap
              startPosition={startPosition}
              path={path}
              currentStep={currentStep}
              currentPosition={currentPosition}
              neighbors={neighbors}
              bestNeighbor={bestNeighbor}
              getHeight={getHeight}
              getColorForHeight={getColorForHeight}
              onMapClick={handleMapClick}
              currentStepData={currentStepData ? { ...currentStepData, description: getStepDescription() } : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HillClimbingVisualizer;
