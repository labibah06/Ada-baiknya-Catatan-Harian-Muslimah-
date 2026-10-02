import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { TrendingUp, Award } from 'lucide-react';
import { DayProgress } from '../services/storageService';

interface WeeklyProgressChartProps {
  data: DayProgress[];
  onSelectDate: (date: string) => void;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  data,
  onSelectDate
}) => {
  // Calculate average of days that have recorded tasks
  const recordedDays = data.filter((d) => d.total > 0);
  const averagePercentage =
    recordedDays.length > 0
      ? Math.round(
          recordedDays.reduce((acc, curr) => acc + curr.percentage, 0) /
            recordedDays.length
        )
      : 0;

  // Custom Tooltip component
  const CustomTooltip = ({
    active,
    payload
  }: {
    active?: boolean;
    payload?: Array<{ payload: DayProgress }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-xs border border-dustyPink-200/90 rounded-xl p-2.5 shadow-md text-xs select-none">
          <p className="font-semibold text-charcoal-800">
            {item.dayLabel}, {item.displayDate}
          </p>
          <div className="mt-1 flex items-center justify-between gap-3 text-dustyPink-700">
            <span>Selesai:</span>
            <span className="font-bold">
              {item.completed} / {item.total}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-charcoal-600">
            <span>Pencapaian:</span>
            <span className="font-bold text-dustyPink-600">
              {item.percentage}%
            </span>
          </div>
          {item.total > 0 && item.completed === item.total && (
            <p className="text-[10px] text-emerald-600 font-medium mt-1">
              ✨ MasyaAllah, sempurna!
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-dustyPink-200/90 rounded-2xl p-4 shadow-xs">
      {/* Title & Insight Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-dustyPink-100 flex items-center justify-center text-dustyPink-600">
            <TrendingUp className="w-3.5 h-3.5" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-charcoal-800">
              Tren Konsistensi 7 Hari
            </h3>
            <p className="text-[11px] text-charcoal-500">
              Grafik progres penyelesaian ibadah
            </p>
          </div>
        </div>

        {recordedDays.length > 0 && (
          <div className="flex items-center gap-1 bg-dustyPink-50 border border-dustyPink-200/70 text-dustyPink-700 px-2.5 py-1 rounded-xl text-xs font-semibold">
            <Award className="w-3 h-3 text-dustyPink-500" />
            <span>Rata-rata: {averagePercentage}%</span>
          </div>
        )}
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-44 w-full -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 10, left: -22, bottom: 0 }}
          >
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={false}
              tick={({ x, y, payload }) => {
                const item = data[payload.index];
                const isSelected = item?.isCurrent;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={12}
                      textAnchor="middle"
                      fill={isSelected ? '#B55B73' : '#6B5F65'}
                      fontSize={11}
                      fontWeight={isSelected ? 700 : 500}
                    >
                      {payload.value}
                    </text>
                    <text
                      x={0}
                      y={0}
                      dy={24}
                      textAnchor="middle"
                      fill={isSelected ? '#B55B73' : '#AFA9AD'}
                      fontSize={9}
                      fontWeight={isSelected ? 600 : 400}
                    >
                      {item ? item.displayDate.split(' ')[0] : ''}
                    </text>
                  </g>
                );
              }}
              interval={0}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#AFA9AD', fontSize: 10 }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FCEBF0', opacity: 0.5, radius: 8 }} />
            <Bar
              dataKey="percentage"
              radius={[6, 6, 2, 2]}
              maxBarSize={32}
              onClick={(entry: any) => {
                const targetDate = entry?.payload?.date || entry?.date;
                if (targetDate) onSelectDate(targetDate);
              }}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isCurrent
                      ? '#B55B73' // Active selected date: DustyPink primary
                      : entry.percentage === 100
                      ? '#10B981' // 100% completed: Emerald
                      : entry.percentage > 0
                      ? '#E58AA6' // Partially completed: Soft Pink
                      : '#F8D6E1' // Empty / 0%: Very light blush
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-dustyPink-100 text-[11px] text-charcoal-500">
        <span className="italic">
          *Ketuk batang grafik untuk membuka tanggal tersebut
        </span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-dustyPink-500 inline-block" />
            <span>Terpilih</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>100%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
