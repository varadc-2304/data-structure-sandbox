
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
  delay?: number;
}

const CategoryCard = ({ title, description, icon, to, className, delay = 0 }: CategoryCardProps) => {
  return (
    <Link 
      to={to}
      className={cn(
        "group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 rounded-3xl p-8 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:scale-105 backdrop-blur-sm block animate-scale-in", 
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-drona-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-drona-green/20 to-drona-green/10 text-drona-green mr-5 group-hover:bg-drona-green group-hover:text-white transition-all duration-500 shadow-lg group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-drona-dark group-hover:text-drona-green transition-colors duration-300">
            {title}
          </h3>
        </div>
        <p className="text-drona-gray flex-grow mb-6 leading-relaxed text-base">
          {description}
        </p>
        <div className="text-drona-green font-bold flex items-center text-lg group-hover:text-drona-dark transition-colors duration-300">
          <span className="mr-3">Explore Now</span>
          <ArrowRight className="w-5 h-5 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
