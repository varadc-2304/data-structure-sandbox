import React from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListNode, LinkedListOperation } from "./useSinglyLinkedList";

interface LinkedListBoardProps {
  orderedNodes: ListNode[];
  lastOperation: LinkedListOperation | null;
  operationTarget: number | null;
  highlightedArrow?: number | null;
}

export const LinkedListBoard = ({ orderedNodes, lastOperation, operationTarget, highlightedArrow = null }: LinkedListBoardProps) => {
  return (
    <div className="mb-6 relative overflow-x-auto w-full">
      <div className="flex flex-col items-center w-full">
        {/* Horizontal Linked List Container - Open from both sides */}
        <div className="flex items-center justify-center w-full">
          {/* Left opening (HEAD) */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-3 bg-muted rounded-l-lg border-2 border-r-0 border-border relative" style={{ transform: "perspective(100px) rotateY(-5deg)" }}>
              <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-muted to-muted/80 rounded-l-lg"></div>
            </div>
            <div className="text-xs font-semibold text-primary mt-1">HEAD</div>
          </div>
          
          {/* Linked List container */}
          <div className="flex-1 border-2 border-border border-x-0 bg-secondary rounded-none p-4 min-h-[150px] flex items-center overflow-x-auto">
            {orderedNodes.length === 0 ? (
              <div className="flex items-center justify-center w-full py-8 text-muted-foreground">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>Linked list is empty. Add elements using the controls below.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                {orderedNodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={cn(
                          "min-w-[80px] w-[80px] h-20 rounded-lg border-2 flex flex-col justify-center items-center transition-all duration-300 shadow-sm bg-card",
                          {
                            "border-primary bg-primary/10 shadow-md scale-110 animate-bounce":
                              operationTarget === index && lastOperation === "search",
                            "border-primary bg-primary/10 shadow-md scale-110":
                              operationTarget === index && lastOperation !== "search",
                            "border-success bg-success/20 shadow-lg": 
                              operationTarget === index && lastOperation === "search",
                            "border-border bg-card": operationTarget !== index,
                          }
                        )}
                      >
                        <div className="text-lg font-bold text-foreground">{node.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          [{index}]
                        </div>
                      </div>
                    </div>

                    {/* Connecting edge/arrow */}
                    {node.next !== null && (
                      <div className="flex items-center flex-shrink-0">
                        <div className="relative flex items-center">
                          {/* Arrow line */}
                          <div className={cn(
                            "h-0.5 w-12 transition-all duration-300",
                            highlightedArrow === index 
                              ? "bg-primary" 
                              : "bg-muted-foreground"
                          )}></div>
                          {/* Arrow head */}
                          <ArrowRight 
                            className={cn(
                              "h-5 w-5 transition-all duration-300 absolute right-0",
                              highlightedArrow === index 
                                ? "text-primary scale-125" 
                                : "text-muted-foreground"
                            )} 
                          />
                        </div>
                      </div>
                    )}

                    {/* NULL indicator for tail */}
                    {node.next === null && index === orderedNodes.length - 1 && (
                      <div className="flex items-center flex-shrink-0 ml-2">
                        <div className="px-2 py-1 text-xs text-muted-foreground bg-muted rounded border border-border">
                          NULL
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          
          {/* Right opening (TAIL) */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-3 bg-muted rounded-r-lg border-2 border-l-0 border-border relative" style={{ transform: "perspective(100px) rotateY(5deg)" }}>
              <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-l from-muted to-muted/80 rounded-r-lg"></div>
            </div>
            <div className="text-xs font-semibold text-primary mt-1">TAIL</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListBoard;
