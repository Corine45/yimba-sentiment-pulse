
import { Card, CardContent } from "@/components/ui/card";

interface CaseStatisticsProps {
  cases: any[];
}

export const CaseStatistics = ({ cases }: CaseStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{cases.filter(c => c.status !== 'resolu').length}</div>
          <div className="text-sm text-blue-800">Cas actifs</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{cases.filter(c => c.status === 'en_cours').length}</div>
          <div className="text-sm text-orange-800">En intervention</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'resolu').length}</div>
          <div className="text-sm text-green-800">Résolus</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{cases.filter(c => c.priority === 'critique').length}</div>
          <div className="text-sm text-red-800">Priorité critique</div>
        </CardContent>
      </Card>
    </div>
  );
};
