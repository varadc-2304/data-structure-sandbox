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
        "group bg-card rounded-lg p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300 block h-full section-shadow hover:scale-[1.02]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-all duration-300 group-hover:scale-110 section-shadow">
            <div className="text-primary group-hover:text-primary-foreground transition-colors duration-300">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
            {title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground flex-grow mb-4 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="text-primary font-medium flex items-center text-sm mt-auto group-hover:gap-2 transition-all duration-300">
          <span>Explore</span>
          <ArrowRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
