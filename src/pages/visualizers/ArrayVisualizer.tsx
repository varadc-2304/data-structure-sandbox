
import React from 'react';
import Navbar from '@/components/Navbar';
import ArrayVisualizerContent from './content/ArrayVisualizerContent';

const ArrayVisualizer = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-12">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium mb-3 text-sm">
            Data Structure Visualization
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">Array Visualizer</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Visualize and perform operations on arrays. Add, replace, remove, or view elements to see how arrays work.
          </p>
        </div>
        <ArrayVisualizerContent />
      </div>
    </div>
  );
};

export default ArrayVisualizer;
