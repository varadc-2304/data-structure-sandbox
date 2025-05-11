
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, LineChart, CircuitBoard, Shield, Brain, Workflow } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';

const AIML = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-drona-dark mb-6">AI/ML Algorithms Visualizer</h1>
          <p className="text-xl text-drona-gray max-w-3xl mx-auto mb-8">
            Interactively explore and understand machine learning algorithms through visualizations
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-drona-green hover:bg-drona-green/90">
              <Link to="/aiml/kmeans">Get Started</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="K-means Clustering"
            description="Visualize how K-means clustering groups similar data points together based on feature similarity. See the algorithm converge in real-time."
            icon={<Target size={24} />}
            to="/aiml/kmeans"
            delay={100}
          />
          <CategoryCard
            title="Logistic Regression"
            description="Explore logistic regression for binary classification problems. Watch as the decision boundary adapts to separate data points through gradient descent."
            icon={<LineChart size={24} />}
            to="/aiml/logistic-regression"
            delay={200}
          />
          <CategoryCard
            title="Random Forest"
            description="Understand how random forest classifiers build multiple decision trees and combine their outputs to improve accuracy and reduce overfitting."
            icon={<CircuitBoard size={24} />}
            to="/aiml/random-forest"
            delay={300}
          />
          <CategoryCard
            title="Hill Climbing"
            description="Learn how hill climbing optimization algorithm searches for solutions by iteratively moving toward higher values in the search space."
            icon={<Shield size={24} />}
            to="/aiml/hill-climbing"
            delay={400}
          />
          <CategoryCard
            title="A* Search Algorithm"
            description="Visualize how A* pathfinding algorithm efficiently finds the shortest path between points using heuristics to guide the search."
            icon={<Brain size={24} />}
            to="/aiml/a-star"
            delay={500}
          />
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-drona-dark mb-4 flex items-center">
            <Workflow className="mr-2 text-drona-green" size={24} />
            Learning AI/ML Algorithms
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Why Visualize Algorithms?</h3>
              <p className="text-drona-gray mb-4">
                Visual representations help you develop an intuitive understanding of complex algorithms. 
                By seeing algorithms in action, you can better grasp their mechanics, strengths, and limitations.
              </p>
              <ul className="list-disc list-inside space-y-2 text-drona-gray">
                <li>Understand how parameters affect algorithm performance</li>
                <li>See convergence patterns in iterative algorithms</li>
                <li>Identify optimal configurations through experimentation</li>
                <li>Compare different approaches to similar problems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
              <p className="text-drona-gray mb-4">
                Each visualization allows you to modify key parameters and observe the effects in real-time.
                This hands-on approach reinforces theoretical knowledge with practical understanding.
              </p>
              <p className="text-drona-gray">
                Whether you're new to machine learning or an experienced practitioner, these visualizations
                provide valuable insights into the inner workings of essential algorithms used in data science,
                artificial intelligence, and robotics.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIML;
