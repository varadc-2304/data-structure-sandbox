import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import DequeVisualizerContent from '../visualizers/content/DequeVisualizerContent';

const DequesPage = () => {
  return (
    <DataStructureCategory
      title="Double-ended Queues"
      description="Learn about deques that allow insertion and deletion at both ends with efficient operations. Explore bidirectional queue operations and applications."
      tabs={[
        {
          value: 'visualizer',
          label: 'Deque Visualizer',
          component: DequeVisualizerContent,
        },
      ]}
      defaultTab="visualizer"
    />
  );
};

export default DequesPage;
