
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <img src="/lovable-uploads/c03333c1-1cd7-4c07-9556-89ea83c71d01.png" alt="Drona Logo" className="h-10 w-10" />
              <span className="ml-2 text-xl font-bold text-drona-green">Drona</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Visualizing computer science concepts to make learning intuitive and engaging.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/data-structures" className="text-gray-500 hover:text-drona-green">Data Structures</Link></li>
              <li><Link to="/algorithms" className="text-gray-500 hover:text-drona-green">Algorithms</Link></li>
              <li><Link to="/cpu-scheduling" className="text-gray-500 hover:text-drona-green">CPU Scheduling</Link></li>
              <li><Link to="/page-replacement" className="text-gray-500 hover:text-drona-green">Page Replacement</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-drona-green">Documentation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-drona-green">Tutorials</a></li>
              <li><a href="#" className="text-gray-500 hover:text-drona-green">Examples</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-drona-green">Support</a></li>
              <li><a href="#" className="text-gray-500 hover:text-drona-green">Feedback</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Drona. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
