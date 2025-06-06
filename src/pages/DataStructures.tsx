
import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    description: 'Visualize operations on arrays such as insertion, deletion, and searching with dynamic animations.',
    icon: <ListOrdered size={28} />,
    to: '/data-structures/array',
    color: 'from-blue-500/20 to-blue-600/10',
  },
  {
    title: 'Linked List',
    description: 'Explore singly and doubly linked lists with interactive operations and node connections.',
    icon: <LinkIcon size={28} />,
    to: '/data-structures/linked-list',
    color: 'from-purple-500/20 to-purple-600/10',
  },
  {
    title: 'Stack',
    description: 'Understand the Last-In-First-Out (LIFO) principle with visual push and pop operations.',
    icon: <Layers size={28} />,
    to: '/data-structures/stack',
    color: 'from-green-500/20 to-green-600/10',
  },
  {
    title: 'Queue',
    description: 'Visualize the First-In-First-Out (FIFO) principle with dynamic enqueue and dequeue.',
    icon: <AlignJustify size={28} />,
    to: '/data-structures/queue',
    color: 'from-orange-500/20 to-orange-600/10',
  },
  {
    title: 'Deque',
    description: 'Explore double-ended queues with operations from both ends in real-time.',
    icon: <LayoutGrid size={28} />,
    to: '/data-structures/deque',
    color: 'from-red-500/20 to-red-600/10',
  },
  {
    title: 'Binary Tree',
    description: 'Understand tree structures and traversal algorithms with interactive visualizations.',
    icon: <Trees size={28} />,
    to: '/data-structures/binary-tree',
    color: 'from-teal-500/20 to-teal-600/10',
  },
  {
    title: 'Binary Search Tree',
    description: 'Visualize ordered trees with search, insert, and delete operations dynamically.',
    icon: <GitBranch size={28} />,
    to: '/data-structures/bst',
    color: 'from-indigo-500/20 to-indigo-600/10',
  },
  {
    title: 'Graph',
    description: 'Explore graph structures and algorithms like BFS, DFS, and shortest path finding.',
    icon: <Network size={28} />,
    to: '/data-structures/graph',
    color: 'from-pink-500/20 to-pink-600/10',
  },
];

const DataStructures = () => {
  return (
    <div className="min-h-screen hero-gradient">
      <Navbar />
      
      <div className="page-container pt-28">
        <div className="mb-16 text-center">
          <div className="drona-chip mb-6 animate-bounce-in">✨ Interactive Visualizers</div>
          <h1 className="text-5xl font-black text-gradient mb-6 animate-slide-in">
            Data Structures
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-drona-gray leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Select a data structure to visualize and explore its operations through 
            <span className="font-semibold text-drona-green"> interactive animations</span>.
          </p>
        </div>
        
        <div className="modern-grid">
          {dataStructures.map((ds, index) => (
            <div 
              key={ds.title}
              className="category-card animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ds.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-drona-green/20 to-drona-green/10 p-4 rounded-2xl text-drona-green mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {ds.icon}
                  </div>
                  <h3 className="text-xl font-bold text-drona-dark group-hover:text-drona-green transition-colors duration-300">
                    {ds.title}
                  </h3>
                </div>
                <p className="text-drona-gray mb-6 flex-grow leading-relaxed">
                  {ds.description}
                </p>
                <Link to={ds.to}>
                  <Button className="w-full text-base" variant="default" size="lg">
                    Explore Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="bg-gradient-to-r from-drona-light to-white py-12 mt-20 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="text-2xl font-bold text-gradient">Drona</div>
            </div>
            <p className="text-drona-gray font-medium">
              © {new Date().getFullYear()} ArenaTools. Crafted with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataStructures;
