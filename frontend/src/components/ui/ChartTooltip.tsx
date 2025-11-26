import { type TooltipProps as RechartsTooltipProps } from 'recharts';
import {
  Card,
  CardContent,
} from './Card';

interface CustomTooltipProps extends RechartsTooltipProps<any, any> {
  payload?: any[];
  label?: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {

    return (
      <Card className="z-50 shadow-lg border-0">
        <CardContent className="p-3 space-y-2 bg-white">
          {/* Tháng / Label */}
          <p className="text-sm font-semibold text-gray-800">
            {label}
          </p>

          {/* Các giá trị */}
          {payload.map((entry: any, index: number) => {
            const rawValue = entry.value;
            const value = typeof rawValue === 'number' ? rawValue : 0; // Provide a default or handle non-numeric values
            const formattedValue = entry.name === 'revenue' || entry.dataKey === 'revenue'
              ? `₫${value.toLocaleString('vi-VN')}`
              : rawValue; // Keep original rawValue if not revenue for other types

            return (
              <div key={index} className="flex items-center justify-between gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color || entry.fill || '#ccc' }}
                  />
                  <span className="text-gray-600 capitalize">
                    {entry.name === 'revenue' ? 'Doanh thu' :
                     entry.name === 'bookings' ? 'Đặt phòng' :
                     String(entry.name || entry.dataKey)}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {formattedValue}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return null;
};