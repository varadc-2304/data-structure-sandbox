
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { 
  ListOrdered, 
  Link as LinkIcon, 
  Layers, 
  AlignJustify, 
  LayoutGrid, 
  GitBranch, 
  Trees, 
  Network
} from 'lucide-react';

const dataStructures = [
  {
    title: 'Arrays',
    description: 'Visualize operations on arrays such as insertion, deletion, and searching.',
    icon: <ListOrdered size={24} />,
    to: '/data-structures/array',
  },
  {
    title: 'Linked List',
    description: 'Explore singly and doubly linked lists with interactive operations.',
    icon: <LinkIcon size={24} />,
    to: '/data-structures/linked-list',
  },
  {
    title: 'Stack',
    description: 'Understand the Last-In-First-Out (LIFO) principle with visual operations.',
    icon: <Layers size={24} />,
    to: '/data-structures/stack',
  },
  {
    title: 'Queue',
    description: 'Visualize the First-In-First-Out (FIFO) principle with enqueue and dequeue operations.',
    icon: <AlignJustify size={24} />,
    to: '/data-structures/queue',
  },
  {
    title: 'Deque',
    description: 'Explore double-ended queues with operations from both ends.',
    icon: <LayoutGrid size={24} />,
    to: '/data-structures/deque',
  },
  {
    title: 'Binary Tree',
    description: 'Understand tree structures and traversal algorithms.',
    icon: <Trees size={24} />,
    to: '/data-structures/binary-tree',
  },
  {
    title: 'Binary Search Tree',
    description: 'Visualize ordered trees with search, insert, and delete operations.',
    icon: <GitBranch size={24} />,
    to: '/data-structures/bst',
  },
  {
    title: 'Graph',
    description: 'Explore graph structures and algorithms like BFS, DFS, and shortest path.',
    icon: <Network size={24} />,
    to: '/data-structures/graph',
  },
];

const DataStructures = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-10 text-center">
          <div className="drona-chip mb-3 animate-fade-in">Interactive Visualizers</div>
          <h1 className="text-3xl font-bold text-drona-dark mb-3 animate-slide-in">Data Structures</h1>
          <p className="max-w-2xl mx-auto text-drona-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select a data structure to visualize and explore its operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {dataStructures.map((ds, index) => (
            <CategoryCard
              key={ds.title}
              title={ds.title}
              description={ds.description}
              icon={ds.icon}
              to={ds.to}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
      
      <footer className="bg-drona-light py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-drona-gray">
            <p>© {new Date().getFullYear()} ArenaTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataStructures;
