
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, SortAsc, CircleStack, Network } from 'lucide-react';

const Algorithms = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="page-container mt-20">
        <h1 className="section-title mb-2">Algorithm Visualizations</h1>
        <p className="text-drona-gray mb-8">Explore and understand common algorithms with step-by-step visualizations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-drona-green" />
                  Searching Algorithms
                </CardTitle>
                <CardDescription>
                  Visualize how searching algorithms work on arrays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link to="/algorithms/linear-search" className="text-drona-green hover:underline flex items-center">
                      Linear Search <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/binary-search" className="text-drona-green hover:underline flex items-center">
                      Binary Search <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <SortAsc className="w-5 h-5 mr-2 text-drona-green" />
                  Sorting Algorithms
                </CardTitle>
                <CardDescription>
                  Visualize how sorting algorithms rearrange arrays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link to="/algorithms/bubble-sort" className="text-drona-green hover:underline flex items-center">
                      Bubble Sort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/selection-sort" className="text-drona-green hover:underline flex items-center">
                      Selection Sort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/insertion-sort" className="text-drona-green hover:underline flex items-center">
                      Insertion Sort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/merge-sort" className="text-drona-green hover:underline flex items-center">
                      Merge Sort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/quick-sort" className="text-drona-green hover:underline flex items-center">
                      Quick Sort <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircleStack className="w-5 h-5 mr-2 text-drona-green" />
                  Dynamic Programming
                </CardTitle>
                <CardDescription>
                  Visualize classic dynamic programming problems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link to="/algorithms/0-1-knapsack" className="text-drona-green hover:underline flex items-center">
                      0/1 Knapsack <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/fractional-knapsack" className="text-drona-green hover:underline flex items-center">
                      Fractional Knapsack <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="w-5 h-5 mr-2 text-drona-green" />
                  Greedy Algorithms
                </CardTitle>
                <CardDescription>
                  Visualize algorithms that make locally optimal choices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link to="/algorithms/job-sequencing" className="text-drona-green hover:underline flex items-center">
                      Job Sequencing <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CircleStack className="w-5 h-5 mr-2 text-drona-green" />
                  Classic Problems
                </CardTitle>
                <CardDescription>
                  Visualize famous algorithmic problems and their solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link to="/algorithms/tower-of-hanoi" className="text-drona-green hover:underline flex items-center">
                      Tower of Hanoi <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/algorithms/n-queens" className="text-drona-green hover:underline flex items-center">
                      N-Queens Problem <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algorithms;
