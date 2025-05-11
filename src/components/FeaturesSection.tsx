
import React from 'react';
import { Code, Brain, LineChart, Cpu, Award, Mail, List, HardDrive, Folder, Target, Shield, CircuitBoard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    title: "Interactive Visualizations",
    description: "Watch algorithms and data structures come to life with step-by-step visual representations.",
    icon: <LineChart className="h-10 w-10 text-drona-green" />
  },
  {
    title: "Comprehensive Coverage",
    description: "From arrays and linked lists to CPU scheduling and disk algorithms, we cover a wide range of topics.",
    icon: <Code className="h-10 w-10 text-drona-green" />
  },
  {
    title: "System Simulations",
    description: "Understand complex OS concepts through realistic simulations of CPU, memory, and disk operations.",
    icon: <Cpu className="h-10 w-10 text-drona-green" />
  },
  {
    title: "Learn by Doing",
    description: "Hands-on approach allows students to manipulate parameters and see immediate results.",
    icon: <Brain className="h-10 w-10 text-drona-green" />
  },
  {
    title: "Educational Excellence",
    description: "Designed by educators to align with computer science curriculum fundamentals.",
    icon: <Award className="h-10 w-10 text-drona-green" />
  }
];

const visualizerCategories = [
  {
    title: "Data Structures",
    items: [
      { name: "Arrays", path: "/data-structures/array", icon: <List size={16} /> },
      { name: "Linked Lists", path: "/data-structures/linked-list", icon: <List size={16} /> },
      { name: "Stacks", path: "/data-structures/stack", icon: <List size={16} /> },
      { name: "Queues", path: "/data-structures/queue", icon: <List size={16} /> },
      { name: "Binary Trees", path: "/data-structures/binary-tree", icon: <List size={16} /> },
    ]
  },
  {
    title: "Algorithms",
    items: [
      { name: "Sorting Algorithms", path: "/algorithms/bubble-sort", icon: <List size={16} /> },
      { name: "Searching Algorithms", path: "/algorithms/binary-search", icon: <List size={16} /> },
      { name: "Dynamic Programming", path: "/algorithms/0-1-knapsack", icon: <List size={16} /> },
      { name: "Backtracking", path: "/algorithms/n-queens", icon: <List size={16} /> },
    ]
  },
  {
    title: "Operating Systems",
    items: [
      { name: "CPU Scheduling", path: "/cpu-scheduling/fcfs", icon: <Cpu size={16} /> },
      { name: "Page Replacement", path: "/page-replacement/fifo", icon: <Folder size={16} /> },
      { name: "Disk Scheduling", path: "/disk-scheduling/fcfs", icon: <HardDrive size={16} /> },
    ]
  },
  {
    title: "AI/ML Algorithms",
    items: [
      { name: "K-means Clustering", path: "/aiml/kmeans", icon: <Target size={16} /> },
      { name: "Logistic Regression", path: "/aiml/logistic-regression", icon: <LineChart size={16} /> },
      { name: "Random Forest", path: "/aiml/random-forest", icon: <CircuitBoard size={16} /> },
      { name: "Hill Climbing", path: "/aiml/hill-climbing", icon: <Shield size={16} /> },
      { name: "A* Search Algorithm", path: "/aiml/a-star", icon: <Brain size={16} /> },
    ]
  }
];

const FeaturesSection = () => {
  const { user } = useAuth();
  
  return (
    <div id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="drona-chip mb-4">Why Choose Drona</div>
          <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl md:text-5xl">Powerful Learning Tools</h2>
          <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xl text-drona-gray max-w-3xl mx-auto">
            Our platform provides intuitive tools to make learning computer science concepts engaging and effective.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="drona-card flex flex-col items-center text-center p-8 bg-white hover:bg-drona-green/5 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4 bg-drona-green/10 rounded-xl mb-6 transform transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-drona-dark mb-4">{feature.title}</h3>
              <p className="text-drona-gray">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Visualizers Section with improved styling */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <div className="drona-chip mb-4">Comprehensive Library</div>
            <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl">Explore Our Visualizers</h2>
            <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
            <p className="mt-6 text-xl text-drona-gray max-w-3xl mx-auto">
              Dive into our collection of interactive visualizers designed to make complex concepts simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visualizerCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:border-drona-green/20 hover:shadow-xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-drona-green/5 p-6 border-b border-drona-green/10">
                  <h3 className="text-xl font-semibold text-drona-dark">{category.title}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {user ? (
                          <Link 
                            to={item.path}
                            className="flex items-center p-3 hover:bg-drona-green/5 rounded-lg transition-colors"
                          >
                            <span className="p-2 rounded-md bg-drona-green/10 text-drona-green mr-3">
                              {item.icon}
                            </span>
                            <span className="text-drona-gray hover:text-drona-dark transition-colors">{item.name}</span>
                          </Link>
                        ) : (
                          <div className="flex items-center p-3 rounded-lg">
                            <span className="p-2 rounded-md bg-drona-green/10 text-drona-green mr-3">
                              {item.icon}
                            </span>
                            <span className="text-drona-gray">{item.name}</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  {!user && (
                    <div className="mt-6">
                      <Link to="/auth" className="block w-full">
                        <Button variant="outline" size="sm" className="w-full border-drona-green text-drona-green hover:bg-drona-green hover:text-white">
                          Login to Access
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="w-full mt-2 flex items-center justify-center">
                        <Mail className="h-4 w-4 mr-2" /> Contact for Demo
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        {!user && (
          <div className="mt-20 bg-drona-green/10 p-10 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-drona-dark mb-4">Ready to enhance your learning experience?</h3>
            <p className="text-lg text-drona-gray mb-8 max-w-2xl mx-auto">
              Join thousands of students and educators who are already using Drona to master computer science concepts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-drona-green hover:bg-drona-green/90">
                  Get Started For Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-drona-green text-drona-green hover:bg-drona-green hover:text-white">
                <Mail className="mr-2 h-4 w-4" /> Contact Sales
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesSection;
