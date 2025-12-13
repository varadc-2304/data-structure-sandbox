
import React, { useEffect } from 'react';
import Hero from '@/components/Hero';
import CategoryCard from '@/components/CategoryCard';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Database, Cpu, MemoryStick, HardDrive, Calculator, Users, Award, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Drona - Interactive Computer Science Visualization Platform | Learn Algorithms & Data Structures"
        description="Master computer science concepts through interactive visualizations. Learn data structures, algorithms, CPU scheduling, memory management, and AI algorithms with hands-on simulations and step-by-step animations. Free, open-source educational platform."
        keywords="computer science visualization, algorithm visualizer, data structure visualizer, learn algorithms, interactive CS education, algorithm animation, data structure animation, CPU scheduling simulator, page replacement algorithm, disk scheduling, AI algorithm visualization, free CS learning, open source education"
      />
      <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
        <Navbar />
        <Hero />
      
      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl mb-4">
              Explore Computer Science Concepts
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Interactive visualizations to help you understand algorithms, data structures, 
              and system concepts through engaging animations and step-by-step explanations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard
            title="Data Structures"
            description="Visualize arrays, linked lists, trees, graphs and understand how data is organized and accessed."
            icon={<Database size={32} />}
            to="/dashboard/data-structures"
          />
          <CategoryCard
            title="Algorithms"
            description="Explore sorting, searching, and optimization algorithms with step-by-step animations."
            icon={<Calculator size={32} />}
            to="/dashboard/algorithms"
          />
          <CategoryCard
            title="CPU Scheduling"
            description="Learn process scheduling algorithms like FCFS, SJF, Round Robin with interactive Gantt charts."
            icon={<Cpu size={32} />}
            to="/dashboard/cpu-scheduling"
          />
          <CategoryCard
            title="Memory Management"
            description="Understand page replacement algorithms including FIFO, LRU, and Optimal with visual simulations."
            icon={<MemoryStick size={32} />}
            to="/dashboard/page-replacement"
          />
          <CategoryCard
            title="Disk Scheduling"
            description="Visualize disk scheduling algorithms like SCAN, C-SCAN, LOOK with seek time calculations."
            icon={<HardDrive size={32} />}
            to="/dashboard/disk-scheduling"
          />
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-6 md:py-8 section-bg-alt relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border section-shadow-lg">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-6 md:mb-8 text-center">
              Trusted by Educators and Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 section-shadow">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Interactive Learning</h4>
                <p className="text-sm text-muted-foreground">
                  Hands-on visualizations that make complex concepts accessible to learners at all levels
                </p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 section-shadow">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Educational Excellence</h4>
                <p className="text-sm text-muted-foreground">
                  Designed by educators for educators, following best practices in computer science pedagogy
                </p>
              </div>
              <div className="text-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 section-shadow">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Comprehensive Coverage</h4>
                <p className="text-sm text-muted-foreground">
                  From basic data structures to advanced algorithms, covering all essential CS concepts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn by Doing Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center">
            <div className="bg-card rounded-lg p-6 md:p-8 border-2 border-primary/20 max-w-4xl mx-auto section-shadow-lg">
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-3 md:mb-4">
                Learn by Doing
              </h3>
              <p className="text-sm text-muted-foreground sm:text-base md:text-lg max-w-2xl mx-auto">
                Our interactive visualizations make complex concepts easy to understand. 
                Step through algorithms, manipulate data structures, and see real-time results.
              </p>
            </div>
          </div>
        </div>
      </section>

        <Footer />
      </div>
    </>
  );
};

export default Index;
