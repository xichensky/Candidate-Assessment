'use client';

import { motion } from 'framer-motion';

interface ScoreBarProps {
  label: string;
  score: number;
  maxScore: number;
  minScore?: number;
  color: string;
  description: string;
  icon: string;
  reverse?: boolean; // 是否反向显示（分数越低越好）
}

export default function ScoreBar({
  label,
  score,
  maxScore,
  minScore = 0,
  color,
  description,
  icon,
  reverse = false,
}: ScoreBarProps) {
  // 计算百分比
  const range = maxScore - minScore;
  const percentage = ((score - minScore) / range) * 100;
  
  // 如果是反向显示，调整颜色强度
  const displayPercentage = reverse ? 100 - percentage : percentage;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{icon}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {label}
          </span>
        </div>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {score} / {maxScore}
          {minScore !== 0 && ` (范围: ${minScore}~${maxScore})`}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`${color} h-3 rounded-full`}
        />
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
