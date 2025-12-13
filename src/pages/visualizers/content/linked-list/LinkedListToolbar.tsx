import React from 'react';
import { Shuffle, Search, ArrowRight, ArrowLeftRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LinkedListToolbarProps {
  listSize: string;
  onListSizeChange: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onGenerate: () => void;
  onSearch: () => void;
  onTraverse: () => void;
  onReverse: () => void;
  onClear: () => void;
  isTraversing: boolean;
}

const LinkedListToolbar: React.FC<LinkedListToolbarProps> = ({
  listSize,
  onListSizeChange,
  searchValue,
  onSearchValueChange,
  onGenerate,
  onSearch,
  onTraverse,
  onReverse,
  onClear,
  isTraversing,
}) => (
  <div className="mb-4 space-y-4">
    <h2 className="text-lg font-semibold text-foreground sm:text-xl">Singly Linked List Visualization</h2>
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
          onChange={(e) => onSearchValueChange(e.target.value)}
          placeholder="Search value"
          className="w-28 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
        <Button onClick={onSearch} variant="outline" size="sm" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onTraverse}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          disabled={isTraversing}
        >
          <ArrowRight className="h-4 w-4" />
          Traverse
        </Button>
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

export default LinkedListToolbar;
