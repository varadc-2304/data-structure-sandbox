
import React from 'react';
import { ListOrdered, Settings, Play, ArrowRight, Check } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <ListOrdered size={32} />,
      title: "Select an Algorithm",
      description: "Choose from our extensive library of algorithms across different categories."
    },
    {
      icon: <Settings size={32} />,
      title: "Input Data or Use Examples",
      description: "Enter your own data or use our pre-configured examples to get started quickly."
    },
    {
      icon: <Play size={32} />,
      title: "Visualize the Execution",
      description: "Step through each part of the algorithm and see how it works in real-time."
    },
    {
      icon: <Check size={32} />,
      title: "Analyze the Results",
      description: "Compare different algorithms and understand their efficiency and trade-offs."
    }
  ];

  return (
    <div className="py-20 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="drona-chip mb-4">Simple Process</div>
          <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl">How It Works</h2>
          <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-lg text-drona-gray max-w-3xl mx-auto">
            Drona makes it easy to visualize and understand complex algorithms in just a few steps
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 w-16 h-16 rounded-full bg-drona-green/10 flex items-center justify-center text-drona-green border-4 border-white">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-drona-dark mb-2">{step.title}</h3>
                  <p className="text-drona-gray">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 transform translate-x-1/2 text-drona-green">
                    <ArrowRight size={24} />
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

export default HowItWorks;
