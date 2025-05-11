
import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="drona-chip mb-4">Stay Updated</div>
        <h2 className="text-2xl font-bold text-drona-dark mb-4">
          New visualizations added regularly
        </h2>
        <p className="text-drona-gray mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter to be the first to know about new algorithm visualizations, features, and educational resources.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="flex-grow">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              disabled={isSubscribed}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="h-12"
            disabled={isSubscribing || isSubscribed}
          >
            {isSubscribing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subscribing...
              </span>
            ) : isSubscribed ? (
              <span className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Subscribed
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Subscribe
              </span>
            )}
          </Button>
        </form>
        
        {isSubscribed && (
          <p className="mt-4 text-sm text-drona-green">
            Thank you for subscribing! Check your email for confirmation.
          </p>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
