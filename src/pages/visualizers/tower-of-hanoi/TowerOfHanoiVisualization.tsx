import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain } from "lucide-react";

interface TowerOfHanoiVisualizationProps {
  towers: number[][];
  movingDisk: number | null;
  fromTower: number | null;
  toTower: number | null;
  numDisks: number;
}

const diskColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-700",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
];

const diskBorderColors = [
  "border-red-600",
  "border-blue-600",
  "border-green-700",
  "border-yellow-600",
  "border-purple-600",
  "border-pink-600",
  "border-indigo-600",
];

const TowerOfHanoiVisualization = ({ towers, movingDisk, fromTower, toTower, numDisks }: TowerOfHanoiVisualizationProps) => {
  const towerNames = ["Source", "Auxiliary", "Destination"];

  return (
    <Card className="shadow-lg border-2 border-drona-green/20 h-full">
      <CardHeader className="bg-gradient-to-r from-drona-green/5 to-drona-green/10">
        <CardTitle className="text-2xl font-bold text-drona-dark">Tower of Hanoi Visualization</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-4 min-h-[400px]">
          {towers.map((tower, towerIndex) => (
            <div key={towerIndex} className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-drona-dark mb-4">{towerNames[towerIndex]}</h3>
              <div className="flex flex-col-reverse items-center justify-end w-full h-[350px] border-b-4 border-drona-dark relative">
                {tower.length === 0 ? (
                  <div className="text-drona-gray text-sm">Empty</div>
                ) : (
                  tower.map((disk, diskIndex) => {
                    const isMoving = movingDisk === disk && (fromTower === towerIndex || toTower === towerIndex);
                    const width = `${(disk / numDisks) * 100 + 20}%`;
                    const colorIndex = (disk - 1) % diskColors.length;
                    return (
                      <div
                        key={diskIndex}
                        className={`${diskColors[colorIndex]} ${diskBorderColors[colorIndex]} border-2 rounded-lg flex items-center justify-center text-white font-bold transition-all duration-300 ${
                          isMoving ? "scale-110 shadow-lg" : ""
                        }`}
                        style={{
                          width,
                          height: "40px",
                          minWidth: "60px",
                        }}
                      >
                        {disk}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TowerOfHanoiVisualization;
