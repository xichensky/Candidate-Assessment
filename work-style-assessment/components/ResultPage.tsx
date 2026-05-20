'use client';

import { motion } from 'framer-motion';
import { AssessmentResult } from '@/types';
import { getOverallAssessment } from '@/utils/scoring';
import RadarChart from './RadarChart';
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

        {/* 雷达图和分数条 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 雷达图 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              工作风格雷达图
            </h2>
            <RadarChart result={result} />
          </motion.div>

          {/* 详细分数 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              详细评分
            </h2>
            <div className="space-y-6">
              <ScoreBar
                label="内在能量 & 弹性指数"
                score={result.energy}
                maxScore={12}
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
        </div>

        {/* 优势与建议 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 优势 */}
          {assessment.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card bg-green-50 dark:bg-green-900/10 border-2 border-green-200 dark:border-green-800"
            >
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4 flex items-center">
                <span className="text-2xl mr-2">✨</span>
                您的优势
              </h3>
              <ul className="space-y-2">
                {assessment.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-green-700 dark:text-green-400 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 建议 */}
          {assessment.suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-200 dark:border-blue-800"
            >
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <span className="text-2xl mr-2">💡</span>
                成长建议
              </h3>
              <ul className="space-y-2">
                {assessment.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="text-blue-700 dark:text-blue-400 flex items-start"
                  >
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

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
