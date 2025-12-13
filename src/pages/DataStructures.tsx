import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Database, Link, Layers, ArrowRightLeft, ListTree, Search, Shuffle, Share2, RotateCw } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const DataStructures = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24 pb-12">
        <div className="mb-8 md:mb-12">
          <RouterLink to="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">Data Structures</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Explore fundamental data structures with interactive visualizations. Understand how data is stored, 
              organized, and accessed in computer memory through step-by-step animations.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8 section-shadow">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>How different data structures organize information</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Time and space complexity of operations</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>When to use each data structure</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Real-world applications and use cases</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard
            title="Arrays"
            description="Learn about contiguous memory allocation, indexing, and dynamic resizing with interactive array operations."
            icon={<Database size={28} />}
            to="/dashboard/data-structures/arrays"
          />
          <CategoryCard
            title="Linked Lists"
            description="Understand pointer-based structures, memory allocation, and traversal through singly, doubly, and circular linked lists."
            icon={<Link size={28} />}
            to="/dashboard/data-structures/linked-lists"
          />
          <CategoryCard
            title="Stacks"
            description="Explore LIFO (Last In, First Out) operations with push, pop, and peek through visual stack manipulations."
            icon={<Layers size={28} />}
            to="/dashboard/data-structures/stacks"
          />
          <CategoryCard
            title="Queues"
            description="Master FIFO (First In, First Out) operations with standard, priority queue, and deque implementations."
            icon={<ArrowRightLeft size={28} />}
            to="/dashboard/data-structures/queues"
          />
          <CategoryCard
            title="Trees"
            description="Visualize hierarchical data structures including binary trees, binary search trees, and heaps with interactive operations."
            icon={<ListTree size={28} />}
            to="/dashboard/data-structures/trees"
          />
          <CategoryCard
            title="Graphs"
            description="Explore vertices, edges, adjacency representations, and graph traversal algorithms (BFS, DFS)."
            icon={<Share2 size={28} />}
            to="/dashboard/data-structures/graphs"
          />
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border section-shadow-lg">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Interactive Learning Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Database className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Visual Operations</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Watch data structures change in real-time as you perform operations</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Step-by-Step</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Control the pace and see each step of algorithm execution</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Complexity Analysis</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Learn time and space complexity for each operation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataStructures;
