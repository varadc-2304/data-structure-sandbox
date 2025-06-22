import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Database, Link, Layers, ArrowRightLeft, ListTree, Search, Shuffle, Share2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const DataStructures = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-12">
          <RouterLink to="/" className="flex items-center text-drona-green hover:underline mb-6 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-drona-dark mb-4">Data Structures</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Explore fundamental data structures with interactive visualizations. Understand how data is stored, 
              organized, and accessed in computer memory through step-by-step animations.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>How different data structures organize information</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Time and space complexity of operations</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>When to use each data structure</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Real-world applications and use cases</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <CategoryCard
            title="Arrays"
            description="Learn about contiguous memory allocation, indexing, and dynamic resizing with interactive array operations."
            icon={<Database size={28} />}
            to="/data-structures/array"
          />
          <CategoryCard
            title="Linked Lists"
            description="Understand pointer-based structures, memory allocation, and traversal through singly and doubly linked lists."
            icon={<Link size={28} />}
            to="/data-structures/linked-list"
          />
          <CategoryCard
            title="Stacks"
            description="Explore LIFO (Last In, First Out) operations with push, pop, and peek through visual stack manipulations."
            icon={<Layers size={28} />}
            to="/data-structures/stack"
          />
          <CategoryCard
            title="Queues"
            description="Master FIFO (First In, First Out) operations with enqueue, dequeue, and front/rear pointer management."
            icon={<ArrowRightLeft size={28} />}
            to="/data-structures/queue"
          />
          <CategoryCard
            title="Double-ended Queues"
            description="Learn about deques that allow insertion and deletion at both ends with efficient operations."
            icon={<Shuffle size={28} />}
            to="/data-structures/deque"
          />
          <CategoryCard
            title="Binary Trees"
            description="Visualize hierarchical data structures, tree traversals (in-order, pre-order, post-order), and node relationships."
            icon={<ListTree size={28} />}
            to="/data-structures/binary-tree"
          />
          <CategoryCard
            title="Binary Search Trees"
            description="Understand self-organizing trees with search, insertion, and deletion operations maintaining sorted order."
            icon={<Search size={28} />}
            to="/data-structures/bst"
          />
          <CategoryCard
            title="Graphs"
            description="Explore vertices, edges, adjacency representations, and graph traversal algorithms (BFS, DFS)."
            icon={<Share2 size={28} />}
            to="/data-structures/graph"
          />
        </div>
        
        <div className="mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-4 text-center">
              Interactive Learning Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Visual Operations</h4>
                <p className="text-sm text-drona-gray">Watch data structures change in real-time as you perform operations</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Step-by-Step</h4>
                <p className="text-sm text-drona-gray">Control the pace and see each step of algorithm execution</p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Complexity Analysis</h4>
                <p className="text-sm text-drona-gray">Learn time and space complexity for each operation</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright Notice */}
        <div className="mt-16 text-center text-sm text-drona-gray">
          © 2024 Ikshvaku Innovations. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default DataStructures;
