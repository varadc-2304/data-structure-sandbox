
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Search, ArrowUpDown, Package, Briefcase, Crown, Gamepad2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Algorithms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-12">
          <Link to="/" className="flex items-center text-drona-green hover:underline mb-6 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-drona-dark mb-4">Algorithm Visualizations</h1>
            <p className="text-xl text-drona-gray max-w-4xl mx-auto leading-relaxed">
              Master fundamental algorithms through interactive step-by-step visualizations. 
              Understand how different algorithmic approaches solve computational problems efficiently.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-drona-green/10 to-drona-green/5 rounded-2xl p-6 border-2 border-drona-green/20 mb-8">
            <h2 className="text-2xl font-bold text-drona-dark mb-3">Algorithm Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-drona-gray">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Searching algorithms for data retrieval</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Sorting algorithms for data organization</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Dynamic programming for optimization</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-drona-green rounded-full mt-2 flex-shrink-0"></div>
                <p>Backtracking for constraint satisfaction</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-12">
          {/* Searching Algorithms */}
          <div>
            <h2 className="text-3xl font-bold text-drona-dark mb-6 flex items-center">
              <Search className="mr-3 h-8 w-8 text-drona-green" />
              Searching Algorithms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Linear Search"
                description="Sequential search through elements one by one. Simple approach with O(n) time complexity suitable for unsorted data."
                icon={<Search size={24} />}
                to="/algorithms/linear-search"
                delay={100}
              />
              <CategoryCard
                title="Binary Search"
                description="Efficient divide-and-conquer search for sorted arrays. O(log n) time complexity by eliminating half the search space."
                icon={<Search size={24} />}
                to="/algorithms/binary-search"
                delay={200}
              />
            </div>
          </div>

          {/* Sorting Algorithms */}
          <div>
            <h2 className="text-3xl font-bold text-drona-dark mb-6 flex items-center">
              <ArrowUpDown className="mr-3 h-8 w-8 text-drona-green" />
              Sorting Algorithms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard
                title="Bubble Sort"
                description="Simple comparison-based sort that repeatedly swaps adjacent elements. O(n²) complexity but easy to understand."
                icon={<ArrowUpDown size={24} />}
                to="/algorithms/bubble-sort"
                delay={100}
              />
              <CategoryCard
                title="Selection Sort"
                description="Finds minimum element and places it at beginning. O(n²) time but only O(n) swaps, useful for memory-constrained systems."
                icon={<ArrowUpDown size={24} />}
                to="/algorithms/selection-sort"
                delay={200}
              />
              <CategoryCard
                title="Insertion Sort"
                description="Builds sorted array one element at a time. Efficient for small datasets and nearly sorted arrays. O(n²) worst case."
                icon={<ArrowUpDown size={24} />}
                to="/algorithms/insertion-sort"
                delay={300}
              />
              <CategoryCard
                title="Merge Sort"
                description="Divide-and-conquer algorithm with guaranteed O(n log n) performance. Stable sort excellent for large datasets."
                icon={<ArrowUpDown size={24} />}
                to="/algorithms/merge-sort"
                delay={400}
              />
              <CategoryCard
                title="Quick Sort"
                description="Fast average-case O(n log n) sort using partitioning. Most commonly used sorting algorithm in practice."
                icon={<ArrowUpDown size={24} />}
                to="/algorithms/quick-sort"
                delay={500}
              />
            </div>
          </div>

          {/* Dynamic Programming */}
          <div>
            <h2 className="text-3xl font-bold text-drona-dark mb-6 flex items-center">
              <Package className="mr-3 h-8 w-8 text-drona-green" />
              Dynamic Programming & Optimization
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard
                title="0/1 Knapsack Problem"
                description="Classic optimization problem: maximize value while staying within weight constraint. Cannot break items."
                icon={<Package size={24} />}
                to="/algorithms/0-1-knapsack"
                delay={100}
              />
              <CategoryCard
                title="Fractional Knapsack"
                description="Greedy approach where items can be broken. Always gives optimal solution by taking highest value-to-weight ratio."
                icon={<Package size={24} />}
                to="/algorithms/fractional-knapsack"
                delay={200}
              />
              <CategoryCard
                title="Job Sequencing"
                description="Schedule jobs with deadlines to maximize profit. Greedy algorithm that prioritizes high-profit jobs."
                icon={<Briefcase size={24} />}
                to="/algorithms/job-sequencing"
                delay={300}
              />
            </div>
          </div>

          {/* Backtracking */}
          <div>
            <h2 className="text-3xl font-bold text-drona-dark mb-6 flex items-center">
              <Gamepad2 className="mr-3 h-8 w-8 text-drona-green" />
              Backtracking Algorithms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryCard
                title="Tower of Hanoi"
                description="Classic recursive puzzle: move disks between pegs following size constraints. Demonstrates divide-and-conquer thinking."
                icon={<Gamepad2 size={24} />}
                to="/algorithms/tower-of-hanoi"
                delay={100}
              />
              <CategoryCard
                title="N-Queens Problem"
                description="Place N queens on N×N chessboard so none attack each other. Classic constraint satisfaction problem."
                icon={<Crown size={24} />}
                to="/algorithms/n-queens"
                delay={200}
              />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-6 text-center">
              Algorithm Complexity Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="text-left p-3 font-semibold text-drona-dark">Algorithm Type</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Best Case</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Average Case</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Worst Case</th>
                    <th className="text-left p-3 font-semibold text-drona-dark">Space</th>
                  </tr>
                </thead>
                <tbody className="text-drona-gray">
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">Linear Search</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">Binary Search</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">O(log n)</td>
                    <td className="p-3">O(log n)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">Bubble Sort</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(n²)</td>
                    <td className="p-3">O(n²)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-purple-100">
                    <td className="p-3 font-medium">Merge Sort</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Quick Sort</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n²)</td>
                    <td className="p-3">O(log n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-drona-dark mb-4 text-center">
              Algorithm Design Paradigms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Divide & Conquer</h4>
                <p className="text-sm text-drona-gray">Break problem into smaller subproblems</p>
              </div>
              <div>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Dynamic Programming</h4>
                <p className="text-sm text-drona-gray">Optimize by storing subproblem solutions</p>
              </div>
              <div>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Greedy Algorithms</h4>
                <p className="text-sm text-drona-gray">Make locally optimal choices</p>
              </div>
              <div>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-drona-dark mb-2">Backtracking</h4>
                <p className="text-sm text-drona-gray">Explore all possibilities systematically</p>
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

export default Algorithms;
