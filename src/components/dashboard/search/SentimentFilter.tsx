
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SentimentFilterProps {
  sentimentFilter: string[];
  onSentimentChange: (sentiments: string[]) => void;
}

export const SentimentFilter = ({ sentimentFilter, onSentimentChange }: SentimentFilterProps) => {
  const handleSentimentToggle = (sentiment: string) => {
    onSentimentChange(
      sentimentFilter.includes(sentiment)
        ? sentimentFilter.filter(s => s !== sentiment)
        : [sentiment] // Only one sentiment at a time
    );
  };

  return (
    <div className="space-y-3">
      <Label>Sentiment</Label>
      <div className="flex flex-wrap gap-3">
        {[
          { value: 'negative', label: 'Negative', color: 'bg-red-100 text-red-800 border-red-200' },
          { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800 border-gray-200' },
          { value: 'positive', label: 'Positive', color: 'bg-green-100 text-green-800 border-green-200' }
        ].map((sentiment) => (
          <div key={sentiment.value} className="flex items-center space-x-2">
            <Checkbox
              id={`sentiment-${sentiment.value}`}
              checked={sentimentFilter.includes(sentiment.value)}
              onCheckedChange={() => handleSentimentToggle(sentiment.value)}
            />
            <Label 
              htmlFor={`sentiment-${sentiment.value}`}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${sentiment.color}`}
            >
              {sentiment.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
