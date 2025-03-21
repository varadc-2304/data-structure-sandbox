
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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
        "arena-card block overflow-hidden group animate-scale-in", 
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-lg bg-arena-red/10 text-arena-red mr-4 group-hover:bg-arena-red group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-arena-dark">{title}</h3>
        </div>
        <p className="text-arena-gray flex-grow mb-4">{description}</p>
        <div className="text-arena-red font-medium flex items-center">
          <span className="mr-2">Explore</span>
          <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
