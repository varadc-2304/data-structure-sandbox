import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Lock, CheckCircle2, Database, Cpu, MemoryStick, HardDrive, Calculator, Users, Award, BookOpen } from 'lucide-react';
import { Chrome } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

const Landing = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGetStarted = () => {
    setIsDialogOpen(true);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Set user in auth context
      setUser({
        id: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'User',
      });

      // Close dialog and navigate to dashboard
      setIsDialogOpen(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setIsLoading(false);
      // Error handling - you might want to show a toast here
    }
  };

  return (
    <>
      <SEO 
        title="Drona - Interactive Computer Science Visualization Platform | Learn Algorithms & Data Structures"
        description="Master computer science concepts through interactive visualizations. Learn data structures, algorithms, CPU scheduling, memory management, and AI algorithms with hands-on simulations and step-by-step animations. Free, open-source educational platform."
        keywords="computer science visualization, algorithm visualizer, data structure visualizer, learn algorithms, interactive CS education, algorithm animation, data structure animation, CPU scheduling simulator, page replacement algorithm, disk scheduling, AI algorithm visualization, free CS learning, open source education"
      />
      <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(142,76%,36%,0.03),transparent_50%)]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
            <div className="pt-20 pb-12 md:pt-28 md:pb-16">
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Secure & Trusted Platform</span>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                  Visualize &amp; Learn
                  <span className="block text-primary mt-2">Computer Science</span>
                </h1>
                <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                  Master data structures and algorithms through interactive visualizations 
                  that make complex concepts crystal clear.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground mb-8">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>100% Free</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>No Ads</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Open Source</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Privacy Focused</span>
                  </div>
                </div>
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="text-lg px-8 py-6 h-auto font-semibold"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="explore-section" className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl mb-4">
                Explore Computer Science Concepts
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Interactive visualizations to help you understand algorithms, data structures, 
                and OS concepts through engaging animations and step-by-step explanations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data Structures</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize arrays, linked lists, trees, graphs and understand how data is organized and accessed.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Algorithms</h3>
                <p className="text-sm text-muted-foreground">
                  Explore sorting, searching, and optimization algorithms with step-by-step animations.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">CPU Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Learn process scheduling algorithms like FCFS, SJF, Round Robin with interactive Gantt charts.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MemoryStick className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Memory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Understand page replacement algorithms including FIFO, LRU, and Optimal with visual simulations.
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Disk Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize disk scheduling algorithms like SCAN, C-SCAN, LOOK with seek time calculations.
                </p>
              </div>
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
                  Clear, step-by-step visualizations that help educators explain complex CS concepts with ease
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 section-shadow">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Proven for Learning</h4>
                  <p className="text-sm text-muted-foreground">
                  Interactive simulations that enable students to truly understand algorithms and data structures
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-200">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 section-shadow">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Open & Reliable</h4>
                  <p className="text-sm text-muted-foreground">
                  Free, ad-free, and privacy-focused platform trusted in classrooms and self-study
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

        {/* Sign In Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground text-center">
                Welcome to Drona
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <p className="text-sm text-muted-foreground text-center">
                Sign in to access interactive computer science visualizations
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-primary" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-primary" />
                  <span>Encrypted</span>
                </div>
              </div>
              <Button 
                onClick={handleGoogleSignIn}
                className="w-full h-12 text-base flex items-center justify-center gap-3"
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Chrome className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Landing;
