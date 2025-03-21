
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
  Network,
  Timer
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

const cpuSchedulingAlgorithms = [
  {
    title: 'First Come First Serve (FCFS)',
    description: 'Non-preemptive scheduling algorithm that executes processes in order of arrival.',
    icon: <Timer size={24} />,
    to: '/cpu-scheduling/fcfs',
  },
  {
    title: 'Shortest Job First (SJF)',
    description: 'Scheduling algorithm that executes the process with the shortest burst time first.',
    icon: <Timer size={24} />,
    to: '/cpu-scheduling/sjf',
  },
  {
    title: 'Priority Scheduling',
    description: 'Scheduling algorithm that executes processes based on priority values.',
    icon: <Timer size={24} />,
    to: '/cpu-scheduling/priority',
  },
  {
    title: 'Round Robin (RR)',
    description: 'Time-sliced scheduling algorithm that allocates CPU time in turns.',
    icon: <Timer size={24} />,
    to: '/cpu-scheduling/round-robin',
  },
];

const DataStructures = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-32">
        <div className="mb-16 text-center">
          <div className="arena-chip mb-4 animate-fade-in">Interactive Visualizers</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-4 animate-slide-in">Data Structures</h1>
          <p className="max-w-2xl mx-auto text-arena-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select a data structure to visualize and explore its operations.
            Perfect for learning how data structures work under the hood.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
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

        <div className="mb-16 text-center">
          <div className="arena-chip mb-4 animate-fade-in">CPU Scheduling</div>
          <h1 className="text-4xl font-bold text-arena-dark mb-4 animate-slide-in">Scheduling Algorithms</h1>
          <p className="max-w-2xl mx-auto text-arena-gray animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Visualize how different CPU scheduling algorithms work with interactive simulations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cpuSchedulingAlgorithms.map((algo, index) => (
            <CategoryCard
              key={algo.title}
              title={algo.title}
              description={algo.description}
              icon={algo.icon}
              to={algo.to}
              delay={index * 50 + 300}
            />
          ))}
        </div>
      </div>
      
      <footer className="bg-arena-light py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-arena-gray">
            <p>© {new Date().getFullYear()} ArenaTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataStructures;
