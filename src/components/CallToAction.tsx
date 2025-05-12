
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  const { user } = useAuth();
  
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="py-16 bg-drona-green/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-drona-dark mb-6">
          Bring Clarity to Complexity. Let Your Team or Students Visualize Algorithms Like Never Before.
        </h2>
        <p className="text-lg text-drona-gray mb-10 max-w-3xl mx-auto">
          Join thousands of educators and students who are already using Drona to master complex computer science concepts through interactive visualizations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link to="/data-structures">
              <Button size="lg" className="bg-drona-green hover:bg-drona-green/90">
                Start Exploring Now
              </Button>
            </Link>
          ) : (
            <>
              <button onClick={scrollToContactForm}>
                <Button size="lg" className="bg-drona-green hover:bg-drona-green/90">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </button>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-drona-green text-drona-green hover:bg-drona-green hover:text-white">
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Continue
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
