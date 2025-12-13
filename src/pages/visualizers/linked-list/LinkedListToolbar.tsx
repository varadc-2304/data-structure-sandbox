import { Shuffle, Search, ArrowLeftRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkedListToolbarProps {
  listSize: string;
  searchValue: string;
  onListSizeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onGenerate: () => void;
  onSearch: () => void;
  onReverse: () => void;
  onClear: () => void;
  title?: string;
}

export const LinkedListToolbar = ({
  listSize,
  searchValue,
  onListSizeChange,
  onSearchChange,
  onGenerate,
  onSearch,
  onReverse,
  onClear,
  title = "Singly Linked List Visualization",
}: LinkedListToolbarProps) => {
  return (
    <div className="mb-4 space-y-4">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            value={listSize}
            onChange={(e) => onListSizeChange(e.target.value)}
            placeholder="Size"
            className="w-24 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onGenerate} variant="outline" size="sm" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Generate
          </Button>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search value"
            className="w-28 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <Button onClick={onSearch} variant="outline" size="sm" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onReverse} variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Reverse
          </Button>
          <Button onClick={onClear} variant="outline" size="sm" className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LinkedListToolbar;
