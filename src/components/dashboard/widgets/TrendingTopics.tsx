
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TrendingTopics = () => {
  const trendingTopics = [
    { topic: "éducation", mentions: 1234, sentiment: "positive", change: "+15%" },
    { topic: "politique", mentions: 987, sentiment: "negative", change: "-8%" },
    { topic: "économie", mentions: 756, sentiment: "neutral", change: "+3%" },
    { topic: "santé", mentions: 654, sentiment: "positive", change: "+22%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sujets tendances</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium capitalize">#{topic.topic}</div>
                <div className="text-sm text-gray-600">{topic.mentions} mentions</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  topic.sentiment === "positive" ? "bg-green-100 text-green-800" :
                  topic.sentiment === "negative" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {topic.sentiment === "positive" ? "Positif" :
                   topic.sentiment === "negative" ? "Négatif" : "Neutre"}
                </span>
                <span className={`text-sm font-medium ${
                  topic.change.startsWith("+") ? "text-green-600" : "text-red-600"
                }`}>
                  {topic.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
