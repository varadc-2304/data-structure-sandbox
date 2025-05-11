
import React from 'react';
import { Layout, Lightbulb, Heart, Clock } from 'lucide-react';

const WhyChooseDrona = () => {
  const reasons = [
    {
      icon: <Layout size={40} />,
      title: "All-in-one visualizer suite",
      description: "No need for multiple tools. Drona combines all essential computer science concept visualizers in one platform."
    },
    {
      icon: <Lightbulb size={40} />,
      title: "Built for clarity and interactivity",
      description: "Our visualizations are designed to make complex concepts simple through interactive, step-by-step exploration."
    },
    {
      icon: <Heart size={40} />,
      title: "Loved by students and educators",
      description: "Join thousands of students and educators who use Drona to enhance their learning and teaching experience."
    },
    {
      icon: <Clock size={40} />,
      title: "Time-saving, intuitive platform",
      description: "Quickly grasp difficult concepts that might take hours to understand through traditional methods."
    }
  ];

  return (
    <div className="py-20 bg-drona-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="drona-chip mb-4">Our Value Proposition</div>
          <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl">Why Choose Drona?</h2>
          <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-drona-green/10 flex items-center justify-center text-drona-green">
                {reason.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-drona-dark mb-2">{reason.title}</h3>
                <p className="text-drona-gray">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseDrona;
