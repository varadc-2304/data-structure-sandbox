
import React from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/30 min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(142,76%,36%,0.03),transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.5)_1px,transparent_0)] [background-size:20px_20px]"
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              Visualize &amp; Learn
              <span className="block text-primary mt-2">Computer Science</span>
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
              Master data structures, algorithms, and OS concepts through interactive visualizations 
              that make complex concepts crystal clear.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
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
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-10 h-10 px-4 rounded-full border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/70 transition-colors group"
              onClick={() => {
                const section = document.getElementById('explore-section');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              <span className="mr-2 text-sm font-medium">Explore now</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
