import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ListNode } from './useSinglyLinkedList';

interface LinkedListCanvasProps {
  orderedNodes: ListNode[];
  operationTarget: number | null;
  lastOperation: string | null;
}

const LinkedListCanvas: React.FC<LinkedListCanvasProps> = ({
  orderedNodes,
  operationTarget,
  lastOperation,
}) => (
  <div className="mb-6 relative overflow-x-auto w-full">
    <div className="flex items-center bg-secondary rounded-lg p-4 border border-border min-h-[150px] w-full overflow-x-auto">
      {orderedNodes.length === 0 ? (
        <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Linked list is empty. Add elements using the controls below.</span>
        </div>
      ) : (
        <div className="flex items-end relative">
          {orderedNodes.map((node, index) => (
            <div key={node.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className="h-6 mb-1 flex items-center gap-1">
                  {index === 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary">
                      Head
                    </span>
                  )}
                  {index === orderedNodes.length - 1 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary">
                      Tail
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    'min-w-[80px] w-[80px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300',
                    {
                      'border-primary bg-primary/10 shadow-md scale-110 animate-bounce':
                        operationTarget === index && lastOperation === 'search',
                      'border-primary bg-primary/10 shadow-md scale-110':
                        operationTarget === index && lastOperation !== 'search',
                      'border-border bg-card': operationTarget !== index,
                    }
                  )}
                >
                  <div className="text-lg font-bold text-foreground">{node.value}</div>
                  <div className="text-xs text-muted-foreground">Index {index}</div>
                </div>
              </div>

              {node.next !== null && (
                <div className="flex items-center mx-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              {node.next === null && (
                <div className="flex items-center mx-2">
                  <div className="text-xs text-muted-foreground">NULL</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default LinkedListCanvas;
