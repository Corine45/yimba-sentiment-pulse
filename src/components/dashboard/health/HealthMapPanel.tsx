
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { HealthMap } from "./HealthMap";

interface HealthAlert {
  id: string;
  disease: string;
  location: string;
  severity: 'faible' | 'modéré' | 'critique';
  timestamp: string;
  source: string;
  verified: boolean;
}

interface HealthMapPanelProps {
  alerts: HealthAlert[];
}

export const HealthMapPanel = ({ alerts }: HealthMapPanelProps) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Cartographie des signaux
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HealthMap alerts={alerts} />
      </CardContent>
    </Card>
  );
};
