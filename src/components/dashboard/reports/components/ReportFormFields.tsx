
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORT_TYPES, PERIODS } from "../types/reportTypes";
import { DateRangePicker } from "./DateRangePicker";

interface ReportFormFieldsProps {
  reportType: string;
  period: string;
  customDateRange: {startDate: string, endDate: string} | null;
  onReportTypeChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  disabled: boolean;
}

export const ReportFormFields = ({
  reportType,
  period,
  customDateRange,
  onReportTypeChange,
  onPeriodChange,
  onDateRangeChange,
  disabled
}: ReportFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type de rapport *</label>
          <Select value={reportType} onValueChange={onReportTypeChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(REPORT_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Période *</label>
          <Select value={period} onValueChange={onPeriodChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PERIODS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {period === 'custom' && (
        <DateRangePicker 
          onDateRangeChange={onDateRangeChange}
          disabled={disabled}
        />
      )}
    </div>
  );
};
