
import React from 'react';
import { List, Cpu, HardDrive, Folder, Code, Sliders, Globe } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="drona-card flex flex-col p-6 animate-fade-in hover:border-drona-green duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 text-drona-green">{icon}</div>
      <h3 className="text-xl font-bold text-drona-dark mb-2">{title}</h3>
      <p className="text-drona-gray">{description}</p>
    </div>
  );
};

const features = [
  {
    icon: <List size={32} />,
    title: "Data Structure Simulations",
    description: "Visualize arrays, linked lists, trees, graphs, and more with step-by-step operations."
  },
  {
    icon: <Cpu size={32} />,
    title: "CPU Scheduling Algorithms",
    description: "See how FCFS, SJF, Priority, and Round Robin algorithms manage process execution."
  },
  {
    icon: <HardDrive size={32} />,
    title: "Disk Management Techniques",
    description: "Compare FCFS, SSTF, SCAN, and other disk scheduling methods side by side."
  },
  {
    icon: <Folder size={32} />,
    title: "Page Replacement Methods",
    description: "Understand FIFO, LRU, MRU, and other page replacement algorithms visually."
  },
  {
    icon: <Sliders size={32} />,
    title: "Full User Control",
    description: "Adjust parameters, step through simulations, and see results in real-time."
  },
  {
    icon: <Globe size={32} />,
    title: "Unified Platform",
    description: "Access all computer science visualizations in one comprehensive, intuitive environment."
  }
];

const FeatureGrid = () => {
  return (
    <div className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="drona-chip mb-4">Why Choose Drona</div>
          <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl">Key Features</h2>
          <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xl text-drona-gray max-w-2xl mx-auto">
            Our platform provides everything you need to visualize and understand complex computer science concepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
