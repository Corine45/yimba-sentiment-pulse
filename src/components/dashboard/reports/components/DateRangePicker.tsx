
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays } from "lucide-react";

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  disabled?: boolean;
}

export const DateRangePicker = ({ onDateRangeChange, disabled }: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value && endDate) {
      onDateRangeChange(value, endDate);
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    if (startDate && value) {
      onDateRangeChange(startDate, value);
    }
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center">
          <CalendarDays className="w-4 h-4 mr-2" />
          Période personnalisée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Date de début
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              max={endDate || getMaxDate()}
              disabled={disabled}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              Date de fin
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate}
              max={getMaxDate()}
              disabled={disabled}
              className="w-full"
            />
          </div>
        </div>
        
        {startDate && endDate && (
          <div className="text-sm text-blue-700 bg-blue-100 p-2 rounded">
            Période sélectionnée : {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
