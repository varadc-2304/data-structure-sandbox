import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedListActionsProps {
  value: string;
  position: string;
  onValueChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onInsertHead: () => void;
  onInsertTail: () => void;
  onInsertAtPosition: () => void;
  onDeleteHead: () => void;
  onDeleteTail: () => void;
  onDeleteAtPosition: () => void;
}

export const LinkedListActions = ({
  value,
  position,
  onValueChange,
  onPositionChange,
  onInsertHead,
  onInsertTail,
  onInsertAtPosition,
  onDeleteHead,
  onDeleteTail,
  onDeleteAtPosition,
}: LinkedListActionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Insert at Head</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Enter value"
            className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onInsertHead} variant="default" size="sm" className="flex-shrink-0">
            Insert
          </Button>
        </div>
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Insert at Tail</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Enter value"
            className="flex-1 min-w-0 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onInsertTail} variant="default" size="sm" className="flex-shrink-0">
            Insert
          </Button>
        </div>
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Insert at Position</span>
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <input
            type="number"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            placeholder="Position"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onInsertAtPosition} variant="default" size="sm" className="w-full">
            Insert
          </Button>
        </div>
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Delete Head</span>
        </h3>
        <Button onClick={onDeleteHead} variant="default" size="sm" className="w-full">
          Delete Head
        </Button>
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Delete Tail</span>
        </h3>
        <Button onClick={onDeleteTail} variant="default" size="sm" className="w-full">
          Delete Tail
        </Button>
      </div>

      <div className="bg-secondary rounded-xl p-4 border border-border w-full min-w-0">
        <h3 className="text-base sm:text-lg font-medium mb-3 flex items-center text-foreground">
          <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
          <span className="truncate">Delete at Position</span>
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            value={position}
            onChange={(e) => onPositionChange(e.target.value)}
            placeholder="Position"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onDeleteAtPosition} variant="default" size="sm" className="w-full">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkedListActions;
