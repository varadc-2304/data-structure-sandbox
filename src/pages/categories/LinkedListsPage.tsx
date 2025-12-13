import React, { useEffect, useState } from 'react';
import DataStructureCategory from '../DataStructureCategory';
import LinkedListVisualizerContent from '../visualizers/content/LinkedListVisualizerContent';
import DoublyLinkedListVisualizerContent from '../visualizers/content/DoublyLinkedListVisualizerContent';
import CircularLinkedListVisualizerContent from '../visualizers/content/CircularLinkedListVisualizerContent';
import { useParams } from 'react-router-dom';

const LinkedListsPage = () => {
  const { tab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<string | undefined>(tab);

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  return (
    <DataStructureCategory
      title="Linked Lists"
      description="Understand pointer-based structures, memory allocation, and traversal through different types of linked lists. Explore singly, doubly, and circular linked list implementations."
      tabs={[
        {
          value: 'singly',
          label: 'Singly Linked List',
          component: LinkedListVisualizerContent,
        },
        {
          value: 'doubly',
          label: 'Doubly Linked List',
          component: DoublyLinkedListVisualizerContent,
        },
        {
          value: 'circular',
          label: 'Circular Linked List',
          component: CircularLinkedListVisualizerContent,
        },
      ]}
      defaultTab={activeTab || "singly"}
      key={activeTab || "singly"}
    />
  );
};

export default LinkedListsPage;
