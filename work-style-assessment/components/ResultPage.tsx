'use client';

import { motion } from 'framer-motion';
import { AssessmentResult } from '@/types';
import { getOverallAssessment } from '@/utils/scoring';
import ScoreBar from './ScoreBar';

interface ResultPageProps {
  result: AssessmentResult;
  onRestart: () => void;
}

export default function ResultPage({ result, onRestart }: ResultPageProps) {
  const assessment = getOverallAssessment(result);

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* 标题 */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            🎉 测评完成
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            以下是您的工作风格画像
          </motion.p>
        </div>

        {/* 综合评价 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📝 综合评价
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {assessment.summary}
          </p>
        </motion.div>

	      {/* 详细评分（精简版，仅数值条形图） */}
	      <motion.div
	        initial={{ opacity: 0, y: 20 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ delay: 0.5 }}
	        className="card mb-8"
	      >
	        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
	          详细评分
	        </h2>
	        <div className="space-y-6">
	          <ScoreBar
	            label="内在能量 & 弹性指数"
	            score={result.energy}
	            maxScore={3}
	            color="bg-green-500"
	            description={result.energyLevel}
	            icon="⚡"
	          />
	          <ScoreBar
	            label="防御性 & 攻击风险指数"
	            score={result.defense}
	            maxScore={12}
	            color="bg-yellow-500"
	            description={result.defenseLevel}
	            icon="🛡️"
	            reverse
	          />
	          <ScoreBar
	            label="团队协作倾向"
	            score={result.collaboration}
	            maxScore={3}
	            minScore={-3}
	            color="bg-blue-500"
	            description={result.collaborationLevel}
	            icon="🤝"
	          />
	        </div>
	      </motion.div>

        {/* 重新测试按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <button onClick={onRestart} className="btn-secondary">
            重新测评
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
