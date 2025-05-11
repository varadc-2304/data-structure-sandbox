
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PreviewCardProps {
  title: string;
  description: string;
  path: string;
  imageComponent: React.ReactNode;
  index: number;
}

const PreviewCard = ({ title, description, path, imageComponent, index }: PreviewCardProps) => {
  const { user } = useAuth();
  
  return (
    <Card className="overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in" 
         style={{ animationDelay: `${index * 100 + 200}ms` }}>
      <div className="p-4 bg-drona-green/5 h-56 flex items-center justify-center">
        {imageComponent}
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-drona-dark">{title}</h3>
        <p className="text-drona-gray mb-4">{description}</p>
        {user ? (
          <Link to={path}>
            <Button className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Try Live Visualization
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button className="w-full">
              Login to Access
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

const VisualizerPreview = () => {
  // Preview visualization components
  const DataStructurePreview = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        <circle cx="100" cy="30" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="50" cy="80" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="150" cy="80" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="25" cy="130" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="75" cy="130" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="125" cy="130" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="175" cy="130" r="15" fill="#2E8B57" fillOpacity="0.7" />
        <line x1="100" y1="45" x2="50" y2="65" stroke="#2E8B57" strokeWidth="2" />
        <line x1="100" y1="45" x2="150" y2="65" stroke="#2E8B57" strokeWidth="2" />
        <line x1="50" y1="95" x2="25" y2="115" stroke="#2E8B57" strokeWidth="2" />
        <line x1="50" y1="95" x2="75" y2="115" stroke="#2E8B57" strokeWidth="2" />
        <line x1="150" y1="95" x2="125" y2="115" stroke="#2E8B57" strokeWidth="2" />
        <line x1="150" y1="95" x2="175" y2="115" stroke="#2E8B57" strokeWidth="2" />
        <text x="97" y="35" fontSize="12" fill="#fff">A</text>
        <text x="47" y="85" fontSize="12" fill="#fff">B</text>
        <text x="147" y="85" fontSize="12" fill="#fff">C</text>
      </svg>
    </div>
  );

  const CPUSchedulingPreview = () => (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <svg width="200" height="160" viewBox="0 0 200 160">
          <rect x="25" y="30" width="150" height="20" rx="3" fill="#2E8B57" fillOpacity="0.6" />
          <rect x="25" y="60" width="100" height="20" rx="3" fill="#2E8B57" fillOpacity="0.8" />
          <rect x="125" y="60" width="50" height="20" rx="3" fill="#2E8B57" fillOpacity="0.4" />
          <rect x="25" y="90" width="70" height="20" rx="3" fill="#2E8B57" fillOpacity="0.7" />
          <rect x="95" y="90" width="80" height="20" rx="3" fill="#2E8B57" fillOpacity="0.5" />
          <text x="30" y="43" fontSize="10" fill="#fff">Process 1</text>
          <text x="30" y="73" fontSize="10" fill="#fff">Process 2</text>
          <text x="130" y="73" fontSize="10" fill="#fff">P3</text>
          <text x="30" y="103" fontSize="10" fill="#fff">Process 4</text>
          <text x="100" y="103" fontSize="10" fill="#fff">Process 5</text>
          <line x1="25" y1="120" x2="175" y2="120" stroke="#888" strokeWidth="1" />
          <text x="20" y="135" fontSize="8" fill="#888">0</text>
          <text x="70" y="135" fontSize="8" fill="#888">5</text>
          <text x="120" y="135" fontSize="8" fill="#888">10</text>
          <text x="170" y="135" fontSize="8" fill="#888">15</text>
          <text x="100" y="150" fontSize="10" fill="#888">Time</text>
        </svg>
      </div>
    </div>
  );

  const DiskSchedulingPreview = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        <line x1="30" y1="30" x2="30" y2="130" stroke="#888" strokeWidth="2" />
        <line x1="30" y1="130" x2="180" y2="130" stroke="#888" strokeWidth="2" />
        <text x="15" y="30" fontSize="10" fill="#888">0</text>
        <text x="15" y="80" fontSize="10" fill="#888">100</text>
        <text x="10" y="130" fontSize="10" fill="#888">200</text>
        <text x="100" y="145" fontSize="10" fill="#888">Disk Position</text>
        <text x="5" y="80" fontSize="10" transform="rotate(-90, 5, 80)" fill="#888">Track #</text>
        
        <circle cx="30" cy="50" r="5" fill="#2E8B57" />
        <circle cx="60" cy="90" r="5" fill="#2E8B57" />
        <circle cx="90" cy="40" r="5" fill="#2E8B57" />
        <circle cx="120" cy="110" r="5" fill="#2E8B57" />
        <circle cx="150" cy="70" r="5" fill="#2E8B57" />
        <circle cx="180" cy="30" r="5" fill="#2E8B57" />
        
        <path d="M30,50 L60,90 L90,40 L120,110 L150,70 L180,30" 
              stroke="#2E8B57" strokeWidth="2" fill="none" />
      </svg>
    </div>
  );

  const PageReplacementPreview = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        <rect x="20" y="20" width="160" height="120" rx="3" fill="#f5f5f5" stroke="#ddd" />
        <line x1="20" y1="50" x2="180" y2="50" stroke="#ddd" strokeWidth="1" />
        <line x1="20" y1="80" x2="180" y2="80" stroke="#ddd" strokeWidth="1" />
        <line x1="20" y1="110" x2="180" y2="110" stroke="#ddd" strokeWidth="1" />
        
        <rect x="40" y="25" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.7" />
        <rect x="80" y="25" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.4" />
        <rect x="120" y="25" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.6" />
        
        <rect x="40" y="55" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.5" />
        <rect x="80" y="55" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.7" />
        <rect x="120" y="55" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.3" />
        
        <rect x="40" y="85" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.3" />
        <rect x="80" y="85" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.6" />
        <rect x="120" y="85" width="30" height="20" rx="2" fill="#2E8B57" fillOpacity="0.8" />
        
        <circle cx="55" cy="130" r="8" fill="#2E8B57" fillOpacity="0.6" stroke="#fff" strokeWidth="2" />
        <circle cx="95" cy="130" r="8" fill="#2E8B57" fillOpacity="0.4" stroke="#fff" strokeWidth="2" />
        <circle cx="135" cy="130" r="8" fill="none" stroke="#2E8B57" strokeWidth="2" />
        
        <text x="52" y="37" fontSize="10" fill="#fff">4</text>
        <text x="92" y="37" fontSize="10" fill="#fff">2</text>
        <text x="132" y="37" fontSize="10" fill="#fff">7</text>
        <text x="52" y="67" fontSize="10" fill="#fff">3</text>
        <text x="92" y="67" fontSize="10" fill="#fff">4</text>
        <text x="132" y="67" fontSize="10" fill="#fff">1</text>
        <text x="52" y="97" fontSize="10" fill="#fff">1</text>
        <text x="92" y="97" fontSize="10" fill="#fff">7</text>
        <text x="132" y="97" fontSize="10" fill="#fff">8</text>
        <text x="52" y="134" fontSize="10" fill="#fff">3</text>
        <text x="92" y="134" fontSize="10" fill="#fff">2</text>
      </svg>
    </div>
  );
  
  const AIMLPreview = () => (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="200" height="160" viewBox="0 0 200 160">
        {/* K-means visualization */}
        <circle cx="50" cy="40" r="5" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="60" cy="50" r="5" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="40" cy="60" r="5" fill="#2E8B57" fillOpacity="0.7" />
        <circle cx="55" cy="45" r="20" stroke="#2E8B57" strokeWidth="1" fill="none" strokeDasharray="3" />
        
        <circle cx="130" cy="50" r="5" fill="#2E8B57" fillOpacity="0.5" />
        <circle cx="150" cy="40" r="5" fill="#2E8B57" fillOpacity="0.5" />
        <circle cx="140" cy="60" r="5" fill="#2E8B57" fillOpacity="0.5" />
        <circle cx="140" cy="50" r="20" stroke="#2E8B57" strokeWidth="1" fill="none" strokeDasharray="3" />
        
        <circle cx="60" cy="110" r="5" fill="#2E8B57" fillOpacity="0.3" />
        <circle cx="40" cy="120" r="5" fill="#2E8B57" fillOpacity="0.3" />
        <circle cx="50" cy="130" r="5" fill="#2E8B57" fillOpacity="0.3" />
        <circle cx="50" cy="120" r="20" stroke="#2E8B57" strokeWidth="1" fill="none" strokeDasharray="3" />
        
        <circle cx="140" cy="110" r="5" fill="#2E8B57" fillOpacity="0.9" />
        <circle cx="150" cy="130" r="5" fill="#2E8B57" fillOpacity="0.9" />
        <circle cx="130" cy="120" r="5" fill="#2E8B57" fillOpacity="0.9" />
        <circle cx="140" cy="120" r="20" stroke="#2E8B57" strokeWidth="1" fill="none" strokeDasharray="3" />
        
        <circle cx="50" cy="45" r="3" fill="#333" />
        <circle cx="140" cy="50" r="3" fill="#333" />
        <circle cx="50" cy="120" r="3" fill="#333" />
        <circle cx="140" cy="120" r="3" fill="#333" />
      </svg>
    </div>
  );
  
  const previewItems = [
    {
      title: "Data Structures",
      description: "Visualize arrays, linked lists, trees, graphs and more with interactive operations",
      path: "/data-structures",
      imageComponent: <DataStructurePreview />
    },
    {
      title: "CPU Scheduling",
      description: "Compare FCFS, SJF, Round Robin, and Priority scheduling algorithms",
      path: "/cpu-scheduling",
      imageComponent: <CPUSchedulingPreview />
    },
    {
      title: "Disk Scheduling",
      description: "See how different disk scheduling algorithms optimize seek time",
      path: "/disk-scheduling",
      imageComponent: <DiskSchedulingPreview />
    },
    {
      title: "Page Replacement",
      description: "Understand memory management with FIFO, LRU, and MRU visualizations",
      path: "/page-replacement",
      imageComponent: <PageReplacementPreview />
    },
    {
      title: "AI/ML Algorithms",
      description: "Explore clustering, classification, and pathfinding algorithms",
      path: "/algorithms",
      imageComponent: <AIMLPreview />
    }
  ];

  return (
    <div className="py-20 bg-drona-green/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="drona-chip mb-4">Interactive Learning</div>
          <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl">Visualizer Preview</h2>
          <div className="w-24 h-1 bg-drona-green mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-lg text-drona-gray max-w-3xl mx-auto">
            Explore our comprehensive library of algorithm visualizations designed for intuitive learning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewItems.map((item, index) => (
            <PreviewCard
              key={index}
              title={item.title}
              description={item.description}
              path={item.path}
              imageComponent={item.imageComponent}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizerPreview;
