
import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <div className="py-20 bg-white" id="contact-form">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="drona-chip mb-4">Get in Touch</div>
            <h2 className="text-3xl font-bold text-drona-dark sm:text-4xl mb-6">Contact Sales</h2>
            <p className="text-drona-gray mb-8 max-w-xl">
              Interested in bringing Drona to your classroom or organization? Fill out the form and our team will get back to you within 24 hours.
            </p>
            
            <div className="bg-drona-green/5 p-6 rounded-xl border border-drona-green/10">
              <h3 className="text-xl font-bold text-drona-dark mb-4">Why teams choose Drona</h3>
              <ul className="space-y-3">
                {[
                  "Comprehensive algorithm visualization suite",
                  "Interactive learning experience for students",
                  "Simplified teaching of complex concepts",
                  "Time-saving educational resource",
                  "Continuous updates with new algorithms"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-drona-green mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex-1">
            {isSubmitted ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border border-drona-green/20 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-drona-green/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-8 w-8 text-drona-green" />
                </div>
                <h3 className="text-2xl font-bold text-drona-dark mb-2">Thank You!</h3>
                <p className="text-drona-gray mb-6">
                  Your message has been sent successfully. Our team will contact you soon.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-drona-dark mb-6">Send us a message</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input 
                      id="company"
                      name="company"
                      placeholder="Your company or organization"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
