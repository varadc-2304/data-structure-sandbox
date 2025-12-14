import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TabConfig {
  value: string;
  label: string;
  component: React.ComponentType;
}

interface DataStructureCategoryProps {
  title: string;
  description: string;
  tabs: TabConfig[];
  defaultTab?: string;
}

const DataStructureCategory: React.FC<DataStructureCategoryProps> = ({
  title,
  description,
  tabs,
  defaultTab,
}) => {
  const { tab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab || defaultTab || tabs[0]?.value || '');

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-20 pb-12">
        <div className="mb-8">
          <RouterLink 
            to="/dashboard/data-structures" 
            className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Data Structures
          </RouterLink>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">
              {title}
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg max-w-4xl">
              {description}
            </p>
          </div>
        </div>
        
        {/* Note: Individual visualizers will render their own Navbar */}

        {tabs.length > 1 ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-fit justify-start bg-secondary p-1 h-auto overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium flex-shrink-0 whitespace-nowrap"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map((tab) => {
              const Component = tab.component;
              return (
                <TabsContent key={tab.value} value={tab.value} className="mt-0 -mx-4 sm:-mx-6 lg:-mx-8">
                  <div className="px-4 sm:px-6 lg:px-8">
                    <Component />
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : tabs.length === 1 ? (
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <div className="px-4 sm:px-6 lg:px-8">
              {(() => {
                const Component = tabs[0].component;
                return <Component />;
              })()}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DataStructureCategory;
