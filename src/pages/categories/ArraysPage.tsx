import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import ArrayVisualizerContent from '../visualizers/content/ArrayVisualizerContent';

// For now, just Array Visualizer. Sorting and Searching will be added later
const ArraysPage = () => {
  return (
    <DataStructureCategory
      title="Arrays"
      description="Learn about contiguous memory allocation, indexing, and dynamic resizing with interactive array operations. Explore array manipulations, sorting algorithms, and searching techniques."
      tabs={[
        {
          value: 'visualizer',
          label: 'Array Visualizer',
          component: ArrayVisualizerContent,
        },
        // TODO: Add sorting algorithms tab
        // TODO: Add searching algorithms tab
      ]}
      defaultTab="visualizer"
    />
  );
};

export default ArraysPage;
