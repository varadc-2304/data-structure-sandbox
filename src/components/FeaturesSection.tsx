
import React from 'react';
import { Code, Brain, LineChart, Cpu, Award } from 'lucide-react';

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

const FeaturesSection = () => {
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
      </div>
    </div>
  );
};

export default FeaturesSection;
