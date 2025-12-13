
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import SEO from '@/components/SEO';
import { ArrowLeft, Target, Mountain, Route } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const AIAlgorithms = () => {
  return (
    <>
      <SEO 
        title="AI Algorithms Visualization | K-means, Hill Climbing, A* Pathfinding | Drona"
        description="Explore artificial intelligence and machine learning algorithms with interactive visualizations. Learn K-means clustering, Hill Climbing optimization, A* pathfinding, and other AI algorithms through hands-on simulations."
        keywords="AI algorithms, machine learning visualization, k-means clustering, hill climbing algorithm, A star algorithm, pathfinding, AI tutorial, machine learning education"
      />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24 pb-12">
        <div className="mb-8 md:mb-12">
          <RouterLink to="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">AI Algorithms</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Explore artificial intelligence and machine learning algorithms with interactive visualizations. 
              Understand how AI algorithms solve complex problems through intelligent search and optimization.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Heuristic search and optimization techniques</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Clustering and pattern recognition</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Pathfinding and graph traversal algorithms</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Cost functions and evaluation metrics</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard
            title="K-means Clustering"
            description="Watch K-means algorithm find clusters in data through iterative centroid updates and point assignments."
            icon={<Target size={28} />}
            to="/dashboard/ai-algorithms/kmeans"
          />
          <CategoryCard
            title="Hill Climbing Algorithm"
            description="See how hill climbing searches for optimal solutions by moving to better neighboring states."
            icon={<Mountain size={28} />}
            to="/dashboard/ai-algorithms/hill-climbing"
          />
          <CategoryCard
            title="A* Pathfinding Algorithm"
            description="Watch A* algorithm find the optimal path using heuristics and cost evaluation functions."
            icon={<Route size={28} />}
            to="/dashboard/ai-algorithms/a-star"
          />
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Algorithm Performance Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-foreground">Type</th>
                    <th className="text-left p-3 font-semibold text-foreground">Complexity</th>
                    <th className="text-left p-3 font-semibold text-foreground">Optimality</th>
                    <th className="text-left p-3 font-semibold text-foreground">Use Case</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">K-means</td>
                    <td className="p-3">Clustering</td>
                    <td className="p-3">O(n·k·d·i)</td>
                    <td className="p-3">Local optimum</td>
                    <td className="p-3">Data segmentation</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Hill Climbing</td>
                    <td className="p-3">Optimization</td>
                    <td className="p-3">O(b·d)</td>
                    <td className="p-3">Local optimum</td>
                    <td className="p-3">Continuous optimization</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">A*</td>
                    <td className="p-3">Pathfinding</td>
                    <td className="p-3">O(b^d)</td>
                    <td className="p-3">Optimal</td>
                    <td className="p-3">Graph traversal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              AI Algorithm Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Pattern Recognition</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Identify hidden patterns and structures in complex data</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mountain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Optimal Solutions</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Find optimal or near-optimal solutions efficiently</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Route className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Intelligent Search</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Navigate complex problem spaces with heuristics</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl mb-3">Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <p>• A* algorithm is optimal when using an admissible heuristic</p>
              <p>• K-means clustering requires specifying the number of clusters beforehand</p>
              <p>• Hill climbing can get stuck in local optima without random restarts</p>
              <p>• Heuristic functions guide search algorithms toward promising solutions</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default AIAlgorithms;
