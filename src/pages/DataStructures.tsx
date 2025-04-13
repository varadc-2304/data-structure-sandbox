
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, List, GitBranch, Network } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';

const DataStructures = () => {
  const dataStructures = [
    {
      id: 'array',
      name: 'Array',
      description: 'A collection of elements stored at contiguous memory locations',
      icon: <List size={24} />,
    },
    {
      id: 'linked-list',
      name: 'Linked List',
      description: 'A linear data structure where elements are not stored at contiguous memory locations',
      icon: <List size={24} />,
    },
    {
      id: 'stack',
      name: 'Stack',
      description: 'A linear data structure that follows the LIFO (Last-In-First-Out) principle',
      icon: <FileText size={24} />,
    },
    {
      id: 'queue',
      name: 'Queue',
      description: 'A linear data structure that follows the FIFO (First-In-First-Out) principle',
      icon: <FileText size={24} />,
    },
    {
      id: 'deque',
      name: 'Deque',
      description: 'A double-ended queue allowing insertion and removal from both ends',
      icon: <FileText size={24} />,
    },
    {
      id: 'binary-tree',
      name: 'Binary Tree',
      description: 'A tree data structure in which each node has at most two children',
      icon: <GitBranch size={24} />,
    },
    {
      id: 'bst',
      name: 'Binary Search Tree',
      description: 'A binary tree with the property that the value in each node is greater than in its left subtree and less than in its right subtree',
      icon: <GitBranch size={24} />,
    },
    {
      id: 'graph',
      name: 'Graph',
      description: 'A non-linear data structure consisting of vertices and edges',
      icon: <Network size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container pt-24">
        <div className="mb-8 text-center">
          <div className="drona-chip mb-3">Computer Science</div>
          <h1 className="text-3xl md:text-4xl font-bold text-drona-dark">Data Structures</h1>
          <p className="mt-3 max-w-2xl mx-auto text-drona-gray">
            Explore common data structures and understand their implementation through interactive visualizations.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {dataStructures.map((ds) => (
            <Link 
              key={ds.id} 
              to={`/data-structures/${ds.id}`} 
              className="block"
            >
              <CategoryCard 
                title={ds.name}
                description={ds.description}
                icon={ds.icon}
                className="hover:border-drona-green transition-colors"
              >
                <div className="mt-4 flex items-center text-drona-green font-medium text-sm">
                  Visualize <span className="ml-1">→</span>
                </div>
              </CategoryCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataStructures;
