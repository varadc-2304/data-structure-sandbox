
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Linkedin, Heart, BookOpen, Code, Cpu, Brain } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-card via-card to-secondary/20 mt-auto section-shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Drona</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              An interactive visualization platform for computer science education. Master data structures, algorithms, 
              and system concepts through hands-on visualizations and real-time simulations.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Interactive Learning</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="h-4 w-4 text-primary" />
                <span>Open Source</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard/data-structures" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Data Structures
                </Link>
              </li>
              <li>
                <Link to="/dashboard/algorithms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Algorithms
                </Link>
              </li>
              <li>
                <Link to="/dashboard/cpu-scheduling" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  CPU Scheduling
                </Link>
              </li>
              <li>
                <Link to="/dashboard/page-replacement" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Memory Management
                </Link>
              </li>
              <li>
                <Link to="/dashboard/disk-scheduling" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Disk Scheduling
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Cpu className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Real-time algorithm visualization</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Step-by-step explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <Code className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Interactive simulations</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Comprehensive CS coverage</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:support@drona.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  support@drona.com
                </a>
              </li>
              <li className="flex items-center gap-4 mt-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-xs text-muted-foreground text-center md:text-left">
                © 2025 Ikshvaku Innovations. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-primary fill-primary" />
                <span>in India</span>
                <span className="ml-2 text-primary font-medium text-base">नमस्ते 🙏</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-primary transition-colors">Terms and Conditions</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

