
import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureGrid from '@/components/FeatureGrid';
import VisualizerPreview from '@/components/VisualizerPreview';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseDrona from '@/components/WhyChooseDrona';
import ContactForm from '@/components/ContactForm';
import CallToAction from '@/components/CallToAction';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Key Features */}
      <FeatureGrid />
      
      {/* Visualizer Preview */}
      <VisualizerPreview />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Why Choose Drona */}
      <WhyChooseDrona />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* Contact Form */}
      <ContactForm />
      
      {/* Newsletter Subscription */}
      <Newsletter />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
