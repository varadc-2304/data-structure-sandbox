
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, LineChart, CircuitBoard, Shield, Brain } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';

const AIML = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-drona-dark mb-6">AI/ML Algorithms Visualizer</h1>
          <p className="text-xl text-drona-gray max-w-3xl mx-auto">
            Interactively explore and understand machine learning algorithms through visualizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="K-means Clustering"
            description="Visualize how K-means clustering groups similar data points together."
            icon={<Target size={24} />}
            to="/aiml/kmeans"
            delay={100}
          />
          <CategoryCard
            title="Logistic Regression"
            description="Explore the visualization of logistic regression for binary classification problems."
            icon={<LineChart size={24} />}
            to="/aiml/logistic-regression"
            delay={200}
          />
          <CategoryCard
            title="Random Forest"
            description="Understand how random forest classifiers work with visual representations."
            icon={<CircuitBoard size={24} />}
            to="/aiml/random-forest"
            delay={300}
          />
          <CategoryCard
            title="Hill Climbing"
            description="Learn how hill climbing optimization algorithm searches for solutions."
            icon={<Shield size={24} />}
            to="/aiml/hill-climbing"
            delay={400}
          />
          <CategoryCard
            title="A* Search Algorithm"
            description="Visualize how A* pathfinding algorithm finds the shortest path."
            icon={<Brain size={24} />}
            to="/aiml/a-star"
            delay={500}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIML;
