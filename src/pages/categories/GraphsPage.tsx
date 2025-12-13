import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import GraphVisualizer from '../visualizers/GraphVisualizer';

const GraphsPage = () => {
  return (
    <DataStructureCategory
      title="Graphs"
      description="Explore vertices, edges, adjacency representations, and graph traversal algorithms (BFS, DFS). Visualize graph structures and pathfinding algorithms."
      tabs={[
        {
          value: 'visualizer',
          label: 'Graph Visualizer',
          component: GraphVisualizer,
        },
      ]}
      defaultTab="visualizer"
    />
  );
};

export default GraphsPage;
