
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Search, ArrowUpDown, Package, Briefcase, Crown, Gamepad2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Algorithms = () => {
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
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">Algorithm Visualizations</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Master fundamental algorithms through interactive step-by-step visualizations. 
              Understand how different algorithmic approaches solve computational problems efficiently.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Algorithm Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Searching algorithms for data retrieval</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Sorting algorithms for data organization</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Dynamic programming for optimization</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Backtracking for constraint satisfaction</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8 md:space-y-12">
          {/* Searching Algorithms */}
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4 md:mb-6 flex items-center">
              <Search className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
              Searching Algorithms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <CategoryCard
                title="Linear Search"
                description="Sequential search through elements one by one. Simple approach with O(n) time complexity suitable for unsorted data."
                icon={<Search size={24} />}
                to="/dashboard/algorithms/linear-search"
                delay={100}
              />
              <CategoryCard
                title="Binary Search"
                description="Efficient divide-and-conquer search for sorted arrays. O(log n) time complexity by eliminating half the search space."
                icon={<Search size={24} />}
                to="/dashboard/algorithms/binary-search"
                delay={200}
              />
            </div>
          </div>

          {/* Sorting Algorithms */}
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4 md:mb-6 flex items-center">
              <ArrowUpDown className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
              Sorting Algorithms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <CategoryCard
                title="Bubble Sort"
                description="Simple comparison-based sort that repeatedly swaps adjacent elements. O(n²) complexity but easy to understand."
                icon={<ArrowUpDown size={24} />}
                to="/dashboard/algorithms/bubble-sort"
                delay={100}
              />
              <CategoryCard
                title="Selection Sort"
                description="Finds minimum element and places it at beginning. O(n²) time but only O(n) swaps, useful for memory-constrained systems."
                icon={<ArrowUpDown size={24} />}
                to="/dashboard/algorithms/selection-sort"
                delay={200}
              />
              <CategoryCard
                title="Insertion Sort"
                description="Builds sorted array one element at a time. Efficient for small datasets and nearly sorted arrays. O(n²) worst case."
                icon={<ArrowUpDown size={24} />}
                to="/dashboard/algorithms/insertion-sort"
                delay={300}
              />
              <CategoryCard
                title="Merge Sort"
                description="Divide-and-conquer algorithm with guaranteed O(n log n) performance. Stable sort excellent for large datasets."
                icon={<ArrowUpDown size={24} />}
                to="/dashboard/algorithms/merge-sort"
                delay={400}
              />
              <CategoryCard
                title="Quick Sort"
                description="Fast average-case O(n log n) sort using partitioning. Most commonly used sorting algorithm in practice."
                icon={<ArrowUpDown size={24} />}
                to="/dashboard/algorithms/quick-sort"
                delay={500}
              />
            </div>
          </div>

          {/* Dynamic Programming */}
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4 md:mb-6 flex items-center">
              <Package className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
              Dynamic Programming & Optimization
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <CategoryCard
                title="0/1 Knapsack Problem"
                description="Classic optimization problem: maximize value while staying within weight constraint. Cannot break items."
                icon={<Package size={24} />}
                to="/dashboard/algorithms/01-knapsack"
                delay={100}
              />
              <CategoryCard
                title="Fractional Knapsack"
                description="Greedy approach where items can be broken. Always gives optimal solution by taking highest value-to-weight ratio."
                icon={<Package size={24} />}
                to="/dashboard/algorithms/fractional-knapsack"
                delay={200}
              />
              <CategoryCard
                title="Job Sequencing"
                description="Schedule jobs with deadlines to maximize profit. Greedy algorithm that prioritizes high-profit jobs."
                icon={<Briefcase size={24} />}
                to="/dashboard/algorithms/job-sequencing"
                delay={300}
              />
            </div>
          </div>

          {/* Backtracking */}
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4 md:mb-6 flex items-center">
              <Gamepad2 className="mr-3 h-6 w-6 md:h-8 md:w-8 text-primary" />
              Backtracking Algorithms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <CategoryCard
                title="Tower of Hanoi"
                description="Classic recursive puzzle: move disks between pegs following size constraints. Demonstrates divide-and-conquer thinking."
                icon={<Gamepad2 size={24} />}
                to="/dashboard/algorithms/tower-of-hanoi"
                delay={100}
              />
              <CategoryCard
                title="N-Queens Problem"
                description="Place N queens on N×N chessboard so none attack each other. Classic constraint satisfaction problem."
                icon={<Crown size={24} />}
                to="/dashboard/algorithms/n-queens"
                delay={200}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Algorithm Complexity Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Algorithm Type</th>
                    <th className="text-left p-3 font-semibold text-foreground">Best Case</th>
                    <th className="text-left p-3 font-semibold text-foreground">Average Case</th>
                    <th className="text-left p-3 font-semibold text-foreground">Worst Case</th>
                    <th className="text-left p-3 font-semibold text-foreground">Space</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Linear Search</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Binary Search</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">O(log n)</td>
                    <td className="p-3">O(log n)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Bubble Sort</td>
                    <td className="p-3">O(n)</td>
                    <td className="p-3">O(n²)</td>
                    <td className="p-3">O(n²)</td>
                    <td className="p-3">O(1)</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Merge Sort</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">O(n)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Quick Sort</td>
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

        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Algorithm Design Paradigms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Divide & Conquer</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Break problem into smaller subproblems</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Dynamic Programming</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Optimize by storing subproblem solutions</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Greedy Algorithms</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Make locally optimal choices</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Backtracking</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Explore all possibilities systematically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Algorithms;
