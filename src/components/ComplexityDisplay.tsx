import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, HardDrive } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComplexityInfo {
  operation: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description?: string;
}

export interface ComplexityDisplayProps {
  complexities: ComplexityInfo[];
  className?: string;
}

const ComplexityDisplay: React.FC<ComplexityDisplayProps> = ({ complexities, className }) => {
  if (complexities.length === 0) return null;

  return (
    <Card className={cn('border-2 border-border', className)}>
      <CardHeader className="pb-2 space-y-1">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Worst-Case Time & Space
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Worst-case costs for the key operations shown below.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {complexities.map((complexity, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-secondary/60 p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground">{complexity.operation}</h4>
                {complexity.description && (
                  <p className="text-xs text-muted-foreground mt-1">{complexity.description}</p>
                )}
              </div>
              <Clock className="h-4 w-4 text-primary shrink-0" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Worst-case time</span>
                <code className="text-foreground font-mono bg-card px-2 py-1 rounded border border-border">
                  {complexity.timeComplexity.worst}
                </code>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <HardDrive className="h-3 w-3 text-primary" />
                  Space
                </span>
                <code className="text-foreground font-mono bg-card px-2 py-1 rounded border border-border">
                  {complexity.spaceComplexity}
                </code>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComplexityDisplay;
