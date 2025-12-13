import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import BinaryTreeVisualizer from '../visualizers/BinaryTreeVisualizer';
import BSTVisualizer from '../visualizers/BSTVisualizer';

const TreesPage = () => {
  return (
    <DataStructureCategory
      title="Trees"
      description="Visualize hierarchical data structures and tree-based algorithms. Explore binary trees and binary search trees with interactive operations and traversals."
      tabs={[
        {
          value: 'binary-tree',
          label: 'Binary Tree',
          component: BinaryTreeVisualizer,
        },
        {
          value: 'bst',
          label: 'Binary Search Tree',
          component: BSTVisualizer,
        },
      ]}
      defaultTab="binary-tree"
    />
  );
};

export default TreesPage;
