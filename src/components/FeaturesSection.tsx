
import React from 'react';
import { Code, Brain, LineChart, Cpu, Award, Link as LinkIcon, List, HardDrive, Folder } from 'lucide-react';
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
      { name: "Linked Lists", path: "/data-structures/linked-list", icon: <LinkIcon size={16} /> },
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
  }
];

const FeaturesSection = () => {
  const { user } = useAuth();
  
  return (
    <div id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-drona-dark">Why Choose Drona</h2>
          <p className="mt-4 text-xl text-drona-gray max-w-3xl mx-auto">
            Our platform provides powerful tools to make learning computer science concepts intuitive and engaging.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="drona-card flex flex-col items-center text-center p-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 bg-drona-green/5 rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-drona-dark mb-3">{feature.title}</h3>
              <p className="text-drona-gray">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Visualizers Section */}
        <div className="mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-drona-dark">Explore Our Visualizers</h2>
            <p className="mt-4 text-xl text-drona-gray max-w-3xl mx-auto">
              Dive into our comprehensive collection of interactive visualizers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visualizerCategories.map((category, index) => (
              <div 
                key={index}
                className="drona-card p-6"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold text-drona-dark mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {user ? (
                        <Link 
                          to={item.path}
                          className="flex items-center p-2 hover:bg-drona-green/5 rounded-lg transition-colors"
                        >
                          <span className="p-1 rounded-md bg-drona-green/10 text-drona-green mr-3">
                            {item.icon}
                          </span>
                          <span className="text-drona-gray hover:text-drona-dark transition-colors">{item.name}</span>
                        </Link>
                      ) : (
                        <div className="flex items-center p-2">
                          <span className="p-1 rounded-md bg-drona-green/10 text-drona-green mr-3">
                            {item.icon}
                          </span>
                          <span className="text-drona-gray">{item.name}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {!user && (
                  <div className="mt-4">
                    <Link to="/auth">
                      <Button variant="default" size="sm" className="w-full">
                        Login to Access
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
