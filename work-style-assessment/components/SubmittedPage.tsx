'use client';

import { motion } from 'framer-motion';

interface SubmittedPageProps {
  candidateName: string;
}

export default function SubmittedPage({ candidateName }: SubmittedPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card max-w-2xl w-full text-center"
      >
        {/* 成功图标 */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* 标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          🎉 提交成功
        </motion.h1>

        {/* 感谢信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            {candidateName}，感谢您完成工作风格测评！
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            您的测评结果已成功提交，我们的团队会尽快审阅。
          </p>
        </motion.div>

        {/* 提示信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                接下来的步骤
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-400">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>我们会对您的测评结果进行综合评估</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>如有需要，我们会通过邮件或电话与您联系</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>请保持通讯畅通，关注后续通知</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 关闭按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            您可以安全地关闭此页面
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
