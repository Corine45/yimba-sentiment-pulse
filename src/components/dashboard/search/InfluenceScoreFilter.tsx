
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";

interface InfluenceScoreFilterProps {
  influenceScore: number[];
  onInfluenceScoreChange: (score: number[]) => void;
}

export const InfluenceScoreFilter = ({ 
  influenceScore, 
  onInfluenceScoreChange 
}: InfluenceScoreFilterProps) => {
  return (
    <div className="space-y-3">
      <Label className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4" />
        <span>Influence score</span>
      </Label>
      <div className="px-3">
        <Slider
          value={influenceScore}
          onValueChange={onInfluenceScoreChange}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>0</span>
          <span className="font-medium">{influenceScore[0]}</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};
