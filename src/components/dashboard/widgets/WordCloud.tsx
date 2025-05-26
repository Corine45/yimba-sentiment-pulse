
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export const WordCloud = () => {
  const words = [
    { text: "éducation", size: 48, frequency: 234, color: "#3B82F6" },
    { text: "politique", size: 36, frequency: 189, color: "#10B981" },
    { text: "économie", size: 32, frequency: 156, color: "#F59E0B" },
    { text: "santé", size: 28, frequency: 134, color: "#EF4444" },
    { text: "jeunesse", size: 24, frequency: 98, color: "#8B5CF6" },
    { text: "développement", size: 20, frequency: 87, color: "#06B6D4" },
    { text: "emploi", size: 18, frequency: 76, color: "#84CC16" },
    { text: "formation", size: 16, frequency: 65, color: "#F97316" },
    { text: "infrastructure", size: 14, frequency: 54, color: "#EC4899" },
    { text: "innovation", size: 12, frequency: 43, color: "#6366F1" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-blue-600" />
          <span>Nuage de mots</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg p-8 min-h-[300px] flex flex-wrap items-center justify-center gap-4">
          {words.map((word, index) => (
            <span
              key={index}
              className="font-bold cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                fontSize: `${word.size}px`,
                color: word.color,
                lineHeight: 1.2,
              }}
              title={`${word.frequency} mentions`}
            >
              {word.text}
            </span>
          ))}
        </div>
        
        {/* Frequency Legend */}
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-sm">Fréquence des mots-clés</h4>
          <div className="grid grid-cols-2 gap-2">
            {words.slice(0, 6).map((word, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                <span className="font-medium" style={{ color: word.color }}>
                  {word.text}
                </span>
                <span className="text-gray-600">{word.frequency}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
