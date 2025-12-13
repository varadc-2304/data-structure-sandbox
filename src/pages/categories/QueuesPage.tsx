import React from 'react';
import DataStructureCategory from '../DataStructureCategory';
import QueueVisualizerContent from '../visualizers/content/QueueVisualizerContent';
import PriorityQueueVisualizerContent from '../visualizers/content/PriorityQueueVisualizerContent';
import DequeVisualizerContent from '../visualizers/content/DequeVisualizerContent';

const QueuesPage = () => {
  return (
    <DataStructureCategory
      title="Queues"
      description="Master FIFO (First In, First Out) operations with different queue implementations. Explore standard queues, priority queues, and double-ended queues with interactive visualizations."
      tabs={[
        {
          value: 'queue',
          label: 'Queue',
          component: QueueVisualizerContent,
        },
        {
          value: 'priority',
          label: 'Priority Queue',
          component: PriorityQueueVisualizerContent,
        },
        {
          value: 'deque',
          label: 'Deque',
          component: DequeVisualizerContent,
        },
      ]}
      defaultTab="queue"
    />
  );
};

export default QueuesPage;
