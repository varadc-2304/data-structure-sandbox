
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemedButtonProps extends ButtonProps {
  theme?: 'default' | 'green' | 'red' | 'arena' | 'drona';
}

const ThemedButton = React.forwardRef<HTMLButtonElement, ThemedButtonProps>(
  ({ className, theme = 'default', ...props }, ref) => {
    const themeClasses = {
      default: '',
      green: 'bg-drona-green hover:bg-drona-green/90 text-white',
      red: 'bg-arena-red hover:bg-arena-red/90 text-white',
      arena: 'bg-arena-red hover:bg-arena-red/90 text-white', 
      drona: 'bg-drona-green hover:bg-drona-green/90 text-white',
    };

    return (
      <Button 
        className={cn(themeClasses[theme], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

ThemedButton.displayName = 'ThemedButton';

export { ThemedButton };
