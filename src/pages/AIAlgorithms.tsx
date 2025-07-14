
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Target, Mountain, Route } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAlgorithms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/dashboard" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">AI Algorithms</h1>
          <p className="text-lg text-drona-gray">
            Explore artificial intelligence and machine learning algorithms with interactive visualizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="K-means Clustering"
            description="Watch K-means algorithm find clusters in data through iterative centroid updates and point assignments."
            icon={<Target size={28} />}
            to="/dashboard/ai-algorithms/kmeans"
          />
          <CategoryCard
            title="Hill Climbing Algorithm"
            description="See how hill climbing searches for optimal solutions by moving to better neighboring states."
            icon={<Mountain size={28} />}
            to="/dashboard/ai-algorithms/hill-climbing"
          />
          <CategoryCard
            title="A* Pathfinding Algorithm"
            description="Watch A* algorithm find the optimal path using heuristics and cost evaluation functions."
            icon={<Route size={28} />}
            to="/dashboard/ai-algorithms/a-star"
          />
        </div>
      </div>
    </div>
  );
};

export default AIAlgorithms;
