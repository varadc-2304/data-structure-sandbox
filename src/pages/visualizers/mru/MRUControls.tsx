import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MRUControlsProps {
  framesCount: number;
  inputReference: string;
  speed: number;
  currentStep: number;
  pageReferencesLength: number;
  isPlaying: boolean;
  pageReferences: number[];
  onFramesCountChange: (value: number) => void;
  onInputReferenceChange: (value: string) => void;
  onSpeedChange: (value: number[]) => void;
  onAddReference: () => void;
  onRewind: () => void;
  onPreviousStep: () => void;
  onTogglePlayPause: () => void;
  onNextStep: () => void;
  onFastForward: () => void;
  onReset: () => void;
  onGoToStep: (step: number) => void;
  onRemoveReference: (index: number) => void;
}

const MRUControls = ({
  framesCount,
  inputReference,
  pageReferences,
  onFramesCountChange,
  onInputReferenceChange,
  onAddReference,
  onRemoveReference,
}: MRUControlsProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frames" className="text-xs text-muted-foreground">Number of Frames</Label>
            <Input
              id="frames"
              type="number"
              min={1}
              max={10}
              value={framesCount}
              onChange={(e) => onFramesCountChange(Number(e.target.value))}
              className="h-8 text-sm mt-0.5"
            />
          </div>

          <div className="border-t pt-3">
            <Label className="text-xs text-muted-foreground mb-2 block">Add Page Reference</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., 1, 2, 3"
                value={inputReference}
                onChange={(e) => onInputReferenceChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onAddReference()}
                className="h-8 text-sm"
              />
              <Button onClick={onAddReference} size="sm" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {pageReferences.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Page References ({pageReferences.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase">Page</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageReferences.map((page, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap text-xs">{idx + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">{page}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveReference(idx)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MRUControls;
