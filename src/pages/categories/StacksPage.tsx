import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import StackVisualizerContent from '../visualizers/content/StackVisualizerContent';

const StacksPage = () => {
  return (
    <DataStructureCategory
      title="Stacks"
      description="Explore LIFO (Last In, First Out) operations with push, pop, and peek through visual stack manipulations. Understand stack-based algorithms and applications."
      tabs={[
        {
          value: 'visualizer',
          label: 'Stack Visualizer',
          component: StackVisualizerContent,
        },
      ]}
      defaultTab="visualizer"
    />
  );
};

export default StacksPage;
