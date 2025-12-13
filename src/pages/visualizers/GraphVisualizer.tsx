import React from "react";
import GraphCanvas from "./graph/GraphCanvas";
import GraphControls from "./graph/GraphControls";
import GraphLogs from "./graph/GraphLogs";
import { useGraphVisualizer } from "./graph/useGraphVisualizer";

const GraphVisualizer = () => {
  const {
    state: {
      nodes,
      edges,
      newNodeLabel,
      edgeFrom,
      edgeTo,
      edgeWeight,
      isDirected,
      traversalOrder,
      currentTraversal,
      isTraversing,
      traversalType,
      logs,
      svgRef,
    },
    actions: {
      setNewNodeLabel,
      setEdgeFrom,
      setEdgeTo,
      setEdgeWeight,
      setIsDirected,
      addNode,
      addEdge,
      clearGraph,
      startTraversal,
      resetTraversal,
      handleMouseDown,
    },
  } = useGraphVisualizer();

  return (
    <div>
      <div className="mb-6 md:mb-8 bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          traversalOrder={traversalOrder}
          currentTraversal={currentTraversal}
          isTraversing={isTraversing}
          onMouseDown={handleMouseDown}
          svgRef={svgRef}
        />

        <GraphControls
          newNodeLabel={newNodeLabel}
          edgeFrom={edgeFrom}
          edgeTo={edgeTo}
          edgeWeight={edgeWeight}
          isDirected={isDirected}
          isTraversing={isTraversing}
          traversalType={traversalType}
          traversalOrder={traversalOrder}
          currentTraversal={currentTraversal}
          onNewNodeLabelChange={setNewNodeLabel}
          onEdgeFromChange={setEdgeFrom}
          onEdgeToChange={setEdgeTo}
          onEdgeWeightChange={setEdgeWeight}
          onIsDirectedChange={setIsDirected}
          onAddNode={addNode}
          onAddEdge={addEdge}
          onClearGraph={clearGraph}
          onStartBFS={() => startTraversal("bfs")}
          onStartDFS={() => startTraversal("dfs")}
          onResetTraversal={resetTraversal}
        />

        <GraphLogs logs={logs} />
      </div>

      <div className="bg-card rounded-lg border-2 border-border shadow-lg p-4 md:p-6 overflow-hidden">
        <h2 className="text-lg font-semibold mb-2 sm:text-xl text-foreground">About Graphs</h2>
        <p className="text-sm text-muted-foreground sm:text-base mb-4">
          A graph is a data structure consisting of vertices (nodes) connected by edges. Graphs can be directed or undirected, weighted or
          unweighted.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Traversal Algorithms:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>BFS: Breadth-First Search</li>
              <li>DFS: Depth-First Search</li>
            </ul>
          </div>
          <div className="bg-secondary p-3 rounded-lg border border-border">
            <span className="font-medium text-foreground">Applications:</span>
            <ul className="list-disc pl-5 mt-1 text-muted-foreground">
              <li>Social networks</li>
              <li>Road networks</li>
              <li>Web page links</li>
              <li>Computer networks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
