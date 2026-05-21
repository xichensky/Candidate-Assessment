'use client';

import { AssessmentResult } from '@/types';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarChartProps {
  result: AssessmentResult;
}

export default function RadarChart({ result }: RadarChartProps) {
  // 将分数归一化到0-100范围以便更好地展示
  const normalizeScore = (score: number, max: number, min: number = 0) => {
    return ((score - min) / (max - min)) * 100;
  };

  const data = [
    {
      dimension: '内在能量',
      value: normalizeScore(result.energy, 3),
      fullMark: 100,
    },
    {
      dimension: '开放性',
      value: 100 - normalizeScore(result.defense, 12), // 反向，分数越低越好
      fullMark: 100,
    },
    {
      dimension: '团队协作',
      value: normalizeScore(result.collaboration, 3, -3),
      fullMark: 100,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#cbd5e1" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: '#64748b', fontSize: 14 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#94a3b8', fontSize: 12 }}
        />
        <Radar
          name="得分"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          fillOpacity={0.6}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => `${Math.round(value)}分`}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
