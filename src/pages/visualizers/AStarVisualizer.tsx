import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AStarControls from "./astar/AStarControls";
import AStarGrid from "./astar/AStarGrid";
import AStarStats from "./astar/AStarStats";
import { useAStarVisualizer, Node } from "./astar/useAStarVisualizer";

const AStarVisualizer = () => {
  const {
    state: { isPlaying, currentStep, speed, steps, grid, start, goal, mode, GRID_SIZE },
    actions: { setSpeed, setMode, handleCellClick, clearGrid, togglePlayPause, nextStep, prevStep, goToStep, skipToStart, skipToEnd, resetVisualization, getStepDescription, getCurrentStepData },
  } = useAStarVisualizer();

  const getCellClass = (node: Node) => {
    const stepData = getCurrentStepData();

    if (node.isStart) return "bg-green-700 border-green-700 shadow-md";
    if (node.isGoal) return "bg-red-500 border-red-600 shadow-md";
    if (node.isWall) return "bg-gray-800 border-gray-900";

    if (stepData?.pathFound && stepData.finalPath) {
      const isInFinalPath = stepData.finalPath.some((pathNode) => pathNode.x === node.x && pathNode.y === node.y);
      if (isInFinalPath && !node.isStart && !node.isGoal) {
        return "bg-yellow-400 border-yellow-500 shadow-md";
      }
    }

    if (stepData?.currentPath) {
      const isInCurrentPath = stepData.currentPath.some((pathNode) => pathNode.x === node.x && pathNode.y === node.y);
      if (isInCurrentPath && !node.isStart && !node.isGoal && !stepData.pathFound) {
        return "bg-yellow-200 border-yellow-300";
      }
    }

    if (stepData) {
      if (stepData.current.x === node.x && stepData.current.y === node.y) {
        return "bg-purple-500 border-purple-600 shadow-lg animate-pulse";
      }

      const isInClosedSet = stepData.closedSet.some((n) => n.x === node.x && n.y === node.y);
      const isInOpenSet = stepData.openSet.some((n) => n.x === node.x && n.y === node.y);

      if (isInClosedSet) return "bg-red-200 border-red-300";
      if (isInOpenSet) return "bg-blue-200 border-blue-300";
    }

    return "bg-white border-gray-300 hover:bg-gray-50";
  };

  const getCellContent = (node: Node) => {
    if (node.isStart || node.isGoal) return "";

    const stepData = getCurrentStepData();
    if (!stepData) return "";

    if (stepData.current.x === node.x && stepData.current.y === node.y) return "C";

    const isInClosedSet = stepData.closedSet.some((n) => n.x === node.x && n.y === node.y);
    const isInOpenSet = stepData.openSet.some((n) => n.x === node.x && n.y === node.y);

    if (isInOpenSet || isInClosedSet) {
      const matchingNode = [...stepData.openSet, ...stepData.closedSet].find((n) => n.x === node.x && n.y === node.y);
      return matchingNode && matchingNode.f > 0 ? matchingNode.f.toFixed(0) : "";
    }

    return "";
  };

  const currentStepData = getCurrentStepData();
  const stepDescription = getStepDescription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />

      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard/ai-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AI Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">A* Pathfinding Algorithm</h1>
          <p className="text-lg text-drona-gray">Interactive matrix visualization - click to set start/goal points and watch the optimal path unfold</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AStarControls
              mode={mode}
              isPlaying={isPlaying}
              currentStep={currentStep}
              stepsLength={steps.length}
              speed={speed}
              onModeChange={setMode}
              onClearGrid={clearGrid}
              onTogglePlayPause={togglePlayPause}
              onNextStep={nextStep}
              onPrevStep={prevStep}
              onSkipToStart={skipToStart}
              onSkipToEnd={skipToEnd}
              onReset={resetVisualization}
              onGoToStep={goToStep}
              onSpeedChange={setSpeed}
            />

            <AStarStats currentStepData={currentStepData} goal={goal} />
          </div>

          <div className="lg:col-span-2">
            <AStarGrid
              grid={grid}
              GRID_SIZE={GRID_SIZE}
              currentStepData={currentStepData ? { ...currentStepData, description: stepDescription } : null}
              onCellClick={handleCellClick}
              getCellClass={getCellClass}
              getCellContent={getCellContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AStarVisualizer;
