
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, HardDrive, FileText, Zap, Users, TrendingUp, AlertTriangle, Image } from "lucide-react";
import { ReportTemplate } from "../types/templateTypes";

interface TemplateCardProps {
  template: ReportTemplate;
  onUseTemplate: (template: ReportTemplate) => void;
  disabled?: boolean;
}

export const TemplateCard = ({ template, onUseTemplate, disabled }: TemplateCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'executive': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'demographic': return <Users className="w-5 h-5 text-green-600" />;
      case 'ai': return <Zap className="w-5 h-5 text-purple-600" />;
      case 'crisis': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'trends': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'multimedia': return <Image className="w-5 h-5 text-pink-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'executive': return 'border-blue-200 hover:border-blue-300 bg-blue-50';
      case 'demographic': return 'border-green-200 hover:border-green-300 bg-green-50';
      case 'ai': return 'border-purple-200 hover:border-purple-300 bg-purple-50';
      case 'crisis': return 'border-red-200 hover:border-red-300 bg-red-50';
      case 'trends': return 'border-orange-200 hover:border-orange-300 bg-orange-50';
      case 'multimedia': return 'border-pink-200 hover:border-pink-300 bg-pink-50';
      default: return 'border-gray-200 hover:border-gray-300 bg-gray-50';
    }
  };

  return (
    <Card className={`cursor-pointer transition-all duration-200 ${getCategoryColor(template.category)} ${disabled ? 'opacity-50' : 'hover:shadow-md'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(template.category)}
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">{template.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Fonctionnalités incluses:</h4>
          <div className="flex flex-wrap gap-1">
            {template.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {template.estimatedTime}
          </div>
          <div className="flex items-center">
            <HardDrive className="w-3 h-3 mr-1" />
            {template.estimatedSize}
          </div>
        </div>

        <Button 
          onClick={() => onUseTemplate(template)}
          disabled={disabled}
          className="w-full"
          variant="outline"
        >
          Utiliser ce modèle
        </Button>
      </CardContent>
    </Card>
  );
};
